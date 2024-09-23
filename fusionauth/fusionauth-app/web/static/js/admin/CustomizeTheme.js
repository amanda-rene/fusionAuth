/*
 * Copyright (c) 2024, FusionAuth, All Rights Reserved
 */
"use strict";

const prebuiltStyles = PrebuiltStyles.prebuiltStyles;

/**
 * Controller class for the simple theme editor.
 *
 * @author Lyle Schemmerling
 */
class CustomizeTheme {

  /** @private {string | null} **/
  _activeTemplate = null;

  /** @private {HTMLElement[]} */
  #colorControls;

  /** @private {HTMLIFrameElement} */
  #iframe;

  /** @private {HTMLElement} */
  #iframeContainer;

  /** @private {{[name: string]: string}} */
  #varNames = {
    fontFamily: '--normal-font',
    monoFontFamily: '--mono-font',
    logoImageURL: '--img-logo',
    logoImageDisplay: '--img-logo-display',
    backgroundImageURL: '--img-background',
  };

  /** @private {HTMLElement} */
  #messagesContainer;

  /** @private {URLSearchParams} */
  #previewParams;

  /** @private {HTMLElement[]} */
  #numericControls;

  /** @private {string} */
  #themeId;

  /** @private {{[key: string]: string}} */
  #themeVars;

  /** @private {HTMLElement} */
  #localizationTable;

  /** @private {HTMLElement} */
  #localizationExpandableTable;

  /** @private {WindowProxy[]} */
  #previewWindows = [];

  /** @private {boolean} */
  #pristine = true;

  /** @private {string} */
  #currentTemplateLsKey;

  /**
   * @param {string[]} categories the template categories on the page
   * @param {URLSearchParams} previewParams the parameters for opening the preview window
   * @param {string} themeId the id of the theme
   */
  constructor(categories, previewParams, themeId) {
    this.#previewParams = previewParams;
    this.#themeId = themeId;

    const simpleThemeVars = document.querySelector('input[name="variables"]').value;

    this.themeVars = simpleThemeVars
        ? JSON.parse(simpleThemeVars)
        : prebuiltStyles.classic;

    this.#iframeContainer = document.querySelector('#iframe-container');
    this.#messagesContainer = document.querySelector('#messages-container');
    this.#colorControls = [...document.querySelectorAll('.color-row')];
    this.#numericControls = [...document.querySelectorAll('.numeric-row')];

    if (this.#themeId) {
      this.#currentTemplateLsKey = `currentTemplate/${this.#themeId}`;
    }

    // on save we post the variables as a string
    document.querySelector('button[title="Save"]').addEventListener('click', event => {
      //event.preventDefault();
      const vars = {...this.themeVars};
      delete vars['logoImageDisplay'];
      document.querySelector('input[name="variables"]').value = JSON.stringify(vars);
    });

    this.editors = {};
    const defaultMessages = Prime.Document.queryFirst('textarea[name="theme.defaultMessages"]');
    if (defaultMessages !== null) {
      this.editors['messages'] = new FusionAuth.UI.TextEditor(defaultMessages)
          .withOptions({
            'mode': 'properties',
            'lint': true,
            'gutters': ['CodeMirror-lint-markers'],
            'lineWrapping': true,
            'readOnly': defaultMessages.isDisabled()
          });
      this.editors['messages'].render().setHeight('100%');
    }

    this.#setUpColorInputs();

    this.#setUpImageControls();

    this.#setUpNumericControls();

    this.#setUpFooterDisplay();

    this.#setupFonts();

    this.#setUpThemeThumbnails();

    this.#redrawTheme();

    this.#setUpMessagesEditors();

    this.#setupBackgroundSize();

    this.#templateChange(this.#currentTemplate);

    this.#setUpTabs();

    this.#setUpSelector();

    this.#setUpAccordions();
  }

  /**
   * @readonly
   * @return {{[p: string]: string}}
   */
  get themeVars() {
    // hoping this encourages using the setter, too, as this object should be frozen. I know, getters, ew...
    return this.#themeVars;
  }

  /**
   * Sets the theme variables and marks the theme as pristine. Selecting a pre-built theme will not trigger a warning.
   * @param newVars
   */
  set themeVars(newVars) {
    // this might be overkill but I really want to know if these vars have been changed so I can check pristine
    const frozen = Object.freeze({...newVars});
    this.#themeVars = frozen;
    this.#pristine = true;
  }

  /**
   * Returns the last used template from local storage or the default template (oauth2Authorize).
   * @return {string|string}
   */
  get #currentTemplate() {
    if (this._activeTemplate) {
      return this._activeTemplate;
    } else if (this.#currentTemplateLsKey && sessionStorage.getItem(this.#currentTemplateLsKey)) {
      return sessionStorage.getItem(this.#currentTemplateLsKey);
    }
    return 'oauth2Authorize';
  }

  /**
   * Sets the current template in session storage if we have a theme id.
   * @param template
   */
  set #currentTemplate(template) {
    this._activeTemplate = template;
    if (this.#currentTemplateLsKey) {
      sessionStorage.setItem(this.#currentTemplateLsKey, template);
    }
  }

  /**
   * Updates the theme variable and marks the theme as dirty. Selecting a pre-built theme will trigger a warning.
   * @param key {string}
   * @param value {string}
   */
  updateThemeVar(key, value) {
    const current = {...this.#themeVars};
    current[key] = value;
    this.themeVars = current;
    this.#pristine = false;
  }

  /**
   * Sets up the click handling for the accordion panels and adjusts tab indices for focusable elements when open or closed.
   */
  #setUpAccordions() {
    document.querySelectorAll('.accordion-panel-header').forEach(elem => {
      const id = elem.dataset.expandOpen;
      const content = Prime.Document.queryById(id);
      const focusableElems = [...content.domElement.querySelectorAll('a, button, input, select, textarea')]
          // the color picker inputs are hidden and should not be focusable
          .filter(e => e.type !== 'color');
      const panel = elem.closest('.accordion-panel');

      elem.addEventListener('click', event => {
        event.preventDefault();

        elem.querySelector('i.fa').classList.toggle('open');

        if (content) {
          new Prime.Effects.SlideOpen(content).toggle();
          if (panel.classList.contains('open')) {
            panel.classList.remove('open');
            elem.setAttribute('aria-expanded', 'false');
            focusableElems.forEach(focusable => focusable.setAttribute('tabindex', '-1'));
          } else {
            panel.classList.add('open');
            elem.setAttribute('aria-expanded', 'true');
            focusableElems.forEach(focusable => focusable.setAttribute('tabindex', '0'));
          }
        }
      });

      if (panel.classList.contains('open')) {
        focusableElems.forEach(focusable => focusable.setAttribute('tabindex', '0'));
      } else {
        focusableElems.forEach(focusable => focusable.setAttribute('tabindex', '-1'));
      }
    });
  }

  #setUpTabs() {
    let setImagesTab = false;

    const tabs = new Prime.Widgets.Tabs(Prime.Document.queryFirst('.vertical-tabs'));

    // this will keep the default on new themes to the prebuilt themes tab
    if (!!this.#themeId) {
      const lsKey = `customize-tabs/${this.#themeId}`;
      tabs.withLocalStorageKey(lsKey);
      if (!sessionStorage.getItem(`customize-tabs/${this.#themeId}`)) {
        // this is an existing theme that this browser has no state for, assume it is themed already
        setImagesTab = true;
      }
    }

    tabs.initialize();

    if (setImagesTab) {
      tabs.selectTab('images');
    }
  }

  /**
   * Sets up the click handling for the template selector and the preview button.
   */
  #setUpSelector() {

    const links = [...document.querySelectorAll('.template-link')];
    links.forEach(link => link.addEventListener('click', event => {
      event.preventDefault();

      // with the start here section there may be two links that match the template name, we need to turn the others off and turn this one on
      const inactives = links.filter(other => other.dataset.template !== link.dataset.template);
      inactives.forEach(inactive => inactive.classList.remove('active'));

      const actives = links.filter(other => other.dataset.template === link.dataset.template);
      actives.forEach(active => active.classList.add('active'));

      this.#templateChange(link.dataset.template);
    }));

    // set the initial active state and open the first panel it appears in
    const actives = links.filter(link => link.dataset.template === this.#currentTemplate);
    if (actives) {
      actives.forEach(active => active.classList.add('active'));

      const first = actives[0];
      first.closest('.accordion-panel-content').classList.add('open');
      const panel = first.closest('.accordion-panel');
      panel.classList.add('open')
      panel.querySelector('.accordion-arrow').classList.add('open');
    }

    // when we open a new preview window, we need to apply the current theme vars to it that are not saved to the database
    document.getElementById('open-preview-button')
            .addEventListener('click', async _ => {
              // call the preview action for the html, set the style, and hold it
              const html = await this.#fetchPreviewContent(this.#currentTemplate);
              const win = window.open();

              win.document.write(html);
              win.document.close();
              this.#applyThemeVars(win.document);
              this.#previewWindows.push(win);

              // remove it when it closes
              win.onclose = () => {
                const idx = this.#previewWindows.indexOf(win);
                if (idx > -1) {
                  this.#previewWindows.splice(idx, 1);
                }
              };
            });
  }

  /**
   * Returns the preview iframe and any open preview windows.
   * @return {Document[]|*[]}
   */
  #getStyleTargets() {
    if (this.#iframe) {
      return [this.#iframe.contentDocument, ...this.#previewWindows.map(win => win.document)];
    } else {
      return [];
    }
  }

  /**
   * Sets up the control for the background size selector
   */
  #setupBackgroundSize() {
    const selector = document.getElementById('backgroundSizeSelector');
    selector.addEventListener('change', event => {
      const value = event.target.value;
      this.updateThemeVar('backgroundSize', value);
      this.#getStyleTargets()
          .forEach(target => {
            if (value === 'repeat') {
              target.documentElement.style.setProperty('--background-size', 'auto');
              target.documentElement.style.setProperty('--background-repeat', 'repeat');
            } else if (value === 'cover') {
              target.documentElement.style.setProperty('--background-size', 'cover');
              target.documentElement.style.setProperty('--background-repeat', 'no-repeat');
            } else {
              target.documentElement.style.setProperty('--background-size', 'contain');
              target.documentElement.style.setProperty('--background-repeat', 'no-repeat');
            }
          });
    });

    //set the initial value
    const options = selector.querySelectorAll('option');
    if (this.themeVars['backgroundSize']) {
      [...options].find(opt => opt.value === this.themeVars['backgroundSize']).selected = true;
    }
  }

  /**
   * Sets up the font selector controls.
   */
  #setupFonts() {
    document.querySelectorAll('.font-selector').forEach(elem => {
      const {name, variable} = elem.dataset;

      this.#varNames[name] = variable;

      const options = [...elem.querySelectorAll('option')];
      const customInput = document.querySelector(`#custom-font-${name}-input`);
      const customContainer = document.querySelector(`#custom-font-${name}-container`);
      const firstFont = this.themeVars[name];

      // Grabs the first font from the font family list and treats that as the value of the selector.
      const matches = firstFont.match(/^"?([^",]+)"?,?/);
      if (matches) {
        const fontName = matches[1];
        const matchingFont = options.find(opt => opt.value === fontName);
        if (matchingFont) {
          matchingFont.selected = true;
        } else {
          // if this is not one of our pre-defined options treat this as a custom input, and show the input box
          options.find(opt => opt.value === 'Custom').selected = true;
          document.querySelector(`#custom-font-${name}-input`).value = firstFont;
          customContainer.classList.add('open');
        }
      }

      // handler for the custom font
      const customListener = event => {
        const targetFont = event.target.value;
        if (this.themeVars[name] !== targetFont) {
          this.updateThemeVar(name, targetFont);
        }

        this.#getStyleTargets()
            .forEach(target => {
              target.documentElement.style.setProperty(variable, this.themeVars[name]);
            });
      };

      elem.addEventListener('change', event => {
        let targetFont;

        if (event.target.value === 'Custom') {
          customContainer.classList.add('open');
          customInput.addEventListener('input', customListener);
          return;
        } else {
          customContainer.classList.remove('open');
          customInput.removeEventListener('input', customListener);
          customInput.value = '';
        }

        // take the value of the selector and set it as the first value in the font-family list
        if (event.target.dataset.mono === "true") {
          targetFont = '"' + event.target.value + '", ui-monospace, "Courier New", monospace';
        } else if (event.target.dataset.fontType === "serif") {
          targetFont = '"' + event.target.value + '", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
        } else {
          targetFont = '"' + event.target.value + '", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
        }

        if (this.themeVars[name] !== targetFont) {
          this.updateThemeVar(name, targetFont);
        }

        // applies to all open preview windows
        this.#getStyleTargets()
            .forEach(target => {
              target.documentElement && target.documentElement.style.setProperty(variable, this.themeVars[name]);
            });
      });
    });
  }

  /**
   * multiply the value of the slider input by the scale value
   * @param value {string}
   * @param scale {string|number}
   * @return {string}
   */
  #sliderMath(value, scale) {
    const scaleVal = scale ? Number(scale) : 1;
    return ((Number(value) / 100) * scaleVal).toFixed(2);
  }

  /**
   * Applies the numeric value to the style targets and updates the theme variable.
   * @param name {string}
   * @param variable {string}
   * @param value {string}
   */
  #setNumericVar(name, variable, value) {
    this.#getStyleTargets().forEach(target => {
      target.documentElement.style.setProperty(variable, value, 'important');
    });
    this.updateThemeVar(name, value);
  }

  /**
   * Sets up the color input controls.
   */
  #setUpColorInputs() {

    this.#colorControls.forEach(wrapper => {
      const name = wrapper.dataset.name;
      const ctrl = document.getElementById(`${name}-selector`);
      const input = wrapper.querySelector(`#${name}`);
      const display = wrapper.querySelector('span.icon');
      const variable = wrapper.dataset.variable;
      const focusVariable = wrapper.dataset.focusVariable;

      this.#varNames[name] = variable;

      display.addEventListener('click', () => ctrl.click());
      input.value = this.#themeVars[name];
      ctrl.value = this.#themeVars[name];

      // handles new values from either the color picker or the input box
      [ctrl, input].forEach(elem => {
        elem.addEventListener('input', event => {
          const hex = event.target.value;
          display.style.backgroundColor = hex;
          input.value = hex;
          this.#getStyleTargets().forEach(target => target.documentElement.style.setProperty(variable, hex));
          this.updateThemeVar(name, hex);

          // focus vars are not shown to the user, we auto darken and set it for them
          if (focusVariable) {
            const focusVariableName = wrapper.dataset.focusVariableName;
            const darkHex = this.#darkenHex(hex, 0.8);
            this.#getStyleTargets().forEach(target => target.documentElement.style.setProperty(focusVariable, darkHex));
            this.updateThemeVar(focusVariableName, darkHex);
          }
        });
      });

      // set up adding the red outlines to the elements on the preview windows that the color applies to on hover
      const getTargetElements = (styleVariable, apply) => {

        this.#getStyleTargets().forEach(target => {
          const selectors = [];
          const sheet = [...target.styleSheets].find(sheet => !!sheet.href && sheet.href.includes('simple-theme.css'));
          const rules = [...sheet.cssRules];

          // we are taking the rules from the simple-theme.css file and finding the selectors that use the style variable
          rules.forEach(bodyRule => {
            for (let style in bodyRule.style) {
              try {
                if (bodyRule.styleMap.get(style) != null && bodyRule.styleMap.get(style).toString().includes(styleVariable)) {
                  selectors.push(bodyRule.selectorText);
                }
              } catch (e) {
                // ignore
              }
            }
          });

          selectors.forEach(selector => {
            target.documentElement.querySelectorAll(selector).forEach(elem => apply(elem));
          });
        });
      }

      // adds the red outline on hover, removes it on hover out
      if (variable) {
        display.addEventListener('mouseenter', _ => {
          getTargetElements(variable, elem => {
            // best effort at ensuring that the element we are targeting is the one we want to highlight
            // only highlight if the color or background-color matches the variable color
            const style = window.getComputedStyle(elem);
            const color = style.getPropertyValue('color');
            const backgroundColor = style.getPropertyValue('background-color');
            const targetRgb = this.#hexToRGBCss(this.themeVars[name]);

            if ([color, backgroundColor].includes(targetRgb)) {
              elem.classList.add('outlineHover');
            }
          });
        });

        display.addEventListener('mouseleave', _ => {
          getTargetElements(variable, elem => elem.classList.remove('outlineHover'));
        });
      }
    });
  }

  /**
   * Sets up the image input controls.
   */
  #setUpImageControls() {
    // the logo image has its own container in the template that needs to show or hide depending on if the url is present
    const logoURLInput = document.querySelector('#logoImageURLInput');

    const updateLogoValue = (logoURL) => {
      if (logoURL) {
        this.updateThemeVar('logoImageURL', logoURL);

        // size isn't required until you add a url
        const size = document.getElementById('logoImageSizeInput').value;
        this.updateThemeVar('logoImageSize', size);

        this.#getStyleTargets().forEach(target => {
          target.documentElement.style.setProperty(this.#varNames['logoImageURL'], `url('${this.themeVars['logoImageURL']}')`);
          target.documentElement.style.setProperty('--img-logo-display', 'flex');
        });
      } else {
        this.updateThemeVar('logoImageURL', undefined);
        this.#getStyleTargets().forEach(target => {
          target.documentElement.style.setProperty(this.#varNames['logoImageURL'], undefined);
          target.documentElement.style.setProperty('--img-logo-display', 'none');
        });
      }
    }

    logoURLInput.addEventListener('input', (event) => {
      const logoURL = event.target.value;
      updateLogoValue(logoURL);
    });

    const clearLogoURLInput = document.querySelector('#clear-logoImageURL');
    clearLogoURLInput.addEventListener('click', _ => {
      logoURLInput.value = '';
      logoURLInput.dispatchEvent(new Event("input"));
    });

    const backgroundURLInput = document.querySelector('#backgroundImageURLInput');
    backgroundURLInput.addEventListener('input', (event) => {
      const backgroundURL = event.target.value;
      if (backgroundURL) {
        this.updateThemeVar('backgroundImageURL', backgroundURL);
        if (!this.themeVars['backgroundSize']) {

          // size isn't required until you add a url
          const size = [...document.getElementById('backgroundSizeSelector').querySelectorAll('option')]
              .find(opt => opt.selected).value;
          this.updateThemeVar('backgroundSize', size);
        }
      } else {
        this.updateThemeVar('backgroundImageURL', undefined);
      }
      this.#getStyleTargets()
          .forEach(target => {
            if (!this.themeVars['backgroundImageURL']) {
              target.documentElement.style.removeProperty(this.#varNames['backgroundImageURL']);
            } else {
              target.documentElement.style.setProperty(this.#varNames['backgroundImageURL'], `url('${this.themeVars['backgroundImageURL']}')`);
            }
          });
    });

    const clearBackgroundURLInput = document.querySelector('#clear-backgroundImageURL');
    clearBackgroundURLInput.addEventListener('click', _ => {
      backgroundURLInput.value = '';
      backgroundURLInput.dispatchEvent(new Event("input"));
    });
  }

  /**
   * Sets up the numeric input controls.
   */
  #setUpNumericControls() {
    this.#numericControls.forEach(wrapper => {
      const {name, variable, scale} = wrapper.dataset;

      this.#varNames[name] = variable;

      const slider = wrapper.querySelector('input[type="range"]');
      const input = wrapper.querySelector('.numeric-input');

      // the slider has a range of 0 to 1, which we interpret to rem and multiply by the scale value if defined
      slider.addEventListener('input', (event) => {
        const remval = `${this.#sliderMath(event.target.value, scale)}rem`;
        input.value = remval;
        this.#setNumericVar(name, variable, remval);
      });

      // or handle the value from the input box
      input.addEventListener('input', event => {
        this.#setNumericVar(name, variable, event.target.value);
      });

      if (!this.themeVars[name]) {
        // this was an optional value, grab the default from the slider
        const current = slider.value;
        input.value = `${this.#sliderMath(current, scale)}rem`;
      } else {
        // set the initial from the theme
        input.value = this.themeVars[name];
        const currentRem = this.themeVars[name]
            .replace('rem', '')
            .replace('px', '')
            .replace('em', '');

        const multiplier = scale ? Number(scale) : 1;
        slider.value = (Number(currentRem) / multiplier) * 100;
      }
    });
  }

  /**
   * Sets up the footer display control controls.
   */
  #setUpFooterDisplay() {
    const showFooter = (show) => this.#getStyleTargets()
                                     .forEach(target => target.documentElement.style.setProperty('--footer-display', show ? "flex" : "none"));

    // may ore may not even be there on the page
    const footerToggle = document.getElementById('footerDisplayToggle');
    if (footerToggle) {
      footerToggle.addEventListener('change', _ => {
        showFooter(footerToggle.checked);
        this.updateThemeVar('footerDisplay', footerToggle.checked);
      });

      // initial value
      footerToggle.checked = this.themeVars['footerDisplay'];
    }
  }

  /**
   * Handles the opening of the message dialog. Uses the AJAXDialog from Prime.Widgets.
   * @param primeDialog
   * @param messages
   * @param locale
   */
  #onMessageDialogOpen(primeDialog, messages, locale) {
    const dialogElement = primeDialog.element.domElement;

    const textarea = dialogElement.querySelector('#customMessages');
    textarea.value = messages || '';
    new FusionAuth.UI.TextEditor(textarea)
        .withOptions({
          'mode': 'properties',
          'lint': true,
          'gutters': ['CodeMirror-lint-markers'],
          'lineWrapping': true,
          'readOnly': false
        })
        .render()
        .setHeight(175);

    if (locale) {
      const select = dialogElement.querySelector('select');
      if (select) {
        [...select.options].find(opt => opt.value === locale).selected = true;
      }
    }

    primeDialog.editor = new FusionAuth.UI.TextEditor(dialogElement.querySelector('textarea'))
        .withOptions({
          'mode': 'properties',
          'lint': true,
          'gutters': ['CodeMirror-lint-markers'],
          'lineWrapping': true,
          'readOnly': true
        })
        .render()
        .setHeight(175);

    const overrideElem = dialogElement.querySelector('input[name=overrideLines]');
    let overrides = [];
    if (overrideElem && overrideElem.value) {
      overrides = JSON.parse(overrideElem.value);
    }

    overrides.forEach(override => {
      // Adds the override highlight class to the override lines. Not sure how codemirror is doing this line number math but whatever.
      primeDialog.editor.editor.markText({line: override - 1}, {line: override}, {className: 'override'});
    });

    primeDialog.editor.refresh();
  }

  #onMessageDialogPreSubmit(primeDialog) {
    primeDialog.editor && primeDialog.editor.sync();
  }

  /**
   * Handles the submission of the message dialog. Updates the table and the hidden form fields.
   * @param primeDialog
   */
  #onMessageDialogSuccess(primeDialog) {
    const dialogElement = primeDialog.element.domElement;

    const form = dialogElement.querySelector('form');
    const data = {};
    const select = form.querySelector('select');
    if (select) {
      const option = [...select.options].filter(opt => opt.selected)[0];
      data.localeDisplay = option.text;
      data.locale = option.value;
    }
    data.isDefault = form.querySelector('input[name=isDefault]').value === 'true';
    data.messages = form.querySelector('#customMessages').value;

    let row;
    if (data.isDefault) {
      row = this.#localizationTable.querySelector('tr[data-is-default=true]');
    } else {
      row = [...this.#localizationTable.querySelectorAll('tbody tr')].find(r => r.dataset.locale === data.locale);
    }

    if (!row) {
      const added = this.#localizationExpandableTable.addRow(data);
      row = added.domElement;
      row.querySelector('a:first-of-type')
         .addEventListener('click', event => this.#openEditDialog(event));
    }

    // it looks like this does nothing, but it is setting the updated values on the dom
    let dataSet = row.dataset;
    dataSet.isDefault = data.isDefault;
    dataSet.locale = data.locale;
    dataSet.messages = data.messages;

    if (data.isDefault) {
      document.getElementById('theme.defaultMessages').value = data.messages;
    } else {
      document.getElementById(`theme.localizedMessages${data.locale}`).value = data.messages;
    }

    // Finally close the dialog
    primeDialog.close();

    // if there are new messages update them.
    this.#templateChange(this.#currentTemplate);
  }

  #setUpMessagesEditors() {
    const addLocalizationButton = document.getElementById('add-localization');
    if (addLocalizationButton) {
      addLocalizationButton.addEventListener('click', event => this.#openEditDialog(event));

      this.#localizationTable = document.getElementById('localization-table');
      if (this.#localizationTable) {
        this.#localizationExpandableTable = new FusionAuth.UI.ExpandableTable(Prime.Document.Element.wrap(this.#localizationTable));
        this.#localizationTable.querySelectorAll('td.action a:first-of-type')
            .forEach(elem => elem.addEventListener('click', event => this.#openEditDialog(event)));
      }
    }

  }

  #openEditDialog(event) {
    event.preventDefault();

    // the ajax dialog would like you to submit "this" form, but I don't want to do that because it will send the wrong stuff
    // so fake it and send the csrf token along
    const dummyForm = document.createElement('form');
    const csrfToken = document.querySelector('input[name="csrfToken"]').value;

    const row = event.target.parentElement.parentElement;
    const defaultOverrides = row.dataset.isDefault === 'true'
        ? ''
        : document.querySelector('input[name="theme.defaultMessages"]').value;

    new Prime.Widgets.AJAXDialog()
        .withCallback(dialog => this.#onMessageDialogOpen(dialog, row.dataset.messages, row.dataset.locale))
        .withAdditionalClasses('wide')
        .withFormHandling(true)
        .withFormPreSubmitCallback(this.#onMessageDialogPreSubmit.bind(this))
        .withFormSuccessCallback(this.#onMessageDialogSuccess.bind(this))
        .openPost(event.target.href, dummyForm, {defaultOverrides, csrfToken});
  }

  /**
   * Creates the pre-built theme thumbnails, which are web components with the theme vars applied
   */
  #setUpThemeThumbnails() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_components
    customElements.define('theme-thumbnail', class extends HTMLElement {
      static observedAttributes = ['theme'];
      #shadow;

      constructor() {
        super();

        const template = document.getElementById('theme-thumbnail-template');
        const templateContent = template.content;
        this.#shadow = this.attachShadow({mode: 'open'});
        this.#shadow.appendChild(templateContent.cloneNode(true));
      }

      attributeChangedCallback(attr) {
        if (attr === 'theme') {
          const themeName = this.getAttribute('theme');
          this.#shadow.querySelector('p[class="theme-name"]').innerText = themeName[0].toUpperCase() + themeName.slice(1);
          const theme = prebuiltStyles[themeName];
          this.#shadow.querySelector('.content-window').style.backgroundColor = theme['pageBackgroundColor'];
          const card = this.#shadow.querySelector('.card');
          card.style.backgroundColor = theme['panelBackgroundColor'];
          card.style.borderTopLeftRadius = theme['borderRadius'];
          this.#shadow.querySelector('.primary-letter').style.color = theme['fontColor'];
          this.#shadow.querySelector('.secondary-letter').style.color = theme['linkTextColor'];
          this.#shadow.querySelector('.top-color').style.borderColor = theme['primaryButtonColor'];
          this.#shadow.querySelector('.middle-color').style.borderColor = theme['linkTextFocusColor'];
          this.#shadow.querySelector('.bottom-color').style.borderColor = theme['deleteButtonColor'];
          this.#shadow.querySelectorAll('.color-box').forEach(target => {
            target.style.borderRadius = theme['borderRadius'];
          });
        }
      }
    });

    const picker = document.querySelector('#theme-picker');
    Object.keys(prebuiltStyles).forEach(themeName => {
      const thumbnail = document.createElement('theme-thumbnail');
      thumbnail.setAttribute('theme', themeName);

      thumbnail.addEventListener('click', () => {
        // if the editor has changed theme vars we need to confirm the pre-built as it will wipe those changes
        if (!this.#pristine) {
          const confirmDialog = document.getElementById('confirm-theme-change-dialog');
          const confirm = document.getElementById('confirm-theme-change');
          const widget = new Prime.Widgets.HTMLDialog(confirmDialog);

          const handleConfirmClick = event => {
            event.preventDefault();
            event.stopPropagation();

            this.themeVars = prebuiltStyles[themeName];
            this.#redrawTheme();

            confirm.removeEventListener('click', handleConfirmClick);
            widget.close();
          }
          confirm.addEventListener('click', handleConfirmClick);

          widget.initialize()
                .withCloseButtonElementSelector('a[data-dialog-role=close-button]')
                .open();
        } else {
          this.themeVars = prebuiltStyles[themeName];
          this.#redrawTheme();
        }
      });

      picker.appendChild(thumbnail);
    });
  }

  /**
   * Update style control values to reflect the current theme variable values
   */
  #redrawTheme() {
    this.#colorControls.forEach(ctrl => {
      const name = ctrl.dataset.name;
      const hex = this.themeVars[name];
      const display = ctrl.querySelector('span.icon');
      display.style.backgroundColor = hex;
    });

    const logoURL = document.querySelector('#logoImageURLInput');
    logoURL.value = (this.themeVars['logoImageURL'] && this.themeVars['logoImageURL'] !== "") ? this.themeVars['logoImageURL'] : "";

    const backgroundURL = document.querySelector('#backgroundImageURLInput');
    backgroundURL.value = (this.themeVars['backgroundImageURL'] && this.themeVars['backgroundImageURL'] !== "") ? this.themeVars['backgroundImageURL'] : "";

    this.#updateIFrame();
  }

  /**
   * Sets the current theme vars on the preview window.
   */
  #updateIFrame() {
    if (this.#iframe) {
      this.#applyThemeVars(this.#iframe.contentDocument);
    }
  }

  /**
   * Applies the theme vars to the target
   * @param target {{documentElement: HTMLElement}}
   */
  #applyThemeVars(target) {
    // check for all the vars that we have
    Object.entries(this.themeVars)
          .forEach(([varKey, varValue]) => {
            const toSet = [];

            if (varKey === 'logoImageURL') {
              if (varValue) {
                varValue = `url('${varValue}')`
                toSet.push({key: this.#varNames.logoImageURL, val: varValue});
                toSet.push({key: '--img-logo-display', val: 'flex'});
              } else {
                return;
              }
            } else if (varKey === 'backgroundImageURL') {
              if (varValue) {
                varValue = `url('${varValue}')`;
                toSet.push({key: this.#varNames.backgroundImageURL, val: varValue});
              } else {
                return;
              }
            } else if (varKey === 'backgroundSize') {
              if (varValue === 'repeat') {
                toSet.push({key: '--background-size', val: 'auto'});
                toSet.push({key: '--background-repeat', val: 'repeat'});
              } else if (varValue === 'cover') {
                toSet.push({key: '--background-size', val: 'cover'});
                toSet.push({key: '--background-repeat', val: 'no-repeat'});
              } else {
                toSet.push({key: '--background-size', val: 'contain'});
                toSet.push({key: '--background-repeat', val: 'no-repeat'});
              }
            } else if (varKey === 'footerDisplay') {
              toSet.push({key: '--footer-display', val: varValue ? 'flex' : 'none'});
            } else {
              toSet.push({key: this.#varNames[varKey], val: varValue});
            }

            toSet.forEach(({key, val}) => target.documentElement.style.setProperty(key, val));
          });

    // check for some values we don't have
    if (!this.themeVars['logoImageURL']) {
      target.documentElement.style.setProperty('--img-logo-display', 'none');
    }
    if (!this.themeVars['backgroundImageURL']) {
      target.documentElement.style.removeProperty(this.#varNames.backgroundImageURL);
    }
  }

  /**
   * Makes a fetch call to get the page preview content.
   *
   * @param template the template to render
   * @return {Promise<string>} the html as a string
   */
  async #fetchPreviewContent(template) {
    this.#previewParams.set('template', template);

    const url = `/admin/theme/preview?${this.#previewParams}`;

    let messageControl = document.getElementById('theme.defaultMessages');
    if (!messageControl) {
      // if the input isn't there we are in the default theme, they are on the textarea
      messageControl = document.querySelector('textarea[name="theme.defaultMessages"]');
    }

    const messages = messageControl.value;
    const csrf = document.querySelector('input[name="csrfToken"]').value;

    const formParts = [
      encodeURIComponent('defaultMessages') + '=' + encodeURIComponent(messages),
      encodeURIComponent('csrfToken') + '=' + encodeURIComponent(csrf),
    ];

    const localeTable = document.getElementById('localization-table');
    if (localeTable) {
      // add the locales to the form post if they exist
      [...localeTable.querySelectorAll('tr')]
          .filter(row => {
            return row.dataset.isDefault === 'false';
          })
          .map(row => row.querySelector('input'))
          .map(input => encodeURIComponent(input.name.replace('theme.', '')) + '=' + encodeURIComponent(input.value))
          .forEach(part => formParts.push(part));
    }

    const body = formParts.join('&');

    const resp = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body,
    });
    return await resp.text();
  }

  /**
   * Updates the iframe with the new template and sets the current styles.
   *
   * @param {string} template
   */
  async #templateChange(template) {

    this.#currentTemplate = template;

    const iframe = document.createElement('iframe');
    iframe.onload = () => {
      // we're manually setting up all the styles, so we should drop the vars added by default.
      iframe.contentDocument.querySelectorAll('style')
            .forEach(elem => elem.remove());
      this.#updateIFrame();
    }

    iframe.srcdoc = await this.#fetchPreviewContent(template);

    iframe.style.display = 'block';
    iframe.style.width = '100%';
    iframe.style.minHeight = '500px';
    iframe.style.height = 'calc(100vh - 40vh)';
    iframe.style.border = '1px solid #bfbfbf';

    if (this.#iframeContainer.childNodes) {
      this.#iframeContainer.childNodes.forEach(node => this.#iframeContainer.removeChild(node));
    }
    this.#iframeContainer.appendChild(iframe);
    this.#iframe = iframe;

    document.querySelectorAll('.template-listing').forEach(elem =>
        elem.dataset.template === template
            ? elem.classList.add('selected')
            : elem.classList.remove('selected')
    )
  }

  /**
   * Takes a hex color and a percentage and darkens the color. Used for focus variables.
   * @param {string} color to darken
   * @param {number} percent the amount to adjust the color
   * @return {string} the darkened color
   */
  #darkenHex(color, percent) {
    const [R, G, B] = this.#hexToRGB(color)
                          .map(mappedColor => parseInt(mappedColor * percent))
                          .map(darkenedColor => darkenedColor < 255 ? darkenedColor : 255)
                          .map(color => Math.round(color))
                          .map(rounded => (rounded.toString(16).length === 1) ? "0" + rounded.toString(16) : rounded.toString(16));

    return "#" + R + G + B;
  }

  /**
   * Takes a hex color and returns an array of [r, g, b]
   * @return {number[]}
   */
  #hexToRGB(color) {
    const rgbIdxs = [
      [1, 3],
      [3, 5],
      [5, 7]
    ];
    return rgbIdxs.map(idxPair => parseInt(color.substring(idxPair[0], idxPair[1]), 16));
  }

  /**
   * hex to rgb css string
   * @param color hex
   * @return {string} rgb(x, x, x)
   */
  #hexToRGBCss(color) {
    const [R, G, B] = this.#hexToRGB(color);
    return `rgb(${R}, ${G}, ${B})`;
  }
}

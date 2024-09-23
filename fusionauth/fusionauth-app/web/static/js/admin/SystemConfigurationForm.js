/*
 * Copyright (c) 2018-2024, FusionAuth, All Rights Reserved
 */
'use strict';

var FusionAuth = FusionAuth || {};
FusionAuth.Admin = FusionAuth.Admin || {};

/**
 * Handles the system configuration form.
 *
 * @constructor
 */
FusionAuth.Admin.SystemConfigurationForm = function() {
  Prime.Utils.bindAll(this);

  this.trustedProxies = null;

  new Prime.Widgets.Tabs(Prime.Document.queryById('tabs'))
      .withErrorClassHandling('error')
      .withSelectCallback(this._handleTabSelect)
      .withLocalStorageKey('system-configuration.tabs')
      .initialize();

  // Initialize the allowed origins etc
  var corsAllowedOrigins = Prime.Document.queryById('cors-allowed-origins');
  new Prime.Widgets.MultipleSelect(corsAllowedOrigins)
      .withCustomAddLabel(corsAllowedOrigins.getDataAttribute('corsAllowedOriginsAddLabel'))
      .withPlaceholder('')
      .withRemoveIcon('')
      .initialize();

  var corsAllowedHeaders = Prime.Document.queryById('cors-allowed-headers');
  new Prime.Widgets.MultipleSelect(corsAllowedHeaders)
      .withCustomAddLabel(corsAllowedHeaders.getDataAttribute('corsAllowedHeadersAddLabel'))
      .withPlaceholder('')
      .withRemoveIcon('')
      .initialize();

  var corsExposedHeaders = Prime.Document.queryById('cors-exposed-headers');
  new Prime.Widgets.MultipleSelect(corsExposedHeaders)
      .withCustomAddLabel(corsExposedHeaders.getDataAttribute('corsExposedHeadersAddLabel'))
      .withPlaceholder('')
      .withRemoveIcon('')
      .initialize();

  // Use the native color picker
  [['header', '#253031'], ['menu-font', '#ffffff']].forEach(([prefix, defaultColor]) => {
    const colorInput = document.querySelector(`#${prefix}-color-selector`);
    const swatch = document.querySelector(`#${prefix}-color-form-row span.icon`);
    const textInput = document.querySelector(`#${prefix}-color`);

    // Ensure we set both the swatch and the color picker to the current value, or the default.
    if (textInput.value) {
      let value = textInput.value;
      if (!value.startsWith('#')) {
        value = `#${value}`;
        textInput.value = value;
      }
      swatch.style.backgroundColor = value;
      colorInput.value = value;
    } else {
      colorInput.value = defaultColor;
      swatch.style.backgroundColor = defaultColor;
    }

    swatch.addEventListener('click', () => colorInput.click());

    colorInput.addEventListener('input', event => {
      const hex = event.target.value;
      textInput.value = event.target.value;
      swatch.style.backgroundColor = hex;
    });

    textInput.addEventListener('input', event => {
      if (event.target.value) {
        swatch.style.backgroundColor = `#${event.target.value}`;
      } else {
        // Set back to default, picker and swatch
        swatch.style.backgroundColor = defaultColor;
        colorInput.value = defaultColor;
      }
    });
  });
};

FusionAuth.Admin.SystemConfigurationForm.prototype = {

  /* ===================================================================================================================
   * Private methods
   * ===================================================================================================================*/

  _handleTabSelect: function(tab, tabContent) {
    if (tabContent.getId() === 'network-settings') {
      var textarea = Prime.Document.queryFirst('textarea[name="trustedProxies"]');
      if (this.trustedProxies === null) {
        this.trustedProxies = new FusionAuth.UI.TextEditor(textarea)
            .withOptions({
              'mode': 'properties',
              'lineNumbers': true
            })
            .render()
            .setHeight(200);
      }
    }
  }
};

[#ftl/]
[#-- @ftlvariable name="baseThemeId" type="java.util.UUID" --]
[#-- @ftlvariable name="themeId" type="java.util.UUID" --]
[#-- @ftlvariable name="sourceThemeId" type="java.util.UUID" --]
[#-- @ftlvariable name="isBaseTheme" type="boolean" --]
[#-- @ftlvariable name="isLicensed" type="boolean" --]
[#-- @ftlvariable name="existingTheme" type="boolean" --]
[#-- @ftlvariable name="templateCategoryMap" type="java.util.Map<String, Map<String, String>>" --]
[#-- @ftlvariable name="numericVars" type="io.fusionauth.app.service.theme.variables.NumericVar[]" --]
[#-- @ftlvariable name="colorVars" type="io.fusionauth.app.service.theme.variables.ColorVar[]" --]
[#-- @ftlvariable name="fontVars" type="io.fusionauth.app.service.theme.variables.FontVar[]" --]
[#-- @ftlvariable name="applicationId" type="java.util.UUID" --]
[#-- @ftlvariable name="hasDomainBasedIdentityProviders" type="boolean" --]
[#-- @ftlvariable name="showPasswordField" type="boolean" --]
[#-- @ftlvariable name="showPasswordValidationRules" type="boolean" --]
[#-- @ftlvariable name="method" type="java.lang.String" --]
[#-- @ftlvariable name="theme" type="io.fusionauth.domain.Theme" --]
[#-- @ftlvariable name="userCodeLength" type="int" --]
[#-- @ftlvariable name="categoryOrder" type="java.lang.String" --]

[#import "../../_utils/dialog.ftl" as dialog/]
[#import "../../_utils/helpers.ftl" as helpers/]
[#import "../../_utils/button.ftl" as button/]
[#import "../../_layouts/admin.ftl" as layout/]
[#import "../../_utils/panel.ftl" as panel/]
[#import "../../_utils/message.ftl" as message/]
[#import "_macros.ftl" as themeMacros/]

[@layout.html]
  [@layout.head]
    <script src="${request.contextPath}/js/admin/PrebuiltStyles.js?version=${version}"></script>
    <script src="${request.contextPath}/js/admin/CustomizeTheme.js?version=${version}"></script>
    <script>
      Prime.Document.onReady(() => {

        [#-- When constructing the preview we want the source messages to be displayed. If the themeId exists this is an existing theme.--]
        [#if themeId?? && existingTheme]
          [#assign previewId = themeId /]
        [#-- When sourceThemeId exists we are doing a copy. --]
        [#elseif sourceThemeId??]
          [#assign previewId = sourceThemeId /]
        [#-- Otherwise show the default messages. --]
        [#else]
          [#assign previewId = baseThemeId /]
        [/#if]

        const previewParams = new URLSearchParams();
        previewParams.set('themeId', '${previewId}');
        previewParams.set('hasDomainBasedIdentityProviders', 'false');
        previewParams.set('method', '${method}');
        previewParams.set('showPasswordField', 'true');
        previewParams.set('showPasswordValidationRules', 'false');
        previewParams.set('showCaptcha', 'false');
        previewParams.set('step', '0');
        previewParams.set('userCodeLength','6');
        previewParams.set('showAlerts','true');

        const categories = [[#list templateCategoryMap?keys as category]"${category}"[#if !category?is_last],[/#if][/#list]];
        const themeId = "${themeId!''}";

        new CustomizeTheme(categories, previewParams, themeId);
      });
    </script>
    <link rel="stylesheet" href="/css/theme-editor.css?version=${version}"/>
  [/@layout.head]

  [@layout.body bodyClass="app-sidebar-closed"]
    [#if themeId??]
      [#assign route = "customize/${themeId}"/]
    [#else]
      [#assign route = "customize" /]
    [/#if]

    [#assign idEditable = helpers.anyFieldHasErrors(["themeId"]) || !(themeId??)/]

    [@layout.pageForm action=route method="POST" id="customize-form" panelTitleKey="" cancelURI="/admin/theme/"  breadcrumbs={"": "customizations", "/admin/theme/": "themes", "/admin/theme/" + route : "customize"}]
      <fieldset>
        [@control.text name="themeId" disabled=(!idEditable) tooltip=function.message('{tooltip}readOnly')/]
        [@control.text name="theme.name" autocapitalize="on" autocomplete="on" autocorrect="on" autofocus="autofocus" required=true tooltip=function.message('{tooltip}theme.name')/]
        <input type="hidden" name="variables" value="${variables!''}" />
        <input type="hidden" name="applicationId" value="${applicationId}" />
        <input type="hidden" name="existingTheme" value="${existingTheme?string}" />
      </fieldset>
      <fieldset class="mt-4">
        <legend>[@message.print key="theme-editor"/]</legend>
        [#if isBaseTheme]
          [@message.alertColumn message=message.inline('{description}fusionAuthTheme') type="warning" icon="exclamation-triangle" includeDismissButton=false columnClass="tight-left col-xs"/]
        [/#if]
        <div class="row">
          <div class="section-selector col-xs-1 col-md-1 col-lg-1 col-xl-2">
            <ul class="vertical-tabs">
              [@themeMacros.sideNavRow key="themes" activeImage="pre-built-colored-blue.svg" inactiveImage="pre-built.svg" /]
              [@themeMacros.sideNavRow key="images" activeImage="brand-colored-blue.svg" inactiveImage="brand.svg" /]
              [@themeMacros.sideNavRow key="styles" activeImage="styles-colored-blue.svg" inactiveImage="styles.svg" /]
              [@themeMacros.sideNavRow key="messages" activeImage="messages-colored-blue.svg" inactiveImage="messages.svg" /]
              [@themeMacros.sideNavRow key="pages" activeImage="page-view-colored-blue.svg" inactiveImage="page-view.svg" /]
            </ul>
          </div>
          <div class="col-xs-6 col-md-6 col-lg-7 center-panel">
            <div id="iframe-container" class="vertical-tab"></div>
          </div>
          <div class="tab-content-container col-xs-4 col-md-4 col-lg-4 col-xl-3">
            <div id="themes">
               <h2 class="left-header">${function.message('tab.themes')}</h2>
               <div class="accordion">
                 <div id="theme-picker"></div>
               </div>

            </div>
            <div id="images">
              <h2 class="left-header">${function.message('tab.images')}</h2>
              <div class="accordion">
                [@themeMacros.accordionPanel key="themeLogo" title="images.themeLogo" open=true]
                  <table id="logo-table">
                    [@themeMacros.urlInputRow "logo" /]
                    [@themeMacros.numericRow name="logoImageSize" variable="--img-logo-size" scale="20.0" /]
                  </table>

                [/@themeMacros.accordionPanel]

                [#assign hasBackgroundError = helpers.anyFieldHasErrors(["theme.variables.backgroundImageURL"])/]
                [@themeMacros.accordionPanel key="background" title="background-heading" open=hasBackgroundError]
                  <table>
                    [@themeMacros.urlInputRow "background" /]
                    <tr class="border-none mt-5">
                      <td class="icon">
                        <label id="background-size-row" for="backgroundSize">
                          ${function.message('backgroundSize')}
                          <i class="fa fa-info-circle" data-additional-classes="wide" data-tooltip="${function.message('{tooltip}backgroundSize')}"></i>
                        </label><br/>
                        <label id="backgroundSizeSelector" class="select" data-variable="--img-background-size">
                          <select class="select">
                            <option value="contain">Contain</option>
                            <option value="cover">Cover</option>
                            <option value="repeat">Repeat</option>
                          </select>
                        </label>
                      </td>
                    </tr>
                  </table>
                [/@themeMacros.accordionPanel]
              </div>

            </div>
            <div id="styles">
              <h2 class="left-header">[@message.print 'tab.styles' /]</h2>
              <div class="accordion">
                [@themeMacros.accordionPanel key="fonts" title="images.fonts" open=true]
                  <table>
                    [#list fontVars as fontVar]
                      <tr class="border-none">
                        <td class="icon">
                          <label for="${fontVar.name()}" class="image-label">
                            ${function.message(fontVar.name())}
                            <span class="required">*</span>
                            <i class="fa fa-info-circle" data-tooltip="${function.message('{tooltip}' + fontVar.name())}"></i>
                          </label><br/>
                          <label id="${fontVar.name()}Selector" class="select font-selector" data-variable="${fontVar.variable}" data-name="${fontVar.name()}">
                            <select class="select">
                              [#if fontVar.isMonospace()]
                                <option data-font-family="Courier" data-font-type="sans-serif" data-mono="true">Courier</option>
                                <option data-font-family="Lucida Console" data-font-type="sans-serif" data-mono="true">Lucida Console</option>
                                <option data-font-family="Consolas" data-font-type="sans-serif" data-mono="true">Consolas</option>
                                <option data-custom="true">Custom</option>
                              [#else]
                                <option value="Helvetica" data-font-type="sans-serif" data-mono="true">Helvetica (sans-serif)</option>
                                <option value="Arial" data-font-type="sans-serif" data-mono="true">Arial (sans-serif)</option>
                                <option value="Arial Black" data-font-type="sans-serif" data-mono="true">Arial Black (sans-serif)</option>
                                <option value="Times" data-font-type="serif" data-mono="true">Times (serif)</option>
                                <option value="Palatino" data-font-type="serif" data-mono="true">Palatino (serif)</option>
                                <option value="Georgia" data-font-type="serif" data-mono="true">Georgia (serif)</option>
                                <option value="Custom" data-custom="true">Custom</option>
                              [/#if]

                            </select>
                          </label>
                          <div class="slide-open" id="custom-font-${fontVar.name()}-container">
                            <label for="custom-font-${fontVar.name()}-input" class="image-label">
                              ${function.message('custom.' + fontVar.name())}
                              <i class="fa fa-info-circle" data-tooltip="${function.message('{tooltip}custom.' + fontVar.name())}"></i>
                            </label>
                            <input id="custom-font-${fontVar.name()}-input" type="text" class="text custom-font-input">
                          </div>
                        </td>
                      </tr>
                    [/#list]
                  </table>
                [/@themeMacros.accordionPanel]

                [#assign hasMiscError = helpers.anyFieldHasErrors(["theme.variables.borderRadius"])/]
                [@themeMacros.accordionPanel key="misc" title="misc" open=hasMiscError]
                  [#if isLicensed]
                    <table class="toggle-table">
                      <tr class="toggle-row">
                        <td>
                          <label for="toggle" class="toggle-label">
                            ${function.message('footerDisplay')}
                            <i class="fa fa-info-circle" data-tooltip="${function.message('{tooltip}footerDisplay')}"></i>
                          </label>
                        </td>
                        <td>
                          <label class="toggle toggle-widget">
                            <input id="footerDisplayToggle" type="checkbox">
                            <span class="rail"></span>
                            <span class="pin"></span>
                          </label>
                        </td>
                      </tr>
                    </table>
                  [/#if]

                  <table>
                    [@themeMacros.numericRow name="borderRadius" variable="--rounded" required=true /]

                  </table>
                [/@themeMacros.accordionPanel]

                [#assign hasColorError = helpers.anyFieldHasErrors(colorVars?map(cv -> "theme.variables." + cv.name()))/]
                [@themeMacros.accordionPanel key="color" title="colors-heading" open=hasColorError]
                  <table id="color-table">
                    <tbody id="color-table-body">
                      [#list colorVars?filter(v -> !v.isFocusVariable()) as colorVar]
                        <tr>
                          <td class="color-row icon"
                              data-name="${colorVar.name()}"
                              data-variable="${colorVar.variable}"
                              [#if colorVar.getFocusVariable()??]
                              data-focus-variable="${colorVar.getFocusVariable().variable!''}"
                              data-focus-variable-name="${colorVar.getFocusVariable().name()!''}"
                              [/#if]>
                            [@themeMacros.colorPicker
                              key='${colorVar.name()}'
                              label='${function.message(colorVar.name())}'
                              tooltip='${function.message("{tooltip}" + colorVar.name())}'
                              required=true
                            /]
                            [@helpers.errors field="theme.variables." + colorVar.name() /]
                        </tr>
                      [/#list]
                    </tbody>
                  </table>
                [/@themeMacros.accordionPanel]
              </div>

            </div>
            <div id="pages">
              <div class="pages-header">
                <h2 class="left-header">[@message.print 'pages' /]</h2>
                <a href="#" class="button blue" id="open-preview-button" data-tooltip="${function.message('{tooltip}open.preview')}"><i class="fa fa-eye"></i> Browser preview</a>
              </div>
              <div class="accordion">

                [#list templateCategoryMap as category, templates]
                  [@themeMacros.accordionPanel key=category title=category]
                    <ul class="template-list">
                      [#list templates?keys as template]
                        <li class="template-list-item">
                          <a href="#" class="template-link" data-template="${template}">
                            [@message.print 'theme.templates.' + template/]
                          </a>
                        </li>
                      [/#list]
                    </ul>
                  [/@themeMacros.accordionPanel]
                [/#list]
              </div>
            </div>
            <div id="messages">
              <h2 class="left-header">${function.message('tab.messages')}</h2>
              <div id="messages-container" class="vertical-tab">
              [#if !isBaseTheme]
                <table id="localization-table" data-template="localization-template">
                  <thead>
                  <tr>
                    <th>[@message.print key="locale"/]</th>
                    <th data-sortable="false" class="action">[@message.print key="action"/]</th>
                  </tr>
                  </thead>
                  <tbody>
                  [#-- This empty row is not needed except to appease the JavaScript --]
                  <tr class="empty-row">
                    <td colspan="2">[@message.print key="no-localized-versions"/]</td>
                  </tr>
                  <tr data-locale="" data-messages="${((theme.defaultMessages)!'')}" data-is-default="true">
                    <td>
                      [@message.print key="default"/]
                      <input id="theme.defaultMessages" type="hidden" name="theme.defaultMessages" value="${((theme.defaultMessages)!'')}"/>
                    </td>
                    <td class="action">
                      [@button.action href="/ajax/theme/custom-messages?isDefault=true" color="blue" icon="edit" key="edit" ajaxWideDialog=true ajaxForm=true/]
                    </td>
                  </tr>
                  [#list theme.localizedMessages?keys![] as locale]
                    <tr data-locale="${locale}" data-messages="${((theme.localizedMessages(locale))!'')}" data-is-default="false">
                      <td>
                        ${locale.displayName}
                        <input id="theme.localizedMessages${locale}" type="hidden" name="theme.localizedMessages['${locale}']" value="${((theme.localizedMessages(locale))!'')}"/>
                      </td>
                      <td class="action">
                        [@button.action href="/ajax/theme/custom-messages" color="blue" icon="edit" key="edit" ajaxWideDialog=true ajaxForm=true/]
                        [@button.action href="/ajax/theme/delete-localization" color="red" icon="trash" key="delete" additionalClass="delete-button"/]
                      </td>
                    </tr>
                  [/#list]
                  </tbody>
                </table>
              [/#if]

              [#-- Display the FusionAuth default messages so they can be copied / pasted and reviewed --]
              [#if isBaseTheme]
                [@control.textarea name="theme.defaultMessages" autocapitalize="none" autocorrect="off" required=false labelKey="empty" disabled=true/]
              [#else]
                [@button.iconLinkWithText href="/ajax/theme/custom-messages" textKey="add-localization" id="add-localization" icon="plus"/]
              [/#if]
              <script type="x-handlebars" id="localization-template">
                <tr>
                  <td>
                    {{localeDisplay}}
                    <input id="theme.localizedMessages{{locale}}" type="hidden" name="theme.localizedMessages['{{locale}}']" value="{{messages}}"/>
                  </td>
                  <td class="action">
                    [@button.action href="/ajax/theme/custom-messages" color="blue" icon="edit" key="edit" ajaxWideDialog=true ajaxForm=true/]
                    [@button.action href="/ajax/theme/delete-localization" color="red" icon="trash" key="delete" additionalClass="delete-button"/]
                  </td>
                </tr>
              </script>
            </div>
            </div>
          </div>
        </div>
      </fieldset>
      <div id="confirm-theme-change-dialog" class="prime-dialog hidden">
        [@dialog.basic titleKey="confirm" includeFooter=false]
          <div class="confirm-text-container">
            <p>[@message.print 'confirm.unsaved'/]</p>
            <p>[@message.print 'confirm.reset'/]</p>
            <button id="confirm-theme-change" class="blue button">[@message.print 'confirm'/]</button>
          </div>
        [/@dialog.basic]
      </div>
    [/@layout.pageForm]
    <template id="theme-thumbnail-template">
      <div class="preview-container">
        <div class="content-window">
          <div class="card">
            <div class="letter-box">
              <span class="primary-letter">A</span>
              <span class="secondary-letter">a</span>
            </div>
            <div class="color-container">
              <div class="color-box top-color"></div>
              <div class="color-box middle-color"></div>
              <div class="color-box bottom-color"></div>
            </div>
          </div>
        </div>
        <div class="name-container">
          <p class="theme-name">Default</p>
        </div>
      </div>
      <link rel="stylesheet" href="/css/theme-thumbnail.css?version=${version}" />
    </template>
  [/@layout.body]
[/@layout.html]

[#ftl/]
[#-- @ftlvariable name="results" type="java.util.List<io.fusionauth.domain.Theme>" --]
[#-- @ftlvariable name="theme" type="io.fusionauth.domain.Theme" --]

[#setting url_escaping_charset="UTF-8"]
[#import "../../_utils/helpers.ftl" as helpers/]
[#import "../../_utils/button.ftl" as button/]
[#import "../../_utils/message.ftl" as message/]

[#macro tabLink name]
[#local value=("((theme.templates." + name + ")!'')")?eval/]
[#local icon = (value?has_content)?then("fa-info-circle", "fa-exclamation-triangle") ]
<a href="#${name}" [#if !value?has_content]class="requires-upgrade"[/#if]>
[@message.print key="theme.templates.${name}"/]
<label> <i class="fa ${icon}" data-tooltip="${function.message('{tooltip}theme.templates.${name}')}"></i></label>
</a>
[/#macro]

[#macro template name isFusionAuthTheme]
<div id="${name}" class="vertical-tab hidden">
  [#local value=("((theme.templates." + name + ")!'')")?eval/]
  [#if !value?has_content]
    <div class="mr-0 w-100 text-right pb-2">
      [@button.iconLinkWithText color="blue" icon="copy" href="/ajax/theme/copy-default-template?templateName=${name?url}" textKey="copy-in-default" tooltipKey="{tooltip}copy-in-default" data_copy_to="theme.templates.${name}"/]
    </div>
  [/#if]
  [@control.textarea name="theme.templates.${name}" autocapitalize="none" autocorrect="off" required=false labelKey="empty" disabled=isFusionAuthTheme/]
</div>
[/#macro]

[#macro colorPicker key label name="" value="" tooltip="" required=false includeFormRow=false]
  [#-- @ftlvariable name="key" type="java.lang.String" --]
  [#-- @ftlvariable name="label" type="java.lang.String" --]
  [#-- @ftlvariable name="name" type="java.lang.String" --]
  [#-- @ftlvariable name="value" type="java.lang.String" --]
  [#-- @ftlvariable name="tooltip" type="java.lang.String" --]
  [#-- @ftlvariable name="required" type="java.lang.Boolean" --]
  [#-- @ftlvariable name="includeFormRow" type="java.lang.Boolean" --]

  [#assign named = (name != "") /]
  [#if includeFormRow]
    <div id="${key}-form-row" class="form-row">
  [/#if]
  <label [#if named]for="${name}" [/#if] [#if fieldMessages?size > 0] class="error"[/#if]>${label?no_esc}[#if required!false]<span class="required">*</span>[/#if][#t/]
  [#if tooltip?? && tooltip?has_content]
    <i class="fa fa-info-circle" data-tooltip="${tooltip}"></i>[#t/]
  [/#if]
  </label>[#t/]
  <div class="input-addon-group color-picker-group">
    <span class="icon">
      <i class="fa fa-blank"></i>
    </span>
    <input type="text" id="${key}" value="${value}" class="color-picker-text" [#if named]name="${name}" [/#if]/>
    <input type="color" id="${key}-selector" class="color-picker" value="#000000" width="0" height="0" tabindex="-1" style="visibility: hidden;"/>
  </div>
  [#if includeFormRow]
    </div>
  [/#if]
[/#macro]

[#macro formFields action]
  <fieldset>
    [#if action=="add"]
      [@control.text name="themeId" autocapitalize="none" autocomplete="off" autocorrect="off" tooltip=function.message('{tooltip}id')/]
    [#else]
      [@control.text name="themeId" disabled=true tooltip=function.message('{tooltip}readOnly')/]
    [/#if]
    [@control.text name="theme.name" autocapitalize="on" autocomplete="on" autocorrect="on" autofocus="autofocus" required=true tooltip=function.message('{tooltip}theme.name')/]
  </fieldset>
  <fieldset class="mt-4">
  [#local isFusionAuthTheme = (theme.id?has_content && theme.id == fusionAuth.statics['io.fusionauth.domain.Theme'].FUSIONAUTH_THEME_ID) /]
    <div id="theme-settings">
      <fieldset>
        <legend>[@message.print key="templates"/]</legend>
        [#if isFusionAuthTheme]
        [@message.alertColumn message=message.inline('{description}fusionAuthTheme') type="warning" icon="exclamation-triangle" includeDismissButton=false columnClass="tight-left col-xs"/]
        [/#if]
        <p><em>[@message.print key="templates-description"/]</em></p>
        [#if theme.missingTemplate()]
          [@message.alertColumn message=message.inline('{description}requiresUpgrade') type="warning" icon="exclamation-triangle" includeDismissButton=false columnClass="tight-left col-xs"/]
        [/#if]
        <div>
          <div class="row">
            <div class="col-xs-6 col-md-4 col-lg-3">
              <ul id="ui-tabs" class="vertical-tabs">
                <li><a href="#stylesheet">[@message.print key="theme.stylesheet"/] <label><i class="fa fa-info-circle" data-tooltip="${function.message('{tooltip}theme.stylesheet')}"></i></label></a></li>
                <li><a href="#messages">[@message.print key="theme.messages"/]<label><i class="fa fa-info-circle" data-tooltip="${function.message('{tooltip}theme.messages')}"></i></label></a></li>
                <li>[@tabLink "helpers"/]</li>
                <li>[@tabLink "index"/]</li>
                [#list fusionAuth.statics['io.fusionauth.domain.Theme$Templates'].Names as templateName]
                  [#if templateName != "helpers" && templateName != "index"]
                    <li>[@tabLink "${templateName}"/]</li>
                  [/#if]
                [/#list]
              </ul>
            </div>
            <div class="col-xs-6 col-md-8 col-lg-9">
              <div id="stylesheet" class="vertical-tab hidden">
                [@control.textarea name="theme.stylesheet" autocapitalize="none" autocorrect="off" required=false labelKey="empty" disabled=isFusionAuthTheme/]
              </div>
              <div id="messages" class="vertical-tab hidden">
                [#if !isFusionAuthTheme]
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
                      [@button.action href="/ajax/theme/validate-localization?isDefault=true" color="blue" icon="edit" key="edit" ajaxWideDialog=true ajaxForm=true/]
                    </td>
                  </tr>
                  [#list theme.localizedMessages?keys![] as locale]
                    <tr data-locale="${locale}" data-messages="${((theme.localizedMessages(locale))!'')}" data-is-default="false">
                      <td>
                        ${locale.displayName}
                        <input id="theme.localizedMessages${locale}" type="hidden" name="theme.localizedMessages['${locale}']" value="${((theme.localizedMessages(locale))!'')}"/>
                      </td>
                      <td class="action">
                        [@button.action href="/ajax/theme/validate-localization" color="blue" icon="edit" key="edit" ajaxWideDialog=true ajaxForm=true/]
                        [@button.action href="/ajax/theme/delete-localization" color="red" icon="trash" key="delete" additionalClass="delete-button"/]
                      </td>
                    </tr>
                  [/#list]
                  </tbody>
                </table>
                [/#if]

                [#-- It is possible that an edit is occuring w/out modifying the messages and we are missing a message, show the error message here. --]
                [#if fieldMessages['theme.defaultMessages']?has_content]
                  <div class="form-row">
                    <span class="error">
                      [#list fieldMessages['theme.defaultMessages'] as e]
                        ${e.message}[#if e_has_next], [/#if]
                      [/#list]
                    </span>
                  </div>
                [/#if]

                [#-- Display the FusionAuth default messages so they can be copied / pasted and reviewed --]
                [#if isFusionAuthTheme]
                  [@control.textarea name="theme.defaultMessages" autocapitalize="none" autocorrect="off" required=false labelKey="empty" disabled=true/]
                [#else]
                  [@button.iconLinkWithText href="/ajax/theme/validate-localization" textKey="add-localization" id="add-localization" icon="plus"/]
                [/#if]
                <script type="x-handlebars" id="localization-template">
                  <tr>
                    <td>
                      {{localeDisplay}}
                      <input id="theme.localizedMessages{{locale}}" type="hidden" name="theme.localizedMessages['{{locale}}']" value="{{messages}}"/>
                    </td>
                    <td class="action">
                      [@button.action href="/ajax/theme/validate-localization" color="blue" icon="edit" key="edit" ajaxWideDialog=true ajaxForm=true/]
                      [@button.action href="/ajax/theme/delete-localization" color="red" icon="trash" key="delete" additionalClass="delete-button"/]
                    </td>
                  </tr>
                </script>
              </div>
              <div id="helpers" class="vertical-tab hidden">
                [@control.textarea name="theme.templates.helpers" autocapitalize="none" autocorrect="off" required=false labelKey="empty" disabled=isFusionAuthTheme/]
              </div>
              [@template "index" isFusionAuthTheme/]
              [#list fusionAuth.statics['io.fusionauth.domain.Theme$Templates'].Names as templateName]
                [#if templateName != "helpers" && templateName != "index"]
                  [@template "${templateName}" isFusionAuthTheme/]
                [/#if]
              [/#list]
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  </fieldset>
[/#macro]

[#macro themesTable]
  <table class="hover listing" data-sortable="false">
    <thead>
      [@helpers.tableHeader "name"/]
      [@helpers.tableHeader "id" "hide-on-mobile"/]
      <th class="type hide-on-mobile">[@message.print "type" /]</th>
      <th class="action">[@message.print "action"/]</th>
    </thead>
    <tbody>
      [#list results![] as theme]
        <tr>
          <td class="break-word">${properties.display(theme, "name")}
            [#if theme.missingTemplate()]
              <span class="small orange stamp push-left" data-tooltip="${message.inline('{tooltip}requires-upgrade')}"><i class="fa fa-exclamation-triangle"></i> [@message.print key="requires-upgrade"/]</span>
            [/#if]
          </td>
          <td class="hide-on-mobile">${properties.display(theme, "id")}</td>
          <td class="hide-on-mobile">${properties.display(theme, "type")}</td>
          <td class="action">
            [@button.actionMenu]
              [#if theme.type == "simple"]
                [@button.actionMenuItem href="customize/${theme.id}" icon="edit" textKey="edit"/]
                [@button.actionMenuItem href="customize?sourceThemeId=${theme.id}" icon="copy" textKey="duplicate"/]
              [#else]
                [@button.actionMenuItem href="edit/${theme.id}" icon="edit" textKey="edit"/]
                [@button.actionMenuItem href="add?themeId=${theme.id}" icon="copy" textKey="duplicate"/]
              [/#if]
              [@button.actionMenuItem href="/admin/theme/view/${theme.id}" icon="search" textKey="preview" target="_blank"/]
              [#if theme.id != fusionAuth.statics['io.fusionauth.domain.Theme'].FUSIONAUTH_THEME_ID && theme.id != fusionAuth.statics['io.fusionauth.domain.Theme'].FUSIONAUTH_SIMPLE_THEME_ID]
                [@button.actionMenuItem href="/ajax/theme/delete/${theme.id}" icon="trash" textKey="delete" ajaxForm=true/]
              [/#if]
            [/@button.actionMenu]
          </td>
        </tr>
      [#else]
        <tr>
          <td colspan="3">
            [@message.print key="no-results"/]
          </td>
        </tr>
      [/#list]
    </tbody>
  </table>
[/#macro]

[#macro accordionPanel key title open=false]
  <div class="accordion-panel [#if open]open[/#if]">
    <a href="#" class="accordion-panel-header slide-open-toggle" data-expand-open="${key}-accordion-content">
      <h3>[@message.print title /]</h3>
      <i class="fa fa-angle-right accordion-arrow [#if open]open[/#if]"></i>
    </a>
    <div class="accordion-panel-content slide-open [#if open]open[/#if]" id="${key}-accordion-content">
      [#nested/]
    </div>
  </div>
[/#macro]

[#macro sideNavRow key activeImage inactiveImage]
  <li class="sidenav-row">
    <a class="left gray item sidenav-button" href="#${key}">
      <img class="sidenav-icon" src="/images/theme/icons/inactive/${inactiveImage}" alt="${function.message('tab.${key}.icon-alt')}" />
      <img class="sidenav-icon-active" src="/images/theme/icons/active/${activeImage}" alt="${function.message('tab.${key}.icon-alt')}" />
      <div class="inner-padding text-left">
        <span class="sidenav-text" >
          ${function.message('tab.${key}')}
        </span>
        <i class="fa fa-info-circle" data-tooltip="${function.message('{tooltip}tab.${key}')}"></i>
      </div>
    </a>
  </li>
[/#macro]

[#macro urlInputRow key]
  <tr>
    <td class="icon">
      <label for="${key}ImageURLInput" class="image-label">
        ${function.message('images.${key}-image-url')}
        <i class="fa fa-info-circle" data-tooltip="${function.message('{tooltip}${key}ImageURL')}"></i>
      </label>
      <div class="input-addon-group">
        <span class="icon">
          <i class="fa fa-times-circle" id="clear-${key}ImageURL" data-tooltip="${function.message('{tooltip}${key}ImageURLClear')}"></i>
        </span>
      <input type="text" id="${key}ImageURLInput" placeholder="e.g. https://www.example.com/image.png"/>
      </div>
      [@helpers.errors field="theme.variables.${key}ImageURL" /]
    </td>
  </tr>
[/#macro]

[#macro toggleTable]
  <table class="toggle-table">
    [#nested /]
  <table class="toggle-table">
[/#macro]

[#macro toggleRow name variable offValue onValue]
<table class="toggle-table">
  <tr class="toggle-row"
      data-name="${name}"
      data-variable="${variable}"
      data-off-value="${offValue}"
      data-on-value="${onValue}">
    <td>
      <label for="toggle" class="toggle-label">
        ${function.message('${name}')}
        <i class="fa fa-info-circle" data-tooltip="${function.message('{tooltip}${name}')}"></i>
      </label>
    </td>
    <td>
      <label class="toggle toggle-widget">
        <input id="toggle" type="checkbox">
        <span class="rail"></span>
        <span class="pin"></span>
      </label>
    </td>
  </tr>
  </table>
[/#macro]

[#macro numericRow name variable scale="" required=false]
  <tr class="numeric-row border-none"
      data-name="${name}"
      data-variable="${variable}"
      [#if scale!=""]data-scale="${scale}[/#if]">

    <td class="icon slide-row">
      <div class="">
        <label>
          [@message.print "${name}" /]
          [#if required]<span class="required">*</span>[/#if]
          <i class="fa fa-info-circle" data-tooltip="${function.message('{tooltip}${name}')}"></i>
        </label>
      </div>
      <div class="slide-container">
        <input type="range" min="0" max="100" value="50" class="slider" id="${name}Slider">
        <input class="numeric-input" id="${name}Input" type="text" value="0.5">
      </div>
      [@helpers.errors field="theme.variables.${name}" /]
    </td>
  </tr>
[/#macro]

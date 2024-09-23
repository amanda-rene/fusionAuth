[#ftl/]
[#import "../../_utils/button.ftl" as button/]
[#import "../../_utils/dialog.ftl" as dialog/]
[#import "../../_utils/locale.ftl" as locale/]
[#import "../../_utils/message.ftl" as message/]

[#-- @ftlvariable name="isDefault" type="boolean" --]
[#-- @ftlvariable name="overrideLines" type="java.lang.String" --]

[#if isDefault]
  [#assign titleKey="custom-title" /]
  [#assign descKey="description" /]
[#else]
  [#assign titleKey="locale-title" /]
  [#assign descKey="locale-description" /]
[/#if]

[@dialog.form titleKey=titleKey action="custom-messages" formClass="labels-left full"]
  <div class="pad-bottom">[@message.print key=descKey /]</div>
  <div class="pad-bottom">[@message.print key="save-warning" /]</div>
  <fieldset>
    [#if !isDefault]
      <div class="form-row">
        <label>[@message.print key="locale"/] <i class="fa fa-info-circle" data-tooltip="${function.message('{tooltip}locale')}"></i></label>
        [@locale.select ""/]
      </div>
    [#else]
      <input type="hidden" name="locale" value=""/>
    [/#if]
    <input type="hidden" name="isDefault" value="${isDefault?string}"/>
    <input type="hidden" name="update" value="true"/>
    <input type="hidden" name="overrideLines" value="${overrideLines!''}" />
    [@control.textarea name="themeDefaults" autocapitalize="off" autocomplete="off" autocorrect="off" autofocus="autofocus" tooltip=function.message('{tooltip}defaultMessages')/]

    [@control.textarea name="customMessages" autocapitalize="off" autocomplete="off" autocorrect="off" autofocus="autofocus" tooltip=function.message('{tooltip}customMessages')/]
  </fieldset>

[/@dialog.form]
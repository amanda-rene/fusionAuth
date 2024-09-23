[#ftl/]
[#-- @ftlvariable name="scope" type="io.fusionauth.domain.ApplicationOAuthScope" --]

[#import "../../../_utils/dialog.ftl" as dialog/]
[#import "../../../_utils/message.ftl" as message/]

[@dialog.form action="edit" formClass="labels-left full"]
<fieldset>
  [@control.hidden name="applicationId"/]
  [@control.hidden name="scopeId"/]
  [@control.hidden name="scope.name"/]
  [@control.text name="scopeId" labelKey="id" autocapitalize="none" autocomplete="off" autocorrect="off" disabled=true tooltip=function.message('{tooltip}readOnly')/]
  [@control.text name="scope.name" autocapitalize="none" autocomplete="off" autocorrect="off" autofocus="autofocus" disabled=true tooltip=message.inline('{tooltip}nameReadOnly')/]
  [@control.text name="scope.description" autocapitalize="on" autocomplete="off" autocorrect="on" tooltip=message.inline('{tooltip}displayOnly')/]
</fieldset>
<fieldset>
  [@control.text name="scope.defaultConsentMessage" autocapitalize="on" autocomplete="off" autocorrect="on" wideTooltip=message.inline('{tooltip}scope.defaultConsentMessage')/]
  [@control.text name="scope.defaultConsentDetail" autocapitalize="on" autocomplete="off" autocorrect="on" wideTooltip=message.inline('{tooltip}scope.defaultConsentDetail')/]
</fieldset>
<fieldset>
  [@control.checkbox name="scope.required" value="true" uncheckedValue="false" wideTooltip=message.inline('{tooltip}scope.required')/]
</fieldset>
[/@dialog.form]
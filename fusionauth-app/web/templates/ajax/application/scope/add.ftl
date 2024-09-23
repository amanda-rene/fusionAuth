[#ftl/]
[#-- @ftlvariable name="scope" type="io.fusionauth.domain.ApplicationOAuthScope" --]

[#import "../../../_utils/dialog.ftl" as dialog/]
[#import "../../../_utils/message.ftl" as message/]

[@dialog.form action="add" formClass="labels-left full"]
<fieldset>
  [@control.hidden name="applicationId"/]
  [@control.text name="scope.name" autocapitalize="none" autocomplete="off" autocorrect="off" autofocus="autofocus" required=true wideTooltip=message.inline('{tooltip}scope.name')/]
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
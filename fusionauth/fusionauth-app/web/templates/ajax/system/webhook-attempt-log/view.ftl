[#ftl/]
[#-- @ftlvariable name="webhookAttemptLog" type="io.fusionauth.domain.WebhookAttemptLog" --]

[#import "../../../_utils/message.ftl" as message/]
[#import "../../../_utils/properties.ftl" as properties/]
[#import "../../../_utils/dialog.ftl" as dialog/]

[@dialog.view]
  <h3>[@message.print key="fields"/]</h3>

  [@properties.table]
    [@properties.rowEval nameKey="startInstant" object=webhookAttemptLog propertyName="startInstant"/]
    [@properties.rowEval nameKey="endInstant" object=webhookAttemptLog propertyName="endInstant"/]
    [@properties.rowEval nameKey="duration" object=webhookAttemptLog propertyName="duration"/]
    [@properties.rowEval nameKey="url" object=webhookAttemptLog propertyName="url"/]
    [@properties.rowEval nameKey="webhookId" object=webhookAttemptLog propertyName="webhookId"/]
    [@properties.rowEval nameKey="statusCode" object=webhookAttemptLog propertyName="webhookCallResponse.statusCode"/]
    [@properties.rowEval nameKey="exception" object=webhookAttemptLog propertyName="webhookCallResponse.exception"/]
    [@properties.rowEval nameKey="attemptResult" object=webhookAttemptLog propertyName="attemptResult"/]
  [/@properties.table]
[/@dialog.view]
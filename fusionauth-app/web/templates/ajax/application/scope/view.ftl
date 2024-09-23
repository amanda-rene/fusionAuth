[#ftl/]
[#-- @ftlvariable name="scope" type="io.fusionauth.domain.ApplicationOAuthScope" --]

[#import "../../../_utils/message.ftl" as message/]
[#import "../../../_utils/properties.ftl" as properties/]
[#import "../../../_utils/dialog.ftl" as dialog/]

[@dialog.view]
  <h3>[@message.print key="fields"/]</h3>

  [@properties.table]
    [@properties.rowEval nameKey="scope.name" object=scope propertyName="name"/]
    [@properties.rowEval nameKey="id" object=scope propertyName="id"/]
    [@properties.rowEval nameKey="scope.description" object=scope propertyName="description"/]
    [@properties.rowEval nameKey="scope.defaultConsentMessage" object=scope propertyName="defaultConsentMessage"/]
    [@properties.rowEval nameKey="scope.defaultConsentDetail" object=scope propertyName="defaultConsentDetail"/]
    [@properties.rowEval nameKey="scope.required" object=scope propertyName="required" booleanAsCheckmark=false/]
    [@properties.rowEval nameKey="insertInstant" object=scope propertyName="insertInstant"/]
    [@properties.rowEval nameKey="lastUpdateInstant" object=scope propertyName="lastUpdateInstant"/]
  [/@properties.table]

[/@dialog.view]
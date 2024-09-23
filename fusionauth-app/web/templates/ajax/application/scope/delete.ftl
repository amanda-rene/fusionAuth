[#ftl/]
[#-- @ftlvariable name="scope" type="io.fusionauth.domain.ApplicationOAuthScope" --]

[#import "../../../_utils/dialog.ftl" as dialog/]
[#import "../../../_utils/properties.ftl" as properties/]

[@dialog.confirm action="delete" key="are-you-sure" idField="applicationId" idField2="scopeId"]
  <fieldset>
    [@properties.table]
      [@properties.rowEval nameKey="name" object=scope!{} propertyName="name"/]
      [@properties.rowEval nameKey="id" object=scope!{} propertyName="id"/]
    [/@properties.table]
  </fieldset>
[/@dialog.confirm]
[#ftl/]
[#-- @ftlvariable name="lambda" type="io.fusionauth.domain.Lambda" --]
[#-- @ftlvariable name="types" type="io.fusionauth.domain.LambdaType[]" --]
[#-- @ftlvariable name="results" type="java.util.List<io.fusionauth.domain.Lambda>" --]

[#import "../../_utils/button.ftl" as button/]
[#import "../../_utils/helpers.ftl" as helpers/]
[#import "../../_utils/message.ftl" as message/]

[#macro formFields action]
  <fieldset>
    [#if action=="add"]
      [@control.text name="lambdaId" autocapitalize="none" autocomplete="off" autocorrect="off" tooltip=function.message('{tooltip}id')/]
    [#else]
      [@control.text name="lambdaId" disabled=true autocapitalize="none" autocomplete="off" autocorrect="off" tooltip=function.message('{tooltip}readOnly')/]
    [/#if]
    [@control.text name="lambda.name" autocapitalize="on" autocomplete="on" autocorrect="on" autofocus="autofocus" required=true tooltip=function.message('{tooltip}displayOnly')/]
    [#if action="add"]
      [@control.select items=types name="lambda.type" tooltip=function.message('{tooltip}lambda.type')/]
    [#else]
      [@control.hidden name="lambda.type"/]
      [@helpers.fauxInput type="text" name="lambda.type" labelKey="lambda.type" value=lambda.type?has_content?then(message.inline("LambdaType.${lambda.type}"), '') tooltip=function.message('{tooltip}readOnly') disabled=true/]
    [/#if]
    [@control.checkbox name="lambda.debug" value="true" uncheckedValue="false" tooltip=function.message('{tooltip}lambda.debug')/]
    [@control.textarea name="lambda.body" autocapitalize="on" autocomplete="on" autocorrect="on" required=true tooltip=function.message('{tooltip}lambda.body')/]
  </fieldset>
  [#list types as type]
    <div id="${type}" class="hidden">${type.example}</div>
  [/#list]
[/#macro]

[#macro lambdasTable]
  <table class="hover listing" data-sortable="false">
    <thead>
      [@helpers.tableHeader "name"/]
      [@helpers.tableHeader "id" "hide-on-mobile"/]
      <th data-sortable="false">[@message.print key="type"/]</th>
      <th data-sortable="false" class="hide-on-mobile"><a href="#">[@message.print key="debug"/]</a></th>
      <th data-sortable="false" class="action">[@message.print key="action"/]</th>
    </thead>
    <tbody>
      [#list results![] as lambda]
        <tr>
          <td class="break-word">${properties.display(lambda, "name")}</td>
          <td class="hide-on-mobile">${lambda.id}</td>
          <td>[@message.print key="LambdaType.${lambda.type.name()}"/]</td>
          <td class="hide-on-mobile">${properties.display(lambda, "debug")}</td>
          <td class="action">
            [@button.actionMenu]
              [@button.actionMenuItem href="edit/${lambda.id}" icon="edit" textKey="edit"/]
              [@button.actionMenuItem href="add?lambdaId=${lambda.id}" icon="copy" textKey="duplicate"/]
              [@button.actionMenuItem href="/ajax/lambda/view/${lambda.id}" icon="search" textKey="view" ajaxView=true ajaxWideDialog=true resizeDialog=true/]
              [@button.actionMenuItem href="/ajax/lambda/delete/${lambda.id}" icon="trash" textKey="delete" ajaxForm=true/]
            [/@button.actionMenu]
          </td>
        </tr>
      [#else]
        <tr>
          <td colspan="6">[@message.print key="no-results"/]</td>
        </tr>
      [/#list]
    </tbody>
  </table>
[/#macro]

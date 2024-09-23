[#ftl/]
[#-- @ftlvariable name="fields" type="java.util.List<io.fusionauth.domain.form.FormField>" --]
[#-- @ftlvariable name="managedFields" type="java.util.List<String>" --]

[#import "../../_utils/button.ftl" as button/]
[#import "../../_layouts/admin.ftl" as layout/]
[#import "../../_utils/message.ftl" as message/]
[#import "../../_utils/panel.ftl" as panel/]
[#import "../../_utils/properties.ftl" as properties/]

[@layout.html]
  [@layout.head]
  <script>
    Prime.Document.onReady(function() {
      new FusionAuth.UI.Listing(Prime.Document.queryFirst('table'))
          .initialize();
    });
  </script>
  [/@layout.head]
  [@layout.body]
    [@layout.pageHeader titleKey="page-title" includeAdd=true breadcrumbs={"": "customizations", "/admin/field/": "fields"}/]
    [@layout.main]
      [@panel.full displayTotal=(fields![])?size]
        <table class="hover">
          <thead>
          <tr>
            <th><a href="#">[@message.print key="name"/]</a></th>
            <th class="hide-on-mobile"><a href="#">[@message.print key="id"/]</a></th>
            <th><a href="#">[@message.print key="key"/]</a></th>
            <th class="hide-on-mobile"><a href="#">[@message.print key="control"/]</a></th>
            <th class="hide-on-mobile"><a href="#">[@message.print key="type"/]</a></th>
            <th data-sortable="false" class="action">[@message.print key="action"/]</th>
          </tr>
          </thead>
          <tbody>
            [#list fields![] as field]
              <tr>
                <td>${properties.display(field, "name")}</td>
                <td class="hide-on-mobile">${field.id}</td>
                <td>${properties.display(field, "key")}</td>
                <td class="hide-on-mobile">${properties.display(field, "control")}</td>
                <td class="hide-on-mobile">${properties.display(field, "type")}</td>
                <td class="action">
                  [@button.actionMenu]
                    [@button.actionMenuItem href="edit/${field.id}" icon="edit" textKey="edit"/]
                    [@button.actionMenuItem href="add?fieldId=${field.id}" icon="copy" textKey="duplicate"/]
                    [@button.actionMenuItem href="/ajax/field/view/${field.id}" icon="search" textKey="view" ajaxView=true ajaxWideDialog=true resizeDialog=true/]
                    [#if !managedFields.contains(field.key)]
                      [@button.actionMenuItem href="/ajax/field/delete/${field.id}" icon="trash" textKey="delete" ajaxForm=true/]
                    [/#if]
                  [/@button.actionMenu]
                </td>
              </tr>
            [#else]
              <tr>
                <td colspan="3">[@message.print key="no-fields"/]</td>
              </tr>
            [/#list]
          </tbody>
        </table>
      [/@panel.full]
    [/@layout.main]
  [/@layout.body]
[/@layout.html]

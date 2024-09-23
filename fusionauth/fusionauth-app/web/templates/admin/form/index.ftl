[#ftl/]
[#-- @ftlvariable name="forms" type="java.util.List<io.fusionauth.domain.form.Form>" --]

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
    [@layout.pageHeader titleKey="page-title" includeAdd=true breadcrumbs={"": "customizations", "/admin/form/": "forms"}/]
    [@layout.main]
      [@panel.full displayTotal=(forms![])?size]
        <table class="hover">
          <thead>
          <tr>
            <th><a href="#">[@message.print key="name"/]</a></th>
            <th class="hide-on-mobile"><a href="#">[@message.print key="id"/]</a></th>
            <th><a href="#">[@message.print key="type"/]</a></th>
            <th data-sortable="false" class="action">[@message.print key="action"/]</th>
          </tr>
          </thead>
          <tbody>
            [#list forms![] as form]
              <tr>
                <td>${properties.display(form, "name")}</td>
                <td class="hide-on-mobile">${properties.display(form, "id")}</td>
                <td>${properties.display(form, "type")}</td>
                <td class="action">
                  [@button.actionMenu]
                    [@button.actionMenuItem href="edit/${form.id}" icon="edit" textKey="edit"/]
                    [@button.actionMenuItem href="add?formId=${form.id}" icon="copy" textKey="duplicate"/]
                    [@button.actionMenuItem href="/ajax/form/view/${form.id}" icon="search" textKey="view" ajaxView=true ajaxWideDialog=true resizeDialog=true/]
                    [@button.actionMenuItem href="/ajax/form/delete/${form.id}" icon="trash" textKey="delete" ajaxForm=true/]
                  [/@button.actionMenu]
                </td>
              </tr>
            [#else]
              <tr>
                <td colspan="3">[@message.print key="no-forms"/]</td>
              </tr>
            [/#list]
          </tbody>
        </table>
      [/@panel.full]
    [/@layout.main]
  [/@layout.body]
[/@layout.html]

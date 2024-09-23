[#ftl/]

[#-- @ftlvariable name="application" type="io.fusionauth.domain.Application" --]
[#-- @ftlvariable name="applicationId" type="java.util.UUID" --]

[#import "../../_utils/button.ftl" as button/]
[#import "../../_layouts/admin.ftl" as layout/]
[#import "../../_utils/message.ftl" as message/]
[#import "../../_utils/panel.ftl" as panel/]
[#import "../../_utils/properties.ftl" as properties/]

[@layout.html]
  [@layout.head]
    <script src="${request.contextPath}/js/admin/ManageScopesForm.js?version=${version}"></script>
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        new ManageScopesForm();
      });
    </script>
  [/@layout.head]
  [@layout.body]
    [@layout.pageHeader includeAdd=true includeSave=false includeBack=true addURI="/ajax/application/scope/add?applicationId=${applicationId}" backURI="/admin/application/" breadcrumbs={"/admin/application/": "applications", "/admin/application/manage-scopes?applicationId=${applicationId}": "manage-scopes"}]
    [/@layout.pageHeader]
    [@layout.main]
      [@panel.full titleKey="scopes-for" titleValues=[application.name]]
       <table>
           <thead>
           <tr>
             <th>[@message.print key="name"/]</th>
             <th class="hide-on-mobile">[@message.print key="description"/]</th>
             <th>[@message.print key="required"/]</th>
             <th data-sortable="false" class="action">[@message.print key="action"/]</th>
           </tr>
           </thead>
           <tbody>
             [#list application.scopes as scope]
               <tr>
                 <td>${properties.display(scope, 'name')}</td>
                 <td class="hide-on-mobile">${properties.display(scope, 'description')}</td>
                 <td>${properties.display(scope, 'required')}</td>
                 <td class="action">
                   [@button.actionMenu]
                     [@button.actionMenuItem href="/ajax/application/scope/edit?scopeId=${scope.id}&applicationId=${applicationId}" icon="edit" textKey="edit" ajaxView=false ajaxForm=true ajaxWideDialog=true/]
                     [@button.actionMenuItem href="/ajax/application/scope/view?scopeId=${scope.id}&applicationId=${applicationId}" icon="search" textKey="view" ajaxView=true ajaxWideDialog=true resizeDialog=true/]
                     [@button.actionMenuItem href="/ajax/application/scope/delete?scopeId=${scope.id}&applicationId=${applicationId}" icon="trash" textKey="delete" ajaxView=false ajaxForm=true/]
                   [/@button.actionMenu]
                 </td>
               </tr>
             [#else]
               <tr class="empty-row">
                 <td colspan="5">[@message.print key="no-scopes"/]</td>
               </tr>
             [/#list]
           </tbody>
         </table>
      [/@panel.full]
    [/@layout.main]
  [/@layout.body]
[/@layout.html]

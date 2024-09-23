[#ftl/]
[#-- @ftlvariable name="results" type="java.util.List<io.fusionauth.domain.Tenant>" --]
[#import "../../_layouts/admin.ftl" as layout/]
[#import "../../_utils/button.ftl" as button/]
[#import "../../_utils/helpers.ftl" as helpers/]
[#import "../../_utils/message.ftl" as message/]
[#import "../../_utils/panel.ftl" as panel/]
[#import "../../_utils/properties.ftl" as properties/]
[#import "../../_utils/search.ftl" as search/]
[#import "_macros.ftl" as tenantMacros/]

[@layout.html]
  [@layout.head]
    <script>
      Prime.Document.onReady(function() {
        const form = Prime.Document.queryById('tenant-form');
        new FusionAuth.Admin.SearchForm(form, 'io.fusionauth.tenants.advancedControls');
      });
    </script>
  [/@layout.head]
  [@layout.body]
    [@layout.pageHeader titleKey="page-title" includeSave=false includeCancel=false includeAdd=true breadcrumbs={"/admin/tenant/": "tenants"}/]
    [@layout.main]
      [@panel.full]
        [@control.form id="tenant-form" action="${request.contextPath}/admin/tenant/" method="GET" class="labels-above full push-bottom" searchResults="tenant-content"]
          [@control.hidden name="s.numberOfResults"/]
          [@control.hidden name="s.startRow" value="0"/]

          <div class="row">
            <div class="col-xs-12 col-md-12 tight-left">
              <div class="form-row">
                [@control.text name="s.name" autocapitalize="none" autocomplete="on" autocorrect="off" spellcheck="false" autofocus="autofocus"  placeholder="${function.message('{placeholder}s.name')}"/]
              </div>
            </div>
          </div>

          <div class="row push-lesser-top push-bottom">
            <div class="col-xs tight-left">
              [@button.formIcon color="blue" icon="search" textKey="search"/]
              [@button.iconLinkWithText href="/admin/tenant/?clear=true" color="blue" icon="undo" textKey="reset" class="reset-button" name='reset'/]
            </div>
          </div>
        [/@control.form]

        <div id="tenant-content">
          [@search.pagination/]
          <div>
            <table class="hover listing" data-sortable="false">
              <thead>
                [@helpers.tableHeader "name"/]
                [@helpers.tableHeader "id" "hide-on-mobile"/]
                <th data-sortable="false" class="action">[@message.print "action"/]</th>
              </thead>
              <tbody>
                [#list results![] as tenant]
                <tr>
                  <td class="break-word">
                  ${properties.display(tenant, "name")}
                  [#if tenant.state == "PendingDelete"] &nbsp; <span class="small red stamp"><i class="fa fa-cog"></i> [@message.print key="deleting"/]</span>&nbsp;[/#if]
                  </td>
                  <td class="hide-on-mobile">${properties.display(tenant, "id")}</td>
                  <td class="action">
                    [@button.actionMenu]
                      [#if tenant.state == "PendingDelete"]
                        [@button.actionMenuItem href="/ajax/tenant/view/${tenant.id}" icon="search" textKey="view" ajaxView=true ajaxWideDialog=true resizeDialog=true/]
                      [#else]
                        [@button.actionMenuItem href="/admin/tenant/edit/${tenant.id}" icon="edit" textKey="edit"/]
                        [@button.actionMenuItem href="add?tenantId=${tenant.id}" icon="copy" textKey="duplicate"/]
                        [@button.actionMenuItem href="/ajax/tenant/view/${tenant.id}" icon="search" textKey="view" ajaxView=true ajaxWideDialog=true resizeDialog=true/]
                        [#if tenant.id != defaultTenantId]
                          [@button.actionMenuItem href="/admin/tenant/delete?tenantId=${tenant.id}" icon="trash" textKey="delete"/]
                        [/#if]
                      [/#if]
                    [/@button.actionMenu]
                  </td>
                </tr>
                [#else]
                <tr>
                  <td colspan="3">
                    [@message.print key="no-results"/]
                  </td>
                </tr>
                [/#list]
              </tbody>
            </table>
          </div>
          [#if numberOfPages gt 1]
            [@search.pagination/]
          [/#if]
        </div>
      [/@panel.full]
    [/@layout.main]
  [/@layout.body]
[/@layout.html]

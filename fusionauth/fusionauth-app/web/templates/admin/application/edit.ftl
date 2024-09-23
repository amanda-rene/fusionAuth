[#ftl/]
[#-- @ftlvariable name="application" type="io.fusionauth.domain.Application" --]
[#-- @ftlvariable name="applicationId" type="java.util.UUID" --]
[#-- @ftlvariable name="systemConfiguration" type="io.fusionauth.domain.SystemConfiguration" --]
[#-- @ftlvariable name="themes" type="java.util.List<io.fusionauth.domain.Theme>" --]

[#import "../../_utils/button.ftl" as button/]
[#import "../../_layouts/admin.ftl" as layout/]
[#import "../../_utils/helpers.ftl" as helpers/]
[#import "../../_utils/message.ftl" as message/]
[#import "../../_utils/panel.ftl" as panel/]
[#import "_macros.ftl" as applicationMacros/]

[@layout.html]
  [@layout.head]
  <script>
    Prime.Document.onReady(function() {
      new FusionAuth.Admin.ApplicationForm();
    });
  </script>
  [/@layout.head]
  [@layout.body]
    [@control.form action="edit" method="POST" class="labels-left full" id="application-form"]
      [@layout.pageHeader includeSave=true includeCancel=true nestedFirst=true cancelURI="/admin/application/" breadcrumbs={"/admin/application/": "applications", "/admin/application/edit?applicationId=${applicationId}&tenantId=${tenantId}": "edit"}]
        [#if applicationId != fusionAuthId]
          <div class="split-button mr-3" data-local-storage-key="application-edit-split-button">
            <a class="gray button item" href="#"><i class="fa fa-spinner fa-pulse"></i> [@message.print key="loading"/]</a>
            <button type="button" class="gray button square" aria-haspopup="true" aria-expanded="false">
              <span class="sr-only">[@message.print key="toggle-dropdown"/]</span>
            </button>
            <div class="menu">
              <a id="manage-roles" class="item default" href="manage-roles?applicationId=${applicationId}"><i class="fa fa-user"></i> ${function.message("manage-roles")}</a>
              <a id="manage-scopes" class="item" href="manage-scopes?applicationId=${applicationId}"><i class="fa fa-code"></i> ${function.message("manage-scopes")}</a>
            </div>
          </div>
        [/#if]
      [/@layout.pageHeader]
      [@layout.main]
        [@panel.full]
          <fieldset>
            [@control.hidden name="tenantId"/]
            [@control.hidden name="applicationId"/]
            [#-- Hard code the Id so we don't get browser warnings because two elements will have the same Id. --]
            [@control.text name="applicationId" id="_applicationId" autocapitalize="none" autocomplete="off" autocorrect="off" disabled=true tooltip=function.message('{tooltip}readOnly')/]
            [#if tenants?size > 1]
              [@control.text name="tenantId" labelKey="tenant" value=helpers.tenantName(tenantId) autocapitalize="none" autocomplete="off" autocorrect="off" disabled=true tooltip=function.message('{tooltip}readOnly')/]
            [/#if]
            [@control.text name="application.name" autocapitalize="on" autocomplete="on" autocorrect="off" autofocus="autofocus" required=true tooltip=function.message('{tooltip}displayOnly')/]
            [@control.select items=themes name="application.themeId" textExpr="name" valueExpr="id" required=false headerL10n="none-selected-use-tenant-theme" headerValue="" tooltip=function.message('{tooltip}application.themeId')/]
          </fieldset>
          <fieldset class="mt-4">
            [@applicationMacros.configurations "edit"/]
          </fieldset>
        [/@panel.full]
      [/@layout.main]
    [/@control.form]
  [/@layout.body]
[/@layout.html]

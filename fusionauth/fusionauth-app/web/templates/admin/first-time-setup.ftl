[#ftl/]
[#-- @ftlvariable name="application" type="io.fusionauth.domain.Application" --]
[#-- @ftlvariable name="apiKey" type="io.fusionauth.domain.APIKey" --]
[#-- @ftlvariable name="firstTimeSetup" type="io.fusionauth.api.service.system.SetupService.FirstTimeSetup" --]
[#-- @ftlvariable name="reactorStatus" type="io.fusionauth.domain.reactor.ReactorStatus" --]
[#-- @ftlvariable name="step" type="java.lang.String" --]
[#-- @ftlvariable name="tenant" type="io.fusionauth.domain.Tenant" --]

[#import "../_utils/button.ftl" as button/]
[#import "../_layouts/admin.ftl" as layout/]
[#import "../_utils/message.ftl" as message/]
[#import "../_utils/panel.ftl" as panel/]
[#import "../_utils/properties.ftl" as properties/]
[#import "application/_macros.ftl" as appMacros/]
[#import "tenant/_macros.ftl" as tenantMacros/]
[#import "_macros.ftl" as setupMacros/]

[@layout.html]
[@layout.head]
  <script src="${request.contextPath}/js/admin/FirstTimeSetup.js?version=${version}"></script>
  <style>
  /* prevent checkboxes from wrapping away from label */
  .check-box-item {
    white-space: nowrap;
  }

  /* explicitly set color to avoid white background */
  .CodeMirror {
    background-color: #E7EDF2;
  }

   .panel {
      overflow:hidden;
   }

  .panel:after {
    color: rgb(226 232 240 / 1);
    font-family: FontAwesome;
    font-size: 8rem;
    line-height: 1;
    right: -1rem;
    bottom: -2.5rem;
    position: absolute;
  }

  .panel.license:after {
    content: "\f1c0";
  }
  .panel.apiKey:after {
    content: "\f084";
  }
  .panel.email:after {
    content: "\f003";
  }
  .panel.application:after {
    content: "\f1b2";
  }
  .panel.summary:after {
     content: "\f121";
  }

  [#-- This is sort of a hack, but it allows the focus elements to render more nicely when using labels on top of the field. --]
  .vertical-tab.prime-tab-content {
    padding-left: 2px;
    padding-right: 2px;
  }
</style>
[/@layout.head]
[@layout.body outputAlerts=false]
  [@layout.main]
    <div class="pl-3 pr-6">
      <h2>${message.inline("page-title")}</h2>
      <p class="mt-3 mb-3">[@control.message key="intro"/]</p>
    </div>

    [@panel.full panelClass="panel transparent ${step} pb-6" rowClass="row center-xs" ]
      <div class="row mb-3">
        <div class="vertical-tabs col-xs-6 col-md-4 col-lg-4 col-xl-3">
          <ul class="vertical-tabs">
            [@setupMacros.tabItem "application" step firstTimeSetup/]
            [@setupMacros.tabItem "apiKey" step firstTimeSetup/]
            [@setupMacros.tabItem "email" step firstTimeSetup/]
            [@setupMacros.tabItem "license" step firstTimeSetup/]
            [@setupMacros.tabItem "summary" step firstTimeSetup/]
          </ul>
        </div>
        <div class="col-xs-6 col-md-8 col-lg-8 col-xl-9">
        [@control.form id="first-time-setup-form" action="${request.contextPath}/admin/first-time-setup" method="POST" class="full"]
          [@control.hidden name="step"/]

          <div class="d-flex column">
            <div style="min-height: 200px;">
              [#-- Application --]
              <div id="application" class="vertical-tab prime-tab-content mb-3" style="${(step == "application")?then("display: block !important", "")}">
                <fieldset>
                  <legend>[@message.print key="heading.application"/]</legend>
                    <p class="no-top-margin">
                      <em>[@control.message key="intro.application-1"/]</em>
                    </p>
                    [@control.text name="application.name" autocapitalize="on" autocomplete="on" autocorrect="off" required=true autofocus="autofocus" tooltip=function.message('{tooltip}application.name') /]
                    [@control.select id="redirectURLs" items=application.oauthConfiguration.authorizedRedirectURLs multiple=true name="application.oauthConfiguration.authorizedRedirectURLs" class="select no-wrap" labelKey="application.oauthConfiguration.authorizedRedirectURLs" tooltip=function.message('{tooltip}oauth.redirectURLs') /]
                    <p style="margin-top: -10px;">
                      <em>[@control.message key="intro.application-2"/]</em>
                    </p>
                </fieldset>
              </div>

              [#-- API Key --]
              <div id="apiKey" class="vertical-tab prime-tab-content" style="${(step == "apiKey")?then("display: block !important", "")}">
                <fieldset>
                  <legend>[@message.print key="heading.apiKey"/]</legend>
                  <p class="no-top-margin">
                    <em>[@control.message key="intro.apiKey-1"/]</em>
                  </p>
                  <p class="no-top-margin">
                    <em>[@control.message key="intro.apiKey-2"/]</em>
                  </p>
                  [@control.text name="apiKey.key" autocapitalize="none" autocomplete="off" autocorrect="off" autofocus="autofocus" /]
                </fieldset>
              </div>

              [#-- Email Configuration --]
              <div id="email" class="vertical-tab prime-tab-content" style="${(step == "email")?then("display: block !important", "")}">
              <fieldset>
                <legend>[@message.print key="heading.email"/]</legend>
                  <p class="mt-0" style="margin-bottom: 20px;"><em>[@message.print key="{description}smtp-settings-1"/]</em></p>
                  <p class="mt-0" style="margin-bottom: 20px;"><em>[@message.print key="{description}smtp-settings-2"/]</em></p>
                  <div class="row">
                    <div class="col-lg-8 col-md-7 col-sm-12 col-xs-12 tight-left">
                      [@control.text name="tenant.emailConfiguration.host" autofocus="autofocus" required=true /]
                    </div>

                    <div class="col-lg-4 col-md-5 col-sm-12 col-xs-12 tight-both">
                      [@control.text name="tenant.emailConfiguration.port" placeholder="587" required=true /]
                    </div>
                  </div>
                  [@control.select items=emailSecurityTypes name="tenant.emailConfiguration.security" tooltip=function.message("{tooltip}tenant.emailConfiguration.security")/]
                </fieldset>
                <fieldset>
                  <div class="row">
                    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 tight-left">
                      [@control.text name="tenant.emailConfiguration.username" autocomplete="username"/]
                    </div>

                    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 tight-both">
                      [@control.password name="tenant.emailConfiguration.password" value="" required=false autocomplete="new-password" /]
                    </div>
                  </div>
                </fieldset>
                <fieldset>
                  <div class="row">
                    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 tight-left">
                      [@control.text name="tenant.emailConfiguration.defaultFromName" tooltip=message.inline("{tooltip}tenant.emailConfiguration.defaultFromName")/]
                    </div>

                    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 tight-both">
                      [@control.text name="tenant.emailConfiguration.defaultFromEmail" tooltip=message.inline("{tooltip}tenant.emailConfiguration.defaultFromEmail")/]
                    </div>
                  </div>

                </fieldset>
                <div class="d-flex mb-3" style="justify-content: flex-end;">
                  [@button.iconLinkWithText href="/ajax/tenant/smtp/test?tenantId=${(tenant.id)!''}" id="send-test-email" color="blue" icon="send-o" textKey="send-test-email" class="push-left" ajaxForm=true /]
                </div>
              </div>

              [#-- License --]
              <div id="license" class="vertical-tab prime-tab-content"  style="${(step == "license")?then("display: block !important", "")}">
                <fieldset>
                  <legend>[@message.print key="heading.license"/]</legend>
                  [#if firstTimeSetup.state.license == "COMPLETE"]
                    [@setupMacros.license reactorStatus/]
                  [#else]
                    <p> <em> [@control.message key="intro.license"/] </em> </p>
                    [@control.text name="licenseKey" autocapitalize="off" autocomplete="off" autocorrect="off" autofocus="autofocus"/]
                  [/#if]
                </fieldset>
              </div>

              [#-- Summary --]
              <div id="summary" class="vertical-tab prime-tab-content"  style="${(step == "summary")?then("display: block !important", "")}">
                <fieldset>
                  <legend>[@message.print key="heading.summary"/]</legend>
                  <p class="mb-1"> Use the following settings to get your application working with FusionAuth. To help get you started, click on the following link to find <a href="https://fusionauth.io/docs/quickstarts/" target="_blank">Quickstart Guides&nbsp;<i class="fa fa-external-link"></i></a> for the most common languages and frameworks. If you don't see a tab below for the Quickstart you are using, the generic details should be adequate to get you going. </p>
                </fieldset>
                <fieldset class="mb-1">
                  [@setupMacros.integrationSummary tenant application/]
                 </fieldset>
                <fieldset>
                  <p>Use this API key to authenticate FusionAuth API requests.</p>
                  [@properties.table]
                    [@properties.rowEval nameKey="apiKey.key" object=apiKey propertyName="key" copyable=true/]
                  [/@properties.table]
                </fieldset>
              </div>
            </div>
            <div class="mt-3">
              [@setupMacros.formButtons step firstTimeSetup.state.getState(step)!""/]
            </div>
          </div>
         [/@control.form]
      </div>
      </div>
    [/@panel.full]
  [/@layout.main]
[/@layout.body]
[/@layout.html]

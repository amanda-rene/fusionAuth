[#ftl/]
[#-- @ftlvariable name="apiKeySetup" type="boolean" --]
[#-- @ftlvariable name="applicationSetup" type="boolean" --]
[#-- @ftlvariable name="dailyActiveUserReport" type="io.fusionauth.app.action.admin.IndexAction.IndexReport" --]
[#-- @ftlvariable name="firstTimeSetup" type="io.fusionauth.api.service.system.SetupService.FirstTimeSetup" --]
[#-- @ftlvariable name="fusionAuthTenantId" type="java.util.UUID" --]
[#-- @ftlvariable name="loginData" type="io.fusionauth.app.service.ReportUtil.ReportData" --]
[#-- @ftlvariable name="logins" type="io.fusionauth.domain.DisplayableRawLogin[]" --]
[#-- @ftlvariable name="loginReport" type="io.fusionauth.app.action.admin.IndexAction.IndexReport" --]
[#-- @ftlvariable name="proxyConfigReport" type="io.fusionauth.app.action.admin.ProxyConfigTestAction.ProxyConfigReport" --]
[#-- @ftlvariable name="registrationReport" type="io.fusionauth.app.action.admin.IndexAction.IndexReport" --]
[#-- @ftlvariable name="tenantSetup" type="boolean" --]
[#-- @ftlvariable name="totalsReport" type="io.fusionauth.app.action.admin.IndexAction.IndexReport" --]

[#import "../_utils/button.ftl" as button/]
[#import "../_layouts/admin.ftl" as layout/]
[#import "../_utils/helpers.ftl" as helpers/]
[#import "../_utils/message.ftl" as message/]
[#import "../_utils/panel.ftl" as panel/]
[#import "../_utils/properties.ftl" as properties/]
[#import "../_utils/report.ftl" as report/]

[@layout.html]
[@layout.head]
  <script>
    Prime.Document.onReady(function() {
      new FusionAuth.Admin.Dashboard([[#list loginData.labels as label]"${label}"[#sep], [/#list]],
        [[#list loginData.counts as count]${count}[#sep], [/#list]], ${(reactorStatus.threatDetection == "ACTIVE")?c});
    });
  </script>
  [#--  We should delete this inline style once we complete the FusionAuth UI refresh --]
  <style>
    div[data-progress] {
      display: flex;
      margin-top: 20px;
      margin-bottom: 20px;
      width: 175px;
      height: 175px;
      border-radius: 50%;
      background: conic-gradient(#33afec var(--progress), #e9eff3 0deg);
      font-size: 0;
      box-shadow: 0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px 0 rgba(0,0,0,0.12);
    }

    div[data-progress] > span {
      color: #0b0e0e;
    }

    div[data-progress]::after {
      content: attr(data-progress);
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      margin: 14px;
      border-radius: 50%;
      background: #fff;
      font-size: 2rem;
      text-align: center;
    }

    .first-time-setup {
      background-image: url( '/images/first-time-setup.svg' );
      background-repeat: no-repeat;
      background-position: right bottom;
      background-size: cover;
    }

     .button.skip-it {
       background: #FFF;  /* blue button hover */
       border: 1px solid #e9eff3;
       color: #156AA3;    /* Link color */
       font-size: 14px !important;
       font-weight: 700 !important;
       padding: 12px 20px !important;
     }

    .button.skip-it:hover {
      background: #156AA3; /* blue button hover */
      color: #FFF;
    }

  </style>
[/@layout.head]
[@layout.body]
  [@layout.pageHeader/]
  [@layout.main]

    [#-- Is the Proxy Config Screwed up? Let's check it. --]
    <div id="proxy-report-result" data-nonce="${context.getAttribute("ProxyTestNonce")}">
    </div>
    <iframe id="proxy-report-iframe" width="0" height="0" src="${request.contextPath}/admin/proxy-config-test" class="hidden"></iframe>

    [#if !firstTimeSetup.complete]
        [#-- First time setup step --]
        [@panel.full panelClass="panel transparent pt-1 first-time-setup"]
            <div class="d-flex" style="align-items: stretch; padding: 15px 10px;">
              <div style="flex-grow: 1;">
                <div class="d-flex column">
                  <div class="mb-5">
                   [@control.form id="first-time-setup-panel-dismiss-form" action="${request.contextPath}/admin/" method="POST"]
                    <h2 style="font-weight: 600; padding-left: 0">
                      [@message.print key="finish-first-time-setup"/]
                    </h2>
                      [/@control.form]
                    <p style="font-size: 16px;">
                      Finish setting up FusionAuth by creating an application, adding an API key, configuring the email server, and optionally activating your license and then get coding!
                    </p>
                    <p style="font-size: 16px;">
                       If you don't need help, click 'Skip it' and get to work!
                    </p>
                  </div>
                  <div>
                    <a class="blue button setup" href="/admin/first-time-setup" style="font-size: 14px !important; font-weight: 700 !important; padding: 12px 20px !important;"> <span>[@message.print key="setup"/]</span></a>
                    <a id="complete-first-time-setup" class="button skip-it" href="/ajax/first-time-setup/complete">[@message.print key="skip-it"/]</a>
                  </div>
                </div>
              </div>

              [#assign percentComplete = firstTimeSetup.percentComplete()?string.percent/]
              <div id="percent-complete" style="flex-shrink: 1; padding-left: 50px; padding-right: 150px; padding-top: 10px; padding-bottom: 10px;">
                <div data-progress="${percentComplete}" style="--progress: ${percentComplete};"><span>${percentComplete}</span></div>
              </div>
            </div>
        [/@panel.full ]

    [/#if]

    [@panel.full ]

      <div class="row mb-4 tight-both">
        <div class="col-lg-3 col-md-6 col-xs-12 blue card">
          [@reportCard "users", totalsReport, "total-users", false/]
        </div>
        <div class="col-lg-3 col-md-6 col-xs-12 green card">
          [@reportCard "sign-in", loginReport, "logins-today", true/]
        </div>
        <div class="col-lg-3 col-md-6 col-xs-12 red card">
          [@reportCard "user-plus", registrationReport, "registrations-today", true/]
        </div>
        <div class="col-lg-3 col-md-6 col-xs-12 orange card">
          [@reportCard "line-chart", dailyActiveUserReport, "daily-active-users", true/]
        </div>
      </div>

      [#if reactorStatus.threatDetection == "ACTIVE" ]
      [#assign currentLocation = fusionAuth.currentLocation()!{}/]
      <div class="row">
        <div class="col-xs">
          <div id="login-heat-map" class="mb-4" style="height: 500px; width: 100%;" data-initial-longitude="${(currentLocation.longitude)!''}" data-initial-latitude="${(currentLocation.latitude)!''}"></div>
        </div>
      </div>
      [/#if]

      <header>
        <h2 style="padding-left: 0 !important;">[@message.print key="recent-logins"/]</h2>
      </header>

      <table class="hover">
        <thead>
          <tr>
            <th>[@message.print key="user"/]</th>
            <th class="hide-on-mobile">[@message.print key="application"/]</th>
            <th>[@message.print key="time"/]</th>
            [#if reactorStatus.threatDetection == "ACTIVE"]
            <th class="hide-on-mobile">[@message.print key="location"/]</th>
            [/#if]
            <th class="hide-on-mobile">[@message.print key="ip-address"/]</th>
          </tr>
        </thead>
        <tbody>
          [#list logins[0..*10] as login]
          <tr>
            <td class="break-all">[@properties.truncate login "loginId"  40/]</td>
            <td class="hide-on-mobile break-all">[@properties.truncate login "applicationName" 40/]</td>
            <td>${properties.displayZonedDateTime(login, "instant")}</td>
            [#if reactorStatus.threatDetection == "ACTIVE"]
            <td class="hide-on-mobile">${properties.display(login, "location.displayString")}</td>
            [/#if]
            <td class="hide-on-mobile"> ${properties.display(login, "ipAddress")} </td>
          </tr>
          [/#list]
        </tbody>
      </table>

      <div class="row">
        <div class="col-xs text-right tight-both">
          <a href="${request.contextPath}/admin/system/login-record/">[@message.print key="all-login-records"/]
            <i class="fa fa-arrow-right"></i>
          </a>
        </div>
      </div>
    [/@panel.full]

    <div class="row push-bottom">
      <div class="col-xs-12 panel" id="hourly-logins">
        [@report.typeToggle /]
        <header>
          <h2> [@message.print key="logins-by-hour"/] </h2>
        </header>
        <main>
          <canvas id="login-chart" height="400" width="400"></canvas>
        </main>
      </div>
    </div>
  [/@layout.main]

[/@layout.body]
[/@layout.html]

[#macro reportCard icon object titleKey includeChange]
  <header>
    <h3>[@message.print key=titleKey/]</h3>
    [#if includeChange]
      [#if object.change?has_content]
        <span class="${object.increase?then('increase', 'decrease')}">${object.change}%</span>
      [#else]
        <span>[@message.print key="not-available"/]</span>
      [/#if]
    [/#if]
  </header>
  <main>
    <i class="fa fa-${icon} background hover"></i>
    <p class="large text-center">${object.count}</p>
  </main>
[/#macro]

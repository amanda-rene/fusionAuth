[#ftl/]
[#-- @ftlvariable name="firstTimeSetup" type="io.fusionauth.api.service.system.SetupService.FirstTimeSetup" --]

[#import "../_utils/button.ftl" as button/]
[#import "../_utils/message.ftl" as message/]
[#import "../_utils/properties.ftl" as properties/]

[#macro completedCheckMark stepState]
  <span style="color: gray; font-size: 19px; padding-left: 5px; vertical-align: middle;">
  [#if stepState == "INCOMPLETE"]<i class="fa fa-square-o"></i>[#else]<i class="fa fa-check-square gray-text" data-tooltip="Complete"></i>[/#if]
  </span>
[/#macro]

[#macro license reactorStatus]
  [@properties.table classes="properties"]
    [#assign licensedStatus]
      ${properties.display(reactorStatus, "licensed", "\x2013", true, true)}
      [#if reactorStatus.licenseAttributes?has_content && reactorStatus.licenseAttributes["LicensedPlan"]??]
         &nbsp;${reactorStatus.licenseAttributes["LicensedPlan"]}[#rt]
      [/#if]
      [#-- Display when not using a production license --]
      [#if reactorStatus.licenseAttributes?has_content && reactorStatus.licenseAttributes["LicenseType"] != "Production"]
         .&nbsp; ${reactorStatus.licenseAttributes["LicenseType"]}, usage will not count towards your billable MAU.[#lt]
      [/#if]
    [/#assign]
    [@properties.row nameKey="licensed" value=licensedStatus/]
  [/@properties.table]
[/#macro]

[#macro integrationSummary tenant application]
  [#--  Show this when the app has been created, and is missing an authorized redirect URL --]
  [#if application?? && application.id?? && !application.oauthConfiguration.authorizedRedirectURLs?has_content]
  <p class="mt-0 mb-4">
  Please note, your application is missing a redirect URL. Once you know it, click <a target="_blank" href="${request.contextPath!''}/admin/application/edit?applicationId=${application.id}&tenantId=${application.tenantId}#oauth-configuration">here</a> and add it to the <strong>Authorized redirect URLs</strong> config in your application and click <strong>Save</strong>. This value will be provided if you follow a Quickstart.
  </p>
  [/#if]

  <ul class="tabs" >
    <li><a href="#generic"><div><span>Generic</span></div></a></li>
    [#-- Note, these are currently 15px. If we want to make them larger we need to correct the overall line height / tab height so we don't get movement when hovering on the tab. --]
    <li><a href="#react"><div><img src="/images/firstTimeSetup/react.svg" alt="React icon" style="vertical-align: middle" height="15px"/> React</div></a></li>
    <li><a href="#ruby"><div><img src="/images/firstTimeSetup/ruby-on-rails.svg" alt="Rails icon" style="vertical-align: middle" height="15px"/> Ruby on Rails</div></a></li>
    <li><a href="#python"><div><img src="/images/firstTimeSetup/python.svg" alt="Python icon" style="vertical-align: middle" height="15x"/> Python Flask</div></a></li>
  </ul>

  <div id="generic" class="tab hidden tight-left">
    [@properties.table classes="properties"]
      [@properties.rowEval nameKey="application.oauthConfiguration.clientId" object=application propertyName="oauthConfiguration.clientId" copyable=true/]
      [@properties.rowEval nameKey="application.oauthConfiguration.clientSecret" object=application propertyName="oauthConfiguration.clientSecret" copyable=true/]
      [@properties.rowEval nameKey="application.oauthConfiguration.authorizedRedirectURLs" object=application propertyName="oauthConfiguration.authorizedRedirectURLs"/]
    [/@properties.table]
  </div>

  <div id="react" class="tab hidden tight-left">
    Use the following values for <code>src/main.tsx</code> as you're following the <a href="https://fusionauth.io/docs/quickstarts/quickstart-javascript-react-web" target="_blank">React Quickstart Guide&nbsp;<i class="fa fa-external-link"></i></a>.
    <fieldset>
      <label for="react_config"></label>
      <textarea id="react_config" class="textarea">
const config: FusionAuthProviderConfig = {
  clientId: "${(application.oauthConfiguration.clientId)!}",
  redirectUri: "http://localhost:3000",
  serverUrl: "${(currentBaseURL)!}",
  shouldAutoFetchUserInfo: true,
  shouldAutoRefresh: true,
  onRedirect: (state?: string) => {
    console.log(`Redirect happened with state value: [#noparse]${state}[/#noparse]"}`);
  }
};[#t]
      </textarea>
    </fieldset>
  </div>

  <div id="ruby" class="tab hidden tight-left">
    Use the following values for <code>config/environments/development.rb</code> as you're following the <a href="https://fusionauth.io/docs/quickstarts/quickstart-ruby-rails-web" target="_blank">Ruby on Rails Quickstart Guide&nbsp;<i class="fa fa-external-link"></i></a>.
    <fieldset>
      <label for="ruby_config"></label>
      <textarea id="ruby_config" class="textarea">
        [#compress]
        config.x.fusionauth.issuer = "${(currentBaseURL)!}"
        config.x.fusionauth.client_id = "${(application.oauthConfiguration.clientId)!}"
        [/#compress]
      </textarea>
    </fieldset>

    And then start your Rails application with the following command.
    <fieldset>
      <label for="ruby_exec"></label>
      <textarea id="ruby_exec" class="textarea">
      [#compress]
      OP_SECRET_KEY="${(application.oauthConfiguration.clientSecret)!}" bundle exec rails
      [/#compress]
      </textarea>
    </fieldset>
  </div>

  <div id="python" class="tab hidden tight-left">
    Use the following values for <code>.env</code> as you're following the <a href="https://fusionauth.io/docs/quickstarts/quickstart-python-flask-web" target="_blank">Python Flask Quickstart Guide&nbsp;<i class="fa fa-external-link"></i></a>.
    <fieldset>
      <label for="python_config"></label>
      <textarea id="python_config" class="textarea">
        [#compress]
        CLIENT_ID=${(application.oauthConfiguration.clientId)!}
        CLIENT_SECRET=${(application.oauthConfiguration.clientSecret)!}
        ISSUER=${(currentBaseURL)!}
        APP_SECRET_KEY=0386ffa9-3bff-4c75-932a-48d6a763ce77
        [/#compress]
      </textarea>
    </fieldset>

    And then start your Flask application with the following command.
    <fieldset>
      <label for="python_exec"></label>
      <textarea id="python_exec" class="textarea">
        [#compress]
        flask --app server.py --debug run
        [/#compress]
      </textarea>
    </fieldset>
  </div>
[/#macro]

[#macro roles application]
  <table>
    <thead>
    <tr>
      <th>[@message.print key="name"/]</th>
      <th>[@message.print key="id"/]</th>
      <th class="text-center">[@message.print key="default"/]</th>
      <th class="text-center">[@message.print key="superRole"/]</th>
      <th>[@message.print key="description"/]</th>
    </tr>
    </thead>
    <tbody>
      [#if (application.roles)?has_content]
        [#list application.roles as role]
        <tr>
          <td>${properties.display(role, 'name')}</td>
          <td>${properties.display(role, 'id')}</td>
          <td class="text-center">${properties.display(role, 'isDefault')}</td>
          <td class="text-center">${properties.display(role, 'isSuperRole')}</td>
          <td>${properties.display(role, 'description')}</td>
        </tr>
        [/#list]
      [#else]
      <tr>
        <td colspan="3">[@message.print key="no-roles"/]</td>
      </tr>
      [/#if]
    </tbody>
  </table>
[/#macro]

[#macro general_details tenant application]
  [@properties.table classes="properties"]
    [@properties.rowEval nameKey="application.name" object=application propertyName="name"/]
    [@properties.rowEval nameKey="tenant.issuer" object=tenant propertyName="issuer"/]
  [/@properties.table]
[/#macro]

[#macro formButtons step stepState]
  [#if step == "summary"]
    <a id="return-to-dashboard" class="white button" href="${request.contextPath}/admin/"><i class="fa fa-reply"></i>&nbsp; [@message.print key="return-to-dashboard"/] </a>
    <a id="complete-first-time-setup" class="blue button" href="/ajax/first-time-setup/complete">[@message.print key="complete"/]</a>
    <p><em>Note that completing this step will remove the First time setup menu item from the left navigation. Do this once you complete your integration using the above details.</em></p>
  [#else]
    <a id="skipButton" class="white button" href="${request.contextPath}/admin/first-time-setup?skip=${step}">[@message.print key="skip"/] </a>
    [#if stepState != "COMPLETED"]
      [@button.formIcon color="blue" textKey="next" icon="arrow-circle-right" /]
      <p style="width: 85%;">
        <em>
        [#if step == "apiKey"]
        You may manage this API key or create additional API keys later by clicking on <strong>Settings > API Keys</strong> in the left navigation.
        [#elseif step == "application"]
        You may manage this application or create additional applications later by clicking on <strong>Applications</strong> in the left navigation.
        [#elseif step == "email"]
        You may also configure the email server at a later time by clicking on <strong>Tenants</strong> in the left navigation and navigating to the email tab in the tenant configuration.
        [#elseif step == "license"]
        You may also activate your license later by clicking on <strong>Reactor</strong> in the left navigation.
        [/#if]
        </em>
      </p>
    [/#if]
  [/#if]
[/#macro]

[#macro tabItem name step firstTimeSetup]
[#local stepState = (name == "summary")?then("INCOMPLETE", firstTimeSetup.state.getState(name)) /]
<li class="${(name == step)?then("selected", "")}" style="${(stepState != "INCOMPLETE")?then("opacity: 0.7", "")}">
  [#if stepState == "INCOMPLETE"]
  <a href="/admin/first-time-setup?step=${name}">[@message.print key="heading.${name}"/] [@completedCheckMark stepState/]</a>
  [#else]
  <a disabled=disabled style="color: gray;">[@message.print key="heading.${name}"/] [@completedCheckMark stepState/]</a>
  [/#if]
</li>
[/#macro]

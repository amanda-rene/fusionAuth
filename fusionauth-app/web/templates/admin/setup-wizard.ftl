[#ftl/]
[#-- @ftlvariable name="acquisitionChannels" type="java.util.List<java.lang.String>" --]

[#import "../_utils/button.ftl" as button/]
[#import "../_layouts/user.ftl" as layout/]
[#import "../_utils/message.ftl" as message/]
[#import "../_utils/panel.ftl" as panel/]

[@layout.html]
[@layout.head]
  <script src="${request.contextPath}/js/jstz-min-1.0.6.js"></script>
  <script src="${request.contextPath}/js/admin/SetupWizard.js?version=${version}"></script>
[/@layout.head]
[@layout.body]
  <style>
   [#-- Note that we have some custom style here, this is intended, and we can revisit when we refresh the UI --]
   .panel.white > h2 {
     font-size: 22px;
   }
  </style>
  [@layout.main columnClass="col-xs col-lg-8"]
    [@panel.full titleKey="page-title" rowClass="row center-xs" columnClass="col-xs col-lg-8" panelClass="white panel"]
      [@control.form action="${request.contextPath}/admin/setup-wizard" method="POST" class="labels-left full"]
        [@control.hidden name="timezone"/]
        [#if setupTokenInputRequired]
          <em>[@control.message key="intro.setupToken"/]</em>
          <fieldset class="mt-3 mb-3">
            [@control.text name="setupToken" autocapitalize="none" autocomplete="off" autocorrect="off" required=true autofocus="autofocus"/]
          </fieldset>
          <div class="form-row mt-4">
            <button class="blue button">[@message.print key="continue"/]</button>
          </div>
        [#else]
          [#-- Note that we have some custom style here, this is intended, and we can revisit when we refresh the UI --]
          <p class="no-top-margin" style="margin-bottom: 1.8rem; margin-top: -10px;">[@control.message key="intro"/]</p>
          <fieldset>
            [@control.hidden name="setupToken"/]
            [@control.hidden name="adminUserInputEntered" value="true"/]
            <legend>[@message.print key="heading.administrator"/]</legend>
            <p class="no-top-margin">
              <em>[@control.message key="intro.administrator"/]</em>
            </p>
            [@control.text name="user.firstName" autocapitalize="none" autocomplete="on" autocorrect="off" required=true autofocus="autofocus"/]
            [@control.text name="user.lastName" autocapitalize="none" autocomplete="on" autocorrect="off" required=true /]
            [@control.text name="user.email" autocapitalize="none" autocomplete="on" autocorrect="off" required=true/]
            [@control.password name="user.password" required=true/]
            [@control.password name="passwordConfirm" required=true/]
          </fieldset>
          <fieldset>
            <legend>[@message.print key="heading.license-and-more"/]</legend>
            <div class="mb-4">
              <p class="no-top-margin">
                <em>[@control.message key="intro.license"/]</em>
              </p>
              [@control.checkbox name="acceptLicense" required=true uncheckedValue="false" value="true"/]
            </div>
            <div class="mb-4">
              <p>
                <em>[@control.message key="intro.addToNewsletter"/]</em>
              </p>
              [@control.checkbox name="addToNewsletter" uncheckedValue="false" value="true"/]
            </div>
            <div class="mb-4">
              <p>
                <em>[@control.message key="intro.acquisition"/]</em>
              </p>
              [@control.select items=acquisitionChannels name="acquisition.channel" headerL10n="none-selected" headerValue="" required=true/]
              [@control.text name="acquisition.other"/]
            </div>
          </fieldset>
          <div class="form-row mt-4">
            <button class="blue button">[@message.print key="next"/]</button>
          </div>
         [/#if]
      [/@control.form]
    [/@panel.full]
  [/@layout.main]
[/@layout.body]
[/@layout.html]

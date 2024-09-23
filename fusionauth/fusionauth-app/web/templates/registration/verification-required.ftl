[#ftl/]
[#-- @ftlvariable name="application" type="io.fusionauth.domain.Application" --]
[#-- @ftlvariable name="client_id" type="java.lang.String" --]
[#-- @ftlvariable name="collectVerificationCode" type="boolean" --]
[#-- @ftlvariable name="currentUser" type="io.fusionauth.domain.User" --]
[#-- @ftlvariable name="showCaptcha" type="boolean" --]
[#-- @ftlvariable name="tenant" type="io.fusionauth.domain.Tenant" --]
[#-- @ftlvariable name="tenantId" type="java.util.UUID" --]
[#-- @ftlvariable name="verificationId" type="java.lang.String" --]
[#import "../_helpers.ftl" as helpers/]

[@helpers.html]
  [@helpers.head]
    [@helpers.captchaScripts showCaptcha=showCaptcha captchaMethod=tenant.captchaConfiguration.captchaMethod siteKey=tenant.captchaConfiguration.siteKey/]
    [#-- Custom <head> code goes here --]
  [/@helpers.head]
  [@helpers.body]
    [@helpers.header]
      [#-- Custom header code goes here --]
    [/@helpers.header]

    [@helpers.main title=theme.message('registration-verification-required-title')]
      [#-- The user does not have a verified registration. Add optionall messaging here with instruction to the user. --]

       [#-- Let the user know why they ended up here --]
       <p class="mt-0 mb-3">
         ${theme.message("{description}registration-verification-required")}
       </p>

       [#-- If configured, collect the verification code on this form, this means the user sits here until they verify their registration. --]
       [#if collectVerificationCode]
          <form id="verification-required-enter-code" action="${request.contextPath}/registration/verification-required" method="POST" class="full">
            [@helpers.oauthHiddenFields/]
            [@helpers.hidden name="action" value="verify"/]
            [@helpers.hidden name="collectVerificationCode"/]
            [@helpers.hidden name="verificationId"/]
            <fieldset>
              [@helpers.input type="text" name="oneTimeCode" id="otp" autocapitalize="none" autofocus=true autocomplete="one-time-code" autocorrect="off" placeholder="${theme.message('code')}" leftAddon="lock"/]
              [@helpers.captchaBadge showCaptcha=showCaptcha captchaMethod=tenant.captchaConfiguration.captchaMethod siteKey=tenant.captchaConfiguration.siteKey/]
            </fieldset>
            <div class="form-row">
              [@helpers.button text=theme.message('submit')/]
            </div>
         </form>
       [#else]
         <p> ${theme.message("{description}registration-verification-required-non-interactive")} </p>
       [/#if]

       [#-- Resend a verification email --]
       <form id="verification-required-resend-code" action="${request.contextPath}/registration/verification-required" method="POST" class="full">
         [@helpers.oauthHiddenFields/]
         [@helpers.hidden name="action" value="resend"/]
         [@helpers.hidden name="collectVerificationCode"/]
         <div class="form-row">
           <button class="link blue-text send-another-button"><i class="fa fa-arrow-right"></i> ${theme.message('registration-verification-required-send-another')} </button>
         </div>
       </form>

    [/@helpers.main]

    [@helpers.footer]
      [#-- Custom footer code goes here --]
    [/@helpers.footer]
  [/@helpers.body]
[/@helpers.html]

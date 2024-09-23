[#ftl/]
<html lang="en">
  <body>
    <form method="GET">
      <input type="hidden" name="browserCheck" value="true">
      [#-- Allow this to be provided on the URI. It will be overridden if the browser has support for this API. --]
      <input type="hidden" name="userVerifyingPlatformAuthenticatorAvailable" value="${request.getParameter("userVerifyingPlatformAuthenticatorAvailable")!''}">
      [#list request.parameters as key,value][#rt]
        [#-- Ignore userVerifyingPlatformAuthenticatorAvailable if it comes in on the request, we have hard coded it above. --]
        [#if key == "userVerifyingPlatformAuthenticatorAvailable"][#continue][/#if]
        [#list value as v]
          <input type="hidden" name="${key!""}" value="${v!""}"/>
        [/#list]
      [/#list]
    </form>
    <script type="text/javascript">
      const uvpaAvailableField = document.querySelector('input[name="userVerifyingPlatformAuthenticatorAvailable"]');
      if (uvpaAvailableField !== null && typeof(PublicKeyCredential) !== 'undefined' && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        PublicKeyCredential
          .isUserVerifyingPlatformAuthenticatorAvailable()
          .then(result => {
            uvpaAvailableField.value = result;
            document.forms[0].submit();
          });
      } else {
        document.forms[0].submit();
      }
    </script>
  </body>
</html>

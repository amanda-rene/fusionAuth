[#ftl/]
[#setting url_escaping_charset='UTF-8'/]
[#-- @ftlvariable name="webhookEventLog" type="io.fusionauth.domain.WebhookEventLog" --]

[#import "../../../_utils/button.ftl" as button/]
[#import "../../../_utils/dialog.ftl" as dialog/]
[#import "../../../_utils/helpers.ftl" as helpers/]
[#import "../../../_layouts/admin.ftl" as layout/]
[#import "../../../_utils/message.ftl" as message/]
[#import "../../../_utils/panel.ftl" as panel/]
[#import "../../../_utils/properties.ftl" as properties/]

[@layout.html]
  [@layout.head]
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      new ManageWebhookEventLog();
    });
  </script>
  [/@layout.head]
  [@layout.body]
    [@layout.pageHeader titleKey="page-title" includeBack=true backURI="/admin/system/webhook-event-log/" breadcrumbs={"/admin/system/webhook-event-log": "webhook-event-log", "/admin/system/webhook-event-log/manage/${webhookEventLog.id}": "manage"}/]
    [@layout.main]
      [@panel.full panelClass="panel"]
        <div class="row push-bottom">
          <div class="col-xs-12 col-md-4 col-lg-12">
            [@properties.table]
              [@properties.rowEval nameKey="id" object=webhookEventLog  propertyName="id" /]
              [@properties.rowEval nameKey="insertInstant" object=webhookEventLog  propertyName="insertInstant" /]
              [@properties.rowEval nameKey="lastUpdateInstant" object=webhookEventLog  propertyName="lastUpdateInstant" /]
              [@properties.rowEval nameKey="eventType" object=webhookEventLog  propertyName="eventType" /]
              [@properties.rowEval nameKey="eventResult" object=webhookEventLog  propertyName="eventResult" /]
            [/@properties.table]
          </div>
        </div>

        <ul class="tabs">
          <li><a href="#webhook-attempts">[@message.print key="webhook-attempts"/]</a></li>
          <li><a href="#webhook-source-data">[@message.print key="webhook-source-data"/]</a></li>
        </ul>

        <div id="webhook-attempts">
          <table class="hover">
            <thead class="light-header">
              <tr>
                <th>[@message.print key="attempt.startInstant"/]</th>
                <th>[@message.print key="attempt.endInstant"/]</th>
                <th>[@message.print key="attempt.duration"/]</th>
                <th>[@message.print key="attempt.url"/]</th>
                <th>[@message.print key="attempt.webhookId"/]</th>
                <th>[@message.print key="attempt.attemptResult"/]</th>
                <th data-sortable="false" class="action">[@message.print key="action"/]</th>
              </tr>
            </thead>
            <tbody>
              [#if webhookEventLog.attempts??]
                [#list webhookEventLog.attempts as attempt]
                  <tr>
                    <td class="overflow-ellipsis-on-mobile tight pr-4">${function.format_zoned_date_time(attempt.startInstant, function.message('date-time-seconds-format'), zoneId)}[#t/]</td>
                    <td class="overflow-ellipsis-on-mobile tight pr-4">${function.format_zoned_date_time(attempt.endInstant, function.message('date-time-seconds-format'), zoneId)}[#t/]</td>
                    <td>${attempt.duration} ms</td>
                    <td>${attempt.url!'\x2013'}</td>
                    <td>${attempt.webhookId!'\x2013'}</td>
                    <td>${attempt.attemptResult}</td>
                    <td class="action">
                      [@button.action href="/ajax/system/webhook-attempt-log/view/${attempt.id}" icon="search" key="view-webhook-attempt-log" color="green" ajaxView=true ajaxWideDialog=true resizeDialog=true/]
                    </td>
                  </tr>
                [/#list]
              [#else]
              <tr>
                <td colspan="5">[@message.print key="no-attempts"/]</td>
              </tr>
              [/#if]
            </tbody>
          </table>
        </div>

        <div id="webhook-source-data">
          <fieldset>
            <pre class="code scrollable horizontal mt-0">${webhookEventLog.event}</pre>
            <p><em>[@message.print key="{description}webhook-source-data"/]</em></p>
          </fieldset>
        </div>
      [/@panel.full]
      <div id="error-dialog" class="prime-dialog hidden">
        [@dialog.basic titleKey="error" includeFooter=true]
          <p>
            [@message.print key="[AJAXError]"/]
          </p>
        [/@dialog.basic]
      </div>
    [/@layout.main]
  [/@layout.body]
[/@layout.html]

[#ftl/]
[#-- @ftlvariable name="firstResult" type="int" --]
[#-- @ftlvariable name="lastResult" type="int" --]
[#-- @ftlvariable name="numberOfPages" type="int" --]
[#-- @ftlvariable name="results" type="java.util.List<io.fusionauth.domain.WebhookEventLog>" --]
[#-- @ftlvariable name="s" type="io.fusionauth.domain.search.WebhookEventLogSearchCriteria" --]
[#import "../../../_layouts/admin.ftl" as layout/]
[#import "../../../_utils/button.ftl" as button/]
[#import "../../../_utils/helpers.ftl" as helpers/]
[#import "../../../_utils/message.ftl" as message/]
[#import "../../../_utils/properties.ftl" as properties/]
[#import "../../../_utils/panel.ftl" as panel/]
[#import "../../../_utils/search.ftl" as search/]

[#macro typeIcon type]
[#if type == "Information"]
  <i class="fa fa-info-circle md-text blue-text"></i>
[#elseif type == "Debug"]
  <i class="fa fa-bug md-text orange-text"></i>
[#elseif type == "Error"]
  <i class="fa fa-exclamation-triangle md-text red-text"></i>
[#else]
  <i class="fa fa-exclamation-triangle md-text"></i>
[/#if]
[/#macro]

[@layout.html]
  [@layout.head]
    <script>
      Prime.Document.onReady(function() {
        var form = Prime.Document.queryById('webhook-event-log-form');
        new FusionAuth.Admin.SearchForm(form, 'io.fusionauth.webhookEventLog.advancedControls');
      });
  </script>
  <script src="${request.contextPath}/js/DateTimePicker.js?version=${version}"></script>
  [/@layout.head]
  [@layout.body]
    [@layout.pageHeader titleKey="page-title" breadcrumbs={"": "system", "/admin/system/webhook-event-log/": "webhook-event-log"}/]
    [@layout.main]
      [@panel.full]
        [@control.form id="webhook-event-log-form" action="/admin/system/webhook-event-log/" method="GET" class="labels-above full push-bottom" searchResults="webhook-event-log-content"]
          [@control.hidden name="s.numberOfResults"/]
          [@control.hidden name="s.startRow" value="0"/]

          <div class="row">
            <div class="col-xs-12 col-md-12 tight-left">
              <div class="form-row">
                [@control.text name="s.event" autocapitalize="none" autocomplete="on" autocorrect="off" spellcheck="false" autofocus="autofocus"  placeholder="${function.message('search-placeholder')}"/]
              </div>
            </div>
          </div>

          [#-- Advanced Search Controls --]
          <div id="advanced-search-controls" class="slide-open">
            <div class="row">
              <div class="col-xs-12 col-md-4 col-lg-6 tight-left">
                [@control.select name="s.eventType" items=eventTypes headerValue="" headerL10n="any"/]
              </div>
              <div class="col-xs-12 col-md-4 col-lg-6">
                [@control.select name="s.eventResult" items=webhookResults headerValue="" headerL10n="any"/]
              </div>
            </div>
            <div class="row">
                <div class="col-xs-12 col-md-4 col-lg-6 tight-left">
                  [@control.text is="date-time-picker" type="datetime-local" name="s.start" /]
                </div>
                <div class="col-xs-12 col-md-4 col-lg-6">
                  [@control.text is="date-time-picker" type="datetime-local" name="s.end" /]
                </div>
            </div>
          </div>

          <a href="#" class="slide-open-toggle" data-expand-open="advanced-search-controls">
            <span>[@message.print key="advanced"/] <i class="fa fa-angle-down"></i></span>
          </a>

          <div class="row push-lesser-top push-bottom">
            <div class="col-xs tight-left">
              [@button.formIcon color="blue" icon="search" textKey="search"/]
              [@button.iconLinkWithText href="/admin/system/webhook-event-log/?clear=true" color="blue" icon="undo" textKey="reset" class="reset-button" name='reset'/]
            </div>
          </div>
        [/@control.form]

        <div id="webhook-event-log-content">
          [@search.pagination/]
          <div class="scrollable horizontal">
            <table class="listing hover" data-sortable="false">
              <thead>
              <tr>
                [@helpers.tableHeader "insertInstant"/]
                [@helpers.tableHeader "eventType"/]
                [@helpers.tableHeader "linkedObjectId"/]
                [@helpers.tableHeader "eventResult"/]
                <th data-sortable="false">[@message.print key="attempts"/]</th>
                <th data-sortable="false" class="action">[@message.print key="action"/]</th>
              </tr>
              </thead>
              <tbody>
                [#if results?has_content]
                  [#list results as log]
                    <tr>
                      <td class="">${function.format_zoned_date_time(log.insertInstant, function.message('date-time-seconds-format'), zoneId)}[#t/]</td>
                      <td>
                        ${message.inline(log.eventType)}
                      </td>
                      <td>
                        ${log.linkedObjectId!"\x2013"}
                      </td>
                      <td>
                        ${message.inline(log.eventResult)}
                      </td>
                      <td class="">
                        ${log.successfulAttempts}/${log.failedAttempts + log.successfulAttempts}
                      </td>
                      <td class="action">[@button.action href="/admin/system/webhook-event-log/manage/${log.id}" icon="address-card-o" key="manage" color="purple"/]</td>
                    </tr>
                  [/#list]
                [#else]
                <tr>
                  <td colspan="7">
                    [@message.print key="no-results"/]
                  </td>
                </tr>
                [/#if]
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
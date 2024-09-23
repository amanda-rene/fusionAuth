[#ftl/]
[#import "_macros.ftl" as macros/]
[#assign ifr = true/]
[#if attributes['includeFormRow']??]
  [#assign ifr = attributes['includeFormRow']/]
[/#if]
[#if ifr]
<div id="${attributes['id']}-form-row" class="form-row[#if attributes['additionalFormRowClasses']??] ${attributes['additionalFormRowClasses']}[/#if]">
[/#if]
  [@macros.dynamic_attributes/]
  [#-- ensure that we send the appropriate dateTimeFormat if none is specified --]
  [#assign dateTypes = ["date", "datetime-local"] /]
  [#if attributes['type']?? && dateTypes?seq_contains(attributes['type'])]
    [#if attributes['dateTimeFormat']??]
      [#assign dateTimeFormat = attributes['dateTimeFormat'] /]
    [#elseif attributes['_dateTimeFormate']??]
      [#assign dateTimeFormat = attributes['_dateTimeFormat']]
    [#elseif attributes['type'] == "datetime-local"]
      [#assign dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSX"]
    [#else]
      [#assign dateTimeFormat = "yyyy-MM-dd"]
    [/#if]
    <input type="hidden" name="${attributes['name']}@dateTimeFormat" value="${dateTimeFormat}"/>
  [/#if]
  [@macros.control_label/]
  [#if attributes['leftAddon']?has_content || attributes['rightAddon']?has_content || attributes['leftAddonText']?has_content || attributes['rightAddonText']?has_content || attributes['rightAddonButton']?has_content ||  attributes['rightAddonRaw']?has_content ]
  <div class="input-addon-group">
    [#if attributes['leftAddon']?has_content]
    <span class="icon"><i class="fa fa-${attributes['leftAddon']}"></i></span>
    [/#if]
    [#if attributes['leftAddonText']?has_content]
    <span class="text">${attributes['leftAddonText']}</span>
    [/#if]
  [/#if]
  <input [#if !(attributes['type']??)]type="text"[/#if] class="${macros.class('text')}" [@macros.append_attributes ["leftAddon", "leftAddonText", "rightAddon", "rightAddonText", "rightAddonButton", "rightAddonRaw"]/]/>[#t/]
  [#if attributes['leftAddon']?has_content || attributes['rightAddon']?has_content || attributes['leftAddonText']?has_content || attributes['rightAddonText']?has_content || attributes['rightAddonButton']?has_content || attributes['rightAddonRaw']?has_content ]
    [#if attributes['rightAddon']?has_content]
      <span class="icon"><i class="fa fa-${attributes['rightAddon']}"></i></span>
    [/#if]
    [#if attributes['rightAddonText']?has_content]
      <span class="text">${attributes['rightAddonText']}</span>[#t/]
    [/#if]
    [#if attributes['rightAddonButton']?has_content]
      <a class="button blue">${attributes['rightAddonButton']}</a>[#t/]
    [/#if]
    [#if attributes['rightAddonRaw']?has_content]
      ${attributes['rightAddonRaw']}
    [/#if]
  </div>
  [/#if]
  [@macros.errors/]
[#if ifr]
</div>
[/#if]

/*
 * Copyright (c) 2024, FusionAuth, All Rights Reserved
 */
'use strict';

/**
* JavaScript for the manage webhook event log page.
*
* @author Spencer Witt
*/
class ManageWebhookEventLog {
  /**
    * @constructor
    *
    * Initialize and handle the manage webhook event log page
    */
    constructor() {
      let viewButtons = document.querySelectorAll('a[data-ajax-view="true"]');
      viewButtons.forEach(b => b.addEventListener('click', this.#handleClickEvent.bind(this)));

      // Initialize tab selection
      new Prime.Widgets.Tabs(Prime.Document.queryFirst('.tabs'))
            .withErrorClassHandling('error')
            .withLocalStorageKey('webhookEventLog.manage.tabs')
            .initialize();
    }

    #handleClickEvent(event) {
      event.preventDefault();
      event.stopPropagation();

      const button = event.currentTarget;
      const uri = button.getAttribute('href');
      this.dialog = new Prime.Widgets.AJAXDialog()
        .withFormHandling(true)
        .withAdditionalClasses('wide')
        .open(uri);
    }
}
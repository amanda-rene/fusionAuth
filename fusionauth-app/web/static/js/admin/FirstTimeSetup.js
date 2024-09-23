/*
 * Copyright (c) 2023-2024, FusionAuth, All Rights Reserved
 */
'use strict';

class FirstTimeSetup {
  constructor() {
    Prime.Utils.bindAll(this);

    this.smtpEditor = null; // Needed to have the SMTP test dialog ignore it
    this.editors = {};

    const form = Prime.Document.queryById('first-time-setup-form');
    if (document.querySelector('input[name="tenant.emailConfiguration.host"]') !== null) {
      new FusionAuth.Admin.SMTPTestDialog(form, null);
    }

    if (document.querySelector('input[name="application.name"]') !== null) {
      new FusionAuth.Admin.OAuthConfiguration(form);
    }

    // setup  code snippet rendering
    Prime.Document.query("textarea").each((function(e) {
        this.editors[e.getId()] = new FusionAuth.UI.TextEditor(e)
             .withOptions({
                //'gutters': ['CodeMirror-lint-markers'],
                //'lint': true,
                'lineWrapping': true,
                'mode': 'shell',
                'readOnly': true,
                'tabSize': 2
              })
              .render()
              .setHeight("100%");
      }).bind(this));

    // setup code snippet tabs
    const summaryTabs = document.querySelector('#summary .tabs');
    if (summaryTabs !== null) {
      this.tabs = new Prime.Widgets.Tabs(summaryTabs)
                .withErrorClassHandling('error')
                .withLocalStorageKey('firstTimeSetup.summary.tabs')
                .withSelectCallback(this._handleTabSelect)
                .initialize();
    }

    // refresh CodeMirror instances
    Object.values(this.editors).forEach(editor => editor.refresh());

    // First time setup
    const markComplete = document.getElementById('complete-first-time-setup');
    if (markComplete !== null) {
      markComplete.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        new Prime.Widgets.AJAXDialog()
             .withFormHandling(true)
             .open(markComplete.getAttribute('href'));
      })
    }
  }

  _handleTabSelect(tab, tabContent) {
    // CodeMirror instances need refreshing after un-hiding
    Object.values(this.editors).forEach(editor => editor.refresh());
  }
}

document.addEventListener('DOMContentLoaded', () => new FirstTimeSetup());

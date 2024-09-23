/*
 * Copyright (c) 2024, FusionAuth, All Rights Reserved
 */
'use strict';

/**
* @author David Charles
*/
class ManageScopesForm {

  /**
  * @constructor
  *
  * Initialize and handle the manage application scopes page
  */
  constructor() {
    let addButton = document.querySelector('a[href*="scope/add"]');
    addButton.addEventListener('click', this.#handleClickEvent.bind(this));

    // Initialize table and table element actions
    new FusionAuth.UI.Listing(Prime.Document.queryFirst('table')).initialize();
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

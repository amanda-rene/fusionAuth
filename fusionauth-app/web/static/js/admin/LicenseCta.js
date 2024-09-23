/*
 * Copyright (c) 2024, FusionAuth, All Rights Reserved
 */
'use strict';

class LicenseCta {
  constructor() {
    const dismiss = document.getElementById('dismiss-license-cta');

    if (dismiss !== null) {
      dismiss.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        new Prime.Widgets.AJAXDialog()
             .withFormHandling(true)
             .open(dismiss.getAttribute('href'));
      })
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new LicenseCta());

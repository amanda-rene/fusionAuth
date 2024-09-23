/*
 * Copyright (c) 2024, FusionAuth, All Rights Reserved
 */
'use strict';

class CopyToClipboard {
  constructor() {
    document.addEventListener('click', (event) => this.#handleClick(event));
  }

  #handleClick(event) {
    const copyButton = event.target.closest('[data-widget="copy-button"]');
    if (copyButton === null) {
      return;
    }

    const id = copyButton.dataset.copySource;
    const source = document.getElementById(id);
    if (source === null) {
      throw `Invalid copy-source [${id}]`;
    }

    navigator.clipboard
             .writeText(source.innerText)
             .then(() => {
               if (copyButton.matches('i.fa-clone')) {
                 copyButton.classList.remove('fa-clone');
                 copyButton.classList.add('fa-check', 'green-text');
                 const tooltip = new Prime.Widgets.Tooltip(copyButton).withClassName('tooltip')
                                                                                   .withDataName('tooltipValue')
                                                                                   .initialize();
                 tooltip.show();
                 setTimeout(() => {
                   copyButton.classList.remove('fa-check', 'green-text');
                   copyButton.classList.add('fa-clone');
                   // Hide on call back even if the user is still hovering. Destroy widget so we don't have a hover tooltip.
                   tooltip.hide();
                   tooltip.destroy();
                 }, 1000);
               }
             });
  }
}

// Polyfill a destroy method on the Tooltip widget
// - We could also move this code to prime.js
if (!Prime.Widgets.Tooltip.prototype.destroy) {
  Prime.Widgets.Tooltip.prototype.destroy = function () {
    this.element.removeEventListener('mouseenter', this._handleMouseEnter);
    this.element.removeEventListener('mouseleave', this._handleMouseLeave);
  }
}

document.addEventListener('DOMContentLoaded', () => new CopyToClipboard());

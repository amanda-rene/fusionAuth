/*
 * Copyright (c) 2023, FusionAuth, All Rights Reserved
 */
'use strict';

class SetupWizard {
  constructor() {
    const timezone = document.getElementById('timezone');
    const guess = jstz.determine();
    if (guess !== null && typeof(guess) !== 'undefined') {
      timezone.value = guess.name();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new SetupWizard());
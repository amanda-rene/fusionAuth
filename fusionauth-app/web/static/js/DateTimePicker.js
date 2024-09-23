/*
 * Copyright (c) 2024, FusionAuth, All Rights Reserved
 */
/**
 * Extends the default HTML datetime picker to handle the conversion between UTC and local time when the attribute is="date-time-picker" is
 * added to the input tag. Expects to be used in a form.
 *
 * The <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#local_date_and_time_strings">Default</a> value of
 * the datetime-local input is a local date and time string without a time zone. The value of the input is always in UTC. This component
 * will convert the value to local time when the input is rendered and back to UTC when the form is submit.
 *
 * Additionally, datetime-local inputs do not support the placeholder attribute. This component will convert the input to a text input if a
 * placeholder is present and then back to a datetime-local input when the input is focused.
 *
 * Example:
 * <pre>
 *  {@code <input type="datetime-local" is="date-time-picker" id="s_start"  name="s.start" /> }
 * </pre>
 */
customElements.define('date-time-picker', class extends HTMLInputElement {
  connectedCallback() {
    this.form.addEventListener('formdata', (event) => {
      event.formData.set(this.name, new Date(this.value).toISOString());
    });

    if (this.value) {
      // the input is showing the UTC time as if it were local time
      const utcDate = new Date(this.value);
      // convert the UTC time to actual local time
      // (offset to millis x2 since the element will ignore the tz on the initial value, then again when the string is converted to a date)
      const localDateTime = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000 * 2));
      // truncate it to the valid datetime-local format
      this.value = localDateTime.toISOString().split('.')[0].slice(0, -3);
    } else if (this.placeholder) {
      // there is no value, but there is a placeholder, convert to text to show it
      this.type = 'text';
      this.onfocus = () => this.type = 'datetime-local';
      this.onblur = () => {
        // if the user didn't enter a value, convert it back to a text input to show the placeholder
        if (this.value === '') {
          this.type = 'text';
        }
      };
    }
  }
}, {extends: 'input'});

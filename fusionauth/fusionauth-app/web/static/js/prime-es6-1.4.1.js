/*
 * Copyright (c) 2021, FusionAuth, All Rights Reserved
 */
var Prime = (function (exports) {
	'use strict';

	/*
	 * Copyright (c) 2012-2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	/**
	 * The Browser namespace. This namespace does not contain any classes, just functions.
	 *
	 * @namespace Browser
	 */
	const Browser = {
	  /**
	   * Detects the browser name and version.
	   */
	  detect: function() {
	    this.name = this._searchString(this.dataBrowser) || "An unknown browser";
	    this.version = this._searchVersion(navigator.userAgent) || this._searchVersion(navigator.appVersion) || "an unknown version";
	    this.os = this._searchString(this.dataOS) || "an unknown OS";
	  },


	  /* ===================================================================================================================
	   * Private Methods
	   * ===================================================================================================================*/

	  /**
	   *
	   * @param {Object} data The data array.
	   * @returns {?string} The browser identity String.
	   * @private
	   */
	  _searchString: function(data) {
	    for (let i = 0; i < data.length; i++) {
	      const dataString = data[i].string;
	      const dataProp = data[i].prop;
	      this.versionSearchString = data[i].versionSearch || data[i].identity;
	      if (dataString && dataString.indexOf(data[i].subString) !== -1) {
	        return data[i].identity;
	      } else if (dataProp) {
	        return data[i].identity;
	      }
	    }

	    return null;
	  },

	  /**
	   *
	   * @param {string} dataString The browser data string.
	   * @returns {?number} The version or null.
	   * @private
	   */
	  _searchVersion: function(dataString) {
	    const index = dataString.indexOf(this.versionSearchString);
	    if (index === -1) {
	      return null;
	    }

	    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
	  },

	  dataBrowser: [
	    {
	      string: navigator.userAgent,
	      subString: "Chrome",
	      identity: "Chrome"
	    },
	    {
	      string: navigator.userAgent,
	      subString: "OmniWeb",
	      versionSearch: "OmniWeb/",
	      identity: "OmniWeb"
	    },
	    {
	      string: navigator.vendor,
	      subString: "Apple",
	      identity: "Safari",
	      versionSearch: "Version"
	    },
	    {
	      prop: window.opera,
	      identity: "Opera",
	      versionSearch: "Version"
	    },
	    {
	      string: navigator.vendor,
	      subString: "iCab",
	      identity: "iCab"
	    },
	    {
	      string: navigator.vendor,
	      subString: "KDE",
	      identity: "Konqueror"
	    },
	    {
	      string: navigator.userAgent,
	      subString: "Firefox",
	      identity: "Firefox"
	    },
	    {
	      string: navigator.vendor,
	      subString: "Camino",
	      identity: "Camino"
	    },
	    {    // for newer Netscapes (6+)
	      string: navigator.userAgent,
	      subString: "Netscape",
	      identity: "Netscape"
	    },
	    {
	      string: navigator.userAgent,
	      subString: "MSIE",
	      identity: "Explorer",
	      versionSearch: "MSIE"
	    },
	    {
	      string: navigator.userAgent,
	      subString: "Gecko",
	      identity: "Mozilla",
	      versionSearch: "rv"
	    },
	    {     // for older Netscapes (4-)
	      string: navigator.userAgent,
	      subString: "Mozilla",
	      identity: "Netscape",
	      versionSearch: "Mozilla"
	    }
	  ],
	  dataOS: [
	    {
	      string: navigator.platform,
	      subString: "Win",
	      identity: "Windows"
	    },
	    {
	      string: navigator.platform,
	      subString: "Mac",
	      identity: "Mac"
	    },
	    {
	      string: navigator.userAgent,
	      subString: "iPhone",
	      identity: "iPhone/iPod"
	    },
	    {
	      string: navigator.userAgent,
	      subString: "iPad",
	      identity: "iPad"
	    },
	    {
	      string: navigator.platform,
	      subString: "Linux",
	      identity: "Linux"
	    }
	  ]
	};
	Browser.detect();

	/*
	 * Copyright (c) 2017-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	const blockElementRegexp = /^(?:ARTICLE|ASIDE|BLOCKQUOTE|BODY|BR|BUTTON|CANVAS|CAPTION|COL|COLGROUP|DD|DIV|DL|DT|EMBED|FIELDSET|FIGCAPTION|FIGURE|FOOTER|FORM|H1|H2|H3|H4|H5|H6|HEADER|HGROUP|HR|LI|MAP|OBJECT|OL|OUTPUT|P|PRE|PROGRESS|SECTION|TABLE|TBODY|TEXTAREA|TFOOT|TH|THEAD|TR|UL|VIDEO)$/;
	const mouseEventsRegexp = /^(?:click|dblclick|mousedown|mouseup|mouseover|mousemove|mouseout|mouseenter|mouseleave)$/;
	const htmlEventsRegexp = /^(?:abort|blur|change|error|focus|load|reset|resize|scroll|select|submit|unload)$/;
	let anonymousId = 1;
	const ieAlphaRegexp = /alpha\(opacity=(.+)\)/;

	class PrimeElement {
	  /**
	   * Creates an Element class for the given DOM element.
	   *
	   * @constructor
	   * @param {Element|EventTarget} element The element
	   */
	  constructor(element) {
	    if (!Utils.isDefined(element.nodeType) || element.nodeType !== 1) {
	      throw new TypeError('You can only pass in DOM element Node objects to the PrimeDocument.Element constructor');
	    }

	    Utils.bindAll(this);
	    this.domElement = element;
	    this.domElement.customEventListeners = [];
	    this.domElement.eventListeners = {};
	  }

	  /**
	   * Regular expression that captures the tagnames of all the block elements in HTML5.
	   *
	   * @type {RegExp}
	   */
	  static get blockElementRegexp() {
	    return blockElementRegexp;
	  }

	  static get mouseEventsRegexp() {
	    return mouseEventsRegexp;
	  }

	  static get htmlEventsRegexp() {
	    return htmlEventsRegexp;
	  }

	  static get anonymousId() {
	    return anonymousId;
	  }

	  static set anonymousId(value) {
	    anonymousId = value;
	  }

	  static get ieAlphaRegexp() {
	    return ieAlphaRegexp;
	  }

	  /**
	   * Static method that wraps an element in a PrimeElement unless it is already wrapped. In that case, it simply
	   * returns the element.
	   *
	   * @param {PrimeElement|Element|EventTarget} element The element to wrap.
	   * @static
	   */
	  static wrap(element) {
	    return (element instanceof PrimeElement) ? element : new PrimeElement(element);
	  }

	  /**
	   * Static method that unwraps an element to a DOM element. This is the inverse of Element.wrap. If this is passed an
	   * Element, it returns domElement. Otherwise, this just returns the element.
	   *
	   * @returns {PrimeElement} This Element.
	   */
	  static unwrap(element) {
	    return (element instanceof PrimeElement) ? element.domElement : element;
	  }

	  /**
	   * Adds the given class (or list of space separated classes) to this Element.
	   *
	   * @param {string} classNames The class name(s) separated by a space.
	   * @returns {PrimeElement} This Element.
	   */
	  addClass(classNames) {
	    let currentClassName = this.domElement.className;
	    if (currentClassName === '') {
	      currentClassName = classNames;
	    } else {
	      const currentClassNameList = this.domElement.className.split(Utils.spaceRegex);
	      const newClassNameList = classNames.split(Utils.spaceRegex);
	      for (let i = 0; i < newClassNameList.length; i++) {
	        if (currentClassNameList.indexOf(newClassNameList[i]) === -1) {
	          currentClassNameList.push(newClassNameList[i]);
	        }
	      }

	      currentClassName = currentClassNameList.join(' ');
	    }

	    this.domElement.className = currentClassName;
	    return this;
	  }

	  /**
	   * @callback PrimeDelegationEventListener
	   *
	   * @param {Event} event the original event
	   * @param {PrimeElement} target the target domElement that matched the registered selector
	   */

	  /**
	   * Attaches an event listener to the element and will only invoke the listener when the event target matches
	   * the provided selector.
	   *
	   * The intent of this function is to provide a delegated listener and handle events from nested elements.
	   *
	   * @param {string} event The name of the event
	   * @param  {string} selector The selector to match against the Element
	   * @param {PrimeDelegationEventListener} listener The event listener function
	   */
	  addDelegatedEventListener(event, selector, listener) {
	    this.domElement.delegatedListeners =  this.domElement.delegatedListeners || [];
	    let allDelegatedListeners = this.domElement.delegatedListeners;

	    // Store the event listeners in the following format:
	    //   [ event_type -> [ selector -> [ listeners ] ] ]
	    //
	    // Example:
	    //   [ 'click' -> [ 'a.foo' -> [ funcA, funcB ] ] ]

	    if (!(event in allDelegatedListeners)) {
	      allDelegatedListeners[event] = [];
	    }

	    if (!(selector in allDelegatedListeners[event])) {
	      allDelegatedListeners[event][selector] = [];
	    }

	    let delegatedListeners = allDelegatedListeners[event][selector] || [];
	    if (!(listener in delegatedListeners)) {
	      delegatedListeners.push(listener);
	    }

	    this.addEventListener(event, this._handleDelegatedEvent);
	  }

	  /**
	   * Attaches an event listener to this Element.
	   *
	   * @param {string} event The name of the event.
	   * @param {Function} listener The event listener function.
	   * @returns {PrimeElement} This Element.
	   */
	  addEventListener(event, listener) {
	    if (event.indexOf(':') === -1) {
	      // Traditional event
	      this.domElement.eventListeners = this.domElement.eventListeners || {};
	      this.domElement.eventListeners[event] = this.domElement.eventListeners[event] || [];
	      if (this.domElement.eventListeners[event].indexOf(listener) === -1) {
	        this.domElement.eventListeners[event].push(listener);
	      }
	      this.domElement.addEventListener(event, listener, false);
	    } else {
	      // Custom event
	      this.domElement.customEventListeners = this.domElement.customEventListeners || {};
	      this.domElement.customEventListeners[event] = this.domElement.customEventListeners[event] || [];
	      if (this.domElement.customEventListeners[event].indexOf(listener) === -1) {
	        this.domElement.customEventListeners[event].push(listener);
	      }
	    }

	    return this;
	  }

	  /**
	   * Appends the given element to this element. If the given element already exists in the DOM, it is removed from its
	   * current location and placed at the end of this element.
	   *
	   * @param {PrimeElement|Node} element The element to append.
	   * @returns {PrimeElement} This Element.
	   */
	  appendElement(element) {
	    const domElement = (element instanceof PrimeElement) ? element.domElement : element;
	    if (domElement.parentNode) {
	      domElement.parentNode.removeChild(domElement);
	    }

	    this.domElement.appendChild(domElement);
	    return this;
	  }

	  /**
	   * Appends the given HTML string to this element.
	   *
	   * @param {string} html The HTML to append.
	   * @returns {PrimeElement} This Element.
	   */
	  appendHTML(html) {
	    this.domElement.insertAdjacentHTML('beforeend', html);
	    return this;
	  }

	  /**
	   * Inserts this Element (which must be a newly created Element) into the DOM inside at the very end of the given
	   * element.
	   *
	   * @param {PrimeElement|Node} element The element to insert this Element into.
	   * @returns {PrimeElement} This Element.
	   */
	  appendTo(element) {
	    // Error out for now if this element is in the document so we can punt on cloning for now
	    if (this.domElement.parentNode) {
	      throw new TypeError('You can only insert new PrimeElements for now');
	    }

	    const domElement = (element instanceof PrimeElement) ? element.domElement : element;
	    if (domElement.parentNode) {
	      domElement.appendChild(this.domElement);
	    } else {
	      throw new TypeError('The element you passed into appendTo is not in the DOM. You can\'t insert a PrimeElement inside an element that isn\'t in the DOM yet.');
	    }

	    return this;
	  }

	  /**
	   * Fires an event on the Element.
	   *
	   * @param {string} event The name of the event.
	   * @param {Object} [memo] Assigned to the memo field of the event.
	   * @param {Object} [target] The target.
	   * @param {boolean} [bubbling] If the event is bubbling, defaults to true.
	   * @param {boolean} [cancelable] If the event is cancellable, defaults to true.
	   * @returns {PrimeElement} This Element.
	   */
	  fireEvent(event, memo, target, bubbling, cancelable) {
	    memo = Utils.isDefined(memo) ? memo : {};
	    target = Utils.isDefined(target) ? target : this;
	    bubbling = Utils.isDefined(bubbling) ? bubbling : true;
	    cancelable = Utils.isDefined(cancelable) ? cancelable : true;

	    let evt;
	    if (event.indexOf(':') === -1) {
	      // Traditional event
	      if (document.createEventObject) {
	        // Dispatch for IE
	        evt = document.createEventObject();
	        evt.memo = memo || {};
	        evt.cancelBubble = !bubbling;
	        this.domElement.fireEvent('on' + event, evt);
	      } else if (document.createEvent) {
	        // Dispatch for others
	        if (PrimeElement.mouseEventsRegexp.test(event)) {
	          evt = document.createEvent("MouseEvents");
	          evt.initMouseEvent(event, bubbling, cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	        } else if (PrimeElement.htmlEventsRegexp.test(event)) {
	          evt = document.createEvent("HTMLEvents");
	          evt.initEvent(event, bubbling, cancelable);
	        } else {
	          throw new TypeError('Invalid event [' + event + ']');
	        }

	        evt.memo = memo || {};
	        this.domElement.dispatchEvent(evt);
	      } else {
	        throw new TypeError('Unable to fire event. Neither createEventObject nor createEvent methods are available');
	      }
	    } else {
	      // Custom event
	      this.domElement.customEventListeners[event] = this.domElement.customEventListeners[event] || [];
	      evt = {event: event, memo: memo, target: target};
	      for (let index in this.domElement.customEventListeners[event]) {
	        if (this.domElement.customEventListeners[event].hasOwnProperty(index)) {
	          this.domElement.customEventListeners[event][index](evt);
	        }
	      }
	    }

	    return this;
	  }

	  /**
	   * Fires a custom event on the Element using the given event object rather than creating a new event object. This is
	   * useful for pass-through event handling.
	   *
	   * @param {string} event The name of the event.
	   * @param {Object} eventObj The event object to pass to the handlers.
	   * @returns {PrimeElement} This Element.
	   */
	  fireCustomEvent(event, eventObj) {
	    eventObj = Utils.isDefined(eventObj) ? eventObj : {};
	    if (event.indexOf(':') === -1) {
	      throw new TypeError('This method can only be used for custom events');
	    }

	    // Custom event
	    this.domElement.customEventListeners[event] = this.domElement.customEventListeners[event] || [];
	    for (let index in this.domElement.customEventListeners[event]) {
	      if (this.domElement.customEventListeners[event].hasOwnProperty(index)) {
	        this.domElement.customEventListeners[event][index](eventObj);
	      }
	    }

	    return this;
	  }

	  /**
	   * Puts the focus on this element.
	   *
	   * @returns {PrimeElement} This Element.
	   */
	  focus() {
	    this.domElement.focus();
	    return this;
	  }

	  /**
	   * Returns the absolute top of this element relative to the document.
	   *
	   * @returns {number} The number of pixels that this element is from the top of the document.
	   */
	  getAbsoluteTop() {
	    let top = 0;
	    let e = this.domElement;
	    while (e) {
	      top += e.offsetTop;
	      e = e.offsetParent;
	    }

	    return top;
	  }

	  /**
	   * Returns the value of the given attribute.
	   *
	   * @param {string} name The attribute name.
	   * @returns {?string} This attribute value or null.
	   */
	  getAttribute(name) {
	    const attr = this.domElement.attributes.getNamedItem(name);
	    if (attr) {
	      return attr.value;
	    }

	    return null;
	  }

	  /**
	   * Returns all of the attributes on the element as an object.
	   *
	   * @returns {object} This attributes or an empty object if there are no attributes on this element.
	   */
	  getAttributes() {
	    const attrs = {};
	    if (this.domElement.hasAttributes()) {
	      for (let i = 0; i < this.domElement.attributes.length; i++) {
	        attrs[this.domElement.attributes[i].name] = this.domElement.attributes[i].value;
	      }
	    }

	    return attrs;
	  }

	  /**
	   * Gets the viewable height of the Element as an integer value in pixels. This height includes border, padding and scroll bar but excludes the margins.
	   *
	   * @returns {number} The height as pixels (number) or a string.
	   */
	  getBorderedHeight() {
	    return this.domElement.offsetHeight;
	  }

	  /**
	   * Gets the width of the Element as an integer value. This width includes border, padding and scroll bar but excludes the margins.
	   *
	   * @returns {number} The height in pixels.
	   */
	  getBorderedWidth() {
	    return this.domElement.offsetWidth;
	  }

	  /**
	   * @returns {number} The bottom position (in pixels) of the current element.
	   */
	  getBottom() {
	    return this.domElement.getBoundingClientRect().bottom;
	  }

	  /**
	   * Gets the children elements of this Element, optionally reduced to those matching the optional selector.
	   *
	   * @param {string} [selector] The selector. Optional, if not provided all children will be returned.
	   * @returns {PrimeElementList} The children.
	   */
	  getChildren(selector) {
	    if (!Utils.isDefined(selector)) {
	      return new PrimeElementList(this.domElement.children);
	    }

	    const matched = [];
	    for (let i = 0; i < this.domElement.children.length; i++) {
	      const child = this.domElement.children[i];
	      if (child.matches(selector)) {
	        matched.push(child);
	      }
	    }

	    return new PrimeElementList(matched);
	  }

	  /**
	   * Gets the class value of the current element. This might be a single class or multiple class names.
	   *
	   * @returns {string} The class.
	   */
	  getClass() {
	    return this.domElement.className;
	  }

	  /**
	   * Gets the computed style information for this Element.
	   *
	   * @returns {IEElementStyle|CSSStyleDeclaration} The style information.
	   */
	  getComputedStyle() {
	    return (this.domElement.currentStyle) ? this.domElement.currentStyle : document.defaultView.getComputedStyle(this.domElement, null);
	  }

	  /**
	   * Calculates the location of this element with respect to the document rather than the elements parent, offset parent
	   * or scroll position.
	   *
	   * @returns {{top: number, left: number}}
	   */
	  getCoordinates() {
	    const box = this.domElement.getBoundingClientRect();

	    const body = document.body;
	    const documentElement = document.documentElement;

	    const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;
	    const scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;

	    const clientTop = documentElement.clientTop || body.clientTop || 0;
	    const clientLeft = documentElement.clientLeft || body.clientLeft || 0;

	    const top = box.top + scrollTop - clientTop;
	    const left = box.left + scrollLeft - clientLeft;

	    return {top: Math.round(top), left: Math.round(left)};
	  }

	  /**
	   * Returns the dataset if it exists, otherwise, this creates a new dataset object and returns it.
	   *
	   * @returns {object} This dataset object.
	   */
	  getDataSet() {
	    if (this.domElement.dataset) {
	      return this.domElement.dataset;
	    }

	    this.domElement.dataset = {};
	    const attrs = this.getAttributes();
	    for (let prop in attrs) {
	      if (attrs.hasOwnProperty(prop) && prop.indexOf('data-') === 0) {
	        const dataName = prop.substring(5).replace(/-([a-z])/g, function(g) {
	          return g[1].toUpperCase();
	        });
	        this.domElement.dataset[dataName] = attrs[prop];
	      }
	    }
	    return this.domElement.dataset;
	  }

	  /**
	   * Returns the data value if it exists, otherwise returns null.
	   *
	   * @param {string} name The attribute name.
	   * @returns {string} This attribute value or null.
	   */
	  getDataAttribute(name) {
	    return this.getDataSet()[name] || null;
	  }

	  /**
	   * Get the first child element of this Element, optionally filtered using the optional selector.
	   *
	   * @param {string} [selector] The selector. Optional.
	   * @returns {PrimeElement} The first child element or null if the element has no children or a selector was provided and nothing matched the selector..
	   */
	  getFirstChild(selector) {
	    const lastChild = this.getChildren(selector)[0];
	    if (!Utils.isDefined(lastChild)) {
	      return null;
	    }
	    return lastChild;
	  }

	  /**
	   * Gets the viewable height of the Element as an integer value in pixels. This height includes padding and scroll bar
	   * but excludes the margin and borders. This is often called the innerHeight of the element.
	   *
	   * @returns {number} The height as pixels (number) or a string.
	   */
	  getHeight() {
	    const computedStyle = this.getComputedStyle();
	    const offsetHeight = this.domElement.offsetHeight;
	    const borderTop = computedStyle['borderTopWidth'];
	    const borderBottom = computedStyle['borderBottomWidth'];
	    return offsetHeight - Utils.parseCSSMeasure(borderTop) - Utils.parseCSSMeasure(borderBottom);
	  }

	  /**
	   * Gets the inner HTML content of the Element.
	   *
	   * @returns {string} The HTML content.
	   */
	  getHTML() {
	    return this.domElement.innerHTML;
	  }

	  /**
	   * Gets the ID of this element from the domElement.
	   *
	   * @returns {string} ID The id of the domElement if it exists.
	   */
	  getId() {
	    return this.domElement.id;
	  }

	  /**
	   * Get the last child element of this Element, optionally filtered using the optional selector.
	   *
	   * @param {string} [selector] The selector. Optional.
	   * @returns {PrimeElement} The last child element or null if the element has no children or a selector was provided and nothing matched the selector..
	   */
	  getLastChild(selector) {
	    const elementList = this.getChildren(selector);
	    if (elementList.length > 0) {
	      return elementList[elementList.length - 1];
	    }
	    return null;
	  }

	  /**
	   * @returns {number} The left position (in pixels) of the current element.
	   */
	  getLeft() {
	    return this.domElement.getBoundingClientRect().left;
	  }

	  /**
	   * @returns {PrimeElement} This elements next sibling or null.
	   */
	  getNextSibling() {
	    let sibling = this.domElement.nextSibling;
	    while (sibling !== null && sibling.nodeType !== 1) {
	      sibling = sibling.nextSibling;
	    }

	    if (sibling === null) {
	      return null;
	    }

	    return new PrimeElement(sibling);
	  }

	  /**
	   * The elements offset left in pixels.
	   *
	   * @returns {number} The offset left.
	   */
	  getOffsetLeft() {
	    return this.domElement.offsetLeft;
	  }

	  /**
	   * The elements offset top in pixels.
	   *
	   * @returns {number} The offset top.
	   */
	  getOffsetTop() {
	    return this.domElement.offsetTop;
	  }

	  /**
	   * Retrieves the opacity value for the Element. This handles the IE alpha filter.
	   *
	   * @returns {number} The opacity value.
	   */
	  getOpacity() {
	    const computedStyle = this.getComputedStyle();
	    let opacity = 1.0;
	    if (Browser.name === 'Explorer' && Browser.version < 9) {
	      const filter = computedStyle['filter'];
	      if (filter !== undefined && filter !== '') {
	        const matches = PrimeElement.ieAlphaRegexp.match(filter);
	        if (matches.length > 0) {
	          opacity = parseFloat(matches[0]);
	        }
	      }
	    } else {
	      opacity = parseFloat(computedStyle['opacity']);
	    }

	    return opacity;
	  }

	  /**
	   * @returns {PrimeElementList} If this element is a select box, this returns the options of the select box in
	   *          an ElementList.
	   */
	  getOptions() {
	    if (this.getTagName() !== 'SELECT') {
	      throw new TypeError('You can only get the options for select elements');
	    }

	    return new PrimeElementList(this.domElement.options);
	  }

	  /**
	   * Gets the outer height of the element, including the margins. This does not include the padding or borders.
	   *
	   * @returns {number} The outer height of the element.
	   */
	  getOuterHeight() {
	    const computedStyle = this.getComputedStyle();
	    const offsetHeight = this.domElement.offsetHeight;
	    const marginTop = computedStyle['marginTop'];
	    const marginBottom = computedStyle['marginBottom'];
	    return offsetHeight + Utils.parseCSSMeasure(marginTop) + Utils.parseCSSMeasure(marginBottom);
	  }

	  /**
	   * Gets the outer HTML content of the Element.
	   *
	   * @returns {string} The outer HTML content.
	   */
	  getOuterHTML() {
	    return this.domElement.outerHTML;
	  }

	  /**
	   * Gets the outer width of the element, including the margins. This does not include the padding or borders.
	   *
	   * @returns {number} The outer width of the element.
	   */
	  getOuterWidth() {
	    const computedStyle = this.getComputedStyle();
	    const offsetWidth = this.domElement.offsetWidth;
	    const marginLeft = computedStyle['marginLeft'];
	    const marginRight = computedStyle['marginRight'];
	    return offsetWidth + Utils.parseCSSMeasure(marginLeft) + Utils.parseCSSMeasure(marginRight);
	  }

	  /**
	   * Returns this element's parent as a PrimeElement.
	   *
	   * @returns {PrimeElement} This element's parent or null if there is no parent
	   */
	  getParent() {
	    if (Utils.isDefined(this.domElement.parentElement)) {
	      return new PrimeElement(this.domElement.parentElement);
	    } else {
	      return null;
	    }
	  }

	  /**
	   * @returns {PrimeElement} This elements previous sibling or null.
	   */
	  getPreviousSibling() {
	    let sibling = this.domElement.previousSibling;
	    while (sibling !== null && sibling.nodeType !== 1) {
	      sibling = sibling.previousSibling;
	    }

	    if (sibling === null) {
	      return null;
	    }

	    return new PrimeElement(sibling);
	  }

	  /**
	   * @returns {number} The zIndex style of this element based on the element or the first positioned parent.
	   */
	  getRelativeZIndex() {
	    let e = this;
	    while (e !== null && e.getComputedStyle()['zIndex'] === 'auto') {
	      e = e.getParent();
	    }
	    return e === null ? 0 : parseInt(e.getComputedStyle()['zIndex']);
	  }

	  /**
	   * @returns {number} The right position (in pixels) of the current element.
	   */
	  getRight() {
	    return this.domElement.getBoundingClientRect().right;
	  }

	  /**
	   * @returns {number} The scroll height of this element.
	   */
	  getScrollHeight() {
	    return this.domElement.scrollHeight;
	  }

	  /**
	   * @returns {number} The scroll left position of this element.
	   */
	  getScrollLeft() {
	    return this.domElement.scrollLeft;
	  }

	  /**
	   * @returns {number} The scroll top position of this element.
	   */
	  getScrollTop() {
	    return this.domElement.scrollTop;
	  }

	  /**
	   * @returns {number} The scroll width of this element.
	   */
	  getScrollWidth() {
	    return this.domElement.scrollWidth;
	  }

	  /**
	   * Retrieves the selected texts of this Element, if the element is a select. If it is anything else this returns
	   * null.
	   *
	   * @returns {Array} The texts of this Element.
	   */
	  getSelectedTexts() {
	    let texts;
	    if (this.domElement.tagName === 'SELECT') {
	      texts = [];
	      for (let i = 0; i < this.domElement.options.length; i++) {
	        if (this.domElement.options[i].selected) {
	          texts.push(this.domElement.options[i].text);
	        }
	      }
	    } else {
	      texts = null;
	    }

	    return texts;
	  }

	  /**
	   * Retrieves the values of this Element, if the element is a checkbox or select. If it is anything else this returns
	   * null.
	   *
	   * @returns {Array} The values of this Element.
	   */
	  getSelectedValues() {
	    let values;
	    if (this.domElement.tagName === 'INPUT' && (this.domElement.type === 'checkbox' || this.domElement.type === 'radio')) {
	      values = [];
	      const name = this.domElement.name;
	      const form = PrimeDocument.queryUp('form', this.domElement);
	      PrimeDocument.query('input[name="' + name + '"]', form).each(function(element) {
	        if (element.isChecked()) {
	          values.push(element.getValue());
	        }
	      });
	    } else if (this.domElement.tagName === 'SELECT') {
	      values = [];
	      for (let i = 0; i < this.domElement.length; i++) {
	        if (this.domElement.options[i].selected) {
	          values.push(this.domElement.options[i].value);
	        }
	      }
	    } else {
	      values = null;
	    }

	    return values;
	  }

	  /**
	   * Gets value of a style attribute.
	   *
	   * @returns {string} The style value.
	   */
	  getStyle(name) {
	    name = Utils.convertStyleName(name);
	    return this.domElement.style[name];
	  }

	  /**
	   * @returns {string} The tag name of this element as a string. This is always uppercase.
	   */
	  getTagName() {
	    return this.domElement.tagName;
	  }

	  /**
	   * Retrieves the text content of this Element.
	   *
	   * @returns {string} The text contents of this Element.
	   */
	  getTextContent() {
	    return this.domElement.innerText ? this.domElement.innerText : this.domElement.textContent;
	  }

	  /**
	   * @returns {number} The top position (in pixels) of the current element.
	   */
	  getTop() {
	    return this.domElement.getBoundingClientRect().top;
	  }

	  /**
	   * Gets the width of the Element as an integer value. This width includes padding and scroll bar but excludes the margin and borders.
	   * This is often called the innerWidth of the element.
	   *
	   * @returns {number} The height in pixels.
	   */
	  getWidth() {
	    const computedStyle = this.getComputedStyle();
	    const offsetWidth = this.domElement.offsetWidth;
	    const borderLeft = computedStyle['borderLeftWidth'];
	    const borderRight = computedStyle['borderRightWidth'];
	    return offsetWidth - Utils.parseCSSMeasure(borderLeft) - Utils.parseCSSMeasure(borderRight);
	  }

	  /**
	   * Retrieves the value attribute of this Element. This works on all checkboxes, radio buttons, text, text areas, and
	   * options. However, this does not retrieve the selected options in a select box, checked checkboxes or checked radio
	   * buttons. Use the getSelectedValues function for that.
	   *
	   * @returns {string} The value of this Element.
	   */
	  getValue() {
	    return this.domElement.value;
	  }

	  /**
	   * Returns true if the element has one or all class names
	   *
	   * @param {string} classNames The class name(s) in a string.
	   * @returns {boolean} True if all class names are present.
	   */
	  hasClass(classNames) {
	    const currentClassNames = this.domElement.className;
	    if (currentClassNames === '') {
	      return classNames === '';
	    }

	    const currentClassNameList = currentClassNames.split(Utils.spaceRegex);
	    const findClassNameList = classNames.split(Utils.spaceRegex);
	    for (let i = 0; i < findClassNameList.length; i++) {
	      if (currentClassNameList.indexOf(findClassNameList[i]) === -1) {
	        return false;
	      }
	    }

	    return true;
	  }

	  /**
	   * Hides the Element by setting the display style to none.
	   *
	   * @returns {PrimeElement} This Element.
	   */
	  hide() {
	    this.domElement.style.display = 'none';
	    return this;
	  }

	  /**
	   * Inserts this Element into the DOM after the given element, removing it from it's parent if it's an existing element.
	   *
	   * @param {PrimeElement|Element} element The element to insert this Element after.
	   * @returns {PrimeElement} This Element.
	   */
	  insertAfter(element) {
	    if (this.domElement.parentNode) {
	      this.domElement.parentNode.removeChild(this.domElement);
	    }

	    const domElement = (element instanceof PrimeElement) ? element.domElement : element;
	    const parentElement = domElement.parentNode;
	    if (parentElement) {
	      parentElement.insertBefore(this.domElement, domElement.nextSibling);
	    } else {
	      throw new TypeError('The element you passed into insertAfter is not in the DOM. You can\'t insert a PrimeElement after an element that isn\'t in the DOM yet.');
	    }

	    return this;
	  }

	  /**
	   * Inserts this Element into the DOM before the given element, removing it from it's parent if it's an existing element.
	   *
	   * @param {PrimeElement|Element} element The element to insert this Element before.
	   * @returns {PrimeElement} This Element.
	   */
	  insertBefore(element) {
	    if (this.domElement.parentNode) {
	      this.domElement.parentNode.removeChild(this.domElement);
	    }

	    const domElement = (element instanceof PrimeElement) ? element.domElement : element;
	    const parentElement = domElement.parentNode;
	    if (parentElement) {
	      parentElement.insertBefore(this.domElement, domElement);
	    } else {
	      throw new TypeError('The element you passed into insertBefore is not in the DOM. You can\'t insert a PrimeElement before an element that isn\'t in the DOM yet.');
	    }

	    return this;
	  }

	  /**
	   * Inserts the given HTML snippet directly after this element.
	   *
	   * @param {string} html The HTML string.
	   * @returns {PrimeElement} This Element.
	   */
	  insertHTMLAfter(html) {
	    this.domElement.insertAdjacentHTML('afterend', html);
	    return this;
	  }

	  /**
	   * Inserts the given HTML snippet inside this element, before its first child.
	   *
	   * @param {string} html The HTML string.
	   * @returns {PrimeElement} This Element.
	   */
	  insertHTMLAfterBegin(html) {
	    this.domElement.insertAdjacentHTML('afterbegin', html);
	    return this;
	  }

	  /**
	   * Inserts the given text after this Element.
	   *
	   * @param {string} text The text to insert.
	   * @returns {PrimeElement} This Element.
	   */
	  insertTextAfter(text) {
	    if (!this.domElement.parentNode) {
	      throw new TypeError('This Element is not currently in the DOM');
	    }

	    const textNode = document.createTextNode(text);
	    this.domElement.parentNode.insertBefore(textNode, this.domElement.nextSibling);

	    return this;
	  }

	  /**
	   * Inserts the given text before this Element.
	   *
	   * @param {string} text The text to insert.
	   * @returns {PrimeElement} This Element.
	   */
	  insertTextBefore(text) {
	    if (!this.domElement.parentNode) {
	      throw new TypeError('This Element is not currently in the DOM');
	    }

	    const textNode = document.createTextNode(text);
	    this.domElement.parentNode.insertBefore(textNode, this.domElement);

	    return this;
	  }

	  /**
	   * Returns true if the element matches the provided selector.
	   *
	   * @param {string} selector to match against the Element
	   * @returns {boolean} True if the element matches the selector, false if it does not match the selector.
	   */
	  is(selector) {
	    return this.domElement.matches(selector);
	  }

	  /**
	   * Returns whether or not the element is checked. If the element is not a checkbox or a radio this returns false.
	   *
	   * @returns {boolean} True if the element is selected, false if it isn't or is not a checkbox or a radio.
	   */
	  isChecked() {
	    return this.domElement.tagName === 'INPUT' && (this.domElement.type === 'checkbox' || this.domElement.type === 'radio') && this.domElement.checked;
	  }

	  /**
	   * Determines if this element is a child of the given element.
	   *
	   * @param {PrimeElement|Node} element The element to check to see if this element is a child of.
	   * @returns {boolean} True if this element is a child of the given element, false otherwise.
	   */
	  isChildOf(element) {
	    const domElement = element instanceof PrimeElement ? element.domElement : element;
	    let parent = this.domElement.parentNode;
	    while (domElement !== parent && parent !== null) {
	      parent = parent.parentNode;
	    }

	    return domElement === parent;
	  }

	  /**
	   * @returns {boolean} Whether or not this element is disabled according to the disabled property.
	   */
	  isDisabled() {
	    return this.domElement.disabled;
	  }

	  /**
	   * @returns {boolean} True if this element has focus.
	   */
	  isFocused() {
	    return document.activeElement === this.domElement;
	  }

	  /**
	   * @return {boolean} True if this element is an INPUT, SELECT or TEXTAREA.
	   */
	  isInput() {
	    const tagName = this.getTagName();
	    return tagName === 'SELECT' || tagName === 'INPUT' || tagName === 'TEXTAREA';
	  }

	  /**
	   * Determines if the this element is inside the given element
	   *
	   * @param target {PrimeElement} The target element.
	   * @returns {boolean} True if this element is inside the given element.
	   */
	  isInside(target) {
	    if (this.domElement === document.body || this.domElement === document.documentElement || this.domElement === document) {
	      return false;
	    }

	    let parent = this.getParent();
	    while (parent.domElement !== document.body) {
	      if (parent.domElement === target.domElement) {
	        return true;
	      }
	      parent = parent.getParent();
	    }

	    return false;
	  }

	  /**
	   * Returns whether or not the element is selected. If the element is not an option this returns false.
	   *
	   * @returns {boolean} True if the element is selected, false if it isn't or is not an option.
	   */
	  isSelected() {
	    return this.domElement.tagName === 'OPTION' && this.domElement.selected;
	  }

	  /**
	   * Determines if the element is visible using its display and visibility styles.
	   *
	   * @returns {boolean} True if the element is visible, false otherwise. This might return an invalid value if the element
	   * is absolutely positioned and off the screen, but is still technically visible.
	   */
	  isVisible() {
	    const computedStyle = this.getComputedStyle();
	    return computedStyle['display'] !== 'none' && computedStyle['visibility'] !== 'hidden';
	  }

	  /**
	   * Inserts this Element (which must be a newly created Element) into the DOM inside at the very beginning of the given
	   * element.
	   *
	   * @param {PrimeElement|Element} element The element to insert this Element into.
	   * @returns {PrimeElement} This Element.
	   */
	  prependTo(element) {
	    // Error out for now if this element is in the document so we can punt on cloning for now
	    if (this.domElement.parentNode) {
	      throw new TypeError('You can only insert new PrimeElements for now');
	    }

	    const domElement = (element instanceof PrimeElement) ? element.domElement : element;
	    if (domElement.parentNode) {
	      domElement.insertBefore(this.domElement, domElement.firstChild);
	    } else {
	      throw new TypeError('The element you passed into prependTo is not in the DOM. You can\'t insert a PrimeElement inside an element that isn\'t in the DOM yet.');
	    }

	    return this;
	  }

	  /**
	   * Queries the DOM using the given selector starting at this element and returns all the matched elements.
	   *
	   * @param {string} selector The selector.
	   * @returns {PrimeElementList} An element list.
	   */
	  query(selector) {
	    return PrimeDocument.query(selector, this);
	  }

	  /**
	   * Queries the DOM using the given selector starting at this element and returns the first matched element
	   * or null if there aren't any matches.
	   *
	   * @param {string} selector The selector.
	   * @returns {PrimeElement} An element or null.
	   */
	  queryFirst(selector) {
	    return PrimeDocument.queryFirst(selector, this);
	  }

	  /**
	   * Queries the DOM using the given selector starting at this element and returns the last matched element
	   * or null if there aren't any matches.
	   *
	   * @param {string} selector The selector.
	   * @returns {PrimeElement} An element or null.
	   */
	  queryLast(selector) {
	    return PrimeDocument.queryLast(selector, this);
	  }

	  /**
	   * Traverses up the DOM from this element and looks for a match to the selector.
	   *
	   * @param {string} selector The selector.
	   * @returns {PrimeElement} An element or null.
	   */
	  queryUp(selector) {
	    return PrimeDocument.queryUp(selector, this);
	  }

	  /**
	   * Removes all of the event listeners for the given element.
	   *
	   * @returns {PrimeElement} This Element.
	   */
	  removeAllEventListeners() {
	    for (let event in this.domElement.eventListeners) {
	      if (this.domElement.eventListeners.hasOwnProperty(event)) {
	        for (let i = 0; i < this.domElement.eventListeners[event].length; i++) {
	          this._internalRemoveEventListener(event, this.domElement.eventListeners[event][i]);
	        }
	      }
	    }

	    this.domElement.eventListeners = {};
	    this.domElement.customEventListeners = {};

	    return this;
	  }

	  /**
	   * Removes an attribute from the Element
	   *
	   * @param {string} name The name of the attribute.
	   * @returns {PrimeElement} This Element.
	   */
	  removeAttribute(name) {
	    this.domElement.removeAttribute(name);
	    return this;
	  }

	  /**
	   * Removes the given class (or list of space separated classes) from this Element.
	   *
	   * @param {string} classNames The class name(s).
	   * @returns {PrimeElement} This Element.
	   */
	  removeClass(classNames) {
	    const currentClassName = this.domElement.className;
	    if (currentClassName === '') {
	      return this;
	    }

	    const currentClassNameList = currentClassName.split(Utils.spaceRegex);
	    const removeClassNameList = classNames.split(Utils.spaceRegex);
	    for (let i = 0; i < removeClassNameList.length; i++) {
	      Utils.removeFromArray(currentClassNameList, removeClassNameList[i]);
	    }

	    this.domElement.className = currentClassNameList.join(' ');
	    return this;
	  }

	  /**
	   * Removes an event listener for a specific event from this Element, you must have attached using addEventListener
	   *
	   * @param {string} event The name of the event.
	   * @param {*} listener The event listener that was bound.
	   * @returns {PrimeElement} This Element.
	   */
	  removeEventListener(event, listener) {
	    let listeners;
	    if (event.indexOf(':') === -1) {
	      this._internalRemoveEventListener(event, listener);
	      listeners = this.domElement.eventListeners[event];
	    } else {
	      listeners = this.domElement.customEventListeners[event];
	    }

	    if (listeners) {
	      Utils.removeFromArray(listeners, listener);
	    }

	    return this;
	  }

	  /**
	   * Removes all of the event listeners for the given event from this element.
	   *
	   * @param {string} event The name of the event to remove the listeners for.
	   * @returns {PrimeElement} This Element.
	   */
	  removeEventListeners(event) {
	    if (event.indexOf(':') === -1) {
	      if (this.domElement.eventListeners[event]) {
	        for (let i = 0; i < this.domElement.eventListeners[event].length; i++) {
	          this._internalRemoveEventListener(event, this.domElement.eventListeners[event][i]);
	        }

	        delete this.domElement.eventListeners[event];
	      }
	    } else {
	      if (this.domElement.customEventListeners[event]) {
	        delete this.domElement.customEventListeners[event];
	      }
	    }

	    return this;
	  }

	  /**
	   * Removes all of the event listeners for the given pattern from this element.
	   *
	   * @param {RegExp} pattern The regular expression that matches the names of the events to remove the listeners for.
	   * @returns {PrimeElement} This Element.
	   */
	  removeEventListenersByPattern(pattern) {
	    for (let event in this.domElement.eventListeners) {
	      if (this.domElement.eventListeners.hasOwnProperty(event) && pattern.test(event)) {
	        for (let i = 0; i < this.domElement.eventListeners[event].length; i++) {
	          this._internalRemoveEventListener(event, this.domElement.eventListeners[event][i]);
	        }

	        delete this.domElement.eventListeners[event];
	      }
	    }

	    for (let event in this.domElement.customEventListeners) {
	      if (this.domElement.customEventListeners.hasOwnProperty(event) && pattern.test(event)) {
	        delete this.domElement.customEventListeners[event];
	      }
	    }

	    return this;
	  }

	  /**
	   * Removes this Element from the DOM. If the Element isn't in the DOM this does nothing.
	   *
	   * @returns {PrimeElement} This Element.
	   */
	  removeFromDOM() {
	    if (this.domElement.parentNode) {
	      this.domElement.parentNode.removeChild(this.domElement);
	    }

	    return this;
	  }

	  /**
	   * Create a selected range for this element.
	   *
	   * @returns {PrimeElement} This Element.
	   */
	  selectElementContents() {
	    let range;
	    let selection;

	    if (document.body.createTextRange) {
	      /* IE */
	      range = document.body.createTextRange();
	      range.moveToElementText(this.domElement);
	      range.select();
	    } else if (window.getSelection) {
	      /* Rest of the world */
	      selection = window.getSelection();
	      range = document.createRange();
	      range.selectNodeContents(this.domElement);
	      selection.removeAllRanges();
	      selection.addRange(range);
	    }

	    return this;
	  }

	  /**
	   * Scrolls this Element into the visible area of the browser window.
	   *
	   * @returns {PrimeElement} This Element.
	   */
	  scrollIntoView() {
	    this.domElement.scrollIntoView();
	    return this;
	  }

	  /**
	   * Scrolls this element to the given horizontal position.
	   *
	   * @param {number} position The position to scroll the element to.
	   * @returns {PrimeElement} This Element.
	   */
	  scrollLeftTo(position) {
	    this.domElement.scrollLeft = position;
	    return this;
	  }

	  /**
	   * Scrolls this element to the given vertical position.
	   *
	   * @param {number} position The position to scroll the element to.
	   * @returns {PrimeElement} This Element.
	   */
	  scrollTo(position) {
	    this.domElement.scrollTop = position;
	    return this;
	  }

	  /**
	   * Scrolls this element to the bottom.
	   *
	   * @returns {PrimeElement} This Element.
	   */
	  scrollToBottom() {
	    this.domElement.scrollTop = this.domElement.scrollHeight;
	    return this;
	  }

	  /**
	   * Scrolls this element to the top.
	   *
	   * @returns {PrimeElement} This Element.
	   */
	  scrollToTop() {
	    this.domElement.scrollTop = 0;
	    return this;
	  }

	  /**
	   * Sets an attribute of the Element.
	   *
	   * @param {string} name The attribute name
	   * @param {number|string} value The attribute value
	   * @returns {PrimeElement} This Element.
	   */
	  setAttribute(name, value) {
	    if (typeof value === 'number') {
	      value = value.toString();
	    }
	    if (this.domElement.setAttribute) {
	      this.domElement.setAttribute(name, value);
	    } else {
	      const attribute = document.createAttribute(name);
	      attribute.nodeValue = value;
	      this.domElement.setAttributeNode(attribute);
	    }

	    return this;
	  }

	  /**
	   * Sets a data- attribute of the Element.
	   *
	   * Example: setDataAttribute('fooBar', 'baz');
	   *  is equivalent to calling setAttribute('data-foo-bar', 'baz');
	   *
	   * @param {string} name The attribute name
	   * @param {number|string} value The attribute value
	   * @returns {PrimeElement} This Element.
	   */
	  setDataAttribute(name, value) {
	    const dataName = 'data-' + name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
	    return this.setAttribute(dataName, value);
	  }

	  /**
	   * Sets multiple attributes of the Element from the hash
	   *
	   * @param {Object} attributes An object of key value style pairs.
	   * @returns {PrimeElement} This Element.
	   */
	  setAttributes(attributes) {
	    for (let key in attributes) {
	      if (attributes.hasOwnProperty(key)) {
	        this.setAttribute(key, attributes[key]);
	      }
	    }
	    return this;
	  }

	  /**
	   * If this element is a checkbox or radio button, this sets the checked field on the DOM object equal to the given
	   * value.
	   *
	   * @param {boolean} value The value to set the checked state of this element to.
	   * @returns {PrimeElement} This Element.
	   */
	  setChecked(value) {
	    this.domElement.checked = value;
	    return this;
	  }

	  /**
	   * Sets if this element is disabled or not. This works with any element that responds to the disabled property.
	   *
	   * @param {boolean} value The value to set the disabled state of this element to.
	   * @returns {PrimeElement} This Element.
	   */
	  setDisabled(value) {
	    this.domElement.disabled = value;
	    return this;
	  }

	  /**
	   * Sets the height of this element using the height style.
	   *
	   * @param {number|string} height The new height as a number (for pixels) or string.
	   * @returns {PrimeElement} This Element.
	   */
	  setHeight(height) {
	    if (typeof(height) === 'number') {
	      height = height + 'px';
	    }

	    this.setStyle('height', height);
	    return this;
	  }

	  /**
	   * Sets the inner HTML content of the Element.
	   *
	   * @param {string|PrimeElement} newHTML The new HTML content for the Element.
	   * @returns {PrimeElement} This Element.
	   */
	  setHTML(newHTML) {
	    if (newHTML !== null) {
	      if (newHTML instanceof PrimeElement) {
	        this.domElement.innerHTML = newHTML.getHTML();
	      } else {
	        this.domElement.innerHTML = newHTML;
	      }
	    }
	    return this;
	  }

	  /**
	   * Sets the ID of the Element.
	   *
	   * @param {string} id The ID.
	   * @returns {PrimeElement} This Element.
	   */
	  setId(id) {
	    this.domElement.id = id;
	    return this;
	  }

	  /**
	   * Sets left position of the element.
	   *
	   * @param {number|string} left The left position of the element in pixels or as a string.
	   * @returns {PrimeElement} This Element.
	   */
	  setLeft(left) {
	    let leftString = left;
	    if (typeof(left) === 'number') {
	      leftString = left + 'px';
	    }

	    this.setStyle('left', leftString);
	    return this;
	  }

	  /**
	   * Sets the opacity of the element. This also sets the IE alpha filter for IE version 9 or younger.
	   *
	   * @param {number} opacity The opacity.
	   * @returns {PrimeElement} This Element.
	   */
	  setOpacity(opacity) {
	    if (Browser.name === 'Explorer' && Browser.version < 9) {
	      this.domElement.style.filter = 'alpha(opacity=' + opacity + ')';
	    } else {
	      this.domElement.style.opacity = opacity;
	    }

	    return this;
	  }

	  /**
	   * Sets the selected value on the element. If the element is not an option or radio, this does nothing.
	   *
	   * @param {boolean} selected Selected value.
	   */
	  setSelected(selected) {
	    this.domElement.selected = selected;
	  }

	  /**
	   * Sets the selected value(s) of this element. This works on selects, checkboxes, and radio buttons.
	   *
	   * @param {string} [arguments] The value(s) to select (var args).
	   * @returns {PrimeElement} This Element.
	   */
	  setSelectedValues() {
	    // Handle the case where they passed in an array
	    let values = null;
	    if (arguments.length === 1 && Utils.isArray(arguments[0])) {
	      values = arguments[0];
	    } else {
	      values = Array.prototype.slice.call(arguments, 0);
	    }

	    if (this.domElement.tagName === 'INPUT' && (this.domElement.type === 'checkbox' || this.domElement.type === 'radio')) {
	      const name = this.domElement.name;
	      const form = PrimeDocument.queryUp('form', this.domElement);
	      PrimeDocument.query('input[name="' + name + '"]', form).each(function(element) {
	        element.setChecked(values.indexOf(element.getValue()) !== -1);
	      });
	    } else if (this.domElement.tagName === 'SELECT') {
	      for (let i = 0; i < this.domElement.length; i++) {
	        this.domElement.options[i].selected = values.indexOf(this.domElement.options[i].value) !== -1;
	      }
	    }

	    return this;
	  }

	  /**
	   * Sets the style for the name of this Element.
	   *
	   * @param {string} name The style name.
	   * @param {number|string} value The style value.
	   * @returns {PrimeElement} This Element.
	   */
	  setStyle(name, value) {
	    if (typeof value === 'number') {
	      value = value.toString();
	    }
	    this.domElement.style[name] = value;
	    return this;
	  }

	  /**
	   * Sets multiple styles of this Element.
	   *
	   * @param {Object} styles An object with key value pairs for the new style names and values.
	   * @returns {PrimeElement} This Element.
	   */
	  setStyles(styles) {
	    for (let key in styles) {
	      if (styles.hasOwnProperty(key)) {
	        this.setStyle(key, styles[key]);
	      }
	    }
	    return this;
	  }

	  /**
	   * Sets the textContent of the Element.
	   *
	   * @param {number|string|PrimeElement} newText The new text content for the Element.
	   * @returns {PrimeElement} This Element.
	   */
	  setTextContent(newText) {
	    if (newText !== null) {
	      if (newText instanceof PrimeElement) {
	        this.domElement.textContent = newText.getTextContent();
	      } else {
	        if (typeof newText === 'number') {
	          newText = newText.toString();
	        }
	        this.domElement.textContent = newText;
	      }
	    }
	    return this;
	  }

	  /**
	   * Sets top position of the element.
	   *
	   * @param {number|string} top The top position of the element in pixels or as a string.
	   * @returns {PrimeElement} This Element.
	   */
	  setTop(top) {
	    let topString = top;
	    if (typeof(top) === 'number') {
	      topString = top + 'px';
	    }

	    this.setStyle('top', topString);
	    return this;
	  }

	  /**
	   * Sets the value of this Element. This handles checkboxes, radio buttons, options, text inputs and text areas. This
	   * works on checkboxes and radio buttons, but it change the value attribute on them rather than checking and unchecking
	   * the buttons themselves. To check and uncheck the buttons, use the select method.
	   *
	   * @param {number|string} value The new value.
	   * @returns {PrimeElement} This Element.
	   */
	  setValue(value) {
	    if (typeof value === 'number') {
	      value = value.toString();
	    }
	    this.domElement.value = value;
	    return this;
	  }

	  /**
	   * Sets the width of this element using the height style.
	   *
	   * @param {number|string} width The new width as a number (for pixels) or string.
	   * @returns {PrimeElement} This Element.
	   */
	  setWidth(width) {
	    if (typeof(width) === 'number') {
	      width = width + 'px';
	    }

	    this.setStyle('width', width);
	    return this;
	  }

	  /**
	   * Shows the Element by setting the display style first to empty string. After this, the elements computed style is
	   * checked to see if the element is still not visible. If that is true, the element must have a CSS style defined in
	   * a stylesheet that is setting it to display: none. In this case, we determine if the element is a block level element
	   * and either set the display to 'block' or 'inline'.
	   *
	   * @param {string} [displayValue] The display value to use for the show. This defaults to the W3C standard display
	   * setting depending on the type of element you are showing. For example, INPUT is inline and DIV is block.
	   * @returns {PrimeElement} This Element.
	   */
	  show(displayValue) {
	    if (Utils.isDefined(displayValue)) {
	      this.domElement.style.display = displayValue;
	      return this;
	    }

	    this.domElement.style.display = '';

	    const computedDisplay = this.getComputedStyle()['display'];
	    if (computedDisplay === 'none') {
	      if (!Utils.isDefined(displayValue)) {
	        displayValue = (PrimeElement.blockElementRegexp.test(this.domElement.tagName)) ? 'block' : 'inline';
	      }

	      this.domElement.style.display = displayValue;
	    }

	    return this;
	  }

	  /**
	   * Toggle the class on this element.
	   *
	   * @param {string} className The class name.
	   * @returns {PrimeElement} This Element.
	   */
	  toggleClass(className) {
	    if (this.hasClass(className)) {
	      this.removeClass(className);
	    } else {
	      this.addClass(className);
	    }

	    return this;
	  }

	  /**
	   * Removes this element from the DOM while preserving the inner HTML.
	   *
	   * Example, call unwrap on the italic element:
	   *   <strong>Hello</strong><italic> World </italic> --> <strong>Hello</strong> World
	   *
	   * @returns {PrimeElement} This Element.
	   */
	  unwrap() {
	    const parent = this.getParent().domElement;
	    while (this.domElement.firstChild) {
	      parent.insertBefore(this.domElement.firstChild, this.domElement);
	    }

	    this.removeFromDOM();
	  }

	  /**
	   * Builds a new element using the given HTML snippet (currently this only supports the tag).
	   *
	   * @param {string} elementString The element string.
	   * @param {Object} [properties={}] The properties for the new element.
	   * @returns {PrimeElement} A new PrimeElement.
	   */
	  wrapInnerHTML(elementString, properties) {
	    const element = PrimeDocument.newElement(elementString, properties);
	    element.setHTML(this.getOuterHTML());
	    this.domElement.outerHTML = element.domElement.outerHTML;
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private Methods
	   * ===================================================================================================================*/

	  /**
	   * Handle delegated events.
	   *
	   * @param {Event} event
	   * @private
	   */
	  _handleDelegatedEvent(event) {
	    this._callMatchedListeners(event, event.target);

	    // If the event cannot bubble, we are done.
	    if (!event.bubbles) {
	      return;
	    }

	    // While propagation has not been stopped, walk up the tree to simulate the bubble
	    let domElement = event.target;
	    while (true) {
	      if (domElement === this.domElement || domElement === document || event.isPropagationStopped) {
	        break;
	      }

	      domElement = domElement.parentNode;
	      this._callMatchedListeners(event, domElement);
	    }
	  }

	  _callMatchedListeners(event, target) {
	    // Test each selector we have against this target
	    let delegatedListeners = this.domElement.delegatedListeners[event.type] || [];
	    for (let selector in delegatedListeners) {
	      if (delegatedListeners.hasOwnProperty(selector)) {
	        if (target.matches(selector)) {

	          let scopedListeners = delegatedListeners[selector];
	          // Call each listener unless immediate propagation has been stopped
	          for (let i = 0; i < scopedListeners.length; i++) {

	            if (event.isImmediatePropagationStopped) {
	              return;
	            }

	            scopedListeners[i](event, target);
	          }
	        }
	      }
	    }
	  }

	  /**
	   * Removes the event listener proxy from this element.
	   *
	   * @param {string} event The event name.
	   * @param {Function} listener The listener function.
	   * @private
	   */
	  _internalRemoveEventListener(event, listener) {
	    if (event.indexOf(':') === -1) {
	      // Traditional event
	      if (this.domElement.removeEventListener) {
	        this.domElement.removeEventListener(event, listener, false);
	      } else if (this.domElement.detachEvent) {
	        this.domElement.detachEvent('on' + event, listener);
	      } else {
	        throw new TypeError('Unable to remove event from the element. Neither removeEventListener nor detachEvent methods are available');
	      }
	    } else if (this.domElement.customEventListeners && this.domElement.customEventListeners[event]) {
	      // Custom event
	      const customListeners = this.domElement.customEventListeners[event];
	      Utils.removeFromArray(customListeners, listener);
	    }
	  }
	}


	/* ===================================================================================================================
	 * Polyfill
	 * ===================================================================================================================*/

	(function() {
	  if (!Element.prototype.matches) {
	    Element.prototype.matches = function(selector) {
	      const domElement = this;
	      const matches = (domElement.parentNode || domElement.document).querySelectorAll(selector);
	      let i = 0;

	      while (matches[i] && matches[i] !== domElement) {
	        i++;
	      }

	      return !!matches[i];
	    };
	  }

	  // Add isPropagationStopped, this is part of the DOM Level 3 spec for CustomEvents
	  // - adding it here for all types so it can be used by the delegation event listener
	  // https://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-isPropagationStopped
	  if (!Event.prototype.isPropagationStopped) {
	    let _stopPropagation = Event.prototype.stopPropagation;
	    Event.prototype.stopPropagation = function() {
	      this.isPropagationStopped = true;
	      _stopPropagation.apply(this, arguments);
	    };
	  }

	  // Add isImmediatePropagationStopped, this is part of the DOM Level 3 spec for CustomEvents
	  // - adding it here for all types so it can be used by the delegation event listener
	  // https://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-Event-isImmediatePropagationStopped
	  if (!Event.prototype.isImmediatePropagationStopped) {
	    let _stopImmediatePropagation = Event.prototype.stopImmediatePropagation;
	    Event.prototype.stopImmediatePropagation = function() {
	      this.isImmediatePropagationStopped = true;
	      _stopImmediatePropagation.apply(this, arguments);
	    };
	  }
	})();

	/*
	 * Copyright (c) 2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class PrimeElementList {
	  /**
	   * Constructs an PrimeElementList object using the given array containing DOMElements or PrimeElement objects, or the NodeList containing Node objects.
	   *
	   * @constructor
	   * @param {Array|NodeList} elements An array containing DOMElement or PrimeElement objects, or a NodeList containing Node objects.
	   */
	  constructor(elements) {
	    Utils.bindAll(this);

	    // NodeList does not inherit from Array so do not assume object type.
	    this.length = elements.length;
	    for (let i = 0; i < elements.length; i++) {
	      if (elements[i] instanceof PrimeElement) {
	        this[i] = elements[i];
	      } else {
	        this[i] = new PrimeElement(elements[i]);
	      }
	    }
	  }

	  /**
	   * Shorthand for calling {@link PrimeElement.addClass} on each Element in the PrimeElementList.
	   *
	   * Adds the given class (or list of space separated classes) to all Elements in this PrimeElementList.
	   *
	   * @param {string} classNames The class name(s) separated by a space.
	   * @returns {PrimeElementList} This PrimeElementList.
	   */
	  addClass(classNames) {
	    return this._proxyToElement('addClass', classNames);
	  }

	  /**
	   * Shorthand for calling {@link PrimeElement.addEventListener} on each Element in the PrimeElementList.
	   *
	   * Attaches an event listener to all Elements in this PrimeElementList.
	   *
	   * @param {string} event The name of the event.
	   * @param {Function} listener The event listener function.
	   * @returns {PrimeElement|PrimeElementList} This Element.
	   */
	  addEventListener(event, listener) {
	    return this._proxyToElement('addEventListener', event, listener);
	  }

	  /**
	   * Iterates over each of the PrimeElement objects in this PrimeElementList and calls the given function for each one.
	   * The <code>this</code> variable inside the function will be managed by the caller of this method. You should use the
	   * <code>bind</code> method on the Function object if you want to manage the <code>this</code> reference.
	   *
	   * The function can optionally take two parameters. The first parameter is the current element. The second parameter
	   * is the current index.
	   *
	   * @param {Function} iterationFunction The function to call.
	   * @returns {PrimeElementList} This PrimeElementList.
	   */
	  each(iterationFunction) {
	    for (let i = 0; i < this.length; i++) {
	      iterationFunction(this[i], i);
	    }

	    return this;
	  }

	  /**
	   * Shorthand for calling {@link PrimeElement.hide} on each Element in the PrimeElementList.
	   *
	   * Hides the Element by setting the display style to none.
	   *
	   * @returns {PrimeElementList} This PrimeElementList.
	   */
	  hide() {
	    return this._proxyToElement('hide');
	  }

	  /**
	   * Returns the indexOf the element that matches the parameter, either Prime Element or DOMElement.
	   *
	   * @param {PrimeElement|Element} element The element to look for
	   * @returns {number} The position of the element in the list, or -1 if not present.
	   */
	  indexOf(element) {
	    const domElement = (element instanceof PrimeElement) ? element.domElement : element;

	    for (let i = 0; i < this.length; i++) {
	      if (this[i].domElement === domElement) {
	        return i;
	      }
	    }

	    return -1;
	  }

	  /**
	   * Removes all the matched elements in the PrimeElementList from the DOM.
	   *
	   * @returns {PrimeElementList} This PrimeElementList.
	   */
	  removeAllFromDOM() {
	    for (let i = 0; i < this.length; i++) {
	      this[i].removeFromDOM();
	    }

	    return this;
	  }

	  /**
	   * Shorthand for calling {@link PrimeElement.removeClass} on each Element in the PrimeElementList.
	   *
	   * Removes the given class (or list of space separated classes) from all Elements in this PrimeElementList.
	   *
	   * @param {string} classNames The class name(s) separated by a space.
	   * @returns {PrimeElementList} This PrimeElementList.
	   */
	  removeClass(classNames) {
	    return this._proxyToElement('removeClass', classNames);
	  }

	  /**
	   * Shorthand for calling {@link PrimeElement.setChecked} on each Element in the PrimeElementList.
	   *
	   * If this element is a checkbox or radio button, this sets the checked field on the DOM object equal to the given
	   * value.
	   *
	   * @param {boolean} value The value to set the checked state of this element to.
	   * @returns {PrimeElementList} This PrimeElementList.
	   */
	  setChecked(value) {
	    return this._proxyToElement('setChecked', value);
	  }

	  /**
	   * Shorthand for calling {@link PrimeElement.setDisabled} on each Element in the PrimeElementList.
	   *
	   * Sets if this element is disabled or not. This works with any element that responds to the disabled property.
	   *
	   * @param {boolean} value The value to set the disabled state of this element to.
	   * @returns {PrimeElementList} This PrimeElementList.
	   */
	  setDisabled(value) {
	    return this._proxyToElement('setDisabled', value);
	  }

	  /**
	   * Shorthand for calling {@link PrimeElement.show} on each Element in the PrimeElementList.
	   *
	   * Shows the element.
	   *
	   * @returns {PrimeElementList} This PrimeElementList.
	   */
	  show() {
	    return this._proxyToElement('show');
	  }

	  /**
	   * @callback PrimeElementListPredicate
	   *
	   * A function that defines a condition on a PrimeElement
	   *
	   * @param {PrimeElement} element
	   * @returns {boolean} True if the element matches a condition
	   */

	  /**
	   * A function that tests for any element that matches a condition.
	   * @param {PrimeElementListPredicate} predicate A function that defines the condition to check
	   * @returns {boolean} True if any element matches the predicate
	   */
	  some(predicate) {
	    for (let i = 0; i < this.length; ++i) {
	      if (predicate(this[i])) {
	        return true;
	      }
	    }
	    return false;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Proxy function calls to each Element in the PrimeElementList.
	   * The first parameter is function name, followed by a variable length of arguments.
	   *
	   * Example usage: this._proxyToElement('addClass', classNames);
	   *
	   * @returns {PrimeElementList}
	   * @private
	   */
	  _proxyToElement() {
	    const args = Array.prototype.slice.apply(arguments);
	    for (let i = 0; i < this.length; i++) {
	      this[i][args[0]].apply(this[i], args.slice(1));
	    }
	    return this;
	  }
	}

	/*
	 * Copyright (c) 2012-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	const readyFunctions = [];
	const tagRegexp = /^<(\w+)\s*\/?>.*(?:<\/\1>)?$/;

	/**
	 * The Body element as a PrimeElement object.
	 *
	 * @type {?PrimeElement}
	 */
	let bodyElement = null;

	class PrimeDocument {

	  /**
	   * @returns {PrimeElement}
	   */
	  static get Element() {
	    return PrimeElement;
	  }

	  /**
	   * @returns {PrimeElementList}
	   */
	  static get ElementList() {
	    return PrimeElementList;
	  }

	  /**
	   * @returns {Array<Function>}
	   */
	  static get readyFunctions() {
	    return readyFunctions;
	  }

	  /**
	   * @returns {RegExp}
	   */
	  static get tagRegexp() {
	    return tagRegexp;
	  }

	  /**
	   * @returns {?PrimeElement} the Prime body element
	   */
	  static get bodyElement() {
	    if (bodyElement === null) {
	      bodyElement = new PrimeElement(document.body);
	    }
	    return bodyElement;
	  }

	  /**
	   * Set the body element
	   * @param {?PrimeElement} body the Prime body element
	   */
	  static set bodyElement(body) {
	    bodyElement = body;
	  }

	  /**
	   * Attaches an event listener to the document body and will only invoke the listener when the event target matches
	   * the provided selector.
	   *
	   * The intent of this function is to provide a delegated listener and handle events from nested elements.
	   *
	   * @param {string} event The name of the event
	   * @param  {string} selector The selector to match against the Element
	   * @param {PrimeDelegationEventListener} listener The event listener function
	   */
	  static addDelegatedEventListener(event, selector, listener) {
	    PrimeDocument.bodyElement.addDelegatedEventListener(event, selector, listener);
	  }

	  /**
	   * Attaches an event listener to the document, returning the handler proxy.
	   *
	   * @param {string} event The name of the event.
	   * @param {Function} listener The event listener function.
	   * @returns {PrimeDocument} The PrimeDocument object so you can chain method calls together.
	   */
	  static addEventListener(event, listener) {
	    if (event.indexOf(':') === -1) {
	      // Traditional event
	      document.eventListeners = document.eventListeners || {};
	      document.eventListeners[event] = document.eventListeners[event] || [];
	      document.eventListeners[event].push(listener);
	      document.addEventListener(event, listener, false);
	    } else {
	      // Custom event
	      document.customEventListeners = document.customEventListeners || {};
	      document.customEventListeners[event] = document.customEventListeners[event] || [];
	      document.customEventListeners[event].push(listener);
	    }

	    return PrimeDocument;
	  }

	  /**
	   * Returns the height of the document.
	   *
	   * @returns {number} The height of the document in pixels.
	   */
	  static getHeight() {
	    const body = document.body;
	    const html = document.documentElement;

	    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
	  }

	  /**
	   * Returns the width of the document.
	   *
	   * @returns {number} The width of the document in pixels.
	   */
	  static getWidth() {
	    const body = document.body;
	    const html = document.documentElement;

	    return Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
	  }

	  /**
	   * Builds a new document using the given HTML document.
	   *
	   * @param {string} documentString The HTML string to build the document.
	   * @returns {Document} A new document.
	   */
	  static newDocument(documentString) {
	    return new DOMParser().parseFromString(documentString, "text/html");
	  }

	  /**
	   * Builds a new element using the given HTML snippet (currently this only supports the tag).
	   *
	   * @param {string} elementString The element string.
	   * @param {Object} [properties={}] The properties for the new element.
	   * @returns {PrimeElement} A new PrimeElement.
	   */
	  static newElement(elementString, properties) {
	    properties = Utils.isDefined(properties) ? properties : {};
	    const result = PrimeDocument.tagRegexp.exec(elementString);
	    if (result === null) {
	      throw new TypeError('Invalid string to create a new element [' + elementString + ']. It should look like <a/>');
	    }

	    const element = new PrimeElement(document.createElement(result[1]));
	    for (let key in properties) {
	      if (properties.hasOwnProperty(key)) {
	        if (key === 'id') {
	          element.setId(properties[key]);
	        } else {
	          element.setAttribute(key, properties[key]);
	        }
	      }
	    }

	    return element;
	  }

	  /**
	   * Adds the given callback function to the list of functions to invoke when the document is ready. If the document is
	   * already fully loaded, this simply invokes the callback directly.
	   *
	   * @param {Function} callback The callback function.
	   */
	  static onReady(callback) {
	    if (document.readyState === 'complete') {
	      callback();
	    } else {
	      // If this is the first call, register the event listener on the document
	      if (this.readyFunctions.length === 0) {
	        if (document.addEventListener) {
	          document.addEventListener('DOMContentLoaded', PrimeDocument._callReadyListeners, false);
	        } else if (document.attachEvent) {
	          document.attachEvent('onreadystatechange', PrimeDocument._callReadyListeners);
	        } else {
	          throw new TypeError('No way to attach an event to the document. What browser are you running?');
	        }
	      }

	      // Add the callback
	      PrimeDocument.readyFunctions.push(callback);
	    }
	  }

	  /**
	   * Take the HTML string and append it to the body.
	   *
	   * @param {string} html The HTML to append
	   */
	  static appendHTML(html) {
	    document.body.insertAdjacentHTML('beforeend', html);
	  }

	  /**
	   * Moves the given element by appending it to the element provided by the second argument.
	   *
	   * @param {Element|PrimeElement} element The element to move.
	   * @param {Element|PrimeElement} appendToElement [appendToElement=body] The element to append to, defaults to the body if not provided.
	   * @returns {PrimeElement} The element that has been moved.
	   */
	  static move(element, appendToElement) {
	    element = (element instanceof PrimeElement) ? element : new PrimeElement(element);

	    if (!Utils.isDefined(appendToElement)) {
	      appendToElement = new PrimeElement(document.body);
	    } else {
	      appendToElement = (appendToElement instanceof PrimeElement) ? appendToElement : new PrimeElement(appendToElement);
	    }

	    appendToElement.appendHTML(element.getOuterHTML());
	    element.removeFromDOM();
	    return appendToElement.getLastChild();
	  }

	  /**
	   * Queries the DOM using the given selector starting at the given element and returns all the matched elements.
	   *
	   * @param {string} selector The selector.
	   * @param {Element|Document|PrimeElement} [element=document] The starting point for the search (defaults to document if not provided).
	   * @returns {PrimeElementList} An element list.
	   */
	  static query(selector, element) {
	    let domElement = null;
	    if (!Utils.isDefined(element)) {
	      domElement = document;
	    } else {
	      domElement = (element instanceof PrimeElement) ? element.domElement : element;
	    }

	    const elements = domElement.querySelectorAll(selector);
	    return new PrimeElementList(elements);
	  }

	  /**
	   * Queries the DOM for an element that has the given ID.
	   *
	   * @param {string} id The ID.
	   * @returns {PrimeElement} The element or null.
	   */
	  static queryById(id) {
	    let element = document.getElementById(id);
	    if (!element) {
	      return null;
	    }

	    return new PrimeElement(element);
	  }

	  /**
	   * Queries the DOM using the given selector starting at the given element and returns the first matched element
	   * or null if there aren't any matches.
	   *
	   * @param {string} selector The selector.
	   * @param {Element|Document|PrimeElement} [element=document] The starting point for the search (defaults to document if not provided).
	   * @returns {PrimeElement} An element or null.
	   */
	  static queryFirst(selector, element) {
	    let domElement = null;
	    if (!Utils.isDefined(element)) {
	      domElement = document;
	    } else {
	      domElement = (element instanceof PrimeElement) ? element.domElement : element;
	    }

	    domElement = domElement.querySelector(selector);
	    if (domElement === null) {
	      return null;
	    }

	    return new PrimeElement(domElement);
	  }

	  /**
	   * Queries the DOM using the given selector starting at the given element and returns the last matched element
	   * or null if there aren't any matches.
	   *
	   * @param {string} selector The selector.
	   * @param {Element|Document|PrimeElement} [element=document] The starting point for the search (defaults to document if not provided).
	   * @returns {PrimeElement} An element or null.
	   */
	  static queryLast(selector, element) {
	    let domElement = null;
	    if (!Utils.isDefined(element)) {
	      domElement = document;
	    } else {
	      domElement = (element instanceof PrimeElement) ? element.domElement : element;
	    }

	    const domElements = domElement.querySelectorAll(selector);
	    if (domElements.length === 0) {
	      return null;
	    }

	    return new PrimeElement(domElements[domElements.length - 1]);
	  }

	  /**
	   * Traverses up the DOM from the starting element and looks for a match to the selector.
	   *
	   * @param {string} selector The selector.
	   * @param {PrimeElement|Element} element The starting point for the upward traversal.
	   * @returns {PrimeElement} An element or null.
	   */
	  static queryUp(selector, element) {
	    let domElement = null;
	    if (!Utils.isDefined(element)) {
	      throw new SyntaxError('Missing required parameter. The element is required.');
	    } else {
	      domElement = (element instanceof PrimeElement) ? element.domElement : element;
	    }

	    domElement = domElement.parentNode;
	    while (domElement !== null && !domElement.matches(selector)) {
	      domElement = domElement.parentNode;
	      if (domElement === document) {
	        domElement = null;
	      }
	    }

	    if (domElement !== null) {
	      return new PrimeElement(domElement);
	    }

	    return null;
	  }

	  /**
	   * Removes an event handler for a specific event from the document that you attached using addEventListener
	   *
	   * @param {string} event The name of the event.
	   * @param {Function} listener The listener function.
	   */
	  static removeEventListener(event, listener) {
	    if (document.removeEventListener) {
	      document.removeEventListener(event, listener, false);
	    } else if (document.detachEvent) {
	      document.detachEvent('on' + event, listener);
	    } else {
	      throw new TypeError('Unable to remove event from the element. Neither removeEventListener nor detachEvent methods are available');
	    }
	  }

	  /* ===================================================================================================================
	   * Private Methods
	   * ===================================================================================================================*/

	  /**
	   * Calls all the registered document ready listeners.
	   *
	   * @private
	   */
	  static _callReadyListeners() {
	    if (document.addEventListener || document.readyState === 'complete') {
	      let readyFunction;
	      while (readyFunction = PrimeDocument.readyFunctions.shift()) {
	        readyFunction();
	      }
	    }

	    if (document.removeEventListener) {
	      document.removeEventListener('DOMContentLoaded', PrimeDocument._callReadyListeners, false);
	    } else {
	      document.detachEvent('onreadystatechange', PrimeDocument._callReadyListeners);
	    }
	  }
	}

	/* ===================================================================================================================
	 * Polyfill
	 * ===================================================================================================================*/

	/* https://developer.mozilla.org/en-US/docs/Web/API/DOMParser */
	(function(DOMParser) {
	  const proto = DOMParser.prototype;
	  const nativeParse = proto.parseFromString;

	  // Firefox/Opera/IE throw errors on unsupported types
	  try {
	    // WebKit returns null on unsupported types
	    if ((new DOMParser()).parseFromString('', 'text/html')) {
	      // text/html parsing is natively supported
	      return;
	    }
	  } catch (ex) {
	  }

	  proto.parseFromString = function(markup, type) {
	    if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
	      const doc = document.implementation.createHTMLDocument('');
	      if (markup.toLowerCase().indexOf('<!doctype') > -1) {
	        doc.documentElement.innerHTML = markup;
	      } else {
	        doc.body.innerHTML = markup;
	      }
	      return doc;
	    } else {
	      return nativeParse.apply(this, arguments);
	    }
	  };
	}(DOMParser));

	/*
	 * Copyright (c) 2012-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	/**
	 * The Utils namespace. This contains utility functions.
	 *
	 * @namespace Utils
	 */
	const Utils = {
	  spaceRegex: /\s+/,
	  typeRegex: /^\[object\s(.*)\]$/,

	  /**
	   * Binds all of the functions inside the object so that <code>this</code> is the object. This is extremely useful for
	   * objects that have functions that will be used as event listeners. Rather than having to manage binding and function
	   * references manually you can instead bind all of the functions in the object and then use them directly for event
	   * listeners.
	   *
	   * Here's an example:
	   *
	   * <pre>
	   *   function Foo() {
	   *     Utils.bindAll(this);
	   *
	   *     // This function is bound to this (i.e. this.handleClick = this.handleClick.bind(this)).
	   *     PrimeDocument.queryFirst('a').addEventListener('click', this.handleClick);
	   *   }
	   *
	   *   Foo.prototype = {
	   *     handleClick: function(event) {
	   *       ...
	   *     }
	   *   };
	   * </pre>
	   *
	   * @param {*} object The object to bind all the functions for.
	   */
	  bindAll: function(object) {
	    Utils.getAllPropertyNames(object).forEach((property) => {
	      if (property !== 'constructor' && typeof object[property] === 'function' &&
	          !(object[property].name && object[property].name.startsWith('bound '))) { // name isn't defined in ie
	        Object.defineProperty(object, property, {value: object[property].bind(object)});
	      }
	    });
	  },

	  /**
	   * HTML escape a string.
	   *
	   * @param string The string to escape
	   * @returns {string} the escaped string
	   */
	  escapeHTML: function(string) {
	    let div = document.createElement('div');
	    div.appendChild(document.createTextNode(string));
	    return div.innerHTML;
	  },

	  /**
	   * Returns all of the properties for this object and all of its
	   * inherited properties from parent objects.
	   *
	   * @param object
	   * @returns {Array<string>}
	   */
	  getAllPropertyNames: function(object) {
	    let props = {};

	    do {
	      Object.getOwnPropertyNames(object).forEach((prop) => {
	        if (!props[prop]) {
	          props[prop]=prop;
	        }
	      });
	    } while (object = Object.getPrototypeOf(object));

	    return Object.keys(props);
	  },

	  /**
	   * Binds all of the functions inside the object so that <code>this</code> is the object. This is extremely useful for
	   * objects that have functions that will be used as event listeners. Rather than having to manage binding and function
	   * references manually you can instead bind all of the functions in the object and then use them directly for event
	   * listeners.
	   *
	   * Here's an example:
	   *
	   * <pre>
	   *   function Foo() {
	   *     Utils.bindAll(this);
	   *
	   *     // This function is bound to this (i.e. this.handleClick = this.handleClick.bind(this)).
	   *     PrimeDocument.queryFirst('a').addEventListener('click', this.handleClick);
	   *   }
	   *
	   *   Foo.prototype = {
	   *     handleClick: function(event) {
	   *       ...
	   *     }
	   *   };
	   * </pre>
	   *
	   * @param {*} object The object to bind all the functions for.
	   * @param {String} arguments A varargs list of function names to bind.
	   */
	  bindSome: function(object) {
	    if (arguments.length > 1) {
	      for (let i = 1; i < arguments.length; i++) {
	        const func = object[arguments[i]];
	        if (!Utils.isDefined(func) || !(func instanceof Function)) {
	          throw new TypeError('The object does not contain a function named [' + arguments[i] + ']');
	        }

	        object[arguments[i]] = func.bind(object);
	      }
	    }
	    for (let property in object) {
	      if (object[property] instanceof Function) {
	        object[property] = object[property].bind(object);
	      }
	    }
	  },

	  /**
	   * Safely binds a function to a context.
	   *
	   * @param {Function} func The function to bind.
	   * @param {Object} [context] An optional context to bind the function to.
	   * @returns {Function} Either <code>func</code> or the newly bound function.
	   */
	  bindSafe: function(func, context) {
	    if (!Utils.isDefined(func)) {
	      throw new Error('Invalid arguments');
	    }

	    if (!Utils.isDefined(context)) {
	      return func;
	    }

	    return func.bind(context);
	  },

	  /**
	   * Calculates the length of the given text using the style of the given element.
	   *
	   * @param {PrimeElement} element The element to use the style of.
	   * @param {string} text The text to calculate the length of.
	   * @returns {number} The length of the text.
	   */
	  calculateTextLength: function(element, text) {
	    const computedStyle = element.getComputedStyle();
	    let textCalculator = PrimeDocument.queryById('prime-text-calculator');
	    if (textCalculator === null) {
	      textCalculator = PrimeDocument.newElement('<span/>')
	          .setStyles({
	            position: 'absolute',
	            width: 'auto',
	            fontSize: computedStyle['fontSize'],
	            fontFamily: computedStyle['fontFamily'],
	            fontWeight: computedStyle['fontWeight'],
	            letterSpacing: computedStyle['letterSpacing'],
	            whiteSpace: 'nowrap'
	          })
	          .setId('prime-text-calculator')
	          .setTop(-9999)
	          .setLeft(-9999)
	          .appendTo(document.body);
	    }

	    textCalculator.setHTML(text);
	    return textCalculator.getWidth();
	  },

	  /**
	   * Attempts to invoke a function iteratively in the background a specific number of times within a specific duration.
	   * This might not complete in the specified duration. The functions passed in should be short functions that return as
	   * quickly as possible. If you are using long functions, use the recursive setTimeout trick by-hand instance.
	   *
	   * @param {number} totalDuration The duration in milliseconds.
	   * @param {number} timesToCall The number of times to call the function.
	   * @param {Function} stepFunction The step function to call each iteration.
	   * @param {Function} [endFunction] The function to invoke at the end.
	   */
	  callIteratively: function(totalDuration, timesToCall, stepFunction, endFunction) {
	    const step = totalDuration / timesToCall;
	    let count = 0;
	    const id = setInterval(function() {
	      count++;
	      const last = (count >= timesToCall);
	      stepFunction(last);
	      if (last) {
	        clearInterval(id);

	        if (Utils.isDefined(endFunction)) {
	          endFunction();
	        }
	      }
	    }, step - 1);
	  },

	  /**
	   * Capitalizes the given String.
	   *
	   * @param {string} str The String to capitalize.
	   * @returns {string} The capitalized String.
	   */
	  capitalize: function(str) {
	    return str.charAt(0).toUpperCase() + str.substring(1);
	  },

	  /**
	   * Converts CSS style names to style JavaScript names.
	   *
	   * @param {string} name The CSS style name to convert
	   * @returns {string} The converted style name.
	   */
	  convertStyleName: function(name) {
	    if (name === 'float') {
	      return 'cssFloat';
	    }

	    let dash = name.indexOf('-');
	    if (dash === -1) {
	      return name;
	    }

	    let start = 0;
	    let result = '';
	    while (dash !== -1) {
	      const piece = name.substring(start, dash);
	      if (start === 0) {
	        result = result.concat(piece);
	      } else {
	        result = result.concat(Utils.capitalize(piece));
	      }

	      start = dash + 1;
	      dash = name.indexOf('-', start);
	    }

	    return result + Utils.capitalize(name.substring(start));
	  },

	  /**
	   * Return an options map {Object} of the data set values coerced to a typed value of boolean, string or number.
	   *
	   * @param {PrimeElement} element The element.
	   * @returns {Object} The options object.
	   */
	  dataSetToOptions: function(element) {
	    const options = {};
	    const data = element.getDataSet();
	    for (let prop in data) {
	      if (!data.hasOwnProperty(prop)) {
	        continue;
	      }
	      const value = data[prop];
	      if (isNaN(value)) {
	        if (value === 'true') {
	          options[prop] = true;
	        } else if (value === 'false') {
	          options[prop] = false;
	        } else {
	          options[prop] = value;
	        }
	      } else {
	        options[prop] = parseInt(value);
	      }
	    }

	    return options;
	  },

	  /**
	   * Determines if an object is an array or not.
	   *
	   * @param {*} o The object to check.
	   * @returns {boolean} True if the object is an array, false otherwise.
	   */
	  isArray: function(o) {
	    return Object.prototype.toString.call(o) === '[object Array]';
	  },

	  /**
	   * Tests whether or not the value is not null and not 'undefined'.
	   *
	   * @param {*} value The value to test.
	   * @returns {boolean} True if the value is defined (not null or undefined).
	   */
	  isDefined: function(value) {
	    return value !== null && typeof(value) !== 'undefined';
	  },

	  /**
	   * Left pad a number.
	   * @param {number} number the number to pad
	   * @param {number} width the width of the final result
	   * @returns {string}
	   */
	  leftPadNumber: function(number, width) {
	    const sign = Math.sign(number) === -1 ? '-' : '';
	    return sign + new Array(width).concat([Math.abs(number)]).join('0').slice(-width);
	  },

	  /**
	   * Parses a CSS measure value (12px) as an integer.
	   *
	   * @param {string} measure The CSS measure
	   * @returns {number} The value as an integer.
	   */
	  parseCSSMeasure: function(measure) {
	    const index = measure.indexOf('px');
	    if (index > 0) {
	      return parseInt(measure.substring(0, measure.length - 2));
	    }

	    return parseInt(measure) || 0;
	  },

	  /**
	   * Parses JSON.
	   *
	   * @param {string} json The JSON.
	   * @returns {Object} The JSON data as an object.
	   */
	  parseJSON: function(json) {
	    return JSON.parse(json);
	  },

	  /**
	   * Removes the objects in the toRemove array from the fromArray.
	   *
	   * @param {Array} fromArray The array to remove from.
	   * @param {Array} toRemove The values to remove.
	   */
	  removeAllFromArray: function(fromArray, toRemove) {
	    for (let i = 0; i < toRemove.length; i++) {
	      Utils.removeFromArray(fromArray, toRemove[i]);
	    }
	  },

	  /**
	   * Removes the given object from the given array.
	   *
	   * @param {Array} array The array to remove from.
	   * @param {*} obj The object to remove.
	   */
	  removeFromArray: function(array, obj) {
	    const index = array.indexOf(obj);
	    if (index !== -1) {
	      const shift = array.splice(index + 1, array.length);
	      array.length = index;
	      array.push.apply(array, shift);
	    }
	  },

	  /**
	   * Helper function to provide a one liner to behave as if you returned 'false' from a legacy version of Prime.js.
	   *
	   * Calling this method is equivalent to calling event.preventDefault and event.stopPropagation.
	   * @param event
	   */
	  stopEvent: function(event) {
	    // Compatibility with older versions of IE
	    event.cancelBubble = true;
	    if (event.stopPropagation) {
	      event.stopPropagation();
	    }
	    if (event.preventDefault) {
	      event.preventDefault();
	    }
	  },

	  type: function(object) {
	    return Object.prototype.toString.call(object).match(Utils.typeRegex)[1];
	  }
	};

	/*
	 * Copyright (c) 2017-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */

	/**
	 * The singleton instance.
	 *
	 * @type {Overlay}
	 */
	let instance;

	class Overlay {
	  /**
	   * Constructs a new Overlay instance once per DOM.
	   *
	   * @constructor
	   */
	  constructor() {
	    Utils.bindAll(this);

	    // Check if the overlay doesn't exist and add it
	    this.overlay = PrimeDocument.queryById('prime-overlay');
	    if (this.overlay === null) {
	      this.overlay = PrimeDocument.newElement('<div/>').setId('prime-overlay').appendTo(document.body).hide();
	    }
	    this.bodyOverflow = null;
	  }

	  /**
	   * Return the instance of the Overlay widget
	   * @returns {Overlay}
	   */
	  static get instance() {
	    return instance;
	  }

	  /**
	   * Set the instance value of the Overlay instance
	   * @param  value {Overlay}
	   */
	  static set instance(value) {
	    instance = value;
	  }

	  /**
	   * Closes the overlay and the target element.
	   */
	  close() {
	    // using null ensures that if this style is not defined, we'll remove it when we're done
	    let overflowStyle = this.bodyOverflow || '';
	    PrimeDocument.bodyElement.setStyle('overflow', overflowStyle);
	    this.overlay.setStyle('zIndex', '10');
	    this.overlay.hide();
	    return this;
	  }

	  /**
	   * Opens the overlay and positions the element over it.
	   * @param zIndex {Number|string}
	   */
	  open(zIndex) {
	    if (this.bodyOverflow === null) {
	      this.bodyOverflow = PrimeDocument.bodyElement.getStyle('overflow');
	    }
	    PrimeDocument.bodyElement.setStyle('overflow', 'hidden');
	    this.overlay.show();

	    // Set the z-index of this dialog and the overlay
	    this.overlay.setStyle('zIndex', zIndex.toString());
	    return this;
	  }

	  /**
	   * Changes the id of the Overlay element.
	   *
	   * @param id {string} The new id.
	   * @returns {Overlay}
	   */
	  setId(id) {
	    this.overlay.setId(id);
	    return this;
	  }

	  /**
	   * Updates the zindex of the overlay.
	   *
	   * @param zIndex {string|number} The new zIndex.
	   */
	  setZIndex(zIndex) {
	    this.overlay.setStyle('zIndex', zIndex.toString());
	    return this;
	  }
	}

	PrimeDocument.onReady(function() {
	  Overlay.instance = new Overlay();
	});

	/*
	 * Copyright (c) 2014-2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class PrimeRequest {
	  /**
	   * Makes a new AJAX request.
	   *
	   * @constructor
	   * @param {string} [url] The URL to call. This can be left out for sub-classing but should otherwise be provided.
	   * @param {string} [method=GET] The HTTP method to use. You can specify GET, POST, PUT, DELETE, HEAD, SEARCH, etc.
	   */
	  constructor(url, method) {
	    Utils.bindAll(this);
	    this.xhr = new XMLHttpRequest();
	    this.async = true;
	    this.body = null;
	    this.queryParams = null;
	    this.contentType = null;
	    this.inProgress = null;
	    this.errorHandler = this.onError;
	    this.headers = {};
	    this.loadingHandler = this.onLoading;
	    this.method = method || 'GET';
	    this.openHandler = this.onOpen;
	    this.password = null;
	    this.sendHandler = this.onSend;
	    this.successHandler = this.onSuccess;
	    this.unsetHandler = this.onUnset;
	    this.url = url;
	    this.username = null;
	  }

	  /**
	   * Changes the URL to call.
	   *
	   * @param {string} url The new URL to call.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  forURL(url) {
	    this.url = url;
	    return this;
	  }

	  /**
	   * Invokes the AJAX request. If the URL is not set, this throws an exception.
	   *
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  go() {
	    if (!this.url) {
	      throw new TypeError('No URL set for AJAX request');
	    }

	    let requestUrl = this.url;
	    if ((this.method === 'GET' || this.method === 'DELETE') && this.queryParams !== null) {
	      if (requestUrl.indexOf('?') === -1) {
	        requestUrl += '?' + this.queryParams;
	      } else {
	        requestUrl += '&' + this.queryParams;
	      }
	    }

	    if (this.async) {
	      if (this.inProgress !== null) {
	        this.inProgress.open();
	      }

	      this.xhr.onreadystatechange = this._handler.bind(this);
	    }

	    this.xhr.open(this.method, requestUrl, this.async, this.username, this.password);

	    if (Object.keys(this.headers).length > 0) {
	      for (let key in this.headers) {
	        if (this.headers.hasOwnProperty(key)) {
	          this.xhr.setRequestHeader(key, this.headers[key]);
	        }
	      }
	    }

	    if (this.contentType) {
	      this.xhr.setRequestHeader('Content-Type', this.contentType);
	    }

	    this.xhr.send(this.body);

	    return this;
	  }

	  /**
	   * Default handler for the "completed" state and an HTTP response status of anything but 2xx. Sub-classes can override
	   * this handler or you can pass in a handler function to the {@link #withUnsetHandler}.
	   *
	   * @param {XMLHttpRequest} xhr The XMLHttpRequest object.
	   */
	  onError(xhr) {
	  }

	  /**
	   * Default handler for the "loading" state. Sub-classes can override this handler or you can pass in a handler function
	   * to the {@link #withLoadingHandler}.
	   *
	   * @param {XMLHttpRequest} xhr The XMLHttpRequest object.
	   */
	  onLoading(xhr) {
	  }

	  /**
	   * Default handler for the "open" state. Sub-classes can override this handler or you can pass in a handler function
	   * to the {@link #withOpenHandler}.
	   *
	   * @param {XMLHttpRequest} xhr The XMLHttpRequest object.
	   */
	  onOpen(xhr) {
	  }

	  /**
	   * Default handler for the "send" state. Sub-classes can override this handler or you can pass in a handler function
	   * to the {@link #withSendHandler}.
	   *
	   * @param {XMLHttpRequest} xhr The XMLHttpRequest object.
	   */
	  onSend(xhr) {
	  }

	  /**
	   * Default handler for the "complete" state and an HTTP response status of 2xx. Sub-classes can override this handler
	   * or you can pass in a handler function to the {@link #withUnsetHandler}.
	   *
	   * @param {XMLHttpRequest} xhr The XMLHttpRequest object.
	   */
	  onSuccess(xhr) {
	  }

	  /**
	   * Default handler for the "unset" state. Sub-classes can override this handler or you can pass in a handler function
	   * to the {@link #withUnsetHandler}.
	   *
	   * @param {XMLHttpRequest} xhr The XMLHttpRequest object.
	   */
	  onUnset(xhr) {
	  }

	  /**
	   * Sets the async flag to false.
	   *
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  synchronously() {
	    this.async = false;
	    return this;
	  }

	  /**
	   * Sets the method used to make the AJAX request.
	   *
	   * @param {string} method The HTTP method.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  usingMethod(method) {
	    this.method = method;
	    return this;
	  }

	  /**
	   * Sets the request body for the request.
	   *
	   * @param {string} body The request body.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withBody(body) {
	    this.body = body;
	    return this;
	  }

	  /**
	   * Sets the content type for the request.
	   *
	   * @param {string} contentType The contentType.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withContentType(contentType) {
	    this.contentType = contentType;
	    return this;
	  }

	  /**
	   * Sets the data object for the request. Will store the values for query parameters or post data depending on the
	   * method that is set.  If the method is a post or put, will also set content-type to x-www-form-urlencoded.
	   *
	   * @param {Object} data The data object.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withData(data) {
	    for (let prop in data) {
	      if (data.hasOwnProperty(prop)) {
	        if (this.method === 'PUT' || this.method === 'POST') {
	          this.body = this._addDataValue(this.body, prop, data[prop]);
	        } else {
	          this.queryParams = this._addDataValue(this.queryParams, prop, data[prop]);
	        }
	      }
	    }

	    if (this.method === "PUT" || this.method === "POST") {
	      this.contentType = 'application/x-www-form-urlencoded';
	    }
	    return this;
	  }

	  /**
	   * Sets the data for the request using the form fields in the given form element. Will store the values for query
	   * parameters or post data depending on the method that is set.  If the method is a post or put, will also set
	   * content-type to x-www-form-urlencoded.
	   *
	   * @param {PrimeElement|HTMLFormElement} form The form object.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withDataFromForm(form) {
	    let domElement = form;
	    if (form instanceof PrimeElement) {
	      domElement = form.domElement;
	    }

	    for (let i = 0; i < domElement.elements.length; i++) {
	      const primeElement = new PrimeElement(domElement.elements[i]);
	      if (primeElement.isDisabled() || !primeElement.isInput()) {
	        continue;
	      }

	      let type = primeElement.getAttribute('type');
	      if (type !== null) {
	        type = type.toLowerCase();
	      }

	      let values;
	      if (primeElement.getTagName() === 'SELECT') {
	        values = primeElement.getSelectedValues();
	      } else if ((type === 'radio' || type === 'checkbox') && !primeElement.isChecked()) {
	        continue;
	      } else {
	        values = primeElement.getValue();
	      }

	      const name = primeElement.domElement.name;
	      if (this.method === 'PUT' || this.method === 'POST') {
	        this.body = this._addDataValue(this.body, name, values);
	      } else {
	        this.queryParams = this._addDataValue(this.queryParams, name, values);
	      }
	    }

	    if (this.method === "PUT" || this.method === "POST") {
	      this.contentType = 'application/x-www-form-urlencoded';
	    }

	    return this;
	  }

	  /**
	   * Sets the handler to invoke when the state of the AJAX request is "complete" and the HTTP status in the response is
	   * not 2xx.
	   *
	   * @param {Function} func The handler function.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withErrorHandler(func) {
	    this.errorHandler = func;
	    return this;
	  }

	  /**
	   * Sets an InProgress object that will be called by this AJAX request.
	   *
	   * @param {InProgress} inProgress The InProgress object.
	   * @return {PrimeRequest} This.
	   */
	  withInProgress(inProgress) {
	    this.inProgress = inProgress;
	    return this;
	  }

	  /**
	   * Sets the body of the AJAX request to the string value of the provided JSON object. The content-type of the request
	   * will also be set to 'application/json'. The provided JSON object may be passed as a string or an object.
	   *
	   * @param {Object} json The JSON object.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withJSON(json) {
	    this.body = typeof(json) === String ? json : JSON.stringify(json);
	    this.contentType = 'application/json';
	    return this;
	  }

	  /**
	   * Sets the handler to invoke when the state of the AJAX request is "loading".
	   *
	   * @param {Function} func The handler function.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withLoadingHandler(func) {
	    this.loadingHandler = func;
	    return this;
	  }

	  /**
	   * Set the request headers using the key and value.
	   *
	   * @param {String} key The key name.
	   * @param {String} value The value.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withHeader(key, value) {
	    this.headers[key] = value;
	    return this;
	  }

	  /**
	   * Set the key value pairs provided as request headers.
	   *
	   * @param {Object} headers A map of key value pairs.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withHeaders(headers) {
	    for (let key in headers) {
	      if (headers.hasOwnProperty(key)) {
	        this.headers[key] = headers[key];
	      }
	    }
	    return this;
	  }

	  /**
	   * Sets the XMLHTTPRequest's response type field, which will control how the response is parsed.
	   *
	   * @param {string} responseType The response type.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withResponseType(responseType) {
	    this.xhr.responseType = responseType;
	    return this;
	  }

	  /**
	   * Sets the handler to invoke when the state of the AJAX request is "open".
	   *
	   * @param {Function} func The handler function.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withOpenHandler(func) {
	    this.openHandler = func;
	    return this;
	  }

	  /**
	   * Sets the handler to invoke when the state of the AJAX request is "send".
	   *
	   * @param {Function} func The handler function.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withSendHandler(func) {
	    this.sendHandler = func;
	    return this;
	  }

	  /**
	   * Sets the handler to invoke when the state of the AJAX request is "complete" and the HTTP status in the response is
	   * 2xx.
	   *
	   * @param {Function} func The handler function.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withSuccessHandler(func) {
	    this.successHandler = func;
	    return this;
	  }

	  /**
	   * Sets the handler to invoke when the state of the AJAX request is "unset".
	   *
	   * @param {Function} func The handler function.
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  withUnsetHandler(func) {
	    this.unsetHandler = func;
	    return this;
	  }

	  /**
	   * Resets the Request back to a base state (basically just the URL + method).  This can be
	   * useful if a component is going to make many requests to the same endpoint with different parameters.
	   *
	   * @returns {PrimeRequest} This PrimeRequest.
	   */
	  reset() {
	    this.queryParams = null;
	    this.data = null;
	    this.body = null;
	    this.contentType = null;
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private Methods
	   * ===================================================================================================================*/

	  // noinspection JSMethodCanBeStatic
	  /**
	   * Adds the given name-value pair to the given data String. If the value is an array, it adds multiple values for each
	   * piece. Otherwise, it assumes value is a String or can be converted to a String.
	   *
	   * @param {string} dataString The data String used to determine if an ampersand is necessary.
	   * @param {string} name The name of the name-value pair.
	   * @param {string|Array} value The value of the name-value pair.
	   * @returns {string} The new data string.
	   * @private
	   */
	  _addDataValue(dataString, name, value) {
	    let result = '';
	    if (value instanceof Array) {
	      for (let i = 0; i < value.length; i++) {
	        result += encodeURIComponent(name) + '=' + encodeURIComponent(value[i]);
	        if (i + 1 < value.length) {
	          result += '&';
	        }
	      }
	    } else {
	      result = encodeURIComponent(name) + '=' + encodeURIComponent(value);
	    }

	    if (dataString !== null && result !== '') {
	      result = dataString + '&' + result;
	    } else if (dataString !== null && result === '') {
	      result = dataString;
	    }

	    return result;
	  }

	  /**
	   * @private
	   */
	  _handler() {
	    if (this.xhr.readyState === 0) {
	      this.unsetHandler(this.xhr);
	    } else if (this.xhr.readyState === 1) {
	      this.openHandler(this.xhr);
	    } else if (this.xhr.readyState === 2) {
	      this.sendHandler(this.xhr);
	    } else if (this.xhr.readyState === 3) {
	      this.loadingHandler(this.xhr);
	    } else if (this.xhr.readyState === 4) {

	      // Call the InProgress before hand because the success handler might call another AJAX method that might open another InProgress
	      if (this.inProgress !== null) {
	        this.inProgress.close(function() {
	          if (this.xhr.status >= 200 && this.xhr.status <= 299) {
	            this.successHandler(this.xhr);
	          } else {
	            this.errorHandler(this.xhr);
	          }
	        }.bind(this));
	      } else {
	        if (this.xhr.status >= 200 && this.xhr.status <= 299) {
	          this.successHandler(this.xhr);
	        } else {
	          this.errorHandler(this.xhr);
	        }
	      }
	    }
	  }
	}

	/*
	 * Copyright (c) 2012-2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class PrimeWindow {
	  /**
	   * Attaches an event listener to the window, returning the handler proxy.
	   *
	   * @param {string} event The name of the event.
	   * @param {Function} listener The event handler.
	   * @returns {Window} The window object.
	   */
	  static addEventListener(event, listener) {
	    if (event.indexOf(':') === -1) {
	      window.eventListeners = window.eventListeners || {};
	      window.eventListeners[event] = window.eventListeners[event] || [];
	      window.eventListeners[event].push(listener);
	      if (window.addEventListener) {
	        window.addEventListener(event, listener, false);
	      } else if (window.attachEvent) {
	        window.attachEvent('on' + event, listener);
	      } else {
	        throw new TypeError('Unable to set event onto the window. Neither addEventListener nor attachEvent methods are available');
	      }
	    } else {
	      // Custom event
	      window.customEventListeners = window.customEventListeners || {};
	      window.customEventListeners[event] = window.customEventListeners[event] || [];
	      window.customEventListeners[event].push(listener);
	    }

	    return window;
	  }

	  /**
	   * Returns the inner height of the window. This includes only the rendering area and not the window chrome (toolbars,
	   * status bars, etc). If this method can't figure out the inner height, it throws an exception.
	   *
	   * @returns {number} The inner height of the window.
	   */
	  static getInnerHeight() {
	    if (typeof(window.innerHeight) === 'number') {
	      // Most browsers
	      return window.innerHeight;
	    } else if (document.documentElement && document.documentElement.clientHeight) {
	      // IE 6+ in 'standards compliant mode'
	      return document.documentElement.clientHeight;
	    } else if (document.body && document.body.clientHeight) {
	      // IE 4 compatible
	      return document.body.clientHeight;
	    }

	    throw new Error('Unable to determine inner height of the window');
	  }

	  /**
	   * Returns the inner width of the window. This includes only the rendering area and not the window chrome (toolbars,
	   * status bars, etc). If this method can't figure out the inner width, it throws an exception.
	   *
	   * @returns {number} The inner width of the window.
	   */
	  static getInnerWidth() {
	    if (typeof(window.innerWidth) === 'number') {
	      // Most browsers
	      return window.innerWidth;
	    } else if (document.documentElement && document.documentElement.clientWidth) {
	      // IE 6+ in 'standards compliant mode'
	      return document.documentElement.clientWidth;
	    } else if (document.body && document.body.clientWidth) {
	      // IE 4 compatible
	      return document.body.clientWidth;
	    }

	    throw new Error('Unable to determine inner width of the window');
	  }

	  /**
	   * Returns the number of pixels the Window is scrolled by.
	   *
	   * @returns {number} The number of pixels.
	   */
	  static getScrollTop() {
	    if (typeof(window.pageYOffset) === 'number') {
	      return window.pageYOffset;
	    } else if (document.body && document.body.scrollTop) {
	      return document.body.scrollTop;
	    } else if (document.documentElement && document.documentElement.scrollTop) {
	      return document.documentElement.scrollTop;
	    }

	    throw new Error('Unable to determine scrollTop of the window');
	  }
	}

	/*
	 * Copyright (c) 2015-2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class Draggable {
	  /**
	   * Constructs a new Draggable object for the given element.
	   *
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element for the Draggable widget.
	   * @param {string} [gripSelector=] gripSelector The optional selector to identify the 'grippy' part.
	   * @constructor
	   */
	  constructor(element, gripSelector) {
	    Utils.bindAll(this);

	    this.element = PrimeElement.wrap(element);
	    this.offset = {};

	    if (!Utils.isDefined(gripSelector)) {
	      this.grip = this.element;
	    } else {
	      this.grip = this.element.queryFirst(gripSelector);
	      if (this.grip === null) {
	        throw Error('Unable to find an element using the provided selector [' + gripSelector + ']');
	      }
	    }
	  }

	  /**
	   * Destroys the Draggable Widget
	   */
	  destroy() {
	    this.element.removeClass('active');
	    this.element.setStyles(this.originalStyle);

	    this.grip.removeEventListener('mousedown', this._handleMouseDown);
	    PrimeDocument.removeEventListener('mousemove', this._handleMouseMove);
	    PrimeDocument.removeEventListener('mouseup', this._handleMouseUp);
	  }

	  /**
	   * Initializes the Draggable by attaching the event listeners.
	   *
	   * @returns {Draggable} This.
	   */
	  initialize() {
	    this.originalStyle = {
	      cursor: this.element.getStyle('cursor'),
	      zIndex: this.element.getStyle('zIndex')
	    };

	    this.grip.addEventListener('mousedown', this._handleMouseDown).setStyle('cursor', 'move');
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Handle Mouse Down Event
	   * @param {Event} event The mouse event.
	   * @private
	   */
	  _handleMouseDown(event) {
	    event.preventDefault();
	    this.element.addClass('active');

	    this.offset = {
	      zIndex: this.element.getStyle('zIndex'),
	      height: this.element.getOuterHeight(),
	      width: this.element.getOuterWidth(),
	      x: event.screenX,
	      y: event.screenY
	    };

	    this.element.setStyle('zIndex', this.offset.zIndex + 10);

	    // Remove old listeners
	    PrimeDocument.removeEventListener('mousemove', this._handleMouseMove);
	    PrimeDocument.removeEventListener('mouseup', this._handleMouseUp);

	    // Attach all the events
	    PrimeDocument.addEventListener('mousemove', this._handleMouseMove);
	    PrimeDocument.addEventListener('mouseup', this._handleMouseUp);
	  }

	  /**
	   * Handle the Mouse Move event for the body element.
	   *
	   * @param {Event} event The mouse event.
	   * @private
	   */
	  _handleMouseMove(event) {
	    const xDiff = event.screenX - this.offset.x;
	    const yDiff = event.screenY - this.offset.y;
	    this.offset.x = event.screenX;
	    this.offset.y = event.screenY;
	    this.element.setLeft(this.element.getLeft() + xDiff);
	    this.element.setTop(this.element.getTop() + yDiff);
	  }

	  /**
	   * Handle the Mouse Up event for this draggable widget.
	   * @private
	   */
	  _handleMouseUp() {
	    PrimeDocument.removeEventListener('mousemove', this._handleMouseMove);
	    PrimeDocument.removeEventListener('mouseup', this._handleMouseUp);
	    this.element.setStyle('zIndex', this.offset.zIndex);
	    this.element.removeClass('active');
	  }
	}

	/*
	 * Copyright (c) 2017-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */

	class AJAXDialog {
	  /**
	   * Constructs a new dialog box, which is dynamically built and then populated with the HTML returned from an AJAX call.
	   *
	   * @constructor
	   */
	  constructor() {
	    Utils.bindAll(this);

	    this.draggable = null;
	    this.element = null;
	    this.initialized = false;
	    this._setInitialOptions();
	  }

	  /**
	   * Closes the dialog, destroys the HTML and updates or hides the overlay.
	   * @returns {AJAXDialog} This.
	   */
	  close() {
	    this.element.removeClass('open');
	    if (this.draggable !== null) {
	      this.draggable.destroy();
	      this.draggable = null;
	    }

	    setTimeout(function() {
	      this.element.removeFromDOM();
	      this.element = null;

	      const highestZIndex = this._determineZIndex();
	      if (highestZIndex !== 0) {
	        Overlay.instance.setZIndex(highestZIndex);
	      } else {
	        Overlay.instance.close();
	      }
	    }.bind(this), this.options.closeTimeout);

	    return this;
	  }

	  /**
	   * Destroys the dialog by calling the close function.
	   * @returns {AJAXDialog} This.
	   */
	  destroy() {
	    this.close();
	    return this;
	  }

	  /**
	   * Initializes the dialog.
	   * @returns {AJAXDialog} This.
	   */
	  initialize() {
	    return this;
	  }

	  /**
	   * Opens the dialog by making the AJAX GET request to the given URI and the opening then dialog.
	   *
	   * @param uri {string} The URI to make the AJAX GET request to.
	   * @returns {AJAXDialog} This.
	   */
	  open(uri) {
	    const request = this.options.ajaxRequest || new PrimeRequest(uri, 'GET');
	    request.withSuccessHandler(this._handleAJAXDialogResponse)
	        .withErrorHandler(this._handleAJAXDialogResponse)
	        .go();
	    return this;
	  }

	  /**
	   * Opens the dialog by making the AJAX POST request to the given URI with the given form and extra data (optional)
	   * and then opening the dialog.
	   *
	   * @param uri {string} The URI to make the AJAX POST request to.
	   * @param form {HTMLFormElement|PrimeElement} The Form element to retrieve the data from.
	   * @param extraData [extraData=] {object} (Optional) Extra data to send with the POST.
	   * @returns {AJAXDialog} This.
	   */
	  openPost(uri, form, extraData) {
	    new PrimeRequest(uri, 'POST')
	        .withDataFromForm(form)
	        .withData(extraData)
	        .withSuccessHandler(this._handleAJAXDialogResponse)
	        .go();
	    return this;
	  }

	  /**
	   * Updates the HTML contents of the dialog.
	   *
	   * @param html {String} The HTML.
	   * @returns {AJAXDialog} This.
	   */
	  setHTML(html) {
	    this.element.setHTML(html);
	    this._initializeDialog();
	    return this;
	  }

	  /**
	   * Sets any additional classes that should be on the dialog.
	   *
	   * @param classes {string} The list of additional classes.
	   * @returns {AJAXDialog} This.
	   */
	  withAdditionalClasses(classes) {
	    this.options.additionalClasses = classes;
	    return this;
	  }

	  /**
	   * Override the default Ajax Request used to open the dialog. This does not override the
	   * success and error handlers.
	   *
	   * @param request {PrimeRequest} The Ajax Request to use to open the dialog.
	   * @returns {AJAXDialog} This.
	   */
	  withAjaxRequest(request) {
	    this.options.ajaxRequest = request;
	    return this;
	  }

	  /**
	   * Sets the callback that is called after the dialog has been fetched and rendered.
	   *
	   * @param callback {function} The callback function.
	   * @returns {AJAXDialog} This.
	   */
	  withCallback(callback) {
	    this.options.callback = callback;
	    return this;
	  }

	  /**
	   * Sets the class name for the dialog element.
	   *
	   * @param className {string} The class name.
	   * @returns {AJAXDialog} This.
	   */
	  withClassName(className) {
	    if (className.indexOf(' ') !== -1) {
	      throw 'Invalid class name [' + className + ']. You can use the additionalClasses options to add more classes.';
	    }

	    this.options.className = className;
	    return this;
	  }

	  /**
	   * Sets the close button element selector that is used to setup the close button in the HTML that was returned from
	   * the server.
	   *
	   * @param selector {string} The element selector.
	   * @returns {AJAXDialog} This.
	   */
	  withCloseButtonElementSelector(selector) {
	    this.options.closeButtonElementSelector = selector;
	    return this;
	  }

	  /**
	   * Sets the timeout used in the close method to allow for transitions.
	   *
	   * @param timeout {int} The timeout.
	   * @returns {AJAXDialog} This.
	   */
	  withCloseTimeout(timeout) {
	    this.options.closeTimeout = timeout;
	    return this;
	  }

	  /**
	   * Sets the draggable element selector that is used for the DraggableWidget.
	   *
	   * @param selector {string} The element selector.
	   * @returns {AJAXDialog} This.
	   */
	  withDraggableButtonElementSelector(selector) {
	    this.options.draggableElementSelector = selector;
	    return this;
	  }

	  /**
	   * Sets an error callback for AJAX form handling. This is called after a failed form submission.
	   *
	   * @param callback {Function} The callback function. The callback function will called with two parameters,
	   *        the first is a reference this object, the second is the XMLHttpRequest object.
	   * @returns {AJAXDialog} This.
	   */
	  withFormErrorCallback(callback) {
	    this.options.formErrorCallback = callback;
	    return this;
	  }

	  /**
	   * Sets whether or not forms inside the dialog are handled via AJAX or not.
	   *
	   * @param enabled {boolean} The choice.
	   * @returns {AJAXDialog} This.
	   */
	  withFormHandling(enabled) {
	    this.options.formHandling = enabled;
	    return this;
	  }

	  /**
	   * Sets a pre-submit callback for AJAX form handling. This is called before the form is submitted.
	   *
	   * @param callback {Function} The callback function.
	   * @returns {AJAXDialog} This.
	   */
	  withFormPreSubmitCallback(callback) {
	    this.options.formPreSubmitCallback = callback;
	    return this;
	  }

	  /**
	   * Sets a success callback for AJAX form handling. This is called after a successful form submission.
	   *
	   * @param callback {Function} The callback function. The callback function will called with two parameters,
	   *        the first is a reference this object, the second is the XMLHttpRequest object.
	   * @returns {AJAXDialog} This.
	   */
	  withFormSuccessCallback(callback) {
	    this.options.formSuccessCallback = callback;
	    return this;
	  }

	  /**
	   * Set more than one option at a time by providing a map of key value pairs. This is considered an advanced
	   * method to set options on the widget. The caller needs to know what properties are valid in the options object.
	   *
	   * @param {Object} options Key value pair of configuration options.
	   * @returns {AJAXDialog} This.
	   */
	  withOptions(options) {
	    if (!Utils.isDefined(options)) {
	      return this;
	    }

	    for (let option in options) {
	      if (options.hasOwnProperty(option)) {
	        this.options[option] = options[option];
	      }
	    }
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  _determineZIndex() {
	    let highestZIndex = 0;
	    PrimeDocument.query('.' + this.options.className).each(function(dialog) {
	      const zIndex = parseInt(dialog.getComputedStyle()['zIndex']);
	      if (dialog.isVisible() && zIndex > highestZIndex) {
	        highestZIndex = zIndex;
	      }
	    });
	    return highestZIndex;
	  }

	  _handleCloseClickEvent(event) {
	    Utils.stopEvent(event);
	    this.close();
	  }

	  _handleAJAXDialogResponse(xhr) {
	    this.element = PrimeDocument.newElement('<div/>', {class: this.options.className + ' ' + this.options.additionalClasses}).appendTo(document.body);
	    this.setHTML(xhr.responseText);
	  }

	  _handleAJAXFormError(xhr) {
	    this.setHTML(xhr.responseText);
	    this.form = this.element.queryFirst('form').addEventListener('submit', this._handleAJAXFormSubmit);

	    if (this.options.formErrorCallback !== null) {
	      this.options.formErrorCallback(this, xhr);
	    }

	    if (this.draggable !== null) {
	      this.draggable.destroy();
	    }

	    if (this.options.draggableElementSelector !== null && this.element.queryFirst(this.options.draggableElementSelector) !== null) {
	      this.draggable = new Draggable(this.element, this.options.draggableElementSelector).initialize();
	    }
	  }

	  _handleAJAXFormSuccess(xhr) {
	    if (this.options.formSuccessCallback !== null) {
	      this.options.formSuccessCallback(this, xhr);
	    } else {
	      const successURI = this.form.getDataSet()['ajaxSuccessUri'];
	      if (successURI !== undefined) {
	        window.location = successURI;
	      } else {
	        window.location.reload();
	      }
	    }
	  }

	  _handleAJAXFormSubmit(event) {
	    Utils.stopEvent(event);

	    if (this.options.formPreSubmitCallback !== null) {
	      this.options.formPreSubmitCallback(this);
	    }

	    new PrimeRequest(this.form.getAttribute('action'), this.form.getAttribute('method'))
	        .withDataFromForm(this.form)
	        .withSuccessHandler(this._handleAJAXFormSuccess)
	        .withErrorHandler(this._handleAJAXFormError)
	        .go();
	  }

	  _initializeDialog() {
	    this.element.query(this.options.closeButtonElementSelector).each(function(e) {
	      e.addEventListener('click', this._handleCloseClickEvent);
	    }.bind(this));

	    // Only set the z-index upon first open
	    if (!this.initialized) {
	      const highestZIndex = this._determineZIndex();
	      Overlay.instance.open(highestZIndex + this.options.zIndexOffset);
	      this.element.setStyle('zIndex', (highestZIndex + this.options.zIndexOffset + 10).toString());
	      this.element.addClass('open');
	    }

	    // Call the callback before positioning to ensure all changes to the dialog have been made
	    if (this.options.callback !== null) {
	      this.options.callback(this);
	    }

	    // Setup forms if enabled
	    if (this.options.formHandling) {
	      this.form = this.element.queryFirst('form').addEventListener('submit', this._handleAJAXFormSubmit);
	    }

	    // Only set the position of the dialog when we first open it, if someone calls setHTML on the dialog we are not resizing it.
	    if (!this.initialized) {
	      // Position the fixed dialog in the center of the screen
	      const windowHeight = PrimeWindow.getInnerHeight();
	      const dialogHeight = this.element.getHeight();
	      this.element.setTop(((windowHeight - dialogHeight) / 2) - 20);
	    }

	    if (this.options.draggableElementSelector !== null && this.element.queryFirst(this.options.draggableElementSelector) !== null) {
	      this.draggable = new Draggable(this.element, this.options.draggableElementSelector).initialize();
	    }

	    this.initialized = true;
	  }

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      additionalClasses: '',
	      ajaxRequest: null,
	      callback: null,
	      className: 'prime-dialog',
	      closeButtonElementSelector: '[data-dialog-role="close-button"]',
	      closeTimeout: 200,
	      draggableElementSelector: '[data-dialog-role="draggable"]',
	      formErrorCallback: null,
	      formHandling: false,
	      formPreSubmitCallback: null,
	      formSuccessCallback: null,
	      zIndexOffset: 1000
	    };
	  }
	}

	/*
	 * Copyright (c) 2013-2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	/**
	 * @const {{Keys: {BACKSPACE: number, ENTER: number, ESCAPE: number, SPACE: number, TAB: number, LEFT_ARROW: number, UP_ARROW: number, RIGHT_ARROW: number, DOWN_ARROW: number, DELETE: number}} Events}
	 */
	const Events = {
	  Keys: {
	    BACKSPACE: 8,
	    ENTER: 13,
	    ESCAPE: 27,
	    SPACE: 32,
	    TAB: 9,
	    LEFT_ARROW: 37,
	    UP_ARROW: 38,
	    RIGHT_ARROW: 39,
	    DOWN_ARROW: 40,
	    DELETE: 46
	  }
	};

	/*
	 * Copyright (c) 2015-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	const PrimeDate = {
	  DAYS_IN_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

	  /**
	   * Return the hour in a 12-hour format. AM and PM are not communicated by the returned hour.
	   *
	   * @param date {Date} The date object to retrieve the hour from.
	   * @returns {Number} The hour of the day between 1 and 12.
	   */
	  getHourOfDay: function(date) {
	    return (date.getHours() + 24) % 12 || 12;
	  },

	  /**
	   * @param year The year.
	   * @returns {boolean} True if this is a leap year, otherwise false.
	   */
	  isLeapYear: function(year) {
	    return !((year % 4) || (!(year % 100) && (year % 400)));
	  },

	  /**
	   * Return the number of days in the month.
	   * @param year The year, the days in the month may change during a leap year.
	   * @param month The month.
	   * @returns {Number} The number of days in the month.
	   */
	  numberOfDaysInMonth: function(year, month) {
	    if (month === 1 && this.isLeapYear(year)) {
	      return 29;
	    } else {
	      return PrimeDate.DAYS_IN_MONTH[month];
	    }
	  },

	  /**
	   * Adds the given number of days to the given Date.
	   *
	   * @param date {Date} The date to add the days to.
	   * @param number {Number} The number of days to add.
	   */
	  plusDays: function(date, number) {
	    if (number === 0) {
	      return;
	    }

	    let newDate = date.getDate() + number;
	    let numberOfDaysInMonth = PrimeDate.numberOfDaysInMonth(date.getFullYear(), date.getMonth());

	    if (newDate > 0) {
	      while (newDate > numberOfDaysInMonth) {
	        PrimeDate.plusMonths(date, 1);
	        newDate = newDate - numberOfDaysInMonth;
	        numberOfDaysInMonth = PrimeDate.numberOfDaysInMonth(date.getFullYear(), date.getMonth());
	      }

	      date.setDate(newDate);
	    } else {
	      while (newDate <= 0) {
	        PrimeDate.plusMonths(date, -1);
	        numberOfDaysInMonth = PrimeDate.numberOfDaysInMonth(date.getFullYear(), date.getMonth());
	        newDate = newDate + numberOfDaysInMonth;
	      }

	      date.setDate(newDate);
	    }
	  },

	  /**
	   * Adds the given number of hours to the given Date. The number can be negative.
	   *
	   * @param date {Date} The date.
	   * @param number {Number} The number of hours to add.
	   */
	  plusHours: function(date, number) {
	    if (number === 0) {
	      return;
	    }

	    const deltaDays = parseInt(number / 24);
	    PrimeDate.plusDays(date, deltaDays);

	    const deltaHours = number % 24;
	    const newHour = date.getHours() + deltaHours;
	    if (newHour > 23) {
	      PrimeDate.plusDays(date, 1);
	      date.setHours(newHour - 24);
	    } else if (newHour < 0) {
	      PrimeDate.plusDays(date, -1);
	      date.setHours(24 + newHour);
	    } else {
	      date.setHours(newHour);
	    }
	  },

	  /**
	   * Adds the given number of minutes to the given Date. The number can be negative.
	   *
	   * @param date {Date} The date.
	   * @param number {Number} The number of minutes to add.
	   */
	  plusMinutes: function(date, number) {
	    if (number === 0) {
	      return;
	    }

	    const deltaHours = parseInt(number / 60);
	    PrimeDate.plusHours(date, deltaHours);

	    const deltaMinutes = number % 60;
	    const newMinute = date.getMinutes() + deltaMinutes;
	    if (newMinute > 60) {
	      PrimeDate.plusHours(date, 1);
	      date.setMinutes(newMinute - 60);
	    } else if (newMinute < 0) {
	      PrimeDate.plusHours(date, -1);
	      date.setMinutes(60 + newMinute);
	    } else {
	      date.setMinutes(newMinute);
	    }
	  },

	  /**
	   * Adds the given number of months to the given Date. The number can be negative.
	   *
	   * @param date {Date} The date.
	   * @param number {Number} The number of months to add.
	   */
	  plusMonths: function(date, number) {
	    if (number === 0) {
	      return;
	    }

	    let deltaYears = parseInt(number / 12);
	    let deltaMonths = number % 12;
	    let currentMonth = date.getMonth();
	    const newMonth = currentMonth + deltaMonths;
	    if (newMonth < 0) {
	      deltaYears--;
	      deltaMonths = newMonth;
	      currentMonth = 12;
	    } else if (newMonth >= 12) {
	      deltaYears++;
	      deltaMonths = newMonth - 12;
	      currentMonth = 0;
	    }

	    date.setYear(date.getFullYear() + deltaYears);
	    // If the day is 31 and you set month to 1 (February) it will adjust to March 3 (Feb 28 + 3)
	    const adjustedMonth = currentMonth + deltaMonths;
	    if (date.getDate() > this.DAYS_IN_MONTH[adjustedMonth]) {
	      date.setDate(this.DAYS_IN_MONTH[adjustedMonth]);
	    }
	    date.setMonth(adjustedMonth);
	  },

	  /**
	   * Adds the given number of seconds to the given Date. The number can be negative.
	   *
	   * @param date {Date} The date.
	   * @param number {Number} The number of seconds to add.
	   */
	  plusSeconds: function(date, number) {
	    if (number === 0) {
	      return;
	    }

	    const deltaMinutes = parseInt(number / 60);
	    PrimeDate.plusMinutes(date, deltaMinutes);

	    const deltaSeconds = number % 60;
	    const newSecond = date.getSeconds() + deltaSeconds;
	    if (newSecond > 60) {
	      PrimeDate.plusMinutes(date, 1);
	      date.setSeconds(newSecond - 60);
	    } else if (newSecond < 0) {
	      PrimeDate.plusMinutes(date, -1);
	      date.setSeconds(60 + newSecond);
	    } else {
	      date.setSeconds(newSecond);
	    }
	  },

	  /**
	   * Adds the given number of years to the given Date. The number can be negative.
	   *
	   * @param date {Date} The date.
	   * @param number {Number} The number of years to add.
	   */
	  plusYears: function(date, number) {
	    if (number === 0) {
	      return;
	    }

	    date.setFullYear(date.getFullYear() + number);
	  },

	  /**
	   * Return a string in simplified extended ISO format (ISO 8601) truncated to only return YYYY-MM-DD.
	   *
	   * For example: new Date(2015, 6, 4) --> 2015-07-04
	   *
	   * @param date {Date} The date.
	   * @returns {String} A date string in the format YYYY-MM-DD.
	   */
	  toDateOnlyISOString: function(date) {
	    if (date instanceof Date) {
	      return date.getFullYear()
	          + '-' + Utils.leftPadNumber(date.getMonth() + 1, 2)
	          + '-' + Utils.leftPadNumber(date.getDate(), 2);
	    }
	    throw TypeError('date parameter must be a Date object.');
	  }
	};

	/*
	 * Copyright (c) 2015-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	const SHORT_DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const DATE_SEPARATOR = '/';
	const TIME_SEPARATOR = ':';
	const AM_PM = ['AM', 'PM'];

	class DateTimePicker {
	  /**
	   * Constructs a new DateTimePicker object for the given input element.
	   *
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element for the DateTimePicker widget.
	   * @constructor
	   */
	  constructor(element) {
	    Utils.bindAll(this);

	    this.element = PrimeElement.wrap(element);
	    if (!this.element.is('input')) {
	      throw new TypeError('You can only use DateTimePicker with an input element');
	    }

	    this.callback = null;
	    this.customFormatHandler = null;
	    this._setInitialOptions();
	  };

	  static get SHORT_DAY_NAMES() {
	    return SHORT_DAY_NAMES;
	  }

	  static get MONTHS() {
	    return MONTHS;
	  }

	  static get DATE_SEPARATOR() {
	    return DATE_SEPARATOR;
	  }

	  static get TIME_SEPARATOR() {
	    return TIME_SEPARATOR;
	  }

	  static get AM_PM() {
	    return AM_PM;
	  }

	  /**
	   * Closes the Date Picker widget.
	   *
	   * @returns {DateTimePicker} This DateTimePicker.
	   */
	  close() {
	    this.datepicker.removeClass('open');

	    // Pause a bit to cancel focus event and allow transition to play
	    setTimeout(function() {
	      this.datepicker.hide();
	    }.bind(this), this.options.closeTimeout);
	    return this;
	  }

	  /**
	   * Closes the months select box.
	   *
	   * @returns {DateTimePicker} This DateTimePicker.
	   */
	  closeMonthsSelect() {
	    this.months.removeClass('open');
	    setTimeout(function() {
	      this.months.hide();
	    }.bind(this), this.options.closeTimeout);
	    return this;
	  }

	  /**
	   * Closes the years select box.
	   *
	   * @returns {DateTimePicker} This DateTimePicker.
	   */
	  closeYearsSelect() {
	    this.years.removeClass('open');
	    setTimeout(function() {
	      this.years.hide();
	    }.bind(this), this.options.closeTimeout);
	    return this;
	  }

	  /**
	   * Destroys the DateTimePicker Widget
	   */
	  destroy() {
	    this.datepicker.removeFromDOM();
	    this.element.removeEventListener('click', this._handleInputClick)
	        .removeEventListener('focus', this._handleInputClick)
	        .removeEventListener('keydown', this._handleInputKey);
	    PrimeDocument.removeEventListener('click', this._handleGlobalClick);
	    PrimeDocument.removeEventListener('keydown', this._handleGlobalKey);
	  }

	  /**
	   * Draws the calendar using the month and year from the given Date object.
	   *
	   * @param date {Date} The date to draw the calendar for.
	   * @return {DateTimePicker} This DateTimePicker.
	   */
	  drawCalendar(date) {
	    const month = date.getMonth();
	    const year = date.getFullYear();
	    const firstDay = new Date(year, month, 1);
	    const firstDayOfMonth = firstDay.getDay();
	    const daysInMonth = PrimeDate.numberOfDaysInMonth(year, month);
	    const used = firstDayOfMonth + daysInMonth;
	    const weeksInMonth = Math.ceil(used / 7);

	    let rows = '';
	    let startDay = 1;
	    for (let i = 0; i < weeksInMonth; i++) {
	      const startDayOfWeek = i === 0 ? firstDayOfMonth : 0;
	      rows += this._buildCalendarWeek(date, startDayOfWeek, startDay, daysInMonth);
	      startDay += 7 - startDayOfWeek; // increment by 7 adjusted by a week day of week offset
	    }

	    this.calendarBody.setHTML(rows);

	    // update data- attributes
	    this.monthDisplay.setDataAttribute('month', month);
	    this.yearDisplay.setDataAttribute('year', year);

	    // update text
	    this.monthDisplay.setTextContent(DateTimePicker.MONTHS[month]);
	    this.yearDisplay.setTextContent(year);

	    return this;
	  }

	  /**
	   * Rebuilds the entire widget using the date value. Even if the user has moved to a different month display, this will
	   * rebuild the table completely.
	   *
	   * @returns {DateTimePicker} This DateTimePicker.
	   */
	  initialize() {
	    const value = this.element.getValue();
	    if (value === '' || value === null) {
	      this.date = new Date();
	    } else {
	      this.date = new Date(value);
	    }

	    const year = this.date.getUTCFullYear();
	    const timeSeparator = `<span>${DateTimePicker.TIME_SEPARATOR}</span>`;
	    const dateSeparator = `<span>${DateTimePicker.DATE_SEPARATOR}</span>`;
	    let html =
	        `<div class="${this.options.className }">
  <header>
    <span class="prev">&#9664;</span>
    <span class="month"></span>
    <span class="year"></span>
    <span class="next">&#9654;</span>
  </header>
  <table>
    <thead>
      <tr>
        <th>${DateTimePicker.SHORT_DAY_NAMES[0]}</th>
        <th>${DateTimePicker.SHORT_DAY_NAMES[1]}</th>
        <th>${DateTimePicker.SHORT_DAY_NAMES[2]}</th>
        <th>${DateTimePicker.SHORT_DAY_NAMES[3]}</th>
        <th>${DateTimePicker.SHORT_DAY_NAMES[4]}</th>
        <th>${DateTimePicker.SHORT_DAY_NAMES[5]}</th>
        <th>${DateTimePicker.SHORT_DAY_NAMES[6]}</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
  <div class="inputs">
    <div class="date">
      <input size="2" maxlength="2" type="text" name="month" autocomplete="off"/>${dateSeparator}
      <input size="2" maxlength="2" type="text" name="day" autocomplete="off"/>${dateSeparator}
      <input size="4" maxlength="4" type="text" name="year" autocomplete="off"/>
    </div>
    <div class="time">
      <input size="2" maxlength="2" type="text" name="hour" autocomplete="off"/>${timeSeparator}
      <input size="2" maxlength="2" type="text" name="minute" autocomplete="off"/>${timeSeparator}
      <input size="2" maxlength="2" type="text" name="second" autocomplete="off"/>
      <input size="2" maxlength="2" type="text" name="am_pm" autocomplete="off"/>
    </div>
  </div>
</div>`;
	    PrimeDocument.appendHTML(html);
	    this.datepicker = PrimeDocument.queryLast('.' + this.options.className).hide();
	    this.element.addEventListener('click', this._handleInputClick);
	    this.element.addEventListener('focus', this._handleInputClick);
	    this.element.addEventListener('keydown', this._handleInputKey);

	    this.calendarBody = this.datepicker.queryFirst('table tbody').addEventListener('click', this._handleDayClick);
	    this.monthDisplay = this.datepicker.queryFirst('header .month').addEventListener('click', this._handleMonthExpand);
	    this.yearDisplay = this.datepicker.queryFirst('header .year').addEventListener('click', this._handleYearExpand);

	    this.time = this.datepicker.queryFirst('.time');
	    this.inputs = this.datepicker.queryFirst('div.inputs');
	    this.hourInput = this.inputs.queryFirst('input[name=hour]').addEventListener('change', this._handleDateTimeChange).addEventListener('keydown', this._handleHourKey);
	    this.minuteInput = this.inputs.queryFirst('input[name=minute]').addEventListener('change', this._handleDateTimeChange).addEventListener('keydown', this._handleMinuteKey);
	    this.secondInput = this.inputs.queryFirst('input[name=second]').addEventListener('change', this._handleDateTimeChange).addEventListener('keydown', this._handleSecondKey);
	    this.ampmInput = this.inputs.queryFirst('input[name=am_pm]').addEventListener('keydown', this._handleAmPmKey);
	    this.monthInput = this.inputs.queryFirst('input[name=month]').setValue(this.date.getMonth() + 1).addEventListener('change', this._handleDateTimeChange).addEventListener('keydown', this._handleMonthKey);
	    this.dayInput = this.inputs.queryFirst('input[name=day]').setValue(this.date.getDate()).addEventListener('change', this._handleDateTimeChange).addEventListener('keydown', this._handleDayKey);
	    this.yearInput = this.inputs.queryFirst('input[name=year]').setValue(this.date.getFullYear()).addEventListener('change', this._handleDateTimeChange).addEventListener('keydown', this._handleYearKey);

	    this.datepicker.queryFirst('header .next').addEventListener('click', this._handleNextMonth);
	    this.datepicker.queryFirst('header .prev').addEventListener('click', this._handlePreviousMonth);

	    PrimeDocument.addEventListener('click', this._handleGlobalClick);
	    PrimeDocument.addEventListener('keydown', this._handleGlobalKey);

	    // Setup months dropdown
	    html = '<div class="months">';
	    for (let i = 0; i < DateTimePicker.MONTHS.length; i++) {
	      html += `<div data-month="${i}">${DateTimePicker.MONTHS[i]}</div>`;
	    }
	    html += '</div>';
	    this.datepicker.appendHTML(html);
	    this.months = this.datepicker.queryFirst('.months');
	    this.months.hide();
	    this.months.getChildren().each(function(month) {
	      month.addEventListener('click', function() {
	        this.setMonth(parseInt(month.getDataAttribute('month')));
	        this.closeMonthsSelect();
	      }.bind(this));
	    }.bind(this));

	    // Setup year dropdown
	    html = '<div class="years">';
	    const startYear = this.date.getFullYear() - 10;
	    const endYear = this.date.getFullYear() + 10;
	    for (let i = startYear; i < endYear; i++) {
	      html += `<div data-year="${i}">${i}</div>`;
	    }
	    html += '</div>';
	    this.datepicker.appendHTML(html);
	    this.years = this.datepicker.queryFirst('.years');
	    this.years.hide();
	    this.years.getChildren().each(function(year) {
	      year.addEventListener('click', function() {
	        this.setYear(parseInt(year.getDataAttribute('year')));
	        this.closeYearsSelect();
	      }.bind(this));
	    }.bind(this));

	    this._rebuild();

	    if (this.customFormatHandler !== null) {
	      this.element.setValue(this.customFormatHandler.call(null, this.date));
	    }

	    return this;
	  }

	  /**
	   * @returns {Date} Return the current value of the time picker.
	   */
	  getDate() {
	    return new Date(this.date.getTime());
	  }

	  /**
	   * Moves the DateTimePicker to the next month and redraws the calendar.
	   *
	   * @returns {DateTimePicker} This DateTimePicker.
	   */
	  nextMonth() {
	    const newDate = new Date(this.date);
	    newDate.setDate(1); // Set the day to 1 to keep us from wrapping months on the 30 and 31st.
	    newDate.setMonth(parseInt(this.monthDisplay.getDataAttribute('month')));
	    newDate.setFullYear(parseInt(this.yearDisplay.getDataAttribute('year')));
	    PrimeDate.plusMonths(newDate, 1);
	    this.drawCalendar(newDate);
	    return this;
	  }

	  /**
	   * Opens the Date Picker widget.
	   *
	   * @returns {DateTimePicker} This DateTimePicker.
	   */
	  open() {
	    this.datepicker.setLeft(this.element.getLeft());
	    this.datepicker.setTop(this.element.getAbsoluteTop() + this.element.getHeight() + 8);
	    this.datepicker.show();
	    this.datepicker.addClass('open');

	    const zIndex = this.element.getRelativeZIndex();
	    this.datepicker.setStyle('zIndex', zIndex + 10);
	    return this;
	  }

	  /**
	   * Opens the month select box.
	   */
	  openMonthSelect() {
	    this.closeYearsSelect();

	    this.months.setLeft(this.monthDisplay.getOffsetLeft() - 5);
	    this.months.setTop(this.monthDisplay.getOffsetTop() - 5);
	    this.months.setStyle('zIndex', this.monthDisplay.getRelativeZIndex() + 10);
	    this.months.show();
	    this.months.addClass('open');

	    const currentMonth = this.months.queryFirst('[data-month="' + this.date.getMonth() + '"]');
	    this.months.getChildren().each(function(month) {
	      month.removeClass('selected');
	    });
	    currentMonth.addClass('selected');
	  }

	  /**
	   * Opens the year select box.
	   */
	  openYearSelect() {
	    this.closeMonthsSelect();

	    this.years.setLeft(this.yearDisplay.getOffsetLeft() - 5);
	    this.years.setTop(this.yearDisplay.getOffsetTop() - 5);
	    this.years.setStyle('zIndex', this.yearDisplay.getRelativeZIndex() + 10);
	    this.years.show();
	    this.years.addClass('open');

	    const currentYear = this.years.queryFirst('[data-year="' + this.date.getFullYear() + '"]');
	    this.years.getChildren().each(function(year) {
	      year.removeClass('selected');
	    });
	    currentYear.addClass('selected');
	  }

	  /**
	   * Moves the DateTimePicker to the previous month and redraws the calendar.
	   *
	   * @returns {DateTimePicker} This DateTimePicker.
	   */
	  previousMonth() {
	    const newDate = new Date(this.date);
	    newDate.setDate(1); // Set to 1 until month has been set
	    newDate.setMonth(parseInt(this.monthDisplay.getDataAttribute('month')));
	    newDate.setFullYear(parseInt(this.yearDisplay.getDataAttribute('year')));
	    PrimeDate.plusMonths(newDate, -1);
	    this.drawCalendar(newDate);
	    return this;
	  }

	  /**
	   * Sets the date of the DateTimePicker and redraws the calendar to the month for the date.
	   *
	   * @param {Date} newDate The new date.
	   * @returns {DateTimePicker} This DateTimePicker.
	   */
	  setDate(newDate) {
	    this.date = newDate;

	    if (this.customFormatHandler !== null) {
	      this.element.setValue(this.customFormatHandler.call(null, this.date));
	    } else {
	      if (this.options.dateOnly) {
	        this.element.setValue(PrimeDate.toDateOnlyISOString(newDate));
	      } else {
	        this.element.setValue(newDate.toISOString());
	      }
	    }

	    this._rebuild();

	    if (this.callback !== null) {
	      this.callback(this);
	    }

	    return this;
	  }

	  /**
	   * @param {number} month The month. A 0 based number between 0 (January) and 11 (December).
	   * @returns {DateTimePicker}
	   */
	  setMonth(month) {
	    let currentYear = parseInt(this.yearDisplay.getDataAttribute('year'));
	    if (month < 0) {
	      month = 11;
	      currentYear--;
	    } else if (month > 11) {
	      currentYear++;
	      month = 0;
	    }

	    this.date.setMonth(month);
	    this.date.setYear(currentYear);
	    this.setDate(this.date);

	    return this;
	  }

	  /**
	   *
	   * @param {number} year The year.
	   * @returns {DateTimePicker}
	   */
	  setYear(year) {
	    this.yearDisplay.setDataAttribute('year', year);
	    this.yearDisplay.setTextContent(year);
	    this.date.setYear(year);
	    this.setDate(this.date);
	    return this;
	  }

	  /**
	   * Sets the callback handler that is called with the DateTimePicker's value is changed.
	   *
	   * @param callback {Function} The callback function.
	   * @return {DateTimePicker} This.
	   */
	  withCallback(callback) {
	    this.callback = callback;
	    return this;
	  }

	  /**
	   * Sets the class name for the main div of the date time picker.
	   *
	   * @param className {string} The class name.
	   * @returns {DateTimePicker} This.
	   */
	  withClassName(className) {
	    this.options.className = className;
	    return this;
	  }

	  /**
	   * Sets the timeout used in the close method to allow for transitions.
	   *
	   * @param timeout {int} The timeout.
	   * @returns {DateTimePicker}
	   */
	  withCloseTimeout(timeout) {
	    this.options.closeTimeout = timeout;
	    return this;
	  }

	  /**
	   * Sets a custom format handler responsible for formatting the date string that will be set into the input field.
	   * When not defined the default behavior will be used.
	   *
	   * @param formatHandler {Function} The handler function.
	   * @return {DateTimePicker} This.
	   */
	  withCustomFormatHandler(formatHandler) {
	    this.customFormatHandler = formatHandler;
	    return this;
	  }

	  /**
	   * Render the DateTimePicker w/out the time picker. Only the calendar will be displayed and the input field will be updated with date only.
	   *
	   *
	   * @returns {DateTimePicker} This DateTimePicker.
	   */
	  withDateOnly() {
	    this.options.dateOnly = true;
	    return this;
	  }

	  /**
	   * Set more than one option at a time by providing a map of key value pairs. This is considered an advanced
	   * method to set options on the widget. The caller needs to know what properties are valid in the options object.
	   *
	   * @param {Object} options Key value pair of configuration options.
	   * @returns {DateTimePicker} This DateTimePicker.
	   */
	  withOptions(options) {
	    if (!Utils.isDefined(options)) {
	      return this;
	    }

	    for (let option in options) {
	      if (options.hasOwnProperty(option)) {
	        this.options[option] = options[option];
	      }
	    }
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Build the HTML for a single calendar week.
	   *
	   * @param date {Date} The date to build the calendar week based on.
	   * @param startDayOfWeek {Number} The day of the week of this week begins. A 0 based number between 0 and 6.
	   * @param startDayOfMonth {Number} The day of the month this week begins. A number between 1 and 31.
	   * @param daysInMonth {Number} The number of days in this calendar month.
	   * @returns {string} The HTML for this week.
	   * @private
	   */
	  _buildCalendarWeek(date, startDayOfWeek, startDayOfMonth, daysInMonth) {
	    const daysInPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
	    let startDayOfPreviousMonth = daysInPreviousMonth - startDayOfWeek + 1;
	    let startDayOfNextMonth = 1;

	    let row = '<tr>';
	    let emptyColumns = 0;
	    const year = date.getFullYear();
	    const month = date.getMonth();

	    for (let i = 0; i < 7; i++) {
	      const dayOfWeek = startDayOfMonth + i;
	      // Days of the previous month
	      if (dayOfWeek <= startDayOfWeek) {
	        row += '<td><a class="inactive" href="#" data-year="' + year + '" data-month="' + (month - 1) + '" data-day="' + startDayOfPreviousMonth + '">' + startDayOfPreviousMonth + '</a></td>';
	        startDayOfPreviousMonth++;
	        emptyColumns++;
	      } else if (dayOfWeek > daysInMonth) {
	        // Days of the next month
	        row += '<td><a class="inactive" href="#" data-year="' + year + '" data-month="' + month + '" data-day="' + dayOfWeek + '">' + startDayOfNextMonth + '</a></td>';
	        startDayOfNextMonth++;
	      } else {
	        // Days in the current month
	        const day = dayOfWeek - emptyColumns;
	        const selected = this.date.getDate() === day && this.date.getMonth() === month;
	        row += '<td><a ' + (selected ? 'class="selected"' : '') + 'href="#" data-year="' + year + '" data-month="' + month + '" data-day="' + day + '">' + day + '</a></td>';
	      }
	    }

	    row += '</tr>';
	    return row;
	  }

	  // noinspection JSMethodCanBeStatic
	  /**
	   * Clamp the value between the minimum and maximum values.
	   *
	   * @param {Number} min the minimum number value.
	   * @param {Number} max The maximum number value.
	   * @param {Number} value The value to clamp.
	   * @returns {Number} The resulting value, either the min, max or actual value if not out of bounds.
	   * @private
	   */
	  _clamp(min, max, value) {
	    return Math.max(min, Math.min(value, max));
	  }

	  /**
	   * Handles when the AM/PM element is selected and the user hits a key. If the user hits A, this changes to AM. If the
	   * user hits P, this changes to PM. If the use hits the up or down arrows, this toggles between AM and PM.
	   *
	   * @param {KeyboardEvent} event The keyboard event.
	   * @private
	   */
	  _handleAmPmKey(event) {
	    if (event.keyCode === Events.Keys.TAB) {
	      Utils.stopEvent(event);
	      if (event.shiftKey) {
	        this.secondInput.domElement.setSelectionRange(0, this.secondInput.getValue().length);
	        this.secondInput.focus();
	      } else {
	        this.monthInput.domElement.setSelectionRange(0, this.monthInput.getValue().length);
	        this.monthInput.focus();
	      }
	      return;
	    }

	    // Decode the key event
	    const current = this.ampmInput.getValue();
	    if (event.keyCode === 65) {
	      // User hit A
	      if (current === DateTimePicker.AM_PM[1]) {
	        PrimeDate.plusHours(this.date, -12);
	      }
	    } else if (event.keyCode === 80) {
	      // User hit P
	      if (current === DateTimePicker.AM_PM[0]) {
	        PrimeDate.plusHours(this.date, 12);
	      }
	    } else if (event.keyCode === Events.Keys.UP_ARROW || event.keyCode === Events.Keys.DOWN_ARROW) {
	      // User hit up or down arrow
	      if (current === DateTimePicker.AM_PM[0]) {
	        PrimeDate.plusHours(this.date, 12);
	      } else if (current === DateTimePicker.AM_PM[1]) {
	        PrimeDate.plusHours(this.date, -12);
	      }
	    } else if (event.keyCode === Events.Keys.ENTER || event.keyCode === Events.Keys.ESCAPE) {
	      return;
	    }

	    this.setDate(this.date);
	    this.ampmInput.domElement.setSelectionRange(0, this.ampmInput.getValue().length);
	    Utils.stopEvent(event);
	  }

	  /**
	   * Handle date/time change events. This pulls the values from the 3 date fields and makes a new Date. Then it calls
	   * {@link #setDate(Date)}.
	   *
	   * @param {KeyboardEvent} event The keyboard event.
	   * @private
	   */
	  _handleDateTimeChange(event) {
	    Utils.stopEvent(event);
	    const newDate = new Date();
	    const hours = this._clamp(1, 12, parseInt(this.hourInput.getValue()));
	    if (this.ampmInput.getValue() === DateTimePicker.AM_PM[0]) {
	      if (hours === 12) {
	        newDate.setHours(0);
	      } else {
	        newDate.setHours(hours);
	      }
	    } else {
	      if (hours === 12) {
	        newDate.setHours(12);
	      } else {
	        newDate.setHours(hours + 12);
	      }
	    }

	    const seconds = this._clamp(0, 59, parseInt(this.secondInput.getValue()));
	    const minutes = this._clamp(0, 59, parseInt(this.minuteInput.getValue()));

	    newDate.setSeconds(seconds);
	    newDate.setMinutes(minutes);
	    newDate.setDate(1); // Set to 1 until month has been set
	    newDate.setMonth(parseInt(this.monthInput.getValue()) - 1);
	    newDate.setDate(parseInt(this.dayInput.getValue()));
	    newDate.setYear(parseInt(this.yearInput.getValue()));

	    this.setDate(newDate);
	  }

	  /**
	   * Handle the click on a day.
	   *
	   * @parameter {MouseEvent} event The click event.
	   * @private
	   */
	  _handleDayClick(event) {
	    Utils.stopEvent(event);
	    let dayElement = new PrimeElement(event.target);
	    if (!dayElement.is('a')) {
	      dayElement = dayElement.queryFirst('a');
	    }

	    const newDate = new Date(this.date);
	    newDate.setDate(1); // Set to 1 until month has been set
	    newDate.setFullYear(parseInt(dayElement.getDataAttribute('year')));
	    newDate.setMonth(parseInt(dayElement.getDataAttribute('month')));
	    newDate.setDate(parseInt(dayElement.getDataAttribute('day')));
	    this.setDate(newDate);
	  }

	  /**
	   * Handles when a key is click in the day input field so that tab and shift tab work properly.
	   * <p>
	   * Also handles up and down arrow to increment and decrement the day.
	   *
	   * @param {KeyboardEvent} event The key event.
	   * @private
	   */
	  _handleDayKey(event) {
	    if (event.keyCode === Events.Keys.UP_ARROW) {
	      PrimeDate.plusDays(this.date, 1);
	      this.setDate(this.date);
	      this.dayInput.domElement.setSelectionRange(0, this.dayInput.getValue().length);
	      Utils.stopEvent(event);
	    } else if (event.keyCode === Events.Keys.DOWN_ARROW) {
	      Utils.stopEvent(event);
	      PrimeDate.plusDays(this.date, -1);
	      this.setDate(this.date);
	      this.dayInput.domElement.setSelectionRange(0, this.dayInput.getValue().length);
	    } else if (event.keyCode === Events.Keys.ENTER) {
	      this.date.setDate(parseInt(this.dayInput.getValue()));
	    }
	  }

	  /**
	   * Handles a global click event. This determines if the click was outside of the DateTimePicker and closes it.
	   *
	   * @param {MouseEvent} event The click event.
	   * @private
	   */
	  _handleGlobalClick(event) {
	    // Skip this function completely if they clicked the input field
	    if (event.target === this.element.domElement) {
	      return;
	    }

	    const top = this.datepicker.getTop();
	    const bottom = this.datepicker.getBottom();
	    const left = this.datepicker.getLeft();
	    const right = this.datepicker.getRight();
	    if (this.datepicker.isVisible() && (event.x < left || event.x > right || event.y < top || event.y > bottom)) {
	      this.close();
	      this.closeYearsSelect();
	      this.closeMonthsSelect();
	    } else {
	      if (this.years.isVisible()) {
	        this.closeYearsSelect();
	      }
	      if (this.months.isVisible()) {
	        this.closeMonthsSelect();
	      }
	    }
	  }

	  /**
	   * Handles a global key event. This determines if the DateTimePicker is open and if enter or escape was hit.
	   *
	   * @param {KeyboardEvent} event The key event.
	   * @private
	   */
	  _handleGlobalKey(event) {
	    // Skip this function completely if the DateTimePicker isn't open
	    if (!this.datepicker.isVisible()) {
	      return;
	    }

	    if (event.keyCode === Events.Keys.ENTER) {
	      Utils.stopEvent(event);
	      this.setDate(this.date);
	      this.close();
	      this.element.focus();
	    } else if (event.keyCode === Events.Keys.ESCAPE) {
	      this.close();
	      this.element.focus();
	    }
	  }

	  /**
	   * Handles when a key is click in the hours input field so that tab and shift tab work properly.
	   * <p>
	   * Also handles up and down arrow to increment and decrement the hour.
	   *
	   * @param {KeyboardEvent} event The key event.
	   * @private
	   */
	  _handleHourKey(event) {
	    if (event.keyCode === Events.Keys.UP_ARROW) {
	      Utils.stopEvent(event);
	      PrimeDate.plusHours(this.date, 1);
	      this.setDate(this.date);
	      this.hourInput.domElement.setSelectionRange(0, this.hourInput.getValue().length);
	    } else if (event.keyCode === Events.Keys.DOWN_ARROW) {
	      Utils.stopEvent(event);
	      PrimeDate.plusHours(this.date, -1);
	      this.setDate(this.date);
	      this.hourInput.domElement.setSelectionRange(0, this.hourInput.getValue().length);
	    } else if (event.keyCode === Events.Keys.ENTER) {
	      this.date.setHours(parseInt(this.hourInput.getValue()));
	    }
	  }

	  /**
	   * Handle the click event for the input date field. If the DateTimePicker is hidden this will call the {@link #show()}
	   * function.
	   *
	   * @returns {boolean} Always true.
	   * @private
	   */
	  _handleInputClick() {
	    if (!this.datepicker.isVisible()) {
	      this.open();
	      this.monthInput.domElement.setSelectionRange(0, this.monthInput.getValue().length);
	      this.monthInput.focus();
	    }
	  }

	  /**
	   * Handle the key event for the input date field. If the user hits tab or shift-tab, this moves the focus to the
	   * nested inputs.
	   *
	   * @param {KeyboardEvent} event The keyboard event.
	   * @private
	   */
	  _handleInputKey(event) {
	    if (this.datepicker.isVisible() && event.keyCode === Events.Keys.TAB) {
	      Utils.stopEvent(event);
	      if (event.shiftKey) {
	        this.ampmInput.domElement.setSelectionRange(0, this.ampmInput.getValue().length);
	        this.ampmInput.focus();
	      } else {
	        this.monthInput.domElement.setSelectionRange(0, this.monthInput.getValue().length);
	        this.monthInput.focus();
	      }
	    }
	  }

	  /**
	   * Handle the key down event and capture the up and down arrow key to increment and decrement the minute.

	   * @param {KeyboardEvent} event The key event.
	   * @private
	   */
	  _handleMinuteKey(event) {
	    if (event.keyCode === Events.Keys.UP_ARROW) {
	      Utils.stopEvent(event);
	      PrimeDate.plusMinutes(this.date, 1);
	      this.setDate(this.date);
	      this.minuteInput.domElement.setSelectionRange(0, this.minuteInput.getValue().length);
	    } else if (event.keyCode === Events.Keys.DOWN_ARROW) {
	      Utils.stopEvent(event);
	      PrimeDate.plusMinutes(this.date, -1);
	      this.setDate(this.date);
	      this.minuteInput.domElement.setSelectionRange(0, this.minuteInput.getValue().length);
	    } else if (event.keyCode === Events.Keys.ENTER) {
	      this.date.setMinutes(parseInt(this.minuteInput.getValue()));
	    }
	  }

	  /**
	   * Handles the click on the month to open the month select.
	   *
	   * @private
	   */
	  _handleMonthExpand(event) {
	    Utils.stopEvent(event);
	    this.openMonthSelect();
	  }

	  /**
	   * Handles when a key is click in the month input field so that tab and shift tab work properly.
	   * <p>
	   * Also handles up and down arrow to increment and decrement the month.
	   *
	   * @param {KeyboardEvent} event The key event.
	   * @private
	   */
	  _handleMonthKey(event) {
	    if (event.keyCode === Events.Keys.TAB && event.shiftKey) {
	      Utils.stopEvent(event);
	      if (this.options.dateOnly) {
	        this.yearInput.domElement.setSelectionRange(0, this.yearInput.getValue().length);
	        this.yearInput.focus();
	      } else {
	        this.ampmInput.domElement.setSelectionRange(0, this.ampmInput.getValue().length);
	        this.ampmInput.focus();
	      }
	      return;
	    }

	    if (event.keyCode === Events.Keys.UP_ARROW) {
	      Utils.stopEvent(event);
	      PrimeDate.plusMonths(this.date, 1);
	      this.setDate(this.date);
	      this.monthInput.domElement.setSelectionRange(0, this.monthInput.getValue().length);
	    } else if (event.keyCode === Events.Keys.DOWN_ARROW) {
	      Utils.stopEvent(event);
	      PrimeDate.plusMonths(this.date, -1);
	      this.setDate(this.date);
	      this.monthInput.domElement.setSelectionRange(0, this.monthInput.getValue().length);
	    } else if (event.keyCode === Events.Keys.ENTER) {
	      this.date.setMonth(parseInt(this.monthInput.getValue()) - 1);
	    }
	  }

	  /**
	   * Handle the next month button click.
	   *
	   * @param {MouseEvent} event The mouse event.
	   * @private
	   */
	  _handleNextMonth(event) {
	    Utils.stopEvent(event);
	    this.nextMonth();
	  }

	  /**
	   * Handle the previous month button click.
	   *
	   * @param {MouseEvent} event The mouse event.
	   * @private
	   */
	  _handlePreviousMonth(event) {
	    Utils.stopEvent(event);
	    this.previousMonth();
	  }

	  /**
	   * Handle the key down event and capture the up and down arrow key to increment and decrement the second.

	   * @param {KeyboardEvent} event The key event.
	   * @private
	   */
	  _handleSecondKey(event) {
	    if (event.keyCode === Events.Keys.UP_ARROW) {
	      Utils.stopEvent(event);
	      PrimeDate.plusSeconds(this.date, 1);
	      this.setDate(this.date);
	      this.secondInput.domElement.setSelectionRange(0, this.secondInput.getValue().length);
	    } else if (event.keyCode === Events.Keys.DOWN_ARROW) {
	      Utils.stopEvent(event);
	      PrimeDate.plusSeconds(this.date, -1);
	      this.setDate(this.date);
	      this.secondInput.domElement.setSelectionRange(0, this.secondInput.getValue().length);
	    } else if (event.keyCode === Events.Keys.ENTER) {
	      this.date.setSeconds(parseInt(this.secondInput.getValue()));
	    }
	  }

	  /**
	   * Handles the click on the year to open the year select.
	   *
	   * @private
	   */
	  _handleYearExpand(event) {
	    Utils.stopEvent(event);
	    this.openYearSelect();
	  }

	  /**
	   * Handles when a key is click in the year input field so that tab and shift tab work properly.
	   * <p>
	   * Also handles up and down arrow to increment and decrement the year.
	   *
	   * @param {KeyboardEvent} event The key event.
	   * @private
	   */
	  _handleYearKey(event) {
	    if (event.keyCode === Events.Keys.UP_ARROW) {
	      Utils.stopEvent(event);
	      PrimeDate.plusYears(this.date, 1);
	      this.setDate(this.date);
	      this.yearInput.domElement.setSelectionRange(0, this.yearInput.getValue().length);
	    } else if (event.keyCode === Events.Keys.DOWN_ARROW) {
	      Utils.stopEvent(event);
	      PrimeDate.plusYears(this.date, -1);
	      this.setDate(this.date);
	      this.yearInput.domElement.setSelectionRange(0, this.yearInput.getValue().length);
	    } else if (event.keyCode === Events.Keys.TAB && this.options.dateOnly) {
	      Utils.stopEvent(event);
	      if (event.shiftKey) {
	        this.dayInput.domElement.setSelectionRange(0, this.dayInput.getValue().length);
	        this.dayInput.focus();
	      } else {
	        this.monthInput.domElement.setSelectionRange(0, this.monthInput.getValue().length);
	        this.monthInput.focus();
	      }
	    } else if (event.keyCode === Events.Keys.ENTER) {
	      this.date.setFullYear(parseInt(this.yearInput.getValue()));
	    }
	  }

	  /**
	   * Rebuilds the HTML of the DateTimePicker.
	   * @private
	   */
	  _rebuild() {
	    this.drawCalendar(this.date);
	    this._refreshInputs();

	    if (this.options.dateOnly) {
	      this.time.hide();
	    }
	  }

	  /**
	   * Refresh the time inputs.
	   *
	   * @private
	   */
	  _refreshInputs() {
	    // Set Time -- assuming 12-hour time for the input fields and ISO 24-hour time for the field
	    const hours = PrimeDate.getHourOfDay(this.date);
	    this.hourInput.setValue(hours);

	    const minutes = this.date.getMinutes();
	    this.minuteInput.setValue(("00" + minutes).slice(-2));

	    const seconds = this.date.getSeconds();
	    this.secondInput.setValue(("00" + seconds).slice(-2));

	    if (this.date.getHours() >= 12) {
	      this.ampmInput.setValue(DateTimePicker.AM_PM[1]);
	    } else {
	      this.ampmInput.setValue(DateTimePicker.AM_PM[0]);
	    }

	    this.monthInput.setValue(this.date.getMonth() + 1);
	    this.dayInput.setValue(this.date.getDate());
	    this.yearInput.setValue(this.date.getFullYear());
	  }

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      className: 'prime-date-picker',
	      closeTimeout: 200,
	      dateOnly: false
	    };

	    const userOptions = Utils.dataSetToOptions(this.element);
	    for (let option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }
	}

	/*
	 * Copyright (c) 2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */

	class Dismissable {
	  /**
	   * Constructs a new Dismissable object for the given element.
	   *
	   * @param {PrimeElement|Element|EventTarget} element The Element for the Dismissable widget.
	   * @param {PrimeElement|Element|EventTarget} dismissButton The Element for the Dismissable button.
	   * @constructor
	   */
	  constructor(element, dismissButton) {
	    Utils.bindAll(this);

	    this.element = PrimeElement.wrap(element);
	    this.dismissButton = dismissButton;
	    this._setInitialOptions();
	  }

	  /**
	   * Closes the Dismissable by removing the open class from the element and setting a timer to remove the element from
	   * the DOM.
	   */
	  close() {
	    this.element.addClass('closed');
	    setTimeout(function() {
	      this.element.removeFromDOM();
	    }.bind(this), this.options.closeTimeout);
	  }

	  /**
	   * Destroys the widget.
	   */
	  destroy() {
	    this.dismissButton.removeEventListener('click', this._handleClick);
	  }

	  /**
	   * Initializes the Dismissable by binding the events to the dismiss button.
	   *
	   * @returns {Dismissable} This.
	   */
	  initialize() {
	    this.dismissButton.addEventListener('click', this._handleClick);
	    return this;
	  }

	  /**
	   * Sets the timeout used in the close method to allow for transitions.
	   *
	   * @param timeout {int} The timeout.
	   * @returns {Dismissable} This.
	   */
	  withCloseTimeout(timeout) {
	    this.options.closeTimeout = timeout;
	    return this;
	  }

	  /**
	   * Set more than one option at a time by providing a map of key value pairs. This is considered an advanced
	   * method to set options on the widget. The caller needs to know what properties are valid in the options object.
	   *
	   * @param {Object} options Key value pair of configuration options.
	   * @returns {Dismissable} This.
	   */
	  withOptions(options) {
	    if (!Utils.isDefined(options)) {
	      return this;
	    }

	    for (let option in options) {
	      if (options.hasOwnProperty(option)) {
	        this.options[option] = options[option];
	      }
	    }
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Handles the click event.
	   * @private
	   */
	  _handleClick(event) {
	    Utils.stopEvent(event);
	    this.close();
	  }

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      closeTimeout: 400
	    };
	  }
	}

	/*
	 * Copyright (c) 2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class HTMLDialog {
	  /**
	   * Constructs a new dialog box from an element.
	   *
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element for the HTMLDialog widget.
	   * @constructor
	   */
	  constructor(element) {
	    Utils.bindAll(this);

	    this.element = PrimeElement.wrap(element);
	    this._setInitialOptions();
	    this.draggable = null;
	  }

	  /**
	   * Closes the dialog, destroys the HTML and updates or hides the overlay.
	   * @returns {HTMLDialog} This.
	   */
	  close() {
	    this.element.removeClass('open');
	    if (this.draggable !== null) {
	      this.draggable.destroy();
	      this.draggable = null;
	    }

	    setTimeout(function() {
	      this.element.hide();

	      const highestZIndex = this._determineZIndex();
	      if (highestZIndex !== 0) {
	        Overlay.instance.setZIndex(highestZIndex);
	      } else {
	        Overlay.instance.close();
	      }
	    }.bind(this), this.options.closeTimeout);

	    return this;
	  }

	  /**
	   * Destroys the dialog by calling the close function.
	   * @returns {HTMLDialog} This.
	   */
	  destroy() {
	    this.close();
	    return this;
	  }

	  /**
	   * Initializes the dialog.
	   * @returns {HTMLDialog} This.
	   */
	  initialize() {
	    this.element.hide();
	    return this;
	  }

	  /**
	   * Opens the dialog.
	   *
	   * @returns {HTMLDialog} This.
	   */
	  open() {
	    const highestZIndex = this._determineZIndex();
	    Overlay.instance.open(highestZIndex + this.options.zIndexOffset);
	    this.element.setStyle('zIndex', (highestZIndex + this.options.zIndexOffset + 10).toString());
	    this.element.show();
	    this.element.addClass('open');

	    // Call the callback before positioning to ensure all changes to the dialog have been made
	    if (this.options.callback !== null) {
	      this.options.callback(this);
	    }

	    // Position the fixed dialog in the center of the screen
	    const windowHeight = PrimeWindow.getInnerHeight();
	    const dialogHeight = this.element.getHeight();
	    this.element.setTop(((windowHeight - dialogHeight) / 2) - 20);

	    this._setupButtons();

	    if (this.draggable === null) {
	      if (this.options.draggableElementSelector !== null && this.element.queryFirst(this.options.draggableElementSelector) !== null) {
	        this.draggable = new Draggable(this.element, this.options.draggableElementSelector).initialize();
	      }
	    }

	    return this;
	  }

	  /**
	   * Updates the HTML contents of the dialog.
	   *
	   * @param html {String} The HTML.
	   * @returns {HTMLDialog} This.
	   */
	  setHTML(html) {
	    this.element.setHTML(html);
	    this._setupButtons();
	    return this;
	  }

	  /**
	   * Sets the callback that is called after the dialog has been fetched and rendered.
	   *
	   * @param callback {function} The callback function.
	   * @returns {HTMLDialog} This.
	   */
	  withCallback(callback) {
	    this.options.callback = callback;
	    return this;
	  }

	  /**
	   * Sets the class name for the dialog element.
	   *
	   * @param className {string} The class name.
	   * @returns {HTMLDialog} This.
	   */
	  withClassName(className) {
	    this.options.className = className;
	    return this;
	  }

	  /**
	   * Sets the close button element selector that is used to setup the close button in the HTML that was returned from
	   * the server.
	   *
	   * @param selector {string} The element selector.
	   * @returns {HTMLDialog} This.
	   */
	  withCloseButtonElementSelector(selector) {
	    this.options.closeButtonElementSelector = selector;
	    return this;
	  }

	  /**
	   * Sets the timeout used in the close method to allow for transitions.
	   *
	   * @param timeout {int} The timeout.
	   * @returns {HTMLDialog} This.
	   */
	  withCloseTimeout(timeout) {
	    this.options.closeTimeout = timeout;
	    return this;
	  }

	  /**
	   * Sets the draggable element selector that is used for the Draggable.
	   *
	   * @param selector {string} The element selector.
	   * @returns {HTMLDialog} This.
	   */
	  withDraggableButtonElementSelector(selector) {
	    this.options.draggableElementSelector = selector;
	    return this;
	  }

	  /**
	   * Set more than one option at a time by providing a map of key value pairs. This is considered an advanced
	   * method to set options on the widget. The caller needs to know what properties are valid in the options object.
	   *
	   * @param {Object} options Key value pair of configuration options.
	   * @returns {HTMLDialog} This.
	   */
	  withOptions(options) {
	    if (!Utils.isDefined(options)) {
	      return this;
	    }

	    for (let option in options) {
	      if (options.hasOwnProperty(option)) {
	        this.options[option] = options[option];
	      }
	    }
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  _determineZIndex() {
	    let highestZIndex = 0;
	    PrimeDocument.query('.' + this.options.className).each(function(dialog) {
	      const zIndex = parseInt(dialog.getComputedStyle()['zIndex']);
	      if (dialog.isVisible() && zIndex > highestZIndex) {
	        highestZIndex = zIndex;
	      }
	    });
	    return highestZIndex;
	  }

	  _handleCloseClickEvent(event) {
	    Utils.stopEvent(event);
	    this.close();
	  }

	  _setupButtons() {
	    this.element.query(this.options.closeButtonElementSelector).each(function(e) {
	      e.addEventListener('click', this._handleCloseClickEvent);
	    }.bind(this));
	  }

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      callback: null,
	      className: 'prime-dialog',
	      closeButtonElementSelector: '[data-dialog-role="close-button"]',
	      closeTimeout: 200,
	      draggableElementSelector: '[data-dialog-role="draggable"]',
	      zIndexOffset: 1000
	    };

	    const userOptions = Utils.dataSetToOptions(this.element);
	    for (let option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }
	}

	/*
	 * Copyright (c) 2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class InProgress {
	  /**
	   * Constructs a In Progress widget that opens an overlay over an element while something is running and closes it when
	   * it finishes.
	   *
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element to overlay.
	   * @constructor
	   */
	  constructor(element) {
	    Utils.bindAll(this);

	    this.element = PrimeElement.wrap(element);
	    this._setInitialOptions();
	    this.draggable = null;
	  }

	  /**
	   * Closes the InProgress process.
	   *
	   * @param {Function} callback (Optional) A callback function to invoke after the InProgress has been completely closed.
	   */
	  close(callback) {
	    try {
	      this.options.endFunction(this);
	    } finally {
	      const now = new Date().getTime();
	      const duration = now - this.startInstant;
	      if (duration < this.options.minimumTime) {
	        setTimeout(function() {
	          this.overlay.removeFromDOM();

	          if (callback) {
	            callback();
	          }
	        }.bind(this), this.options.minimumTime - duration);
	      } else {
	        this.overlay.removeFromDOM();

	        if (callback) {
	          callback();
	        }
	      }
	    }

	    return this;
	  }

	  /**
	   * Opens the InProgress process.
	   */
	  open() {
	    this.startInstant = new Date().getTime();
	    this.overlay = PrimeDocument.newElement('<div/>').setId('prime-in-progress-overlay').appendTo(document.body);
	    PrimeDocument.newElement('<i/>', {class: 'fa fa-spin fa-' + this.options.iconName}).appendTo(this.overlay);

	    const coords = this.element.getCoordinates();
	    const bodyCoords = PrimeDocument.bodyElement.getCoordinates();
	    this.overlay.setTop(coords.top - bodyCoords.top);
	    this.overlay.setLeft(coords.left - bodyCoords.left);
	    this.overlay.setWidth(this.element.getBorderedWidth());
	    this.overlay.setHeight(this.element.getBorderedHeight());
	    this.overlay.setStyle('zIndex', (this.element.getRelativeZIndex() + 1000).toString());

	    this.options.startFunction(this);

	    return this;
	  }

	  /**
	   * Sets the end function that is called when the InProgress process is finished.
	   *
	   * @param f {function} The function.
	   * @returns {InProgress} This.
	   */
	  withEndFunction(f) {
	    this.options.endFunction = f;
	    return this;
	  }

	  /**
	   * Sets the FontAwesome icon name to use for the overlay.
	   *
	   * @param iconName {string} The icon name.
	   * @returns {InProgress} This.
	   */
	  withIconName(iconName) {
	    this.options.iconName = iconName;
	    return this;
	  }

	  /**
	   * Sets the minimum time that the InProgress process must run.
	   *
	   * @param time {number} The time in milliseconds.
	   * @returns {InProgress} This.
	   */
	  withMinimumTime(time) {
	    this.options.minimumTime = time;
	    return this;
	  }

	  /**
	   * Sets the start function that is called when the InProgress process is started.
	   *
	   * @param f {function} The function.
	   * @returns {InProgress} This.
	   */
	  withStartFunction(f) {
	    this.options.startFunction = f;
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      endFunction: function() {
	      },
	      iconName: 'refresh',
	      minimumTime: 1000,
	      startFunction: function() {
	      }
	    };

	    const userOptions = Utils.dataSetToOptions(this.element);
	    for (let option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }
	}

	/*
	 * Copyright (c) 2014-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class Searcher {
	  /**
	   * Constructs a Searcher object for the given text input.
	   *
	   * The Searcher object can be attached and used in conjunction with any other widgets in a generic manner. It
	   * provides search capabilities and manages the search results. This is useful for MultipleSelects, IntelliSense and
	   * other widgets. Here's the HTML for the search results.
	   *
	   * <pre>
	   *   &lt;input type="text" class="prime-search-result-input" value="F"/>
	   *   &lt;ul>
	   *     &lt;li>Four&lt;/li>
	   *     &lt;li>Five&lt;/li>
	   *     &lt;li>Fifteen&lt;/li>
	   *     &lt;li>Add Custom Entry: F/li>
	   *   &lt;/ul>
	   * &lt;/div>
	   * </pre>
	   *
	   * The with* methods can be used to setup the configuration for this SearchResults, but here are some defaults:
	   *
	   * <ul>
	   *   <li>closeTimeout = 200</li>
	   *   <li>customAddEnabled = true</li>
	   *   <li>customAddCallback = function(customValue){return true;}</li>
	   *   <li>customAddLabel = "Add Custom:"</li>
	   *   <li>tooManySearchResultsLabel = "Too Many Matches For:"</li>
	   *   <li>noSearchResultsLabel = "No Matches For:"</li>
	   * </ul>
	   *
	   * The callback object must conform to this interface:
	   *
	   * <pre>
	   *   CallbackObject {
	 *     void deletedBeyondSearchInput()
	 *     void doesNotContainValue()
	 *     object{results:Array, tooManyResults:boolean} search(_searchString:string),
	 *     void selectSearchResult(selectedSearchResult:string),
	 *   }
	   * </pre>
	   *
	   * @constructor
	   * @param {PrimeElement|Element|EventTarget} inputElement The input element that is used to execute the search.
	   * @param {PrimeElement|Element|EventTarget} searchResultsContainer The element that is used to store the search results.
	   * @param {*} callbackObject The object that is used to callback for searching and numerous other functions to help
	   *            communicate state and determine how to draw the input and search results.
	   */
	  constructor(inputElement, searchResultsContainer, callbackObject) {
	    Utils.bindAll(this);

	    this.searchResults = PrimeElement.wrap(searchResultsContainer);
	    this.inputElement = PrimeElement.wrap(inputElement);
	    if (this.inputElement.domElement.tagName !== 'INPUT') {
	      throw new TypeError('You can only use Prime.Widgets.SearchResults with INPUT elements');
	    }

	    this._setInitialOptions(callbackObject);
	  }

	  /**
	   * A search function that works on a select box.
	   *
	   * @param searchText {String} The search String.
	   * @param select {HTMLSelectElement|PrimeElement} The select box.
	   * @returns {{results: Array, tooManyResults: boolean}}
	   */
	  static selectSearchFunction(searchText, select) {
	    const options = PrimeElement.unwrap(select).options;
	    const selectableOptions = [];
	    for (let i = 0; i < options.length; i++) {
	      const option = new PrimeElement(options[i]);
	      if (option.isSelected()) {
	        continue;
	      }

	      const html = option.getHTML();
	      if (searchText === null || searchText === undefined || searchText === '' || html.toLowerCase().indexOf(searchText.toLowerCase()) === 0) {
	        selectableOptions.push(html);
	      }
	    }

	    // Alphabetize the options
	    if (selectableOptions.length > 0) {
	      selectableOptions.sort();
	    }

	    return {results: selectableOptions, tooManyResults: false};
	  }

	  /**
	   * Closes the search results display, unhighlights any options that are highlighted and resets the input's value to
	   * empty string.
	   */
	  closeSearchResults() {
	    this._removeAllSearchResults();
	    this.inputElement.setValue('');
	    this.searchResults.removeClass('open');
	    setTimeout(function() {
	      this.searchResults.hide();
	      this.resizeInput();
	    }.bind(this), this.options.closeTimeout);
	  }

	  /**
	   * Removes all of the event listeners from the input element.
	   */
	  destroy() {
	    this.inputElement
	        .removeEventListener('blur', this._handleBlurEvent)
	        .removeEventListener('click', this._handleClickEvent)
	        .removeEventListener('keyup', this._handleKeyUpEvent)
	        .removeEventListener('keydown', this._handleKeyDownEvent)
	        .removeEventListener('focus', this._handleFocusEvent);
	  }

	  focus() {
	    this.inputElement.focus();
	  }

	  /**
	   * @returns {PrimeElement} The highlighted search result or null.
	   */
	  getHighlightedSearchResult() {
	    return this.searchResults.queryFirst('.selected');
	  }

	  /**
	   * Highlights the next search result if one is highlighted. If there isn't a highlighted search result, this
	   * highlights the first one. This method handles wrapping.
	   *
	   * @returns {Searcher} This Searcher.
	   */
	  highlightNextSearchResult() {
	    let searchResult = this.getHighlightedSearchResult();
	    if (searchResult !== null) {
	      searchResult = searchResult.getNextSibling();
	    }

	    // Grab the first search result in the list if there isn't a next sibling
	    if (searchResult === null) {
	      searchResult = this.searchResults.queryFirst('.search-result');
	    }

	    if (searchResult !== null) {
	      this.highlightSearchResult(searchResult);
	    }

	    return this;
	  }

	  /**
	   * Highlights the previous search result if one is highlighted. If there isn't a highlighted search result, this
	   * selects the last one. This method handles wrapping.
	   *
	   * @returns {Searcher} This Searcher.
	   */
	  highlightPreviousSearchResult() {
	    let searchResult = this.getHighlightedSearchResult();
	    if (searchResult !== null) {
	      searchResult = searchResult.getPreviousSibling();
	    }

	    if (searchResult === null) {
	      searchResult = this.searchResults.queryFirst('.search-result');
	    }

	    if (searchResult !== null) {
	      this.highlightSearchResult(searchResult);
	    }

	    return this;
	  }

	  /**
	   * Highlights the given search result.
	   *
	   * @param {PrimeElement} searchResult The search result to highlight.
	   * @returns {Searcher} This Searcher.
	   */
	  highlightSearchResult(searchResult) {
	    this.searchResults.getChildren().removeClass('selected');

	    searchResult.addClass('selected');
	    const scrollTop = this.searchResults.getScrollTop();
	    const height = this.searchResults.getHeight();
	    const searchResultOffset = searchResult.getOffsetTop();
	    if (searchResultOffset + 1 >= scrollTop + height) {
	      this.searchResults.scrollTo(searchResult.getOffsetTop() - this.searchResults.getHeight() + searchResult.getOuterHeight());
	    } else if (searchResultOffset < scrollTop) {
	      this.searchResults.scrollTo(searchResultOffset);
	    }

	    return this;
	  }

	  /**
	   * Initializes the Searcher by setting up the event listeners and closing the search result element.
	   *
	   * @returns {Searcher} This.
	   */
	  initialize() {
	    this.inputElement
	        .addEventListener('blur', this._handleBlurEvent)
	        .addEventListener('click', this._handleClickEvent)
	        .addEventListener('keyup', this._handleKeyUpEvent)
	        .addEventListener('keydown', this._handleKeyDownEvent)
	        .addEventListener('focus', this._handleFocusEvent);

	    this.closeSearchResults();
	    return this;
	  }

	  /**
	   * @returns {boolean} True if the search results add custom option is being displayed currently.
	   */
	  isCustomAddVisible() {
	    return this.searchResults.queryFirst('.custom-add') !== null;
	  }

	  /**
	   * @returns {boolean} True if any search results are being displayed currently.
	   */
	  isSearchResultsVisible() {
	    return this.searchResults.hasClass('open');
	  }

	  /**
	   * Poor mans resizing of the input field as the user types into it.
	   */
	  resizeInput() {
	    const text = this.inputElement.getValue() === '' ? this.inputElement.getAttribute('placeholder') : this.inputElement.getValue();
	    const newLength = Utils.calculateTextLength(this.inputElement, text) + 35;
	    this.inputElement.setWidth(newLength);
	  }

	  /**
	   * Executes a search by optionally updating the input to the given value (if specified) and then rebuilding the search
	   * results using the input's value. This method also puts focus on the input and shows the search results (in case
	   * they are hidden for any reason).
	   *
	   * @param {string} [searchText] The text to search for (this value is also set into the input box). If this is not
	   * specified then the search is run using the input's value.
	   * @returns {Searcher} This Searcher.
	   */
	  search(searchText) {
	    // Set the search text into the input box if it is different and then lowercase it
	    if (Utils.isDefined(searchText) && this.inputElement.getValue() !== searchText) {
	      this.inputElement.setValue(searchText);
	    }

	    searchText = Utils.isDefined(searchText) ? searchText.toLowerCase() : this.inputElement.getValue();
	    this.resizeInput();

	    // Clear the search results (if there are any)
	    this._removeAllSearchResults();

	    // Call the callback
	    const searchResults = this.options.callbackObject.search(searchText);
	    if (!searchResults.hasOwnProperty('results') || !searchResults.hasOwnProperty('tooManyResults')) {
	      throw new TypeError('The callback must return an Object that contains the properties results[Array] and tooManyResults[boolean]');
	    }

	    let count = 0;
	    let matchingSearchResultElement = null;
	    for (let i = 0; i < searchResults.results.length; i++) {
	      const searchResult = searchResults.results[i];
	      const element = PrimeDocument.newElement('<li/>')
	          .addClass('search-result')
	          .setAttribute('value', searchResult)
	          .setHTML(searchResult)
	          .addEventListener('click', this._handleClickEvent)
	          .addEventListener('mouseover', this._handleMouseOverEvent)
	          .appendTo(this.searchResults);
	      if (searchResult.toLowerCase().trim() === searchText.toLowerCase().trim()) {
	        matchingSearchResultElement = element;
	      }

	      count++;
	    }

	    // Show the custom add option if necessary
	    const trimmedLength = searchText.trim().length;
	    if (this.options.customAddEnabled && trimmedLength !== 0 && matchingSearchResultElement === null
	        && (!('doesNotContainValue' in this.options.callbackObject) || this.options.callbackObject.doesNotContainValue(searchText))) {
	      matchingSearchResultElement = PrimeDocument.newElement('<li/>')
	          .addClass('custom-add')
	          .addEventListener('click', this._handleClickEvent)
	          .addEventListener('mouseover', this._handleMouseOverEvent)
	          .setHTML(this.options.customAddLabel + Utils.escapeHTML(searchText))
	          .appendTo(this.searchResults);
	      count++;
	    }

	    if (count === 0 && trimmedLength !== 0) {
	      PrimeDocument.newElement('<li/>')
	          .addClass('no-search-results')
	          .setHTML(this.options.noSearchResultsLabel + Utils.escapeHTML(searchText))
	          .appendTo(this.searchResults);
	      count++;
	    }

	    // Handle too many results
	    if (searchResults.tooManyResults) {
	      PrimeDocument.newElement('<li/>')
	          .addClass('too-many-search-results')
	          .setHTML(this.options.tooManySearchResultsLabel + Utils.escapeHTML(searchText))
	          .appendTo(this.searchResults);
	      count++;
	    }

	    if (count !== 0) {
	      this.searchResults.show();
	      this.searchResults.addClass('open');

	      if (count >= 10) {
	        this.searchResults.setHeight(this.searchResults.getChildren()[0].getOuterHeight() * 10 + 1);
	      } else {
	        this.searchResults.setHeight(this.searchResults.getChildren()[0].getOuterHeight() * count + 1);
	      }
	    } else {
	      this.closeSearchResults();
	    }

	    if (matchingSearchResultElement !== null) {
	      this.highlightSearchResult(matchingSearchResultElement);
	    }

	    return this;
	  }

	  /**
	   * Selects the highlighted search result unless there isn't one highlighted, in which case, this does nothing.
	   *
	   * @returns {Searcher} This Searcher.
	   */
	  selectHighlightedSearchResult() {
	    const searchResult = this.getHighlightedSearchResult();
	    if (searchResult === null) {
	      return this;
	    }

	    const custom = searchResult.hasClass('custom-add');
	    const value = (custom) ? this.inputElement.getValue().trim() : searchResult.getHTML();
	    if (custom) {
	      // The client of this searcher needs to warn the user.
	      if (!this.options.customAddCallback(value)) {
	        return this;
	      }
	    }

	    this.options.callbackObject.selectSearchResult(value);
	    this.closeSearchResults();

	    return this;
	  }

	  /**
	   * Sets the timeout used in the close method to allow for transitions.
	   *
	   * @param timeout {int} The timeout.
	   * @returns {Searcher} This.
	   */
	  withCloseTimeout(timeout) {
	    this.options.closeTimeout = timeout;
	    return this;
	  }

	  /**
	   * Sets whether or not this Searcher allows custom options to be added.
	   *
	   * @param {boolean} enabled The flag.
	   * @returns {Searcher} This Searcher.
	   */
	  withCustomAddEnabled(enabled) {
	    this.options.customAddEnabled = enabled;
	    return this;
	  }

	  /**
	   * Sets whether or not this Searcher allows custom options to be added.
	   *
	   * @param {Function} callback The function to call that will return true if the custom option can be added.
	   * @returns {Searcher} This Searcher.
	   */
	  withCustomAddCallback(callback) {
	    this.options.customAddCallback = callback;
	    return this;
	  }

	  /**
	   * Sets the label used when custom options are added.
	   *
	   * @param {string} customAddLabel The label.
	   * @returns {Searcher} This Searcher.
	   */
	  withCustomAddLabel(customAddLabel) {
	    this.options.customAddLabel = customAddLabel;
	    return this;
	  }

	  /**
	   * Set more than one option at a time by providing a map of key value pairs. This is considered an advanced
	   * method to set options on the widget. The caller needs to know what properties are valid in the options object.
	   *
	   * @param {Object} options Key value pair of configuration options.
	   * @returns {Searcher} This.
	   */
	  withOptions(options) {
	    if (!Utils.isDefined(options)) {
	      return this;
	    }

	    for (let option in options) {
	      if (options.hasOwnProperty(option)) {
	        this.options[option] = options[option];
	      }
	    }
	    return this;
	  }

	  /**
	   * Sets the label that is printed when there are no search results.
	   *
	   * @param {string} noSearchResultsLabel The label text.
	   * @returns {Searcher} This Searcher.
	   */
	  withNoSearchResultsLabel(noSearchResultsLabel) {
	    this.options.noSearchResultsLabel = noSearchResultsLabel;
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Sets the label that is printed when there are too many search results.
	   *
	   * @param {string} tooManySearchResultsLabel The label text.
	   * @returns {Searcher} This Searcher.
	   */
	  withTooManySearchResultsLabel(tooManySearchResultsLabel) {
	    this.options.tooManySearchResultsLabel = tooManySearchResultsLabel;
	    return this;
	  }

	  /**
	   * Handles the blur event when the input goes out of focus.
	   *
	   * @private
	   */
	  _handleBlurEvent() {
	    window.setTimeout((function() {
	      if (document.activeElement !== this.inputElement.domElement) {
	        this.closeSearchResults();
	      }
	    }).bind(this), 300);
	  }

	  /**
	   * Handles all click events sent to the Searcher.
	   *
	   * @param {Event} event The mouse event.
	   * @private
	   */
	  _handleClickEvent(event) {
	    const target = new PrimeElement(event.currentTarget);
	    if (target.hasClass('custom-add') || target.hasClass('search-result')) {
	      this.selectHighlightedSearchResult();
	    } else if (target.domElement === this.inputElement.domElement) {
	      this.search();
	    } else {
	      console.log('Clicked something else target=[' + event.target + '] currentTarget=[' + event.currentTarget + ']');
	    }
	  }

	  /**
	   * Handles when the input field is focused by opening the search results.
	   *
	   * @private
	   */
	  _handleFocusEvent() {
	    this.search();
	  }

	  /**
	   * Handles the key down events that should not be propagated.
	   *
	   * @param {KeyboardEvent} event The keyboard event object.
	   * @private
	   */
	  _handleKeyDownEvent(event) {
	    const key = event.keyCode;
	    if (key === Events.Keys.BACKSPACE) {
	      this.previousSearchString = this.inputElement.getValue();
	    } else if (key === Events.Keys.UP_ARROW) {
	      Utils.stopEvent(event);
	      this.highlightPreviousSearchResult();
	    } else if (key === Events.Keys.DOWN_ARROW) {
	      Utils.stopEvent(event);
	      if (this.isSearchResultsVisible()) {
	        this.highlightNextSearchResult();
	      } else {
	        this.search();
	      }
	    } else if (key === Events.Keys.ENTER) {
	      Utils.stopEvent(event); // Don't bubble enter otherwise the form submits
	    }
	  }

	  /**
	   * Handles all key up events sent to the search results container.
	   *
	   * @param {KeyboardEvent} event The keyboard event object.
	   *  @private
	   */
	  _handleKeyUpEvent(event) {
	    const key = event.keyCode;
	    const value = this.inputElement.getValue();

	    if (key === Events.Keys.BACKSPACE) {
	      if (value === '' && this.previousSearchString === '') {
	        this.options.callbackObject.deletedBeyondSearchInput();
	      } else {
	        this.search();
	      }
	    } else if (key === Events.Keys.ENTER) {
	      Utils.stopEvent(event);
	      // If a search result is highlighted, add it
	      if (this.getHighlightedSearchResult() !== null) {
	        this.selectHighlightedSearchResult();
	      }
	    } else if (key === Events.Keys.ESCAPE) {
	      this.closeSearchResults();
	    } else if (key === Events.Keys.SPACE || key === Events.Keys.DELETE ||
	        (key >= 48 && key <= 90) || (key >= 96 && key <= 111) || (key >= 186 && key <= 192) || (key >= 219 && key <= 222)) {
	      this.search();
	    }
	  }

	  /**
	   * Handles mouseover events for the search results (only) by highlighting the event target.
	   *
	   * @param {Event} event The mouseover event.
	   * @private
	   */
	  _handleMouseOverEvent(event) {
	    const target = new PrimeElement(event.currentTarget);
	    this.highlightSearchResult(target);
	  }

	  /**
	   * Removes all of the search results.
	   *
	   * @private
	   */
	  _removeAllSearchResults() {
	    this.searchResults.query('li').removeAllFromDOM();
	  }

	  /* ===================================================================================================================
	   * Search function implementations.
	   * ===================================================================================================================*/

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions(callbackObject) {
	    // Defaults
	    this.options = {
	      callbackObject: callbackObject,
	      closeTimeout: 200,
	      customAddEnabled: true,
	      'customAddCallback'() {
	        return true;
	      },
	      customAddLabel: 'Add Custom: ',
	      noSearchResultsLabel: 'No Matches For: ',
	      tooManySearchResultsLabel: 'Too Many Matches For: ',
	    };

	    const userOptions = Utils.dataSetToOptions(this.inputElement);
	    for (let option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }
	}

	/*
	 * Copyright (c) 2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	let count = 1;
	let AddOptionEvent = 'MultipleSelect:addOption';
	let DeselectOptionEvent = 'MultipleSelect:deselectOption';
	let SelectOptionEvent = 'MultipleSelect:selectOption';

	class MultipleSelect {
	  /**
	   * Constructs a MultipleSelect object for the given element.
	   *
	   * The MultipleSelect generates a number of different HTML elements directly after the SELECT element you pass to the
	   * constructor. A fully rendered MultipleSelect might look something like this:
	   *
	   * <pre>
	   * &lt;select id="foo">
	   *   &lt;option value="one">One&lt;/option>
	   *   &lt;option value="two">Two&lt;/option>
	   *   &lt;option value="three">Three&lt;/option>
	   * &lt;/select>
	   * &lt;div id="foo-display" class="prime-multiple-select">
	   *   &lt;ul id="foo-option-list" class="option-list">
	   *     &lt;li id="foo-option-one">&lt;span>One&lt;/span>&lt;a href="#">X&lt;/a>&lt;/li>
	   *     &lt;li id="foo-option-two">&lt;span>Two&lt;/span>&lt;a href="#">X&lt;/a>&lt;/li>
	   *     &lt;li id="foo-option-three">&lt;span>Three&lt;/span>&lt;a href="#">X&lt;/a>&lt;/li>
	   *     &lt;li>&lt;input type="text" value="aaa"/>&lt;/li>
	   *   &lt;/ul>
	   *   &lt;ul class="search-results">
	   *     &lt;li>One&lt;/li>
	   *     &lt;li>Two&lt;/li>
	   *     &lt;li>Three&lt;/li>
	   *     &lt;li>Add Custom Entry: aaa/li>
	   *   &lt;/ul>
	   * &lt;/div>
	   * </pore>
	   *
	   * The with* methods can be used to setup the configuration for this MultipleSelect, but here are some defaults:
	   *
	   * <ul>
	   *   <li>placeholder = "Choose"</li>
	   *   <li>customAddEnabled = true</li>
	   *   <li>customAddLabel = "Add Custom Value:"</li>
	   *   <li>noSearchResultsLabel = "No Matches For:"</li>
	   * </ul>
	   *
	   * @constructor
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element for the MultipleSelect.
	   */
	  constructor(element) {
	    Utils.bindAll(this);

	    this.element = PrimeElement.wrap(element);
	    if (this.element.domElement.tagName !== 'SELECT') {
	      throw new TypeError('You can only use MultipleSelect with select elements');
	    }

	    if (this.element.getAttribute('multiple') !== 'multiple') {
	      throw new TypeError('The select box you are attempting to convert to a MultipleSelect must have the multiple="multiple" attribute set');
	    }

	    this._setInitialOptions();
	  }

	  /*
	   * Statics
	   */
	  /**
	   * @returns {number}
	   */
	  static get count() {
	    return count;
	  }

	  /**
	   * @param {number} value
	   */
	  static set count(value) {
	    count = value;
	  }

	  /**
	   * @returns {string}
	   */
	  static get AddOptionEvent() {
	    return AddOptionEvent;
	  }

	  /**
	   * @param {string} value
	   */
	  static set AddOptionEvent(value) {
	    AddOptionEvent = value;
	  }

	  /**
	   * @returns {string}
	   */
	  static get DeselectOptionEvent() {
	    return DeselectOptionEvent;
	  }

	  /**
	   * @param {string} value
	   */
	  static set DeselectOptionEvent(value) {
	    DeselectOptionEvent = value;
	  }

	  /**
	   * @returns {string}
	   */
	  static get SelectOptionEvent() {
	    return SelectOptionEvent;
	  }

	  /**
	   * @param {string} value
	   */
	  static set SelectOptionEvent(value) {
	    SelectOptionEvent = value;
	  }

	  /**
	   * Finds the HTMLSelectOption with the given id and returns it wrapped in a PrimeElement.
	   *
	   * @param {String} id
	   * @returns {PrimeElement}
	   */
	  static findOptionWithId(id) {
	    return PrimeDocument.queryFirst('[data-option-id="' + id + '"]');
	  }

	  /**
	   * Pass through to add event listeners to This. The custom events that this MultipleSelect fires are:
	   *
	   *  'MultipleSelect:deselectOption'
	   *  'MultipleSelect:selectOption'
	   *  'MultipleSelect:addOption'
	   *
	   * @param {string} event The name of the event.
	   * @param {Function} listener The listener function.
	   * @returns {MultipleSelect} This.
	   */
	  addEventListener(event, listener) {
	    this.element.addEventListener(event, listener);
	    return this;
	  }

	  /**
	   * Determines if this MultipleSelect contains an option with the given value.
	   *
	   * @param {String} value The value to look for.
	   */
	  containsOptionWithValue(value) {
	    return this.findOptionWithValue(value) !== null;
	  }

	  /**
	   * Adds the given option to this select. The option will not be selected.
	   *
	   * @param {String} value The value for the option.
	   * @param {String} display The display text for the option.
	   * @param {?String} [id] The id of the element. (Defaults to null)
	   * @returns {MultipleSelect} This.
	   */
	  addOption(value, display, id) {
	    if ((id === null || id === undefined) && this.containsOptionWithValue(value)) {
	      return this;
	    }

	    let element = PrimeDocument.newElement('<option/>')
	        .setValue(value)
	        .setHTML(display)
	        .appendTo(this.element);

	    if (id) {
	      element.setDataAttribute("optionId", id);
	    }

	    // Fire the custom event
	    this.element.fireEvent(MultipleSelect.AddOptionEvent, value, this);

	    return this;
	  }

	  /**
	   * Deselects the option with the given value by removing the selected attribute from the option in the select box and
	   * removing the option from the display container. If the MultipleSelect doesn't contain an option for the given value,
	   * this method throws an exception.
	   *
	   * @param {String} value The value to look for.
	   * @returns {MultipleSelect} This.
	   */
	  deselectOptionWithValue(value) {
	    const option = this.findOptionWithValue(value);
	    if (option === null) {
	      throw new Error('MultipleSelect doesn\'t contain an option with the value [' + value + ']');
	    }

	    this.deselectOption(option);

	    return this;
	  }

	  /**
	   * Deselects the option with the given value by removing the selected attribute from the option in the select box and
	   * removing the option from the display container.
	   *
	   * @param {PrimeElement} option The option to deselect.
	   * @returns {MultipleSelect} This.
	   */
	  deselectOption(option) {
	    option.setSelected(false);

	    const id = option.getDataAttribute('optionId') || this._makeOptionID(option);
	    const displayOption = PrimeDocument.queryById(id);
	    if (displayOption !== null) {
	      displayOption.removeFromDOM();
	    }

	    // If there are no selected options left, add back the placeholder attribute to the input and resize it
	    if (this.optionList.query('li').length === 1) {
	      this.input.setAttribute('placeholder', this.options.placeholder);
	      this.searcher.resizeInput();
	    }

	    // Fire the custom event
	    this.element.fireEvent(MultipleSelect.DeselectOptionEvent, option.getValue(), this);

	    return this;
	  }

	  /**
	   * Destroys the widget completely.
	   */
	  destroy() {
	    this.element.show();
	    this.displayContainer.removeFromDOM();
	  }

	  /**
	   * Finds the HTMLSelectOption with the given text and returns it wrapped in a PrimeElement.
	   *
	   * @param {String} text The text to look for.
	   * @returns {PrimeElement} The option element or null.
	   */
	  findOptionWithText(text) {
	    const options = this.element.getOptions();
	    for (let i = 0; i < options.length; i++) {
	      if (options[i].getTextContent() === text) {
	        return options[i];
	      }
	    }

	    return null;
	  }

	  deselectOptionWithId(id) {
	    const option = MultipleSelect.findOptionWithId(id);
	    if (option === null) {
	      throw new Error('MultipleSelect doesn\'t contain an option with the id [' + id + ']');
	    }

	    this.deselectOption(option);

	    return this;
	  }

	  /**
	   * Finds the HTMLSelectOption with the given value and returns it wrapped in a PrimeElement.
	   *
	   * @param {String} value The value to look for.
	   * @returns {PrimeElement} The option element or null.
	   */
	  findOptionWithValue(value) {
	    for (let i = 0; i < this.element.domElement.length; i++) {
	      const cur = this.element.domElement.options[i];
	      if (cur.value === value) {
	        return new PrimeElement(cur);
	      }
	    }

	    return null;
	  }

	  /**
	   * @returns {string[]} The currently selected options values.
	   */
	  getSelectedValues() {
	    return this.element.getSelectedValues();
	  }

	  /**
	   * Determines if the MultipleSelect contains an option with the given value.
	   *
	   * @param {string} value The value.
	   * @returns {boolean} True if the MultipleSelect contains an option with the given value, false otherwise.
	   */
	  hasOptionWithValue(value) {
	    return this.findOptionWithValue(value) !== null;
	  }

	  /**
	   * Highlights the final selected option (if there is one) to indicate that it will be unselected if the user clicks
	   * the delete key again.
	   *
	   * @returns {MultipleSelect} This.
	   */
	  highlightOptionForUnselect() {
	    const options = this.optionList.getChildren();
	    if (options.length > 1) {
	      options[options.length - 2].addClass('selected');
	    }

	    return this;
	  }

	  /**
	   * Initializes the display from the underlying select element. All of the current display options (li elements) are
	   * removed. New display options are added for each selected option in the select box.
	   *
	   * @returns {MultipleSelect} This.
	   */
	  initialize() {
	    this.element.hide();

	    let id = this.element.getId();
	    if (id === null || id === '') {
	      id = 'prime-multiple-select' + MultipleSelect.count++;
	      this.element.setId(id);
	    }

	    this.displayContainer = PrimeDocument.queryById(id + '-display');
	    this.input = null;
	    if (this.displayContainer === null) {
	      this.displayContainer = PrimeDocument.newElement('<div/>')
	          .setId(id + '-display')
	          .addClass(this.options.className)
	          .addEventListener('click', this._handleClickEvent)
	          .addEventListener('keyup', this._handleKeyUpEvent)
	          .insertAfter(this.element);

	      this.optionList = PrimeDocument.newElement('<ul/>')
	          .addClass('option-list')
	          .appendTo(this.displayContainer);

	      this.searchResults = PrimeDocument.newElement('<ul/>')
	          .addClass('search-results')
	          .hide()
	          .appendTo(this.displayContainer);
	    } else {
	      this.displayContainer
	          .removeAllEventListeners()
	          .addEventListener('click', this._handleClickEvent)
	          .addEventListener('keyup', this._handleKeyUpEvent);
	      this.optionList = this.displayContainer.queryFirst('.option-list');
	      this.searchResults = this.displayContainer.queryFirst('.search-results');
	    }

	    PrimeDocument.queryFirst('html').addEventListener('click', this._handleGlobalClickEvent);

	    // Close the search
	    this.searchResults.hide();

	    this._redraw();

	    return this;
	  }

	  /**
	   * @returns {boolean} True if the last option is highlighted for unselect.
	   */
	  isLastOptionHighlightedForUnselect() {
	    const options = this.optionList.getChildren();
	    return options.length > 1 && options[options.length - 2].hasClass('selected');
	  }

	  /**
	   * Removes all of the options from the MultipleSelect.
	   *
	   * @returns {MultipleSelect} This.
	   */
	  removeAllOptions() {
	    // Remove in reverse order because the options array is dynamically updated when elements are deleted from the DOM
	    const options = this.element.domElement.options;
	    for (let i = options.length - 1; i >= 0; i--) {
	      this.removeOption(new PrimeElement(options[i]));
	    }

	    return this;
	  }

	  /**
	   * Removes the highlighted option.
	   */
	  removeHighlightedOption() {
	    const options = this.optionList.getChildren();
	    if (this.options.allowDuplicates) {
	      this.deselectOptionWithId(options[options.length - 2].getId());
	    } else {
	      this.deselectOptionWithValue(options[options.length - 2].getAttribute('value'));
	    }
	    this.search();
	  }

	  /**
	   * Removes the given option from the MultipleSelect by removing the option in the select box and the option in the
	   * display container.
	   *
	   * @param {PrimeElement} option The option to remove.
	   * @returns {MultipleSelect} This.
	   */
	  removeOption(option) {
	    if (!(option instanceof PrimeElement)) {
	      throw new TypeError('MultipleSelect#removeOption only takes PrimeElement instances');
	    }

	    option.removeFromDOM();

	    let id, displayOption;
	    if (this.options.allowDuplicates) {
	      // The ids are random so we need to get the data attribute.
	      id = option.getDataAttribute('optionId');
	      displayOption = PrimeDocument.queryById(id);
	    } else {
	      // The ids aren't random and can be reproducably created.
	      id = this._makeOptionID(option);
	      displayOption = PrimeDocument.queryById(id);
	    }

	    // Check if the option has already been selected
	    if (displayOption !== null) {
	      displayOption.removeFromDOM();
	    }

	    return this;
	  }

	  /**
	   * Removes the option with the given value from the MultipleSelect by removing the option in the select box and the
	   * option in the display container. If the MultipleSelect doesn't contain an option with the given value, this throws
	   * an exception.
	   *
	   * @param {string} value The value of the option to remove.
	   * @returns {MultipleSelect} This.
	   */
	  removeOptionWithValue(value) {
	    const option = this.findOptionWithValue(value);
	    if (option === null) {
	      throw new Error('MultipleSelect doesn\'t contain an option with the value [' + value + ']');
	    }

	    this.removeOption(option);

	    return this;
	  }

	  /**
	   * Selects the given option by setting the selected attribute on the option in the select box (the object passed in is
	   * the option from the select box wrapped in a PrimeElement) and adding it to the display container. If the
	   * option is already in the display container, that step is skipped.
	   *
	   * @param {PrimeElement} option The option object from the select box wrapped in a PrimeElement instance.
	   * @returns {MultipleSelect} This.
	   */
	  selectOption(option) {
	    if (!(option instanceof PrimeElement)) {
	      throw new TypeError('MultipleSelect#selectOption only takes PrimeElement instances');
	    }

	    const id = this._makeOptionID(option);

	    // Check if the option has already been selected
	    if (PrimeDocument.queryById(id) === null) {
	      /*
	      If we allow dupes, always duplicate the option and append it to the end or the order will be a problem. The default multiselect doesn't support order)
	       */
	      if (this.options.allowDuplicates) {
	        this.addOption(option.getTextContent(), option.getTextContent(), id);
	        option = MultipleSelect.findOptionWithId(id);
	      }
	      option.setSelected(true);

	      const li = PrimeDocument.newElement('<li/>')
	          .setAttribute('value', option.getValue())
	          .setId(id)
	          .insertBefore(this.inputOption);
	      PrimeDocument.newElement('<span/>')
	          .setHTML(option.getHTML())
	          .setAttribute('value', option.getValue())
	          .appendTo(li);
	      PrimeDocument.newElement('<a/>')
	          .setAttribute('href', '#')
	          .setAttribute('value', option.getValue())
	          .setHTML(this.options.removeIcon)
	          .addEventListener('click', this._handleClickEvent)
	          .appendTo(li);
	    }

	    // Remove the placeholder attribute on the input and resize it
	    this.input.removeAttribute('placeholder');

	    // Close the search results and resize the input
	    this.searcher.closeSearchResults();

	    // Scroll the display to the bottom
	    this.optionList.scrollToBottom();

	    // Fire the custom event
	    this.element.fireEvent(MultipleSelect.SelectOptionEvent, option.getValue(), this);

	    return this;
	  }

	  /**
	   * Selects the option with the given value by setting the selected attribute on the option in the select box (the
	   * object passed in is the option from the select box wrapped in a PrimeElement) and adding it to the display
	   * container. If the option is already in the display container, that step is skipped.
	   * <p/>
	   * If there isn't an option with the given value, this throws an exception.
	   *
	   * @param {String} value The value of the option to select.
	   * @returns {MultipleSelect} This.
	   */
	  selectOptionWithValue(value) {
	    const option = this.findOptionWithValue(value);
	    if (option === null) {
	      throw new Error('MultipleSelect doesn\'t contain an option with the value [' + value + ']');
	    }

	    this.selectOption(option);

	    return this;
	  }

	  /**
	   * Sets the selected options. This mimics the function on Element to provide consistency.
	   *
	   * @param {string[]} [arguments] The list of options to select based on their values.
	   * @returns {MultipleSelect} This.
	   */
	  setSelectedValues() {
	    this.element.setSelectedValues.apply(this.element, arguments);
	    this._redraw();
	    return this;
	  }

	  /**
	   * Unhighlights the last option if it is highlighted.
	   *
	   * @returns {MultipleSelect} This.
	   */
	  unhighlightOptionForUnselect() {
	    this.optionList.getChildren().each(function(element) {
	      element.removeClass('selected');
	    });
	    return this;
	  }

	  withAllowDuplicates(value) {
	    this.options.allowDuplicates = value;
	    return this;
	  }

	  /**
	   * Sets the class name for the MultipleSelect element.
	   *
	   * @param className {string} The class name.
	   * @returns {MultipleSelect} This.
	   */
	  withClassName(className) {
	    this.options.className = className;
	    return this;
	  }

	  /**
	   * Sets the timeout used in the close method to allow for transitions.
	   *
	   * @param timeout {int} The timeout.
	   * @returns {MultipleSelect} This.
	   */
	  withCloseTimeout(timeout) {
	    this.options.closeTimeout = timeout;
	    return this;
	  }

	  /**
	   * Sets whether or not this MultipleSelect allows custom options to be added.
	   *
	   * @param {boolean} enabled The flag.
	   * @returns {MultipleSelect} This.
	   */
	  withCustomAddEnabled(enabled) {
	    this.options.customAddEnabled = enabled;
	    return this;
	  }

	  /**
	   * Sets the label used when custom options are added.
	   *
	   * @param {string} customAddLabel The label.
	   * @returns {MultipleSelect} This.
	   */
	  withCustomAddLabel(customAddLabel) {
	    this.options.customAddLabel = customAddLabel;
	    return this;
	  }

	  /**
	   * Enable error class handling. When this option is used, if the specified error class is found on any element
	   * in the tab content the same error class will be added to the tab to identify the tab contains errors.
	   *
	   * @returns {MultipleSelect} This.
	   */
	  withErrorClassHandling(errorClass) {
	    this.options.errorClass = errorClass;
	    return this;
	  }

	  /**
	   * Sets the label that is printed when there are no search results. This must be called before render is called.
	   *
	   * @param {string} noSearchResultsLabel The label text.
	   * @returns {MultipleSelect} This.
	   */
	  withNoSearchResultsLabel(noSearchResultsLabel) {
	    this.options.noSearchResultsLabel = noSearchResultsLabel;
	    return this;
	  }

	  /**
	   * Sets the placeholder text for This. This must be called before render is called.
	   *
	   * @param {string} placeholder The placeholder text.
	   * @returns {MultipleSelect} This.
	   */
	  withPlaceholder(placeholder) {
	    this.options.placeholder = placeholder;
	    return this;
	  }

	  /**
	   * Sets the remove icon value. This overrides the default value.
	   *
	   * @param {string} removeIcon The remove icon text.
	   * @returns {MultipleSelect} This.
	   */
	  withRemoveIcon(removeIcon) {
	    this.options.removeIcon = removeIcon;
	    return this;
	  }

	  /**
	   * Sets the search function that can be used to search other sources besides the select box that backs this widget.
	   *
	   * @param searchFunction {Function} The search function.
	   * @returns {MultipleSelect} This.
	   */
	  withSearchFunction(searchFunction) {
	    this.options.searchFunction = searchFunction;
	    return this;
	  }

	  /* ===================================================================================================================
	   * Searcher's callback interface methods.
	   * ===================================================================================================================*/

	  /**
	   * Called when the Searcher gets a keyboard event that deletes beyond the search input. This highlights the last word
	   * in the phrase for removal.
	   */
	  deletedBeyondSearchInput() {
	    if (this.isLastOptionHighlightedForUnselect()) {
	      this.removeHighlightedOption();
	    }

	    this.highlightOptionForUnselect();
	  }

	  /**
	   * Called when the search needs to determine if the custom add option should be displayed. As long as this
	   * MultipleSelect does not contain the given value, the custom add option should be displayed.
	   *
	   * @param {string} value The value.
	   * @returns {boolean} True if this MultipleSelect does not contain the value, false otherwise.
	   */
	  doesNotContainValue(value) {
	    return !this.containsOptionWithValue(value);
	  }

	  /**
	   * Called when the Searcher is executing a search. This executes a search via the callback and returns the results.
	   *
	   * @param {string} [searchText] The text to search for.
	   * @returns {Object} The SearchResults.
	   */
	  search(searchText) {
	    this.unhighlightOptionForUnselect();
	    return this.options.searchFunction.call(null, searchText, this.element);
	  }

	  /**
	   * Called when the Searcher gets an event that causes a search result to be selected. This adds the word.
	   */
	  selectSearchResult(value) {
	    // Add the custom option if there is one
	    let option = this.findOptionWithText(value);
	    if (option === null) {
	      this.addOption(value, value);
	      option = this.findOptionWithText(value);
	    }

	    this.selectOption(option);
	  }


	  /* ===================================================================================================================
	   * Private Methods
	   * ===================================================================================================================*/

	  /**
	   * Handles the blur event when the input goes out of focus.
	   *
	   * @private
	   */
	  _handleBlurEvent() {
	    window.setTimeout((function() {
	      if (document.activeElement !== this.input.domElement) {
	        this.searcher.closeSearchResults();
	      }
	    }).bind(this), 300);
	    this.displayContainer.removeClass('focus');
	  }

	  /**
	   * Handles all click events sent to the MultipleSelect.
	   *
	   * @param {Event} event The mouse event.
	   * @private
	   */
	  _handleClickEvent(event) {
	    Utils.stopEvent(event);
	    const target = new PrimeElement(event.target);
	    if (target.is('a')) {
	      if (this.options.allowDuplicates) {
	        const id = target.getParent().getId();
	        this.removeOption(MultipleSelect.findOptionWithId(id));
	      } else {
	        this.removeOptionWithValue(target.getAttribute('value'));
	      }
	    } else if (target.is('span')) {
	      target.selectElementContents();
	    } else {
	      this.input.focus();
	    }
	  }

	  /**
	   * Handles the blur event when the input goes out of focus.
	   *
	   * @private
	   */
	  _handleFocusEvent() {
	    this.displayContainer.addClass('focus');
	  }

	  /**
	   * Handles mouse clicks outside of This. If they clicked anything that is not within this MultipleSelect,
	   * it closes the search results.
	   *
	   * @param {Event} event The event.
	   * @returns {boolean} Always true so the event is bubbled.
	   * @private
	   */
	  _handleGlobalClickEvent(event) {
	    const target = new PrimeElement(event.target);
	    if (this.displayContainer.domElement !== target.domElement && !target.isChildOf(this.displayContainer)) {
	      this.searcher.closeSearchResults();
	    }
	  }

	  /**
	   * Handles all key up events sent to the display container.
	   *
	   * @param {Event} event The browser event object.
	   * @returns {boolean} True if the search display is not open, false otherwise. This will prevent the event from continuing.
	   * @private
	   */
	  _handleKeyUpEvent(event) {
	    const key = event.keyCode;
	    if (key === Events.Keys.ESCAPE) {
	      this.unhighlightOptionForUnselect();
	    }
	  }

	  /**
	   * Makes an ID for the option.
	   *
	   * @param {PrimeElement} option The option to make the ID for.
	   * @private
	   */
	  _makeOptionID(option) {
	    if (this.options.allowDuplicates === true) {
	      let d = new Date().getTime();
	      // UUID ish
	      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
	        let r = (d + Math.random() * 16) % 16 | 0;
	        d = Math.floor(d / 16);
	        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	      });
	    }
	    return this.element.getId() + '-option-' + option.getValue().replace(' ', '-');
	  }

	  /**
	   * Redraws the widget.
	   * @private
	   */
	  _redraw() {
	    // Remove the currently displayed options
	    this.optionList.getChildren().each(function(option) {
	      option.removeFromDOM();
	    });

	    // Add the input option since the select options are inserted before it
	    this.inputOption = PrimeDocument.newElement('<li/>')
	        .appendTo(this.optionList);
	    this.input = PrimeDocument.newElement('<input/>')
	        .addEventListener('click', this._handleClickEvent)
	        .addEventListener('blur', this._handleBlurEvent)
	        .addEventListener('focus', this._handleFocusEvent)
	        .setAttribute('type', 'text')
	        .appendTo(this.inputOption);
	    this.searcher = new Searcher(this.input, this.searchResults, this)
	        .withOptions(this.options)
	        .initialize();

	    // Add the selected options
	    let hasSelectedOptions = false;
	    const options = this.element.getOptions();
	    for (let i = 0; i < options.length; i++) {
	      const option = options[i];
	      if (option.isSelected()) {
	        this.selectOption(option);
	        hasSelectedOptions = true;
	      }
	    }

	    // Put the placeholder attribute in if the MultipleSelect has no selected options
	    if (!hasSelectedOptions) {
	      this.input.setAttribute('placeholder', this.options.placeholder);
	    }

	    this.searcher.resizeInput();

	    // If error class handling was enabled and the select box has the error class, add it to the display
	    if (this.options.errorClass && this.element.hasClass(this.options.errorClass)) {
	      this.displayContainer.addClass(this.options.errorClass);
	    }
	  }

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      allowDuplicates: false,
	      className: 'prime-multiple-select',
	      closeTimeout: 200,
	      customAddEnabled: true,
	      customAddLabel: 'Add Custom Value: ',
	      errorClass: null,
	      noSearchResultsLabel: 'No Matches For: ',
	      placeholder: 'Choose',
	      removeIcon: 'X',
	      searchFunction: Searcher.selectSearchFunction
	    };

	    const userOptions = Utils.dataSetToOptions(this.element);
	    for (let option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }
	}

	/*
	 * Copyright (c) 2016-2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	//Some externs to make intellij linter shutup. :p
	/**
	 * @external TouchEvent
	 */

	/**
	 * @property {Array} changedTouches
	 * @name TouchEvent#changedTouches
	 */

	/**
	 * @class Touchable
	 */
	class Touchable {
	  /**
	   * Constructs a new Touchable object for the given element.
	   *
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element for the Touchable widget.
	   * @param {Function} [eventPropagationHandler] A Function that handles how the event is handled for the touchstart,
	   * touchend, touchmove, and touchcancel events. This Function takes the event object as its only parameter.
	   * @constructor
	   */
	  constructor(element, eventPropagationHandler) {
	    Utils.bindAll(this);

	    this.element = PrimeElement.wrap(element);
	    this.eventPropagationHandler = eventPropagationHandler;
	  }

	  /**
	   * Destroys the Touchable Widget
	   */
	  destroy() {
	    this.element
	        .removeEventListener('touchstart', this._handleTouchStart)
	        .removeEventListener('touchmove', this._handleTouchMove)
	        .removeEventListener('touchcancel', this._handleTouchCancel)
	        .removeEventListener('touchend', this._handleTouchEnd)
	        .removeEventListenersByPattern(/Prime\.Widgets\.Touchable:.+/);
	  }

	  /**
	   * Initializes the widget by attaching all of the event listeners to the element.
	   *
	   * @returns {Touchable} This.
	   */
	  initialize() {
	    this.element
	        .addEventListener('touchstart', this._handleTouchStart)
	        .addEventListener('touchmove', this._handleTouchMove)
	        .addEventListener('touchcancel', this._handleTouchCancel)
	        .addEventListener('touchend', this._handleTouchEnd);
	    return this;
	  }

	  /**
	   * Provide a handler that will be called when a long press is detected.
	   *
	   * @param {Function} handler The event handler.
	   * @returns {Touchable} This
	   */
	  withLongPressHandler(handler) {
	    this.element.addEventListener('Touchable:longPress', handler);
	    return this;
	  }

	  /**
	   * Provide a handler that will be called when a move event is detected.
	   *
	   * @param {Function} handler The event handler.
	   * @returns {Touchable} This
	   */
	  withMoveHandler(handler) {
	    this.element.addEventListener('Touchable:move', handler);
	    return this;
	  }

	  /**
	   * Provide a handler that will be called when a long press is detected.
	   *
	   * @param {Function} handler The event handler.
	   * @returns {Touchable} This
	   */
	  withSwipeDownHandler(handler) {
	    this.element.addEventListener('Touchable:swipeDown', handler);
	    return this;
	  }

	  /**
	   * Provide a handler that will be called when a swipe left event is detected.
	   *
	   * @param {Function} handler The event handler.
	   * @returns {Touchable} This
	   */
	  withSwipeLeftHandler(handler) {
	    this.element.addEventListener('Touchable:swipeLeft', handler);
	    return this;
	  }

	  /**
	   * Provide a handler that will be called when a swipe right event is detected.
	   *
	   * @param {Function} handler The event handler.
	   * @returns {Touchable} This
	   */
	  withSwipeRightHandler(handler) {
	    this.element.addEventListener('Touchable:swipeRight', handler);
	    return this;
	  }

	  /**
	   * Provide a handler that will be called when a swipe up event is detected.
	   *
	   * @param {Function} handler The event handler.
	   * @returns {Touchable} This
	   */
	  withSwipeUpHandler(handler) {
	    this.element.addEventListener('Touchable:swipeUp', handler);
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Collects all of the touch data at the end of the touch and calculates the distances and times.
	   *
	   * @param {TouchEvent} event The TouchEvent.
	   * @private
	   */
	  _collectTouchData(event) {
	    const touchPoints = event.changedTouches.length;
	    if (touchPoints > 1) {
	      return;
	    }

	    const touch = event.changedTouches[0];
	    this.elapsedTime = new Date().getTime() - this.touchStarted;
	    this.touchEndX = touch.pageX;
	    this.touchEndY = touch.pageY;
	    this.touchX = this.touchStartX - this.touchEndX;
	    this.touchY = this.touchStartY - this.touchEndY;
	  }

	  /**
	   * Called when all processing is finished and the handlers are called based on direction and time of the touches.
	   *
	   * @private
	   */
	  _finished() {
	    // Make sure this was a swipe
	    const event = {
	      elapsedTime: this.elapsedTime,
	      touchStartX: this.touchStartX,
	      touchStartY: this.touchStartY,
	      touchEndX: this.touchEndX,
	      touchEndY: this.touchEndY,
	      touchX: this.touchX,
	      touchY: this.touchY,
	      element: this.element,
	      target: this.element.domElement
	    };
	    event.swipe = Math.abs(event.touchX) > 50 || Math.abs(event.touchY) > 50;
	    event.swipeX = event.swipe && Math.abs(event.touchX) > Math.abs(event.touchY);
	    event.swipeY = event.swipe && !event.swipeX;
	    event.longPress = !event.swipe && event.elapsedTime > 500;

	    if (event.longPress) {
	      this.element.fireCustomEvent('Touchable:longPress', event);
	    } else if (event.swipeX && event.touchX > 0) {
	      this.element.fireCustomEvent('Touchable:swipeLeft', event);
	    } else if (event.swipeX) {
	      this.element.fireCustomEvent('Touchable:swipeRight', event);
	    } else if (event.swipeY && event.touchY > 0) {
	      this.element.fireCustomEvent('Touchable:swipeUp', event);
	    } else if (event.swipeY) {
	      this.element.fireCustomEvent('Touchable:swipeDown', event);
	    }
	  }

	  /**
	   * Handle the touch cancel event.
	   *
	   * @param {TouchEvent} event The touch event.
	   * @private
	   */
	  _handleTouchCancel(event) {
	    this._collectTouchData(event);
	    this._finished();
	    if (Utils.isDefined(this.eventPropagationHandler)) {
	      this.eventPropagationHandler(event);
	    }
	  }

	  /**
	   * Handle the touch end event.
	   *
	   * @param {TouchEvent} event The touch event.
	   * @private
	   */
	  _handleTouchEnd(event) {
	    this._collectTouchData(event);
	    this._finished();
	    if (Utils.isDefined(this.eventPropagationHandler)) {
	      this.eventPropagationHandler(event);
	    }
	  }

	  /**
	   * Handle the touch move event.
	   *
	   * @param {TouchEvent} event The touch event.
	   * @private
	   */
	  _handleTouchMove(event) {
	    this.element.fireEvent('Touchable:move', event);
	    if (Utils.isDefined(this.eventPropagationHandler)) {
	      this.eventPropagationHandler(event);
	    }
	  }

	  /**
	   * Handle the touch start event.
	   *
	   * @param {TouchEvent} event The touch event.
	   * @private
	   */
	  _handleTouchStart(event) {
	    const touchPoints = event.changedTouches.length;
	    if (touchPoints > 1) {
	      if (Utils.isDefined(this.eventPropagationHandler)) {
	        this.eventPropagationHandler(event);
	      }

	      return;
	    }

	    const touch = event.changedTouches[0];
	    this.touchStarted = new Date().getTime();
	    this.touchStartX = touch.pageX;
	    this.touchStartY = touch.pageY;
	    if (Utils.isDefined(this.eventPropagationHandler)) {
	      this.eventPropagationHandler(event);
	    }
	  }
	}

	/*
	 * Copyright (c) 2015-2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class SideMenu {
	  /**
	   * Constructs the side menu.
	   *
	   * @param {PrimeElement|Element} button The button element that is used to open the side menu.
	   * @param {PrimeElement|Element} sideMenuElement The side menu element that will be "hidden" and "show".
	   * @constructor
	   */
	  constructor(button, sideMenuElement) {
	    Utils.bindAll(this);
	    this.sideMenu = PrimeElement.wrap(sideMenuElement);
	    this.button = PrimeElement.wrap(button);
	    this._setInitialOptions();
	  }

	  /**
	   * Closes the side menu.
	   *
	   * @returns {SideMenu} This.
	   */
	  close() {
	    if (!PrimeDocument.bodyElement.hasClass(this.options.closedClass)) {
	      PrimeDocument.bodyElement.addClass(this.options.closedClass);
	    }

	    if (PrimeDocument.bodyElement.hasClass(this.options.openClass)) {
	      PrimeDocument.bodyElement.removeClass(this.options.openClass);
	    }

	    return this;
	  }

	  /**
	   * Initializes the widget by attaching the event listener to the menu button.
	   *
	   * @returns {SideMenu}
	   */
	  initialize() {
	    this.button.addEventListener('click', this._handleClickEvent);
	    return this;
	  }

	  /**
	   * @returns {boolean} True if the side menu is currently open.
	   */
	  isOpen() {
	    return this.sideMenu.getLeft() >= 0;
	    // return PrimeDocument.bodyElement.hasClass('prime-side-menu-open') || !PrimeDocument.bodyElement.hasClass('prime-side-menu-closed');
	  }

	  /**
	   * Opens the mobile nav.
	   * @returns {SideMenu} This.
	   */
	  open() {
	    if (PrimeDocument.bodyElement.hasClass(this.options.closedClass)) {
	      PrimeDocument.bodyElement.removeClass(this.options.closedClass);
	    }

	    if (!PrimeDocument.bodyElement.hasClass(this.options.openClass)) {
	      PrimeDocument.bodyElement.addClass(this.options.openClass);
	    }

	    this.touchable = new Touchable(PrimeDocument.bodyElement).withSwipeLeftHandler(this._handleSwipeLeft);
	    return this;
	  }

	  /**
	   * Set more than one option at a time by providing a map of key value pairs. This is considered an advanced
	   * method to set options on the widget. The caller needs to know what properties are valid in the options object.
	   *
	   * @param {Object} options Key value pair of configuration options.
	   * @returns {SideMenu} This.
	   */
	  withOptions(options) {
	    if (!Utils.isDefined(options)) {
	      return this;
	    }

	    for (let option in options) {
	      if (options.hasOwnProperty(option)) {
	        this.options[option] = options[option];
	      }
	    }
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Handles the click event on the side menu button and calls either the open or close function.
	   *
	   * @private
	   */
	  _handleClickEvent(event) {
	    Utils.stopEvent(event);
	    if (this.isOpen()) {
	      this.close();
	    } else {
	      this.open();
	    }
	  }

	  /**
	   * Handles the synthetic swipe left event that Prime.js provides.
	   *
	   * @private
	   */
	  _handleSwipeLeft() {
	    if (this.isOpen()) {
	      this.close();
	    }

	    if (Utils.isDefined(this.touchable)) {
	      this.touchable.destroy();
	      this.touchable = null;
	    }
	  }

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      closedClass: 'prime-side-menu-closed',
	      openClass: 'prime-side-menu-open'
	    };

	    const userOptions = Utils.dataSetToOptions(this.sideMenu);
	    for (let option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }
	}

	/*
	 * Copyright (c) 2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	const PrimeStorage = {
	  /**
	   * True if local storage is supported.
	   * @type {boolean} true if local storage is supported. Local in this case being used to indicate either type 'local' or 'session'.
	   */
	  supported: typeof(Storage) !== 'undefined',

	  /**
	   * Set an object into session storage.
	   * @param key {string} the key to store the object.
	   * @param object {object} the object to store.
	   */
	  setSessionObject: function(key, object) {
	    PrimeStorage._setObject(sessionStorage, key, object);
	  },

	  /**
	   * Retrieve an object from session storage.
	   * @param key {string} the key that was used to store the object.
	   * @return {object} the stored object or null if it does not exist or local storage is not supported.
	   */
	  getSessionObject: function(key) {
	    return PrimeStorage._getObject(sessionStorage, key);
	  },

	  /**
	   * Set an object into local storage storage.
	   * @param key {string} the key to store the object.
	   * @param object {object} the object to store.
	   */
	  setLocalObject: function(key, object) {
	    PrimeStorage._setObject(localStorage, key, object);
	  },

	  /**
	   * Retrieve an object from local storage.
	   * @param key {string} the key that was used to store the object.
	   * @return {object} the stored object or null if it does not exist or local storage is not supported.
	   */
	  getLocalObject: function(key) {
	    return PrimeStorage._getObject(localStorage, key);
	  },

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  _getObject: function(storage, key) {
	    if (PrimeStorage.supported) {
	      const item = storage.getItem(key);
	      if (item !== null) {
	        return JSON.parse(item);
	      }
	    }

	    return null;
	  },

	  _setObject: function(storage, key, object) {
	    if (PrimeStorage.supported) {
	      storage.setItem(key, JSON.stringify(object));
	    }
	  }
	};

	/*
	 * Copyright (c) 2014-2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class SplitButton {
	  /**
	   * Constructs a new SplitButton object for the given element.
	   *
	   * The markup must be a specific structure in order for the SplitButton to remember the last action the user took
	   * as well as show and hide the menu of items.
	   *
	   * Here's the format for the elements.
	   *
	   * <pre>
	   *   &lt;div class="split-button"&gt;
	   *     &lt;a href="#"&gt;Loading... &lt;/a&gt;
	   *     &lt;button type="button"&gt;&lt;/button&gt;
	   *     &lt;div type="menu"&gt;
	   *       &lt;a class="item" href="/admin/foo/add/"&gt;Add&lt;/a&gt;
	   *       &lt;a class="item" href="/admin/foo/delete/"&gt;Delete&lt;/a&gt;
	   *     &lt;/div&gt;
	   *   &lt;/ul&gt;
	   * </pre>
	   *
	   * Also, it is important to understand how to attach event listeners to the SplitButton. You cannot attach them to
	   * the individual menu items since those will never be clicked. Instead, you must attach them to the div at the top
	   * and handle all the events from inside. This is due to how the split button changes the main button based on the
	   * action the user took last.
	   *
	   * @param element {PrimeElement|Element|EventTarget} The element to transform into a split button.
	   * @constructor
	   */
	  constructor(element) {
	    Utils.bindAll(this);

	    this.element = PrimeElement.wrap(element);
	    this.currentAction = this.element.queryFirst('a');
	    if (this.currentAction === null) {
	      throw new TypeError('The SplitButton element must contain an <a> that is the currently selected action.');
	    }
	    this.loading = this.currentAction;

	    this.button = this.element.queryFirst('button');
	    if (this.button === null) {
	      throw new TypeError('The SplitButton element must contain a <button> that is used to open it.');
	    }

	    this.menu = this.element.queryFirst('.menu');
	    if (this.menu === null) {
	      throw new TypeError('The SplitButton element must contain a <div class="menu"> that contains the menu items.');
	    }

	    this.items = this.menu.query('.item');
	    if (this.items.length === 0) {
	      throw new TypeError('The SplitButton element must contain at least one item.');
	    }

	    this.actionIndex = null;
	    this.options = {};
	    this._setInitialOptions();
	  }

	  /**
	   * Removes the event listeners.
	   */
	  destroy() {
	    this.button.removeEventListener('click', this._handleButtonClick);
	  }

	  /**
	   * Initializes the SplitButton by setting up all the event listeners and managing the default action or the last action
	   * that the user took.
	   */
	  initialize() {
	    this.button.addEventListener('click', this._handleButtonClick);
	    this.items.each(item => item.addEventListener('click', this._handleItemClick));
	    this.redraw();
	    return this;
	  }

	  redraw() {
	    // Load the last action (if any)
	    let actionId = null;
	    if (PrimeStorage.supported && this.options.localStorageKey !== null) {
	      actionId = PrimeStorage.getSessionObject(this.options.localStorageKey);
	      if (actionId !== null) {
	        this.selectAction(actionId);
	      }
	    }

	    // If no action is selected from local storage, select the default
	    if (actionId === null) {
	      this.selectDefaultAction();
	    }

	    return this;
	  }

	  selectAction(actionId) {
	    const item = PrimeDocument.queryById(actionId);
	    if (item !== null) {
	      let classes = '';
	      if (this.loading !== null) {
	        classes = this.loading.getAttribute('class');
	        this.loading.removeFromDOM();
	        this.loading = null;
	      } else {
	        classes = this.currentAction.getAttribute('class');
	        this.currentAction.setAttribute('class', this.currentAction.getAttribute('data-original-class'));
	        this.currentAction.removeFromDOM();
	        this.currentAction.prependTo(this.menu);
	      }

	      item.setAttribute('data-original-class', item.getAttribute('class'));
	      item.setAttribute('class', classes);
	      item.removeFromDOM();
	      item.prependTo(this.element);
	      this.currentAction = item;
	    } else {
	      // This shouldn't infinitely recurse because that method always finds something
	      this.selectDefaultAction();
	    }

	    // this.currentAction.setAttribute('href', item.getAttribute('href'));
	    // this.currentAction.setHTML(item.getHTML());
	    return this;
	  }

	  selectDefaultAction() {
	    // Find the default
	    let actionId = null;
	    for (let i = 0; i < this.items.length; i++) {
	      if (this.items[i].hasClass('default')) {
	        actionId = this.items[i].getId();
	        break;
	      }
	    }

	    // Fall back if it wasn't found
	    if (actionId === null) {
	      actionId = this.items[0].getId();
	    }

	    // Select the default (or first item)
	    if (actionId !== null) {
	      this._saveLastAction(actionId);
	      this.selectAction(actionId);
	    }

	    return this;
	  }

	  withLocalStorageKey(localStorageKey) {
	    this.options.localStorageKey = localStorageKey;
	    return this;
	  }

	  withOptions(options) {
	    if (!Utils.isDefined(options)) {
	      return this;
	    }

	    for (let option in options) {
	      if (options.hasOwnProperty(option)) {
	        this.options[option] = options[option];
	      }
	    }

	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Handles the button click event.
	   * @private
	   */
	  _handleButtonClick(event) {
	    Utils.stopEvent(event);
	    if (this.menu.isVisible()) {
	      this.menu.hide();
	    } else {
	      this.menu.show();
	    }
	  }

	  /**
	   * Handles the item click event to update the last action in local storage (if enabled).
	   * @private
	   */
	  _handleItemClick(event) {
	    for (let i = 0; i < this.items.length; i++) {
	      if (this.items[i].domElement === event.target) {
	        let actionId = this.items[i].getId();
	        this._saveLastAction(actionId);
	        this.selectAction(actionId);
	        this.menu.hide();
	        break;
	      }
	    }
	  }

	  _saveLastAction(actionId) {
	    if (PrimeStorage.supported && this.options.localStorageKey !== null) {
	      PrimeStorage.setSessionObject(this.options.localStorageKey, actionId);
	    }
	  }

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      localStorageKey: null
	    };

	    const userOptions = Utils.dataSetToOptions(this.element);
	    for (let option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }
	}

	/*
	 * Copyright (c) 2017-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class Table {
	  /**
	   * Constructs a new Table object for the given table element.
	   *
	   * @param {PrimeElement|Element} element The table element.
	   * @constructor
	   */
	  constructor(element) {
	    Utils.bindAll(this);

	    this.column = null;
	    this.columnIndex = 0;
	    this.sortAscending = true;

	    this.element = PrimeElement.wrap(element);
	    this.thead = this.element.queryFirst('thead');
	    this.tbody = this.element.queryFirst('tbody');

	    if (!this.element.is('table')) {
	      throw new TypeError('The element you passed in is not a table element.');
	    }

	    this._setInitialOptions();
	  }

	  /**
	   * Initializes the table widget.
	   *
	   * @returns {Table} This.
	   */
	  initialize() {
	    // Sortable by default unless it is disabled
	    if (this.element.getDataAttribute('sortable') !== 'false') {
	      this._initializeSort();
	    }

	    // Initialize the checkbox handling
	    this.selectAll = this.element.queryFirst('thead > tr > th input[type="checkbox"]');
	    if (this.selectAll !== null) {
	      this.selectAll.addEventListener('change', this._handleSelectAllChange);
	    }

	    this.element.query('tbody > tr > td input[type="checkbox"]').addEventListener('click', this._handleCheckboxEvent);
	    this.checkedCount = 0;
	    this.numberofCheckboxes = this.element.query('tbody td input[type="checkbox"]').length;

	    return this;
	  }

	  /**
	   * Sort the table.
	   */
	  sort() {
	    this._clearSortIndicators();

	    if (this.column.hasClass('sort-up')) {
	      this.column.removeClass('sort-up').addClass('sort-down');
	      this.sortAscending = false;
	    } else if (this.column.hasClass('sort-down')) {
	      this.column.removeClass('sort-down').addClass('sort-up');
	      this.sortAscending = true;
	    } else {
	      this.column.addClass('sort-up');
	      this.sortAscending = true;
	    }

	    // Collect the values to sort
	    const rows = [];
	    this.tbody.query('tr').each(function(element) {
	      rows.push(element);
	    });

	    rows.sort(this._comparator);
	    let i = 0;
	    const length = rows.length;
	    if (this.sortAscending) {
	      for (i = 0; i <  length; i++) {
	        this.tbody.appendElement(rows[i]);
	      }
	    } else {
	      for (i = length; i > 0; i--) {
	        this.tbody.appendElement(rows[i - 1]);
	      }
	    }

	    // Save current sorted column state in local storage.
	    if (PrimeStorage.supported && this.options.localStorageKey !== null) {
	      const data = {
	        columnIndex: this.columnIndex,
	        sortAscending: this.sortAscending
	      };
	      PrimeStorage.setSessionObject(this.options.localStorageKey, data);
	    }
	  }

	  /**
	   * Sets a callback on a checkbox event.
	   *
	   * @param {function} callback The callback function
	   * @returns {Table} This.
	   */
	  withCheckEventCallback(callback) {
	    this.options.checkEventCallback = callback;
	    return this;
	  }

	  /**
	   * Enables local storage of the sorted column. This key is required to enable local storage of the sorted column.
	   *
	   * @param {String} key The local storage key.
	   * @returns {Table} This.
	   */
	  withLocalStorageKey(key) {
	    this.options.localStorageKey = key;
	    return this;
	  }

	  /**
	   * Set more than one option at a time by providing a map of key value pairs. This is considered an advanced
	   * method to set options on the widget. The caller needs to know what properties are valid in the options object.
	   *
	   * @param {Object} options Key value pair of configuration options.
	   * @returns {Table} This.
	   */
	  withOptions(options) {
	    if (!Utils.isDefined(options)) {
	      return this;
	    }

	    for (let option in options) {
	      if (options.hasOwnProperty(option)) {
	        this.options[option] = options[option];
	      }
	    }
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Remove the ascending and descending sort classes on every column except the current column being sorted.
	   * @private
	   */
	  _clearSortIndicators() {
	    this.thead.query('th').each((function(element) {
	      if (element.domElement !== this.column.domElement) {
	        element.removeClass('sort-up sort-down');
	      }
	    }).bind(this));
	  }

	  /**
	   * Sort function to be used by the .sort() method.
	   * @param a The first row to compare
	   * @param b The second row to compare
	   * @returns {number}
	   * @private
	   */
	  _comparator(a, b) {
	    const sortType = this.thead.query('th')[this.columnIndex].getDataAttribute('sortType') || 'string';
	    if (sortType !== 'string' && sortType !== 'number') {
	      throw new Error('Unsupported sort type. [string] or [number] are the two supported sort types.');
	    }

	    const cell1 = a.query('td')[this.columnIndex];
	    const cell2 = b.query('td')[this.columnIndex];

	    const sortValue1 = cell1.getDataAttribute('sortValue');
	    const sortValue2 = cell2.getDataAttribute('sortValue');

	    // Prefer the data-sort-value if provided
	    let value1 = sortValue1 || cell1.getTextContent().toLowerCase();
	    let value2 = sortValue2 || cell2.getTextContent().toLowerCase();

	    if (sortType === 'string') {
	      return value1.localeCompare(value2);
	    } else {
	      value1 = this._toNumber(value1);
	      value2 = this._toNumber(value2);

	      if (value1 < value2) {
	        return -1;
	      }

	      if (value1 > value2) {
	        return 1;
	      }

	      return 0;
	    }
	  }

	  // noinspection JSMethodCanBeStatic
	  /**
	   * Return the column index where 0 is the first column in the table.
	   * @param column {PrimeElement} the column to determine the index of
	   * @returns {number} a positive integer representing the index of the column in the table.
	   * @private
	   */
	  _getColumnIndex(column) {
	    let columnIndex = 0;
	    let current = column;
	    let previous = column;
	    while (previous !== null) {
	      previous = current.getPreviousSibling();
	      current = previous;
	      columnIndex++;
	    }

	    return columnIndex - 1;
	  }

	  _handleCheckboxEvent(event) {
	    const target = new PrimeElement(event.currentTarget);
	    const currentCheckedCount = this.checkedCount;
	    this.checkedCount = this.checkedCount + (target.isChecked() ? 1 : -1);

	    if (this.selectAll !== null) {
	      if (currentCheckedCount === this.numberofCheckboxes && this.numberofCheckboxes !== this.checkedCount) {
	        this.selectAll.setChecked(false);
	      } else if (currentCheckedCount !== this.numberofCheckboxes && this.numberofCheckboxes === this.checkedCount) {
	        this.selectAll.setChecked(true);
	      }
	    }

	    if (this.options.checkEventCallback !== null) {
	      this.options.checkEventCallback({
	        checkedCount: this.checkedCount
	      });
	    }
	  }

	  _handleSelectAllChange() {
	    if (this.selectAll.isChecked()) {
	      this.element.query('tbody tr > td input[type="checkbox"]').each(function(e) {
	        if (!e.isChecked()) {
	          e.setChecked(true);
	          this.checkedCount++;
	        }
	      }.bind(this));
	    } else {
	      this.element.query('tbody tr > td input[type="checkbox"]').each(function(e) {
	        if (e.isChecked()) {
	          e.setChecked(false);
	          this.checkedCount--;
	        }
	      }.bind(this));
	    }

	    if (this.options.checkEventCallback !== null) {
	      this.options.checkEventCallback({
	        checkedCount: this.checkedCount
	      });
	    }
	  }

	  /**
	   * Handle the click event on the sortable column.
	   * @param event {MouseEvent} the click event
	   * @private
	   */
	  _handleSortableColumnClick(event) {
	    Utils.stopEvent(event);
	    const target = new PrimeElement(event.currentTarget);
	    this.column = target;
	    this.columnIndex = this._getColumnIndex(target);

	    this.sort();
	  }

	  /**
	   * Add the click event listener to the column unless it matches the ignore selector.
	   * @param column {PrimeElement} the column element to initialize.
	   * @private
	   */
	  _initializeColumn(column) {
	    if (!column.is('[data-sortable="false"]') && column.queryFirst('input[type="checkbox"]') === null) {
	      column.addClass('sortable').addEventListener('click', this._handleSortableColumnClick);
	    }
	  }

	  _initializeSort() {
	    this.thead.query('th').each(this._initializeColumn);

	    if (PrimeStorage.supported && this.options.localStorageKey !== null) {
	      const state = PrimeStorage.getSessionObject(this.options.localStorageKey);
	      if (state !== null) {
	        this.columnIndex = state.columnIndex;
	        this.sortAscending = state.sortAscending;

	        this.column = this.thead.query('th')[this.columnIndex];
	        if (this.sortAscending) {
	          this.column.addClass('sort-down');
	        } else {
	          this.column.addClass('sort-up');
	        }

	        this.sort();
	      }
	    }
	  }

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      localStorageKey: null,
	      checkEventCallback: null
	    };

	    const userOptions = Utils.dataSetToOptions(this.element);
	    for (let option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }

	  // noinspection JSMethodCanBeStatic
	  _toNumber(value) {
	    const number = Number(value);
	    if (isNaN(value)) {
	      console.error(new Error('Expected value [' + value + '] to be a number.'));
	      return value;
	    }
	    return number;
	  }
	}

	/*
	 * Copyright (c) 2015-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class Tabs {
	  /**
	   * Constructs a new Tabs object for the given ul element.
	   *
	   * @param {PrimeElement|Element|EventTarget} element The ul element to build the tab widget from
	   * @constructor
	   */
	  constructor(element) {
	    Utils.bindAll(this);

	    this.element = PrimeElement.wrap(element);
	    if (this.element.getTagName().toLowerCase() === 'ul') {
	      this.tabsContainer = this.element;
	    } else {
	      this.tabsContainer = this.element.queryFirst('ul');
	    }

	    if (this.tabsContainer === null) {
	      throw new TypeError('Tabs requires a ul element. The passed element does not contain a ul element');
	    }

	    this._setInitialOptions();
	    this.tabContents = {};
	    this.tabs = {};
	    this.tabArray = [];
	    this.selectedTab = null;
	  }

	  /**
	   * Destroys the Tabs widget
	   */
	  destroy() {
	    this.tabsContainer.query('a').each(function(a) {
	      a.removeEventListener('click', this._handleClick);
	    }.bind(this));

	    for (let i = 0; i < this.tabs.length; i++) {
	      this.tabs[i].removeClass(this.options.tabContentClass);
	    }
	  }

	  /**
	   * Hides the tab for the given Id.
	   *
	   * @param id The Id of the tab to hide.
	   */
	  hideTab(id) {
	    const tab = this.tabs[id];
	    tab.hide();
	    this.redraw();
	  }

	  /**
	   * Initializes the Tabs widget. Call this after you have set all the initial options.
	   *
	   * @returns {Tabs} This.
	   */
	  initialize() {
	    this.tabsContainer.query('li:not(.disabled)').each(function(tab) {
	      const a = tab.queryFirst('a').addEventListener('click', this._handleClick);
	      const dataSet = tab.getDataSet();

	      const href = a.getAttribute('href');
	      const isAnchor = href.charAt(0) === '#';
	      if (isAnchor) {
	        dataSet.tabId = href.substring(1);
	        dataSet.tabUrl = '';
	      } else {
	        dataSet.tabId = href;
	        dataSet.tabUrl = href;
	      }

	      this.tabs[dataSet.tabId] = tab;
	      this.tabArray.push(tab);

	      let content = PrimeDocument.queryById(dataSet.tabId);
	      if (content === null && isAnchor) {
	        throw new Error('A div is required with the following ID [' + dataSet.tabId + ']');
	      } else if (content === null) {
	        content = PrimeDocument.newElement('<div>').insertAfter(this.element).setAttribute('id', href);
	      }

	      content.hide();

	      content.addClass(this.options.tabContentClass);
	      this.tabContents[dataSet.tabId] = content;
	    }.bind(this));

	    if (this.options.deepLinkingEnabled) {
	      const tabId = window.location.hash.replace(/^#/, '');
	      if (Utils.isDefined(tabId) && Utils.isDefined(this.tabs[tabId])) {
	        this.selectTab(tabId);
	      }
	    }

	    this.redraw();
	    return this;
	  }

	  /**
	   * Re-applies the first-child, last-child, and active classes based on the current state of the tabs. If there
	   * is no tab that is active, this also selects the first tab that is visible.
	   */
	  redraw() {
	    let firstVisible = null;
	    let lastVisible = null;
	    let selectNew = false;
	    let noneActive = true;
	    for (let i = 0; i < this.tabArray.length; i++) {
	      if (this.tabArray[i].isVisible()) {
	        if (firstVisible === null) {
	          firstVisible = this.tabArray[i];
	        }

	        lastVisible = this.tabArray[i];

	        if (this.tabArray[i].hasClass('selected')) {
	          noneActive = false;
	        }
	      } else if (this.tabArray[i].hasClass('selected')) {
	        selectNew = true;
	      }

	      this.tabArray[i].removeClass('first-visible-tab');
	      this.tabArray[i].removeClass('last-visible-tab');
	    }

	    firstVisible.addClass('first-visible-tab');
	    lastVisible.addClass('last-visible-tab');

	    let tabId = null;
	    if (selectNew || noneActive) {
	      if (PrimeStorage.supported && this.options.localStorageKey !== null) {
	        const state = PrimeStorage.getSessionObject(this.options.localStorageKey);
	        if (state !== null) {
	          tabId = state.tabId;
	        }
	      }

	      // If no tabId was found or the tab is not currently visible, select the first visible
	      if (tabId === null || !this.tabs[tabId] || !this.tabs[tabId].isVisible()) {
	        tabId = firstVisible.getDataSet().tabId;
	      }

	      this.selectTab(tabId);
	    }

	    // If error class handling was enabled, add the error class to the tab and set focus
	    if (this.options.errorClass) {
	      for (tabId in this.tabContents) {
	        if (this.tabContents.hasOwnProperty(tabId)) {
	          const errorElement = this.tabContents[tabId].queryFirst('.' + this.options.errorClass);
	          if (errorElement !== null) {
	            this.tabs[tabId].queryFirst('a').addClass(this.options.errorClass);
	            this.selectTab(tabId);
	          }
	        }
	      }
	    }
	  }

	  /**
	   * Select the active tab. Sets the active class on the li and shows only the corresponding tab content.
	   *
	   * @param id The Id of the tab to select.
	   */
	  selectTab(id) {
	    if (this.selectedTab !== null && this.selectedTab.getDataSet().tabId === id) {
	      return;
	    }

	    for (const tabId in this.tabs) {
	      if (this.tabs.hasOwnProperty(tabId)) {
	        this.tabs[tabId].removeClass('selected');
	      }
	    }

	    this.tabs[id].addClass('selected');
	    this.selectedTab = this.tabs[id];
	    for (const tabId in this.tabContents) {
	      if (this.tabContents.hasOwnProperty(tabId) && tabId === id) {
	        this.tabContents[tabId].show('block');
	        if (this.options.selectCallback) {
	          this.options.selectCallback(this.tabs[tabId], this.tabContents[tabId]);
	        }
	      } else {
	        this.tabContents[tabId].hide();
	      }
	    }

	    // Save current selected tab state in local storage. The JSON object isn't necessary at the moment,
	    // but we can tack on other properties as needed for additional state in the future.
	    if (PrimeStorage.supported && this.options.localStorageKey !== null) {
	      const data = {
	        tabId: id
	      };
	      PrimeStorage.setSessionObject(this.options.localStorageKey, data);
	    }

	    const ajaxURL = this.selectedTab.getDataSet().tabUrl;
	    if (ajaxURL !== '') {
	      this.selectedTab.addClass('loading');
	      this.tabContents[id].setHTML('');
	      this.tabContents[id].addClass('loading');
	      new PrimeRequest(ajaxURL, 'GET')
	          .withSuccessHandler(this._handleAJAXResponse)
	          .withErrorHandler(this._handleAJAXResponse)
	          .go();
	    }
	  }

	  /**
	   * Shows the tab for the given Id.
	   *
	   * @param {String} id The Id of the tab to hide.
	   */
	  showTab(id) {
	    this.tabs[id].show();
	    this.redraw();
	  }

	  /**
	   * Adds a callback for AJAX calls. This is invoked after the AJAX load completes and the HTML is inserted into the
	   * DOM. The function is passed the container for the tab that was selected.
	   *
	   * @param {Function} callback The callback function.
	   * @returns {Tabs} This Tabs.
	   */
	  withAJAXCallback(callback) {
	    this.options.ajaxCallback = callback;
	    return this;
	  }

	  /**
	   * Disable the default behavior of allowing a deep link provided on the URL to set the default tab during render.
	   *
	   * @returns {Tabs} This Tabs.
	   */
	  withDeepLinkingDisabled() {
	    this.options.deepLinkingEnabled = false;
	    return this;
	  }

	  /**
	   * Enable error class handling. When this option is used, if the specified error class is found on any element
	   * in the tab content the same error class will be added to the tab to identify the tab contains errors.
	   *
	   * @returns {Tabs} This Tabs.
	   */
	  withErrorClassHandling(errorClass) {
	    this.options.errorClass = errorClass;
	    return this;
	  }

	  /**
	   * Enables local storage of the currently selected tab. If the user navigates away from the page and back, the same
	   * tab will be selected. This key is how the selected tab is stored in local storage and by setting a key you also
	   * enable this feature.
	   *
	   * @param {?String} key The local storage key.
	   * @returns {Tabs} This Tabs.
	   */
	  withLocalStorageKey(key) {
	    this.options.localStorageKey = key;
	    return this;
	  }

	  /**
	   * Set more than one option at a time by providing a map of key value pairs. This is considered an advanced
	   * method to set options on the widget. The caller needs to know what properties are valid in the options object.
	   *
	   * @param {Object} options Key value pair of configuration options.
	   * @returns {Tabs} This Tabs.
	   */
	  withOptions(options) {
	    if (!Utils.isDefined(options)) {
	      return this;
	    }

	    for (let option in options) {
	      if (options.hasOwnProperty(option)) {
	        this.options[option] = options[option];
	      }
	    }
	    return this;
	  }

	  /**
	   * Specifies a callback function that is called whenever tabs are changed.
	   *
	   * @param {?Function} callback The callback function.
	   * @returns {Tabs} This Tabs.
	   */
	  withSelectCallback(callback) {
	    this.options.selectCallback = callback;
	    return this;
	  }

	  /**
	   * Sets the class name for the tab content elements.
	   *
	   * @param className {String} The class name.
	   * @returns {Tabs}
	   */
	  withTabContentClass(className) {
	    this.options.tabContentClass = className;
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Handles the AJAX response.
	   *
	   * @param {XMLHttpRequest} xhr The AJAX response.
	   * @private
	   */
	  _handleAJAXResponse(xhr) {
	    this.selectedTab.removeClass('loading');
	    const container = this.tabContents[this.selectedTab.getDataSet().tabId];
	    container.removeClass('loading');
	    container.setHTML(xhr.responseText);

	    if (this.options.ajaxCallback !== null) {
	      this.options.ajaxCallback(container);
	    }
	  }

	  /**
	   * Handle the tab click by showing the corresponding panel and hiding the others.
	   *
	   * @param {MouseEvent} event The click event on the anchor tag.
	   * @private
	   */
	  _handleClick(event) {
	    Utils.stopEvent(event);
	    const a = new PrimeElement(event.currentTarget);
	    if (!a.hasClass('disabled')) {
	      const href = a.getAttribute('href');
	      if (href.charAt(0) === '#') {
	        this.selectTab(href.substring(1));
	      } else {
	        this.selectTab(href);
	      }
	    }
	  }

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      ajaxCallback: null,
	      errorClass: null,
	      deepLinkingEnabled: true,
	      localStorageKey: null,
	      selectCallback: null,
	      tabContentClass: 'prime-tab-content'
	    };

	    const userOptions = Utils.dataSetToOptions(this.element);
	    for (let option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }
	}

	/*
	 * Copyright (c) 2017-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	const open = [];

	class Tooltip {
	  /**
	   * Constructs a new Tooltip object for the given element.
	   *
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element for the Tooltip widget.
	   * @constructor
	   */
	  constructor(element) {
	    Utils.bindAll(this);

	    this.element = PrimeElement.wrap(element);
	    this._setInitialOptions();
	  }

	  static get open() {
	    return open;
	  }

	  /**
	   * Hides the tooltip.
	   *
	   * @returns {Tooltip} This.
	   */
	  hide() {
	    if (Tooltip.open.length > 0) {
	      Tooltip.open.forEach(function(t) {
	        t.removeFromDOM();
	      });
	    }
	    return this;
	  }

	  /**
	   * Initializes the widget by attaching event listeners to the element.
	   *
	   * @returns {Tooltip} This.
	   */
	  initialize() {
	    this.element.addEventListener('mouseenter', this._handleMouseEnter).addEventListener('mouseleave', this._handleMouseLeave);
	    PrimeDocument.addEventListener('scroll', this._handleMouseLeave);
	    return this;
	  }

	  /**
	   * Shows the tooltip.
	   *
	   * @returns {Tooltip} This.
	   */
	  show() {
	    const text = this.element.getDataSet()[this.options.dataName];
	    const zIndex = this.element.getRelativeZIndex();
	    let classNames = this.options.className + ' ' + this.element.getTagName().toLocaleLowerCase();
	    if (this.options.additionalClasses !== null) {
	      classNames = classNames + ' ' + this.options.additionalClasses;
	    }
	    const tooltip = PrimeDocument.newElement('<span>')
	        .appendTo(PrimeDocument.bodyElement)
	        .addClass(classNames)
	        .setHTML(text)
	        .setStyle('zIndex', zIndex + 10);

	    const left = this.element.getLeft();
	    const top = this.element.getTop();
	    const width = this.element.getWidth();
	    const tooltipWidth = tooltip.getWidth();
	    const tooltipHeight = tooltip.getHeight();

	    tooltip.setLeft(left - (tooltipWidth / 2) + (width / 2));
	    tooltip.setTop(top - tooltipHeight - 8);

	    // If the tooltip is too close to the top of the screen invert it and move it under the element
	    if ((top - tooltipHeight - 8) < 0) {
	      tooltip.setTop(top + this.element.getHeight() + 8).addClass('inverted');
	    }

	    Tooltip.open.push(tooltip);
	    return this;
	  }

	  /**
	   * Sets the class name to use when creating the tooltip.
	   *
	   * @param additionalClasses {?String} The class name or spaces separated names.
	   * @returns {Tooltip} This.
	   */
	  withAdditionalClassNames(additionalClasses) {
	    this.options.additionalClasses = additionalClasses;
	    return this;
	  }

	  /**
	   * Sets the class name to use when creating the tooltip.
	   *
	   * @param className {String} The class name.
	   * @returns {Tooltip} This.
	   */
	  withClassName(className) {
	    this.options.className = className;
	    return this;
	  }

	  /**
	   * Set data-set name to pull the tooltip text from.
	   *
	   * @param {string} name The data-set name.
	   * @returns {Tooltip} This.
	   */
	  withDataName(name) {
	    this.options.dataName = name;
	    return this;
	  }

	  /**
	   * Set more than one option at a time by providing a map of key value pairs. This is considered an advanced
	   * method to set options on the widget. The caller needs to know what properties are valid in the options object.
	   *
	   * @param {Object} options Key value pair of configuration options.
	   * @returns {Tooltip} This.
	   */
	  withOptions(options) {
	    if (!Utils.isDefined(options)) {
	      return this;
	    }

	    for (let option in options) {
	      if (options.hasOwnProperty(option)) {
	        this.options[option] = options[option];
	      }
	    }
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Handles the mouse enter event to show the tooltip.
	   *
	   * @private
	   */
	  _handleMouseEnter() {
	    this.show();
	  }

	  /**
	   * Handles the mouse exit event to hide the tooltip.
	   *
	   * @private
	   */
	  _handleMouseLeave() {
	    this.hide();
	  }

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      additionalClasses: null,
	      className: 'prime-tooltip',
	      dataName: 'tooltip'
	    };

	    const userOptions = Utils.dataSetToOptions(this.element);
	    for (let option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }
	}

	PrimeDocument.onReady(function() {
	  // Fix browser issues with tooltips sticking around on back-button navigation
	  PrimeWindow.addEventListener('beforeunload', function() {
	    if (Tooltip.open.length > 0) {
	      Tooltip.open.forEach(function(t) {
	        t.removeFromDOM();
	      });
	    }
	  });
	});

	/*
	 * Copyright (c) 2016-2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class TreeView {
	  /**
	   * Constructs a new TreeView object for the given element.
	   *
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element for the TreeView widget.
	   * @constructor
	   */
	  constructor(element) {
	    Utils.bindAll(this);
	    this.element = PrimeElement.wrap(element);
	    this._setInitialOptions();
	  }

	  /**
	   * Initializes the element by traverse its children to find all of the anchor tags with the folder-toggle class (or
	   * whatever you set the class to).
	   *
	   * @returns {TreeView} This.
	   */
	  initialize() {
	    this.element.query('a.' + this.options.folderToggleClassName).each(function(e) {
	      e.addEventListener('click', this._handleClick);
	    }.bind(this));
	    return this;
	  }

	  /**
	   * Sets the folder toggle class name.
	   *
	   * @param className {String} The class name.
	   * @returns {TreeView} This.
	   */
	  withFolderToggleClassName(className) {
	    this.options.folderToggleClassName = className;
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  // noinspection JSMethodCanBeStatic
	  /**
	   * Handles the click event.
	   * @private
	   */
	  _handleClick(event) {
	    Utils.stopEvent(event);
	    const a = PrimeElement.wrap(event.target);
	    const li = a.getParent();
	    if (a.hasClass('open')) {
	      a.removeClass('open');
	      li.removeClass('open');
	    } else {
	      a.addClass('open');
	      li.addClass('open');
	    }
	  }

	  /**
	   * Set the initial options for this widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      folderToggleClassName: 'prime-folder-toggle'
	    };

	    const userOptions = Utils.dataSetToOptions(this.element);
	    for (const option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }
	}

	/*
	 * Copyright (c) 2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */




	var Widgets = Object.freeze({
		AJAXDialog: AJAXDialog,
		DateTimePicker: DateTimePicker,
		Dismissable: Dismissable,
		Draggable: Draggable,
		HTMLDialog: HTMLDialog,
		InProgress: InProgress,
		MultipleSelect: MultipleSelect,
		Overlay: Overlay,
		Searcher: Searcher,
		SideMenu: SideMenu,
		SplitButton: SplitButton,
		Table: Table,
		Tabs: Tabs,
		Tooltip: Tooltip,
		Touchable: Touchable,
		TreeView: TreeView
	});

	/*
	 * Copyright (c) 2012-2018, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class BaseTransition {
	  /**
	   * Constructs a BaseTransition for the given element.
	   *
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element the effect will be applied to.
	   * @param {number} endValue The end value for the transition.
	   * @constructor
	   */
	  constructor(element, endValue) {
	    Utils.bindAll(this);
	    this.element = PrimeElement.wrap(element);
	    this.duration = 1000;
	    this.endFunction = null;
	    this.endValue = endValue;
	    this.iterations = 20;
	  }

	  /**
	   * Sets the function that is called when the effect has completed.
	   *
	   * @param {Function} endFunction The function that is called when the effect is completed.
	   * @returns {BaseTransition} This Effect.
	   */
	  withEndFunction(endFunction) {
	    this.endFunction = endFunction;
	    return this;
	  }

	  /**
	   * Sets the duration of the fade-out effect.
	   *
	   * @param {number} duration The duration in milliseconds.
	   * @returns {BaseTransition} This Effect.
	   */
	  withDuration(duration) {
	    if (duration < 100) {
	      throw new TypeError('Duration should be greater than 100 milliseconds or it won\'t really be noticeable');
	    }

	    this.duration = duration;
	    return this;
	  }

	  /*
	   * Protected functions
	   */

	  /**
	   * Changes an integer style property of the Element iteratively over a given period of time from one value to another
	   * value.
	   *
	   * @protected
	   * @param {Function} getFunction The function on the element to call to get the current value for the transition.
	   * @param {Function} setFunction The function on the element to call to set the new value for the transition.
	   */
	  _changeNumberStyleIteratively(getFunction, setFunction) {
	    let currentValue = getFunction.call(this.element);
	    const step = Math.abs(this.endValue - currentValue) / this.iterations;

	    // Close around ourselves
	    const self = this;
	    const stepFunction = function(last) {
	      if (last) {
	        currentValue = self.endValue;
	      } else {
	        if (currentValue < self.endValue) {
	          currentValue += step;
	        } else {
	          currentValue -= step;
	        }
	      }

	      setFunction.call(self.element, currentValue);
	    };

	    Utils.callIteratively(this.duration, this.iterations, stepFunction, this._internalEndFunction);
	  }

	  /* ===================================================================================================================
	   * Private Methods
	   * ===================================================================================================================*/

	  /**
	   * Handles the call back at the end.
	   *
	   * @private
	   */
	  _internalEndFunction() {
	    this._subclassEndFunction(this);

	    if (this.endFunction) {
	      this.endFunction(this);
	    }
	  }

	  /**
	   * Virtual function stub
	   *
	   * @private
	   */
	  _subclassEndFunction() {
	  }
	}

	class Fade extends BaseTransition {
	  /**
	   * Constructs a new Fade for the given element. The fade effect uses the CSS opacity style and supports the IE alpha
	   * style. The duration defaults to 1000 milliseconds (1 second). This changes the opacity over the duration from 1.0 to
	   * 0.0. At the end, this hides the element so that it doesn't take up any space.
	   *
	   * @constructor
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element to fade out.
	   */
	  constructor(element) {
	    super(element, 0.0);
	  }

	  /**
	   * Internal call back at the end of the transition. This hides the element so it doesn't take up space.
	   *
	   * @override
	   * @private
	   */
	  _subclassEndFunction() {
	    this.element.hide();
	  }

	  /**
	   * Executes the fade effect on the element using the opacity style.
	   */
	  go() {
	    this._changeNumberStyleIteratively(this.element.getOpacity, this.element.setOpacity);
	  }
	}

	class Appear extends BaseTransition {
	  /**
	   * Constructs a new Appear for the given element. The appear effect uses the CSS opacity style and supports the IE
	   * alpha style. The duration defaults to 1000 milliseconds (1 second). This first sets the opacity to 0, then it shows
	   * the element and finally it raises the opacity.
	   *
	   * @constructor
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element to appear.
	   * @param {number} [opacity=1.0] The final opacity to reach when the effect is complete. Defaults to 1.0.
	   */
	  constructor(element, opacity) {
	    if (!Utils.isDefined(opacity)) {
	      opacity = 1.0;
	    }
	    super(element, opacity);
	  }

	  /**
	   * Executes the appear effect on the element using the opacity style.
	   */
	  go() {
	    this.element.setOpacity(0.0);
	    this.element.show();
	    this._changeNumberStyleIteratively(this.element.getOpacity, this.element.setOpacity);
	  }
	}

	class ScrollTo extends BaseTransition {
	  /**
	   * Constructs a new ScrollTo for the given element. The duration defaults to 1000 milliseconds (1 second).
	   *
	   * @param {PrimeElement|Element|EventTarget} element The Prime Element to scroll.
	   * @param {number} position The position to scroll the element to.
	   * @constructor
	   */
	  constructor(element, position) {
	    super(element, position);

	    this.axis = 'vertical';
	  }

	  /**
	   * Set the scroll axis, either 'horizontal' or 'vertical'. Default is 'vertical'.
	   *
	   * @param {string} axis The axis to scroll.
	   * @returns {ScrollTo}
	   */
	  withAxis(axis) {
	    this.axis = axis || 'vertical';
	    return this;
	  }

	  /**
	   * Executes the scroll effect on the element.
	   */
	  go() {
	    if (this.axis === 'vertical') {
	      this._changeNumberStyleIteratively(this.element.getScrollTop, this.element.scrollTo);
	    } else {
	      this._changeNumberStyleIteratively(this.element.getScrollLeft, this.element.scrollLeftTo);
	    }
	  }
	}

	class SlideOpen {
	  /**
	   * Creates a SlideOpen effect on the given element.
	   *
	   * @param {PrimeElement} element The element.
	   * @constructor
	   */
	  constructor(element) {
	    Utils.bindAll(this);

	    this.element = element;
	    if (this.isOpen()) {
	      element.domElement.primeVisibleHeight = element.getHeight();
	    } else {
	      element.setStyle('height', 'auto');
	      element.domElement.primeVisibleHeight = element.getHeight();
	      element.setStyle('height', '0');
	    }

	    this.isTransitioning = false;

	    this._setInitialOptions();
	  }

	  close() {
	    if (!this.isOpen()) {
	      return;
	    }

	    // Set a fixed height instead of auto so that the transition runs, but only if the element is "open"
	    this.element.setHeight(this.element.domElement.primeVisibleHeight);
	    this.isTransitioning = true;

	    // This timeout is needed since the height change takes time to run
	    setTimeout(function() {
	      this.element.setHeight(0);
	      this.element.removeClass('open');
	      this.isTransitioning = false;

	      if (this.options.closeCallback !== null) {
	        this.options.closeCallback();
	      }
	    }.bind(this), this.options.timeout);
	  }

	  isOpen() {
	    return this.element.getHeight() !== 0 || this.element.hasClass('open');
	  }

	  open() {
	    if (this.isOpen()) {
	      return;
	    }

	    this.element.setHeight(this.element.domElement.primeVisibleHeight);
	    this.isTransitioning = true;

	    setTimeout(function() {
	      this.element.setHeight('auto');
	      this.element.addClass('open');
	      this.isTransitioning = false;

	      if (this.options.openCallback !== null) {
	        this.options.openCallback();
	      }
	    }.bind(this), this.options.timeout);
	  }

	  toggle() {
	    if (this.isOpen()) {
	      this.close();
	    } else {
	      this.open();
	    }
	  }

	  /**
	   * Set the close callback function.
	   *
	   * @param {?Function} callback The close callback
	   * @returns {SlideOpen} This.
	   */
	  withCloseCallback(callback) {
	    this.options.closeCallback = callback;
	    return this;
	  }

	  /**
	   * Set the open callback function.
	   *
	   * @param {?Function} callback The open callback
	   * @returns {SlideOpen} This.
	   */
	  withOpenCallback(callback) {
	    this.options.openCallback = callback;
	    return this;
	  }

	  /**
	   * Set more than one option at a time by providing a map of key value pairs. This is considered an advanced
	   * method to set options on the widget. The caller needs to know what properties are valid in the options object.
	   *
	   * @param {Object} options Key value pair of configuration options.
	   * @returns {SlideOpen} This.
	   */
	  withOptions(options) {
	    if (!Utils.isDefined(options)) {
	      return this;
	    }

	    for (let option in options) {
	      if (options.hasOwnProperty(option)) {
	        this.options[option] = options[option];
	      }
	    }
	    return this;
	  }

	  /* ===================================================================================================================
	   * Private methods
	   * ===================================================================================================================*/

	  /**
	   * Set the initial options of the widget.
	   * @private
	   */
	  _setInitialOptions() {
	    // Defaults
	    this.options = {
	      openCallback: null,
	      closeCallback: null,
	      timeout: 310
	    };

	    const userOptions = Utils.dataSetToOptions(this.element);
	    for (let option in userOptions) {
	      if (userOptions.hasOwnProperty(option)) {
	        this.options[option] = userOptions[option];
	      }
	    }
	  }
	}




	var Effects = Object.freeze({
		BaseTransition: BaseTransition,
		Fade: Fade,
		Appear: Appear,
		ScrollTo: ScrollTo,
		SlideOpen: SlideOpen
	});

	/*
	 * Copyright (c) 2016-2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class DataQueue {
	  /**
	   * First-In-First-Out Queue implementation modeled after java.util.Deque interface.
	   *
	   * @constructor
	   */
	  constructor() {
	    Utils.bindAll(this);
	    this._elements = {};
	    this._head = 0;
	    this._tail = 0;
	  }

	  /**
	   * Add the element to the head of the queue.
	   *
	   * @param {Object} element An object to store in the queue.
	   * @returns {DataQueue} This Element.
	   */
	  add(element) {
	    this._elements[this._head] = element;
	    this._head++;

	    return this;
	  }

	  /**
	   * Return true if the queue is empty.
	   *
	   * @returns {boolean} True if the queue is empty, false if not.
	   */
	  isEmpty() {
	    return this._head === this._tail;
	  }

	  /**
	   * Return but do not remove the tail of the queue. This is the oldest element in the queue.
	   *
	   * @returns {Object} The object at the tail of the queue, or null if empty.
	   */
	  peek() {
	    if (this.isEmpty()) {
	      return null;
	    }

	    return this._elements[this._tail];
	  }

	  /**
	   * Return and remove the tail of the queue. This is the oldest element in the queue.
	   *
	   * @returns {Object} the object at the tail of the queue, or null if the queue is empty.
	   */
	  poll() {
	    if (this.isEmpty()) {
	      return null;
	    }

	    const object = this._elements[this._tail];
	    delete this._elements[this._tail];
	    this._tail++;

	    // The cursor should not go off the end of the queue
	    if (this._cursor < this._tail) {
	      this._cursor = this._tail;
	    }

	    return object;
	  }

	  /**
	   * Return the size of the queue.
	   *
	   * @returns {Number} The size of the queue.
	   */
	  size() {
	    return this._head - this._tail;
	  }

	}

	/*
	 * Copyright (c) 2013-2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */
	class Template {
	  /**
	   * A Javascript Object that can serve to generate Prime.Document.Element from a source string and optional parameters.
	   *
	   * @constructor
	   * @param {string} template The String that defines the source of the template.
	   */
	  constructor(template) {
	    Utils.bindAll(this);
	    this.init(template);
	  }

	  init(template) {
	    this.template = template;
	  }

	  /**
	   * Generates a String from the given parameterHash.  Provide a hash of String keys to values.
	   * Keys can be regular text strings, in which case it will look for and replace #{key} as with the value.  You can
	   * also make the key a String "/key/", which will be converted to a Regex and run.
	   *
	   * For the value you can provide a straight up String, int, etc, or you can provide a function which will be called
	   * to provide the value
	   *
	   * @param {Object} parameters An object that contains the parameters for the template to replace.
	   * @returns {string} The result of executing the template.
	   */
	  generate(parameters) {
	    parameters = Utils.isDefined(parameters) ? parameters : {};
	    let templateCopy = String(this.template);
	    for (let key in parameters) {
	      if (parameters.hasOwnProperty(key)) {
	        const value = parameters[key];
	        let expressedValue;
	        if (typeof(value) === 'function') {
	          expressedValue = value();
	        } else {
	          expressedValue = value;
	        }

	        if (key.indexOf('/') === 0 && key.lastIndexOf('/') === key.length - 1) {
	          templateCopy = templateCopy.replace(new RegExp(key.substring(1, key.length - 1), "g"), expressedValue);
	        } else {
	          const expressedKey = "#{" + key + "}";
	          while (templateCopy.indexOf(expressedKey) !== -1) {
	            templateCopy = templateCopy.replace(expressedKey, expressedValue);
	          }
	        }
	      }
	    }

	    return templateCopy;
	  }

	  /**
	   * Calls to generate and then appends the resulting value to the inner HTML of the provided primeElement.
	   *
	   * @param {PrimeElement} primeElement The prime Element instance to append the result of executing the template to.
	   * @param {Object} parameters An object that contains the parameters for the template to replace.
	   */
	  appendTo(primeElement, parameters) {
	    if (Utils.isDefined(primeElement)) {
	      primeElement.setHTML(primeElement.getHTML() + this.generate(parameters));
	    } else {
	      throw new TypeError('Please supply an element to append to');
	    }
	  }

	  /**
	   * Calls to generate and then inserts the resulting elements into the dom before the primeElement
	   *
	   * @param {PrimeElement} primeElement The prime Element instance to insert the result of executing the template before.
	   * @param {Object} parameters An object that contains the parameters for the template to replace.
	   */
	  insertBefore(primeElement, parameters) {
	    if (Utils.isDefined(primeElement)) {
	      const holder = document.createElement('div');
	      holder.innerHTML = this.generate(parameters);
	      new PrimeElement(holder.children[0]).insertBefore(primeElement);
	    } else {
	      throw new TypeError('Please supply an element to append to');
	    }
	  }

	  /**
	   * Calls to generate and then inserts the resulting elements into the dom after the primeElement
	   *
	   * @param {PrimeElement} primeElement The prime Element instance to insert the result of executing the template after.
	   * @param {Object} parameters An object that contains the parameters for the template to replace.
	   */
	  insertAfter(primeElement, parameters) {
	    if (Utils.isDefined(primeElement)) {
	      const holder = document.createElement('div');
	      holder.innerHTML = this.generate(parameters);
	      new PrimeElement(holder.children[0]).insertAfter(primeElement);
	    } else {
	      throw new TypeError('Please supply an element to append to');
	    }
	  }
	}

	/*
	 * Copyright (c) 2017, Inversoft Inc., All Rights Reserved
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing,
	 * software distributed under the License is distributed on an
	 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 * either express or implied. See the License for the specific
	 * language governing permissions and limitations under the License.
	 */

	// Do any polyfill imports here for backwards compatibility
	const Ajax = {
	  Request: PrimeRequest
	};

	const Data = {
	  Queue: DataQueue
	};

	exports.Effects = Effects;
	exports.Widgets = Widgets;
	exports.Ajax = Ajax;
	exports.Data = Data;
	exports.Browser = Browser;
	exports.Events = Events;
	exports.Date = PrimeDate;
	exports.Document = PrimeDocument;
	exports.Storage = PrimeStorage;
	exports.Window = PrimeWindow;
	exports.Template = Template;
	exports.Utils = Utils;

	return exports;

}({}));
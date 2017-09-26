(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.windowbar = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
var EventEmitter = require('events');
var fs = require('fs');
var path = require('path');
var defaultCss = require('defaultcss');
var domify = require('domify');
var classes = require('component-classes');

var ALT = 18;

var html = function(s = ''){
	if (s === 'mac'){
		return `<div class="windowbar wb-mac"><div class="windowbar-controls"><div class="windowbar-close"><svg x="0px" y="0px" viewBox="0 0 6 6"><polygon fill="#860006" points="6,1 6,0 5,0 3,2 1,0 0,0 0,1 2,3 0,5 0,6 1,6 3,4 5,6 6,6 6,5 4,3"></polygon></svg></div><div class="windowbar-minimize"><svg x="0px" y="0px" viewBox="0 0 7 2"><rect fill="#9d5615" width="7" height="2"></rect></svg></div><div class="windowbar-maximize"><svg class="fullscreen-svg" x="0px" y="0px" viewBox="0 0 6 6"><path fill="#006413" d="M0,1.4v3.8c0.4,0,0.8,0.3,0.8,0.8h3.8L0,1.4z"/><path fill="#006413" d="M6,4.6V0.8C5.6,0.8,5.2,0.4,5.2,0H1.4L6,4.6z"/></svg><svg class="exit-fullscreen-svg" x="0px" y="0px" viewBox="0 0 6 6"><path fill="#006413" d="M3,0v2.5c0.3,0,0.5,0.2,0.5,0.5H6L3,0z"/><path fill="#006413" d="M3,6V3.5C2.7,3.5,2.5,3.3,2.5,3H0L3,6z"/></svg><svg class="maximize-svg" x="0px" y="0px" viewBox="0 0 7.9 7.9"><polygon fill="#006413" points="7.9,4.5 7.9,3.4 4.5,3.4 4.5,0 3.4,0 3.4,3.4 0,3.4 0,4.5 3.4,4.5 3.4,7.9 4.5,7.9 4.5,4.5"></polygon></svg></div></div></div>`;
	} else if (s === 'win') {
		return `<div class="windowbar wb-win"><div class="windowbar-controls"><div class="windowbar-minimize"><svg x="0px" y="0px" viewBox="0 0 10 1"><rect fill="#000000" width="10" height="1"></rect></svg></div><div class="windowbar-maximize"><svg class="maximize-svg" x="0px" y="0px" viewBox="0 0 10 10"><path fill="#000000" d="M 0 0 L 0 10 L 10 10 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 9 L 1 9 L 1 1 z "/></svg><svg class="unmaximize-svg" x="0px" y="0px" viewBox="0 0 10 10"><mask id="Mask"><rect fill="#FFFFFF" width="10" height="10"></rect><path fill="#000000" d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z"/><path fill="#000000" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z"/></mask><path fill="#000000" d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z" mask="url(#Mask)"/></svg></div><div class="windowbar-close"><svg x="0px" y="0px" viewBox="0 0 12 12"><polygon fill="#000000" points="12,1 11,0 6,5 1,0 0,1 5,6 0,11 1,12 6,7 11,12 12,11 7,6"></polygon></svg></div></div></div>`;
	}
}
var css = function(){
	return `.windowbar{display:flex;box-sizing:content-box}.windowbar *{box-sizing:inherit}.windowbar::after{content:' ';display:table;clear:both}.windowbar.draggable{-webkit-app-region:drag}.windowbar.draggable .windowbar-minimize,.windowbar.draggable .windowbar-maximize,.windowbar.draggable .windowbar-close{-webkit-app-region:no-drag}.windowbar .windowbar-controls::after{content:' ';display:table;clear:both}.windowbar.wb-mac{align-items:center;justify-content:space-between;padding:0 3px}.windowbar.wb-mac:not(.transparent){background-color:#e5e5e5}.windowbar.wb-mac.unfocused:not(.transparent){background-color:#f6f6f6}.windowbar.wb-mac .windowbar-controls:hover svg{opacity:1 !important}.windowbar.wb-mac.alt:not(.fullscreen) svg.fullscreen-svg{display:none}.windowbar.wb-mac.alt:not(.fullscreen) svg.maximize-svg{display:block !important}.windowbar.wb-mac.fullscreen svg.fullscreen-svg{display:none}.windowbar.wb-mac.fullscreen svg.exit-fullscreen-svg{display:block !important}.windowbar.wb-mac .windowbar-close,.windowbar.wb-mac .windowbar-minimize,.windowbar.wb-mac .windowbar-maximize{float:left;width:10px;height:10px;border-radius:50%;margin:6px 4px;line-height:0}.windowbar.wb-mac .windowbar-close{border:1px solid #e94343;background-color:#ff5d5b;margin-left:6px}.windowbar.wb-mac .windowbar-close:active{border-color:#b43737;background-color:#c64845}.windowbar.wb-mac .windowbar-close svg{width:6px;height:6px;margin-top:2px;margin-left:2px;opacity:0}.windowbar.wb-mac .windowbar-minimize{border:1px solid #e5a03a;background-color:#ffbc45}.windowbar.wb-mac .windowbar-minimize:active{border-color:#b07b2e;background-color:#c38e34}.windowbar.wb-mac .windowbar-minimize svg{width:8px;height:8px;margin-top:1px;margin-left:1px;opacity:0}.windowbar.wb-mac .windowbar-maximize{border:1px solid #13ad3e;background-color:#00c94f}.windowbar.wb-mac .windowbar-maximize:active{border-color:#138532;background-color:#009a3c}.windowbar.wb-mac .windowbar-maximize svg.fullscreen-svg{width:6px;height:6px;margin-top:2px;margin-left:2px;opacity:0}.windowbar.wb-mac .windowbar-maximize svg.exit-fullscreen-svg{width:10px;height:10px;margin-top:0;margin-left:0;opacity:0;display:none}.windowbar.wb-mac .windowbar-maximize svg.maximize-svg{width:8px;height:8px;margin-top:1px;margin-left:1px;opacity:0;display:none}.windowbar.wb-mac.unfocused .windowbar-controls:not(:hover)>*{background-color:#dcdcdc;border-color:#d1d1d1}.windowbar.wb-win{justify-content:flex-end;padding:0}.windowbar.wb-win:not(.transparent){background-color:#fff}.windowbar.wb-win.unfocused .windowbar-controls:not(:hover) svg{opacity:60%}.windowbar.wb-win .windowbar-minimize,.windowbar.wb-win .windowbar-maximize,.windowbar.wb-win .windowbar-close{float:left;width:45px;height:29px;margin:0 0 1px 1px;text-align:center;line-height:29px;-webkit-transition:background-color .2s;-moz-transition:background-color .2s;-ms-transition:background-color .2s;-o-transition:background-color .2s;transition:background-color .2s}.windowbar.wb-win .windowbar-minimize svg,.windowbar.wb-win .windowbar-maximize svg,.windowbar.wb-win .windowbar-close svg{width:10px;height:10px}.windowbar.wb-win .windowbar-close svg polygon{-webkit-transition:fill .2s;-moz-transition:fill .2s;-ms-transition:fill .2s;-o-transition:fill .2s;transition:fill .2s}.windowbar.wb-win.fullscreen .windowbar-minimize,.windowbar.wb-win.fullscreen .windowbar-maximize,.windowbar.wb-win.fullscreen .windowbar-close{height:21px;line-height:21px}.windowbar.wb-win:not(.fullscreen) .windowbar-maximize svg.unmaximize-svg{display:none}.windowbar.wb-win.fullscreen .windowbar-maximize svg.maximize-svg{display:none}.windowbar.wb-win .windowbar-minimize:hover,.windowbar.wb-win .windowbar-maximize:hover{background-color:rgba(127,127,127,0.2)}.windowbar.wb-win .windowbar-close:hover{background-color:#E81123}.windowbar.wb-win .windowbar-close:hover svg polygon{fill:#fff}.windowbar.wb-win.dark:not(.transparent){background-color:#1f1f1f}.windowbar.wb-win.dark svg>rect,.windowbar.wb-win.dark svg>polygon,.windowbar.wb-win.dark svg>path{fill:#fff}`;
}

class Windowbar extends EventEmitter {
	constructor(options = {}){
		super();
		// Get Options
		this.options = {};
		this.options.style = options.style;
		this.options.transparent = options.transparent;
		this.options.dark = options.dark;
		this.options.draggable = "draggable" in options ? options.draggable : true;
		this.options.dblClickable = "dblClickable" in options ? options.dblClickable : true;
		
		// Set proper style
		if (!['mac','win','generic'].includes(this.options.style)){
			if (this.options.style === 'darwin' || process.platform === 'darwin') this.options.style = 'mac';
			else if (this.options.style === 'win32' || process.platform === 'win32') this.options.style = 'win';
			else this.options.style = 'generic';
		}
		
		// Create Windowbar element
		this.element = domify(html(this.options.style), document);
		
		// Register buttons
		this.minimizeButton = this.element.querySelector('.windowbar-minimize');
		this.maximizeButton = this.element.querySelector('.windowbar-maximize');
		this.closeButton = this.element.querySelector('.windowbar-close');
		
		// Draggable
		if (this.options.draggable) classes(this.element).add('draggable');
		// Transparent
		if (this.options.transparent) classes(this.element).add('transparent');
		// Dark mode
		if (this.options.dark) classes(this.element).add('dark');
		
		// Add click events
		this.element.addEventListener('dblclick', event => this.onDblClick(event));
		this.minimizeButton.addEventListener('click', event => this.clickMinimize(event));
		this.maximizeButton.addEventListener('click', event => this.clickMaximize(event));
		this.closeButton.addEventListener('click', event => this.clickClose(event));
		
		// Show maximize svg while holding alt (mac only)
		if (this.options.style === 'mac'){
			var self = this;
			window.addEventListener('keydown', function(e){
				if(e.keyCode === ALT) classes(self.element).add('alt');
			});
			window.addEventListener('keyup', function(e){
				if(e.keyCode === ALT) classes(self.element).remove('alt');
			});
		}
	}
	
	clickClose(e){ this.emit('close', e); };
	
	clickMinimize(e){ this.emit('minimize', e); };
	
	clickMaximize(e){
		if (this.options.style === 'mac'){
			if (e.altKey && !classes(this.element).has('fullscreen')) this.emit('maximize', e);
			else {
				classes(this.element).toggle('fullscreen');
				this.emit('fullscreen', e);
			}
		} else {
			classes(this.element).toggle('fullscreen');
			this.emit('maximize', e);
		}
	};
	
	onDblClick(e){
		e.preventDefault;
		if (this.options.dblClickable && !(this.minimizeButton.contains(e.target) || this.maximizeButton.contains(e.target) || this.closeButton.contains(e.target))){
			this.clickMaximize(e);
			console.log('dblclick', e);
		}
	};
	
	appendTo(context = document.body){
		defaultCss('windowbar', css());
		context.appendChild(this.element);
		return this;
	};
	
	destroy(){
		parent.removeChild(this.element);
		return this;
	};
}

module.exports = Windowbar;

}).call(this,require('_process'))
},{"_process":8,"component-classes":2,"defaultcss":4,"domify":5,"events":7,"fs":6,"path":9}],2:[function(require,module,exports){
/**
 * Module dependencies.
 */

try {
  var index = require('indexof');
} catch (err) {
  var index = require('component-indexof');
}

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name, force){
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

},{"component-indexof":3,"indexof":3}],3:[function(require,module,exports){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],4:[function(require,module,exports){
/* jshint node: true */
'use strict';

/**
  # defaultcss

  A very simple module for creating a little bit of defaultcss.  This is
  really useful if you are creating a small JS widget that you want to be
  completely stylable by the application implementer but would also like it
  to look "kind of ok" if someone want to have a quick play.

  ## How it Works

  The provided css text is injected into the HTML document within the document
  `<head>` prior to any other `<link>` or `<style>` tags.  This ensures that
  any definitions that are made within your provided CSS have ample
  opportunity to be overridden by user defined CSS.

  ## Example Usage

  <<< examples/widget.js

  ## Reference

  ### defaultcss

  ```
  defaultcss(label, csstext)
  ```

  Create a new default `style` element and use the provided `label` to
  generate an id for the element "%label%_defaultstyle".  If an existing
  element with that id is found, then do nothing.

  If not, then create the new element and use the provided `csstext` as
  `innerText` for th element.
**/
module.exports = function(label, text) {
  var styleId = label + '_defaultstyle';

  // look for a DOM element with the style id
  var styleEl = document.getElementById(styleId);

  // find the first <link> or <style> tag within the document head
  var firstStyleDef = document.querySelector('link[rel="stylesheet"],style');

  // if we can find a DOM element with that id, then do nothing as a default
  // style has already been applied
  if (styleEl) {
    return styleEl;
  }

  // otherwise, create a style element
  styleEl = document.createElement('style');
  styleEl.innerHTML = text;

  // insert the style element, in order or preference
  // 1. before the first style related element in the page
  if (firstStyleDef) {
    firstStyleDef.parentNode.insertBefore(styleEl, firstStyleDef);
  }
  // 2. to the end of the HEAD
  else if (document.head) {
    document.head.appendChild(styleEl);
  }
  // 3. as the first element in the body
  else if (document.body && document.body.childNodes.length > 0) {
    document.body.insertBefore(styleEl, document.body.childNodes[0]);
  }
  // 4. in the body
  else if (document.body) {
    document.body.appendChild(styleEl);
  }

  return styleEl;
};

},{}],5:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],8:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],9:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":8}]},{},[1])(1)
});
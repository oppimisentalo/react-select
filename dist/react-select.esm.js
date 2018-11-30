import raf from 'raf';
import React, { Component, PureComponent } from 'react';
import { css, injectGlobal } from 'emotion';
import { createPortal, findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import AutosizeInput from 'react-input-autosize';
import memoizeOne from 'memoize-one';
import { Transition, TransitionGroup } from 'react-transition-group';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// ==============================
// NO OP
// ==============================

var noop = function noop() {};

// ==============================
// Class Name Prefixer
// ==============================

/**
 String representation of component state for styling with class names.

 Expects an array of strings OR a string/object pair:
 - className(['comp', 'comp-arg', 'comp-arg-2'])
   @returns 'react-select__comp react-select__comp-arg react-select__comp-arg-2'
 - className('comp', { some: true, state: false })
   @returns 'react-select__comp react-select__comp--some'
*/
function applyPrefixToName(prefix, name) {
  if (!name) {
    return prefix;
  } else if (name[0] === '-') {
    return prefix + name;
  } else {
    return prefix + '__' + name;
  }
}

function classNames(prefix, cssKey, state, className) {
  var arr = [cssKey, className];
  if (state && prefix) {
    for (var key in state) {
      if (state.hasOwnProperty(key) && state[key]) {
        arr.push('' + applyPrefixToName(prefix, key));
      }
    }
  }

  return arr.filter(function (i) {
    return i;
  }).map(function (i) {
    return String(i).trim();
  }).join(' ');
}
// ==============================
// Clean Value
// ==============================

var cleanValue = function cleanValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) return [value];
  return [];
};

// ==============================
// Handle Input Change
// ==============================

function handleInputChange(inputValue, actionMeta, onInputChange) {
  if (onInputChange) {
    var newValue = onInputChange(inputValue, actionMeta);
    if (typeof newValue === 'string') return newValue;
  }
  return inputValue;
}

// ==============================
// Scroll Helpers
// ==============================

function isDocumentElement(el) {
  return [document.documentElement, document.body, window].indexOf(el) > -1;
}

// Normalized scrollTo & scrollTop
// ------------------------------

function getScrollTop(el) {
  if (isDocumentElement(el)) {
    return window.pageYOffset;
  }
  return el.scrollTop;
}

function scrollTo(el, top) {
  // with a scroll distance, we perform scroll on the element
  if (isDocumentElement(el)) {
    window.scrollTo(0, top);
    return;
  }

  el.scrollTop = top;
}

// Get Scroll Parent
// ------------------------------

function getScrollParent(element) {
  var style = getComputedStyle(element);
  var excludeStaticParent = style.position === 'absolute';
  var overflowRx = /(auto|scroll)/;
  var docEl = document.documentElement; // suck it, flow...

  if (style.position === 'fixed') return docEl;

  for (var parent = element; parent = parent.parentElement;) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (overflowRx.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }
  }

  return docEl;
}

// Animated Scroll To
// ------------------------------

/**
  @param t: time (elapsed)
  @param b: initial value
  @param c: amount of change
  @param d: duration
*/
function easeOutCubic(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}

function animatedScrollTo(element, to) {
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;

  var start = getScrollTop(element);
  var change = to - start;
  var increment = 10;
  var currentTime = 0;

  function animateScroll() {
    currentTime += increment;
    var val = easeOutCubic(currentTime, start, change, duration);
    scrollTo(element, val);
    if (currentTime < duration) {
      raf(animateScroll);
    } else {
      callback(element);
    }
  }
  animateScroll();
}

// Scroll Into View
// ------------------------------

function scrollIntoView(menuEl, focusedEl) {
  var menuRect = menuEl.getBoundingClientRect();
  var focusedRect = focusedEl.getBoundingClientRect();
  var overScroll = focusedEl.offsetHeight / 3;

  if (focusedRect.bottom + overScroll > menuRect.bottom) {
    scrollTo(menuEl, Math.min(focusedEl.offsetTop + focusedEl.clientHeight - menuEl.offsetHeight + overScroll, menuEl.scrollHeight));
  } else if (focusedRect.top - overScroll < menuRect.top) {
    scrollTo(menuEl, Math.max(focusedEl.offsetTop - overScroll, 0));
  }
}

// ==============================
// Get bounding client object
// ==============================

// cannot get keys using array notation with DOMRect
function getBoundingClientObj(element) {
  var rect = element.getBoundingClientRect();
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width
  };
}

// ==============================
// Touch Capability Detector
// ==============================

function isTouchCapable() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
}

// ==============================
// Mobile Device Detector
// ==============================

function isMobileDevice() {
  try {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  } catch (e) {
    return false;
  }
}

// ==============================
// Menu
// ==============================

// Get Menu Placement
// ------------------------------

function getMenuPlacement(_ref) {
  var maxHeight = _ref.maxHeight,
      menuEl = _ref.menuEl,
      minHeight = _ref.minHeight,
      placement = _ref.placement,
      shouldScroll = _ref.shouldScroll,
      isFixedPosition = _ref.isFixedPosition,
      theme = _ref.theme;
  var spacing = theme.spacing;

  var scrollParent = getScrollParent(menuEl);
  var defaultState = { placement: 'bottom', maxHeight: maxHeight };

  // something went wrong, return default state
  if (!menuEl || !menuEl.offsetParent) return defaultState;

  // we can't trust `scrollParent.scrollHeight` --> it may increase when
  // the menu is rendered

  var _scrollParent$getBoun = scrollParent.getBoundingClientRect(),
      scrollHeight = _scrollParent$getBoun.height;

  var _menuEl$getBoundingCl = menuEl.getBoundingClientRect(),
      menuBottom = _menuEl$getBoundingCl.bottom,
      menuHeight = _menuEl$getBoundingCl.height,
      menuTop = _menuEl$getBoundingCl.top;

  // $FlowFixMe function returns above if there's no offsetParent


  var _menuEl$offsetParent$ = menuEl.offsetParent.getBoundingClientRect(),
      containerTop = _menuEl$offsetParent$.top;

  var viewHeight = window.innerHeight;
  var scrollTop = getScrollTop(scrollParent);

  var marginBottom = parseInt(getComputedStyle(menuEl).marginBottom, 10);
  var marginTop = parseInt(getComputedStyle(menuEl).marginTop, 10);
  var viewSpaceAbove = containerTop - marginTop;
  var viewSpaceBelow = viewHeight - menuTop;
  var scrollSpaceAbove = viewSpaceAbove + scrollTop;
  var scrollSpaceBelow = scrollHeight - scrollTop - menuTop;

  var scrollDown = menuBottom - viewHeight + scrollTop + marginBottom;
  var scrollUp = scrollTop + menuTop - marginTop;
  var scrollDuration = 160;

  switch (placement) {
    case 'auto':
    case 'bottom':
      // 1: the menu will fit, do nothing
      if (viewSpaceBelow >= menuHeight) {
        return { placement: 'bottom', maxHeight: maxHeight };
      }

      // 2: the menu will fit, if scrolled
      if (scrollSpaceBelow >= menuHeight && !isFixedPosition) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollDown, scrollDuration);
        }

        return { placement: 'bottom', maxHeight: maxHeight };
      }

      // 3: the menu will fit, if constrained
      if (!isFixedPosition && scrollSpaceBelow >= minHeight || isFixedPosition && viewSpaceBelow >= minHeight) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollDown, scrollDuration);
        }

        // we want to provide as much of the menu as possible to the user,
        // so give them whatever is available below rather than the minHeight.
        var constrainedHeight = isFixedPosition ? viewSpaceBelow - marginBottom : scrollSpaceBelow - marginBottom;

        return {
          placement: 'bottom',
          maxHeight: constrainedHeight
        };
      }

      // 4. Forked beviour when there isn't enough space below

      // AUTO: flip the menu, render above
      if (placement === 'auto' || isFixedPosition) {
        // may need to be constrained after flipping
        var _constrainedHeight = maxHeight;

        if (!isFixedPosition && scrollSpaceAbove >= minHeight || isFixedPosition && viewSpaceAbove >= minHeight) {
          _constrainedHeight = isFixedPosition ? viewSpaceAbove - marginBottom - spacing.controlHeight : scrollSpaceAbove - marginBottom - spacing.controlHeight;
        }

        return { placement: 'top', maxHeight: _constrainedHeight };
      }

      // BOTTOM: allow browser to increase scrollable area and immediately set scroll
      if (placement === 'bottom') {
        scrollTo(scrollParent, scrollDown);
        return { placement: 'bottom', maxHeight: maxHeight };
      }
      break;
    case 'top':
      // 1: the menu will fit, do nothing
      if (viewSpaceAbove >= menuHeight) {
        return { placement: 'top', maxHeight: maxHeight };
      }

      // 2: the menu will fit, if scrolled
      if (scrollSpaceAbove >= menuHeight && !isFixedPosition) {
        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollUp, scrollDuration);
        }

        return { placement: 'top', maxHeight: maxHeight };
      }

      // 3: the menu will fit, if constrained
      if (!isFixedPosition && scrollSpaceAbove >= minHeight || isFixedPosition && viewSpaceAbove >= minHeight) {
        var _constrainedHeight2 = maxHeight;

        // we want to provide as much of the menu as possible to the user,
        // so give them whatever is available below rather than the minHeight.
        if (!isFixedPosition && scrollSpaceAbove >= minHeight || isFixedPosition && viewSpaceAbove >= minHeight) {
          _constrainedHeight2 = isFixedPosition ? viewSpaceAbove - marginTop : scrollSpaceAbove - marginTop;
        }

        if (shouldScroll) {
          animatedScrollTo(scrollParent, scrollUp, scrollDuration);
        }

        return {
          placement: 'top',
          maxHeight: _constrainedHeight2
        };
      }

      // 4. not enough space, the browser WILL NOT increase scrollable area when
      // absolutely positioned element rendered above the viewport (only below).
      // Flip the menu, render below
      return { placement: 'bottom', maxHeight: maxHeight };
    default:
      throw new Error('Invalid placement provided "' + placement + '".');
  }

  // fulfil contract with flow: implicit return value of undefined
  return defaultState;
}

// Menu Component
// ------------------------------

function alignToControl(placement) {
  var placementToCSSProp = { bottom: 'top', top: 'bottom' };
  return placement ? placementToCSSProp[placement] : 'bottom';
}
var coercePlacement = function coercePlacement(p) {
  return p === 'auto' ? 'bottom' : p;
};

var menuCSS = function menuCSS(_ref2) {
  var _ref3;

  var placement = _ref2.placement,
      _ref2$theme = _ref2.theme,
      borderRadius = _ref2$theme.borderRadius,
      spacing = _ref2$theme.spacing,
      colors = _ref2$theme.colors;
  return _ref3 = {}, defineProperty(_ref3, alignToControl(placement), '100%'), defineProperty(_ref3, 'backgroundColor', colors.neutral0), defineProperty(_ref3, 'borderRadius', borderRadius), defineProperty(_ref3, 'boxShadow', '0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)'), defineProperty(_ref3, 'marginBottom', spacing.menuGutter), defineProperty(_ref3, 'marginTop', spacing.menuGutter), defineProperty(_ref3, 'position', 'absolute'), defineProperty(_ref3, 'width', '100%'), defineProperty(_ref3, 'zIndex', 1), _ref3;
};

// NOTE: internal only
var MenuPlacer = function (_Component) {
  inherits(MenuPlacer, _Component);

  function MenuPlacer() {
    var _ref4;

    var _temp, _this, _ret;

    classCallCheck(this, MenuPlacer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref4 = MenuPlacer.__proto__ || Object.getPrototypeOf(MenuPlacer)).call.apply(_ref4, [this].concat(args))), _this), _this.state = {
      maxHeight: _this.props.maxMenuHeight,
      placement: null
    }, _this.getPlacement = function (ref) {
      var _this$props = _this.props,
          minMenuHeight = _this$props.minMenuHeight,
          maxMenuHeight = _this$props.maxMenuHeight,
          menuPlacement = _this$props.menuPlacement,
          menuPosition = _this$props.menuPosition,
          menuShouldScrollIntoView = _this$props.menuShouldScrollIntoView,
          theme = _this$props.theme;
      var getPortalPlacement = _this.context.getPortalPlacement;


      if (!ref) return;

      // DO NOT scroll if position is fixed
      var isFixedPosition = menuPosition === 'fixed';
      var shouldScroll = menuShouldScrollIntoView && !isFixedPosition;

      var state = getMenuPlacement({
        maxHeight: maxMenuHeight,
        menuEl: ref,
        minHeight: minMenuHeight,
        placement: menuPlacement,
        shouldScroll: shouldScroll,
        isFixedPosition: isFixedPosition,
        theme: theme
      });

      if (getPortalPlacement) getPortalPlacement(state);

      _this.setState(state);
    }, _this.getUpdatedProps = function () {
      var menuPlacement = _this.props.menuPlacement;

      var placement = _this.state.placement || coercePlacement(menuPlacement);

      return _extends({}, _this.props, { placement: placement, maxHeight: _this.state.maxHeight });
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(MenuPlacer, [{
    key: 'render',
    value: function render() {
      var children = this.props.children;


      return children({
        ref: this.getPlacement,
        placerProps: this.getUpdatedProps()
      });
    }
  }]);
  return MenuPlacer;
}(Component);

MenuPlacer.contextTypes = {
  getPortalPlacement: PropTypes.func
};
var Menu = function Menu(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerRef = props.innerRef,
      innerProps = props.innerProps;

  var cn = cx( /*#__PURE__*/css(getStyles('menu', props), 'label:cn;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lbnUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBOFRnQiIsImZpbGUiOiJNZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBSZWFjdCwge1xuICBDb21wb25lbnQsXG4gIHR5cGUgRWxlbWVudCBhcyBSZWFjdEVsZW1lbnQsXG4gIHR5cGUgRWxlbWVudFJlZixcbiAgdHlwZSBOb2RlLFxufSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjc3MgfSBmcm9tICdlbW90aW9uJztcbmltcG9ydCB7IGNyZWF0ZVBvcnRhbCB9IGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge1xuICBhbmltYXRlZFNjcm9sbFRvLFxuICBnZXRCb3VuZGluZ0NsaWVudE9iaixcbiAgdHlwZSBSZWN0VHlwZSxcbiAgZ2V0U2Nyb2xsUGFyZW50LFxuICBnZXRTY3JvbGxUb3AsXG4gIHNjcm9sbFRvLFxufSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgdHlwZSB7XG4gIElubmVyUmVmLFxuICBNZW51UGxhY2VtZW50LFxuICBNZW51UG9zaXRpb24sXG4gIENvbW1vblByb3BzLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFRoZW1lIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1lbnVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBHZXQgTWVudSBQbGFjZW1lbnRcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG50eXBlIE1lbnVTdGF0ZSA9IHtcbiAgcGxhY2VtZW50OiAnYm90dG9tJyB8ICd0b3AnIHwgbnVsbCxcbiAgbWF4SGVpZ2h0OiBudW1iZXIsXG59O1xudHlwZSBQbGFjZW1lbnRBcmdzID0ge1xuICBtYXhIZWlnaHQ6IG51bWJlcixcbiAgbWVudUVsOiBFbGVtZW50UmVmPCo+LFxuICBtaW5IZWlnaHQ6IG51bWJlcixcbiAgcGxhY2VtZW50OiAnYm90dG9tJyB8ICd0b3AnIHwgJ2F1dG8nLFxuICBzaG91bGRTY3JvbGw6IGJvb2xlYW4sXG4gIGlzRml4ZWRQb3NpdGlvbjogYm9vbGVhbixcbiAgdGhlbWU6IFRoZW1lLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1lbnVQbGFjZW1lbnQoe1xuICBtYXhIZWlnaHQsXG4gIG1lbnVFbCxcbiAgbWluSGVpZ2h0LFxuICBwbGFjZW1lbnQsXG4gIHNob3VsZFNjcm9sbCxcbiAgaXNGaXhlZFBvc2l0aW9uLFxuICB0aGVtZSxcbn06IFBsYWNlbWVudEFyZ3MpOiBNZW51U3RhdGUge1xuICBjb25zdCB7IHNwYWNpbmcgfSA9IHRoZW1lO1xuICBjb25zdCBzY3JvbGxQYXJlbnQgPSBnZXRTY3JvbGxQYXJlbnQobWVudUVsKTtcbiAgY29uc3QgZGVmYXVsdFN0YXRlID0geyBwbGFjZW1lbnQ6ICdib3R0b20nLCBtYXhIZWlnaHQgfTtcblxuICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZywgcmV0dXJuIGRlZmF1bHQgc3RhdGVcbiAgaWYgKCFtZW51RWwgfHwgIW1lbnVFbC5vZmZzZXRQYXJlbnQpIHJldHVybiBkZWZhdWx0U3RhdGU7XG5cbiAgLy8gd2UgY2FuJ3QgdHJ1c3QgYHNjcm9sbFBhcmVudC5zY3JvbGxIZWlnaHRgIC0tPiBpdCBtYXkgaW5jcmVhc2Ugd2hlblxuICAvLyB0aGUgbWVudSBpcyByZW5kZXJlZFxuICBjb25zdCB7IGhlaWdodDogc2Nyb2xsSGVpZ2h0IH0gPSBzY3JvbGxQYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHtcbiAgICBib3R0b206IG1lbnVCb3R0b20sXG4gICAgaGVpZ2h0OiBtZW51SGVpZ2h0LFxuICAgIHRvcDogbWVudVRvcCxcbiAgfSA9IG1lbnVFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAvLyAkRmxvd0ZpeE1lIGZ1bmN0aW9uIHJldHVybnMgYWJvdmUgaWYgdGhlcmUncyBubyBvZmZzZXRQYXJlbnRcbiAgY29uc3QgeyB0b3A6IGNvbnRhaW5lclRvcCB9ID0gbWVudUVsLm9mZnNldFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3Qgdmlld0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY29uc3Qgc2Nyb2xsVG9wID0gZ2V0U2Nyb2xsVG9wKHNjcm9sbFBhcmVudCk7XG5cbiAgY29uc3QgbWFyZ2luQm90dG9tID0gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShtZW51RWwpLm1hcmdpbkJvdHRvbSwgMTApO1xuICBjb25zdCBtYXJnaW5Ub3AgPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG1lbnVFbCkubWFyZ2luVG9wLCAxMCk7XG4gIGNvbnN0IHZpZXdTcGFjZUFib3ZlID0gY29udGFpbmVyVG9wIC0gbWFyZ2luVG9wO1xuICBjb25zdCB2aWV3U3BhY2VCZWxvdyA9IHZpZXdIZWlnaHQgLSBtZW51VG9wO1xuICBjb25zdCBzY3JvbGxTcGFjZUFib3ZlID0gdmlld1NwYWNlQWJvdmUgKyBzY3JvbGxUb3A7XG4gIGNvbnN0IHNjcm9sbFNwYWNlQmVsb3cgPSBzY3JvbGxIZWlnaHQgLSBzY3JvbGxUb3AgLSBtZW51VG9wO1xuXG4gIGNvbnN0IHNjcm9sbERvd24gPSBtZW51Qm90dG9tIC0gdmlld0hlaWdodCArIHNjcm9sbFRvcCArIG1hcmdpbkJvdHRvbTtcbiAgY29uc3Qgc2Nyb2xsVXAgPSBzY3JvbGxUb3AgKyBtZW51VG9wIC0gbWFyZ2luVG9wO1xuICBjb25zdCBzY3JvbGxEdXJhdGlvbiA9IDE2MDtcblxuICBzd2l0Y2ggKHBsYWNlbWVudCkge1xuICAgIGNhc2UgJ2F1dG8nOlxuICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAvLyAxOiB0aGUgbWVudSB3aWxsIGZpdCwgZG8gbm90aGluZ1xuICAgICAgaWYgKHZpZXdTcGFjZUJlbG93ID49IG1lbnVIZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHsgcGxhY2VtZW50OiAnYm90dG9tJywgbWF4SGVpZ2h0IH07XG4gICAgICB9XG5cbiAgICAgIC8vIDI6IHRoZSBtZW51IHdpbGwgZml0LCBpZiBzY3JvbGxlZFxuICAgICAgaWYgKHNjcm9sbFNwYWNlQmVsb3cgPj0gbWVudUhlaWdodCAmJiAhaXNGaXhlZFBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChzaG91bGRTY3JvbGwpIHtcbiAgICAgICAgICBhbmltYXRlZFNjcm9sbFRvKHNjcm9sbFBhcmVudCwgc2Nyb2xsRG93biwgc2Nyb2xsRHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgcGxhY2VtZW50OiAnYm90dG9tJywgbWF4SGVpZ2h0IH07XG4gICAgICB9XG5cbiAgICAgIC8vIDM6IHRoZSBtZW51IHdpbGwgZml0LCBpZiBjb25zdHJhaW5lZFxuICAgICAgaWYgKFxuICAgICAgICAoIWlzRml4ZWRQb3NpdGlvbiAmJiBzY3JvbGxTcGFjZUJlbG93ID49IG1pbkhlaWdodCkgfHxcbiAgICAgICAgKGlzRml4ZWRQb3NpdGlvbiAmJiB2aWV3U3BhY2VCZWxvdyA+PSBtaW5IZWlnaHQpXG4gICAgICApIHtcbiAgICAgICAgaWYgKHNob3VsZFNjcm9sbCkge1xuICAgICAgICAgIGFuaW1hdGVkU2Nyb2xsVG8oc2Nyb2xsUGFyZW50LCBzY3JvbGxEb3duLCBzY3JvbGxEdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZSB3YW50IHRvIHByb3ZpZGUgYXMgbXVjaCBvZiB0aGUgbWVudSBhcyBwb3NzaWJsZSB0byB0aGUgdXNlcixcbiAgICAgICAgLy8gc28gZ2l2ZSB0aGVtIHdoYXRldmVyIGlzIGF2YWlsYWJsZSBiZWxvdyByYXRoZXIgdGhhbiB0aGUgbWluSGVpZ2h0LlxuICAgICAgICBjb25zdCBjb25zdHJhaW5lZEhlaWdodCA9IGlzRml4ZWRQb3NpdGlvblxuICAgICAgICAgID8gdmlld1NwYWNlQmVsb3cgLSBtYXJnaW5Cb3R0b21cbiAgICAgICAgICA6IHNjcm9sbFNwYWNlQmVsb3cgLSBtYXJnaW5Cb3R0b207XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgICAgICAgIG1heEhlaWdodDogY29uc3RyYWluZWRIZWlnaHQsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vIDQuIEZvcmtlZCBiZXZpb3VyIHdoZW4gdGhlcmUgaXNuJ3QgZW5vdWdoIHNwYWNlIGJlbG93XG5cbiAgICAgIC8vIEFVVE86IGZsaXAgdGhlIG1lbnUsIHJlbmRlciBhYm92ZVxuICAgICAgaWYgKHBsYWNlbWVudCA9PT0gJ2F1dG8nIHx8IGlzRml4ZWRQb3NpdGlvbikge1xuICAgICAgICAvLyBtYXkgbmVlZCB0byBiZSBjb25zdHJhaW5lZCBhZnRlciBmbGlwcGluZ1xuICAgICAgICBsZXQgY29uc3RyYWluZWRIZWlnaHQgPSBtYXhIZWlnaHQ7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICghaXNGaXhlZFBvc2l0aW9uICYmIHNjcm9sbFNwYWNlQWJvdmUgPj0gbWluSGVpZ2h0KSB8fFxuICAgICAgICAgIChpc0ZpeGVkUG9zaXRpb24gJiYgdmlld1NwYWNlQWJvdmUgPj0gbWluSGVpZ2h0KVxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdHJhaW5lZEhlaWdodCA9IGlzRml4ZWRQb3NpdGlvblxuICAgICAgICAgICAgPyB2aWV3U3BhY2VBYm92ZSAtIG1hcmdpbkJvdHRvbSAtIHNwYWNpbmcuY29udHJvbEhlaWdodFxuICAgICAgICAgICAgOiBzY3JvbGxTcGFjZUFib3ZlIC0gbWFyZ2luQm90dG9tIC0gc3BhY2luZy5jb250cm9sSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgcGxhY2VtZW50OiAndG9wJywgbWF4SGVpZ2h0OiBjb25zdHJhaW5lZEhlaWdodCB9O1xuICAgICAgfVxuXG4gICAgICAvLyBCT1RUT006IGFsbG93IGJyb3dzZXIgdG8gaW5jcmVhc2Ugc2Nyb2xsYWJsZSBhcmVhIGFuZCBpbW1lZGlhdGVseSBzZXQgc2Nyb2xsXG4gICAgICBpZiAocGxhY2VtZW50ID09PSAnYm90dG9tJykge1xuICAgICAgICBzY3JvbGxUbyhzY3JvbGxQYXJlbnQsIHNjcm9sbERvd24pO1xuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICdib3R0b20nLCBtYXhIZWlnaHQgfTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3RvcCc6XG4gICAgICAvLyAxOiB0aGUgbWVudSB3aWxsIGZpdCwgZG8gbm90aGluZ1xuICAgICAgaWYgKHZpZXdTcGFjZUFib3ZlID49IG1lbnVIZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHsgcGxhY2VtZW50OiAndG9wJywgbWF4SGVpZ2h0IH07XG4gICAgICB9XG5cbiAgICAgIC8vIDI6IHRoZSBtZW51IHdpbGwgZml0LCBpZiBzY3JvbGxlZFxuICAgICAgaWYgKHNjcm9sbFNwYWNlQWJvdmUgPj0gbWVudUhlaWdodCAmJiAhaXNGaXhlZFBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChzaG91bGRTY3JvbGwpIHtcbiAgICAgICAgICBhbmltYXRlZFNjcm9sbFRvKHNjcm9sbFBhcmVudCwgc2Nyb2xsVXAsIHNjcm9sbER1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHBsYWNlbWVudDogJ3RvcCcsIG1heEhlaWdodCB9O1xuICAgICAgfVxuXG4gICAgICAvLyAzOiB0aGUgbWVudSB3aWxsIGZpdCwgaWYgY29uc3RyYWluZWRcbiAgICAgIGlmIChcbiAgICAgICAgKCFpc0ZpeGVkUG9zaXRpb24gJiYgc2Nyb2xsU3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpIHx8XG4gICAgICAgIChpc0ZpeGVkUG9zaXRpb24gJiYgdmlld1NwYWNlQWJvdmUgPj0gbWluSGVpZ2h0KVxuICAgICAgKSB7XG4gICAgICAgIGxldCBjb25zdHJhaW5lZEhlaWdodCA9IG1heEhlaWdodDtcblxuICAgICAgICAvLyB3ZSB3YW50IHRvIHByb3ZpZGUgYXMgbXVjaCBvZiB0aGUgbWVudSBhcyBwb3NzaWJsZSB0byB0aGUgdXNlcixcbiAgICAgICAgLy8gc28gZ2l2ZSB0aGVtIHdoYXRldmVyIGlzIGF2YWlsYWJsZSBiZWxvdyByYXRoZXIgdGhhbiB0aGUgbWluSGVpZ2h0LlxuICAgICAgICBpZiAoXG4gICAgICAgICAgKCFpc0ZpeGVkUG9zaXRpb24gJiYgc2Nyb2xsU3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpIHx8XG4gICAgICAgICAgKGlzRml4ZWRQb3NpdGlvbiAmJiB2aWV3U3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0cmFpbmVkSGVpZ2h0ID0gaXNGaXhlZFBvc2l0aW9uXG4gICAgICAgICAgICA/IHZpZXdTcGFjZUFib3ZlIC0gbWFyZ2luVG9wXG4gICAgICAgICAgICA6IHNjcm9sbFNwYWNlQWJvdmUgLSBtYXJnaW5Ub3A7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hvdWxkU2Nyb2xsKSB7XG4gICAgICAgICAgYW5pbWF0ZWRTY3JvbGxUbyhzY3JvbGxQYXJlbnQsIHNjcm9sbFVwLCBzY3JvbGxEdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgICAgICAgbWF4SGVpZ2h0OiBjb25zdHJhaW5lZEhlaWdodCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gNC4gbm90IGVub3VnaCBzcGFjZSwgdGhlIGJyb3dzZXIgV0lMTCBOT1QgaW5jcmVhc2Ugc2Nyb2xsYWJsZSBhcmVhIHdoZW5cbiAgICAgIC8vIGFic29sdXRlbHkgcG9zaXRpb25lZCBlbGVtZW50IHJlbmRlcmVkIGFib3ZlIHRoZSB2aWV3cG9ydCAob25seSBiZWxvdykuXG4gICAgICAvLyBGbGlwIHRoZSBtZW51LCByZW5kZXIgYmVsb3dcbiAgICAgIHJldHVybiB7IHBsYWNlbWVudDogJ2JvdHRvbScsIG1heEhlaWdodCB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcGxhY2VtZW50IHByb3ZpZGVkIFwiJHtwbGFjZW1lbnR9XCIuYCk7XG4gIH1cblxuICAvLyBmdWxmaWwgY29udHJhY3Qgd2l0aCBmbG93OiBpbXBsaWNpdCByZXR1cm4gdmFsdWUgb2YgdW5kZWZpbmVkXG4gIHJldHVybiBkZWZhdWx0U3RhdGU7XG59XG5cbi8vIE1lbnUgQ29tcG9uZW50XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0IHR5cGUgTWVudUFuZFBsYWNlckNvbW1vbiA9IENvbW1vblByb3BzICYge1xuICAvKiogQ2FsbGJhY2sgdG8gdXBkYXRlIHRoZSBwb3J0YWwgYWZ0ZXIgcG9zc2libGUgZmxpcC4gKi9cbiAgZ2V0UG9ydGFsUGxhY2VtZW50OiBNZW51U3RhdGUgPT4gdm9pZCxcbiAgLyoqIFByb3BzIHRvIGJlIHBhc3NlZCB0byB0aGUgbWVudSB3cmFwcGVyLiAqL1xuICBpbm5lclByb3BzOiBPYmplY3QsXG4gIC8qKiBTZXQgdGhlIG1heGltdW0gaGVpZ2h0IG9mIHRoZSBtZW51LiAqL1xuICBtYXhNZW51SGVpZ2h0OiBudW1iZXIsXG4gIC8qKiBTZXQgd2hldGhlciB0aGUgbWVudSBzaG91bGQgYmUgYXQgdGhlIHRvcCwgYXQgdGhlIGJvdHRvbS4gVGhlIGF1dG8gb3B0aW9ucyBzZXRzIGl0IHRvIGJvdHRvbS4gKi9cbiAgbWVudVBsYWNlbWVudDogTWVudVBsYWNlbWVudCxcbiAgLyogVGhlIENTUyBwb3NpdGlvbiB2YWx1ZSBvZiB0aGUgbWVudSwgd2hlbiBcImZpeGVkXCIgZXh0cmEgbGF5b3V0IG1hbmFnZW1lbnQgaXMgcmVxdWlyZWQgKi9cbiAgbWVudVBvc2l0aW9uOiBNZW51UG9zaXRpb24sXG4gIC8qKiBTZXQgdGhlIG1pbmltdW0gaGVpZ2h0IG9mIHRoZSBtZW51LiAqL1xuICBtaW5NZW51SGVpZ2h0OiBudW1iZXIsXG4gIC8qKiBTZXQgd2hldGhlciB0aGUgcGFnZSBzaG91bGQgc2Nyb2xsIHRvIHNob3cgdGhlIG1lbnUuICovXG4gIG1lbnVTaG91bGRTY3JvbGxJbnRvVmlldzogYm9vbGVhbixcbn07XG5leHBvcnQgdHlwZSBNZW51UHJvcHMgPSBNZW51QW5kUGxhY2VyQ29tbW9uICYge1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBpbnRlcm5hbCBlbGVtZW50LCBjb25zdW1lZCBieSB0aGUgTWVudVBsYWNlciBjb21wb25lbnQgKi9cbiAgaW5uZXJSZWY6IEVsZW1lbnRSZWY8Kj4sXG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQuICovXG4gIGNoaWxkcmVuOiBSZWFjdEVsZW1lbnQ8Kj4sXG59O1xuZXhwb3J0IHR5cGUgTWVudVBsYWNlclByb3BzID0gTWVudUFuZFBsYWNlckNvbW1vbiAmIHtcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgY2hpbGRyZW46ICh7fSkgPT4gTm9kZSxcbn07XG5cbmZ1bmN0aW9uIGFsaWduVG9Db250cm9sKHBsYWNlbWVudCkge1xuICBjb25zdCBwbGFjZW1lbnRUb0NTU1Byb3AgPSB7IGJvdHRvbTogJ3RvcCcsIHRvcDogJ2JvdHRvbScgfTtcbiAgcmV0dXJuIHBsYWNlbWVudCA/IHBsYWNlbWVudFRvQ1NTUHJvcFtwbGFjZW1lbnRdIDogJ2JvdHRvbSc7XG59XG5jb25zdCBjb2VyY2VQbGFjZW1lbnQgPSBwID0+IChwID09PSAnYXV0bycgPyAnYm90dG9tJyA6IHApO1xuXG50eXBlIE1lbnVTdGF0ZVdpdGhQcm9wcyA9IE1lbnVTdGF0ZSAmIE1lbnVQcm9wcztcblxuZXhwb3J0IGNvbnN0IG1lbnVDU1MgPSAoe1xuICBwbGFjZW1lbnQsXG4gIHRoZW1lOiB7IGJvcmRlclJhZGl1cywgc3BhY2luZywgY29sb3JzIH0sXG59OiBNZW51U3RhdGVXaXRoUHJvcHMpID0+ICh7XG4gIFthbGlnblRvQ29udHJvbChwbGFjZW1lbnQpXTogJzEwMCUnLFxuICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9ycy5uZXV0cmFsMCxcbiAgYm9yZGVyUmFkaXVzOiBib3JkZXJSYWRpdXMsXG4gIGJveFNoYWRvdzogJzAgMCAwIDFweCBoc2xhKDAsIDAlLCAwJSwgMC4xKSwgMCA0cHggMTFweCBoc2xhKDAsIDAlLCAwJSwgMC4xKScsXG4gIG1hcmdpbkJvdHRvbTogc3BhY2luZy5tZW51R3V0dGVyLFxuICBtYXJnaW5Ub3A6IHNwYWNpbmcubWVudUd1dHRlcixcbiAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gIHdpZHRoOiAnMTAwJScsXG4gIHpJbmRleDogMSxcbn0pO1xuXG4vLyBOT1RFOiBpbnRlcm5hbCBvbmx5XG5leHBvcnQgY2xhc3MgTWVudVBsYWNlciBleHRlbmRzIENvbXBvbmVudDxNZW51UGxhY2VyUHJvcHMsIE1lbnVTdGF0ZT4ge1xuICBzdGF0ZSA9IHtcbiAgICBtYXhIZWlnaHQ6IHRoaXMucHJvcHMubWF4TWVudUhlaWdodCxcbiAgICBwbGFjZW1lbnQ6IG51bGwsXG4gIH07XG4gIHN0YXRpYyBjb250ZXh0VHlwZXMgPSB7XG4gICAgZ2V0UG9ydGFsUGxhY2VtZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgfTtcbiAgZ2V0UGxhY2VtZW50ID0gKHJlZjogRWxlbWVudFJlZjwqPikgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIG1pbk1lbnVIZWlnaHQsXG4gICAgICBtYXhNZW51SGVpZ2h0LFxuICAgICAgbWVudVBsYWNlbWVudCxcbiAgICAgIG1lbnVQb3NpdGlvbixcbiAgICAgIG1lbnVTaG91bGRTY3JvbGxJbnRvVmlldyxcbiAgICAgIHRoZW1lLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgZ2V0UG9ydGFsUGxhY2VtZW50IH0gPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoIXJlZikgcmV0dXJuO1xuXG4gICAgLy8gRE8gTk9UIHNjcm9sbCBpZiBwb3NpdGlvbiBpcyBmaXhlZFxuICAgIGNvbnN0IGlzRml4ZWRQb3NpdGlvbiA9IG1lbnVQb3NpdGlvbiA9PT0gJ2ZpeGVkJztcbiAgICBjb25zdCBzaG91bGRTY3JvbGwgPSBtZW51U2hvdWxkU2Nyb2xsSW50b1ZpZXcgJiYgIWlzRml4ZWRQb3NpdGlvbjtcblxuICAgIGNvbnN0IHN0YXRlID0gZ2V0TWVudVBsYWNlbWVudCh7XG4gICAgICBtYXhIZWlnaHQ6IG1heE1lbnVIZWlnaHQsXG4gICAgICBtZW51RWw6IHJlZixcbiAgICAgIG1pbkhlaWdodDogbWluTWVudUhlaWdodCxcbiAgICAgIHBsYWNlbWVudDogbWVudVBsYWNlbWVudCxcbiAgICAgIHNob3VsZFNjcm9sbCxcbiAgICAgIGlzRml4ZWRQb3NpdGlvbixcbiAgICAgIHRoZW1lLFxuICAgIH0pO1xuXG4gICAgaWYgKGdldFBvcnRhbFBsYWNlbWVudCkgZ2V0UG9ydGFsUGxhY2VtZW50KHN0YXRlKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICB9O1xuICBnZXRVcGRhdGVkUHJvcHMgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBtZW51UGxhY2VtZW50IH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHBsYWNlbWVudCA9IHRoaXMuc3RhdGUucGxhY2VtZW50IHx8IGNvZXJjZVBsYWNlbWVudChtZW51UGxhY2VtZW50KTtcblxuICAgIHJldHVybiB7IC4uLnRoaXMucHJvcHMsIHBsYWNlbWVudCwgbWF4SGVpZ2h0OiB0aGlzLnN0YXRlLm1heEhlaWdodCB9O1xuICB9O1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiBjaGlsZHJlbih7XG4gICAgICByZWY6IHRoaXMuZ2V0UGxhY2VtZW50LFxuICAgICAgcGxhY2VyUHJvcHM6IHRoaXMuZ2V0VXBkYXRlZFByb3BzKCksXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgTWVudSA9IChwcm9wczogTWVudVByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcywgaW5uZXJSZWYsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICBjb25zdCBjbiA9IGN4KGNzcyhnZXRTdHlsZXMoJ21lbnUnLCBwcm9wcykpLCB7IG1lbnU6IHRydWUgfSwgY2xhc3NOYW1lKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbn0gey4uLmlubmVyUHJvcHN9IHJlZj17aW5uZXJSZWZ9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTWVudTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNZW51IExpc3Rcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG50eXBlIE1lbnVMaXN0U3RhdGUgPSB7XG4gIC8qKiBTZXQgY2xhc3NuYW1lIGZvciBpc011bHRpICovXG4gIGlzTXVsdGk6IGJvb2xlYW4sXG4gIC8qIFNldCB0aGUgbWF4IGhlaWdodCBvZiB0aGUgTWVudSBjb21wb25lbnQgICovXG4gIG1heEhlaWdodDogbnVtYmVyLFxufTtcblxuZXhwb3J0IHR5cGUgTWVudUxpc3RQcm9wcyA9IHtcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgY2hpbGRyZW46IE5vZGUsXG4gIC8qKiBJbm5lciByZWYgdG8gRE9NIE5vZGUgKi9cbiAgaW5uZXJSZWY6IElubmVyUmVmLFxufTtcbmV4cG9ydCB0eXBlIE1lbnVMaXN0Q29tcG9uZW50UHJvcHMgPSBDb21tb25Qcm9wcyAmXG4gIE1lbnVMaXN0UHJvcHMgJlxuICBNZW51TGlzdFN0YXRlO1xuZXhwb3J0IGNvbnN0IG1lbnVMaXN0Q1NTID0gKHtcbiAgbWF4SGVpZ2h0LFxuICB0aGVtZToge1xuICAgIHNwYWNpbmc6IHsgYmFzZVVuaXQgfSxcbiAgfSxcbn06IE1lbnVMaXN0Q29tcG9uZW50UHJvcHMpID0+ICh7XG4gIG1heEhlaWdodCxcbiAgb3ZlcmZsb3dZOiAnYXV0bycsXG4gIHBhZGRpbmdCb3R0b206IGJhc2VVbml0LFxuICBwYWRkaW5nVG9wOiBiYXNlVW5pdCxcbiAgcG9zaXRpb246ICdyZWxhdGl2ZScsIC8vIHJlcXVpcmVkIGZvciBvZmZzZXRbSGVpZ2h0LCBUb3BdID4ga2V5Ym9hcmQgc2Nyb2xsXG4gIFdlYmtpdE92ZXJmbG93U2Nyb2xsaW5nOiAndG91Y2gnLFxufSk7XG5leHBvcnQgY29uc3QgTWVudUxpc3QgPSAocHJvcHM6IE1lbnVMaXN0Q29tcG9uZW50UHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpc011bHRpLCBpbm5lclJlZiB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnbWVudUxpc3QnLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ21lbnUtbGlzdCc6IHRydWUsXG4gICAgICAgICAgJ21lbnUtbGlzdC0taXMtbXVsdGknOiBpc011bHRpLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgICByZWY9e2lubmVyUmVmfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTWVudSBOb3RpY2VzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3Qgbm90aWNlQ1NTID0gKHtcbiAgdGhlbWU6IHtcbiAgICBzcGFjaW5nOiB7IGJhc2VVbml0IH0sXG4gICAgY29sb3JzLFxuICB9LFxufTogTm90aWNlUHJvcHMpID0+ICh7XG4gIGNvbG9yOiBjb2xvcnMubmV1dHJhbDQwLFxuICBwYWRkaW5nOiBgJHtiYXNlVW5pdCAqIDJ9cHggJHtiYXNlVW5pdCAqIDN9cHhgLFxuICB0ZXh0QWxpZ246ICdjZW50ZXInLFxufSk7XG5leHBvcnQgY29uc3Qgbm9PcHRpb25zTWVzc2FnZUNTUyA9IG5vdGljZUNTUztcbmV4cG9ydCBjb25zdCBsb2FkaW5nTWVzc2FnZUNTUyA9IG5vdGljZUNTUztcblxuZXhwb3J0IHR5cGUgTm90aWNlUHJvcHMgPSBDb21tb25Qcm9wcyAmIHtcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgY2hpbGRyZW46IE5vZGUsXG4gIC8qKiBQcm9wcyB0byBiZSBwYXNzZWQgb24gdG8gdGhlIHdyYXBwZXIuICovXG4gIGlubmVyUHJvcHM6IHsgW3N0cmluZ106IGFueSB9LFxufTtcblxuZXhwb3J0IGNvbnN0IE5vT3B0aW9uc01lc3NhZ2UgPSAocHJvcHM6IE5vdGljZVByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcywgaW5uZXJQcm9wcyB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnbm9PcHRpb25zTWVzc2FnZScsIHByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnbWVudS1ub3RpY2UnOiB0cnVlLFxuICAgICAgICAgICdtZW51LW5vdGljZS0tbm8tb3B0aW9ucyc6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5Ob09wdGlvbnNNZXNzYWdlLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46ICdObyBvcHRpb25zJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMb2FkaW5nTWVzc2FnZSA9IChwcm9wczogTm90aWNlUHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdsb2FkaW5nTWVzc2FnZScsIHByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnbWVudS1ub3RpY2UnOiB0cnVlLFxuICAgICAgICAgICdtZW51LW5vdGljZS0tbG9hZGluZyc6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5Mb2FkaW5nTWVzc2FnZS5kZWZhdWx0UHJvcHMgPSB7XG4gIGNoaWxkcmVuOiAnTG9hZGluZy4uLicsXG59O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1lbnUgUG9ydGFsXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IHR5cGUgTWVudVBvcnRhbFByb3BzID0gQ29tbW9uUHJvcHMgJiB7XG4gIGFwcGVuZFRvOiBIVE1MRWxlbWVudCxcbiAgY2hpbGRyZW46IE5vZGUsIC8vIGlkZWFsbHkgTWVudTxNZW51UHJvcHM+XG4gIGNvbnRyb2xFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgbWVudVBsYWNlbWVudDogTWVudVBsYWNlbWVudCxcbiAgbWVudVBvc2l0aW9uOiBNZW51UG9zaXRpb24sXG59O1xudHlwZSBNZW51UG9ydGFsU3RhdGUgPSB7XG4gIHBsYWNlbWVudDogJ2JvdHRvbScgfCAndG9wJyB8IG51bGwsXG59O1xudHlwZSBQb3J0YWxTdHlsZUFyZ3MgPSB7XG4gIG9mZnNldDogbnVtYmVyLFxuICBwb3NpdGlvbjogTWVudVBvc2l0aW9uLFxuICByZWN0OiBSZWN0VHlwZSxcbn07XG5cbmV4cG9ydCBjb25zdCBtZW51UG9ydGFsQ1NTID0gKHsgcmVjdCwgb2Zmc2V0LCBwb3NpdGlvbiB9OiBQb3J0YWxTdHlsZUFyZ3MpID0+ICh7XG4gIGxlZnQ6IHJlY3QubGVmdCxcbiAgcG9zaXRpb246IHBvc2l0aW9uLFxuICB0b3A6IG9mZnNldCxcbiAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gIHpJbmRleDogMSxcbn0pO1xuXG5leHBvcnQgY2xhc3MgTWVudVBvcnRhbCBleHRlbmRzIENvbXBvbmVudDxNZW51UG9ydGFsUHJvcHMsIE1lbnVQb3J0YWxTdGF0ZT4ge1xuICBzdGF0ZSA9IHsgcGxhY2VtZW50OiBudWxsIH07XG4gIHN0YXRpYyBjaGlsZENvbnRleHRUeXBlcyA9IHtcbiAgICBnZXRQb3J0YWxQbGFjZW1lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICB9O1xuICBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFBvcnRhbFBsYWNlbWVudDogdGhpcy5nZXRQb3J0YWxQbGFjZW1lbnQsXG4gICAgfTtcbiAgfVxuXG4gIC8vIGNhbGxiYWNrIGZvciBvY2Nhc3Npb25zIHdoZXJlIHRoZSBtZW51IG11c3QgXCJmbGlwXCJcbiAgZ2V0UG9ydGFsUGxhY2VtZW50ID0gKHsgcGxhY2VtZW50IH06IE1lbnVTdGF0ZSkgPT4ge1xuICAgIGNvbnN0IGluaXRpYWxQbGFjZW1lbnQgPSBjb2VyY2VQbGFjZW1lbnQodGhpcy5wcm9wcy5tZW51UGxhY2VtZW50KTtcblxuICAgIC8vIGF2b2lkIHJlLXJlbmRlcnMgaWYgdGhlIHBsYWNlbWVudCBoYXMgbm90IGNoYW5nZWRcbiAgICBpZiAocGxhY2VtZW50ICE9PSBpbml0aWFsUGxhY2VtZW50KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgcGxhY2VtZW50IH0pO1xuICAgIH1cbiAgfTtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGFwcGVuZFRvLFxuICAgICAgY2hpbGRyZW4sXG4gICAgICBjb250cm9sRWxlbWVudCxcbiAgICAgIG1lbnVQbGFjZW1lbnQsXG4gICAgICBtZW51UG9zaXRpb246IHBvc2l0aW9uLFxuICAgICAgZ2V0U3R5bGVzLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGlzRml4ZWQgPSBwb3NpdGlvbiA9PT0gJ2ZpeGVkJztcblxuICAgIC8vIGJhaWwgZWFybHkgaWYgcmVxdWlyZWQgZWxlbWVudHMgYXJlbid0IHByZXNlbnRcbiAgICBpZiAoKCFhcHBlbmRUbyAmJiAhaXNGaXhlZCkgfHwgIWNvbnRyb2xFbGVtZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBwbGFjZW1lbnQgPSB0aGlzLnN0YXRlLnBsYWNlbWVudCB8fCBjb2VyY2VQbGFjZW1lbnQobWVudVBsYWNlbWVudCk7XG4gICAgY29uc3QgcmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50T2JqKGNvbnRyb2xFbGVtZW50KTtcbiAgICBjb25zdCBzY3JvbGxEaXN0YW5jZSA9IGlzRml4ZWQgPyAwIDogd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgIGNvbnN0IG9mZnNldCA9IHJlY3RbcGxhY2VtZW50XSArIHNjcm9sbERpc3RhbmNlO1xuICAgIGNvbnN0IHN0YXRlID0geyBvZmZzZXQsIHBvc2l0aW9uLCByZWN0IH07XG5cbiAgICAvLyBzYW1lIHdyYXBwZXIgZWxlbWVudCB3aGV0aGVyIGZpeGVkIG9yIHBvcnRhbGxlZFxuICAgIGNvbnN0IG1lbnVXcmFwcGVyID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NzcyhnZXRTdHlsZXMoJ21lbnVQb3J0YWwnLCBzdGF0ZSkpfT57Y2hpbGRyZW59PC9kaXY+XG4gICAgKTtcblxuICAgIHJldHVybiBhcHBlbmRUbyA/IGNyZWF0ZVBvcnRhbChtZW51V3JhcHBlciwgYXBwZW5kVG8pIDogbWVudVdyYXBwZXI7XG4gIH1cbn1cbiJdfQ== */')), { menu: true }, className);

  return React.createElement(
    'div',
    _extends({ className: cn }, innerProps, { ref: innerRef }),
    children
  );
};

// ==============================
// Menu List
// ==============================

var menuListCSS = function menuListCSS(_ref5) {
  var maxHeight = _ref5.maxHeight,
      baseUnit = _ref5.theme.spacing.baseUnit;
  return {
    maxHeight: maxHeight,
    overflowY: 'auto',
    paddingBottom: baseUnit,
    paddingTop: baseUnit,
    position: 'relative', // required for offset[Height, Top] > keyboard scroll
    WebkitOverflowScrolling: 'touch'
  };
};
var MenuList = function MenuList(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      isMulti = props.isMulti,
      innerRef = props.innerRef;

  return React.createElement(
    'div',
    {
      className: cx( /*#__PURE__*/css(getStyles('menuList', props), 'label:MenuList;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lbnUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBK1dRIiwiZmlsZSI6Ik1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7XG4gIENvbXBvbmVudCxcbiAgdHlwZSBFbGVtZW50IGFzIFJlYWN0RWxlbWVudCxcbiAgdHlwZSBFbGVtZW50UmVmLFxuICB0eXBlIE5vZGUsXG59IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNzcyB9IGZyb20gJ2Vtb3Rpb24nO1xuaW1wb3J0IHsgY3JlYXRlUG9ydGFsIH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCB7XG4gIGFuaW1hdGVkU2Nyb2xsVG8sXG4gIGdldEJvdW5kaW5nQ2xpZW50T2JqLFxuICB0eXBlIFJlY3RUeXBlLFxuICBnZXRTY3JvbGxQYXJlbnQsXG4gIGdldFNjcm9sbFRvcCxcbiAgc2Nyb2xsVG8sXG59IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB0eXBlIHtcbiAgSW5uZXJSZWYsXG4gIE1lbnVQbGFjZW1lbnQsXG4gIE1lbnVQb3NpdGlvbixcbiAgQ29tbW9uUHJvcHMsXG59IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgVGhlbWUgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTWVudVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEdldCBNZW51IFBsYWNlbWVudFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnR5cGUgTWVudVN0YXRlID0ge1xuICBwbGFjZW1lbnQ6ICdib3R0b20nIHwgJ3RvcCcgfCBudWxsLFxuICBtYXhIZWlnaHQ6IG51bWJlcixcbn07XG50eXBlIFBsYWNlbWVudEFyZ3MgPSB7XG4gIG1heEhlaWdodDogbnVtYmVyLFxuICBtZW51RWw6IEVsZW1lbnRSZWY8Kj4sXG4gIG1pbkhlaWdodDogbnVtYmVyLFxuICBwbGFjZW1lbnQ6ICdib3R0b20nIHwgJ3RvcCcgfCAnYXV0bycsXG4gIHNob3VsZFNjcm9sbDogYm9vbGVhbixcbiAgaXNGaXhlZFBvc2l0aW9uOiBib29sZWFuLFxuICB0aGVtZTogVGhlbWUsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVudVBsYWNlbWVudCh7XG4gIG1heEhlaWdodCxcbiAgbWVudUVsLFxuICBtaW5IZWlnaHQsXG4gIHBsYWNlbWVudCxcbiAgc2hvdWxkU2Nyb2xsLFxuICBpc0ZpeGVkUG9zaXRpb24sXG4gIHRoZW1lLFxufTogUGxhY2VtZW50QXJncyk6IE1lbnVTdGF0ZSB7XG4gIGNvbnN0IHsgc3BhY2luZyB9ID0gdGhlbWU7XG4gIGNvbnN0IHNjcm9sbFBhcmVudCA9IGdldFNjcm9sbFBhcmVudChtZW51RWwpO1xuICBjb25zdCBkZWZhdWx0U3RhdGUgPSB7IHBsYWNlbWVudDogJ2JvdHRvbScsIG1heEhlaWdodCB9O1xuXG4gIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nLCByZXR1cm4gZGVmYXVsdCBzdGF0ZVxuICBpZiAoIW1lbnVFbCB8fCAhbWVudUVsLm9mZnNldFBhcmVudCkgcmV0dXJuIGRlZmF1bHRTdGF0ZTtcblxuICAvLyB3ZSBjYW4ndCB0cnVzdCBgc2Nyb2xsUGFyZW50LnNjcm9sbEhlaWdodGAgLS0+IGl0IG1heSBpbmNyZWFzZSB3aGVuXG4gIC8vIHRoZSBtZW51IGlzIHJlbmRlcmVkXG4gIGNvbnN0IHsgaGVpZ2h0OiBzY3JvbGxIZWlnaHQgfSA9IHNjcm9sbFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3Qge1xuICAgIGJvdHRvbTogbWVudUJvdHRvbSxcbiAgICBoZWlnaHQ6IG1lbnVIZWlnaHQsXG4gICAgdG9wOiBtZW51VG9wLFxuICB9ID0gbWVudUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIC8vICRGbG93Rml4TWUgZnVuY3Rpb24gcmV0dXJucyBhYm92ZSBpZiB0aGVyZSdzIG5vIG9mZnNldFBhcmVudFxuICBjb25zdCB7IHRvcDogY29udGFpbmVyVG9wIH0gPSBtZW51RWwub2Zmc2V0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB2aWV3SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICBjb25zdCBzY3JvbGxUb3AgPSBnZXRTY3JvbGxUb3Aoc2Nyb2xsUGFyZW50KTtcblxuICBjb25zdCBtYXJnaW5Cb3R0b20gPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG1lbnVFbCkubWFyZ2luQm90dG9tLCAxMCk7XG4gIGNvbnN0IG1hcmdpblRvcCA9IHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobWVudUVsKS5tYXJnaW5Ub3AsIDEwKTtcbiAgY29uc3Qgdmlld1NwYWNlQWJvdmUgPSBjb250YWluZXJUb3AgLSBtYXJnaW5Ub3A7XG4gIGNvbnN0IHZpZXdTcGFjZUJlbG93ID0gdmlld0hlaWdodCAtIG1lbnVUb3A7XG4gIGNvbnN0IHNjcm9sbFNwYWNlQWJvdmUgPSB2aWV3U3BhY2VBYm92ZSArIHNjcm9sbFRvcDtcbiAgY29uc3Qgc2Nyb2xsU3BhY2VCZWxvdyA9IHNjcm9sbEhlaWdodCAtIHNjcm9sbFRvcCAtIG1lbnVUb3A7XG5cbiAgY29uc3Qgc2Nyb2xsRG93biA9IG1lbnVCb3R0b20gLSB2aWV3SGVpZ2h0ICsgc2Nyb2xsVG9wICsgbWFyZ2luQm90dG9tO1xuICBjb25zdCBzY3JvbGxVcCA9IHNjcm9sbFRvcCArIG1lbnVUb3AgLSBtYXJnaW5Ub3A7XG4gIGNvbnN0IHNjcm9sbER1cmF0aW9uID0gMTYwO1xuXG4gIHN3aXRjaCAocGxhY2VtZW50KSB7XG4gICAgY2FzZSAnYXV0byc6XG4gICAgY2FzZSAnYm90dG9tJzpcbiAgICAgIC8vIDE6IHRoZSBtZW51IHdpbGwgZml0LCBkbyBub3RoaW5nXG4gICAgICBpZiAodmlld1NwYWNlQmVsb3cgPj0gbWVudUhlaWdodCkge1xuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICdib3R0b20nLCBtYXhIZWlnaHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gMjogdGhlIG1lbnUgd2lsbCBmaXQsIGlmIHNjcm9sbGVkXG4gICAgICBpZiAoc2Nyb2xsU3BhY2VCZWxvdyA+PSBtZW51SGVpZ2h0ICYmICFpc0ZpeGVkUG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHNob3VsZFNjcm9sbCkge1xuICAgICAgICAgIGFuaW1hdGVkU2Nyb2xsVG8oc2Nyb2xsUGFyZW50LCBzY3JvbGxEb3duLCBzY3JvbGxEdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICdib3R0b20nLCBtYXhIZWlnaHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gMzogdGhlIG1lbnUgd2lsbCBmaXQsIGlmIGNvbnN0cmFpbmVkXG4gICAgICBpZiAoXG4gICAgICAgICghaXNGaXhlZFBvc2l0aW9uICYmIHNjcm9sbFNwYWNlQmVsb3cgPj0gbWluSGVpZ2h0KSB8fFxuICAgICAgICAoaXNGaXhlZFBvc2l0aW9uICYmIHZpZXdTcGFjZUJlbG93ID49IG1pbkhlaWdodClcbiAgICAgICkge1xuICAgICAgICBpZiAoc2hvdWxkU2Nyb2xsKSB7XG4gICAgICAgICAgYW5pbWF0ZWRTY3JvbGxUbyhzY3JvbGxQYXJlbnQsIHNjcm9sbERvd24sIHNjcm9sbER1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIHdhbnQgdG8gcHJvdmlkZSBhcyBtdWNoIG9mIHRoZSBtZW51IGFzIHBvc3NpYmxlIHRvIHRoZSB1c2VyLFxuICAgICAgICAvLyBzbyBnaXZlIHRoZW0gd2hhdGV2ZXIgaXMgYXZhaWxhYmxlIGJlbG93IHJhdGhlciB0aGFuIHRoZSBtaW5IZWlnaHQuXG4gICAgICAgIGNvbnN0IGNvbnN0cmFpbmVkSGVpZ2h0ID0gaXNGaXhlZFBvc2l0aW9uXG4gICAgICAgICAgPyB2aWV3U3BhY2VCZWxvdyAtIG1hcmdpbkJvdHRvbVxuICAgICAgICAgIDogc2Nyb2xsU3BhY2VCZWxvdyAtIG1hcmdpbkJvdHRvbTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgICAgICAgbWF4SGVpZ2h0OiBjb25zdHJhaW5lZEhlaWdodCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gNC4gRm9ya2VkIGJldmlvdXIgd2hlbiB0aGVyZSBpc24ndCBlbm91Z2ggc3BhY2UgYmVsb3dcblxuICAgICAgLy8gQVVUTzogZmxpcCB0aGUgbWVudSwgcmVuZGVyIGFib3ZlXG4gICAgICBpZiAocGxhY2VtZW50ID09PSAnYXV0bycgfHwgaXNGaXhlZFBvc2l0aW9uKSB7XG4gICAgICAgIC8vIG1heSBuZWVkIHRvIGJlIGNvbnN0cmFpbmVkIGFmdGVyIGZsaXBwaW5nXG4gICAgICAgIGxldCBjb25zdHJhaW5lZEhlaWdodCA9IG1heEhlaWdodDtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgKCFpc0ZpeGVkUG9zaXRpb24gJiYgc2Nyb2xsU3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpIHx8XG4gICAgICAgICAgKGlzRml4ZWRQb3NpdGlvbiAmJiB2aWV3U3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0cmFpbmVkSGVpZ2h0ID0gaXNGaXhlZFBvc2l0aW9uXG4gICAgICAgICAgICA/IHZpZXdTcGFjZUFib3ZlIC0gbWFyZ2luQm90dG9tIC0gc3BhY2luZy5jb250cm9sSGVpZ2h0XG4gICAgICAgICAgICA6IHNjcm9sbFNwYWNlQWJvdmUgLSBtYXJnaW5Cb3R0b20gLSBzcGFjaW5nLmNvbnRyb2xIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICd0b3AnLCBtYXhIZWlnaHQ6IGNvbnN0cmFpbmVkSGVpZ2h0IH07XG4gICAgICB9XG5cbiAgICAgIC8vIEJPVFRPTTogYWxsb3cgYnJvd3NlciB0byBpbmNyZWFzZSBzY3JvbGxhYmxlIGFyZWEgYW5kIGltbWVkaWF0ZWx5IHNldCBzY3JvbGxcbiAgICAgIGlmIChwbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHNjcm9sbFRvKHNjcm9sbFBhcmVudCwgc2Nyb2xsRG93bik7XG4gICAgICAgIHJldHVybiB7IHBsYWNlbWVudDogJ2JvdHRvbScsIG1heEhlaWdodCB9O1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndG9wJzpcbiAgICAgIC8vIDE6IHRoZSBtZW51IHdpbGwgZml0LCBkbyBub3RoaW5nXG4gICAgICBpZiAodmlld1NwYWNlQWJvdmUgPj0gbWVudUhlaWdodCkge1xuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICd0b3AnLCBtYXhIZWlnaHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gMjogdGhlIG1lbnUgd2lsbCBmaXQsIGlmIHNjcm9sbGVkXG4gICAgICBpZiAoc2Nyb2xsU3BhY2VBYm92ZSA+PSBtZW51SGVpZ2h0ICYmICFpc0ZpeGVkUG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHNob3VsZFNjcm9sbCkge1xuICAgICAgICAgIGFuaW1hdGVkU2Nyb2xsVG8oc2Nyb2xsUGFyZW50LCBzY3JvbGxVcCwgc2Nyb2xsRHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgcGxhY2VtZW50OiAndG9wJywgbWF4SGVpZ2h0IH07XG4gICAgICB9XG5cbiAgICAgIC8vIDM6IHRoZSBtZW51IHdpbGwgZml0LCBpZiBjb25zdHJhaW5lZFxuICAgICAgaWYgKFxuICAgICAgICAoIWlzRml4ZWRQb3NpdGlvbiAmJiBzY3JvbGxTcGFjZUFib3ZlID49IG1pbkhlaWdodCkgfHxcbiAgICAgICAgKGlzRml4ZWRQb3NpdGlvbiAmJiB2aWV3U3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpXG4gICAgICApIHtcbiAgICAgICAgbGV0IGNvbnN0cmFpbmVkSGVpZ2h0ID0gbWF4SGVpZ2h0O1xuXG4gICAgICAgIC8vIHdlIHdhbnQgdG8gcHJvdmlkZSBhcyBtdWNoIG9mIHRoZSBtZW51IGFzIHBvc3NpYmxlIHRvIHRoZSB1c2VyLFxuICAgICAgICAvLyBzbyBnaXZlIHRoZW0gd2hhdGV2ZXIgaXMgYXZhaWxhYmxlIGJlbG93IHJhdGhlciB0aGFuIHRoZSBtaW5IZWlnaHQuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAoIWlzRml4ZWRQb3NpdGlvbiAmJiBzY3JvbGxTcGFjZUFib3ZlID49IG1pbkhlaWdodCkgfHxcbiAgICAgICAgICAoaXNGaXhlZFBvc2l0aW9uICYmIHZpZXdTcGFjZUFib3ZlID49IG1pbkhlaWdodClcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3RyYWluZWRIZWlnaHQgPSBpc0ZpeGVkUG9zaXRpb25cbiAgICAgICAgICAgID8gdmlld1NwYWNlQWJvdmUgLSBtYXJnaW5Ub3BcbiAgICAgICAgICAgIDogc2Nyb2xsU3BhY2VBYm92ZSAtIG1hcmdpblRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG91bGRTY3JvbGwpIHtcbiAgICAgICAgICBhbmltYXRlZFNjcm9sbFRvKHNjcm9sbFBhcmVudCwgc2Nyb2xsVXAsIHNjcm9sbER1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgICAgICBtYXhIZWlnaHQ6IGNvbnN0cmFpbmVkSGVpZ2h0LFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyA0LiBub3QgZW5vdWdoIHNwYWNlLCB0aGUgYnJvd3NlciBXSUxMIE5PVCBpbmNyZWFzZSBzY3JvbGxhYmxlIGFyZWEgd2hlblxuICAgICAgLy8gYWJzb2x1dGVseSBwb3NpdGlvbmVkIGVsZW1lbnQgcmVuZGVyZWQgYWJvdmUgdGhlIHZpZXdwb3J0IChvbmx5IGJlbG93KS5cbiAgICAgIC8vIEZsaXAgdGhlIG1lbnUsIHJlbmRlciBiZWxvd1xuICAgICAgcmV0dXJuIHsgcGxhY2VtZW50OiAnYm90dG9tJywgbWF4SGVpZ2h0IH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwbGFjZW1lbnQgcHJvdmlkZWQgXCIke3BsYWNlbWVudH1cIi5gKTtcbiAgfVxuXG4gIC8vIGZ1bGZpbCBjb250cmFjdCB3aXRoIGZsb3c6IGltcGxpY2l0IHJldHVybiB2YWx1ZSBvZiB1bmRlZmluZWRcbiAgcmV0dXJuIGRlZmF1bHRTdGF0ZTtcbn1cblxuLy8gTWVudSBDb21wb25lbnRcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgdHlwZSBNZW51QW5kUGxhY2VyQ29tbW9uID0gQ29tbW9uUHJvcHMgJiB7XG4gIC8qKiBDYWxsYmFjayB0byB1cGRhdGUgdGhlIHBvcnRhbCBhZnRlciBwb3NzaWJsZSBmbGlwLiAqL1xuICBnZXRQb3J0YWxQbGFjZW1lbnQ6IE1lbnVTdGF0ZSA9PiB2b2lkLFxuICAvKiogUHJvcHMgdG8gYmUgcGFzc2VkIHRvIHRoZSBtZW51IHdyYXBwZXIuICovXG4gIGlubmVyUHJvcHM6IE9iamVjdCxcbiAgLyoqIFNldCB0aGUgbWF4aW11bSBoZWlnaHQgb2YgdGhlIG1lbnUuICovXG4gIG1heE1lbnVIZWlnaHQ6IG51bWJlcixcbiAgLyoqIFNldCB3aGV0aGVyIHRoZSBtZW51IHNob3VsZCBiZSBhdCB0aGUgdG9wLCBhdCB0aGUgYm90dG9tLiBUaGUgYXV0byBvcHRpb25zIHNldHMgaXQgdG8gYm90dG9tLiAqL1xuICBtZW51UGxhY2VtZW50OiBNZW51UGxhY2VtZW50LFxuICAvKiBUaGUgQ1NTIHBvc2l0aW9uIHZhbHVlIG9mIHRoZSBtZW51LCB3aGVuIFwiZml4ZWRcIiBleHRyYSBsYXlvdXQgbWFuYWdlbWVudCBpcyByZXF1aXJlZCAqL1xuICBtZW51UG9zaXRpb246IE1lbnVQb3NpdGlvbixcbiAgLyoqIFNldCB0aGUgbWluaW11bSBoZWlnaHQgb2YgdGhlIG1lbnUuICovXG4gIG1pbk1lbnVIZWlnaHQ6IG51bWJlcixcbiAgLyoqIFNldCB3aGV0aGVyIHRoZSBwYWdlIHNob3VsZCBzY3JvbGwgdG8gc2hvdyB0aGUgbWVudS4gKi9cbiAgbWVudVNob3VsZFNjcm9sbEludG9WaWV3OiBib29sZWFuLFxufTtcbmV4cG9ydCB0eXBlIE1lbnVQcm9wcyA9IE1lbnVBbmRQbGFjZXJDb21tb24gJiB7XG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIGVsZW1lbnQsIGNvbnN1bWVkIGJ5IHRoZSBNZW51UGxhY2VyIGNvbXBvbmVudCAqL1xuICBpbm5lclJlZjogRWxlbWVudFJlZjwqPixcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgY2hpbGRyZW46IFJlYWN0RWxlbWVudDwqPixcbn07XG5leHBvcnQgdHlwZSBNZW51UGxhY2VyUHJvcHMgPSBNZW51QW5kUGxhY2VyQ29tbW9uICYge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBjaGlsZHJlbjogKHt9KSA9PiBOb2RlLFxufTtcblxuZnVuY3Rpb24gYWxpZ25Ub0NvbnRyb2wocGxhY2VtZW50KSB7XG4gIGNvbnN0IHBsYWNlbWVudFRvQ1NTUHJvcCA9IHsgYm90dG9tOiAndG9wJywgdG9wOiAnYm90dG9tJyB9O1xuICByZXR1cm4gcGxhY2VtZW50ID8gcGxhY2VtZW50VG9DU1NQcm9wW3BsYWNlbWVudF0gOiAnYm90dG9tJztcbn1cbmNvbnN0IGNvZXJjZVBsYWNlbWVudCA9IHAgPT4gKHAgPT09ICdhdXRvJyA/ICdib3R0b20nIDogcCk7XG5cbnR5cGUgTWVudVN0YXRlV2l0aFByb3BzID0gTWVudVN0YXRlICYgTWVudVByb3BzO1xuXG5leHBvcnQgY29uc3QgbWVudUNTUyA9ICh7XG4gIHBsYWNlbWVudCxcbiAgdGhlbWU6IHsgYm9yZGVyUmFkaXVzLCBzcGFjaW5nLCBjb2xvcnMgfSxcbn06IE1lbnVTdGF0ZVdpdGhQcm9wcykgPT4gKHtcbiAgW2FsaWduVG9Db250cm9sKHBsYWNlbWVudCldOiAnMTAwJScsXG4gIGJhY2tncm91bmRDb2xvcjogY29sb3JzLm5ldXRyYWwwLFxuICBib3JkZXJSYWRpdXM6IGJvcmRlclJhZGl1cyxcbiAgYm94U2hhZG93OiAnMCAwIDAgMXB4IGhzbGEoMCwgMCUsIDAlLCAwLjEpLCAwIDRweCAxMXB4IGhzbGEoMCwgMCUsIDAlLCAwLjEpJyxcbiAgbWFyZ2luQm90dG9tOiBzcGFjaW5nLm1lbnVHdXR0ZXIsXG4gIG1hcmdpblRvcDogc3BhY2luZy5tZW51R3V0dGVyLFxuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgd2lkdGg6ICcxMDAlJyxcbiAgekluZGV4OiAxLFxufSk7XG5cbi8vIE5PVEU6IGludGVybmFsIG9ubHlcbmV4cG9ydCBjbGFzcyBNZW51UGxhY2VyIGV4dGVuZHMgQ29tcG9uZW50PE1lbnVQbGFjZXJQcm9wcywgTWVudVN0YXRlPiB7XG4gIHN0YXRlID0ge1xuICAgIG1heEhlaWdodDogdGhpcy5wcm9wcy5tYXhNZW51SGVpZ2h0LFxuICAgIHBsYWNlbWVudDogbnVsbCxcbiAgfTtcbiAgc3RhdGljIGNvbnRleHRUeXBlcyA9IHtcbiAgICBnZXRQb3J0YWxQbGFjZW1lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICB9O1xuICBnZXRQbGFjZW1lbnQgPSAocmVmOiBFbGVtZW50UmVmPCo+KSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgbWluTWVudUhlaWdodCxcbiAgICAgIG1heE1lbnVIZWlnaHQsXG4gICAgICBtZW51UGxhY2VtZW50LFxuICAgICAgbWVudVBvc2l0aW9uLFxuICAgICAgbWVudVNob3VsZFNjcm9sbEludG9WaWV3LFxuICAgICAgdGhlbWUsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBnZXRQb3J0YWxQbGFjZW1lbnQgfSA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmICghcmVmKSByZXR1cm47XG5cbiAgICAvLyBETyBOT1Qgc2Nyb2xsIGlmIHBvc2l0aW9uIGlzIGZpeGVkXG4gICAgY29uc3QgaXNGaXhlZFBvc2l0aW9uID0gbWVudVBvc2l0aW9uID09PSAnZml4ZWQnO1xuICAgIGNvbnN0IHNob3VsZFNjcm9sbCA9IG1lbnVTaG91bGRTY3JvbGxJbnRvVmlldyAmJiAhaXNGaXhlZFBvc2l0aW9uO1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRNZW51UGxhY2VtZW50KHtcbiAgICAgIG1heEhlaWdodDogbWF4TWVudUhlaWdodCxcbiAgICAgIG1lbnVFbDogcmVmLFxuICAgICAgbWluSGVpZ2h0OiBtaW5NZW51SGVpZ2h0LFxuICAgICAgcGxhY2VtZW50OiBtZW51UGxhY2VtZW50LFxuICAgICAgc2hvdWxkU2Nyb2xsLFxuICAgICAgaXNGaXhlZFBvc2l0aW9uLFxuICAgICAgdGhlbWUsXG4gICAgfSk7XG5cbiAgICBpZiAoZ2V0UG9ydGFsUGxhY2VtZW50KSBnZXRQb3J0YWxQbGFjZW1lbnQoc3RhdGUpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gIH07XG4gIGdldFVwZGF0ZWRQcm9wcyA9ICgpID0+IHtcbiAgICBjb25zdCB7IG1lbnVQbGFjZW1lbnQgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgcGxhY2VtZW50ID0gdGhpcy5zdGF0ZS5wbGFjZW1lbnQgfHwgY29lcmNlUGxhY2VtZW50KG1lbnVQbGFjZW1lbnQpO1xuXG4gICAgcmV0dXJuIHsgLi4udGhpcy5wcm9wcywgcGxhY2VtZW50LCBtYXhIZWlnaHQ6IHRoaXMuc3RhdGUubWF4SGVpZ2h0IH07XG4gIH07XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIGNoaWxkcmVuKHtcbiAgICAgIHJlZjogdGhpcy5nZXRQbGFjZW1lbnQsXG4gICAgICBwbGFjZXJQcm9wczogdGhpcy5nZXRVcGRhdGVkUHJvcHMoKSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBNZW51ID0gKHByb3BzOiBNZW51UHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclJlZiwgaW5uZXJQcm9wcyB9ID0gcHJvcHM7XG4gIGNvbnN0IGNuID0gY3goY3NzKGdldFN0eWxlcygnbWVudScsIHByb3BzKSksIHsgbWVudTogdHJ1ZSB9LCBjbGFzc05hbWUpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NufSB7Li4uaW5uZXJQcm9wc30gcmVmPXtpbm5lclJlZn0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBNZW51O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1lbnUgTGlzdFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbnR5cGUgTWVudUxpc3RTdGF0ZSA9IHtcbiAgLyoqIFNldCBjbGFzc25hbWUgZm9yIGlzTXVsdGkgKi9cbiAgaXNNdWx0aTogYm9vbGVhbixcbiAgLyogU2V0IHRoZSBtYXggaGVpZ2h0IG9mIHRoZSBNZW51IGNvbXBvbmVudCAgKi9cbiAgbWF4SGVpZ2h0OiBudW1iZXIsXG59O1xuXG5leHBvcnQgdHlwZSBNZW51TGlzdFByb3BzID0ge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBjaGlsZHJlbjogTm9kZSxcbiAgLyoqIElubmVyIHJlZiB0byBET00gTm9kZSAqL1xuICBpbm5lclJlZjogSW5uZXJSZWYsXG59O1xuZXhwb3J0IHR5cGUgTWVudUxpc3RDb21wb25lbnRQcm9wcyA9IENvbW1vblByb3BzICZcbiAgTWVudUxpc3RQcm9wcyAmXG4gIE1lbnVMaXN0U3RhdGU7XG5leHBvcnQgY29uc3QgbWVudUxpc3RDU1MgPSAoe1xuICBtYXhIZWlnaHQsXG4gIHRoZW1lOiB7XG4gICAgc3BhY2luZzogeyBiYXNlVW5pdCB9LFxuICB9LFxufTogTWVudUxpc3RDb21wb25lbnRQcm9wcykgPT4gKHtcbiAgbWF4SGVpZ2h0LFxuICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgcGFkZGluZ0JvdHRvbTogYmFzZVVuaXQsXG4gIHBhZGRpbmdUb3A6IGJhc2VVbml0LFxuICBwb3NpdGlvbjogJ3JlbGF0aXZlJywgLy8gcmVxdWlyZWQgZm9yIG9mZnNldFtIZWlnaHQsIFRvcF0gPiBrZXlib2FyZCBzY3JvbGxcbiAgV2Via2l0T3ZlcmZsb3dTY3JvbGxpbmc6ICd0b3VjaCcsXG59KTtcbmV4cG9ydCBjb25zdCBNZW51TGlzdCA9IChwcm9wczogTWVudUxpc3RDb21wb25lbnRQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlzTXVsdGksIGlubmVyUmVmIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdtZW51TGlzdCcsIHByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnbWVudS1saXN0JzogdHJ1ZSxcbiAgICAgICAgICAnbWVudS1saXN0LS1pcy1tdWx0aSc6IGlzTXVsdGksXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHJlZj17aW5uZXJSZWZ9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNZW51IE5vdGljZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBub3RpY2VDU1MgPSAoe1xuICB0aGVtZToge1xuICAgIHNwYWNpbmc6IHsgYmFzZVVuaXQgfSxcbiAgICBjb2xvcnMsXG4gIH0sXG59OiBOb3RpY2VQcm9wcykgPT4gKHtcbiAgY29sb3I6IGNvbG9ycy5uZXV0cmFsNDAsXG4gIHBhZGRpbmc6IGAke2Jhc2VVbml0ICogMn1weCAke2Jhc2VVbml0ICogM31weGAsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG59KTtcbmV4cG9ydCBjb25zdCBub09wdGlvbnNNZXNzYWdlQ1NTID0gbm90aWNlQ1NTO1xuZXhwb3J0IGNvbnN0IGxvYWRpbmdNZXNzYWdlQ1NTID0gbm90aWNlQ1NTO1xuXG5leHBvcnQgdHlwZSBOb3RpY2VQcm9wcyA9IENvbW1vblByb3BzICYge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBjaGlsZHJlbjogTm9kZSxcbiAgLyoqIFByb3BzIHRvIGJlIHBhc3NlZCBvbiB0byB0aGUgd3JhcHBlci4gKi9cbiAgaW5uZXJQcm9wczogeyBbc3RyaW5nXTogYW55IH0sXG59O1xuXG5leHBvcnQgY29uc3QgTm9PcHRpb25zTWVzc2FnZSA9IChwcm9wczogTm90aWNlUHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdub09wdGlvbnNNZXNzYWdlJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdtZW51LW5vdGljZSc6IHRydWUsXG4gICAgICAgICAgJ21lbnUtbm90aWNlLS1uby1vcHRpb25zJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbk5vT3B0aW9uc01lc3NhZ2UuZGVmYXVsdFByb3BzID0ge1xuICBjaGlsZHJlbjogJ05vIG9wdGlvbnMnLFxufTtcblxuZXhwb3J0IGNvbnN0IExvYWRpbmdNZXNzYWdlID0gKHByb3BzOiBOb3RpY2VQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2xvYWRpbmdNZXNzYWdlJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdtZW51LW5vdGljZSc6IHRydWUsXG4gICAgICAgICAgJ21lbnUtbm90aWNlLS1sb2FkaW5nJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbkxvYWRpbmdNZXNzYWdlLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46ICdMb2FkaW5nLi4uJyxcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTWVudSBQb3J0YWxcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgdHlwZSBNZW51UG9ydGFsUHJvcHMgPSBDb21tb25Qcm9wcyAmIHtcbiAgYXBwZW5kVG86IEhUTUxFbGVtZW50LFxuICBjaGlsZHJlbjogTm9kZSwgLy8gaWRlYWxseSBNZW51PE1lbnVQcm9wcz5cbiAgY29udHJvbEVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICBtZW51UGxhY2VtZW50OiBNZW51UGxhY2VtZW50LFxuICBtZW51UG9zaXRpb246IE1lbnVQb3NpdGlvbixcbn07XG50eXBlIE1lbnVQb3J0YWxTdGF0ZSA9IHtcbiAgcGxhY2VtZW50OiAnYm90dG9tJyB8ICd0b3AnIHwgbnVsbCxcbn07XG50eXBlIFBvcnRhbFN0eWxlQXJncyA9IHtcbiAgb2Zmc2V0OiBudW1iZXIsXG4gIHBvc2l0aW9uOiBNZW51UG9zaXRpb24sXG4gIHJlY3Q6IFJlY3RUeXBlLFxufTtcblxuZXhwb3J0IGNvbnN0IG1lbnVQb3J0YWxDU1MgPSAoeyByZWN0LCBvZmZzZXQsIHBvc2l0aW9uIH06IFBvcnRhbFN0eWxlQXJncykgPT4gKHtcbiAgbGVmdDogcmVjdC5sZWZ0LFxuICBwb3NpdGlvbjogcG9zaXRpb24sXG4gIHRvcDogb2Zmc2V0LFxuICB3aWR0aDogcmVjdC53aWR0aCxcbiAgekluZGV4OiAxLFxufSk7XG5cbmV4cG9ydCBjbGFzcyBNZW51UG9ydGFsIGV4dGVuZHMgQ29tcG9uZW50PE1lbnVQb3J0YWxQcm9wcywgTWVudVBvcnRhbFN0YXRlPiB7XG4gIHN0YXRlID0geyBwbGFjZW1lbnQ6IG51bGwgfTtcbiAgc3RhdGljIGNoaWxkQ29udGV4dFR5cGVzID0ge1xuICAgIGdldFBvcnRhbFBsYWNlbWVudDogUHJvcFR5cGVzLmZ1bmMsXG4gIH07XG4gIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0UG9ydGFsUGxhY2VtZW50OiB0aGlzLmdldFBvcnRhbFBsYWNlbWVudCxcbiAgICB9O1xuICB9XG5cbiAgLy8gY2FsbGJhY2sgZm9yIG9jY2Fzc2lvbnMgd2hlcmUgdGhlIG1lbnUgbXVzdCBcImZsaXBcIlxuICBnZXRQb3J0YWxQbGFjZW1lbnQgPSAoeyBwbGFjZW1lbnQgfTogTWVudVN0YXRlKSA9PiB7XG4gICAgY29uc3QgaW5pdGlhbFBsYWNlbWVudCA9IGNvZXJjZVBsYWNlbWVudCh0aGlzLnByb3BzLm1lbnVQbGFjZW1lbnQpO1xuXG4gICAgLy8gYXZvaWQgcmUtcmVuZGVycyBpZiB0aGUgcGxhY2VtZW50IGhhcyBub3QgY2hhbmdlZFxuICAgIGlmIChwbGFjZW1lbnQgIT09IGluaXRpYWxQbGFjZW1lbnQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwbGFjZW1lbnQgfSk7XG4gICAgfVxuICB9O1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgYXBwZW5kVG8sXG4gICAgICBjaGlsZHJlbixcbiAgICAgIGNvbnRyb2xFbGVtZW50LFxuICAgICAgbWVudVBsYWNlbWVudCxcbiAgICAgIG1lbnVQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICBnZXRTdHlsZXMsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaXNGaXhlZCA9IHBvc2l0aW9uID09PSAnZml4ZWQnO1xuXG4gICAgLy8gYmFpbCBlYXJseSBpZiByZXF1aXJlZCBlbGVtZW50cyBhcmVuJ3QgcHJlc2VudFxuICAgIGlmICgoIWFwcGVuZFRvICYmICFpc0ZpeGVkKSB8fCAhY29udHJvbEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHBsYWNlbWVudCA9IHRoaXMuc3RhdGUucGxhY2VtZW50IHx8IGNvZXJjZVBsYWNlbWVudChtZW51UGxhY2VtZW50KTtcbiAgICBjb25zdCByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRPYmooY29udHJvbEVsZW1lbnQpO1xuICAgIGNvbnN0IHNjcm9sbERpc3RhbmNlID0gaXNGaXhlZCA/IDAgOiB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgY29uc3Qgb2Zmc2V0ID0gcmVjdFtwbGFjZW1lbnRdICsgc2Nyb2xsRGlzdGFuY2U7XG4gICAgY29uc3Qgc3RhdGUgPSB7IG9mZnNldCwgcG9zaXRpb24sIHJlY3QgfTtcblxuICAgIC8vIHNhbWUgd3JhcHBlciBlbGVtZW50IHdoZXRoZXIgZml4ZWQgb3IgcG9ydGFsbGVkXG4gICAgY29uc3QgbWVudVdyYXBwZXIgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzKGdldFN0eWxlcygnbWVudVBvcnRhbCcsIHN0YXRlKSl9PntjaGlsZHJlbn08L2Rpdj5cbiAgICApO1xuXG4gICAgcmV0dXJuIGFwcGVuZFRvID8gY3JlYXRlUG9ydGFsKG1lbnVXcmFwcGVyLCBhcHBlbmRUbykgOiBtZW51V3JhcHBlcjtcbiAgfVxufVxuIl19 */')), {
        'menu-list': true,
        'menu-list--is-multi': isMulti
      }, className),
      ref: innerRef
    },
    children
  );
};

// ==============================
// Menu Notices
// ==============================

var noticeCSS = function noticeCSS(_ref6) {
  var _ref6$theme = _ref6.theme,
      baseUnit = _ref6$theme.spacing.baseUnit,
      colors = _ref6$theme.colors;
  return {
    color: colors.neutral40,
    padding: baseUnit * 2 + 'px ' + baseUnit * 3 + 'px',
    textAlign: 'center'
  };
};
var noOptionsMessageCSS = noticeCSS;
var loadingMessageCSS = noticeCSS;

var NoOptionsMessage = function NoOptionsMessage(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;

  return React.createElement(
    'div',
    _extends({
      className: cx( /*#__PURE__*/css(getStyles('noOptionsMessage', props), 'label:NoOptionsMessage;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lbnUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMFpRIiwiZmlsZSI6Ik1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7XG4gIENvbXBvbmVudCxcbiAgdHlwZSBFbGVtZW50IGFzIFJlYWN0RWxlbWVudCxcbiAgdHlwZSBFbGVtZW50UmVmLFxuICB0eXBlIE5vZGUsXG59IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNzcyB9IGZyb20gJ2Vtb3Rpb24nO1xuaW1wb3J0IHsgY3JlYXRlUG9ydGFsIH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCB7XG4gIGFuaW1hdGVkU2Nyb2xsVG8sXG4gIGdldEJvdW5kaW5nQ2xpZW50T2JqLFxuICB0eXBlIFJlY3RUeXBlLFxuICBnZXRTY3JvbGxQYXJlbnQsXG4gIGdldFNjcm9sbFRvcCxcbiAgc2Nyb2xsVG8sXG59IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB0eXBlIHtcbiAgSW5uZXJSZWYsXG4gIE1lbnVQbGFjZW1lbnQsXG4gIE1lbnVQb3NpdGlvbixcbiAgQ29tbW9uUHJvcHMsXG59IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgVGhlbWUgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTWVudVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEdldCBNZW51IFBsYWNlbWVudFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnR5cGUgTWVudVN0YXRlID0ge1xuICBwbGFjZW1lbnQ6ICdib3R0b20nIHwgJ3RvcCcgfCBudWxsLFxuICBtYXhIZWlnaHQ6IG51bWJlcixcbn07XG50eXBlIFBsYWNlbWVudEFyZ3MgPSB7XG4gIG1heEhlaWdodDogbnVtYmVyLFxuICBtZW51RWw6IEVsZW1lbnRSZWY8Kj4sXG4gIG1pbkhlaWdodDogbnVtYmVyLFxuICBwbGFjZW1lbnQ6ICdib3R0b20nIHwgJ3RvcCcgfCAnYXV0bycsXG4gIHNob3VsZFNjcm9sbDogYm9vbGVhbixcbiAgaXNGaXhlZFBvc2l0aW9uOiBib29sZWFuLFxuICB0aGVtZTogVGhlbWUsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVudVBsYWNlbWVudCh7XG4gIG1heEhlaWdodCxcbiAgbWVudUVsLFxuICBtaW5IZWlnaHQsXG4gIHBsYWNlbWVudCxcbiAgc2hvdWxkU2Nyb2xsLFxuICBpc0ZpeGVkUG9zaXRpb24sXG4gIHRoZW1lLFxufTogUGxhY2VtZW50QXJncyk6IE1lbnVTdGF0ZSB7XG4gIGNvbnN0IHsgc3BhY2luZyB9ID0gdGhlbWU7XG4gIGNvbnN0IHNjcm9sbFBhcmVudCA9IGdldFNjcm9sbFBhcmVudChtZW51RWwpO1xuICBjb25zdCBkZWZhdWx0U3RhdGUgPSB7IHBsYWNlbWVudDogJ2JvdHRvbScsIG1heEhlaWdodCB9O1xuXG4gIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nLCByZXR1cm4gZGVmYXVsdCBzdGF0ZVxuICBpZiAoIW1lbnVFbCB8fCAhbWVudUVsLm9mZnNldFBhcmVudCkgcmV0dXJuIGRlZmF1bHRTdGF0ZTtcblxuICAvLyB3ZSBjYW4ndCB0cnVzdCBgc2Nyb2xsUGFyZW50LnNjcm9sbEhlaWdodGAgLS0+IGl0IG1heSBpbmNyZWFzZSB3aGVuXG4gIC8vIHRoZSBtZW51IGlzIHJlbmRlcmVkXG4gIGNvbnN0IHsgaGVpZ2h0OiBzY3JvbGxIZWlnaHQgfSA9IHNjcm9sbFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3Qge1xuICAgIGJvdHRvbTogbWVudUJvdHRvbSxcbiAgICBoZWlnaHQ6IG1lbnVIZWlnaHQsXG4gICAgdG9wOiBtZW51VG9wLFxuICB9ID0gbWVudUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIC8vICRGbG93Rml4TWUgZnVuY3Rpb24gcmV0dXJucyBhYm92ZSBpZiB0aGVyZSdzIG5vIG9mZnNldFBhcmVudFxuICBjb25zdCB7IHRvcDogY29udGFpbmVyVG9wIH0gPSBtZW51RWwub2Zmc2V0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB2aWV3SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICBjb25zdCBzY3JvbGxUb3AgPSBnZXRTY3JvbGxUb3Aoc2Nyb2xsUGFyZW50KTtcblxuICBjb25zdCBtYXJnaW5Cb3R0b20gPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG1lbnVFbCkubWFyZ2luQm90dG9tLCAxMCk7XG4gIGNvbnN0IG1hcmdpblRvcCA9IHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobWVudUVsKS5tYXJnaW5Ub3AsIDEwKTtcbiAgY29uc3Qgdmlld1NwYWNlQWJvdmUgPSBjb250YWluZXJUb3AgLSBtYXJnaW5Ub3A7XG4gIGNvbnN0IHZpZXdTcGFjZUJlbG93ID0gdmlld0hlaWdodCAtIG1lbnVUb3A7XG4gIGNvbnN0IHNjcm9sbFNwYWNlQWJvdmUgPSB2aWV3U3BhY2VBYm92ZSArIHNjcm9sbFRvcDtcbiAgY29uc3Qgc2Nyb2xsU3BhY2VCZWxvdyA9IHNjcm9sbEhlaWdodCAtIHNjcm9sbFRvcCAtIG1lbnVUb3A7XG5cbiAgY29uc3Qgc2Nyb2xsRG93biA9IG1lbnVCb3R0b20gLSB2aWV3SGVpZ2h0ICsgc2Nyb2xsVG9wICsgbWFyZ2luQm90dG9tO1xuICBjb25zdCBzY3JvbGxVcCA9IHNjcm9sbFRvcCArIG1lbnVUb3AgLSBtYXJnaW5Ub3A7XG4gIGNvbnN0IHNjcm9sbER1cmF0aW9uID0gMTYwO1xuXG4gIHN3aXRjaCAocGxhY2VtZW50KSB7XG4gICAgY2FzZSAnYXV0byc6XG4gICAgY2FzZSAnYm90dG9tJzpcbiAgICAgIC8vIDE6IHRoZSBtZW51IHdpbGwgZml0LCBkbyBub3RoaW5nXG4gICAgICBpZiAodmlld1NwYWNlQmVsb3cgPj0gbWVudUhlaWdodCkge1xuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICdib3R0b20nLCBtYXhIZWlnaHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gMjogdGhlIG1lbnUgd2lsbCBmaXQsIGlmIHNjcm9sbGVkXG4gICAgICBpZiAoc2Nyb2xsU3BhY2VCZWxvdyA+PSBtZW51SGVpZ2h0ICYmICFpc0ZpeGVkUG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHNob3VsZFNjcm9sbCkge1xuICAgICAgICAgIGFuaW1hdGVkU2Nyb2xsVG8oc2Nyb2xsUGFyZW50LCBzY3JvbGxEb3duLCBzY3JvbGxEdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICdib3R0b20nLCBtYXhIZWlnaHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gMzogdGhlIG1lbnUgd2lsbCBmaXQsIGlmIGNvbnN0cmFpbmVkXG4gICAgICBpZiAoXG4gICAgICAgICghaXNGaXhlZFBvc2l0aW9uICYmIHNjcm9sbFNwYWNlQmVsb3cgPj0gbWluSGVpZ2h0KSB8fFxuICAgICAgICAoaXNGaXhlZFBvc2l0aW9uICYmIHZpZXdTcGFjZUJlbG93ID49IG1pbkhlaWdodClcbiAgICAgICkge1xuICAgICAgICBpZiAoc2hvdWxkU2Nyb2xsKSB7XG4gICAgICAgICAgYW5pbWF0ZWRTY3JvbGxUbyhzY3JvbGxQYXJlbnQsIHNjcm9sbERvd24sIHNjcm9sbER1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIHdhbnQgdG8gcHJvdmlkZSBhcyBtdWNoIG9mIHRoZSBtZW51IGFzIHBvc3NpYmxlIHRvIHRoZSB1c2VyLFxuICAgICAgICAvLyBzbyBnaXZlIHRoZW0gd2hhdGV2ZXIgaXMgYXZhaWxhYmxlIGJlbG93IHJhdGhlciB0aGFuIHRoZSBtaW5IZWlnaHQuXG4gICAgICAgIGNvbnN0IGNvbnN0cmFpbmVkSGVpZ2h0ID0gaXNGaXhlZFBvc2l0aW9uXG4gICAgICAgICAgPyB2aWV3U3BhY2VCZWxvdyAtIG1hcmdpbkJvdHRvbVxuICAgICAgICAgIDogc2Nyb2xsU3BhY2VCZWxvdyAtIG1hcmdpbkJvdHRvbTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgICAgICAgbWF4SGVpZ2h0OiBjb25zdHJhaW5lZEhlaWdodCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gNC4gRm9ya2VkIGJldmlvdXIgd2hlbiB0aGVyZSBpc24ndCBlbm91Z2ggc3BhY2UgYmVsb3dcblxuICAgICAgLy8gQVVUTzogZmxpcCB0aGUgbWVudSwgcmVuZGVyIGFib3ZlXG4gICAgICBpZiAocGxhY2VtZW50ID09PSAnYXV0bycgfHwgaXNGaXhlZFBvc2l0aW9uKSB7XG4gICAgICAgIC8vIG1heSBuZWVkIHRvIGJlIGNvbnN0cmFpbmVkIGFmdGVyIGZsaXBwaW5nXG4gICAgICAgIGxldCBjb25zdHJhaW5lZEhlaWdodCA9IG1heEhlaWdodDtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgKCFpc0ZpeGVkUG9zaXRpb24gJiYgc2Nyb2xsU3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpIHx8XG4gICAgICAgICAgKGlzRml4ZWRQb3NpdGlvbiAmJiB2aWV3U3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0cmFpbmVkSGVpZ2h0ID0gaXNGaXhlZFBvc2l0aW9uXG4gICAgICAgICAgICA/IHZpZXdTcGFjZUFib3ZlIC0gbWFyZ2luQm90dG9tIC0gc3BhY2luZy5jb250cm9sSGVpZ2h0XG4gICAgICAgICAgICA6IHNjcm9sbFNwYWNlQWJvdmUgLSBtYXJnaW5Cb3R0b20gLSBzcGFjaW5nLmNvbnRyb2xIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICd0b3AnLCBtYXhIZWlnaHQ6IGNvbnN0cmFpbmVkSGVpZ2h0IH07XG4gICAgICB9XG5cbiAgICAgIC8vIEJPVFRPTTogYWxsb3cgYnJvd3NlciB0byBpbmNyZWFzZSBzY3JvbGxhYmxlIGFyZWEgYW5kIGltbWVkaWF0ZWx5IHNldCBzY3JvbGxcbiAgICAgIGlmIChwbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHNjcm9sbFRvKHNjcm9sbFBhcmVudCwgc2Nyb2xsRG93bik7XG4gICAgICAgIHJldHVybiB7IHBsYWNlbWVudDogJ2JvdHRvbScsIG1heEhlaWdodCB9O1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndG9wJzpcbiAgICAgIC8vIDE6IHRoZSBtZW51IHdpbGwgZml0LCBkbyBub3RoaW5nXG4gICAgICBpZiAodmlld1NwYWNlQWJvdmUgPj0gbWVudUhlaWdodCkge1xuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICd0b3AnLCBtYXhIZWlnaHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gMjogdGhlIG1lbnUgd2lsbCBmaXQsIGlmIHNjcm9sbGVkXG4gICAgICBpZiAoc2Nyb2xsU3BhY2VBYm92ZSA+PSBtZW51SGVpZ2h0ICYmICFpc0ZpeGVkUG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHNob3VsZFNjcm9sbCkge1xuICAgICAgICAgIGFuaW1hdGVkU2Nyb2xsVG8oc2Nyb2xsUGFyZW50LCBzY3JvbGxVcCwgc2Nyb2xsRHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgcGxhY2VtZW50OiAndG9wJywgbWF4SGVpZ2h0IH07XG4gICAgICB9XG5cbiAgICAgIC8vIDM6IHRoZSBtZW51IHdpbGwgZml0LCBpZiBjb25zdHJhaW5lZFxuICAgICAgaWYgKFxuICAgICAgICAoIWlzRml4ZWRQb3NpdGlvbiAmJiBzY3JvbGxTcGFjZUFib3ZlID49IG1pbkhlaWdodCkgfHxcbiAgICAgICAgKGlzRml4ZWRQb3NpdGlvbiAmJiB2aWV3U3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpXG4gICAgICApIHtcbiAgICAgICAgbGV0IGNvbnN0cmFpbmVkSGVpZ2h0ID0gbWF4SGVpZ2h0O1xuXG4gICAgICAgIC8vIHdlIHdhbnQgdG8gcHJvdmlkZSBhcyBtdWNoIG9mIHRoZSBtZW51IGFzIHBvc3NpYmxlIHRvIHRoZSB1c2VyLFxuICAgICAgICAvLyBzbyBnaXZlIHRoZW0gd2hhdGV2ZXIgaXMgYXZhaWxhYmxlIGJlbG93IHJhdGhlciB0aGFuIHRoZSBtaW5IZWlnaHQuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAoIWlzRml4ZWRQb3NpdGlvbiAmJiBzY3JvbGxTcGFjZUFib3ZlID49IG1pbkhlaWdodCkgfHxcbiAgICAgICAgICAoaXNGaXhlZFBvc2l0aW9uICYmIHZpZXdTcGFjZUFib3ZlID49IG1pbkhlaWdodClcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3RyYWluZWRIZWlnaHQgPSBpc0ZpeGVkUG9zaXRpb25cbiAgICAgICAgICAgID8gdmlld1NwYWNlQWJvdmUgLSBtYXJnaW5Ub3BcbiAgICAgICAgICAgIDogc2Nyb2xsU3BhY2VBYm92ZSAtIG1hcmdpblRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG91bGRTY3JvbGwpIHtcbiAgICAgICAgICBhbmltYXRlZFNjcm9sbFRvKHNjcm9sbFBhcmVudCwgc2Nyb2xsVXAsIHNjcm9sbER1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgICAgICBtYXhIZWlnaHQ6IGNvbnN0cmFpbmVkSGVpZ2h0LFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyA0LiBub3QgZW5vdWdoIHNwYWNlLCB0aGUgYnJvd3NlciBXSUxMIE5PVCBpbmNyZWFzZSBzY3JvbGxhYmxlIGFyZWEgd2hlblxuICAgICAgLy8gYWJzb2x1dGVseSBwb3NpdGlvbmVkIGVsZW1lbnQgcmVuZGVyZWQgYWJvdmUgdGhlIHZpZXdwb3J0IChvbmx5IGJlbG93KS5cbiAgICAgIC8vIEZsaXAgdGhlIG1lbnUsIHJlbmRlciBiZWxvd1xuICAgICAgcmV0dXJuIHsgcGxhY2VtZW50OiAnYm90dG9tJywgbWF4SGVpZ2h0IH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwbGFjZW1lbnQgcHJvdmlkZWQgXCIke3BsYWNlbWVudH1cIi5gKTtcbiAgfVxuXG4gIC8vIGZ1bGZpbCBjb250cmFjdCB3aXRoIGZsb3c6IGltcGxpY2l0IHJldHVybiB2YWx1ZSBvZiB1bmRlZmluZWRcbiAgcmV0dXJuIGRlZmF1bHRTdGF0ZTtcbn1cblxuLy8gTWVudSBDb21wb25lbnRcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgdHlwZSBNZW51QW5kUGxhY2VyQ29tbW9uID0gQ29tbW9uUHJvcHMgJiB7XG4gIC8qKiBDYWxsYmFjayB0byB1cGRhdGUgdGhlIHBvcnRhbCBhZnRlciBwb3NzaWJsZSBmbGlwLiAqL1xuICBnZXRQb3J0YWxQbGFjZW1lbnQ6IE1lbnVTdGF0ZSA9PiB2b2lkLFxuICAvKiogUHJvcHMgdG8gYmUgcGFzc2VkIHRvIHRoZSBtZW51IHdyYXBwZXIuICovXG4gIGlubmVyUHJvcHM6IE9iamVjdCxcbiAgLyoqIFNldCB0aGUgbWF4aW11bSBoZWlnaHQgb2YgdGhlIG1lbnUuICovXG4gIG1heE1lbnVIZWlnaHQ6IG51bWJlcixcbiAgLyoqIFNldCB3aGV0aGVyIHRoZSBtZW51IHNob3VsZCBiZSBhdCB0aGUgdG9wLCBhdCB0aGUgYm90dG9tLiBUaGUgYXV0byBvcHRpb25zIHNldHMgaXQgdG8gYm90dG9tLiAqL1xuICBtZW51UGxhY2VtZW50OiBNZW51UGxhY2VtZW50LFxuICAvKiBUaGUgQ1NTIHBvc2l0aW9uIHZhbHVlIG9mIHRoZSBtZW51LCB3aGVuIFwiZml4ZWRcIiBleHRyYSBsYXlvdXQgbWFuYWdlbWVudCBpcyByZXF1aXJlZCAqL1xuICBtZW51UG9zaXRpb246IE1lbnVQb3NpdGlvbixcbiAgLyoqIFNldCB0aGUgbWluaW11bSBoZWlnaHQgb2YgdGhlIG1lbnUuICovXG4gIG1pbk1lbnVIZWlnaHQ6IG51bWJlcixcbiAgLyoqIFNldCB3aGV0aGVyIHRoZSBwYWdlIHNob3VsZCBzY3JvbGwgdG8gc2hvdyB0aGUgbWVudS4gKi9cbiAgbWVudVNob3VsZFNjcm9sbEludG9WaWV3OiBib29sZWFuLFxufTtcbmV4cG9ydCB0eXBlIE1lbnVQcm9wcyA9IE1lbnVBbmRQbGFjZXJDb21tb24gJiB7XG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIGVsZW1lbnQsIGNvbnN1bWVkIGJ5IHRoZSBNZW51UGxhY2VyIGNvbXBvbmVudCAqL1xuICBpbm5lclJlZjogRWxlbWVudFJlZjwqPixcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgY2hpbGRyZW46IFJlYWN0RWxlbWVudDwqPixcbn07XG5leHBvcnQgdHlwZSBNZW51UGxhY2VyUHJvcHMgPSBNZW51QW5kUGxhY2VyQ29tbW9uICYge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBjaGlsZHJlbjogKHt9KSA9PiBOb2RlLFxufTtcblxuZnVuY3Rpb24gYWxpZ25Ub0NvbnRyb2wocGxhY2VtZW50KSB7XG4gIGNvbnN0IHBsYWNlbWVudFRvQ1NTUHJvcCA9IHsgYm90dG9tOiAndG9wJywgdG9wOiAnYm90dG9tJyB9O1xuICByZXR1cm4gcGxhY2VtZW50ID8gcGxhY2VtZW50VG9DU1NQcm9wW3BsYWNlbWVudF0gOiAnYm90dG9tJztcbn1cbmNvbnN0IGNvZXJjZVBsYWNlbWVudCA9IHAgPT4gKHAgPT09ICdhdXRvJyA/ICdib3R0b20nIDogcCk7XG5cbnR5cGUgTWVudVN0YXRlV2l0aFByb3BzID0gTWVudVN0YXRlICYgTWVudVByb3BzO1xuXG5leHBvcnQgY29uc3QgbWVudUNTUyA9ICh7XG4gIHBsYWNlbWVudCxcbiAgdGhlbWU6IHsgYm9yZGVyUmFkaXVzLCBzcGFjaW5nLCBjb2xvcnMgfSxcbn06IE1lbnVTdGF0ZVdpdGhQcm9wcykgPT4gKHtcbiAgW2FsaWduVG9Db250cm9sKHBsYWNlbWVudCldOiAnMTAwJScsXG4gIGJhY2tncm91bmRDb2xvcjogY29sb3JzLm5ldXRyYWwwLFxuICBib3JkZXJSYWRpdXM6IGJvcmRlclJhZGl1cyxcbiAgYm94U2hhZG93OiAnMCAwIDAgMXB4IGhzbGEoMCwgMCUsIDAlLCAwLjEpLCAwIDRweCAxMXB4IGhzbGEoMCwgMCUsIDAlLCAwLjEpJyxcbiAgbWFyZ2luQm90dG9tOiBzcGFjaW5nLm1lbnVHdXR0ZXIsXG4gIG1hcmdpblRvcDogc3BhY2luZy5tZW51R3V0dGVyLFxuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgd2lkdGg6ICcxMDAlJyxcbiAgekluZGV4OiAxLFxufSk7XG5cbi8vIE5PVEU6IGludGVybmFsIG9ubHlcbmV4cG9ydCBjbGFzcyBNZW51UGxhY2VyIGV4dGVuZHMgQ29tcG9uZW50PE1lbnVQbGFjZXJQcm9wcywgTWVudVN0YXRlPiB7XG4gIHN0YXRlID0ge1xuICAgIG1heEhlaWdodDogdGhpcy5wcm9wcy5tYXhNZW51SGVpZ2h0LFxuICAgIHBsYWNlbWVudDogbnVsbCxcbiAgfTtcbiAgc3RhdGljIGNvbnRleHRUeXBlcyA9IHtcbiAgICBnZXRQb3J0YWxQbGFjZW1lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICB9O1xuICBnZXRQbGFjZW1lbnQgPSAocmVmOiBFbGVtZW50UmVmPCo+KSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgbWluTWVudUhlaWdodCxcbiAgICAgIG1heE1lbnVIZWlnaHQsXG4gICAgICBtZW51UGxhY2VtZW50LFxuICAgICAgbWVudVBvc2l0aW9uLFxuICAgICAgbWVudVNob3VsZFNjcm9sbEludG9WaWV3LFxuICAgICAgdGhlbWUsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBnZXRQb3J0YWxQbGFjZW1lbnQgfSA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmICghcmVmKSByZXR1cm47XG5cbiAgICAvLyBETyBOT1Qgc2Nyb2xsIGlmIHBvc2l0aW9uIGlzIGZpeGVkXG4gICAgY29uc3QgaXNGaXhlZFBvc2l0aW9uID0gbWVudVBvc2l0aW9uID09PSAnZml4ZWQnO1xuICAgIGNvbnN0IHNob3VsZFNjcm9sbCA9IG1lbnVTaG91bGRTY3JvbGxJbnRvVmlldyAmJiAhaXNGaXhlZFBvc2l0aW9uO1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRNZW51UGxhY2VtZW50KHtcbiAgICAgIG1heEhlaWdodDogbWF4TWVudUhlaWdodCxcbiAgICAgIG1lbnVFbDogcmVmLFxuICAgICAgbWluSGVpZ2h0OiBtaW5NZW51SGVpZ2h0LFxuICAgICAgcGxhY2VtZW50OiBtZW51UGxhY2VtZW50LFxuICAgICAgc2hvdWxkU2Nyb2xsLFxuICAgICAgaXNGaXhlZFBvc2l0aW9uLFxuICAgICAgdGhlbWUsXG4gICAgfSk7XG5cbiAgICBpZiAoZ2V0UG9ydGFsUGxhY2VtZW50KSBnZXRQb3J0YWxQbGFjZW1lbnQoc3RhdGUpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gIH07XG4gIGdldFVwZGF0ZWRQcm9wcyA9ICgpID0+IHtcbiAgICBjb25zdCB7IG1lbnVQbGFjZW1lbnQgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgcGxhY2VtZW50ID0gdGhpcy5zdGF0ZS5wbGFjZW1lbnQgfHwgY29lcmNlUGxhY2VtZW50KG1lbnVQbGFjZW1lbnQpO1xuXG4gICAgcmV0dXJuIHsgLi4udGhpcy5wcm9wcywgcGxhY2VtZW50LCBtYXhIZWlnaHQ6IHRoaXMuc3RhdGUubWF4SGVpZ2h0IH07XG4gIH07XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIGNoaWxkcmVuKHtcbiAgICAgIHJlZjogdGhpcy5nZXRQbGFjZW1lbnQsXG4gICAgICBwbGFjZXJQcm9wczogdGhpcy5nZXRVcGRhdGVkUHJvcHMoKSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBNZW51ID0gKHByb3BzOiBNZW51UHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclJlZiwgaW5uZXJQcm9wcyB9ID0gcHJvcHM7XG4gIGNvbnN0IGNuID0gY3goY3NzKGdldFN0eWxlcygnbWVudScsIHByb3BzKSksIHsgbWVudTogdHJ1ZSB9LCBjbGFzc05hbWUpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NufSB7Li4uaW5uZXJQcm9wc30gcmVmPXtpbm5lclJlZn0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBNZW51O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1lbnUgTGlzdFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbnR5cGUgTWVudUxpc3RTdGF0ZSA9IHtcbiAgLyoqIFNldCBjbGFzc25hbWUgZm9yIGlzTXVsdGkgKi9cbiAgaXNNdWx0aTogYm9vbGVhbixcbiAgLyogU2V0IHRoZSBtYXggaGVpZ2h0IG9mIHRoZSBNZW51IGNvbXBvbmVudCAgKi9cbiAgbWF4SGVpZ2h0OiBudW1iZXIsXG59O1xuXG5leHBvcnQgdHlwZSBNZW51TGlzdFByb3BzID0ge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBjaGlsZHJlbjogTm9kZSxcbiAgLyoqIElubmVyIHJlZiB0byBET00gTm9kZSAqL1xuICBpbm5lclJlZjogSW5uZXJSZWYsXG59O1xuZXhwb3J0IHR5cGUgTWVudUxpc3RDb21wb25lbnRQcm9wcyA9IENvbW1vblByb3BzICZcbiAgTWVudUxpc3RQcm9wcyAmXG4gIE1lbnVMaXN0U3RhdGU7XG5leHBvcnQgY29uc3QgbWVudUxpc3RDU1MgPSAoe1xuICBtYXhIZWlnaHQsXG4gIHRoZW1lOiB7XG4gICAgc3BhY2luZzogeyBiYXNlVW5pdCB9LFxuICB9LFxufTogTWVudUxpc3RDb21wb25lbnRQcm9wcykgPT4gKHtcbiAgbWF4SGVpZ2h0LFxuICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgcGFkZGluZ0JvdHRvbTogYmFzZVVuaXQsXG4gIHBhZGRpbmdUb3A6IGJhc2VVbml0LFxuICBwb3NpdGlvbjogJ3JlbGF0aXZlJywgLy8gcmVxdWlyZWQgZm9yIG9mZnNldFtIZWlnaHQsIFRvcF0gPiBrZXlib2FyZCBzY3JvbGxcbiAgV2Via2l0T3ZlcmZsb3dTY3JvbGxpbmc6ICd0b3VjaCcsXG59KTtcbmV4cG9ydCBjb25zdCBNZW51TGlzdCA9IChwcm9wczogTWVudUxpc3RDb21wb25lbnRQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlzTXVsdGksIGlubmVyUmVmIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdtZW51TGlzdCcsIHByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnbWVudS1saXN0JzogdHJ1ZSxcbiAgICAgICAgICAnbWVudS1saXN0LS1pcy1tdWx0aSc6IGlzTXVsdGksXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHJlZj17aW5uZXJSZWZ9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNZW51IE5vdGljZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBub3RpY2VDU1MgPSAoe1xuICB0aGVtZToge1xuICAgIHNwYWNpbmc6IHsgYmFzZVVuaXQgfSxcbiAgICBjb2xvcnMsXG4gIH0sXG59OiBOb3RpY2VQcm9wcykgPT4gKHtcbiAgY29sb3I6IGNvbG9ycy5uZXV0cmFsNDAsXG4gIHBhZGRpbmc6IGAke2Jhc2VVbml0ICogMn1weCAke2Jhc2VVbml0ICogM31weGAsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG59KTtcbmV4cG9ydCBjb25zdCBub09wdGlvbnNNZXNzYWdlQ1NTID0gbm90aWNlQ1NTO1xuZXhwb3J0IGNvbnN0IGxvYWRpbmdNZXNzYWdlQ1NTID0gbm90aWNlQ1NTO1xuXG5leHBvcnQgdHlwZSBOb3RpY2VQcm9wcyA9IENvbW1vblByb3BzICYge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBjaGlsZHJlbjogTm9kZSxcbiAgLyoqIFByb3BzIHRvIGJlIHBhc3NlZCBvbiB0byB0aGUgd3JhcHBlci4gKi9cbiAgaW5uZXJQcm9wczogeyBbc3RyaW5nXTogYW55IH0sXG59O1xuXG5leHBvcnQgY29uc3QgTm9PcHRpb25zTWVzc2FnZSA9IChwcm9wczogTm90aWNlUHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdub09wdGlvbnNNZXNzYWdlJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdtZW51LW5vdGljZSc6IHRydWUsXG4gICAgICAgICAgJ21lbnUtbm90aWNlLS1uby1vcHRpb25zJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbk5vT3B0aW9uc01lc3NhZ2UuZGVmYXVsdFByb3BzID0ge1xuICBjaGlsZHJlbjogJ05vIG9wdGlvbnMnLFxufTtcblxuZXhwb3J0IGNvbnN0IExvYWRpbmdNZXNzYWdlID0gKHByb3BzOiBOb3RpY2VQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2xvYWRpbmdNZXNzYWdlJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdtZW51LW5vdGljZSc6IHRydWUsXG4gICAgICAgICAgJ21lbnUtbm90aWNlLS1sb2FkaW5nJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbkxvYWRpbmdNZXNzYWdlLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46ICdMb2FkaW5nLi4uJyxcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTWVudSBQb3J0YWxcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgdHlwZSBNZW51UG9ydGFsUHJvcHMgPSBDb21tb25Qcm9wcyAmIHtcbiAgYXBwZW5kVG86IEhUTUxFbGVtZW50LFxuICBjaGlsZHJlbjogTm9kZSwgLy8gaWRlYWxseSBNZW51PE1lbnVQcm9wcz5cbiAgY29udHJvbEVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICBtZW51UGxhY2VtZW50OiBNZW51UGxhY2VtZW50LFxuICBtZW51UG9zaXRpb246IE1lbnVQb3NpdGlvbixcbn07XG50eXBlIE1lbnVQb3J0YWxTdGF0ZSA9IHtcbiAgcGxhY2VtZW50OiAnYm90dG9tJyB8ICd0b3AnIHwgbnVsbCxcbn07XG50eXBlIFBvcnRhbFN0eWxlQXJncyA9IHtcbiAgb2Zmc2V0OiBudW1iZXIsXG4gIHBvc2l0aW9uOiBNZW51UG9zaXRpb24sXG4gIHJlY3Q6IFJlY3RUeXBlLFxufTtcblxuZXhwb3J0IGNvbnN0IG1lbnVQb3J0YWxDU1MgPSAoeyByZWN0LCBvZmZzZXQsIHBvc2l0aW9uIH06IFBvcnRhbFN0eWxlQXJncykgPT4gKHtcbiAgbGVmdDogcmVjdC5sZWZ0LFxuICBwb3NpdGlvbjogcG9zaXRpb24sXG4gIHRvcDogb2Zmc2V0LFxuICB3aWR0aDogcmVjdC53aWR0aCxcbiAgekluZGV4OiAxLFxufSk7XG5cbmV4cG9ydCBjbGFzcyBNZW51UG9ydGFsIGV4dGVuZHMgQ29tcG9uZW50PE1lbnVQb3J0YWxQcm9wcywgTWVudVBvcnRhbFN0YXRlPiB7XG4gIHN0YXRlID0geyBwbGFjZW1lbnQ6IG51bGwgfTtcbiAgc3RhdGljIGNoaWxkQ29udGV4dFR5cGVzID0ge1xuICAgIGdldFBvcnRhbFBsYWNlbWVudDogUHJvcFR5cGVzLmZ1bmMsXG4gIH07XG4gIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0UG9ydGFsUGxhY2VtZW50OiB0aGlzLmdldFBvcnRhbFBsYWNlbWVudCxcbiAgICB9O1xuICB9XG5cbiAgLy8gY2FsbGJhY2sgZm9yIG9jY2Fzc2lvbnMgd2hlcmUgdGhlIG1lbnUgbXVzdCBcImZsaXBcIlxuICBnZXRQb3J0YWxQbGFjZW1lbnQgPSAoeyBwbGFjZW1lbnQgfTogTWVudVN0YXRlKSA9PiB7XG4gICAgY29uc3QgaW5pdGlhbFBsYWNlbWVudCA9IGNvZXJjZVBsYWNlbWVudCh0aGlzLnByb3BzLm1lbnVQbGFjZW1lbnQpO1xuXG4gICAgLy8gYXZvaWQgcmUtcmVuZGVycyBpZiB0aGUgcGxhY2VtZW50IGhhcyBub3QgY2hhbmdlZFxuICAgIGlmIChwbGFjZW1lbnQgIT09IGluaXRpYWxQbGFjZW1lbnQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwbGFjZW1lbnQgfSk7XG4gICAgfVxuICB9O1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgYXBwZW5kVG8sXG4gICAgICBjaGlsZHJlbixcbiAgICAgIGNvbnRyb2xFbGVtZW50LFxuICAgICAgbWVudVBsYWNlbWVudCxcbiAgICAgIG1lbnVQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICBnZXRTdHlsZXMsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaXNGaXhlZCA9IHBvc2l0aW9uID09PSAnZml4ZWQnO1xuXG4gICAgLy8gYmFpbCBlYXJseSBpZiByZXF1aXJlZCBlbGVtZW50cyBhcmVuJ3QgcHJlc2VudFxuICAgIGlmICgoIWFwcGVuZFRvICYmICFpc0ZpeGVkKSB8fCAhY29udHJvbEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHBsYWNlbWVudCA9IHRoaXMuc3RhdGUucGxhY2VtZW50IHx8IGNvZXJjZVBsYWNlbWVudChtZW51UGxhY2VtZW50KTtcbiAgICBjb25zdCByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRPYmooY29udHJvbEVsZW1lbnQpO1xuICAgIGNvbnN0IHNjcm9sbERpc3RhbmNlID0gaXNGaXhlZCA/IDAgOiB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgY29uc3Qgb2Zmc2V0ID0gcmVjdFtwbGFjZW1lbnRdICsgc2Nyb2xsRGlzdGFuY2U7XG4gICAgY29uc3Qgc3RhdGUgPSB7IG9mZnNldCwgcG9zaXRpb24sIHJlY3QgfTtcblxuICAgIC8vIHNhbWUgd3JhcHBlciBlbGVtZW50IHdoZXRoZXIgZml4ZWQgb3IgcG9ydGFsbGVkXG4gICAgY29uc3QgbWVudVdyYXBwZXIgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzKGdldFN0eWxlcygnbWVudVBvcnRhbCcsIHN0YXRlKSl9PntjaGlsZHJlbn08L2Rpdj5cbiAgICApO1xuXG4gICAgcmV0dXJuIGFwcGVuZFRvID8gY3JlYXRlUG9ydGFsKG1lbnVXcmFwcGVyLCBhcHBlbmRUbykgOiBtZW51V3JhcHBlcjtcbiAgfVxufVxuIl19 */')), {
        'menu-notice': true,
        'menu-notice--no-options': true
      }, className)
    }, innerProps),
    children
  );
};
NoOptionsMessage.defaultProps = {
  children: 'No options'
};

var LoadingMessage = function LoadingMessage(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;

  return React.createElement(
    'div',
    _extends({
      className: cx( /*#__PURE__*/css(getStyles('loadingMessage', props), 'label:LoadingMessage;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lbnUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ2JRIiwiZmlsZSI6Ik1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7XG4gIENvbXBvbmVudCxcbiAgdHlwZSBFbGVtZW50IGFzIFJlYWN0RWxlbWVudCxcbiAgdHlwZSBFbGVtZW50UmVmLFxuICB0eXBlIE5vZGUsXG59IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNzcyB9IGZyb20gJ2Vtb3Rpb24nO1xuaW1wb3J0IHsgY3JlYXRlUG9ydGFsIH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCB7XG4gIGFuaW1hdGVkU2Nyb2xsVG8sXG4gIGdldEJvdW5kaW5nQ2xpZW50T2JqLFxuICB0eXBlIFJlY3RUeXBlLFxuICBnZXRTY3JvbGxQYXJlbnQsXG4gIGdldFNjcm9sbFRvcCxcbiAgc2Nyb2xsVG8sXG59IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB0eXBlIHtcbiAgSW5uZXJSZWYsXG4gIE1lbnVQbGFjZW1lbnQsXG4gIE1lbnVQb3NpdGlvbixcbiAgQ29tbW9uUHJvcHMsXG59IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgVGhlbWUgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTWVudVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEdldCBNZW51IFBsYWNlbWVudFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnR5cGUgTWVudVN0YXRlID0ge1xuICBwbGFjZW1lbnQ6ICdib3R0b20nIHwgJ3RvcCcgfCBudWxsLFxuICBtYXhIZWlnaHQ6IG51bWJlcixcbn07XG50eXBlIFBsYWNlbWVudEFyZ3MgPSB7XG4gIG1heEhlaWdodDogbnVtYmVyLFxuICBtZW51RWw6IEVsZW1lbnRSZWY8Kj4sXG4gIG1pbkhlaWdodDogbnVtYmVyLFxuICBwbGFjZW1lbnQ6ICdib3R0b20nIHwgJ3RvcCcgfCAnYXV0bycsXG4gIHNob3VsZFNjcm9sbDogYm9vbGVhbixcbiAgaXNGaXhlZFBvc2l0aW9uOiBib29sZWFuLFxuICB0aGVtZTogVGhlbWUsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVudVBsYWNlbWVudCh7XG4gIG1heEhlaWdodCxcbiAgbWVudUVsLFxuICBtaW5IZWlnaHQsXG4gIHBsYWNlbWVudCxcbiAgc2hvdWxkU2Nyb2xsLFxuICBpc0ZpeGVkUG9zaXRpb24sXG4gIHRoZW1lLFxufTogUGxhY2VtZW50QXJncyk6IE1lbnVTdGF0ZSB7XG4gIGNvbnN0IHsgc3BhY2luZyB9ID0gdGhlbWU7XG4gIGNvbnN0IHNjcm9sbFBhcmVudCA9IGdldFNjcm9sbFBhcmVudChtZW51RWwpO1xuICBjb25zdCBkZWZhdWx0U3RhdGUgPSB7IHBsYWNlbWVudDogJ2JvdHRvbScsIG1heEhlaWdodCB9O1xuXG4gIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nLCByZXR1cm4gZGVmYXVsdCBzdGF0ZVxuICBpZiAoIW1lbnVFbCB8fCAhbWVudUVsLm9mZnNldFBhcmVudCkgcmV0dXJuIGRlZmF1bHRTdGF0ZTtcblxuICAvLyB3ZSBjYW4ndCB0cnVzdCBgc2Nyb2xsUGFyZW50LnNjcm9sbEhlaWdodGAgLS0+IGl0IG1heSBpbmNyZWFzZSB3aGVuXG4gIC8vIHRoZSBtZW51IGlzIHJlbmRlcmVkXG4gIGNvbnN0IHsgaGVpZ2h0OiBzY3JvbGxIZWlnaHQgfSA9IHNjcm9sbFBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3Qge1xuICAgIGJvdHRvbTogbWVudUJvdHRvbSxcbiAgICBoZWlnaHQ6IG1lbnVIZWlnaHQsXG4gICAgdG9wOiBtZW51VG9wLFxuICB9ID0gbWVudUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIC8vICRGbG93Rml4TWUgZnVuY3Rpb24gcmV0dXJucyBhYm92ZSBpZiB0aGVyZSdzIG5vIG9mZnNldFBhcmVudFxuICBjb25zdCB7IHRvcDogY29udGFpbmVyVG9wIH0gPSBtZW51RWwub2Zmc2V0UGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB2aWV3SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICBjb25zdCBzY3JvbGxUb3AgPSBnZXRTY3JvbGxUb3Aoc2Nyb2xsUGFyZW50KTtcblxuICBjb25zdCBtYXJnaW5Cb3R0b20gPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG1lbnVFbCkubWFyZ2luQm90dG9tLCAxMCk7XG4gIGNvbnN0IG1hcmdpblRvcCA9IHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobWVudUVsKS5tYXJnaW5Ub3AsIDEwKTtcbiAgY29uc3Qgdmlld1NwYWNlQWJvdmUgPSBjb250YWluZXJUb3AgLSBtYXJnaW5Ub3A7XG4gIGNvbnN0IHZpZXdTcGFjZUJlbG93ID0gdmlld0hlaWdodCAtIG1lbnVUb3A7XG4gIGNvbnN0IHNjcm9sbFNwYWNlQWJvdmUgPSB2aWV3U3BhY2VBYm92ZSArIHNjcm9sbFRvcDtcbiAgY29uc3Qgc2Nyb2xsU3BhY2VCZWxvdyA9IHNjcm9sbEhlaWdodCAtIHNjcm9sbFRvcCAtIG1lbnVUb3A7XG5cbiAgY29uc3Qgc2Nyb2xsRG93biA9IG1lbnVCb3R0b20gLSB2aWV3SGVpZ2h0ICsgc2Nyb2xsVG9wICsgbWFyZ2luQm90dG9tO1xuICBjb25zdCBzY3JvbGxVcCA9IHNjcm9sbFRvcCArIG1lbnVUb3AgLSBtYXJnaW5Ub3A7XG4gIGNvbnN0IHNjcm9sbER1cmF0aW9uID0gMTYwO1xuXG4gIHN3aXRjaCAocGxhY2VtZW50KSB7XG4gICAgY2FzZSAnYXV0byc6XG4gICAgY2FzZSAnYm90dG9tJzpcbiAgICAgIC8vIDE6IHRoZSBtZW51IHdpbGwgZml0LCBkbyBub3RoaW5nXG4gICAgICBpZiAodmlld1NwYWNlQmVsb3cgPj0gbWVudUhlaWdodCkge1xuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICdib3R0b20nLCBtYXhIZWlnaHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gMjogdGhlIG1lbnUgd2lsbCBmaXQsIGlmIHNjcm9sbGVkXG4gICAgICBpZiAoc2Nyb2xsU3BhY2VCZWxvdyA+PSBtZW51SGVpZ2h0ICYmICFpc0ZpeGVkUG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHNob3VsZFNjcm9sbCkge1xuICAgICAgICAgIGFuaW1hdGVkU2Nyb2xsVG8oc2Nyb2xsUGFyZW50LCBzY3JvbGxEb3duLCBzY3JvbGxEdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICdib3R0b20nLCBtYXhIZWlnaHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gMzogdGhlIG1lbnUgd2lsbCBmaXQsIGlmIGNvbnN0cmFpbmVkXG4gICAgICBpZiAoXG4gICAgICAgICghaXNGaXhlZFBvc2l0aW9uICYmIHNjcm9sbFNwYWNlQmVsb3cgPj0gbWluSGVpZ2h0KSB8fFxuICAgICAgICAoaXNGaXhlZFBvc2l0aW9uICYmIHZpZXdTcGFjZUJlbG93ID49IG1pbkhlaWdodClcbiAgICAgICkge1xuICAgICAgICBpZiAoc2hvdWxkU2Nyb2xsKSB7XG4gICAgICAgICAgYW5pbWF0ZWRTY3JvbGxUbyhzY3JvbGxQYXJlbnQsIHNjcm9sbERvd24sIHNjcm9sbER1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIHdhbnQgdG8gcHJvdmlkZSBhcyBtdWNoIG9mIHRoZSBtZW51IGFzIHBvc3NpYmxlIHRvIHRoZSB1c2VyLFxuICAgICAgICAvLyBzbyBnaXZlIHRoZW0gd2hhdGV2ZXIgaXMgYXZhaWxhYmxlIGJlbG93IHJhdGhlciB0aGFuIHRoZSBtaW5IZWlnaHQuXG4gICAgICAgIGNvbnN0IGNvbnN0cmFpbmVkSGVpZ2h0ID0gaXNGaXhlZFBvc2l0aW9uXG4gICAgICAgICAgPyB2aWV3U3BhY2VCZWxvdyAtIG1hcmdpbkJvdHRvbVxuICAgICAgICAgIDogc2Nyb2xsU3BhY2VCZWxvdyAtIG1hcmdpbkJvdHRvbTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgICAgICAgbWF4SGVpZ2h0OiBjb25zdHJhaW5lZEhlaWdodCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gNC4gRm9ya2VkIGJldmlvdXIgd2hlbiB0aGVyZSBpc24ndCBlbm91Z2ggc3BhY2UgYmVsb3dcblxuICAgICAgLy8gQVVUTzogZmxpcCB0aGUgbWVudSwgcmVuZGVyIGFib3ZlXG4gICAgICBpZiAocGxhY2VtZW50ID09PSAnYXV0bycgfHwgaXNGaXhlZFBvc2l0aW9uKSB7XG4gICAgICAgIC8vIG1heSBuZWVkIHRvIGJlIGNvbnN0cmFpbmVkIGFmdGVyIGZsaXBwaW5nXG4gICAgICAgIGxldCBjb25zdHJhaW5lZEhlaWdodCA9IG1heEhlaWdodDtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgKCFpc0ZpeGVkUG9zaXRpb24gJiYgc2Nyb2xsU3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpIHx8XG4gICAgICAgICAgKGlzRml4ZWRQb3NpdGlvbiAmJiB2aWV3U3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0cmFpbmVkSGVpZ2h0ID0gaXNGaXhlZFBvc2l0aW9uXG4gICAgICAgICAgICA/IHZpZXdTcGFjZUFib3ZlIC0gbWFyZ2luQm90dG9tIC0gc3BhY2luZy5jb250cm9sSGVpZ2h0XG4gICAgICAgICAgICA6IHNjcm9sbFNwYWNlQWJvdmUgLSBtYXJnaW5Cb3R0b20gLSBzcGFjaW5nLmNvbnRyb2xIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICd0b3AnLCBtYXhIZWlnaHQ6IGNvbnN0cmFpbmVkSGVpZ2h0IH07XG4gICAgICB9XG5cbiAgICAgIC8vIEJPVFRPTTogYWxsb3cgYnJvd3NlciB0byBpbmNyZWFzZSBzY3JvbGxhYmxlIGFyZWEgYW5kIGltbWVkaWF0ZWx5IHNldCBzY3JvbGxcbiAgICAgIGlmIChwbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHNjcm9sbFRvKHNjcm9sbFBhcmVudCwgc2Nyb2xsRG93bik7XG4gICAgICAgIHJldHVybiB7IHBsYWNlbWVudDogJ2JvdHRvbScsIG1heEhlaWdodCB9O1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndG9wJzpcbiAgICAgIC8vIDE6IHRoZSBtZW51IHdpbGwgZml0LCBkbyBub3RoaW5nXG4gICAgICBpZiAodmlld1NwYWNlQWJvdmUgPj0gbWVudUhlaWdodCkge1xuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICd0b3AnLCBtYXhIZWlnaHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gMjogdGhlIG1lbnUgd2lsbCBmaXQsIGlmIHNjcm9sbGVkXG4gICAgICBpZiAoc2Nyb2xsU3BhY2VBYm92ZSA+PSBtZW51SGVpZ2h0ICYmICFpc0ZpeGVkUG9zaXRpb24pIHtcbiAgICAgICAgaWYgKHNob3VsZFNjcm9sbCkge1xuICAgICAgICAgIGFuaW1hdGVkU2Nyb2xsVG8oc2Nyb2xsUGFyZW50LCBzY3JvbGxVcCwgc2Nyb2xsRHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgcGxhY2VtZW50OiAndG9wJywgbWF4SGVpZ2h0IH07XG4gICAgICB9XG5cbiAgICAgIC8vIDM6IHRoZSBtZW51IHdpbGwgZml0LCBpZiBjb25zdHJhaW5lZFxuICAgICAgaWYgKFxuICAgICAgICAoIWlzRml4ZWRQb3NpdGlvbiAmJiBzY3JvbGxTcGFjZUFib3ZlID49IG1pbkhlaWdodCkgfHxcbiAgICAgICAgKGlzRml4ZWRQb3NpdGlvbiAmJiB2aWV3U3BhY2VBYm92ZSA+PSBtaW5IZWlnaHQpXG4gICAgICApIHtcbiAgICAgICAgbGV0IGNvbnN0cmFpbmVkSGVpZ2h0ID0gbWF4SGVpZ2h0O1xuXG4gICAgICAgIC8vIHdlIHdhbnQgdG8gcHJvdmlkZSBhcyBtdWNoIG9mIHRoZSBtZW51IGFzIHBvc3NpYmxlIHRvIHRoZSB1c2VyLFxuICAgICAgICAvLyBzbyBnaXZlIHRoZW0gd2hhdGV2ZXIgaXMgYXZhaWxhYmxlIGJlbG93IHJhdGhlciB0aGFuIHRoZSBtaW5IZWlnaHQuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAoIWlzRml4ZWRQb3NpdGlvbiAmJiBzY3JvbGxTcGFjZUFib3ZlID49IG1pbkhlaWdodCkgfHxcbiAgICAgICAgICAoaXNGaXhlZFBvc2l0aW9uICYmIHZpZXdTcGFjZUFib3ZlID49IG1pbkhlaWdodClcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3RyYWluZWRIZWlnaHQgPSBpc0ZpeGVkUG9zaXRpb25cbiAgICAgICAgICAgID8gdmlld1NwYWNlQWJvdmUgLSBtYXJnaW5Ub3BcbiAgICAgICAgICAgIDogc2Nyb2xsU3BhY2VBYm92ZSAtIG1hcmdpblRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG91bGRTY3JvbGwpIHtcbiAgICAgICAgICBhbmltYXRlZFNjcm9sbFRvKHNjcm9sbFBhcmVudCwgc2Nyb2xsVXAsIHNjcm9sbER1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgICAgICBtYXhIZWlnaHQ6IGNvbnN0cmFpbmVkSGVpZ2h0LFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyA0LiBub3QgZW5vdWdoIHNwYWNlLCB0aGUgYnJvd3NlciBXSUxMIE5PVCBpbmNyZWFzZSBzY3JvbGxhYmxlIGFyZWEgd2hlblxuICAgICAgLy8gYWJzb2x1dGVseSBwb3NpdGlvbmVkIGVsZW1lbnQgcmVuZGVyZWQgYWJvdmUgdGhlIHZpZXdwb3J0IChvbmx5IGJlbG93KS5cbiAgICAgIC8vIEZsaXAgdGhlIG1lbnUsIHJlbmRlciBiZWxvd1xuICAgICAgcmV0dXJuIHsgcGxhY2VtZW50OiAnYm90dG9tJywgbWF4SGVpZ2h0IH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwbGFjZW1lbnQgcHJvdmlkZWQgXCIke3BsYWNlbWVudH1cIi5gKTtcbiAgfVxuXG4gIC8vIGZ1bGZpbCBjb250cmFjdCB3aXRoIGZsb3c6IGltcGxpY2l0IHJldHVybiB2YWx1ZSBvZiB1bmRlZmluZWRcbiAgcmV0dXJuIGRlZmF1bHRTdGF0ZTtcbn1cblxuLy8gTWVudSBDb21wb25lbnRcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgdHlwZSBNZW51QW5kUGxhY2VyQ29tbW9uID0gQ29tbW9uUHJvcHMgJiB7XG4gIC8qKiBDYWxsYmFjayB0byB1cGRhdGUgdGhlIHBvcnRhbCBhZnRlciBwb3NzaWJsZSBmbGlwLiAqL1xuICBnZXRQb3J0YWxQbGFjZW1lbnQ6IE1lbnVTdGF0ZSA9PiB2b2lkLFxuICAvKiogUHJvcHMgdG8gYmUgcGFzc2VkIHRvIHRoZSBtZW51IHdyYXBwZXIuICovXG4gIGlubmVyUHJvcHM6IE9iamVjdCxcbiAgLyoqIFNldCB0aGUgbWF4aW11bSBoZWlnaHQgb2YgdGhlIG1lbnUuICovXG4gIG1heE1lbnVIZWlnaHQ6IG51bWJlcixcbiAgLyoqIFNldCB3aGV0aGVyIHRoZSBtZW51IHNob3VsZCBiZSBhdCB0aGUgdG9wLCBhdCB0aGUgYm90dG9tLiBUaGUgYXV0byBvcHRpb25zIHNldHMgaXQgdG8gYm90dG9tLiAqL1xuICBtZW51UGxhY2VtZW50OiBNZW51UGxhY2VtZW50LFxuICAvKiBUaGUgQ1NTIHBvc2l0aW9uIHZhbHVlIG9mIHRoZSBtZW51LCB3aGVuIFwiZml4ZWRcIiBleHRyYSBsYXlvdXQgbWFuYWdlbWVudCBpcyByZXF1aXJlZCAqL1xuICBtZW51UG9zaXRpb246IE1lbnVQb3NpdGlvbixcbiAgLyoqIFNldCB0aGUgbWluaW11bSBoZWlnaHQgb2YgdGhlIG1lbnUuICovXG4gIG1pbk1lbnVIZWlnaHQ6IG51bWJlcixcbiAgLyoqIFNldCB3aGV0aGVyIHRoZSBwYWdlIHNob3VsZCBzY3JvbGwgdG8gc2hvdyB0aGUgbWVudS4gKi9cbiAgbWVudVNob3VsZFNjcm9sbEludG9WaWV3OiBib29sZWFuLFxufTtcbmV4cG9ydCB0eXBlIE1lbnVQcm9wcyA9IE1lbnVBbmRQbGFjZXJDb21tb24gJiB7XG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIGVsZW1lbnQsIGNvbnN1bWVkIGJ5IHRoZSBNZW51UGxhY2VyIGNvbXBvbmVudCAqL1xuICBpbm5lclJlZjogRWxlbWVudFJlZjwqPixcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgY2hpbGRyZW46IFJlYWN0RWxlbWVudDwqPixcbn07XG5leHBvcnQgdHlwZSBNZW51UGxhY2VyUHJvcHMgPSBNZW51QW5kUGxhY2VyQ29tbW9uICYge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBjaGlsZHJlbjogKHt9KSA9PiBOb2RlLFxufTtcblxuZnVuY3Rpb24gYWxpZ25Ub0NvbnRyb2wocGxhY2VtZW50KSB7XG4gIGNvbnN0IHBsYWNlbWVudFRvQ1NTUHJvcCA9IHsgYm90dG9tOiAndG9wJywgdG9wOiAnYm90dG9tJyB9O1xuICByZXR1cm4gcGxhY2VtZW50ID8gcGxhY2VtZW50VG9DU1NQcm9wW3BsYWNlbWVudF0gOiAnYm90dG9tJztcbn1cbmNvbnN0IGNvZXJjZVBsYWNlbWVudCA9IHAgPT4gKHAgPT09ICdhdXRvJyA/ICdib3R0b20nIDogcCk7XG5cbnR5cGUgTWVudVN0YXRlV2l0aFByb3BzID0gTWVudVN0YXRlICYgTWVudVByb3BzO1xuXG5leHBvcnQgY29uc3QgbWVudUNTUyA9ICh7XG4gIHBsYWNlbWVudCxcbiAgdGhlbWU6IHsgYm9yZGVyUmFkaXVzLCBzcGFjaW5nLCBjb2xvcnMgfSxcbn06IE1lbnVTdGF0ZVdpdGhQcm9wcykgPT4gKHtcbiAgW2FsaWduVG9Db250cm9sKHBsYWNlbWVudCldOiAnMTAwJScsXG4gIGJhY2tncm91bmRDb2xvcjogY29sb3JzLm5ldXRyYWwwLFxuICBib3JkZXJSYWRpdXM6IGJvcmRlclJhZGl1cyxcbiAgYm94U2hhZG93OiAnMCAwIDAgMXB4IGhzbGEoMCwgMCUsIDAlLCAwLjEpLCAwIDRweCAxMXB4IGhzbGEoMCwgMCUsIDAlLCAwLjEpJyxcbiAgbWFyZ2luQm90dG9tOiBzcGFjaW5nLm1lbnVHdXR0ZXIsXG4gIG1hcmdpblRvcDogc3BhY2luZy5tZW51R3V0dGVyLFxuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgd2lkdGg6ICcxMDAlJyxcbiAgekluZGV4OiAxLFxufSk7XG5cbi8vIE5PVEU6IGludGVybmFsIG9ubHlcbmV4cG9ydCBjbGFzcyBNZW51UGxhY2VyIGV4dGVuZHMgQ29tcG9uZW50PE1lbnVQbGFjZXJQcm9wcywgTWVudVN0YXRlPiB7XG4gIHN0YXRlID0ge1xuICAgIG1heEhlaWdodDogdGhpcy5wcm9wcy5tYXhNZW51SGVpZ2h0LFxuICAgIHBsYWNlbWVudDogbnVsbCxcbiAgfTtcbiAgc3RhdGljIGNvbnRleHRUeXBlcyA9IHtcbiAgICBnZXRQb3J0YWxQbGFjZW1lbnQ6IFByb3BUeXBlcy5mdW5jLFxuICB9O1xuICBnZXRQbGFjZW1lbnQgPSAocmVmOiBFbGVtZW50UmVmPCo+KSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgbWluTWVudUhlaWdodCxcbiAgICAgIG1heE1lbnVIZWlnaHQsXG4gICAgICBtZW51UGxhY2VtZW50LFxuICAgICAgbWVudVBvc2l0aW9uLFxuICAgICAgbWVudVNob3VsZFNjcm9sbEludG9WaWV3LFxuICAgICAgdGhlbWUsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBnZXRQb3J0YWxQbGFjZW1lbnQgfSA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmICghcmVmKSByZXR1cm47XG5cbiAgICAvLyBETyBOT1Qgc2Nyb2xsIGlmIHBvc2l0aW9uIGlzIGZpeGVkXG4gICAgY29uc3QgaXNGaXhlZFBvc2l0aW9uID0gbWVudVBvc2l0aW9uID09PSAnZml4ZWQnO1xuICAgIGNvbnN0IHNob3VsZFNjcm9sbCA9IG1lbnVTaG91bGRTY3JvbGxJbnRvVmlldyAmJiAhaXNGaXhlZFBvc2l0aW9uO1xuXG4gICAgY29uc3Qgc3RhdGUgPSBnZXRNZW51UGxhY2VtZW50KHtcbiAgICAgIG1heEhlaWdodDogbWF4TWVudUhlaWdodCxcbiAgICAgIG1lbnVFbDogcmVmLFxuICAgICAgbWluSGVpZ2h0OiBtaW5NZW51SGVpZ2h0LFxuICAgICAgcGxhY2VtZW50OiBtZW51UGxhY2VtZW50LFxuICAgICAgc2hvdWxkU2Nyb2xsLFxuICAgICAgaXNGaXhlZFBvc2l0aW9uLFxuICAgICAgdGhlbWUsXG4gICAgfSk7XG5cbiAgICBpZiAoZ2V0UG9ydGFsUGxhY2VtZW50KSBnZXRQb3J0YWxQbGFjZW1lbnQoc3RhdGUpO1xuXG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gIH07XG4gIGdldFVwZGF0ZWRQcm9wcyA9ICgpID0+IHtcbiAgICBjb25zdCB7IG1lbnVQbGFjZW1lbnQgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgcGxhY2VtZW50ID0gdGhpcy5zdGF0ZS5wbGFjZW1lbnQgfHwgY29lcmNlUGxhY2VtZW50KG1lbnVQbGFjZW1lbnQpO1xuXG4gICAgcmV0dXJuIHsgLi4udGhpcy5wcm9wcywgcGxhY2VtZW50LCBtYXhIZWlnaHQ6IHRoaXMuc3RhdGUubWF4SGVpZ2h0IH07XG4gIH07XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIGNoaWxkcmVuKHtcbiAgICAgIHJlZjogdGhpcy5nZXRQbGFjZW1lbnQsXG4gICAgICBwbGFjZXJQcm9wczogdGhpcy5nZXRVcGRhdGVkUHJvcHMoKSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBNZW51ID0gKHByb3BzOiBNZW51UHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclJlZiwgaW5uZXJQcm9wcyB9ID0gcHJvcHM7XG4gIGNvbnN0IGNuID0gY3goY3NzKGdldFN0eWxlcygnbWVudScsIHByb3BzKSksIHsgbWVudTogdHJ1ZSB9LCBjbGFzc05hbWUpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NufSB7Li4uaW5uZXJQcm9wc30gcmVmPXtpbm5lclJlZn0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBNZW51O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1lbnUgTGlzdFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbnR5cGUgTWVudUxpc3RTdGF0ZSA9IHtcbiAgLyoqIFNldCBjbGFzc25hbWUgZm9yIGlzTXVsdGkgKi9cbiAgaXNNdWx0aTogYm9vbGVhbixcbiAgLyogU2V0IHRoZSBtYXggaGVpZ2h0IG9mIHRoZSBNZW51IGNvbXBvbmVudCAgKi9cbiAgbWF4SGVpZ2h0OiBudW1iZXIsXG59O1xuXG5leHBvcnQgdHlwZSBNZW51TGlzdFByb3BzID0ge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBjaGlsZHJlbjogTm9kZSxcbiAgLyoqIElubmVyIHJlZiB0byBET00gTm9kZSAqL1xuICBpbm5lclJlZjogSW5uZXJSZWYsXG59O1xuZXhwb3J0IHR5cGUgTWVudUxpc3RDb21wb25lbnRQcm9wcyA9IENvbW1vblByb3BzICZcbiAgTWVudUxpc3RQcm9wcyAmXG4gIE1lbnVMaXN0U3RhdGU7XG5leHBvcnQgY29uc3QgbWVudUxpc3RDU1MgPSAoe1xuICBtYXhIZWlnaHQsXG4gIHRoZW1lOiB7XG4gICAgc3BhY2luZzogeyBiYXNlVW5pdCB9LFxuICB9LFxufTogTWVudUxpc3RDb21wb25lbnRQcm9wcykgPT4gKHtcbiAgbWF4SGVpZ2h0LFxuICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgcGFkZGluZ0JvdHRvbTogYmFzZVVuaXQsXG4gIHBhZGRpbmdUb3A6IGJhc2VVbml0LFxuICBwb3NpdGlvbjogJ3JlbGF0aXZlJywgLy8gcmVxdWlyZWQgZm9yIG9mZnNldFtIZWlnaHQsIFRvcF0gPiBrZXlib2FyZCBzY3JvbGxcbiAgV2Via2l0T3ZlcmZsb3dTY3JvbGxpbmc6ICd0b3VjaCcsXG59KTtcbmV4cG9ydCBjb25zdCBNZW51TGlzdCA9IChwcm9wczogTWVudUxpc3RDb21wb25lbnRQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlzTXVsdGksIGlubmVyUmVmIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdtZW51TGlzdCcsIHByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnbWVudS1saXN0JzogdHJ1ZSxcbiAgICAgICAgICAnbWVudS1saXN0LS1pcy1tdWx0aSc6IGlzTXVsdGksXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHJlZj17aW5uZXJSZWZ9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNZW51IE5vdGljZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBub3RpY2VDU1MgPSAoe1xuICB0aGVtZToge1xuICAgIHNwYWNpbmc6IHsgYmFzZVVuaXQgfSxcbiAgICBjb2xvcnMsXG4gIH0sXG59OiBOb3RpY2VQcm9wcykgPT4gKHtcbiAgY29sb3I6IGNvbG9ycy5uZXV0cmFsNDAsXG4gIHBhZGRpbmc6IGAke2Jhc2VVbml0ICogMn1weCAke2Jhc2VVbml0ICogM31weGAsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG59KTtcbmV4cG9ydCBjb25zdCBub09wdGlvbnNNZXNzYWdlQ1NTID0gbm90aWNlQ1NTO1xuZXhwb3J0IGNvbnN0IGxvYWRpbmdNZXNzYWdlQ1NTID0gbm90aWNlQ1NTO1xuXG5leHBvcnQgdHlwZSBOb3RpY2VQcm9wcyA9IENvbW1vblByb3BzICYge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBjaGlsZHJlbjogTm9kZSxcbiAgLyoqIFByb3BzIHRvIGJlIHBhc3NlZCBvbiB0byB0aGUgd3JhcHBlci4gKi9cbiAgaW5uZXJQcm9wczogeyBbc3RyaW5nXTogYW55IH0sXG59O1xuXG5leHBvcnQgY29uc3QgTm9PcHRpb25zTWVzc2FnZSA9IChwcm9wczogTm90aWNlUHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdub09wdGlvbnNNZXNzYWdlJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdtZW51LW5vdGljZSc6IHRydWUsXG4gICAgICAgICAgJ21lbnUtbm90aWNlLS1uby1vcHRpb25zJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbk5vT3B0aW9uc01lc3NhZ2UuZGVmYXVsdFByb3BzID0ge1xuICBjaGlsZHJlbjogJ05vIG9wdGlvbnMnLFxufTtcblxuZXhwb3J0IGNvbnN0IExvYWRpbmdNZXNzYWdlID0gKHByb3BzOiBOb3RpY2VQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2xvYWRpbmdNZXNzYWdlJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdtZW51LW5vdGljZSc6IHRydWUsXG4gICAgICAgICAgJ21lbnUtbm90aWNlLS1sb2FkaW5nJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbkxvYWRpbmdNZXNzYWdlLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46ICdMb2FkaW5nLi4uJyxcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTWVudSBQb3J0YWxcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgdHlwZSBNZW51UG9ydGFsUHJvcHMgPSBDb21tb25Qcm9wcyAmIHtcbiAgYXBwZW5kVG86IEhUTUxFbGVtZW50LFxuICBjaGlsZHJlbjogTm9kZSwgLy8gaWRlYWxseSBNZW51PE1lbnVQcm9wcz5cbiAgY29udHJvbEVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICBtZW51UGxhY2VtZW50OiBNZW51UGxhY2VtZW50LFxuICBtZW51UG9zaXRpb246IE1lbnVQb3NpdGlvbixcbn07XG50eXBlIE1lbnVQb3J0YWxTdGF0ZSA9IHtcbiAgcGxhY2VtZW50OiAnYm90dG9tJyB8ICd0b3AnIHwgbnVsbCxcbn07XG50eXBlIFBvcnRhbFN0eWxlQXJncyA9IHtcbiAgb2Zmc2V0OiBudW1iZXIsXG4gIHBvc2l0aW9uOiBNZW51UG9zaXRpb24sXG4gIHJlY3Q6IFJlY3RUeXBlLFxufTtcblxuZXhwb3J0IGNvbnN0IG1lbnVQb3J0YWxDU1MgPSAoeyByZWN0LCBvZmZzZXQsIHBvc2l0aW9uIH06IFBvcnRhbFN0eWxlQXJncykgPT4gKHtcbiAgbGVmdDogcmVjdC5sZWZ0LFxuICBwb3NpdGlvbjogcG9zaXRpb24sXG4gIHRvcDogb2Zmc2V0LFxuICB3aWR0aDogcmVjdC53aWR0aCxcbiAgekluZGV4OiAxLFxufSk7XG5cbmV4cG9ydCBjbGFzcyBNZW51UG9ydGFsIGV4dGVuZHMgQ29tcG9uZW50PE1lbnVQb3J0YWxQcm9wcywgTWVudVBvcnRhbFN0YXRlPiB7XG4gIHN0YXRlID0geyBwbGFjZW1lbnQ6IG51bGwgfTtcbiAgc3RhdGljIGNoaWxkQ29udGV4dFR5cGVzID0ge1xuICAgIGdldFBvcnRhbFBsYWNlbWVudDogUHJvcFR5cGVzLmZ1bmMsXG4gIH07XG4gIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0UG9ydGFsUGxhY2VtZW50OiB0aGlzLmdldFBvcnRhbFBsYWNlbWVudCxcbiAgICB9O1xuICB9XG5cbiAgLy8gY2FsbGJhY2sgZm9yIG9jY2Fzc2lvbnMgd2hlcmUgdGhlIG1lbnUgbXVzdCBcImZsaXBcIlxuICBnZXRQb3J0YWxQbGFjZW1lbnQgPSAoeyBwbGFjZW1lbnQgfTogTWVudVN0YXRlKSA9PiB7XG4gICAgY29uc3QgaW5pdGlhbFBsYWNlbWVudCA9IGNvZXJjZVBsYWNlbWVudCh0aGlzLnByb3BzLm1lbnVQbGFjZW1lbnQpO1xuXG4gICAgLy8gYXZvaWQgcmUtcmVuZGVycyBpZiB0aGUgcGxhY2VtZW50IGhhcyBub3QgY2hhbmdlZFxuICAgIGlmIChwbGFjZW1lbnQgIT09IGluaXRpYWxQbGFjZW1lbnQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwbGFjZW1lbnQgfSk7XG4gICAgfVxuICB9O1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgYXBwZW5kVG8sXG4gICAgICBjaGlsZHJlbixcbiAgICAgIGNvbnRyb2xFbGVtZW50LFxuICAgICAgbWVudVBsYWNlbWVudCxcbiAgICAgIG1lbnVQb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICBnZXRTdHlsZXMsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaXNGaXhlZCA9IHBvc2l0aW9uID09PSAnZml4ZWQnO1xuXG4gICAgLy8gYmFpbCBlYXJseSBpZiByZXF1aXJlZCBlbGVtZW50cyBhcmVuJ3QgcHJlc2VudFxuICAgIGlmICgoIWFwcGVuZFRvICYmICFpc0ZpeGVkKSB8fCAhY29udHJvbEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHBsYWNlbWVudCA9IHRoaXMuc3RhdGUucGxhY2VtZW50IHx8IGNvZXJjZVBsYWNlbWVudChtZW51UGxhY2VtZW50KTtcbiAgICBjb25zdCByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRPYmooY29udHJvbEVsZW1lbnQpO1xuICAgIGNvbnN0IHNjcm9sbERpc3RhbmNlID0gaXNGaXhlZCA/IDAgOiB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgY29uc3Qgb2Zmc2V0ID0gcmVjdFtwbGFjZW1lbnRdICsgc2Nyb2xsRGlzdGFuY2U7XG4gICAgY29uc3Qgc3RhdGUgPSB7IG9mZnNldCwgcG9zaXRpb24sIHJlY3QgfTtcblxuICAgIC8vIHNhbWUgd3JhcHBlciBlbGVtZW50IHdoZXRoZXIgZml4ZWQgb3IgcG9ydGFsbGVkXG4gICAgY29uc3QgbWVudVdyYXBwZXIgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y3NzKGdldFN0eWxlcygnbWVudVBvcnRhbCcsIHN0YXRlKSl9PntjaGlsZHJlbn08L2Rpdj5cbiAgICApO1xuXG4gICAgcmV0dXJuIGFwcGVuZFRvID8gY3JlYXRlUG9ydGFsKG1lbnVXcmFwcGVyLCBhcHBlbmRUbykgOiBtZW51V3JhcHBlcjtcbiAgfVxufVxuIl19 */')), {
        'menu-notice': true,
        'menu-notice--loading': true
      }, className)
    }, innerProps),
    children
  );
};
LoadingMessage.defaultProps = {
  children: 'Loading...'
};

// ==============================
// Menu Portal
// ==============================

var menuPortalCSS = function menuPortalCSS(_ref7) {
  var rect = _ref7.rect,
      offset = _ref7.offset,
      position = _ref7.position;
  return {
    left: rect.left,
    position: position,
    top: offset,
    width: rect.width,
    zIndex: 1
  };
};

var MenuPortal = function (_Component2) {
  inherits(MenuPortal, _Component2);

  function MenuPortal() {
    var _ref8;

    var _temp2, _this2, _ret2;

    classCallCheck(this, MenuPortal);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = possibleConstructorReturn(this, (_ref8 = MenuPortal.__proto__ || Object.getPrototypeOf(MenuPortal)).call.apply(_ref8, [this].concat(args))), _this2), _this2.state = { placement: null }, _this2.getPortalPlacement = function (_ref9) {
      var placement = _ref9.placement;

      var initialPlacement = coercePlacement(_this2.props.menuPlacement);

      // avoid re-renders if the placement has not changed
      if (placement !== initialPlacement) {
        _this2.setState({ placement: placement });
      }
    }, _temp2), possibleConstructorReturn(_this2, _ret2);
  }

  createClass(MenuPortal, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        getPortalPlacement: this.getPortalPlacement
      };
    }

    // callback for occassions where the menu must "flip"

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          appendTo = _props.appendTo,
          children = _props.children,
          controlElement = _props.controlElement,
          menuPlacement = _props.menuPlacement,
          position = _props.menuPosition,
          getStyles = _props.getStyles;

      var isFixed = position === 'fixed';

      // bail early if required elements aren't present
      if (!appendTo && !isFixed || !controlElement) {
        return null;
      }

      var placement = this.state.placement || coercePlacement(menuPlacement);
      var rect = getBoundingClientObj(controlElement);
      var scrollDistance = isFixed ? 0 : window.pageYOffset;
      var offset = rect[placement] + scrollDistance;
      var state = { offset: offset, position: position, rect: rect };

      // same wrapper element whether fixed or portalled
      var menuWrapper = React.createElement(
        'div',
        { className: /*#__PURE__*/css(getStyles('menuPortal', state), 'label:MenuPortal;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lbnUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBeWdCc0IiLCJmaWxlIjoiTWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgUmVhY3QsIHtcbiAgQ29tcG9uZW50LFxuICB0eXBlIEVsZW1lbnQgYXMgUmVhY3RFbGVtZW50LFxuICB0eXBlIEVsZW1lbnRSZWYsXG4gIHR5cGUgTm9kZSxcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5pbXBvcnQgeyBjcmVhdGVQb3J0YWwgfSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHtcbiAgYW5pbWF0ZWRTY3JvbGxUbyxcbiAgZ2V0Qm91bmRpbmdDbGllbnRPYmosXG4gIHR5cGUgUmVjdFR5cGUsXG4gIGdldFNjcm9sbFBhcmVudCxcbiAgZ2V0U2Nyb2xsVG9wLFxuICBzY3JvbGxUbyxcbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHR5cGUge1xuICBJbm5lclJlZixcbiAgTWVudVBsYWNlbWVudCxcbiAgTWVudVBvc2l0aW9uLFxuICBDb21tb25Qcm9wcyxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUgeyBUaGVtZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNZW51XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gR2V0IE1lbnUgUGxhY2VtZW50XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudHlwZSBNZW51U3RhdGUgPSB7XG4gIHBsYWNlbWVudDogJ2JvdHRvbScgfCAndG9wJyB8IG51bGwsXG4gIG1heEhlaWdodDogbnVtYmVyLFxufTtcbnR5cGUgUGxhY2VtZW50QXJncyA9IHtcbiAgbWF4SGVpZ2h0OiBudW1iZXIsXG4gIG1lbnVFbDogRWxlbWVudFJlZjwqPixcbiAgbWluSGVpZ2h0OiBudW1iZXIsXG4gIHBsYWNlbWVudDogJ2JvdHRvbScgfCAndG9wJyB8ICdhdXRvJyxcbiAgc2hvdWxkU2Nyb2xsOiBib29sZWFuLFxuICBpc0ZpeGVkUG9zaXRpb246IGJvb2xlYW4sXG4gIHRoZW1lOiBUaGVtZSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNZW51UGxhY2VtZW50KHtcbiAgbWF4SGVpZ2h0LFxuICBtZW51RWwsXG4gIG1pbkhlaWdodCxcbiAgcGxhY2VtZW50LFxuICBzaG91bGRTY3JvbGwsXG4gIGlzRml4ZWRQb3NpdGlvbixcbiAgdGhlbWUsXG59OiBQbGFjZW1lbnRBcmdzKTogTWVudVN0YXRlIHtcbiAgY29uc3QgeyBzcGFjaW5nIH0gPSB0aGVtZTtcbiAgY29uc3Qgc2Nyb2xsUGFyZW50ID0gZ2V0U2Nyb2xsUGFyZW50KG1lbnVFbCk7XG4gIGNvbnN0IGRlZmF1bHRTdGF0ZSA9IHsgcGxhY2VtZW50OiAnYm90dG9tJywgbWF4SGVpZ2h0IH07XG5cbiAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmcsIHJldHVybiBkZWZhdWx0IHN0YXRlXG4gIGlmICghbWVudUVsIHx8ICFtZW51RWwub2Zmc2V0UGFyZW50KSByZXR1cm4gZGVmYXVsdFN0YXRlO1xuXG4gIC8vIHdlIGNhbid0IHRydXN0IGBzY3JvbGxQYXJlbnQuc2Nyb2xsSGVpZ2h0YCAtLT4gaXQgbWF5IGluY3JlYXNlIHdoZW5cbiAgLy8gdGhlIG1lbnUgaXMgcmVuZGVyZWRcbiAgY29uc3QgeyBoZWlnaHQ6IHNjcm9sbEhlaWdodCB9ID0gc2Nyb2xsUGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB7XG4gICAgYm90dG9tOiBtZW51Qm90dG9tLFxuICAgIGhlaWdodDogbWVudUhlaWdodCxcbiAgICB0b3A6IG1lbnVUb3AsXG4gIH0gPSBtZW51RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgLy8gJEZsb3dGaXhNZSBmdW5jdGlvbiByZXR1cm5zIGFib3ZlIGlmIHRoZXJlJ3Mgbm8gb2Zmc2V0UGFyZW50XG4gIGNvbnN0IHsgdG9wOiBjb250YWluZXJUb3AgfSA9IG1lbnVFbC5vZmZzZXRQYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHZpZXdIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNvbnN0IHNjcm9sbFRvcCA9IGdldFNjcm9sbFRvcChzY3JvbGxQYXJlbnQpO1xuXG4gIGNvbnN0IG1hcmdpbkJvdHRvbSA9IHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobWVudUVsKS5tYXJnaW5Cb3R0b20sIDEwKTtcbiAgY29uc3QgbWFyZ2luVG9wID0gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShtZW51RWwpLm1hcmdpblRvcCwgMTApO1xuICBjb25zdCB2aWV3U3BhY2VBYm92ZSA9IGNvbnRhaW5lclRvcCAtIG1hcmdpblRvcDtcbiAgY29uc3Qgdmlld1NwYWNlQmVsb3cgPSB2aWV3SGVpZ2h0IC0gbWVudVRvcDtcbiAgY29uc3Qgc2Nyb2xsU3BhY2VBYm92ZSA9IHZpZXdTcGFjZUFib3ZlICsgc2Nyb2xsVG9wO1xuICBjb25zdCBzY3JvbGxTcGFjZUJlbG93ID0gc2Nyb2xsSGVpZ2h0IC0gc2Nyb2xsVG9wIC0gbWVudVRvcDtcblxuICBjb25zdCBzY3JvbGxEb3duID0gbWVudUJvdHRvbSAtIHZpZXdIZWlnaHQgKyBzY3JvbGxUb3AgKyBtYXJnaW5Cb3R0b207XG4gIGNvbnN0IHNjcm9sbFVwID0gc2Nyb2xsVG9wICsgbWVudVRvcCAtIG1hcmdpblRvcDtcbiAgY29uc3Qgc2Nyb2xsRHVyYXRpb24gPSAxNjA7XG5cbiAgc3dpdGNoIChwbGFjZW1lbnQpIHtcbiAgICBjYXNlICdhdXRvJzpcbiAgICBjYXNlICdib3R0b20nOlxuICAgICAgLy8gMTogdGhlIG1lbnUgd2lsbCBmaXQsIGRvIG5vdGhpbmdcbiAgICAgIGlmICh2aWV3U3BhY2VCZWxvdyA+PSBtZW51SGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiB7IHBsYWNlbWVudDogJ2JvdHRvbScsIG1heEhlaWdodCB9O1xuICAgICAgfVxuXG4gICAgICAvLyAyOiB0aGUgbWVudSB3aWxsIGZpdCwgaWYgc2Nyb2xsZWRcbiAgICAgIGlmIChzY3JvbGxTcGFjZUJlbG93ID49IG1lbnVIZWlnaHQgJiYgIWlzRml4ZWRQb3NpdGlvbikge1xuICAgICAgICBpZiAoc2hvdWxkU2Nyb2xsKSB7XG4gICAgICAgICAgYW5pbWF0ZWRTY3JvbGxUbyhzY3JvbGxQYXJlbnQsIHNjcm9sbERvd24sIHNjcm9sbER1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHBsYWNlbWVudDogJ2JvdHRvbScsIG1heEhlaWdodCB9O1xuICAgICAgfVxuXG4gICAgICAvLyAzOiB0aGUgbWVudSB3aWxsIGZpdCwgaWYgY29uc3RyYWluZWRcbiAgICAgIGlmIChcbiAgICAgICAgKCFpc0ZpeGVkUG9zaXRpb24gJiYgc2Nyb2xsU3BhY2VCZWxvdyA+PSBtaW5IZWlnaHQpIHx8XG4gICAgICAgIChpc0ZpeGVkUG9zaXRpb24gJiYgdmlld1NwYWNlQmVsb3cgPj0gbWluSGVpZ2h0KVxuICAgICAgKSB7XG4gICAgICAgIGlmIChzaG91bGRTY3JvbGwpIHtcbiAgICAgICAgICBhbmltYXRlZFNjcm9sbFRvKHNjcm9sbFBhcmVudCwgc2Nyb2xsRG93biwgc2Nyb2xsRHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Ugd2FudCB0byBwcm92aWRlIGFzIG11Y2ggb2YgdGhlIG1lbnUgYXMgcG9zc2libGUgdG8gdGhlIHVzZXIsXG4gICAgICAgIC8vIHNvIGdpdmUgdGhlbSB3aGF0ZXZlciBpcyBhdmFpbGFibGUgYmVsb3cgcmF0aGVyIHRoYW4gdGhlIG1pbkhlaWdodC5cbiAgICAgICAgY29uc3QgY29uc3RyYWluZWRIZWlnaHQgPSBpc0ZpeGVkUG9zaXRpb25cbiAgICAgICAgICA/IHZpZXdTcGFjZUJlbG93IC0gbWFyZ2luQm90dG9tXG4gICAgICAgICAgOiBzY3JvbGxTcGFjZUJlbG93IC0gbWFyZ2luQm90dG9tO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgICAgICAgICBtYXhIZWlnaHQ6IGNvbnN0cmFpbmVkSGVpZ2h0LFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyA0LiBGb3JrZWQgYmV2aW91ciB3aGVuIHRoZXJlIGlzbid0IGVub3VnaCBzcGFjZSBiZWxvd1xuXG4gICAgICAvLyBBVVRPOiBmbGlwIHRoZSBtZW51LCByZW5kZXIgYWJvdmVcbiAgICAgIGlmIChwbGFjZW1lbnQgPT09ICdhdXRvJyB8fCBpc0ZpeGVkUG9zaXRpb24pIHtcbiAgICAgICAgLy8gbWF5IG5lZWQgdG8gYmUgY29uc3RyYWluZWQgYWZ0ZXIgZmxpcHBpbmdcbiAgICAgICAgbGV0IGNvbnN0cmFpbmVkSGVpZ2h0ID0gbWF4SGVpZ2h0O1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAoIWlzRml4ZWRQb3NpdGlvbiAmJiBzY3JvbGxTcGFjZUFib3ZlID49IG1pbkhlaWdodCkgfHxcbiAgICAgICAgICAoaXNGaXhlZFBvc2l0aW9uICYmIHZpZXdTcGFjZUFib3ZlID49IG1pbkhlaWdodClcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3RyYWluZWRIZWlnaHQgPSBpc0ZpeGVkUG9zaXRpb25cbiAgICAgICAgICAgID8gdmlld1NwYWNlQWJvdmUgLSBtYXJnaW5Cb3R0b20gLSBzcGFjaW5nLmNvbnRyb2xIZWlnaHRcbiAgICAgICAgICAgIDogc2Nyb2xsU3BhY2VBYm92ZSAtIG1hcmdpbkJvdHRvbSAtIHNwYWNpbmcuY29udHJvbEhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHBsYWNlbWVudDogJ3RvcCcsIG1heEhlaWdodDogY29uc3RyYWluZWRIZWlnaHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gQk9UVE9NOiBhbGxvdyBicm93c2VyIHRvIGluY3JlYXNlIHNjcm9sbGFibGUgYXJlYSBhbmQgaW1tZWRpYXRlbHkgc2V0IHNjcm9sbFxuICAgICAgaWYgKHBsYWNlbWVudCA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgc2Nyb2xsVG8oc2Nyb2xsUGFyZW50LCBzY3JvbGxEb3duKTtcbiAgICAgICAgcmV0dXJuIHsgcGxhY2VtZW50OiAnYm90dG9tJywgbWF4SGVpZ2h0IH07XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICd0b3AnOlxuICAgICAgLy8gMTogdGhlIG1lbnUgd2lsbCBmaXQsIGRvIG5vdGhpbmdcbiAgICAgIGlmICh2aWV3U3BhY2VBYm92ZSA+PSBtZW51SGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiB7IHBsYWNlbWVudDogJ3RvcCcsIG1heEhlaWdodCB9O1xuICAgICAgfVxuXG4gICAgICAvLyAyOiB0aGUgbWVudSB3aWxsIGZpdCwgaWYgc2Nyb2xsZWRcbiAgICAgIGlmIChzY3JvbGxTcGFjZUFib3ZlID49IG1lbnVIZWlnaHQgJiYgIWlzRml4ZWRQb3NpdGlvbikge1xuICAgICAgICBpZiAoc2hvdWxkU2Nyb2xsKSB7XG4gICAgICAgICAgYW5pbWF0ZWRTY3JvbGxUbyhzY3JvbGxQYXJlbnQsIHNjcm9sbFVwLCBzY3JvbGxEdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICd0b3AnLCBtYXhIZWlnaHQgfTtcbiAgICAgIH1cblxuICAgICAgLy8gMzogdGhlIG1lbnUgd2lsbCBmaXQsIGlmIGNvbnN0cmFpbmVkXG4gICAgICBpZiAoXG4gICAgICAgICghaXNGaXhlZFBvc2l0aW9uICYmIHNjcm9sbFNwYWNlQWJvdmUgPj0gbWluSGVpZ2h0KSB8fFxuICAgICAgICAoaXNGaXhlZFBvc2l0aW9uICYmIHZpZXdTcGFjZUFib3ZlID49IG1pbkhlaWdodClcbiAgICAgICkge1xuICAgICAgICBsZXQgY29uc3RyYWluZWRIZWlnaHQgPSBtYXhIZWlnaHQ7XG5cbiAgICAgICAgLy8gd2Ugd2FudCB0byBwcm92aWRlIGFzIG11Y2ggb2YgdGhlIG1lbnUgYXMgcG9zc2libGUgdG8gdGhlIHVzZXIsXG4gICAgICAgIC8vIHNvIGdpdmUgdGhlbSB3aGF0ZXZlciBpcyBhdmFpbGFibGUgYmVsb3cgcmF0aGVyIHRoYW4gdGhlIG1pbkhlaWdodC5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICghaXNGaXhlZFBvc2l0aW9uICYmIHNjcm9sbFNwYWNlQWJvdmUgPj0gbWluSGVpZ2h0KSB8fFxuICAgICAgICAgIChpc0ZpeGVkUG9zaXRpb24gJiYgdmlld1NwYWNlQWJvdmUgPj0gbWluSGVpZ2h0KVxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdHJhaW5lZEhlaWdodCA9IGlzRml4ZWRQb3NpdGlvblxuICAgICAgICAgICAgPyB2aWV3U3BhY2VBYm92ZSAtIG1hcmdpblRvcFxuICAgICAgICAgICAgOiBzY3JvbGxTcGFjZUFib3ZlIC0gbWFyZ2luVG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNob3VsZFNjcm9sbCkge1xuICAgICAgICAgIGFuaW1hdGVkU2Nyb2xsVG8oc2Nyb2xsUGFyZW50LCBzY3JvbGxVcCwgc2Nyb2xsRHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgICAgICAgIG1heEhlaWdodDogY29uc3RyYWluZWRIZWlnaHQsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vIDQuIG5vdCBlbm91Z2ggc3BhY2UsIHRoZSBicm93c2VyIFdJTEwgTk9UIGluY3JlYXNlIHNjcm9sbGFibGUgYXJlYSB3aGVuXG4gICAgICAvLyBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgZWxlbWVudCByZW5kZXJlZCBhYm92ZSB0aGUgdmlld3BvcnQgKG9ubHkgYmVsb3cpLlxuICAgICAgLy8gRmxpcCB0aGUgbWVudSwgcmVuZGVyIGJlbG93XG4gICAgICByZXR1cm4geyBwbGFjZW1lbnQ6ICdib3R0b20nLCBtYXhIZWlnaHQgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHBsYWNlbWVudCBwcm92aWRlZCBcIiR7cGxhY2VtZW50fVwiLmApO1xuICB9XG5cbiAgLy8gZnVsZmlsIGNvbnRyYWN0IHdpdGggZmxvdzogaW1wbGljaXQgcmV0dXJuIHZhbHVlIG9mIHVuZGVmaW5lZFxuICByZXR1cm4gZGVmYXVsdFN0YXRlO1xufVxuXG4vLyBNZW51IENvbXBvbmVudFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydCB0eXBlIE1lbnVBbmRQbGFjZXJDb21tb24gPSBDb21tb25Qcm9wcyAmIHtcbiAgLyoqIENhbGxiYWNrIHRvIHVwZGF0ZSB0aGUgcG9ydGFsIGFmdGVyIHBvc3NpYmxlIGZsaXAuICovXG4gIGdldFBvcnRhbFBsYWNlbWVudDogTWVudVN0YXRlID0+IHZvaWQsXG4gIC8qKiBQcm9wcyB0byBiZSBwYXNzZWQgdG8gdGhlIG1lbnUgd3JhcHBlci4gKi9cbiAgaW5uZXJQcm9wczogT2JqZWN0LFxuICAvKiogU2V0IHRoZSBtYXhpbXVtIGhlaWdodCBvZiB0aGUgbWVudS4gKi9cbiAgbWF4TWVudUhlaWdodDogbnVtYmVyLFxuICAvKiogU2V0IHdoZXRoZXIgdGhlIG1lbnUgc2hvdWxkIGJlIGF0IHRoZSB0b3AsIGF0IHRoZSBib3R0b20uIFRoZSBhdXRvIG9wdGlvbnMgc2V0cyBpdCB0byBib3R0b20uICovXG4gIG1lbnVQbGFjZW1lbnQ6IE1lbnVQbGFjZW1lbnQsXG4gIC8qIFRoZSBDU1MgcG9zaXRpb24gdmFsdWUgb2YgdGhlIG1lbnUsIHdoZW4gXCJmaXhlZFwiIGV4dHJhIGxheW91dCBtYW5hZ2VtZW50IGlzIHJlcXVpcmVkICovXG4gIG1lbnVQb3NpdGlvbjogTWVudVBvc2l0aW9uLFxuICAvKiogU2V0IHRoZSBtaW5pbXVtIGhlaWdodCBvZiB0aGUgbWVudS4gKi9cbiAgbWluTWVudUhlaWdodDogbnVtYmVyLFxuICAvKiogU2V0IHdoZXRoZXIgdGhlIHBhZ2Ugc2hvdWxkIHNjcm9sbCB0byBzaG93IHRoZSBtZW51LiAqL1xuICBtZW51U2hvdWxkU2Nyb2xsSW50b1ZpZXc6IGJvb2xlYW4sXG59O1xuZXhwb3J0IHR5cGUgTWVudVByb3BzID0gTWVudUFuZFBsYWNlckNvbW1vbiAmIHtcbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgaW50ZXJuYWwgZWxlbWVudCwgY29uc3VtZWQgYnkgdGhlIE1lbnVQbGFjZXIgY29tcG9uZW50ICovXG4gIGlubmVyUmVmOiBFbGVtZW50UmVmPCo+LFxuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBjaGlsZHJlbjogUmVhY3RFbGVtZW50PCo+LFxufTtcbmV4cG9ydCB0eXBlIE1lbnVQbGFjZXJQcm9wcyA9IE1lbnVBbmRQbGFjZXJDb21tb24gJiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQuICovXG4gIGNoaWxkcmVuOiAoe30pID0+IE5vZGUsXG59O1xuXG5mdW5jdGlvbiBhbGlnblRvQ29udHJvbChwbGFjZW1lbnQpIHtcbiAgY29uc3QgcGxhY2VtZW50VG9DU1NQcm9wID0geyBib3R0b206ICd0b3AnLCB0b3A6ICdib3R0b20nIH07XG4gIHJldHVybiBwbGFjZW1lbnQgPyBwbGFjZW1lbnRUb0NTU1Byb3BbcGxhY2VtZW50XSA6ICdib3R0b20nO1xufVxuY29uc3QgY29lcmNlUGxhY2VtZW50ID0gcCA9PiAocCA9PT0gJ2F1dG8nID8gJ2JvdHRvbScgOiBwKTtcblxudHlwZSBNZW51U3RhdGVXaXRoUHJvcHMgPSBNZW51U3RhdGUgJiBNZW51UHJvcHM7XG5cbmV4cG9ydCBjb25zdCBtZW51Q1NTID0gKHtcbiAgcGxhY2VtZW50LFxuICB0aGVtZTogeyBib3JkZXJSYWRpdXMsIHNwYWNpbmcsIGNvbG9ycyB9LFxufTogTWVudVN0YXRlV2l0aFByb3BzKSA9PiAoe1xuICBbYWxpZ25Ub0NvbnRyb2wocGxhY2VtZW50KV06ICcxMDAlJyxcbiAgYmFja2dyb3VuZENvbG9yOiBjb2xvcnMubmV1dHJhbDAsXG4gIGJvcmRlclJhZGl1czogYm9yZGVyUmFkaXVzLFxuICBib3hTaGFkb3c6ICcwIDAgMCAxcHggaHNsYSgwLCAwJSwgMCUsIDAuMSksIDAgNHB4IDExcHggaHNsYSgwLCAwJSwgMCUsIDAuMSknLFxuICBtYXJnaW5Cb3R0b206IHNwYWNpbmcubWVudUd1dHRlcixcbiAgbWFyZ2luVG9wOiBzcGFjaW5nLm1lbnVHdXR0ZXIsXG4gIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICB3aWR0aDogJzEwMCUnLFxuICB6SW5kZXg6IDEsXG59KTtcblxuLy8gTk9URTogaW50ZXJuYWwgb25seVxuZXhwb3J0IGNsYXNzIE1lbnVQbGFjZXIgZXh0ZW5kcyBDb21wb25lbnQ8TWVudVBsYWNlclByb3BzLCBNZW51U3RhdGU+IHtcbiAgc3RhdGUgPSB7XG4gICAgbWF4SGVpZ2h0OiB0aGlzLnByb3BzLm1heE1lbnVIZWlnaHQsXG4gICAgcGxhY2VtZW50OiBudWxsLFxuICB9O1xuICBzdGF0aWMgY29udGV4dFR5cGVzID0ge1xuICAgIGdldFBvcnRhbFBsYWNlbWVudDogUHJvcFR5cGVzLmZ1bmMsXG4gIH07XG4gIGdldFBsYWNlbWVudCA9IChyZWY6IEVsZW1lbnRSZWY8Kj4pID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBtaW5NZW51SGVpZ2h0LFxuICAgICAgbWF4TWVudUhlaWdodCxcbiAgICAgIG1lbnVQbGFjZW1lbnQsXG4gICAgICBtZW51UG9zaXRpb24sXG4gICAgICBtZW51U2hvdWxkU2Nyb2xsSW50b1ZpZXcsXG4gICAgICB0aGVtZSxcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGdldFBvcnRhbFBsYWNlbWVudCB9ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKCFyZWYpIHJldHVybjtcblxuICAgIC8vIERPIE5PVCBzY3JvbGwgaWYgcG9zaXRpb24gaXMgZml4ZWRcbiAgICBjb25zdCBpc0ZpeGVkUG9zaXRpb24gPSBtZW51UG9zaXRpb24gPT09ICdmaXhlZCc7XG4gICAgY29uc3Qgc2hvdWxkU2Nyb2xsID0gbWVudVNob3VsZFNjcm9sbEludG9WaWV3ICYmICFpc0ZpeGVkUG9zaXRpb247XG5cbiAgICBjb25zdCBzdGF0ZSA9IGdldE1lbnVQbGFjZW1lbnQoe1xuICAgICAgbWF4SGVpZ2h0OiBtYXhNZW51SGVpZ2h0LFxuICAgICAgbWVudUVsOiByZWYsXG4gICAgICBtaW5IZWlnaHQ6IG1pbk1lbnVIZWlnaHQsXG4gICAgICBwbGFjZW1lbnQ6IG1lbnVQbGFjZW1lbnQsXG4gICAgICBzaG91bGRTY3JvbGwsXG4gICAgICBpc0ZpeGVkUG9zaXRpb24sXG4gICAgICB0aGVtZSxcbiAgICB9KTtcblxuICAgIGlmIChnZXRQb3J0YWxQbGFjZW1lbnQpIGdldFBvcnRhbFBsYWNlbWVudChzdGF0ZSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgfTtcbiAgZ2V0VXBkYXRlZFByb3BzID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgbWVudVBsYWNlbWVudCB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBwbGFjZW1lbnQgPSB0aGlzLnN0YXRlLnBsYWNlbWVudCB8fCBjb2VyY2VQbGFjZW1lbnQobWVudVBsYWNlbWVudCk7XG5cbiAgICByZXR1cm4geyAuLi50aGlzLnByb3BzLCBwbGFjZW1lbnQsIG1heEhlaWdodDogdGhpcy5zdGF0ZS5tYXhIZWlnaHQgfTtcbiAgfTtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gY2hpbGRyZW4oe1xuICAgICAgcmVmOiB0aGlzLmdldFBsYWNlbWVudCxcbiAgICAgIHBsYWNlclByb3BzOiB0aGlzLmdldFVwZGF0ZWRQcm9wcygpLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IE1lbnUgPSAocHJvcHM6IE1lbnVQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUmVmLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgY29uc3QgY24gPSBjeChjc3MoZ2V0U3R5bGVzKCdtZW51JywgcHJvcHMpKSwgeyBtZW51OiB0cnVlIH0sIGNsYXNzTmFtZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y259IHsuLi5pbm5lclByb3BzfSByZWY9e2lubmVyUmVmfT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1lbnU7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTWVudSBMaXN0XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBNZW51TGlzdFN0YXRlID0ge1xuICAvKiogU2V0IGNsYXNzbmFtZSBmb3IgaXNNdWx0aSAqL1xuICBpc011bHRpOiBib29sZWFuLFxuICAvKiBTZXQgdGhlIG1heCBoZWlnaHQgb2YgdGhlIE1lbnUgY29tcG9uZW50ICAqL1xuICBtYXhIZWlnaHQ6IG51bWJlcixcbn07XG5cbmV4cG9ydCB0eXBlIE1lbnVMaXN0UHJvcHMgPSB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQuICovXG4gIGNoaWxkcmVuOiBOb2RlLFxuICAvKiogSW5uZXIgcmVmIHRvIERPTSBOb2RlICovXG4gIGlubmVyUmVmOiBJbm5lclJlZixcbn07XG5leHBvcnQgdHlwZSBNZW51TGlzdENvbXBvbmVudFByb3BzID0gQ29tbW9uUHJvcHMgJlxuICBNZW51TGlzdFByb3BzICZcbiAgTWVudUxpc3RTdGF0ZTtcbmV4cG9ydCBjb25zdCBtZW51TGlzdENTUyA9ICh7XG4gIG1heEhlaWdodCxcbiAgdGhlbWU6IHtcbiAgICBzcGFjaW5nOiB7IGJhc2VVbml0IH0sXG4gIH0sXG59OiBNZW51TGlzdENvbXBvbmVudFByb3BzKSA9PiAoe1xuICBtYXhIZWlnaHQsXG4gIG92ZXJmbG93WTogJ2F1dG8nLFxuICBwYWRkaW5nQm90dG9tOiBiYXNlVW5pdCxcbiAgcGFkZGluZ1RvcDogYmFzZVVuaXQsXG4gIHBvc2l0aW9uOiAncmVsYXRpdmUnLCAvLyByZXF1aXJlZCBmb3Igb2Zmc2V0W0hlaWdodCwgVG9wXSA+IGtleWJvYXJkIHNjcm9sbFxuICBXZWJraXRPdmVyZmxvd1Njcm9sbGluZzogJ3RvdWNoJyxcbn0pO1xuZXhwb3J0IGNvbnN0IE1lbnVMaXN0ID0gKHByb3BzOiBNZW51TGlzdENvbXBvbmVudFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcywgaXNNdWx0aSwgaW5uZXJSZWYgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ21lbnVMaXN0JywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdtZW51LWxpc3QnOiB0cnVlLFxuICAgICAgICAgICdtZW51LWxpc3QtLWlzLW11bHRpJzogaXNNdWx0aSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgcmVmPXtpbm5lclJlZn1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1lbnUgTm90aWNlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IG5vdGljZUNTUyA9ICh7XG4gIHRoZW1lOiB7XG4gICAgc3BhY2luZzogeyBiYXNlVW5pdCB9LFxuICAgIGNvbG9ycyxcbiAgfSxcbn06IE5vdGljZVByb3BzKSA9PiAoe1xuICBjb2xvcjogY29sb3JzLm5ldXRyYWw0MCxcbiAgcGFkZGluZzogYCR7YmFzZVVuaXQgKiAyfXB4ICR7YmFzZVVuaXQgKiAzfXB4YCxcbiAgdGV4dEFsaWduOiAnY2VudGVyJyxcbn0pO1xuZXhwb3J0IGNvbnN0IG5vT3B0aW9uc01lc3NhZ2VDU1MgPSBub3RpY2VDU1M7XG5leHBvcnQgY29uc3QgbG9hZGluZ01lc3NhZ2VDU1MgPSBub3RpY2VDU1M7XG5cbmV4cG9ydCB0eXBlIE5vdGljZVByb3BzID0gQ29tbW9uUHJvcHMgJiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQuICovXG4gIGNoaWxkcmVuOiBOb2RlLFxuICAvKiogUHJvcHMgdG8gYmUgcGFzc2VkIG9uIHRvIHRoZSB3cmFwcGVyLiAqL1xuICBpbm5lclByb3BzOiB7IFtzdHJpbmddOiBhbnkgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBOb09wdGlvbnNNZXNzYWdlID0gKHByb3BzOiBOb3RpY2VQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ25vT3B0aW9uc01lc3NhZ2UnLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ21lbnUtbm90aWNlJzogdHJ1ZSxcbiAgICAgICAgICAnbWVudS1ub3RpY2UtLW5vLW9wdGlvbnMnOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuTm9PcHRpb25zTWVzc2FnZS5kZWZhdWx0UHJvcHMgPSB7XG4gIGNoaWxkcmVuOiAnTm8gb3B0aW9ucycsXG59O1xuXG5leHBvcnQgY29uc3QgTG9hZGluZ01lc3NhZ2UgPSAocHJvcHM6IE5vdGljZVByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcywgaW5uZXJQcm9wcyB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnbG9hZGluZ01lc3NhZ2UnLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ21lbnUtbm90aWNlJzogdHJ1ZSxcbiAgICAgICAgICAnbWVudS1ub3RpY2UtLWxvYWRpbmcnOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuTG9hZGluZ01lc3NhZ2UuZGVmYXVsdFByb3BzID0ge1xuICBjaGlsZHJlbjogJ0xvYWRpbmcuLi4nLFxufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNZW51IFBvcnRhbFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCB0eXBlIE1lbnVQb3J0YWxQcm9wcyA9IENvbW1vblByb3BzICYge1xuICBhcHBlbmRUbzogSFRNTEVsZW1lbnQsXG4gIGNoaWxkcmVuOiBOb2RlLCAvLyBpZGVhbGx5IE1lbnU8TWVudVByb3BzPlxuICBjb250cm9sRWxlbWVudDogSFRNTEVsZW1lbnQsXG4gIG1lbnVQbGFjZW1lbnQ6IE1lbnVQbGFjZW1lbnQsXG4gIG1lbnVQb3NpdGlvbjogTWVudVBvc2l0aW9uLFxufTtcbnR5cGUgTWVudVBvcnRhbFN0YXRlID0ge1xuICBwbGFjZW1lbnQ6ICdib3R0b20nIHwgJ3RvcCcgfCBudWxsLFxufTtcbnR5cGUgUG9ydGFsU3R5bGVBcmdzID0ge1xuICBvZmZzZXQ6IG51bWJlcixcbiAgcG9zaXRpb246IE1lbnVQb3NpdGlvbixcbiAgcmVjdDogUmVjdFR5cGUsXG59O1xuXG5leHBvcnQgY29uc3QgbWVudVBvcnRhbENTUyA9ICh7IHJlY3QsIG9mZnNldCwgcG9zaXRpb24gfTogUG9ydGFsU3R5bGVBcmdzKSA9PiAoe1xuICBsZWZ0OiByZWN0LmxlZnQsXG4gIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAgdG9wOiBvZmZzZXQsXG4gIHdpZHRoOiByZWN0LndpZHRoLFxuICB6SW5kZXg6IDEsXG59KTtcblxuZXhwb3J0IGNsYXNzIE1lbnVQb3J0YWwgZXh0ZW5kcyBDb21wb25lbnQ8TWVudVBvcnRhbFByb3BzLCBNZW51UG9ydGFsU3RhdGU+IHtcbiAgc3RhdGUgPSB7IHBsYWNlbWVudDogbnVsbCB9O1xuICBzdGF0aWMgY2hpbGRDb250ZXh0VHlwZXMgPSB7XG4gICAgZ2V0UG9ydGFsUGxhY2VtZW50OiBQcm9wVHlwZXMuZnVuYyxcbiAgfTtcbiAgZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgIHJldHVybiB7XG4gICAgICBnZXRQb3J0YWxQbGFjZW1lbnQ6IHRoaXMuZ2V0UG9ydGFsUGxhY2VtZW50LFxuICAgIH07XG4gIH1cblxuICAvLyBjYWxsYmFjayBmb3Igb2NjYXNzaW9ucyB3aGVyZSB0aGUgbWVudSBtdXN0IFwiZmxpcFwiXG4gIGdldFBvcnRhbFBsYWNlbWVudCA9ICh7IHBsYWNlbWVudCB9OiBNZW51U3RhdGUpID0+IHtcbiAgICBjb25zdCBpbml0aWFsUGxhY2VtZW50ID0gY29lcmNlUGxhY2VtZW50KHRoaXMucHJvcHMubWVudVBsYWNlbWVudCk7XG5cbiAgICAvLyBhdm9pZCByZS1yZW5kZXJzIGlmIHRoZSBwbGFjZW1lbnQgaGFzIG5vdCBjaGFuZ2VkXG4gICAgaWYgKHBsYWNlbWVudCAhPT0gaW5pdGlhbFBsYWNlbWVudCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHBsYWNlbWVudCB9KTtcbiAgICB9XG4gIH07XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBhcHBlbmRUbyxcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgY29udHJvbEVsZW1lbnQsXG4gICAgICBtZW51UGxhY2VtZW50LFxuICAgICAgbWVudVBvc2l0aW9uOiBwb3NpdGlvbixcbiAgICAgIGdldFN0eWxlcyxcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBpc0ZpeGVkID0gcG9zaXRpb24gPT09ICdmaXhlZCc7XG5cbiAgICAvLyBiYWlsIGVhcmx5IGlmIHJlcXVpcmVkIGVsZW1lbnRzIGFyZW4ndCBwcmVzZW50XG4gICAgaWYgKCghYXBwZW5kVG8gJiYgIWlzRml4ZWQpIHx8ICFjb250cm9sRWxlbWVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcGxhY2VtZW50ID0gdGhpcy5zdGF0ZS5wbGFjZW1lbnQgfHwgY29lcmNlUGxhY2VtZW50KG1lbnVQbGFjZW1lbnQpO1xuICAgIGNvbnN0IHJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudE9iaihjb250cm9sRWxlbWVudCk7XG4gICAgY29uc3Qgc2Nyb2xsRGlzdGFuY2UgPSBpc0ZpeGVkID8gMCA6IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICBjb25zdCBvZmZzZXQgPSByZWN0W3BsYWNlbWVudF0gKyBzY3JvbGxEaXN0YW5jZTtcbiAgICBjb25zdCBzdGF0ZSA9IHsgb2Zmc2V0LCBwb3NpdGlvbiwgcmVjdCB9O1xuXG4gICAgLy8gc2FtZSB3cmFwcGVyIGVsZW1lbnQgd2hldGhlciBmaXhlZCBvciBwb3J0YWxsZWRcbiAgICBjb25zdCBtZW51V3JhcHBlciA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjc3MoZ2V0U3R5bGVzKCdtZW51UG9ydGFsJywgc3RhdGUpKX0+e2NoaWxkcmVufTwvZGl2PlxuICAgICk7XG5cbiAgICByZXR1cm4gYXBwZW5kVG8gPyBjcmVhdGVQb3J0YWwobWVudVdyYXBwZXIsIGFwcGVuZFRvKSA6IG1lbnVXcmFwcGVyO1xuICB9XG59XG4iXX0= */')) },
        children
      );

      return appendTo ? createPortal(menuWrapper, appendTo) : menuWrapper;
    }
  }]);
  return MenuPortal;
}(Component);
MenuPortal.childContextTypes = {
  getPortalPlacement: PropTypes.func
};

var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;

function equal(a, b) {
  // fast-deep-equal index.js 2.0.1
  if (a === b) return true;

  if (a && b && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object') {
    var arrA = isArray(a),
        arrB = isArray(b),
        i,
        length,
        key;

    if (arrA && arrB) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;) {
        if (!equal(a[i], b[i])) return false;
      }
      return true;
    }

    if (arrA != arrB) return false;

    var dateA = a instanceof Date,
        dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();

    var regexpA = a instanceof RegExp,
        regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();

    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length) {
      return false;
    }

    for (i = length; i-- !== 0;) {
      if (!hasProp.call(b, keys[i])) return false;
    }
    // end fast-deep-equal

    // Custom handling for React
    for (i = length; i-- !== 0;) {
      key = keys[i];
      if (key === '_owner' && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner.
        //  _owner contains circular references
        // and is not needed when comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of a react element
        continue;
      } else {
        // all other properties should be traversed as usual
        if (!equal(a[key], b[key])) return false;
      }
    }

    // fast-deep-equal index.js 2.0.1
    return true;
  }

  return a !== a && b !== b;
}
// end fast-deep-equal

function exportedEqual(a, b) {
  try {
    return equal(a, b);
  } catch (error) {
    if (error.message && error.message.match(/stack|recursion/i)) {
      // warn on circular references, don't crash
      // browsers give this different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      console.warn('Warning: react-fast-compare does not handle circular references.', error.name, error.message);
      return false;
    }
    // some other error. we should definitely know about these
    throw error;
  }
}

var diacritics = [{ base: 'A', letters: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g }, { base: 'AA', letters: /[\uA732]/g }, { base: 'AE', letters: /[\u00C6\u01FC\u01E2]/g }, { base: 'AO', letters: /[\uA734]/g }, { base: 'AU', letters: /[\uA736]/g }, { base: 'AV', letters: /[\uA738\uA73A]/g }, { base: 'AY', letters: /[\uA73C]/g }, { base: 'B', letters: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g }, { base: 'C', letters: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g }, { base: 'D', letters: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g }, { base: 'DZ', letters: /[\u01F1\u01C4]/g }, { base: 'Dz', letters: /[\u01F2\u01C5]/g }, { base: 'E', letters: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g }, { base: 'F', letters: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g }, { base: 'G', letters: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g }, { base: 'H', letters: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g }, { base: 'I', letters: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g }, { base: 'J', letters: /[\u004A\u24BF\uFF2A\u0134\u0248]/g }, { base: 'K', letters: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g }, { base: 'L', letters: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g }, { base: 'LJ', letters: /[\u01C7]/g }, { base: 'Lj', letters: /[\u01C8]/g }, { base: 'M', letters: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g }, { base: 'N', letters: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g }, { base: 'NJ', letters: /[\u01CA]/g }, { base: 'Nj', letters: /[\u01CB]/g }, { base: 'O', letters: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g }, { base: 'OI', letters: /[\u01A2]/g }, { base: 'OO', letters: /[\uA74E]/g }, { base: 'OU', letters: /[\u0222]/g }, { base: 'P', letters: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g }, { base: 'Q', letters: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g }, { base: 'R', letters: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g }, { base: 'S', letters: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g }, { base: 'T', letters: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g }, { base: 'TZ', letters: /[\uA728]/g }, { base: 'U', letters: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g }, { base: 'V', letters: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g }, { base: 'VY', letters: /[\uA760]/g }, { base: 'W', letters: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g }, { base: 'X', letters: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g }, { base: 'Y', letters: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g }, { base: 'Z', letters: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g }, { base: 'a', letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g }, { base: 'aa', letters: /[\uA733]/g }, { base: 'ae', letters: /[\u00E6\u01FD\u01E3]/g }, { base: 'ao', letters: /[\uA735]/g }, { base: 'au', letters: /[\uA737]/g }, { base: 'av', letters: /[\uA739\uA73B]/g }, { base: 'ay', letters: /[\uA73D]/g }, { base: 'b', letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g }, { base: 'c', letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g }, { base: 'd', letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g }, { base: 'dz', letters: /[\u01F3\u01C6]/g }, { base: 'e', letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g }, { base: 'f', letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g }, { base: 'g', letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g }, { base: 'h', letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g }, { base: 'hv', letters: /[\u0195]/g }, { base: 'i', letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g }, { base: 'j', letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g }, { base: 'k', letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g }, { base: 'l', letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g }, { base: 'lj', letters: /[\u01C9]/g }, { base: 'm', letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g }, { base: 'n', letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g }, { base: 'nj', letters: /[\u01CC]/g }, { base: 'o', letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g }, { base: 'oi', letters: /[\u01A3]/g }, { base: 'ou', letters: /[\u0223]/g }, { base: 'oo', letters: /[\uA74F]/g }, { base: 'p', letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g }, { base: 'q', letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g }, { base: 'r', letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g }, { base: 's', letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g }, { base: 't', letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g }, { base: 'tz', letters: /[\uA729]/g }, { base: 'u', letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g }, { base: 'v', letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g }, { base: 'vy', letters: /[\uA761]/g }, { base: 'w', letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g }, { base: 'x', letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g }, { base: 'y', letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g }, { base: 'z', letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }];

var stripDiacritics = function stripDiacritics(str) {
	for (var i = 0; i < diacritics.length; i++) {
		str = str.replace(diacritics[i].letters, diacritics[i].base);
	}
	return str;
};

var trimString = function trimString(str) {
  return str.replace(/^\s+|\s+$/g, '');
};
var defaultStringify = function defaultStringify(option) {
  return option.label + ' ' + option.value;
};

var createFilter = function createFilter(config) {
  return function (option, rawInput) {
    var _ignoreCase$ignoreAcc = _extends({
      ignoreCase: true,
      ignoreAccents: true,
      stringify: defaultStringify,
      trim: true,
      matchFrom: 'any'
    }, config),
        ignoreCase = _ignoreCase$ignoreAcc.ignoreCase,
        ignoreAccents = _ignoreCase$ignoreAcc.ignoreAccents,
        stringify = _ignoreCase$ignoreAcc.stringify,
        trim = _ignoreCase$ignoreAcc.trim,
        matchFrom = _ignoreCase$ignoreAcc.matchFrom;

    var input = trim ? trimString(rawInput) : rawInput;
    var candidate = trim ? trimString(stringify(option)) : stringify(option);
    if (ignoreCase) {
      input = input.toLowerCase();
      candidate = candidate.toLowerCase();
    }
    if (ignoreAccents) {
      input = stripDiacritics(input);
      candidate = stripDiacritics(candidate);
    }
    return matchFrom === 'start' ? candidate.substr(0, input.length) === input : candidate.indexOf(input) > -1;
  };
};

// Assistive text to describe visual elements. Hidden for sighted users.
var A11yText = function A11yText(props) {
  return React.createElement('span', _extends({
    css: {
      zIndex: 9999,
      border: 0,
      clip: 'rect(1px, 1px, 1px, 1px)',
      height: 1,
      width: 1,
      position: 'absolute',
      overflow: 'hidden',
      padding: 0,
      whiteSpace: 'nowrap',
      backgroundColor: 'red',
      color: 'blue'
    }
  }, props));
};

var DummyInput = function (_Component) {
  inherits(DummyInput, _Component);

  function DummyInput() {
    classCallCheck(this, DummyInput);
    return possibleConstructorReturn(this, (DummyInput.__proto__ || Object.getPrototypeOf(DummyInput)).apply(this, arguments));
  }

  createClass(DummyInput, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          inProp = _props.in,
          out = _props.out,
          onExited = _props.onExited,
          appear = _props.appear,
          enter = _props.enter,
          exit = _props.exit,
          innerRef = _props.innerRef,
          props = objectWithoutProperties(_props, ['in', 'out', 'onExited', 'appear', 'enter', 'exit', 'innerRef']);

      return React.createElement('input', _extends({
        ref: innerRef
      }, props, {
        css: {
          // get rid of any default styles
          background: 0,
          border: 0,
          fontSize: 'inherit',
          outline: 0,
          padding: 0,

          // important! without `width` browsers won't allow focus
          width: 1,

          // remove cursor on desktop
          color: 'transparent',

          // remove cursor on mobile whilst maintaining "scroll into view" behaviour
          left: -100,
          opacity: 0,
          position: 'relative',
          transform: 'scale(0)'
        }
      }));
    }
  }]);
  return DummyInput;
}(Component);

var NodeResolver = function (_Component) {
  inherits(NodeResolver, _Component);

  function NodeResolver() {
    classCallCheck(this, NodeResolver);
    return possibleConstructorReturn(this, (NodeResolver.__proto__ || Object.getPrototypeOf(NodeResolver)).apply(this, arguments));
  }

  createClass(NodeResolver, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.innerRef(findDOMNode(this));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.innerRef(null);
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);
  return NodeResolver;
}(Component);

var STYLE_KEYS = ['boxSizing', 'height', 'overflow', 'paddingRight', 'position'];

var LOCK_STYLES = {
  boxSizing: 'border-box', // account for possible declaration `width: 100%;` on body
  overflow: 'hidden',
  position: 'relative',
  height: '100%'
};

function preventTouchMove(e) {
  e.preventDefault();
}

function allowTouchMove(e) {
  e.stopPropagation();
}

function preventInertiaScroll() {
  var top = this.scrollTop;
  var totalScroll = this.scrollHeight;
  var currentScroll = top + this.offsetHeight;

  if (top === 0) {
    this.scrollTop = 1;
  } else if (currentScroll === totalScroll) {
    this.scrollTop = top - 1;
  }
}

// `ontouchstart` check works on most browsers
// `maxTouchPoints` works on IE10/11 and Surface
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var activeScrollLocks = 0;

var ScrollLock = function (_Component) {
  inherits(ScrollLock, _Component);

  function ScrollLock() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ScrollLock);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ScrollLock.__proto__ || Object.getPrototypeOf(ScrollLock)).call.apply(_ref, [this].concat(args))), _this), _this.originalStyles = {}, _this.listenerOptions = {
      capture: false,
      passive: false
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ScrollLock, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (!canUseDOM) return;

      var _props = this.props,
          accountForScrollbars = _props.accountForScrollbars,
          touchScrollTarget = _props.touchScrollTarget;

      var target = document.body;
      var targetStyle = target && target.style;

      if (accountForScrollbars) {
        // store any styles already applied to the body
        STYLE_KEYS.forEach(function (key) {
          var val = targetStyle && targetStyle[key];
          _this2.originalStyles[key] = val;
        });
      }

      // apply the lock styles and padding if this is the first scroll lock
      if (accountForScrollbars && activeScrollLocks < 1) {
        var currentPadding = parseInt(this.originalStyles.paddingRight, 10) || 0;
        var clientWidth = document.body ? document.body.clientWidth : 0;
        var adjustedPadding = window.innerWidth - clientWidth + currentPadding || 0;

        Object.keys(LOCK_STYLES).forEach(function (key) {
          var val = LOCK_STYLES[key];
          if (targetStyle) {
            targetStyle[key] = val;
          }
        });

        if (targetStyle) {
          targetStyle.paddingRight = adjustedPadding + 'px';
        }
      }

      // account for touch devices
      if (target && isTouchDevice()) {
        // Mobile Safari ignores { overflow: hidden } declaration on the body.
        target.addEventListener('touchmove', preventTouchMove, this.listenerOptions);

        // Allow scroll on provided target
        if (touchScrollTarget) {
          touchScrollTarget.addEventListener('touchstart', preventInertiaScroll, this.listenerOptions);
          touchScrollTarget.addEventListener('touchmove', allowTouchMove, this.listenerOptions);
        }
      }

      // increment active scroll locks
      activeScrollLocks += 1;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      if (!canUseDOM) return;

      var _props2 = this.props,
          accountForScrollbars = _props2.accountForScrollbars,
          touchScrollTarget = _props2.touchScrollTarget;

      var target = document.body;
      var targetStyle = target && target.style;

      // safely decrement active scroll locks
      activeScrollLocks = Math.max(activeScrollLocks - 1, 0);

      // reapply original body styles, if any
      if (accountForScrollbars && activeScrollLocks < 1) {
        STYLE_KEYS.forEach(function (key) {
          var val = _this3.originalStyles[key];
          if (targetStyle) {
            targetStyle[key] = val;
          }
        });
      }

      // remove touch listeners
      if (target && isTouchDevice()) {
        target.removeEventListener('touchmove', preventTouchMove, this.listenerOptions);

        if (touchScrollTarget) {
          touchScrollTarget.removeEventListener('touchstart', preventInertiaScroll, this.listenerOptions);
          touchScrollTarget.removeEventListener('touchmove', allowTouchMove, this.listenerOptions);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);
  return ScrollLock;
}(Component);

ScrollLock.defaultProps = {
  accountForScrollbars: true
};

// NOTE:
// We shouldn't need this after updating to React v16.3.0, which introduces:
// - createRef() https://reactjs.org/docs/react-api.html#reactcreateref
// - forwardRef() https://reactjs.org/docs/react-api.html#reactforwardref

var ScrollBlock = function (_PureComponent) {
  inherits(ScrollBlock, _PureComponent);

  function ScrollBlock() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ScrollBlock);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ScrollBlock.__proto__ || Object.getPrototypeOf(ScrollBlock)).call.apply(_ref, [this].concat(args))), _this), _this.state = { touchScrollTarget: null }, _this.getScrollTarget = function (ref) {
      if (ref === _this.state.touchScrollTarget) return;
      _this.setState({ touchScrollTarget: ref });
    }, _this.blurSelectInput = function () {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  // must be in state to trigger a re-render, only runs once per instance


  // this will close the menu when a user clicks outside


  createClass(ScrollBlock, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          isEnabled = _props.isEnabled;
      var touchScrollTarget = this.state.touchScrollTarget;

      // bail early if not enabled

      if (!isEnabled) return children;

      /*
       * Div
       * ------------------------------
       * blocks scrolling on non-body elements behind the menu
        * NodeResolver
       * ------------------------------
       * we need a reference to the scrollable element to "unlock" scroll on
       * mobile devices
        * ScrollLock
       * ------------------------------
       * actually does the scroll locking
       */
      return React.createElement(
        'div',
        null,
        React.createElement('div', {
          onClick: this.blurSelectInput,
          css: { position: 'fixed', left: 0, bottom: 0, right: 0, top: 0 }
        }),
        React.createElement(
          NodeResolver,
          { innerRef: this.getScrollTarget },
          children
        ),
        touchScrollTarget ? React.createElement(ScrollLock, { touchScrollTarget: touchScrollTarget }) : null
      );
    }
  }]);
  return ScrollBlock;
}(PureComponent);

var ScrollCaptor = function (_Component) {
  inherits(ScrollCaptor, _Component);

  function ScrollCaptor() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ScrollCaptor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ScrollCaptor.__proto__ || Object.getPrototypeOf(ScrollCaptor)).call.apply(_ref, [this].concat(args))), _this), _this.isBottom = false, _this.isTop = false, _this.cancelScroll = function (event) {
      event.preventDefault();
      event.stopPropagation();
    }, _this.handleEventDelta = function (event, delta) {
      var _this$props = _this.props,
          onBottomArrive = _this$props.onBottomArrive,
          onBottomLeave = _this$props.onBottomLeave,
          onTopArrive = _this$props.onTopArrive,
          onTopLeave = _this$props.onTopLeave;
      var _this$scrollTarget = _this.scrollTarget,
          scrollTop = _this$scrollTarget.scrollTop,
          scrollHeight = _this$scrollTarget.scrollHeight,
          clientHeight = _this$scrollTarget.clientHeight;

      var target = _this.scrollTarget;
      var isDeltaPositive = delta > 0;
      var availableScroll = scrollHeight - clientHeight - scrollTop;
      var shouldCancelScroll = false;

      // reset bottom/top flags
      if (availableScroll > delta && _this.isBottom) {
        if (onBottomLeave) onBottomLeave(event);
        _this.isBottom = false;
      }
      if (isDeltaPositive && _this.isTop) {
        if (onTopLeave) onTopLeave(event);
        _this.isTop = false;
      }

      // bottom limit
      if (isDeltaPositive && delta > availableScroll) {
        if (onBottomArrive && !_this.isBottom) {
          onBottomArrive(event);
        }
        target.scrollTop = scrollHeight;
        shouldCancelScroll = true;
        _this.isBottom = true;

        // top limit
      } else if (!isDeltaPositive && -delta > scrollTop) {
        if (onTopArrive && !_this.isTop) {
          onTopArrive(event);
        }
        target.scrollTop = 0;
        shouldCancelScroll = true;
        _this.isTop = true;
      }

      // cancel scroll
      if (shouldCancelScroll) {
        _this.cancelScroll(event);
      }
    }, _this.onWheel = function (event) {
      _this.handleEventDelta(event, event.deltaY);
    }, _this.onTouchStart = function (event) {
      // set touch start so we can calculate touchmove delta
      _this.touchStart = event.changedTouches[0].clientY;
    }, _this.onTouchMove = function (event) {
      var deltaY = _this.touchStart - event.changedTouches[0].clientY;
      _this.handleEventDelta(event, deltaY);
    }, _this.getScrollTarget = function (ref) {
      _this.scrollTarget = ref;
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ScrollCaptor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.startListening(this.scrollTarget);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.stopListening(this.scrollTarget);
    }
  }, {
    key: 'startListening',
    value: function startListening(el) {
      // bail early if no scroll available
      if (el.scrollHeight <= el.clientHeight) return;

      // all the if statements are to appease Flow 😢
      if (typeof el.addEventListener === 'function') {
        el.addEventListener('wheel', this.onWheel, false);
      }
      if (typeof el.addEventListener === 'function') {
        el.addEventListener('touchstart', this.onTouchStart, false);
      }
      if (typeof el.addEventListener === 'function') {
        el.addEventListener('touchmove', this.onTouchMove, false);
      }
    }
  }, {
    key: 'stopListening',
    value: function stopListening(el) {
      // bail early if no scroll available
      if (el.scrollHeight <= el.clientHeight) return;

      // all the if statements are to appease Flow 😢
      if (typeof el.removeEventListener === 'function') {
        el.removeEventListener('wheel', this.onWheel, false);
      }
      if (typeof el.removeEventListener === 'function') {
        el.removeEventListener('touchstart', this.onTouchStart, false);
      }
      if (typeof el.removeEventListener === 'function') {
        el.removeEventListener('touchmove', this.onTouchMove, false);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        NodeResolver,
        { innerRef: this.getScrollTarget },
        this.props.children
      );
    }
  }]);
  return ScrollCaptor;
}(Component);

var ScrollCaptorSwitch = function (_Component2) {
  inherits(ScrollCaptorSwitch, _Component2);

  function ScrollCaptorSwitch() {
    classCallCheck(this, ScrollCaptorSwitch);
    return possibleConstructorReturn(this, (ScrollCaptorSwitch.__proto__ || Object.getPrototypeOf(ScrollCaptorSwitch)).apply(this, arguments));
  }

  createClass(ScrollCaptorSwitch, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          isEnabled = _props.isEnabled,
          props = objectWithoutProperties(_props, ['isEnabled']);

      return isEnabled ? React.createElement(ScrollCaptor, props) : this.props.children;
    }
  }]);
  return ScrollCaptorSwitch;
}(Component);

ScrollCaptorSwitch.defaultProps = { isEnabled: true };

var instructionsAriaMessage = function instructionsAriaMessage(event) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isSearchable = context.isSearchable,
      isMulti = context.isMulti,
      label = context.label;

  switch (event) {
    case 'menu':
      return 'Use Up and Down to choose options, press Backspace to select the currently focused option, press Escape to exit the menu, press Tab to select the option and exit the menu.';
    case 'input':
      return (label ? label : 'Select') + ' is focused ' + (isSearchable ? ',type to refine list' : '') + ', press Down to open the menu, ' + (isMulti ? ' press left to focus selected values' : '');
    case 'value':
      return 'Use left and right to toggle between focused values, press Enter to remove the currently focused value';
  }
};

var valueEventAriaMessage = function valueEventAriaMessage(event, context) {
  var value = context.value;

  if (!value) return;
  switch (event) {
    case 'deselect-option':
    case 'pop-value':
    case 'remove-value':
      return 'option ' + value + ', deselected.';
    case 'select-option':
      return 'option ' + value + ', selected.';
  }
};

var valueFocusAriaMessage = function valueFocusAriaMessage(_ref) {
  var focusedValue = _ref.focusedValue,
      getOptionLabel = _ref.getOptionLabel,
      selectValue = _ref.selectValue;
  return 'value ' + getOptionLabel(focusedValue) + ' focused, ' + (selectValue.indexOf(focusedValue) + 1) + ' of ' + selectValue.length + '.';
};
var optionFocusAriaMessage = function optionFocusAriaMessage(_ref2) {
  var focusedOption = _ref2.focusedOption,
      getOptionLabel = _ref2.getOptionLabel,
      options = _ref2.options;
  return 'option ' + getOptionLabel(focusedOption) + ' focused, ' + (options.indexOf(focusedOption) + 1) + ' of ' + options.length + '.';
};
var resultsAriaMessage = function resultsAriaMessage(_ref3) {
  var inputValue = _ref3.inputValue,
      screenReaderMessage = _ref3.screenReaderMessage;
  return '' + screenReaderMessage + (inputValue ? ' for search term ' + inputValue : '') + '.';
};

var formatGroupLabel = function formatGroupLabel(group) {
  return group.label;
};

var getOptionLabel = function getOptionLabel(option) {
  return option.label;
};

var getOptionValue = function getOptionValue(option) {
  return option.value;
};

var isOptionDisabled = function isOptionDisabled(option) {
  return !!option.isDisabled;
};

// ==============================
// Root Container
// ==============================

var containerCSS = function containerCSS(_ref) {
  var isDisabled = _ref.isDisabled,
      isRtl = _ref.isRtl;
  return {
    direction: isRtl ? 'rtl' : null,
    pointerEvents: isDisabled ? 'none' : null, // cancel mouse events when disabled
    position: 'relative'
  };
};
var SelectContainer = function SelectContainer(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps,
      isDisabled = props.isDisabled,
      isRtl = props.isRtl;

  return React.createElement(
    'div',
    _extends({
      className: cx( /*#__PURE__*/css(getStyles('container', props), 'label:SelectContainer;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhaW5lcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBaUNRIiwiZmlsZSI6ImNvbnRhaW5lcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgdHlwZSBOb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5pbXBvcnQgdHlwZSB7IENvbW1vblByb3BzLCBLZXlib2FyZEV2ZW50SGFuZGxlciB9IGZyb20gJy4uL3R5cGVzJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBSb290IENvbnRhaW5lclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbnR5cGUgQ29udGFpbmVyU3RhdGUgPSB7XG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaXMgZGlzYWJsZWQuICovXG4gIGlzRGlzYWJsZWQ6IGJvb2xlYW4sXG4gIC8qKiBXaGV0aGVyIHRoZSB0ZXh0IGluIHRoZSBzZWxlY3QgaXMgaW5kZW50ZWQgZnJvbSByaWdodCB0byBsZWZ0LiAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmV4cG9ydCB0eXBlIENvbnRhaW5lclByb3BzID0gQ29tbW9uUHJvcHMgJlxuICBDb250YWluZXJTdGF0ZSAmIHtcbiAgICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICAgIGNoaWxkcmVuOiBOb2RlLFxuICAgIC8qKiBJbm5lciBwcm9wcyB0byBiZSBwYXNzZWQgZG93biB0byB0aGUgY29udGFpbmVyLiAqL1xuICAgIGlubmVyUHJvcHM6IHsgb25LZXlEb3duOiBLZXlib2FyZEV2ZW50SGFuZGxlciB9LFxuICB9O1xuZXhwb3J0IGNvbnN0IGNvbnRhaW5lckNTUyA9ICh7IGlzRGlzYWJsZWQsIGlzUnRsIH06IENvbnRhaW5lclN0YXRlKSA9PiAoe1xuICBkaXJlY3Rpb246IGlzUnRsID8gJ3J0bCcgOiBudWxsLFxuICBwb2ludGVyRXZlbnRzOiBpc0Rpc2FibGVkID8gJ25vbmUnIDogbnVsbCwgLy8gY2FuY2VsIG1vdXNlIGV2ZW50cyB3aGVuIGRpc2FibGVkXG4gIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxufSk7XG5leHBvcnQgY29uc3QgU2VsZWN0Q29udGFpbmVyID0gKHByb3BzOiBDb250YWluZXJQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMsIGlzRGlzYWJsZWQsIGlzUnRsIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdjb250YWluZXInLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJy0taXMtZGlzYWJsZWQnOiBpc0Rpc2FibGVkLFxuICAgICAgICAgICctLWlzLXJ0bCc6IGlzUnRsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVmFsdWUgQ29udGFpbmVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IHR5cGUgVmFsdWVDb250YWluZXJQcm9wcyA9IENvbW1vblByb3BzICYge1xuICAvKiogU2V0IHdoZW4gdGhlIHZhbHVlIGNvbnRhaW5lciBzaG91bGQgaG9sZCBtdWx0aXBsZSB2YWx1ZXMgKi9cbiAgaXNNdWx0aTogYm9vbGVhbixcbiAgLyoqIFdoZXRoZXIgdGhlIHZhbHVlIGNvbnRhaW5lciBjdXJyZW50bHkgaG9sZHMgYSB2YWx1ZS4gKi9cbiAgaGFzVmFsdWU6IGJvb2xlYW4sXG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQuICovXG4gIGNoaWxkcmVuOiBOb2RlLFxufTtcbmV4cG9ydCBjb25zdCB2YWx1ZUNvbnRhaW5lckNTUyA9ICh7IHRoZW1lOiB7IHNwYWNpbmcgfSB9OiBWYWx1ZUNvbnRhaW5lclByb3BzKSA9PiAoe1xuICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgZGlzcGxheTogJ2ZsZXgnLFxuICBmbGV4OiAxLFxuICBmbGV4V3JhcDogJ3dyYXAnLFxuICBwYWRkaW5nOiBgJHtzcGFjaW5nLmJhc2VVbml0IC8gMn1weCAke3NwYWNpbmcuYmFzZVVuaXQgKiAyfXB4YCxcbiAgV2Via2l0T3ZlcmZsb3dTY3JvbGxpbmc6ICd0b3VjaCcsXG4gIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG59KTtcbmV4cG9ydCBjbGFzcyBWYWx1ZUNvbnRhaW5lciBleHRlbmRzIENvbXBvbmVudDxWYWx1ZUNvbnRhaW5lclByb3BzPiB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBpc011bHRpLCBnZXRTdHlsZXMsIGhhc1ZhbHVlIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgICBjc3MoZ2V0U3R5bGVzKCd2YWx1ZUNvbnRhaW5lcicsIHRoaXMucHJvcHMpKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAndmFsdWUtY29udGFpbmVyJzogdHJ1ZSxcbiAgICAgICAgICAgICd2YWx1ZS1jb250YWluZXItLWlzLW11bHRpJzogaXNNdWx0aSxcbiAgICAgICAgICAgICd2YWx1ZS1jb250YWluZXItLWhhcy12YWx1ZSc6IGhhc1ZhbHVlLFxuICAgICAgICAgIH0sIGNsYXNzTmFtZSl9XG4gICAgICA+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBJbmRpY2F0b3IgQ29udGFpbmVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBJbmRpY2F0b3JzU3RhdGUgPSB7XG4gIC8qKiBXaGV0aGVyIHRoZSB0ZXh0IHNob3VsZCBiZSByZW5kZXJlZCByaWdodCB0byBsZWZ0LiAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmV4cG9ydCB0eXBlIEluZGljYXRvckNvbnRhaW5lclByb3BzID0gQ29tbW9uUHJvcHMgJlxuICBJbmRpY2F0b3JzU3RhdGUgJiB7XG4gICAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgICBjaGlsZHJlbjogTm9kZSxcbiAgfTtcblxuZXhwb3J0IGNvbnN0IGluZGljYXRvcnNDb250YWluZXJDU1MgPSAoKSA9PiAoe1xuICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgYWxpZ25TZWxmOiAnc3RyZXRjaCcsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgZmxleFNocmluazogMCxcbn0pO1xuZXhwb3J0IGNvbnN0IEluZGljYXRvcnNDb250YWluZXIgPSAocHJvcHM6IEluZGljYXRvckNvbnRhaW5lclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcyB9ID0gcHJvcHM7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdpbmRpY2F0b3JzQ29udGFpbmVyJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdpbmRpY2F0b3JzJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXX0= */')), {
        '--is-disabled': isDisabled,
        '--is-rtl': isRtl
      }, className)
    }, innerProps),
    children
  );
};

// ==============================
// Value Container
// ==============================

var valueContainerCSS = function valueContainerCSS(_ref2) {
  var spacing = _ref2.theme.spacing;
  return {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    padding: spacing.baseUnit / 2 + 'px ' + spacing.baseUnit * 2 + 'px',
    WebkitOverflowScrolling: 'touch',
    position: 'relative',
    overflow: 'hidden'
  };
};
var ValueContainer = function (_Component) {
  inherits(ValueContainer, _Component);

  function ValueContainer() {
    classCallCheck(this, ValueContainer);
    return possibleConstructorReturn(this, (ValueContainer.__proto__ || Object.getPrototypeOf(ValueContainer)).apply(this, arguments));
  }

  createClass(ValueContainer, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          className = _props.className,
          cx = _props.cx,
          isMulti = _props.isMulti,
          getStyles = _props.getStyles,
          hasValue = _props.hasValue;


      return React.createElement(
        'div',
        {
          className: cx( /*#__PURE__*/css(getStyles('valueContainer', this.props), 'label:ValueContainer;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhaW5lcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNEVVIiwiZmlsZSI6ImNvbnRhaW5lcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgdHlwZSBOb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5pbXBvcnQgdHlwZSB7IENvbW1vblByb3BzLCBLZXlib2FyZEV2ZW50SGFuZGxlciB9IGZyb20gJy4uL3R5cGVzJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBSb290IENvbnRhaW5lclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbnR5cGUgQ29udGFpbmVyU3RhdGUgPSB7XG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaXMgZGlzYWJsZWQuICovXG4gIGlzRGlzYWJsZWQ6IGJvb2xlYW4sXG4gIC8qKiBXaGV0aGVyIHRoZSB0ZXh0IGluIHRoZSBzZWxlY3QgaXMgaW5kZW50ZWQgZnJvbSByaWdodCB0byBsZWZ0LiAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmV4cG9ydCB0eXBlIENvbnRhaW5lclByb3BzID0gQ29tbW9uUHJvcHMgJlxuICBDb250YWluZXJTdGF0ZSAmIHtcbiAgICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICAgIGNoaWxkcmVuOiBOb2RlLFxuICAgIC8qKiBJbm5lciBwcm9wcyB0byBiZSBwYXNzZWQgZG93biB0byB0aGUgY29udGFpbmVyLiAqL1xuICAgIGlubmVyUHJvcHM6IHsgb25LZXlEb3duOiBLZXlib2FyZEV2ZW50SGFuZGxlciB9LFxuICB9O1xuZXhwb3J0IGNvbnN0IGNvbnRhaW5lckNTUyA9ICh7IGlzRGlzYWJsZWQsIGlzUnRsIH06IENvbnRhaW5lclN0YXRlKSA9PiAoe1xuICBkaXJlY3Rpb246IGlzUnRsID8gJ3J0bCcgOiBudWxsLFxuICBwb2ludGVyRXZlbnRzOiBpc0Rpc2FibGVkID8gJ25vbmUnIDogbnVsbCwgLy8gY2FuY2VsIG1vdXNlIGV2ZW50cyB3aGVuIGRpc2FibGVkXG4gIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxufSk7XG5leHBvcnQgY29uc3QgU2VsZWN0Q29udGFpbmVyID0gKHByb3BzOiBDb250YWluZXJQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMsIGlzRGlzYWJsZWQsIGlzUnRsIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdjb250YWluZXInLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJy0taXMtZGlzYWJsZWQnOiBpc0Rpc2FibGVkLFxuICAgICAgICAgICctLWlzLXJ0bCc6IGlzUnRsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVmFsdWUgQ29udGFpbmVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IHR5cGUgVmFsdWVDb250YWluZXJQcm9wcyA9IENvbW1vblByb3BzICYge1xuICAvKiogU2V0IHdoZW4gdGhlIHZhbHVlIGNvbnRhaW5lciBzaG91bGQgaG9sZCBtdWx0aXBsZSB2YWx1ZXMgKi9cbiAgaXNNdWx0aTogYm9vbGVhbixcbiAgLyoqIFdoZXRoZXIgdGhlIHZhbHVlIGNvbnRhaW5lciBjdXJyZW50bHkgaG9sZHMgYSB2YWx1ZS4gKi9cbiAgaGFzVmFsdWU6IGJvb2xlYW4sXG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQuICovXG4gIGNoaWxkcmVuOiBOb2RlLFxufTtcbmV4cG9ydCBjb25zdCB2YWx1ZUNvbnRhaW5lckNTUyA9ICh7IHRoZW1lOiB7IHNwYWNpbmcgfSB9OiBWYWx1ZUNvbnRhaW5lclByb3BzKSA9PiAoe1xuICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgZGlzcGxheTogJ2ZsZXgnLFxuICBmbGV4OiAxLFxuICBmbGV4V3JhcDogJ3dyYXAnLFxuICBwYWRkaW5nOiBgJHtzcGFjaW5nLmJhc2VVbml0IC8gMn1weCAke3NwYWNpbmcuYmFzZVVuaXQgKiAyfXB4YCxcbiAgV2Via2l0T3ZlcmZsb3dTY3JvbGxpbmc6ICd0b3VjaCcsXG4gIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG59KTtcbmV4cG9ydCBjbGFzcyBWYWx1ZUNvbnRhaW5lciBleHRlbmRzIENvbXBvbmVudDxWYWx1ZUNvbnRhaW5lclByb3BzPiB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBpc011bHRpLCBnZXRTdHlsZXMsIGhhc1ZhbHVlIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgICBjc3MoZ2V0U3R5bGVzKCd2YWx1ZUNvbnRhaW5lcicsIHRoaXMucHJvcHMpKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAndmFsdWUtY29udGFpbmVyJzogdHJ1ZSxcbiAgICAgICAgICAgICd2YWx1ZS1jb250YWluZXItLWlzLW11bHRpJzogaXNNdWx0aSxcbiAgICAgICAgICAgICd2YWx1ZS1jb250YWluZXItLWhhcy12YWx1ZSc6IGhhc1ZhbHVlLFxuICAgICAgICAgIH0sIGNsYXNzTmFtZSl9XG4gICAgICA+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBJbmRpY2F0b3IgQ29udGFpbmVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBJbmRpY2F0b3JzU3RhdGUgPSB7XG4gIC8qKiBXaGV0aGVyIHRoZSB0ZXh0IHNob3VsZCBiZSByZW5kZXJlZCByaWdodCB0byBsZWZ0LiAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmV4cG9ydCB0eXBlIEluZGljYXRvckNvbnRhaW5lclByb3BzID0gQ29tbW9uUHJvcHMgJlxuICBJbmRpY2F0b3JzU3RhdGUgJiB7XG4gICAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgICBjaGlsZHJlbjogTm9kZSxcbiAgfTtcblxuZXhwb3J0IGNvbnN0IGluZGljYXRvcnNDb250YWluZXJDU1MgPSAoKSA9PiAoe1xuICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgYWxpZ25TZWxmOiAnc3RyZXRjaCcsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgZmxleFNocmluazogMCxcbn0pO1xuZXhwb3J0IGNvbnN0IEluZGljYXRvcnNDb250YWluZXIgPSAocHJvcHM6IEluZGljYXRvckNvbnRhaW5lclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcyB9ID0gcHJvcHM7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdpbmRpY2F0b3JzQ29udGFpbmVyJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdpbmRpY2F0b3JzJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXX0= */')), {
            'value-container': true,
            'value-container--is-multi': isMulti,
            'value-container--has-value': hasValue
          }, className)
        },
        children
      );
    }
  }]);
  return ValueContainer;
}(Component);

// ==============================
// Indicator Container
// ==============================

var indicatorsContainerCSS = function indicatorsContainerCSS() {
  return {
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
    flexShrink: 0
  };
};
var IndicatorsContainer = function IndicatorsContainer(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles;


  return React.createElement(
    'div',
    {
      className: cx( /*#__PURE__*/css(getStyles('indicatorsContainer', props), 'label:IndicatorsContainer;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhaW5lcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBb0hRIiwiZmlsZSI6ImNvbnRhaW5lcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgdHlwZSBOb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5pbXBvcnQgdHlwZSB7IENvbW1vblByb3BzLCBLZXlib2FyZEV2ZW50SGFuZGxlciB9IGZyb20gJy4uL3R5cGVzJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBSb290IENvbnRhaW5lclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbnR5cGUgQ29udGFpbmVyU3RhdGUgPSB7XG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaXMgZGlzYWJsZWQuICovXG4gIGlzRGlzYWJsZWQ6IGJvb2xlYW4sXG4gIC8qKiBXaGV0aGVyIHRoZSB0ZXh0IGluIHRoZSBzZWxlY3QgaXMgaW5kZW50ZWQgZnJvbSByaWdodCB0byBsZWZ0LiAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmV4cG9ydCB0eXBlIENvbnRhaW5lclByb3BzID0gQ29tbW9uUHJvcHMgJlxuICBDb250YWluZXJTdGF0ZSAmIHtcbiAgICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICAgIGNoaWxkcmVuOiBOb2RlLFxuICAgIC8qKiBJbm5lciBwcm9wcyB0byBiZSBwYXNzZWQgZG93biB0byB0aGUgY29udGFpbmVyLiAqL1xuICAgIGlubmVyUHJvcHM6IHsgb25LZXlEb3duOiBLZXlib2FyZEV2ZW50SGFuZGxlciB9LFxuICB9O1xuZXhwb3J0IGNvbnN0IGNvbnRhaW5lckNTUyA9ICh7IGlzRGlzYWJsZWQsIGlzUnRsIH06IENvbnRhaW5lclN0YXRlKSA9PiAoe1xuICBkaXJlY3Rpb246IGlzUnRsID8gJ3J0bCcgOiBudWxsLFxuICBwb2ludGVyRXZlbnRzOiBpc0Rpc2FibGVkID8gJ25vbmUnIDogbnVsbCwgLy8gY2FuY2VsIG1vdXNlIGV2ZW50cyB3aGVuIGRpc2FibGVkXG4gIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxufSk7XG5leHBvcnQgY29uc3QgU2VsZWN0Q29udGFpbmVyID0gKHByb3BzOiBDb250YWluZXJQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMsIGlzRGlzYWJsZWQsIGlzUnRsIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdjb250YWluZXInLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJy0taXMtZGlzYWJsZWQnOiBpc0Rpc2FibGVkLFxuICAgICAgICAgICctLWlzLXJ0bCc6IGlzUnRsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVmFsdWUgQ29udGFpbmVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0IHR5cGUgVmFsdWVDb250YWluZXJQcm9wcyA9IENvbW1vblByb3BzICYge1xuICAvKiogU2V0IHdoZW4gdGhlIHZhbHVlIGNvbnRhaW5lciBzaG91bGQgaG9sZCBtdWx0aXBsZSB2YWx1ZXMgKi9cbiAgaXNNdWx0aTogYm9vbGVhbixcbiAgLyoqIFdoZXRoZXIgdGhlIHZhbHVlIGNvbnRhaW5lciBjdXJyZW50bHkgaG9sZHMgYSB2YWx1ZS4gKi9cbiAgaGFzVmFsdWU6IGJvb2xlYW4sXG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQuICovXG4gIGNoaWxkcmVuOiBOb2RlLFxufTtcbmV4cG9ydCBjb25zdCB2YWx1ZUNvbnRhaW5lckNTUyA9ICh7IHRoZW1lOiB7IHNwYWNpbmcgfSB9OiBWYWx1ZUNvbnRhaW5lclByb3BzKSA9PiAoe1xuICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgZGlzcGxheTogJ2ZsZXgnLFxuICBmbGV4OiAxLFxuICBmbGV4V3JhcDogJ3dyYXAnLFxuICBwYWRkaW5nOiBgJHtzcGFjaW5nLmJhc2VVbml0IC8gMn1weCAke3NwYWNpbmcuYmFzZVVuaXQgKiAyfXB4YCxcbiAgV2Via2l0T3ZlcmZsb3dTY3JvbGxpbmc6ICd0b3VjaCcsXG4gIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG59KTtcbmV4cG9ydCBjbGFzcyBWYWx1ZUNvbnRhaW5lciBleHRlbmRzIENvbXBvbmVudDxWYWx1ZUNvbnRhaW5lclByb3BzPiB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBpc011bHRpLCBnZXRTdHlsZXMsIGhhc1ZhbHVlIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgICBjc3MoZ2V0U3R5bGVzKCd2YWx1ZUNvbnRhaW5lcicsIHRoaXMucHJvcHMpKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAndmFsdWUtY29udGFpbmVyJzogdHJ1ZSxcbiAgICAgICAgICAgICd2YWx1ZS1jb250YWluZXItLWlzLW11bHRpJzogaXNNdWx0aSxcbiAgICAgICAgICAgICd2YWx1ZS1jb250YWluZXItLWhhcy12YWx1ZSc6IGhhc1ZhbHVlLFxuICAgICAgICAgIH0sIGNsYXNzTmFtZSl9XG4gICAgICA+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBJbmRpY2F0b3IgQ29udGFpbmVyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBJbmRpY2F0b3JzU3RhdGUgPSB7XG4gIC8qKiBXaGV0aGVyIHRoZSB0ZXh0IHNob3VsZCBiZSByZW5kZXJlZCByaWdodCB0byBsZWZ0LiAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmV4cG9ydCB0eXBlIEluZGljYXRvckNvbnRhaW5lclByb3BzID0gQ29tbW9uUHJvcHMgJlxuICBJbmRpY2F0b3JzU3RhdGUgJiB7XG4gICAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgICBjaGlsZHJlbjogTm9kZSxcbiAgfTtcblxuZXhwb3J0IGNvbnN0IGluZGljYXRvcnNDb250YWluZXJDU1MgPSAoKSA9PiAoe1xuICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgYWxpZ25TZWxmOiAnc3RyZXRjaCcsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgZmxleFNocmluazogMCxcbn0pO1xuZXhwb3J0IGNvbnN0IEluZGljYXRvcnNDb250YWluZXIgPSAocHJvcHM6IEluZGljYXRvckNvbnRhaW5lclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcyB9ID0gcHJvcHM7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdpbmRpY2F0b3JzQ29udGFpbmVyJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdpbmRpY2F0b3JzJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXX0= */')), {
        'indicators': true
      }, className)
    },
    children
  );
};

// ==============================
// Dropdown & Clear Icons
// ==============================

var Svg = function Svg(_ref) {
  var size = _ref.size,
      props = objectWithoutProperties(_ref, ['size']);
  return React.createElement('svg', _extends({
    height: size,
    width: size,
    viewBox: '0 0 20 20',
    'aria-hidden': 'true',
    focusable: 'false',
    className: /*#__PURE__*/css(process.env.NODE_ENV === 'production' ? {
      name: 'tj5bde-Svg',
      styles: 'display:inline-block;fill:currentColor;line-height:1;stroke:currentColor;stroke-width:0;label:Svg;'
    } : {
      name: 'tj5bde-Svg',
      styles: 'display:inline-block;fill:currentColor;line-height:1;stroke:currentColor;stroke-width:0;label:Svg;',
      map: '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBa0JlIiwiZmlsZSI6ImluZGljYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IHR5cGUgTm9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGluamVjdEdsb2JhbCwgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5cbmltcG9ydCB7IHR5cGUgQ29tbW9uUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFRoZW1lIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgSWNvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTdmcgPSAoeyBzaXplLCAuLi5wcm9wcyB9OiB7IHNpemU6IG51bWJlciB9KSA9PiAoXG4gIDxzdmdcbiAgICBoZWlnaHQ9e3NpemV9XG4gICAgd2lkdGg9e3NpemV9XG4gICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgY2xhc3NOYW1lPXtjc3Moe1xuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBmaWxsOiAnY3VycmVudENvbG9yJyxcbiAgICAgIGxpbmVIZWlnaHQ6IDEsXG4gICAgICBzdHJva2U6ICdjdXJyZW50Q29sb3InLFxuICAgICAgc3Ryb2tlV2lkdGg6IDAsXG4gICAgfSl9XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IGNvbnN0IENyb3NzSWNvbiA9IChwcm9wczogYW55KSA9PiAoXG4gIDxTdmcgc2l6ZT17MjB9IHsuLi5wcm9wc30+XG4gICAgPHBhdGggZD1cIk0xNC4zNDggMTQuODQ5Yy0wLjQ2OSAwLjQ2OS0xLjIyOSAwLjQ2OS0xLjY5NyAwbC0yLjY1MS0zLjAzMC0yLjY1MSAzLjAyOWMtMC40NjkgMC40NjktMS4yMjkgMC40NjktMS42OTcgMC0wLjQ2OS0wLjQ2OS0wLjQ2OS0xLjIyOSAwLTEuNjk3bDIuNzU4LTMuMTUtMi43NTktMy4xNTJjLTAuNDY5LTAuNDY5LTAuNDY5LTEuMjI4IDAtMS42OTdzMS4yMjgtMC40NjkgMS42OTcgMGwyLjY1MiAzLjAzMSAyLjY1MS0zLjAzMWMwLjQ2OS0wLjQ2OSAxLjIyOC0wLjQ2OSAxLjY5NyAwczAuNDY5IDEuMjI5IDAgMS42OTdsLTIuNzU4IDMuMTUyIDIuNzU4IDMuMTVjMC40NjkgMC40NjkgMC40NjkgMS4yMjkgMCAxLjY5OHpcIiAvPlxuICA8L1N2Zz5cbik7XG5leHBvcnQgY29uc3QgRG93bkNoZXZyb24gPSAocHJvcHM6IGFueSkgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNNC41MTYgNy41NDhjMC40MzYtMC40NDYgMS4wNDMtMC40ODEgMS41NzYgMGwzLjkwOCAzLjc0NyAzLjkwOC0zLjc0N2MwLjUzMy0wLjQ4MSAxLjE0MS0wLjQ0NiAxLjU3NCAwIDAuNDM2IDAuNDQ1IDAuNDA4IDEuMTk3IDAgMS42MTUtMC40MDYgMC40MTgtNC42OTUgNC41MDItNC42OTUgNC41MDItMC4yMTcgMC4yMjMtMC41MDIgMC4zMzUtMC43ODcgMC4zMzVzLTAuNTctMC4xMTItMC43ODktMC4zMzVjMCAwLTQuMjg3LTQuMDg0LTQuNjk1LTQuNTAycy0wLjQzNi0xLjE3IDAtMS42MTV6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgQnV0dG9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCB0eXBlIEluZGljYXRvclByb3BzID0gQ29tbW9uUHJvcHMgJiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQgaW5zaWRlIHRoZSBpbmRpY2F0b3IuICovXG4gIGNoaWxkcmVuOiBOb2RlLFxuICAvKiogUHJvcHMgdGhhdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUgY2hpbGRyZW4uICovXG4gIGlubmVyUHJvcHM6IGFueSxcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgLyoqIFdoZXRoZXIgdGhlIHRleHQgaXMgcmlnaHQgdG8gbGVmdCAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmNvbnN0IGJhc2VDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHRoZW1lOiB7IHNwYWNpbmc6IHsgYmFzZVVuaXQgfSwgY29sb3JzIH0sXG59OiBJbmRpY2F0b3JQcm9wcykgPT4gKHtcbiAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHBhZGRpbmc6IGJhc2VVbml0ICogMixcbiAgdHJhbnNpdGlvbjogJ2NvbG9yIDE1MG1zJyxcblxuICAnOmhvdmVyJzoge1xuICAgIGNvbG9yOiBpc0ZvY3VzZWQgPyBjb2xvcnMubmV1dHJhbDgwIDogY29sb3JzLm5ldXRyYWw0MCxcbiAgfSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZHJvcGRvd25JbmRpY2F0b3JDU1MgPSBiYXNlQ1NTO1xuZXhwb3J0IGNvbnN0IERyb3Bkb3duSW5kaWNhdG9yID0gKHByb3BzOiBJbmRpY2F0b3JQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnZHJvcGRvd25JbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2Ryb3Bkb3duLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICl9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbkRyb3Bkb3duSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxEb3duQ2hldnJvbiAvPixcbn07XG5cblxuZXhwb3J0IGNvbnN0IGNsZWFySW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBDbGVhckluZGljYXRvciA9IChwcm9wczogSW5kaWNhdG9yUHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2NsZWFySW5kaWNhdG9yJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdpbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICAgICdjbGVhci1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUpfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNsZWFySW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxDcm9zc0ljb24gLz5cbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU2VwYXJhdG9yXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBTZXBhcmF0b3JTdGF0ZSA9IHsgaXNEaXNhYmxlZDogYm9vbGVhbiB9O1xuXG5leHBvcnQgY29uc3QgaW5kaWNhdG9yU2VwYXJhdG9yQ1NTID0gKHtcbiAgaXNEaXNhYmxlZCxcbiAgdGhlbWU6IHsgc3BhY2luZzogeyBiYXNlVW5pdCB9LCBjb2xvcnMgfSxcbn06IChDb21tb25Qcm9wcyAmIFNlcGFyYXRvclN0YXRlKSkgPT4gKHtcbiAgYWxpZ25TZWxmOiAnc3RyZXRjaCcsXG4gIGJhY2tncm91bmRDb2xvcjogaXNEaXNhYmxlZCA/IGNvbG9ycy5uZXV0cmFsMTAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBtYXJnaW5Cb3R0b206IGJhc2VVbml0ICogMixcbiAgbWFyZ2luVG9wOiBiYXNlVW5pdCAqIDIsXG4gIHdpZHRoOiAxLFxufSk7XG5cbmV4cG9ydCBjb25zdCBJbmRpY2F0b3JTZXBhcmF0b3IgPSAocHJvcHM6IEluZGljYXRvclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8c3BhblxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdpbmRpY2F0b3JTZXBhcmF0b3InLCBwcm9wcykpLFxuICAgICAgICB7ICdpbmRpY2F0b3Itc2VwYXJhdG9yJzogdHJ1ZSB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgLz5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTG9hZGluZ1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGtleWZyYW1lc05hbWUgPSAncmVhY3Qtc2VsZWN0LWxvYWRpbmctaW5kaWNhdG9yJztcblxuZXhwb3J0IGNvbnN0IGxvYWRpbmdJbmRpY2F0b3JDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHNpemUsXG4gIHRoZW1lOiB7IGNvbG9ycywgc3BhY2luZzogeyBiYXNlVW5pdCB9IH0sXG59OiB7XG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgc2l6ZTogbnVtYmVyLFxuICB0aGVtZTogVGhlbWUsXG59KSA9PiAoe1xuICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw2MCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgcGFkZGluZzogYmFzZVVuaXQgKiAyLFxuICB0cmFuc2l0aW9uOiAnY29sb3IgMTUwbXMnLFxuICBhbGlnblNlbGY6ICdjZW50ZXInLFxuICBmb250U2l6ZTogc2l6ZSxcbiAgbGluZUhlaWdodDogMSxcbiAgbWFyZ2luUmlnaHQ6IHNpemUsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxufSk7XG5cbnR5cGUgRG90UHJvcHMgPSB7IGNvbG9yOiBzdHJpbmcsIGRlbGF5OiBudW1iZXIsIG9mZnNldDogYm9vbGVhbiB9O1xuY29uc3QgTG9hZGluZ0RvdCA9ICh7IGNvbG9yLCBkZWxheSwgb2Zmc2V0IH06IERvdFByb3BzKSA9PiAoXG4gIDxzcGFuXG4gICAgY3NzPXt7XG4gICAgICBhbmltYXRpb25EdXJhdGlvbjogJzFzJyxcbiAgICAgIGFuaW1hdGlvbkRlbGF5OiBgJHtkZWxheX1tc2AsXG4gICAgICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogJ2luZmluaXRlJyxcbiAgICAgIGFuaW1hdGlvbk5hbWU6IGtleWZyYW1lc05hbWUsXG4gICAgICBhbmltYXRpb25UaW1pbmdGdW5jdGlvbjogJ2Vhc2UtaW4tb3V0JyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXG4gICAgICBib3JkZXJSYWRpdXM6ICcxZW0nLFxuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBtYXJnaW5MZWZ0OiBvZmZzZXQgPyAnMWVtJyA6IG51bGwsXG4gICAgICBoZWlnaHQ6ICcxZW0nLFxuICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICB3aWR0aDogJzFlbScsXG4gICAgfX1cbiAgLz5cbik7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbmluamVjdEdsb2JhbGBAa2V5ZnJhbWVzICR7a2V5ZnJhbWVzTmFtZX0ge1xuICAwJSwgODAlLCAxMDAlIHsgb3BhY2l0eTogMDsgfVxuICA0MCUgeyBvcGFjaXR5OiAxOyB9XG59O2A7XG5cbmV4cG9ydCB0eXBlIExvYWRpbmdJY29uUHJvcHMgPSB7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogYW55LFxuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuLFxuICAvKiogV2hldGhlciB0aGUgdGV4dCBpcyByaWdodCB0byBsZWZ0ICovXG4gIGlzUnRsOiBib29sZWFuLFxufSAmIENvbW1vblByb3BzICYge1xuICAvKiogU2V0IHNpemUgb2YgdGhlIGNvbnRhaW5lci4gKi9cbiAgc2l6ZTogbnVtYmVyLFxufTtcbmV4cG9ydCBjb25zdCBMb2FkaW5nSW5kaWNhdG9yID0gKHByb3BzOiBMb2FkaW5nSWNvblByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzLCBpc0ZvY3VzZWQsIGlzUnRsLCB0aGVtZTogeyBjb2xvcnMgfSB9ID0gcHJvcHM7XG4gIGNvbnN0IGNvbG9yID0gaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw4MCA6IGNvbG9ycy5uZXV0cmFsMjA7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2xvYWRpbmdJbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2xvYWRpbmctaW5kaWNhdG9yJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgID5cbiAgICAgIDxMb2FkaW5nRG90IGNvbG9yPXtjb2xvcn0gZGVsYXk9ezB9IG9mZnNldD17aXNSdGx9IC8+XG4gICAgICA8TG9hZGluZ0RvdCBjb2xvcj17Y29sb3J9IGRlbGF5PXsxNjB9IG9mZnNldCAvPlxuICAgICAgPExvYWRpbmdEb3QgY29sb3I9e2NvbG9yfSBkZWxheT17MzIwfSBvZmZzZXQ9eyFpc1J0bH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5Mb2FkaW5nSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHsgc2l6ZTogNCB9O1xuIl19 */'
    })
  }, props));
};

var CrossIcon = function CrossIcon(props) {
  return React.createElement(
    Svg,
    _extends({ size: 20 }, props),
    React.createElement('path', { d: 'M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z' })
  );
};
var DownChevron = function DownChevron(props) {
  return React.createElement(
    Svg,
    _extends({ size: 20 }, props),
    React.createElement('path', { d: 'M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z' })
  );
};

// ==============================
// Dropdown & Clear Buttons
// ==============================

var baseCSS = function baseCSS(_ref2) {
  var isFocused = _ref2.isFocused,
      _ref2$theme = _ref2.theme,
      baseUnit = _ref2$theme.spacing.baseUnit,
      colors = _ref2$theme.colors;
  return {
    color: isFocused ? colors.neutral60 : colors.neutral20,
    display: 'flex',
    padding: baseUnit * 2,
    transition: 'color 150ms',

    ':hover': {
      color: isFocused ? colors.neutral80 : colors.neutral40
    }
  };
};

var dropdownIndicatorCSS = baseCSS;
var DropdownIndicator = function DropdownIndicator(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;

  return React.createElement(
    'div',
    _extends({}, innerProps, {
      className: cx( /*#__PURE__*/css(getStyles('dropdownIndicator', props), 'label:DropdownIndicator;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNEVRIiwiZmlsZSI6ImluZGljYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IHR5cGUgTm9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGluamVjdEdsb2JhbCwgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5cbmltcG9ydCB7IHR5cGUgQ29tbW9uUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFRoZW1lIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgSWNvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTdmcgPSAoeyBzaXplLCAuLi5wcm9wcyB9OiB7IHNpemU6IG51bWJlciB9KSA9PiAoXG4gIDxzdmdcbiAgICBoZWlnaHQ9e3NpemV9XG4gICAgd2lkdGg9e3NpemV9XG4gICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgY2xhc3NOYW1lPXtjc3Moe1xuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBmaWxsOiAnY3VycmVudENvbG9yJyxcbiAgICAgIGxpbmVIZWlnaHQ6IDEsXG4gICAgICBzdHJva2U6ICdjdXJyZW50Q29sb3InLFxuICAgICAgc3Ryb2tlV2lkdGg6IDAsXG4gICAgfSl9XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IGNvbnN0IENyb3NzSWNvbiA9IChwcm9wczogYW55KSA9PiAoXG4gIDxTdmcgc2l6ZT17MjB9IHsuLi5wcm9wc30+XG4gICAgPHBhdGggZD1cIk0xNC4zNDggMTQuODQ5Yy0wLjQ2OSAwLjQ2OS0xLjIyOSAwLjQ2OS0xLjY5NyAwbC0yLjY1MS0zLjAzMC0yLjY1MSAzLjAyOWMtMC40NjkgMC40NjktMS4yMjkgMC40NjktMS42OTcgMC0wLjQ2OS0wLjQ2OS0wLjQ2OS0xLjIyOSAwLTEuNjk3bDIuNzU4LTMuMTUtMi43NTktMy4xNTJjLTAuNDY5LTAuNDY5LTAuNDY5LTEuMjI4IDAtMS42OTdzMS4yMjgtMC40NjkgMS42OTcgMGwyLjY1MiAzLjAzMSAyLjY1MS0zLjAzMWMwLjQ2OS0wLjQ2OSAxLjIyOC0wLjQ2OSAxLjY5NyAwczAuNDY5IDEuMjI5IDAgMS42OTdsLTIuNzU4IDMuMTUyIDIuNzU4IDMuMTVjMC40NjkgMC40NjkgMC40NjkgMS4yMjkgMCAxLjY5OHpcIiAvPlxuICA8L1N2Zz5cbik7XG5leHBvcnQgY29uc3QgRG93bkNoZXZyb24gPSAocHJvcHM6IGFueSkgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNNC41MTYgNy41NDhjMC40MzYtMC40NDYgMS4wNDMtMC40ODEgMS41NzYgMGwzLjkwOCAzLjc0NyAzLjkwOC0zLjc0N2MwLjUzMy0wLjQ4MSAxLjE0MS0wLjQ0NiAxLjU3NCAwIDAuNDM2IDAuNDQ1IDAuNDA4IDEuMTk3IDAgMS42MTUtMC40MDYgMC40MTgtNC42OTUgNC41MDItNC42OTUgNC41MDItMC4yMTcgMC4yMjMtMC41MDIgMC4zMzUtMC43ODcgMC4zMzVzLTAuNTctMC4xMTItMC43ODktMC4zMzVjMCAwLTQuMjg3LTQuMDg0LTQuNjk1LTQuNTAycy0wLjQzNi0xLjE3IDAtMS42MTV6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgQnV0dG9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCB0eXBlIEluZGljYXRvclByb3BzID0gQ29tbW9uUHJvcHMgJiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQgaW5zaWRlIHRoZSBpbmRpY2F0b3IuICovXG4gIGNoaWxkcmVuOiBOb2RlLFxuICAvKiogUHJvcHMgdGhhdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUgY2hpbGRyZW4uICovXG4gIGlubmVyUHJvcHM6IGFueSxcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgLyoqIFdoZXRoZXIgdGhlIHRleHQgaXMgcmlnaHQgdG8gbGVmdCAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmNvbnN0IGJhc2VDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHRoZW1lOiB7IHNwYWNpbmc6IHsgYmFzZVVuaXQgfSwgY29sb3JzIH0sXG59OiBJbmRpY2F0b3JQcm9wcykgPT4gKHtcbiAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHBhZGRpbmc6IGJhc2VVbml0ICogMixcbiAgdHJhbnNpdGlvbjogJ2NvbG9yIDE1MG1zJyxcblxuICAnOmhvdmVyJzoge1xuICAgIGNvbG9yOiBpc0ZvY3VzZWQgPyBjb2xvcnMubmV1dHJhbDgwIDogY29sb3JzLm5ldXRyYWw0MCxcbiAgfSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZHJvcGRvd25JbmRpY2F0b3JDU1MgPSBiYXNlQ1NTO1xuZXhwb3J0IGNvbnN0IERyb3Bkb3duSW5kaWNhdG9yID0gKHByb3BzOiBJbmRpY2F0b3JQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnZHJvcGRvd25JbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2Ryb3Bkb3duLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICl9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbkRyb3Bkb3duSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxEb3duQ2hldnJvbiAvPixcbn07XG5cblxuZXhwb3J0IGNvbnN0IGNsZWFySW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBDbGVhckluZGljYXRvciA9IChwcm9wczogSW5kaWNhdG9yUHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2NsZWFySW5kaWNhdG9yJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdpbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICAgICdjbGVhci1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUpfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNsZWFySW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxDcm9zc0ljb24gLz5cbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU2VwYXJhdG9yXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBTZXBhcmF0b3JTdGF0ZSA9IHsgaXNEaXNhYmxlZDogYm9vbGVhbiB9O1xuXG5leHBvcnQgY29uc3QgaW5kaWNhdG9yU2VwYXJhdG9yQ1NTID0gKHtcbiAgaXNEaXNhYmxlZCxcbiAgdGhlbWU6IHsgc3BhY2luZzogeyBiYXNlVW5pdCB9LCBjb2xvcnMgfSxcbn06IChDb21tb25Qcm9wcyAmIFNlcGFyYXRvclN0YXRlKSkgPT4gKHtcbiAgYWxpZ25TZWxmOiAnc3RyZXRjaCcsXG4gIGJhY2tncm91bmRDb2xvcjogaXNEaXNhYmxlZCA/IGNvbG9ycy5uZXV0cmFsMTAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBtYXJnaW5Cb3R0b206IGJhc2VVbml0ICogMixcbiAgbWFyZ2luVG9wOiBiYXNlVW5pdCAqIDIsXG4gIHdpZHRoOiAxLFxufSk7XG5cbmV4cG9ydCBjb25zdCBJbmRpY2F0b3JTZXBhcmF0b3IgPSAocHJvcHM6IEluZGljYXRvclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8c3BhblxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdpbmRpY2F0b3JTZXBhcmF0b3InLCBwcm9wcykpLFxuICAgICAgICB7ICdpbmRpY2F0b3Itc2VwYXJhdG9yJzogdHJ1ZSB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgLz5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTG9hZGluZ1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGtleWZyYW1lc05hbWUgPSAncmVhY3Qtc2VsZWN0LWxvYWRpbmctaW5kaWNhdG9yJztcblxuZXhwb3J0IGNvbnN0IGxvYWRpbmdJbmRpY2F0b3JDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHNpemUsXG4gIHRoZW1lOiB7IGNvbG9ycywgc3BhY2luZzogeyBiYXNlVW5pdCB9IH0sXG59OiB7XG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgc2l6ZTogbnVtYmVyLFxuICB0aGVtZTogVGhlbWUsXG59KSA9PiAoe1xuICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw2MCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgcGFkZGluZzogYmFzZVVuaXQgKiAyLFxuICB0cmFuc2l0aW9uOiAnY29sb3IgMTUwbXMnLFxuICBhbGlnblNlbGY6ICdjZW50ZXInLFxuICBmb250U2l6ZTogc2l6ZSxcbiAgbGluZUhlaWdodDogMSxcbiAgbWFyZ2luUmlnaHQ6IHNpemUsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxufSk7XG5cbnR5cGUgRG90UHJvcHMgPSB7IGNvbG9yOiBzdHJpbmcsIGRlbGF5OiBudW1iZXIsIG9mZnNldDogYm9vbGVhbiB9O1xuY29uc3QgTG9hZGluZ0RvdCA9ICh7IGNvbG9yLCBkZWxheSwgb2Zmc2V0IH06IERvdFByb3BzKSA9PiAoXG4gIDxzcGFuXG4gICAgY3NzPXt7XG4gICAgICBhbmltYXRpb25EdXJhdGlvbjogJzFzJyxcbiAgICAgIGFuaW1hdGlvbkRlbGF5OiBgJHtkZWxheX1tc2AsXG4gICAgICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogJ2luZmluaXRlJyxcbiAgICAgIGFuaW1hdGlvbk5hbWU6IGtleWZyYW1lc05hbWUsXG4gICAgICBhbmltYXRpb25UaW1pbmdGdW5jdGlvbjogJ2Vhc2UtaW4tb3V0JyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXG4gICAgICBib3JkZXJSYWRpdXM6ICcxZW0nLFxuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBtYXJnaW5MZWZ0OiBvZmZzZXQgPyAnMWVtJyA6IG51bGwsXG4gICAgICBoZWlnaHQ6ICcxZW0nLFxuICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICB3aWR0aDogJzFlbScsXG4gICAgfX1cbiAgLz5cbik7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbmluamVjdEdsb2JhbGBAa2V5ZnJhbWVzICR7a2V5ZnJhbWVzTmFtZX0ge1xuICAwJSwgODAlLCAxMDAlIHsgb3BhY2l0eTogMDsgfVxuICA0MCUgeyBvcGFjaXR5OiAxOyB9XG59O2A7XG5cbmV4cG9ydCB0eXBlIExvYWRpbmdJY29uUHJvcHMgPSB7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogYW55LFxuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuLFxuICAvKiogV2hldGhlciB0aGUgdGV4dCBpcyByaWdodCB0byBsZWZ0ICovXG4gIGlzUnRsOiBib29sZWFuLFxufSAmIENvbW1vblByb3BzICYge1xuICAvKiogU2V0IHNpemUgb2YgdGhlIGNvbnRhaW5lci4gKi9cbiAgc2l6ZTogbnVtYmVyLFxufTtcbmV4cG9ydCBjb25zdCBMb2FkaW5nSW5kaWNhdG9yID0gKHByb3BzOiBMb2FkaW5nSWNvblByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzLCBpc0ZvY3VzZWQsIGlzUnRsLCB0aGVtZTogeyBjb2xvcnMgfSB9ID0gcHJvcHM7XG4gIGNvbnN0IGNvbG9yID0gaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw4MCA6IGNvbG9ycy5uZXV0cmFsMjA7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2xvYWRpbmdJbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2xvYWRpbmctaW5kaWNhdG9yJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgID5cbiAgICAgIDxMb2FkaW5nRG90IGNvbG9yPXtjb2xvcn0gZGVsYXk9ezB9IG9mZnNldD17aXNSdGx9IC8+XG4gICAgICA8TG9hZGluZ0RvdCBjb2xvcj17Y29sb3J9IGRlbGF5PXsxNjB9IG9mZnNldCAvPlxuICAgICAgPExvYWRpbmdEb3QgY29sb3I9e2NvbG9yfSBkZWxheT17MzIwfSBvZmZzZXQ9eyFpc1J0bH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5Mb2FkaW5nSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHsgc2l6ZTogNCB9O1xuIl19 */')), {
        'indicator': true,
        'dropdown-indicator': true
      }, className)
    }),
    children
  );
};
DropdownIndicator.defaultProps = {
  children: React.createElement(DownChevron, null)
};

var clearIndicatorCSS = baseCSS;
var ClearIndicator = function ClearIndicator(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;

  return React.createElement(
    'div',
    _extends({}, innerProps, {
      className: cx( /*#__PURE__*/css(getStyles('clearIndicator', props), 'label:ClearIndicator;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBb0dRIiwiZmlsZSI6ImluZGljYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IHR5cGUgTm9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGluamVjdEdsb2JhbCwgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5cbmltcG9ydCB7IHR5cGUgQ29tbW9uUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFRoZW1lIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgSWNvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTdmcgPSAoeyBzaXplLCAuLi5wcm9wcyB9OiB7IHNpemU6IG51bWJlciB9KSA9PiAoXG4gIDxzdmdcbiAgICBoZWlnaHQ9e3NpemV9XG4gICAgd2lkdGg9e3NpemV9XG4gICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgY2xhc3NOYW1lPXtjc3Moe1xuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBmaWxsOiAnY3VycmVudENvbG9yJyxcbiAgICAgIGxpbmVIZWlnaHQ6IDEsXG4gICAgICBzdHJva2U6ICdjdXJyZW50Q29sb3InLFxuICAgICAgc3Ryb2tlV2lkdGg6IDAsXG4gICAgfSl9XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IGNvbnN0IENyb3NzSWNvbiA9IChwcm9wczogYW55KSA9PiAoXG4gIDxTdmcgc2l6ZT17MjB9IHsuLi5wcm9wc30+XG4gICAgPHBhdGggZD1cIk0xNC4zNDggMTQuODQ5Yy0wLjQ2OSAwLjQ2OS0xLjIyOSAwLjQ2OS0xLjY5NyAwbC0yLjY1MS0zLjAzMC0yLjY1MSAzLjAyOWMtMC40NjkgMC40NjktMS4yMjkgMC40NjktMS42OTcgMC0wLjQ2OS0wLjQ2OS0wLjQ2OS0xLjIyOSAwLTEuNjk3bDIuNzU4LTMuMTUtMi43NTktMy4xNTJjLTAuNDY5LTAuNDY5LTAuNDY5LTEuMjI4IDAtMS42OTdzMS4yMjgtMC40NjkgMS42OTcgMGwyLjY1MiAzLjAzMSAyLjY1MS0zLjAzMWMwLjQ2OS0wLjQ2OSAxLjIyOC0wLjQ2OSAxLjY5NyAwczAuNDY5IDEuMjI5IDAgMS42OTdsLTIuNzU4IDMuMTUyIDIuNzU4IDMuMTVjMC40NjkgMC40NjkgMC40NjkgMS4yMjkgMCAxLjY5OHpcIiAvPlxuICA8L1N2Zz5cbik7XG5leHBvcnQgY29uc3QgRG93bkNoZXZyb24gPSAocHJvcHM6IGFueSkgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNNC41MTYgNy41NDhjMC40MzYtMC40NDYgMS4wNDMtMC40ODEgMS41NzYgMGwzLjkwOCAzLjc0NyAzLjkwOC0zLjc0N2MwLjUzMy0wLjQ4MSAxLjE0MS0wLjQ0NiAxLjU3NCAwIDAuNDM2IDAuNDQ1IDAuNDA4IDEuMTk3IDAgMS42MTUtMC40MDYgMC40MTgtNC42OTUgNC41MDItNC42OTUgNC41MDItMC4yMTcgMC4yMjMtMC41MDIgMC4zMzUtMC43ODcgMC4zMzVzLTAuNTctMC4xMTItMC43ODktMC4zMzVjMCAwLTQuMjg3LTQuMDg0LTQuNjk1LTQuNTAycy0wLjQzNi0xLjE3IDAtMS42MTV6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgQnV0dG9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCB0eXBlIEluZGljYXRvclByb3BzID0gQ29tbW9uUHJvcHMgJiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQgaW5zaWRlIHRoZSBpbmRpY2F0b3IuICovXG4gIGNoaWxkcmVuOiBOb2RlLFxuICAvKiogUHJvcHMgdGhhdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUgY2hpbGRyZW4uICovXG4gIGlubmVyUHJvcHM6IGFueSxcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgLyoqIFdoZXRoZXIgdGhlIHRleHQgaXMgcmlnaHQgdG8gbGVmdCAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmNvbnN0IGJhc2VDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHRoZW1lOiB7IHNwYWNpbmc6IHsgYmFzZVVuaXQgfSwgY29sb3JzIH0sXG59OiBJbmRpY2F0b3JQcm9wcykgPT4gKHtcbiAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHBhZGRpbmc6IGJhc2VVbml0ICogMixcbiAgdHJhbnNpdGlvbjogJ2NvbG9yIDE1MG1zJyxcblxuICAnOmhvdmVyJzoge1xuICAgIGNvbG9yOiBpc0ZvY3VzZWQgPyBjb2xvcnMubmV1dHJhbDgwIDogY29sb3JzLm5ldXRyYWw0MCxcbiAgfSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZHJvcGRvd25JbmRpY2F0b3JDU1MgPSBiYXNlQ1NTO1xuZXhwb3J0IGNvbnN0IERyb3Bkb3duSW5kaWNhdG9yID0gKHByb3BzOiBJbmRpY2F0b3JQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnZHJvcGRvd25JbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2Ryb3Bkb3duLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICl9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbkRyb3Bkb3duSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxEb3duQ2hldnJvbiAvPixcbn07XG5cblxuZXhwb3J0IGNvbnN0IGNsZWFySW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBDbGVhckluZGljYXRvciA9IChwcm9wczogSW5kaWNhdG9yUHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2NsZWFySW5kaWNhdG9yJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdpbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICAgICdjbGVhci1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUpfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNsZWFySW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxDcm9zc0ljb24gLz5cbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU2VwYXJhdG9yXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBTZXBhcmF0b3JTdGF0ZSA9IHsgaXNEaXNhYmxlZDogYm9vbGVhbiB9O1xuXG5leHBvcnQgY29uc3QgaW5kaWNhdG9yU2VwYXJhdG9yQ1NTID0gKHtcbiAgaXNEaXNhYmxlZCxcbiAgdGhlbWU6IHsgc3BhY2luZzogeyBiYXNlVW5pdCB9LCBjb2xvcnMgfSxcbn06IChDb21tb25Qcm9wcyAmIFNlcGFyYXRvclN0YXRlKSkgPT4gKHtcbiAgYWxpZ25TZWxmOiAnc3RyZXRjaCcsXG4gIGJhY2tncm91bmRDb2xvcjogaXNEaXNhYmxlZCA/IGNvbG9ycy5uZXV0cmFsMTAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBtYXJnaW5Cb3R0b206IGJhc2VVbml0ICogMixcbiAgbWFyZ2luVG9wOiBiYXNlVW5pdCAqIDIsXG4gIHdpZHRoOiAxLFxufSk7XG5cbmV4cG9ydCBjb25zdCBJbmRpY2F0b3JTZXBhcmF0b3IgPSAocHJvcHM6IEluZGljYXRvclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8c3BhblxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdpbmRpY2F0b3JTZXBhcmF0b3InLCBwcm9wcykpLFxuICAgICAgICB7ICdpbmRpY2F0b3Itc2VwYXJhdG9yJzogdHJ1ZSB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgLz5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTG9hZGluZ1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGtleWZyYW1lc05hbWUgPSAncmVhY3Qtc2VsZWN0LWxvYWRpbmctaW5kaWNhdG9yJztcblxuZXhwb3J0IGNvbnN0IGxvYWRpbmdJbmRpY2F0b3JDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHNpemUsXG4gIHRoZW1lOiB7IGNvbG9ycywgc3BhY2luZzogeyBiYXNlVW5pdCB9IH0sXG59OiB7XG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgc2l6ZTogbnVtYmVyLFxuICB0aGVtZTogVGhlbWUsXG59KSA9PiAoe1xuICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw2MCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgcGFkZGluZzogYmFzZVVuaXQgKiAyLFxuICB0cmFuc2l0aW9uOiAnY29sb3IgMTUwbXMnLFxuICBhbGlnblNlbGY6ICdjZW50ZXInLFxuICBmb250U2l6ZTogc2l6ZSxcbiAgbGluZUhlaWdodDogMSxcbiAgbWFyZ2luUmlnaHQ6IHNpemUsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxufSk7XG5cbnR5cGUgRG90UHJvcHMgPSB7IGNvbG9yOiBzdHJpbmcsIGRlbGF5OiBudW1iZXIsIG9mZnNldDogYm9vbGVhbiB9O1xuY29uc3QgTG9hZGluZ0RvdCA9ICh7IGNvbG9yLCBkZWxheSwgb2Zmc2V0IH06IERvdFByb3BzKSA9PiAoXG4gIDxzcGFuXG4gICAgY3NzPXt7XG4gICAgICBhbmltYXRpb25EdXJhdGlvbjogJzFzJyxcbiAgICAgIGFuaW1hdGlvbkRlbGF5OiBgJHtkZWxheX1tc2AsXG4gICAgICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogJ2luZmluaXRlJyxcbiAgICAgIGFuaW1hdGlvbk5hbWU6IGtleWZyYW1lc05hbWUsXG4gICAgICBhbmltYXRpb25UaW1pbmdGdW5jdGlvbjogJ2Vhc2UtaW4tb3V0JyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXG4gICAgICBib3JkZXJSYWRpdXM6ICcxZW0nLFxuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBtYXJnaW5MZWZ0OiBvZmZzZXQgPyAnMWVtJyA6IG51bGwsXG4gICAgICBoZWlnaHQ6ICcxZW0nLFxuICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICB3aWR0aDogJzFlbScsXG4gICAgfX1cbiAgLz5cbik7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbmluamVjdEdsb2JhbGBAa2V5ZnJhbWVzICR7a2V5ZnJhbWVzTmFtZX0ge1xuICAwJSwgODAlLCAxMDAlIHsgb3BhY2l0eTogMDsgfVxuICA0MCUgeyBvcGFjaXR5OiAxOyB9XG59O2A7XG5cbmV4cG9ydCB0eXBlIExvYWRpbmdJY29uUHJvcHMgPSB7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogYW55LFxuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuLFxuICAvKiogV2hldGhlciB0aGUgdGV4dCBpcyByaWdodCB0byBsZWZ0ICovXG4gIGlzUnRsOiBib29sZWFuLFxufSAmIENvbW1vblByb3BzICYge1xuICAvKiogU2V0IHNpemUgb2YgdGhlIGNvbnRhaW5lci4gKi9cbiAgc2l6ZTogbnVtYmVyLFxufTtcbmV4cG9ydCBjb25zdCBMb2FkaW5nSW5kaWNhdG9yID0gKHByb3BzOiBMb2FkaW5nSWNvblByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzLCBpc0ZvY3VzZWQsIGlzUnRsLCB0aGVtZTogeyBjb2xvcnMgfSB9ID0gcHJvcHM7XG4gIGNvbnN0IGNvbG9yID0gaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw4MCA6IGNvbG9ycy5uZXV0cmFsMjA7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2xvYWRpbmdJbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2xvYWRpbmctaW5kaWNhdG9yJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgID5cbiAgICAgIDxMb2FkaW5nRG90IGNvbG9yPXtjb2xvcn0gZGVsYXk9ezB9IG9mZnNldD17aXNSdGx9IC8+XG4gICAgICA8TG9hZGluZ0RvdCBjb2xvcj17Y29sb3J9IGRlbGF5PXsxNjB9IG9mZnNldCAvPlxuICAgICAgPExvYWRpbmdEb3QgY29sb3I9e2NvbG9yfSBkZWxheT17MzIwfSBvZmZzZXQ9eyFpc1J0bH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5Mb2FkaW5nSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHsgc2l6ZTogNCB9O1xuIl19 */')), {
        'indicator': true,
        'clear-indicator': true
      }, className)
    }),
    children
  );
};

ClearIndicator.defaultProps = {
  children: React.createElement(CrossIcon, null)
};

// ==============================
// Separator
// ==============================

var indicatorSeparatorCSS = function indicatorSeparatorCSS(_ref3) {
  var isDisabled = _ref3.isDisabled,
      _ref3$theme = _ref3.theme,
      baseUnit = _ref3$theme.spacing.baseUnit,
      colors = _ref3$theme.colors;
  return {
    alignSelf: 'stretch',
    backgroundColor: isDisabled ? colors.neutral10 : colors.neutral20,
    marginBottom: baseUnit * 2,
    marginTop: baseUnit * 2,
    width: 1
  };
};

var IndicatorSeparator = function IndicatorSeparator(props) {
  var className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;

  return React.createElement('span', _extends({}, innerProps, {
    className: cx( /*#__PURE__*/css(getStyles('indicatorSeparator', props), 'label:IndicatorSeparator;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMklRIiwiZmlsZSI6ImluZGljYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IHR5cGUgTm9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGluamVjdEdsb2JhbCwgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5cbmltcG9ydCB7IHR5cGUgQ29tbW9uUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFRoZW1lIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgSWNvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTdmcgPSAoeyBzaXplLCAuLi5wcm9wcyB9OiB7IHNpemU6IG51bWJlciB9KSA9PiAoXG4gIDxzdmdcbiAgICBoZWlnaHQ9e3NpemV9XG4gICAgd2lkdGg9e3NpemV9XG4gICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgY2xhc3NOYW1lPXtjc3Moe1xuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBmaWxsOiAnY3VycmVudENvbG9yJyxcbiAgICAgIGxpbmVIZWlnaHQ6IDEsXG4gICAgICBzdHJva2U6ICdjdXJyZW50Q29sb3InLFxuICAgICAgc3Ryb2tlV2lkdGg6IDAsXG4gICAgfSl9XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IGNvbnN0IENyb3NzSWNvbiA9IChwcm9wczogYW55KSA9PiAoXG4gIDxTdmcgc2l6ZT17MjB9IHsuLi5wcm9wc30+XG4gICAgPHBhdGggZD1cIk0xNC4zNDggMTQuODQ5Yy0wLjQ2OSAwLjQ2OS0xLjIyOSAwLjQ2OS0xLjY5NyAwbC0yLjY1MS0zLjAzMC0yLjY1MSAzLjAyOWMtMC40NjkgMC40NjktMS4yMjkgMC40NjktMS42OTcgMC0wLjQ2OS0wLjQ2OS0wLjQ2OS0xLjIyOSAwLTEuNjk3bDIuNzU4LTMuMTUtMi43NTktMy4xNTJjLTAuNDY5LTAuNDY5LTAuNDY5LTEuMjI4IDAtMS42OTdzMS4yMjgtMC40NjkgMS42OTcgMGwyLjY1MiAzLjAzMSAyLjY1MS0zLjAzMWMwLjQ2OS0wLjQ2OSAxLjIyOC0wLjQ2OSAxLjY5NyAwczAuNDY5IDEuMjI5IDAgMS42OTdsLTIuNzU4IDMuMTUyIDIuNzU4IDMuMTVjMC40NjkgMC40NjkgMC40NjkgMS4yMjkgMCAxLjY5OHpcIiAvPlxuICA8L1N2Zz5cbik7XG5leHBvcnQgY29uc3QgRG93bkNoZXZyb24gPSAocHJvcHM6IGFueSkgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNNC41MTYgNy41NDhjMC40MzYtMC40NDYgMS4wNDMtMC40ODEgMS41NzYgMGwzLjkwOCAzLjc0NyAzLjkwOC0zLjc0N2MwLjUzMy0wLjQ4MSAxLjE0MS0wLjQ0NiAxLjU3NCAwIDAuNDM2IDAuNDQ1IDAuNDA4IDEuMTk3IDAgMS42MTUtMC40MDYgMC40MTgtNC42OTUgNC41MDItNC42OTUgNC41MDItMC4yMTcgMC4yMjMtMC41MDIgMC4zMzUtMC43ODcgMC4zMzVzLTAuNTctMC4xMTItMC43ODktMC4zMzVjMCAwLTQuMjg3LTQuMDg0LTQuNjk1LTQuNTAycy0wLjQzNi0xLjE3IDAtMS42MTV6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgQnV0dG9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCB0eXBlIEluZGljYXRvclByb3BzID0gQ29tbW9uUHJvcHMgJiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQgaW5zaWRlIHRoZSBpbmRpY2F0b3IuICovXG4gIGNoaWxkcmVuOiBOb2RlLFxuICAvKiogUHJvcHMgdGhhdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUgY2hpbGRyZW4uICovXG4gIGlubmVyUHJvcHM6IGFueSxcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgLyoqIFdoZXRoZXIgdGhlIHRleHQgaXMgcmlnaHQgdG8gbGVmdCAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmNvbnN0IGJhc2VDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHRoZW1lOiB7IHNwYWNpbmc6IHsgYmFzZVVuaXQgfSwgY29sb3JzIH0sXG59OiBJbmRpY2F0b3JQcm9wcykgPT4gKHtcbiAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHBhZGRpbmc6IGJhc2VVbml0ICogMixcbiAgdHJhbnNpdGlvbjogJ2NvbG9yIDE1MG1zJyxcblxuICAnOmhvdmVyJzoge1xuICAgIGNvbG9yOiBpc0ZvY3VzZWQgPyBjb2xvcnMubmV1dHJhbDgwIDogY29sb3JzLm5ldXRyYWw0MCxcbiAgfSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZHJvcGRvd25JbmRpY2F0b3JDU1MgPSBiYXNlQ1NTO1xuZXhwb3J0IGNvbnN0IERyb3Bkb3duSW5kaWNhdG9yID0gKHByb3BzOiBJbmRpY2F0b3JQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnZHJvcGRvd25JbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2Ryb3Bkb3duLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICl9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbkRyb3Bkb3duSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxEb3duQ2hldnJvbiAvPixcbn07XG5cblxuZXhwb3J0IGNvbnN0IGNsZWFySW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBDbGVhckluZGljYXRvciA9IChwcm9wczogSW5kaWNhdG9yUHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2NsZWFySW5kaWNhdG9yJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdpbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICAgICdjbGVhci1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUpfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNsZWFySW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxDcm9zc0ljb24gLz5cbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU2VwYXJhdG9yXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBTZXBhcmF0b3JTdGF0ZSA9IHsgaXNEaXNhYmxlZDogYm9vbGVhbiB9O1xuXG5leHBvcnQgY29uc3QgaW5kaWNhdG9yU2VwYXJhdG9yQ1NTID0gKHtcbiAgaXNEaXNhYmxlZCxcbiAgdGhlbWU6IHsgc3BhY2luZzogeyBiYXNlVW5pdCB9LCBjb2xvcnMgfSxcbn06IChDb21tb25Qcm9wcyAmIFNlcGFyYXRvclN0YXRlKSkgPT4gKHtcbiAgYWxpZ25TZWxmOiAnc3RyZXRjaCcsXG4gIGJhY2tncm91bmRDb2xvcjogaXNEaXNhYmxlZCA/IGNvbG9ycy5uZXV0cmFsMTAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBtYXJnaW5Cb3R0b206IGJhc2VVbml0ICogMixcbiAgbWFyZ2luVG9wOiBiYXNlVW5pdCAqIDIsXG4gIHdpZHRoOiAxLFxufSk7XG5cbmV4cG9ydCBjb25zdCBJbmRpY2F0b3JTZXBhcmF0b3IgPSAocHJvcHM6IEluZGljYXRvclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8c3BhblxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdpbmRpY2F0b3JTZXBhcmF0b3InLCBwcm9wcykpLFxuICAgICAgICB7ICdpbmRpY2F0b3Itc2VwYXJhdG9yJzogdHJ1ZSB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgLz5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTG9hZGluZ1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGtleWZyYW1lc05hbWUgPSAncmVhY3Qtc2VsZWN0LWxvYWRpbmctaW5kaWNhdG9yJztcblxuZXhwb3J0IGNvbnN0IGxvYWRpbmdJbmRpY2F0b3JDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHNpemUsXG4gIHRoZW1lOiB7IGNvbG9ycywgc3BhY2luZzogeyBiYXNlVW5pdCB9IH0sXG59OiB7XG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgc2l6ZTogbnVtYmVyLFxuICB0aGVtZTogVGhlbWUsXG59KSA9PiAoe1xuICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw2MCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgcGFkZGluZzogYmFzZVVuaXQgKiAyLFxuICB0cmFuc2l0aW9uOiAnY29sb3IgMTUwbXMnLFxuICBhbGlnblNlbGY6ICdjZW50ZXInLFxuICBmb250U2l6ZTogc2l6ZSxcbiAgbGluZUhlaWdodDogMSxcbiAgbWFyZ2luUmlnaHQ6IHNpemUsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxufSk7XG5cbnR5cGUgRG90UHJvcHMgPSB7IGNvbG9yOiBzdHJpbmcsIGRlbGF5OiBudW1iZXIsIG9mZnNldDogYm9vbGVhbiB9O1xuY29uc3QgTG9hZGluZ0RvdCA9ICh7IGNvbG9yLCBkZWxheSwgb2Zmc2V0IH06IERvdFByb3BzKSA9PiAoXG4gIDxzcGFuXG4gICAgY3NzPXt7XG4gICAgICBhbmltYXRpb25EdXJhdGlvbjogJzFzJyxcbiAgICAgIGFuaW1hdGlvbkRlbGF5OiBgJHtkZWxheX1tc2AsXG4gICAgICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogJ2luZmluaXRlJyxcbiAgICAgIGFuaW1hdGlvbk5hbWU6IGtleWZyYW1lc05hbWUsXG4gICAgICBhbmltYXRpb25UaW1pbmdGdW5jdGlvbjogJ2Vhc2UtaW4tb3V0JyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXG4gICAgICBib3JkZXJSYWRpdXM6ICcxZW0nLFxuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBtYXJnaW5MZWZ0OiBvZmZzZXQgPyAnMWVtJyA6IG51bGwsXG4gICAgICBoZWlnaHQ6ICcxZW0nLFxuICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICB3aWR0aDogJzFlbScsXG4gICAgfX1cbiAgLz5cbik7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbmluamVjdEdsb2JhbGBAa2V5ZnJhbWVzICR7a2V5ZnJhbWVzTmFtZX0ge1xuICAwJSwgODAlLCAxMDAlIHsgb3BhY2l0eTogMDsgfVxuICA0MCUgeyBvcGFjaXR5OiAxOyB9XG59O2A7XG5cbmV4cG9ydCB0eXBlIExvYWRpbmdJY29uUHJvcHMgPSB7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogYW55LFxuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuLFxuICAvKiogV2hldGhlciB0aGUgdGV4dCBpcyByaWdodCB0byBsZWZ0ICovXG4gIGlzUnRsOiBib29sZWFuLFxufSAmIENvbW1vblByb3BzICYge1xuICAvKiogU2V0IHNpemUgb2YgdGhlIGNvbnRhaW5lci4gKi9cbiAgc2l6ZTogbnVtYmVyLFxufTtcbmV4cG9ydCBjb25zdCBMb2FkaW5nSW5kaWNhdG9yID0gKHByb3BzOiBMb2FkaW5nSWNvblByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzLCBpc0ZvY3VzZWQsIGlzUnRsLCB0aGVtZTogeyBjb2xvcnMgfSB9ID0gcHJvcHM7XG4gIGNvbnN0IGNvbG9yID0gaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw4MCA6IGNvbG9ycy5uZXV0cmFsMjA7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2xvYWRpbmdJbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2xvYWRpbmctaW5kaWNhdG9yJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgID5cbiAgICAgIDxMb2FkaW5nRG90IGNvbG9yPXtjb2xvcn0gZGVsYXk9ezB9IG9mZnNldD17aXNSdGx9IC8+XG4gICAgICA8TG9hZGluZ0RvdCBjb2xvcj17Y29sb3J9IGRlbGF5PXsxNjB9IG9mZnNldCAvPlxuICAgICAgPExvYWRpbmdEb3QgY29sb3I9e2NvbG9yfSBkZWxheT17MzIwfSBvZmZzZXQ9eyFpc1J0bH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5Mb2FkaW5nSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHsgc2l6ZTogNCB9O1xuIl19 */')), { 'indicator-separator': true }, className)
  }));
};

// ==============================
// Loading
// ==============================

var keyframesName = 'react-select-loading-indicator';

var loadingIndicatorCSS = function loadingIndicatorCSS(_ref4) {
  var isFocused = _ref4.isFocused,
      size = _ref4.size,
      _ref4$theme = _ref4.theme,
      colors = _ref4$theme.colors,
      baseUnit = _ref4$theme.spacing.baseUnit;
  return {
    color: isFocused ? colors.neutral60 : colors.neutral20,
    display: 'flex',
    padding: baseUnit * 2,
    transition: 'color 150ms',
    alignSelf: 'center',
    fontSize: size,
    lineHeight: 1,
    marginRight: size,
    textAlign: 'center',
    verticalAlign: 'middle'
  };
};

var LoadingDot = function LoadingDot(_ref5) {
  var color = _ref5.color,
      delay = _ref5.delay,
      offset = _ref5.offset;
  return React.createElement('span', {
    css: {
      animationDuration: '1s',
      animationDelay: delay + 'ms',
      animationIterationCount: 'infinite',
      animationName: keyframesName,
      animationTimingFunction: 'ease-in-out',
      backgroundColor: color,
      borderRadius: '1em',
      display: 'inline-block',
      marginLeft: offset ? '1em' : null,
      height: '1em',
      verticalAlign: 'top',
      width: '1em'
    }
  });
};

// eslint-disable-next-line no-unused-expressions
injectGlobal('@keyframes ', keyframesName, '{0%,80%,100%{opacity:0;}40%{opacity:1;}};' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbU1ZIiwiZmlsZSI6ImluZGljYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IHR5cGUgTm9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGluamVjdEdsb2JhbCwgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5cbmltcG9ydCB7IHR5cGUgQ29tbW9uUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFRoZW1lIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgSWNvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTdmcgPSAoeyBzaXplLCAuLi5wcm9wcyB9OiB7IHNpemU6IG51bWJlciB9KSA9PiAoXG4gIDxzdmdcbiAgICBoZWlnaHQ9e3NpemV9XG4gICAgd2lkdGg9e3NpemV9XG4gICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgY2xhc3NOYW1lPXtjc3Moe1xuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBmaWxsOiAnY3VycmVudENvbG9yJyxcbiAgICAgIGxpbmVIZWlnaHQ6IDEsXG4gICAgICBzdHJva2U6ICdjdXJyZW50Q29sb3InLFxuICAgICAgc3Ryb2tlV2lkdGg6IDAsXG4gICAgfSl9XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IGNvbnN0IENyb3NzSWNvbiA9IChwcm9wczogYW55KSA9PiAoXG4gIDxTdmcgc2l6ZT17MjB9IHsuLi5wcm9wc30+XG4gICAgPHBhdGggZD1cIk0xNC4zNDggMTQuODQ5Yy0wLjQ2OSAwLjQ2OS0xLjIyOSAwLjQ2OS0xLjY5NyAwbC0yLjY1MS0zLjAzMC0yLjY1MSAzLjAyOWMtMC40NjkgMC40NjktMS4yMjkgMC40NjktMS42OTcgMC0wLjQ2OS0wLjQ2OS0wLjQ2OS0xLjIyOSAwLTEuNjk3bDIuNzU4LTMuMTUtMi43NTktMy4xNTJjLTAuNDY5LTAuNDY5LTAuNDY5LTEuMjI4IDAtMS42OTdzMS4yMjgtMC40NjkgMS42OTcgMGwyLjY1MiAzLjAzMSAyLjY1MS0zLjAzMWMwLjQ2OS0wLjQ2OSAxLjIyOC0wLjQ2OSAxLjY5NyAwczAuNDY5IDEuMjI5IDAgMS42OTdsLTIuNzU4IDMuMTUyIDIuNzU4IDMuMTVjMC40NjkgMC40NjkgMC40NjkgMS4yMjkgMCAxLjY5OHpcIiAvPlxuICA8L1N2Zz5cbik7XG5leHBvcnQgY29uc3QgRG93bkNoZXZyb24gPSAocHJvcHM6IGFueSkgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNNC41MTYgNy41NDhjMC40MzYtMC40NDYgMS4wNDMtMC40ODEgMS41NzYgMGwzLjkwOCAzLjc0NyAzLjkwOC0zLjc0N2MwLjUzMy0wLjQ4MSAxLjE0MS0wLjQ0NiAxLjU3NCAwIDAuNDM2IDAuNDQ1IDAuNDA4IDEuMTk3IDAgMS42MTUtMC40MDYgMC40MTgtNC42OTUgNC41MDItNC42OTUgNC41MDItMC4yMTcgMC4yMjMtMC41MDIgMC4zMzUtMC43ODcgMC4zMzVzLTAuNTctMC4xMTItMC43ODktMC4zMzVjMCAwLTQuMjg3LTQuMDg0LTQuNjk1LTQuNTAycy0wLjQzNi0xLjE3IDAtMS42MTV6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgQnV0dG9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCB0eXBlIEluZGljYXRvclByb3BzID0gQ29tbW9uUHJvcHMgJiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQgaW5zaWRlIHRoZSBpbmRpY2F0b3IuICovXG4gIGNoaWxkcmVuOiBOb2RlLFxuICAvKiogUHJvcHMgdGhhdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUgY2hpbGRyZW4uICovXG4gIGlubmVyUHJvcHM6IGFueSxcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgLyoqIFdoZXRoZXIgdGhlIHRleHQgaXMgcmlnaHQgdG8gbGVmdCAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmNvbnN0IGJhc2VDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHRoZW1lOiB7IHNwYWNpbmc6IHsgYmFzZVVuaXQgfSwgY29sb3JzIH0sXG59OiBJbmRpY2F0b3JQcm9wcykgPT4gKHtcbiAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHBhZGRpbmc6IGJhc2VVbml0ICogMixcbiAgdHJhbnNpdGlvbjogJ2NvbG9yIDE1MG1zJyxcblxuICAnOmhvdmVyJzoge1xuICAgIGNvbG9yOiBpc0ZvY3VzZWQgPyBjb2xvcnMubmV1dHJhbDgwIDogY29sb3JzLm5ldXRyYWw0MCxcbiAgfSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZHJvcGRvd25JbmRpY2F0b3JDU1MgPSBiYXNlQ1NTO1xuZXhwb3J0IGNvbnN0IERyb3Bkb3duSW5kaWNhdG9yID0gKHByb3BzOiBJbmRpY2F0b3JQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnZHJvcGRvd25JbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2Ryb3Bkb3duLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICl9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbkRyb3Bkb3duSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxEb3duQ2hldnJvbiAvPixcbn07XG5cblxuZXhwb3J0IGNvbnN0IGNsZWFySW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBDbGVhckluZGljYXRvciA9IChwcm9wczogSW5kaWNhdG9yUHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2NsZWFySW5kaWNhdG9yJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdpbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICAgICdjbGVhci1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUpfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNsZWFySW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxDcm9zc0ljb24gLz5cbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU2VwYXJhdG9yXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBTZXBhcmF0b3JTdGF0ZSA9IHsgaXNEaXNhYmxlZDogYm9vbGVhbiB9O1xuXG5leHBvcnQgY29uc3QgaW5kaWNhdG9yU2VwYXJhdG9yQ1NTID0gKHtcbiAgaXNEaXNhYmxlZCxcbiAgdGhlbWU6IHsgc3BhY2luZzogeyBiYXNlVW5pdCB9LCBjb2xvcnMgfSxcbn06IChDb21tb25Qcm9wcyAmIFNlcGFyYXRvclN0YXRlKSkgPT4gKHtcbiAgYWxpZ25TZWxmOiAnc3RyZXRjaCcsXG4gIGJhY2tncm91bmRDb2xvcjogaXNEaXNhYmxlZCA/IGNvbG9ycy5uZXV0cmFsMTAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBtYXJnaW5Cb3R0b206IGJhc2VVbml0ICogMixcbiAgbWFyZ2luVG9wOiBiYXNlVW5pdCAqIDIsXG4gIHdpZHRoOiAxLFxufSk7XG5cbmV4cG9ydCBjb25zdCBJbmRpY2F0b3JTZXBhcmF0b3IgPSAocHJvcHM6IEluZGljYXRvclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8c3BhblxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdpbmRpY2F0b3JTZXBhcmF0b3InLCBwcm9wcykpLFxuICAgICAgICB7ICdpbmRpY2F0b3Itc2VwYXJhdG9yJzogdHJ1ZSB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgLz5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTG9hZGluZ1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGtleWZyYW1lc05hbWUgPSAncmVhY3Qtc2VsZWN0LWxvYWRpbmctaW5kaWNhdG9yJztcblxuZXhwb3J0IGNvbnN0IGxvYWRpbmdJbmRpY2F0b3JDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHNpemUsXG4gIHRoZW1lOiB7IGNvbG9ycywgc3BhY2luZzogeyBiYXNlVW5pdCB9IH0sXG59OiB7XG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgc2l6ZTogbnVtYmVyLFxuICB0aGVtZTogVGhlbWUsXG59KSA9PiAoe1xuICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw2MCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgcGFkZGluZzogYmFzZVVuaXQgKiAyLFxuICB0cmFuc2l0aW9uOiAnY29sb3IgMTUwbXMnLFxuICBhbGlnblNlbGY6ICdjZW50ZXInLFxuICBmb250U2l6ZTogc2l6ZSxcbiAgbGluZUhlaWdodDogMSxcbiAgbWFyZ2luUmlnaHQ6IHNpemUsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxufSk7XG5cbnR5cGUgRG90UHJvcHMgPSB7IGNvbG9yOiBzdHJpbmcsIGRlbGF5OiBudW1iZXIsIG9mZnNldDogYm9vbGVhbiB9O1xuY29uc3QgTG9hZGluZ0RvdCA9ICh7IGNvbG9yLCBkZWxheSwgb2Zmc2V0IH06IERvdFByb3BzKSA9PiAoXG4gIDxzcGFuXG4gICAgY3NzPXt7XG4gICAgICBhbmltYXRpb25EdXJhdGlvbjogJzFzJyxcbiAgICAgIGFuaW1hdGlvbkRlbGF5OiBgJHtkZWxheX1tc2AsXG4gICAgICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogJ2luZmluaXRlJyxcbiAgICAgIGFuaW1hdGlvbk5hbWU6IGtleWZyYW1lc05hbWUsXG4gICAgICBhbmltYXRpb25UaW1pbmdGdW5jdGlvbjogJ2Vhc2UtaW4tb3V0JyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXG4gICAgICBib3JkZXJSYWRpdXM6ICcxZW0nLFxuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBtYXJnaW5MZWZ0OiBvZmZzZXQgPyAnMWVtJyA6IG51bGwsXG4gICAgICBoZWlnaHQ6ICcxZW0nLFxuICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICB3aWR0aDogJzFlbScsXG4gICAgfX1cbiAgLz5cbik7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbmluamVjdEdsb2JhbGBAa2V5ZnJhbWVzICR7a2V5ZnJhbWVzTmFtZX0ge1xuICAwJSwgODAlLCAxMDAlIHsgb3BhY2l0eTogMDsgfVxuICA0MCUgeyBvcGFjaXR5OiAxOyB9XG59O2A7XG5cbmV4cG9ydCB0eXBlIExvYWRpbmdJY29uUHJvcHMgPSB7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogYW55LFxuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuLFxuICAvKiogV2hldGhlciB0aGUgdGV4dCBpcyByaWdodCB0byBsZWZ0ICovXG4gIGlzUnRsOiBib29sZWFuLFxufSAmIENvbW1vblByb3BzICYge1xuICAvKiogU2V0IHNpemUgb2YgdGhlIGNvbnRhaW5lci4gKi9cbiAgc2l6ZTogbnVtYmVyLFxufTtcbmV4cG9ydCBjb25zdCBMb2FkaW5nSW5kaWNhdG9yID0gKHByb3BzOiBMb2FkaW5nSWNvblByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzLCBpc0ZvY3VzZWQsIGlzUnRsLCB0aGVtZTogeyBjb2xvcnMgfSB9ID0gcHJvcHM7XG4gIGNvbnN0IGNvbG9yID0gaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw4MCA6IGNvbG9ycy5uZXV0cmFsMjA7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2xvYWRpbmdJbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2xvYWRpbmctaW5kaWNhdG9yJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgID5cbiAgICAgIDxMb2FkaW5nRG90IGNvbG9yPXtjb2xvcn0gZGVsYXk9ezB9IG9mZnNldD17aXNSdGx9IC8+XG4gICAgICA8TG9hZGluZ0RvdCBjb2xvcj17Y29sb3J9IGRlbGF5PXsxNjB9IG9mZnNldCAvPlxuICAgICAgPExvYWRpbmdEb3QgY29sb3I9e2NvbG9yfSBkZWxheT17MzIwfSBvZmZzZXQ9eyFpc1J0bH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5Mb2FkaW5nSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHsgc2l6ZTogNCB9O1xuIl19 */'));

var LoadingIndicator = function LoadingIndicator(props) {
  var className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps,
      isFocused = props.isFocused,
      isRtl = props.isRtl,
      colors = props.theme.colors;

  var color = isFocused ? colors.neutral80 : colors.neutral20;

  return React.createElement(
    'div',
    _extends({}, innerProps, {
      className: cx( /*#__PURE__*/css(getStyles('loadingIndicator', props), 'label:LoadingIndicator;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGljYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMk5RIiwiZmlsZSI6ImluZGljYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IHR5cGUgTm9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGluamVjdEdsb2JhbCwgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5cbmltcG9ydCB7IHR5cGUgQ29tbW9uUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7IFRoZW1lIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgSWNvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTdmcgPSAoeyBzaXplLCAuLi5wcm9wcyB9OiB7IHNpemU6IG51bWJlciB9KSA9PiAoXG4gIDxzdmdcbiAgICBoZWlnaHQ9e3NpemV9XG4gICAgd2lkdGg9e3NpemV9XG4gICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgY2xhc3NOYW1lPXtjc3Moe1xuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBmaWxsOiAnY3VycmVudENvbG9yJyxcbiAgICAgIGxpbmVIZWlnaHQ6IDEsXG4gICAgICBzdHJva2U6ICdjdXJyZW50Q29sb3InLFxuICAgICAgc3Ryb2tlV2lkdGg6IDAsXG4gICAgfSl9XG4gICAgey4uLnByb3BzfVxuICAvPlxuKTtcblxuZXhwb3J0IGNvbnN0IENyb3NzSWNvbiA9IChwcm9wczogYW55KSA9PiAoXG4gIDxTdmcgc2l6ZT17MjB9IHsuLi5wcm9wc30+XG4gICAgPHBhdGggZD1cIk0xNC4zNDggMTQuODQ5Yy0wLjQ2OSAwLjQ2OS0xLjIyOSAwLjQ2OS0xLjY5NyAwbC0yLjY1MS0zLjAzMC0yLjY1MSAzLjAyOWMtMC40NjkgMC40NjktMS4yMjkgMC40NjktMS42OTcgMC0wLjQ2OS0wLjQ2OS0wLjQ2OS0xLjIyOSAwLTEuNjk3bDIuNzU4LTMuMTUtMi43NTktMy4xNTJjLTAuNDY5LTAuNDY5LTAuNDY5LTEuMjI4IDAtMS42OTdzMS4yMjgtMC40NjkgMS42OTcgMGwyLjY1MiAzLjAzMSAyLjY1MS0zLjAzMWMwLjQ2OS0wLjQ2OSAxLjIyOC0wLjQ2OSAxLjY5NyAwczAuNDY5IDEuMjI5IDAgMS42OTdsLTIuNzU4IDMuMTUyIDIuNzU4IDMuMTVjMC40NjkgMC40NjkgMC40NjkgMS4yMjkgMCAxLjY5OHpcIiAvPlxuICA8L1N2Zz5cbik7XG5leHBvcnQgY29uc3QgRG93bkNoZXZyb24gPSAocHJvcHM6IGFueSkgPT4gKFxuICA8U3ZnIHNpemU9ezIwfSB7Li4ucHJvcHN9PlxuICAgIDxwYXRoIGQ9XCJNNC41MTYgNy41NDhjMC40MzYtMC40NDYgMS4wNDMtMC40ODEgMS41NzYgMGwzLjkwOCAzLjc0NyAzLjkwOC0zLjc0N2MwLjUzMy0wLjQ4MSAxLjE0MS0wLjQ0NiAxLjU3NCAwIDAuNDM2IDAuNDQ1IDAuNDA4IDEuMTk3IDAgMS42MTUtMC40MDYgMC40MTgtNC42OTUgNC41MDItNC42OTUgNC41MDItMC4yMTcgMC4yMjMtMC41MDIgMC4zMzUtMC43ODcgMC4zMzVzLTAuNTctMC4xMTItMC43ODktMC4zMzVjMCAwLTQuMjg3LTQuMDg0LTQuNjk1LTQuNTAycy0wLjQzNi0xLjE3IDAtMS42MTV6XCIgLz5cbiAgPC9Tdmc+XG4pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyb3Bkb3duICYgQ2xlYXIgQnV0dG9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCB0eXBlIEluZGljYXRvclByb3BzID0gQ29tbW9uUHJvcHMgJiB7XG4gIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQgaW5zaWRlIHRoZSBpbmRpY2F0b3IuICovXG4gIGNoaWxkcmVuOiBOb2RlLFxuICAvKiogUHJvcHMgdGhhdCB3aWxsIGJlIHBhc3NlZCBvbiB0byB0aGUgY2hpbGRyZW4uICovXG4gIGlubmVyUHJvcHM6IGFueSxcbiAgLyoqIFRoZSBmb2N1c2VkIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgLyoqIFdoZXRoZXIgdGhlIHRleHQgaXMgcmlnaHQgdG8gbGVmdCAqL1xuICBpc1J0bDogYm9vbGVhbixcbn07XG5cbmNvbnN0IGJhc2VDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHRoZW1lOiB7IHNwYWNpbmc6IHsgYmFzZVVuaXQgfSwgY29sb3JzIH0sXG59OiBJbmRpY2F0b3JQcm9wcykgPT4gKHtcbiAgY29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5uZXV0cmFsNjAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHBhZGRpbmc6IGJhc2VVbml0ICogMixcbiAgdHJhbnNpdGlvbjogJ2NvbG9yIDE1MG1zJyxcblxuICAnOmhvdmVyJzoge1xuICAgIGNvbG9yOiBpc0ZvY3VzZWQgPyBjb2xvcnMubmV1dHJhbDgwIDogY29sb3JzLm5ldXRyYWw0MCxcbiAgfSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZHJvcGRvd25JbmRpY2F0b3JDU1MgPSBiYXNlQ1NTO1xuZXhwb3J0IGNvbnN0IERyb3Bkb3duSW5kaWNhdG9yID0gKHByb3BzOiBJbmRpY2F0b3JQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnZHJvcGRvd25JbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2Ryb3Bkb3duLWluZGljYXRvcic6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICl9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcbkRyb3Bkb3duSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxEb3duQ2hldnJvbiAvPixcbn07XG5cblxuZXhwb3J0IGNvbnN0IGNsZWFySW5kaWNhdG9yQ1NTID0gYmFzZUNTUztcbmV4cG9ydCBjb25zdCBDbGVhckluZGljYXRvciA9IChwcm9wczogSW5kaWNhdG9yUHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2NsZWFySW5kaWNhdG9yJywgcHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdpbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICAgICdjbGVhci1pbmRpY2F0b3InOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUpfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkNsZWFySW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IDxDcm9zc0ljb24gLz5cbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU2VwYXJhdG9yXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBTZXBhcmF0b3JTdGF0ZSA9IHsgaXNEaXNhYmxlZDogYm9vbGVhbiB9O1xuXG5leHBvcnQgY29uc3QgaW5kaWNhdG9yU2VwYXJhdG9yQ1NTID0gKHtcbiAgaXNEaXNhYmxlZCxcbiAgdGhlbWU6IHsgc3BhY2luZzogeyBiYXNlVW5pdCB9LCBjb2xvcnMgfSxcbn06IChDb21tb25Qcm9wcyAmIFNlcGFyYXRvclN0YXRlKSkgPT4gKHtcbiAgYWxpZ25TZWxmOiAnc3RyZXRjaCcsXG4gIGJhY2tncm91bmRDb2xvcjogaXNEaXNhYmxlZCA/IGNvbG9ycy5uZXV0cmFsMTAgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBtYXJnaW5Cb3R0b206IGJhc2VVbml0ICogMixcbiAgbWFyZ2luVG9wOiBiYXNlVW5pdCAqIDIsXG4gIHdpZHRoOiAxLFxufSk7XG5cbmV4cG9ydCBjb25zdCBJbmRpY2F0b3JTZXBhcmF0b3IgPSAocHJvcHM6IEluZGljYXRvclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8c3BhblxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdpbmRpY2F0b3JTZXBhcmF0b3InLCBwcm9wcykpLFxuICAgICAgICB7ICdpbmRpY2F0b3Itc2VwYXJhdG9yJzogdHJ1ZSB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICl9XG4gICAgLz5cbiAgKTtcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTG9hZGluZ1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGtleWZyYW1lc05hbWUgPSAncmVhY3Qtc2VsZWN0LWxvYWRpbmctaW5kaWNhdG9yJztcblxuZXhwb3J0IGNvbnN0IGxvYWRpbmdJbmRpY2F0b3JDU1MgPSAoe1xuICBpc0ZvY3VzZWQsXG4gIHNpemUsXG4gIHRoZW1lOiB7IGNvbG9ycywgc3BhY2luZzogeyBiYXNlVW5pdCB9IH0sXG59OiB7XG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgc2l6ZTogbnVtYmVyLFxuICB0aGVtZTogVGhlbWUsXG59KSA9PiAoe1xuICBjb2xvcjogaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw2MCA6IGNvbG9ycy5uZXV0cmFsMjAsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgcGFkZGluZzogYmFzZVVuaXQgKiAyLFxuICB0cmFuc2l0aW9uOiAnY29sb3IgMTUwbXMnLFxuICBhbGlnblNlbGY6ICdjZW50ZXInLFxuICBmb250U2l6ZTogc2l6ZSxcbiAgbGluZUhlaWdodDogMSxcbiAgbWFyZ2luUmlnaHQ6IHNpemUsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxufSk7XG5cbnR5cGUgRG90UHJvcHMgPSB7IGNvbG9yOiBzdHJpbmcsIGRlbGF5OiBudW1iZXIsIG9mZnNldDogYm9vbGVhbiB9O1xuY29uc3QgTG9hZGluZ0RvdCA9ICh7IGNvbG9yLCBkZWxheSwgb2Zmc2V0IH06IERvdFByb3BzKSA9PiAoXG4gIDxzcGFuXG4gICAgY3NzPXt7XG4gICAgICBhbmltYXRpb25EdXJhdGlvbjogJzFzJyxcbiAgICAgIGFuaW1hdGlvbkRlbGF5OiBgJHtkZWxheX1tc2AsXG4gICAgICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogJ2luZmluaXRlJyxcbiAgICAgIGFuaW1hdGlvbk5hbWU6IGtleWZyYW1lc05hbWUsXG4gICAgICBhbmltYXRpb25UaW1pbmdGdW5jdGlvbjogJ2Vhc2UtaW4tb3V0JyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXG4gICAgICBib3JkZXJSYWRpdXM6ICcxZW0nLFxuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBtYXJnaW5MZWZ0OiBvZmZzZXQgPyAnMWVtJyA6IG51bGwsXG4gICAgICBoZWlnaHQ6ICcxZW0nLFxuICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICB3aWR0aDogJzFlbScsXG4gICAgfX1cbiAgLz5cbik7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbmluamVjdEdsb2JhbGBAa2V5ZnJhbWVzICR7a2V5ZnJhbWVzTmFtZX0ge1xuICAwJSwgODAlLCAxMDAlIHsgb3BhY2l0eTogMDsgfVxuICA0MCUgeyBvcGFjaXR5OiAxOyB9XG59O2A7XG5cbmV4cG9ydCB0eXBlIExvYWRpbmdJY29uUHJvcHMgPSB7XG4gIC8qKiBQcm9wcyB0aGF0IHdpbGwgYmUgcGFzc2VkIG9uIHRvIHRoZSBjaGlsZHJlbi4gKi9cbiAgaW5uZXJQcm9wczogYW55LFxuICAvKiogVGhlIGZvY3VzZWQgc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuLFxuICAvKiogV2hldGhlciB0aGUgdGV4dCBpcyByaWdodCB0byBsZWZ0ICovXG4gIGlzUnRsOiBib29sZWFuLFxufSAmIENvbW1vblByb3BzICYge1xuICAvKiogU2V0IHNpemUgb2YgdGhlIGNvbnRhaW5lci4gKi9cbiAgc2l6ZTogbnVtYmVyLFxufTtcbmV4cG9ydCBjb25zdCBMb2FkaW5nSW5kaWNhdG9yID0gKHByb3BzOiBMb2FkaW5nSWNvblByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCBpbm5lclByb3BzLCBpc0ZvY3VzZWQsIGlzUnRsLCB0aGVtZTogeyBjb2xvcnMgfSB9ID0gcHJvcHM7XG4gIGNvbnN0IGNvbG9yID0gaXNGb2N1c2VkID8gY29sb3JzLm5ldXRyYWw4MCA6IGNvbG9ycy5uZXV0cmFsMjA7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB7Li4uaW5uZXJQcm9wc31cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ2xvYWRpbmdJbmRpY2F0b3InLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ2luZGljYXRvcic6IHRydWUsXG4gICAgICAgICAgJ2xvYWRpbmctaW5kaWNhdG9yJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgID5cbiAgICAgIDxMb2FkaW5nRG90IGNvbG9yPXtjb2xvcn0gZGVsYXk9ezB9IG9mZnNldD17aXNSdGx9IC8+XG4gICAgICA8TG9hZGluZ0RvdCBjb2xvcj17Y29sb3J9IGRlbGF5PXsxNjB9IG9mZnNldCAvPlxuICAgICAgPExvYWRpbmdEb3QgY29sb3I9e2NvbG9yfSBkZWxheT17MzIwfSBvZmZzZXQ9eyFpc1J0bH0gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5Mb2FkaW5nSW5kaWNhdG9yLmRlZmF1bHRQcm9wcyA9IHsgc2l6ZTogNCB9O1xuIl19 */')), {
        'indicator': true,
        'loading-indicator': true
      }, className)
    }),
    React.createElement(LoadingDot, { color: color, delay: 0, offset: isRtl }),
    React.createElement(LoadingDot, { color: color, delay: 160, offset: true }),
    React.createElement(LoadingDot, { color: color, delay: 320, offset: !isRtl })
  );
};
LoadingIndicator.defaultProps = { size: 4 };

var css$1 = function css$$1(_ref) {
  var isDisabled = _ref.isDisabled,
      isFocused = _ref.isFocused,
      _ref$theme = _ref.theme,
      colors = _ref$theme.colors,
      borderRadius = _ref$theme.borderRadius,
      spacing = _ref$theme.spacing;
  return {
    alignItems: 'center',
    backgroundColor: isDisabled ? colors.neutral5 : colors.neutral0,
    borderColor: isDisabled ? colors.neutral10 : isFocused ? colors.primary : colors.neutral20,
    borderRadius: borderRadius,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: isFocused ? '0 0 0 1px ' + colors.primary : null,
    cursor: 'default',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minHeight: spacing.controlHeight,
    outline: '0 !important',
    position: 'relative',
    transition: 'all 100ms',

    '&:hover': {
      borderColor: isFocused ? colors.primary : colors.neutral30
    }
  };
};

var Control = function Control(props) {
  var children = props.children,
      cx = props.cx,
      getStyles = props.getStyles,
      className = props.className,
      isDisabled = props.isDisabled,
      isFocused = props.isFocused,
      innerRef = props.innerRef,
      innerProps = props.innerProps;

  return React.createElement(
    'div',
    _extends({
      ref: innerRef,
      className: cx( /*#__PURE__*/css(getStyles('control', props), 'label:Control;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMERvQiIsImZpbGUiOiJDb250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBSZWFjdCwgeyB0eXBlIE5vZGUsIHR5cGUgRWxlbWVudFJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNzcyBhcyBlbW90aW9uQ1NTIH0gZnJvbSAnZW1vdGlvbic7XG5cbmltcG9ydCB0eXBlIHsgQ29tbW9uUHJvcHMsIFByb3BzV2l0aFN0eWxlcyB9IGZyb20gJy4uL3R5cGVzJztcblxudHlwZSBTdGF0ZSA9IHtcbiAgLyoqIFdoZXRoZXIgdGhlIHNlbGVjdCBpcyBkaXNhYmxlZC4gKi9cbiAgaXNEaXNhYmxlZDogYm9vbGVhbixcbiAgLyoqIFdoZXRoZXIgdGhlIHNlbGVjdCBpcyBmb2N1c2VkLiAqL1xuICBpc0ZvY3VzZWQ6IGJvb2xlYW4sXG59O1xuXG5leHBvcnQgdHlwZSBDb250cm9sUHJvcHMgPSBDb21tb25Qcm9wcyAmXG4gIFByb3BzV2l0aFN0eWxlcyAmXG4gIFN0YXRlICYge1xuICAgIC8qKiBDaGlsZHJlbiB0byByZW5kZXIuICovXG4gICAgY2hpbGRyZW46IE5vZGUsXG4gICAgaW5uZXJSZWY6IEVsZW1lbnRSZWY8Kj4sXG4gICAgLyoqIFRoZSBtb3VzZSBkb3duIGV2ZW50IGFuZCB0aGUgaW5uZXJSZWYgdG8gcGFzcyBkb3duIHRvIHRoZSBjb250cm9sbGVyIGVsZW1lbnQuICovXG4gICAgaW5uZXJQcm9wczoge1xuICAgICAgb25Nb3VzZURvd246IChTeW50aGV0aWNNb3VzZUV2ZW50PEhUTUxFbGVtZW50PikgPT4gdm9pZCxcbiAgICB9LFxuICB9O1xuXG5leHBvcnQgY29uc3QgY3NzID0gKHtcbiAgaXNEaXNhYmxlZCxcbiAgaXNGb2N1c2VkLFxuICB0aGVtZTogeyBjb2xvcnMsIGJvcmRlclJhZGl1cywgc3BhY2luZyB9LFxufTogQ29udHJvbFByb3BzKSA9PiAoe1xuICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgYmFja2dyb3VuZENvbG9yOiBpc0Rpc2FibGVkID8gY29sb3JzLm5ldXRyYWw1IDogY29sb3JzLm5ldXRyYWwwLFxuICBib3JkZXJDb2xvcjogaXNEaXNhYmxlZFxuICAgID8gY29sb3JzLm5ldXRyYWwxMFxuICAgIDogaXNGb2N1c2VkID8gY29sb3JzLnByaW1hcnkgOiBjb2xvcnMubmV1dHJhbDIwLFxuICBib3JkZXJSYWRpdXM6IGJvcmRlclJhZGl1cyxcbiAgYm9yZGVyU3R5bGU6ICdzb2xpZCcsXG4gIGJvcmRlcldpZHRoOiAxLFxuICBib3hTaGFkb3c6IGlzRm9jdXNlZCA/IGAwIDAgMCAxcHggJHtjb2xvcnMucHJpbWFyeX1gIDogbnVsbCxcbiAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgZmxleFdyYXA6ICd3cmFwJyxcbiAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgbWluSGVpZ2h0OiBzcGFjaW5nLmNvbnRyb2xIZWlnaHQsXG4gIG91dGxpbmU6ICcwICFpbXBvcnRhbnQnLFxuICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgdHJhbnNpdGlvbjogJ2FsbCAxMDBtcycsXG5cbiAgJyY6aG92ZXInOiB7XG4gICAgYm9yZGVyQ29sb3I6IGlzRm9jdXNlZCA/IGNvbG9ycy5wcmltYXJ5IDogY29sb3JzLm5ldXRyYWwzMCxcbiAgfSxcbn0pO1xuXG5jb25zdCBDb250cm9sID0gKHByb3BzOiBDb250cm9sUHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgY3gsIGdldFN0eWxlcywgY2xhc3NOYW1lLCBpc0Rpc2FibGVkLCBpc0ZvY3VzZWQsIGlubmVyUmVmLCBpbm5lclByb3BzIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICByZWY9e2lubmVyUmVmfVxuICAgICAgY2xhc3NOYW1lPXtjeChlbW90aW9uQ1NTKGdldFN0eWxlcygnY29udHJvbCcsIHByb3BzKSksIHtcbiAgICAgICAgJ2NvbnRyb2wnOiB0cnVlLFxuICAgICAgICAnY29udHJvbC0taXMtZGlzYWJsZWQnOiBpc0Rpc2FibGVkLFxuICAgICAgICAnY29udHJvbC0taXMtZm9jdXNlZCc6IGlzRm9jdXNlZFxuICAgICAgfSwgY2xhc3NOYW1lKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2w7XG4iXX0= */')), {
        'control': true,
        'control--is-disabled': isDisabled,
        'control--is-focused': isFocused
      }, className)
    }, innerProps),
    children
  );
};

var groupCSS = function groupCSS(_ref) {
  var spacing = _ref.theme.spacing;
  return {
    paddingBottom: spacing.baseUnit * 2,
    paddingTop: spacing.baseUnit * 2
  };
};

var Group = function Group(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      Heading = props.Heading,
      headingProps = props.headingProps,
      label = props.label,
      theme = props.theme;

  return React.createElement(
    'div',
    {
      className: cx( /*#__PURE__*/css(getStyles('group', props), 'label:Group;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdyb3VwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXFDUSIsImZpbGUiOiJHcm91cC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgUmVhY3QsIHsgdHlwZSBOb2RlLCB0eXBlIENvbXBvbmVudFR5cGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjc3MgfSBmcm9tICdlbW90aW9uJztcblxuaW1wb3J0IHR5cGUgeyBDb21tb25Qcm9wcyB9IGZyb20gJy4uL3R5cGVzJztcblxudHlwZSBDb21wb25lbnRQcm9wcyA9IHtcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgY2hpbGRyZW46IE5vZGUsXG4gIC8qKiBDb21wb25lbnQgdG8gd3JhcCB0aGUgbGFiZWwsIHJlY2lldmVzIGhlYWRpbmdQcm9wcy4gKi9cbiAgSGVhZGluZzogQ29tcG9uZW50VHlwZTxhbnk+LFxuICAvKiogUHJvcHMgdG8gcGFzcyB0byBIZWFkaW5nLiAqL1xuICBoZWFkaW5nUHJvcHM6IGFueSxcbiAgLyoqIExhYmVsIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgaGVhZGluZyBjb21wb25lbnQuICovXG4gIGxhYmVsOiBOb2RlLFxufTtcbmV4cG9ydCB0eXBlIEdyb3VwUHJvcHMgPSBDb21tb25Qcm9wcyAmIENvbXBvbmVudFByb3BzO1xuXG5leHBvcnQgY29uc3QgZ3JvdXBDU1MgPSAoeyB0aGVtZTogeyBzcGFjaW5nIH0gfTogR3JvdXBQcm9wcykgPT4gKHtcbiAgcGFkZGluZ0JvdHRvbTogc3BhY2luZy5iYXNlVW5pdCAqIDIsXG4gIHBhZGRpbmdUb3A6IHNwYWNpbmcuYmFzZVVuaXQgKiAyLFxufSk7XG5cbmNvbnN0IEdyb3VwID0gKHByb3BzOiBHcm91cFByb3BzKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjaGlsZHJlbixcbiAgICBjbGFzc05hbWUsXG4gICAgY3gsXG4gICAgZ2V0U3R5bGVzLFxuICAgIEhlYWRpbmcsXG4gICAgaGVhZGluZ1Byb3BzLFxuICAgIGxhYmVsLFxuICAgIHRoZW1lLFxuICB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnZ3JvdXAnLCBwcm9wcykpLFxuICAgICAgICB7ICdncm91cCc6IHRydWUgfSxcbiAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgKX1cbiAgICA+XG4gICAgICA8SGVhZGluZyB7Li4uaGVhZGluZ1Byb3BzfSB0aGVtZT17dGhlbWV9IGdldFN0eWxlcz17Z2V0U3R5bGVzfSBjeD17Y3h9PlxuICAgICAgICB7bGFiZWx9XG4gICAgICA8L0hlYWRpbmc+XG4gICAgICA8ZGl2PntjaGlsZHJlbn08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBncm91cEhlYWRpbmdDU1MgPSAoeyB0aGVtZTogeyBzcGFjaW5nIH0gfTogR3JvdXBQcm9wcykgPT4gKHtcbiAgY29sb3I6ICcjOTk5JyxcbiAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gIGRpc3BsYXk6ICdibG9jaycsXG4gIGZvbnRTaXplOiAnNzUlJyxcbiAgZm9udFdlaWdodDogJzUwMCcsXG4gIG1hcmdpbkJvdHRvbTogJzAuMjVlbScsXG4gIHBhZGRpbmdMZWZ0OiBzcGFjaW5nLmJhc2VVbml0ICogMyxcbiAgcGFkZGluZ1JpZ2h0OiBzcGFjaW5nLmJhc2VVbml0ICogMyxcbiAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG59KTtcblxuZXhwb3J0IGNvbnN0IEdyb3VwSGVhZGluZyA9IChwcm9wczogYW55KSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCB0aGVtZSwgLi4uY2xlYW5Qcm9wcyB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnZ3JvdXBIZWFkaW5nJywgeyB0aGVtZSwgLi4uY2xlYW5Qcm9wcyB9KSksXG4gICAgICAgIHsgJ2dyb3VwLWhlYWRpbmcnOiB0cnVlIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5jbGVhblByb3BzfVxuICAgIC8+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHcm91cDtcbiJdfQ== */')), { 'group': true }, className)
    },
    React.createElement(
      Heading,
      _extends({}, headingProps, { theme: theme, getStyles: getStyles, cx: cx }),
      label
    ),
    React.createElement(
      'div',
      null,
      children
    )
  );
};

var groupHeadingCSS = function groupHeadingCSS(_ref2) {
  var spacing = _ref2.theme.spacing;
  return {
    color: '#999',
    cursor: 'default',
    display: 'block',
    fontSize: '75%',
    fontWeight: '500',
    marginBottom: '0.25em',
    paddingLeft: spacing.baseUnit * 3,
    paddingRight: spacing.baseUnit * 3,
    textTransform: 'uppercase'
  };
};

var GroupHeading = function GroupHeading(props) {
  var className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      theme = props.theme,
      cleanProps = objectWithoutProperties(props, ['className', 'cx', 'getStyles', 'theme']);

  return React.createElement('div', _extends({
    className: cx( /*#__PURE__*/css(getStyles('groupHeading', _extends({ theme: theme }, cleanProps)), 'label:GroupHeading;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdyb3VwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQW1FUSIsImZpbGUiOiJHcm91cC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgUmVhY3QsIHsgdHlwZSBOb2RlLCB0eXBlIENvbXBvbmVudFR5cGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjc3MgfSBmcm9tICdlbW90aW9uJztcblxuaW1wb3J0IHR5cGUgeyBDb21tb25Qcm9wcyB9IGZyb20gJy4uL3R5cGVzJztcblxudHlwZSBDb21wb25lbnRQcm9wcyA9IHtcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgY2hpbGRyZW46IE5vZGUsXG4gIC8qKiBDb21wb25lbnQgdG8gd3JhcCB0aGUgbGFiZWwsIHJlY2lldmVzIGhlYWRpbmdQcm9wcy4gKi9cbiAgSGVhZGluZzogQ29tcG9uZW50VHlwZTxhbnk+LFxuICAvKiogUHJvcHMgdG8gcGFzcyB0byBIZWFkaW5nLiAqL1xuICBoZWFkaW5nUHJvcHM6IGFueSxcbiAgLyoqIExhYmVsIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgaGVhZGluZyBjb21wb25lbnQuICovXG4gIGxhYmVsOiBOb2RlLFxufTtcbmV4cG9ydCB0eXBlIEdyb3VwUHJvcHMgPSBDb21tb25Qcm9wcyAmIENvbXBvbmVudFByb3BzO1xuXG5leHBvcnQgY29uc3QgZ3JvdXBDU1MgPSAoeyB0aGVtZTogeyBzcGFjaW5nIH0gfTogR3JvdXBQcm9wcykgPT4gKHtcbiAgcGFkZGluZ0JvdHRvbTogc3BhY2luZy5iYXNlVW5pdCAqIDIsXG4gIHBhZGRpbmdUb3A6IHNwYWNpbmcuYmFzZVVuaXQgKiAyLFxufSk7XG5cbmNvbnN0IEdyb3VwID0gKHByb3BzOiBHcm91cFByb3BzKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjaGlsZHJlbixcbiAgICBjbGFzc05hbWUsXG4gICAgY3gsXG4gICAgZ2V0U3R5bGVzLFxuICAgIEhlYWRpbmcsXG4gICAgaGVhZGluZ1Byb3BzLFxuICAgIGxhYmVsLFxuICAgIHRoZW1lLFxuICB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnZ3JvdXAnLCBwcm9wcykpLFxuICAgICAgICB7ICdncm91cCc6IHRydWUgfSxcbiAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgKX1cbiAgICA+XG4gICAgICA8SGVhZGluZyB7Li4uaGVhZGluZ1Byb3BzfSB0aGVtZT17dGhlbWV9IGdldFN0eWxlcz17Z2V0U3R5bGVzfSBjeD17Y3h9PlxuICAgICAgICB7bGFiZWx9XG4gICAgICA8L0hlYWRpbmc+XG4gICAgICA8ZGl2PntjaGlsZHJlbn08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBncm91cEhlYWRpbmdDU1MgPSAoeyB0aGVtZTogeyBzcGFjaW5nIH0gfTogR3JvdXBQcm9wcykgPT4gKHtcbiAgY29sb3I6ICcjOTk5JyxcbiAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gIGRpc3BsYXk6ICdibG9jaycsXG4gIGZvbnRTaXplOiAnNzUlJyxcbiAgZm9udFdlaWdodDogJzUwMCcsXG4gIG1hcmdpbkJvdHRvbTogJzAuMjVlbScsXG4gIHBhZGRpbmdMZWZ0OiBzcGFjaW5nLmJhc2VVbml0ICogMyxcbiAgcGFkZGluZ1JpZ2h0OiBzcGFjaW5nLmJhc2VVbml0ICogMyxcbiAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG59KTtcblxuZXhwb3J0IGNvbnN0IEdyb3VwSGVhZGluZyA9IChwcm9wczogYW55KSA9PiB7XG4gIGNvbnN0IHsgY2xhc3NOYW1lLCBjeCwgZ2V0U3R5bGVzLCB0aGVtZSwgLi4uY2xlYW5Qcm9wcyB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnZ3JvdXBIZWFkaW5nJywgeyB0aGVtZSwgLi4uY2xlYW5Qcm9wcyB9KSksXG4gICAgICAgIHsgJ2dyb3VwLWhlYWRpbmcnOiB0cnVlIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5jbGVhblByb3BzfVxuICAgIC8+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHcm91cDtcbiJdfQ== */')), { 'group-heading': true }, className)
  }, cleanProps));
};

var inputCSS = function inputCSS(_ref) {
  var isDisabled = _ref.isDisabled,
      _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return {
    margin: spacing.baseUnit / 2,
    paddingBottom: spacing.baseUnit / 2,
    paddingTop: spacing.baseUnit / 2,
    visibility: isDisabled ? 'hidden' : 'visible',
    color: colors.neutral80
  };
};
var inputStyle = function inputStyle(isHidden) {
  return {
    background: 0,
    border: 0,
    fontSize: 'inherit',
    opacity: isHidden ? 0 : 1,
    outline: 0,
    padding: 0,
    color: 'inherit'
  };
};

var Input = function Input(_ref2) {
  var className = _ref2.className,
      cx = _ref2.cx,
      getStyles = _ref2.getStyles,
      innerRef = _ref2.innerRef,
      isHidden = _ref2.isHidden,
      isDisabled = _ref2.isDisabled,
      theme = _ref2.theme,
      props = objectWithoutProperties(_ref2, ['className', 'cx', 'getStyles', 'innerRef', 'isHidden', 'isDisabled', 'theme']);
  return React.createElement(
    'div',
    { css: getStyles('input', _extends({ theme: theme }, props)) },
    React.createElement(AutosizeInput, _extends({
      className: cx(null, { 'input': true }, className),
      inputRef: innerRef,
      inputStyle: inputStyle(isHidden),
      disabled: isDisabled
    }, props))
  );
};

var multiValueCSS = function multiValueCSS(_ref) {
  var _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      borderRadius = _ref$theme.borderRadius,
      colors = _ref$theme.colors;
  return {
    backgroundColor: colors.neutral10,
    borderRadius: borderRadius / 2,
    display: 'flex',
    margin: spacing.baseUnit / 2,
    minWidth: 0 // resolves flex/text-overflow bug
  };
};

var multiValueLabelCSS = function multiValueLabelCSS(_ref2) {
  var _ref2$theme = _ref2.theme,
      borderRadius = _ref2$theme.borderRadius,
      colors = _ref2$theme.colors,
      cropWithEllipsis = _ref2.cropWithEllipsis;
  return {
    borderRadius: borderRadius / 2,
    color: colors.neutral80,
    fontSize: '85%',
    overflow: 'hidden',
    padding: 3,
    paddingLeft: 6,
    textOverflow: cropWithEllipsis ? 'ellipsis' : null,
    whiteSpace: 'nowrap'
  };
};

var multiValueRemoveCSS = function multiValueRemoveCSS(_ref3) {
  var _ref3$theme = _ref3.theme,
      spacing = _ref3$theme.spacing,
      borderRadius = _ref3$theme.borderRadius,
      colors = _ref3$theme.colors,
      isFocused = _ref3.isFocused;
  return {
    alignItems: 'center',
    borderRadius: borderRadius / 2,
    backgroundColor: isFocused && colors.dangerLight,
    display: 'flex',
    paddingLeft: spacing.baseUnit,
    paddingRight: spacing.baseUnit,
    ':hover': {
      backgroundColor: colors.dangerLight,
      color: colors.danger
    }
  };
};

var MultiValueGeneric = function MultiValueGeneric(_ref4) {
  var children = _ref4.children,
      innerProps = _ref4.innerProps;
  return React.createElement(
    'div',
    innerProps,
    children
  );
};

var MultiValueContainer = MultiValueGeneric;
var MultiValueLabel = MultiValueGeneric;

var MultiValueRemove = function (_Component) {
  inherits(MultiValueRemove, _Component);

  function MultiValueRemove() {
    classCallCheck(this, MultiValueRemove);
    return possibleConstructorReturn(this, (MultiValueRemove.__proto__ || Object.getPrototypeOf(MultiValueRemove)).apply(this, arguments));
  }

  createClass(MultiValueRemove, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          innerProps = _props.innerProps;

      return React.createElement(
        'div',
        innerProps,
        children
      );
    }
  }]);
  return MultiValueRemove;
}(Component);

MultiValueRemove.defaultProps = {
  children: React.createElement(CrossIcon, { size: 14 })
};

var MultiValue = function (_Component2) {
  inherits(MultiValue, _Component2);

  function MultiValue() {
    classCallCheck(this, MultiValue);
    return possibleConstructorReturn(this, (MultiValue.__proto__ || Object.getPrototypeOf(MultiValue)).apply(this, arguments));
  }

  createClass(MultiValue, [{
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          components = _props2.components,
          cx = _props2.cx,
          data = _props2.data,
          getStyles = _props2.getStyles,
          innerProps = _props2.innerProps,
          isDisabled = _props2.isDisabled,
          removeProps = _props2.removeProps,
          selectProps = _props2.selectProps;
      var Container = components.Container,
          Label = components.Label,
          Remove = components.Remove;


      var containerInnerProps = _extends({
        className: cx( /*#__PURE__*/css(getStyles('multiValue', this.props), 'label:MultiValue;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk11bHRpVmFsdWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbUhRIiwiZmlsZSI6Ik11bHRpVmFsdWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgdHlwZSBOb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5cbmltcG9ydCB7IENyb3NzSWNvbiB9IGZyb20gJy4vaW5kaWNhdG9ycyc7XG5pbXBvcnQgdHlwZSB7IENvbW1vblByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgdHlwZSBNdWx0aVZhbHVlUHJvcHMgPSBDb21tb25Qcm9wcyAmIHtcbiAgY2hpbGRyZW46IE5vZGUsXG4gIGNvbXBvbmVudHM6IGFueSxcbiAgY3JvcFdpdGhFbGxpcHNpczogYm9vbGVhbixcbiAgZGF0YTogYW55LFxuICBpbm5lclByb3BzOiBhbnksXG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgaXNEaXNhYmxlZDogYm9vbGVhbixcbiAgcmVtb3ZlUHJvcHM6IHtcbiAgICBvblRvdWNoRW5kOiBhbnkgPT4gdm9pZCxcbiAgICBvbkNsaWNrOiBhbnkgPT4gdm9pZCxcbiAgICBvbk1vdXNlRG93bjogYW55ID0+IHZvaWQsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgbXVsdGlWYWx1ZUNTUyA9ICh7XG4gIHRoZW1lOiB7IHNwYWNpbmcsIGJvcmRlclJhZGl1cywgY29sb3JzIH0sXG59OiBNdWx0aVZhbHVlUHJvcHMpID0+ICh7XG4gIGJhY2tncm91bmRDb2xvcjogY29sb3JzLm5ldXRyYWwxMCxcbiAgYm9yZGVyUmFkaXVzOiBib3JkZXJSYWRpdXMgLyAyLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIG1hcmdpbjogc3BhY2luZy5iYXNlVW5pdCAvIDIsXG4gIG1pbldpZHRoOiAwLCAvLyByZXNvbHZlcyBmbGV4L3RleHQtb3ZlcmZsb3cgYnVnXG59KTtcblxuZXhwb3J0IGNvbnN0IG11bHRpVmFsdWVMYWJlbENTUyA9ICh7IHRoZW1lOiB7IGJvcmRlclJhZGl1cywgY29sb3JzIH0sIGNyb3BXaXRoRWxsaXBzaXMgfTogTXVsdGlWYWx1ZVByb3BzKSA9PiAoe1xuICBib3JkZXJSYWRpdXM6IGJvcmRlclJhZGl1cyAvIDIsXG4gIGNvbG9yOiBjb2xvcnMubmV1dHJhbDgwLFxuICBmb250U2l6ZTogJzg1JScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgcGFkZGluZzogMyxcbiAgcGFkZGluZ0xlZnQ6IDYsXG4gIHRleHRPdmVyZmxvdzogY3JvcFdpdGhFbGxpcHNpcyA/ICdlbGxpcHNpcycgOiBudWxsLFxuICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbn0pO1xuXG5leHBvcnQgY29uc3QgbXVsdGlWYWx1ZVJlbW92ZUNTUyA9ICh7XG4gIHRoZW1lOiB7IHNwYWNpbmcsIGJvcmRlclJhZGl1cywgY29sb3JzIH0sXG4gIGlzRm9jdXNlZCxcbn06IE11bHRpVmFsdWVQcm9wcykgPT4gKHtcbiAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gIGJvcmRlclJhZGl1czogYm9yZGVyUmFkaXVzIC8gMixcbiAgYmFja2dyb3VuZENvbG9yOiBpc0ZvY3VzZWQgJiYgY29sb3JzLmRhbmdlckxpZ2h0LFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHBhZGRpbmdMZWZ0OiBzcGFjaW5nLmJhc2VVbml0LFxuICBwYWRkaW5nUmlnaHQ6IHNwYWNpbmcuYmFzZVVuaXQsXG4gICc6aG92ZXInOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcnMuZGFuZ2VyTGlnaHQsXG4gICAgY29sb3I6IGNvbG9ycy5kYW5nZXIsXG4gIH0sXG59KTtcblxuZXhwb3J0IHR5cGUgTXVsdGlWYWx1ZUdlbmVyaWNQcm9wcyA9IHtcbiAgY2hpbGRyZW46IE5vZGUsXG4gIGRhdGE6IGFueSxcbiAgaW5uZXJQcm9wczogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSxcbiAgc2VsZWN0UHJvcHM6IGFueSxcbn07XG5leHBvcnQgY29uc3QgTXVsdGlWYWx1ZUdlbmVyaWMgPSAoe1xuICBjaGlsZHJlbixcbiAgaW5uZXJQcm9wcyxcbn06IE11bHRpVmFsdWVHZW5lcmljUHJvcHMpID0+IDxkaXYgey4uLmlubmVyUHJvcHN9PntjaGlsZHJlbn08L2Rpdj47XG5cbmV4cG9ydCBjb25zdCBNdWx0aVZhbHVlQ29udGFpbmVyID0gTXVsdGlWYWx1ZUdlbmVyaWM7XG5leHBvcnQgY29uc3QgTXVsdGlWYWx1ZUxhYmVsID0gTXVsdGlWYWx1ZUdlbmVyaWM7XG5leHBvcnQgdHlwZSBNdWx0aVZhbHVlUmVtb3ZlUHJvcHMgPSBDb21tb25Qcm9wcyAmIHtcbiAgY2hpbGRyZW46IE5vZGUsXG4gIGRhdGE6IGFueSxcbiAgaW5uZXJQcm9wczoge1xuICAgIGNsYXNzTmFtZTogc3RyaW5nLFxuICAgIG9uVG91Y2hFbmQ6IGFueSA9PiB2b2lkLFxuICAgIG9uQ2xpY2s6IGFueSA9PiB2b2lkLFxuICAgIG9uTW91c2VEb3duOiBhbnkgPT4gdm9pZCxcbiAgfSxcbiAgc2VsZWN0UHJvcHM6IGFueSxcbn07XG5leHBvcnQgY2xhc3MgTXVsdGlWYWx1ZVJlbW92ZSBleHRlbmRzIENvbXBvbmVudDxNdWx0aVZhbHVlUmVtb3ZlUHJvcHM+IHtcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjaGlsZHJlbjogPENyb3NzSWNvbiBzaXplPXsxNH0gLz4sXG4gIH07XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBpbm5lclByb3BzIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiA8ZGl2IHsuLi5pbm5lclByb3BzfT57Y2hpbGRyZW59PC9kaXY+O1xuICB9XG59XG5cbmNsYXNzIE11bHRpVmFsdWUgZXh0ZW5kcyBDb21wb25lbnQ8TXVsdGlWYWx1ZVByb3BzPiB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgY3JvcFdpdGhFbGxpcHNpczogdHJ1ZSxcbiAgfTtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgY29tcG9uZW50cyxcbiAgICAgIGN4LFxuICAgICAgZGF0YSxcbiAgICAgIGdldFN0eWxlcyxcbiAgICAgIGlubmVyUHJvcHMsXG4gICAgICBpc0Rpc2FibGVkLFxuICAgICAgcmVtb3ZlUHJvcHMsXG4gICAgICBzZWxlY3RQcm9wcyxcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHsgQ29udGFpbmVyLCBMYWJlbCwgUmVtb3ZlIH0gPSBjb21wb25lbnRzO1xuXG4gICAgY29uc3QgY29udGFpbmVySW5uZXJQcm9wcyA9IHtcbiAgICAgIGNsYXNzTmFtZTogY3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ211bHRpVmFsdWUnLCB0aGlzLnByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnbXVsdGktdmFsdWUnOiB0cnVlLFxuICAgICAgICAgICdtdWx0aS12YWx1ZS0taXMtZGlzYWJsZWQnOiBpc0Rpc2FibGVkLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICksXG4gICAgICAuLi5pbm5lclByb3BzLFxuICAgIH07XG5cbiAgICBjb25zdCBsYWJlbElubmVyUHJvcHMgPSB7XG4gICAgICBjbGFzc05hbWU6IGN4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdtdWx0aVZhbHVlTGFiZWwnLCB0aGlzLnByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnbXVsdGktdmFsdWVfX2xhYmVsJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApLFxuICAgIH07XG5cbiAgICBjb25zdCByZW1vdmVJbm5lclByb3BzID0ge1xuICAgICAgY2xhc3NOYW1lOiBjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnbXVsdGlWYWx1ZVJlbW92ZScsIHRoaXMucHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdtdWx0aS12YWx1ZV9fcmVtb3ZlJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApLFxuICAgICAgLi4ucmVtb3ZlUHJvcHMsXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Q29udGFpbmVyXG4gICAgICAgIGRhdGE9e2RhdGF9XG4gICAgICAgIGlubmVyUHJvcHM9e2NvbnRhaW5lcklubmVyUHJvcHN9XG4gICAgICAgIHNlbGVjdFByb3BzPXtzZWxlY3RQcm9wc31cbiAgICAgID5cbiAgICAgICAgPExhYmVsXG4gICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICBpbm5lclByb3BzPXtsYWJlbElubmVyUHJvcHN9XG4gICAgICAgICAgc2VsZWN0UHJvcHM9e3NlbGVjdFByb3BzfVxuICAgICAgICA+XG4gICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L0xhYmVsPlxuICAgICAgICA8UmVtb3ZlXG4gICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICBpbm5lclByb3BzPXtyZW1vdmVJbm5lclByb3BzfVxuICAgICAgICAgIHNlbGVjdFByb3BzPXtzZWxlY3RQcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvQ29udGFpbmVyPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTXVsdGlWYWx1ZTtcbiJdfQ== */')), {
          'multi-value': true,
          'multi-value--is-disabled': isDisabled
        }, className)
      }, innerProps);

      var labelInnerProps = {
        className: cx( /*#__PURE__*/css(getStyles('multiValueLabel', this.props), 'label:MultiValue;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk11bHRpVmFsdWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBK0hRIiwiZmlsZSI6Ik11bHRpVmFsdWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgdHlwZSBOb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5cbmltcG9ydCB7IENyb3NzSWNvbiB9IGZyb20gJy4vaW5kaWNhdG9ycyc7XG5pbXBvcnQgdHlwZSB7IENvbW1vblByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgdHlwZSBNdWx0aVZhbHVlUHJvcHMgPSBDb21tb25Qcm9wcyAmIHtcbiAgY2hpbGRyZW46IE5vZGUsXG4gIGNvbXBvbmVudHM6IGFueSxcbiAgY3JvcFdpdGhFbGxpcHNpczogYm9vbGVhbixcbiAgZGF0YTogYW55LFxuICBpbm5lclByb3BzOiBhbnksXG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgaXNEaXNhYmxlZDogYm9vbGVhbixcbiAgcmVtb3ZlUHJvcHM6IHtcbiAgICBvblRvdWNoRW5kOiBhbnkgPT4gdm9pZCxcbiAgICBvbkNsaWNrOiBhbnkgPT4gdm9pZCxcbiAgICBvbk1vdXNlRG93bjogYW55ID0+IHZvaWQsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgbXVsdGlWYWx1ZUNTUyA9ICh7XG4gIHRoZW1lOiB7IHNwYWNpbmcsIGJvcmRlclJhZGl1cywgY29sb3JzIH0sXG59OiBNdWx0aVZhbHVlUHJvcHMpID0+ICh7XG4gIGJhY2tncm91bmRDb2xvcjogY29sb3JzLm5ldXRyYWwxMCxcbiAgYm9yZGVyUmFkaXVzOiBib3JkZXJSYWRpdXMgLyAyLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIG1hcmdpbjogc3BhY2luZy5iYXNlVW5pdCAvIDIsXG4gIG1pbldpZHRoOiAwLCAvLyByZXNvbHZlcyBmbGV4L3RleHQtb3ZlcmZsb3cgYnVnXG59KTtcblxuZXhwb3J0IGNvbnN0IG11bHRpVmFsdWVMYWJlbENTUyA9ICh7IHRoZW1lOiB7IGJvcmRlclJhZGl1cywgY29sb3JzIH0sIGNyb3BXaXRoRWxsaXBzaXMgfTogTXVsdGlWYWx1ZVByb3BzKSA9PiAoe1xuICBib3JkZXJSYWRpdXM6IGJvcmRlclJhZGl1cyAvIDIsXG4gIGNvbG9yOiBjb2xvcnMubmV1dHJhbDgwLFxuICBmb250U2l6ZTogJzg1JScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgcGFkZGluZzogMyxcbiAgcGFkZGluZ0xlZnQ6IDYsXG4gIHRleHRPdmVyZmxvdzogY3JvcFdpdGhFbGxpcHNpcyA/ICdlbGxpcHNpcycgOiBudWxsLFxuICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbn0pO1xuXG5leHBvcnQgY29uc3QgbXVsdGlWYWx1ZVJlbW92ZUNTUyA9ICh7XG4gIHRoZW1lOiB7IHNwYWNpbmcsIGJvcmRlclJhZGl1cywgY29sb3JzIH0sXG4gIGlzRm9jdXNlZCxcbn06IE11bHRpVmFsdWVQcm9wcykgPT4gKHtcbiAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gIGJvcmRlclJhZGl1czogYm9yZGVyUmFkaXVzIC8gMixcbiAgYmFja2dyb3VuZENvbG9yOiBpc0ZvY3VzZWQgJiYgY29sb3JzLmRhbmdlckxpZ2h0LFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHBhZGRpbmdMZWZ0OiBzcGFjaW5nLmJhc2VVbml0LFxuICBwYWRkaW5nUmlnaHQ6IHNwYWNpbmcuYmFzZVVuaXQsXG4gICc6aG92ZXInOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcnMuZGFuZ2VyTGlnaHQsXG4gICAgY29sb3I6IGNvbG9ycy5kYW5nZXIsXG4gIH0sXG59KTtcblxuZXhwb3J0IHR5cGUgTXVsdGlWYWx1ZUdlbmVyaWNQcm9wcyA9IHtcbiAgY2hpbGRyZW46IE5vZGUsXG4gIGRhdGE6IGFueSxcbiAgaW5uZXJQcm9wczogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSxcbiAgc2VsZWN0UHJvcHM6IGFueSxcbn07XG5leHBvcnQgY29uc3QgTXVsdGlWYWx1ZUdlbmVyaWMgPSAoe1xuICBjaGlsZHJlbixcbiAgaW5uZXJQcm9wcyxcbn06IE11bHRpVmFsdWVHZW5lcmljUHJvcHMpID0+IDxkaXYgey4uLmlubmVyUHJvcHN9PntjaGlsZHJlbn08L2Rpdj47XG5cbmV4cG9ydCBjb25zdCBNdWx0aVZhbHVlQ29udGFpbmVyID0gTXVsdGlWYWx1ZUdlbmVyaWM7XG5leHBvcnQgY29uc3QgTXVsdGlWYWx1ZUxhYmVsID0gTXVsdGlWYWx1ZUdlbmVyaWM7XG5leHBvcnQgdHlwZSBNdWx0aVZhbHVlUmVtb3ZlUHJvcHMgPSBDb21tb25Qcm9wcyAmIHtcbiAgY2hpbGRyZW46IE5vZGUsXG4gIGRhdGE6IGFueSxcbiAgaW5uZXJQcm9wczoge1xuICAgIGNsYXNzTmFtZTogc3RyaW5nLFxuICAgIG9uVG91Y2hFbmQ6IGFueSA9PiB2b2lkLFxuICAgIG9uQ2xpY2s6IGFueSA9PiB2b2lkLFxuICAgIG9uTW91c2VEb3duOiBhbnkgPT4gdm9pZCxcbiAgfSxcbiAgc2VsZWN0UHJvcHM6IGFueSxcbn07XG5leHBvcnQgY2xhc3MgTXVsdGlWYWx1ZVJlbW92ZSBleHRlbmRzIENvbXBvbmVudDxNdWx0aVZhbHVlUmVtb3ZlUHJvcHM+IHtcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjaGlsZHJlbjogPENyb3NzSWNvbiBzaXplPXsxNH0gLz4sXG4gIH07XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBpbm5lclByb3BzIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiA8ZGl2IHsuLi5pbm5lclByb3BzfT57Y2hpbGRyZW59PC9kaXY+O1xuICB9XG59XG5cbmNsYXNzIE11bHRpVmFsdWUgZXh0ZW5kcyBDb21wb25lbnQ8TXVsdGlWYWx1ZVByb3BzPiB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgY3JvcFdpdGhFbGxpcHNpczogdHJ1ZSxcbiAgfTtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgY29tcG9uZW50cyxcbiAgICAgIGN4LFxuICAgICAgZGF0YSxcbiAgICAgIGdldFN0eWxlcyxcbiAgICAgIGlubmVyUHJvcHMsXG4gICAgICBpc0Rpc2FibGVkLFxuICAgICAgcmVtb3ZlUHJvcHMsXG4gICAgICBzZWxlY3RQcm9wcyxcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHsgQ29udGFpbmVyLCBMYWJlbCwgUmVtb3ZlIH0gPSBjb21wb25lbnRzO1xuXG4gICAgY29uc3QgY29udGFpbmVySW5uZXJQcm9wcyA9IHtcbiAgICAgIGNsYXNzTmFtZTogY3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ211bHRpVmFsdWUnLCB0aGlzLnByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnbXVsdGktdmFsdWUnOiB0cnVlLFxuICAgICAgICAgICdtdWx0aS12YWx1ZS0taXMtZGlzYWJsZWQnOiBpc0Rpc2FibGVkLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICksXG4gICAgICAuLi5pbm5lclByb3BzLFxuICAgIH07XG5cbiAgICBjb25zdCBsYWJlbElubmVyUHJvcHMgPSB7XG4gICAgICBjbGFzc05hbWU6IGN4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdtdWx0aVZhbHVlTGFiZWwnLCB0aGlzLnByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnbXVsdGktdmFsdWVfX2xhYmVsJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApLFxuICAgIH07XG5cbiAgICBjb25zdCByZW1vdmVJbm5lclByb3BzID0ge1xuICAgICAgY2xhc3NOYW1lOiBjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnbXVsdGlWYWx1ZVJlbW92ZScsIHRoaXMucHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdtdWx0aS12YWx1ZV9fcmVtb3ZlJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApLFxuICAgICAgLi4ucmVtb3ZlUHJvcHMsXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Q29udGFpbmVyXG4gICAgICAgIGRhdGE9e2RhdGF9XG4gICAgICAgIGlubmVyUHJvcHM9e2NvbnRhaW5lcklubmVyUHJvcHN9XG4gICAgICAgIHNlbGVjdFByb3BzPXtzZWxlY3RQcm9wc31cbiAgICAgID5cbiAgICAgICAgPExhYmVsXG4gICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICBpbm5lclByb3BzPXtsYWJlbElubmVyUHJvcHN9XG4gICAgICAgICAgc2VsZWN0UHJvcHM9e3NlbGVjdFByb3BzfVxuICAgICAgICA+XG4gICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L0xhYmVsPlxuICAgICAgICA8UmVtb3ZlXG4gICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICBpbm5lclByb3BzPXtyZW1vdmVJbm5lclByb3BzfVxuICAgICAgICAgIHNlbGVjdFByb3BzPXtzZWxlY3RQcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvQ29udGFpbmVyPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTXVsdGlWYWx1ZTtcbiJdfQ== */')), {
          'multi-value__label': true
        }, className)
      };

      var removeInnerProps = _extends({
        className: cx( /*#__PURE__*/css(getStyles('multiValueRemove', this.props), 'label:MultiValue;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk11bHRpVmFsdWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBeUlRIiwiZmlsZSI6Ik11bHRpVmFsdWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgdHlwZSBOb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5cbmltcG9ydCB7IENyb3NzSWNvbiB9IGZyb20gJy4vaW5kaWNhdG9ycyc7XG5pbXBvcnQgdHlwZSB7IENvbW1vblByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgdHlwZSBNdWx0aVZhbHVlUHJvcHMgPSBDb21tb25Qcm9wcyAmIHtcbiAgY2hpbGRyZW46IE5vZGUsXG4gIGNvbXBvbmVudHM6IGFueSxcbiAgY3JvcFdpdGhFbGxpcHNpczogYm9vbGVhbixcbiAgZGF0YTogYW55LFxuICBpbm5lclByb3BzOiBhbnksXG4gIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgaXNEaXNhYmxlZDogYm9vbGVhbixcbiAgcmVtb3ZlUHJvcHM6IHtcbiAgICBvblRvdWNoRW5kOiBhbnkgPT4gdm9pZCxcbiAgICBvbkNsaWNrOiBhbnkgPT4gdm9pZCxcbiAgICBvbk1vdXNlRG93bjogYW55ID0+IHZvaWQsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgbXVsdGlWYWx1ZUNTUyA9ICh7XG4gIHRoZW1lOiB7IHNwYWNpbmcsIGJvcmRlclJhZGl1cywgY29sb3JzIH0sXG59OiBNdWx0aVZhbHVlUHJvcHMpID0+ICh7XG4gIGJhY2tncm91bmRDb2xvcjogY29sb3JzLm5ldXRyYWwxMCxcbiAgYm9yZGVyUmFkaXVzOiBib3JkZXJSYWRpdXMgLyAyLFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIG1hcmdpbjogc3BhY2luZy5iYXNlVW5pdCAvIDIsXG4gIG1pbldpZHRoOiAwLCAvLyByZXNvbHZlcyBmbGV4L3RleHQtb3ZlcmZsb3cgYnVnXG59KTtcblxuZXhwb3J0IGNvbnN0IG11bHRpVmFsdWVMYWJlbENTUyA9ICh7IHRoZW1lOiB7IGJvcmRlclJhZGl1cywgY29sb3JzIH0sIGNyb3BXaXRoRWxsaXBzaXMgfTogTXVsdGlWYWx1ZVByb3BzKSA9PiAoe1xuICBib3JkZXJSYWRpdXM6IGJvcmRlclJhZGl1cyAvIDIsXG4gIGNvbG9yOiBjb2xvcnMubmV1dHJhbDgwLFxuICBmb250U2l6ZTogJzg1JScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgcGFkZGluZzogMyxcbiAgcGFkZGluZ0xlZnQ6IDYsXG4gIHRleHRPdmVyZmxvdzogY3JvcFdpdGhFbGxpcHNpcyA/ICdlbGxpcHNpcycgOiBudWxsLFxuICB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcbn0pO1xuXG5leHBvcnQgY29uc3QgbXVsdGlWYWx1ZVJlbW92ZUNTUyA9ICh7XG4gIHRoZW1lOiB7IHNwYWNpbmcsIGJvcmRlclJhZGl1cywgY29sb3JzIH0sXG4gIGlzRm9jdXNlZCxcbn06IE11bHRpVmFsdWVQcm9wcykgPT4gKHtcbiAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gIGJvcmRlclJhZGl1czogYm9yZGVyUmFkaXVzIC8gMixcbiAgYmFja2dyb3VuZENvbG9yOiBpc0ZvY3VzZWQgJiYgY29sb3JzLmRhbmdlckxpZ2h0LFxuICBkaXNwbGF5OiAnZmxleCcsXG4gIHBhZGRpbmdMZWZ0OiBzcGFjaW5nLmJhc2VVbml0LFxuICBwYWRkaW5nUmlnaHQ6IHNwYWNpbmcuYmFzZVVuaXQsXG4gICc6aG92ZXInOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcnMuZGFuZ2VyTGlnaHQsXG4gICAgY29sb3I6IGNvbG9ycy5kYW5nZXIsXG4gIH0sXG59KTtcblxuZXhwb3J0IHR5cGUgTXVsdGlWYWx1ZUdlbmVyaWNQcm9wcyA9IHtcbiAgY2hpbGRyZW46IE5vZGUsXG4gIGRhdGE6IGFueSxcbiAgaW5uZXJQcm9wczogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSxcbiAgc2VsZWN0UHJvcHM6IGFueSxcbn07XG5leHBvcnQgY29uc3QgTXVsdGlWYWx1ZUdlbmVyaWMgPSAoe1xuICBjaGlsZHJlbixcbiAgaW5uZXJQcm9wcyxcbn06IE11bHRpVmFsdWVHZW5lcmljUHJvcHMpID0+IDxkaXYgey4uLmlubmVyUHJvcHN9PntjaGlsZHJlbn08L2Rpdj47XG5cbmV4cG9ydCBjb25zdCBNdWx0aVZhbHVlQ29udGFpbmVyID0gTXVsdGlWYWx1ZUdlbmVyaWM7XG5leHBvcnQgY29uc3QgTXVsdGlWYWx1ZUxhYmVsID0gTXVsdGlWYWx1ZUdlbmVyaWM7XG5leHBvcnQgdHlwZSBNdWx0aVZhbHVlUmVtb3ZlUHJvcHMgPSBDb21tb25Qcm9wcyAmIHtcbiAgY2hpbGRyZW46IE5vZGUsXG4gIGRhdGE6IGFueSxcbiAgaW5uZXJQcm9wczoge1xuICAgIGNsYXNzTmFtZTogc3RyaW5nLFxuICAgIG9uVG91Y2hFbmQ6IGFueSA9PiB2b2lkLFxuICAgIG9uQ2xpY2s6IGFueSA9PiB2b2lkLFxuICAgIG9uTW91c2VEb3duOiBhbnkgPT4gdm9pZCxcbiAgfSxcbiAgc2VsZWN0UHJvcHM6IGFueSxcbn07XG5leHBvcnQgY2xhc3MgTXVsdGlWYWx1ZVJlbW92ZSBleHRlbmRzIENvbXBvbmVudDxNdWx0aVZhbHVlUmVtb3ZlUHJvcHM+IHtcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjaGlsZHJlbjogPENyb3NzSWNvbiBzaXplPXsxNH0gLz4sXG4gIH07XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBpbm5lclByb3BzIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiA8ZGl2IHsuLi5pbm5lclByb3BzfT57Y2hpbGRyZW59PC9kaXY+O1xuICB9XG59XG5cbmNsYXNzIE11bHRpVmFsdWUgZXh0ZW5kcyBDb21wb25lbnQ8TXVsdGlWYWx1ZVByb3BzPiB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgY3JvcFdpdGhFbGxpcHNpczogdHJ1ZSxcbiAgfTtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgY29tcG9uZW50cyxcbiAgICAgIGN4LFxuICAgICAgZGF0YSxcbiAgICAgIGdldFN0eWxlcyxcbiAgICAgIGlubmVyUHJvcHMsXG4gICAgICBpc0Rpc2FibGVkLFxuICAgICAgcmVtb3ZlUHJvcHMsXG4gICAgICBzZWxlY3RQcm9wcyxcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHsgQ29udGFpbmVyLCBMYWJlbCwgUmVtb3ZlIH0gPSBjb21wb25lbnRzO1xuXG4gICAgY29uc3QgY29udGFpbmVySW5uZXJQcm9wcyA9IHtcbiAgICAgIGNsYXNzTmFtZTogY3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ211bHRpVmFsdWUnLCB0aGlzLnByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnbXVsdGktdmFsdWUnOiB0cnVlLFxuICAgICAgICAgICdtdWx0aS12YWx1ZS0taXMtZGlzYWJsZWQnOiBpc0Rpc2FibGVkLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWVcbiAgICAgICksXG4gICAgICAuLi5pbm5lclByb3BzLFxuICAgIH07XG5cbiAgICBjb25zdCBsYWJlbElubmVyUHJvcHMgPSB7XG4gICAgICBjbGFzc05hbWU6IGN4KFxuICAgICAgICBjc3MoZ2V0U3R5bGVzKCdtdWx0aVZhbHVlTGFiZWwnLCB0aGlzLnByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnbXVsdGktdmFsdWVfX2xhYmVsJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApLFxuICAgIH07XG5cbiAgICBjb25zdCByZW1vdmVJbm5lclByb3BzID0ge1xuICAgICAgY2xhc3NOYW1lOiBjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygnbXVsdGlWYWx1ZVJlbW92ZScsIHRoaXMucHJvcHMpKSxcbiAgICAgICAge1xuICAgICAgICAgICdtdWx0aS12YWx1ZV9fcmVtb3ZlJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApLFxuICAgICAgLi4ucmVtb3ZlUHJvcHMsXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Q29udGFpbmVyXG4gICAgICAgIGRhdGE9e2RhdGF9XG4gICAgICAgIGlubmVyUHJvcHM9e2NvbnRhaW5lcklubmVyUHJvcHN9XG4gICAgICAgIHNlbGVjdFByb3BzPXtzZWxlY3RQcm9wc31cbiAgICAgID5cbiAgICAgICAgPExhYmVsXG4gICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICBpbm5lclByb3BzPXtsYWJlbElubmVyUHJvcHN9XG4gICAgICAgICAgc2VsZWN0UHJvcHM9e3NlbGVjdFByb3BzfVxuICAgICAgICA+XG4gICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L0xhYmVsPlxuICAgICAgICA8UmVtb3ZlXG4gICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICBpbm5lclByb3BzPXtyZW1vdmVJbm5lclByb3BzfVxuICAgICAgICAgIHNlbGVjdFByb3BzPXtzZWxlY3RQcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvQ29udGFpbmVyPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTXVsdGlWYWx1ZTtcbiJdfQ== */')), {
          'multi-value__remove': true
        }, className)
      }, removeProps);

      return React.createElement(
        Container,
        {
          data: data,
          innerProps: containerInnerProps,
          selectProps: selectProps
        },
        React.createElement(
          Label,
          {
            data: data,
            innerProps: labelInnerProps,
            selectProps: selectProps
          },
          children
        ),
        React.createElement(Remove, {
          data: data,
          innerProps: removeInnerProps,
          selectProps: selectProps
        })
      );
    }
  }]);
  return MultiValue;
}(Component);

MultiValue.defaultProps = {
  cropWithEllipsis: true
};

var optionCSS = function optionCSS(_ref) {
  var isDisabled = _ref.isDisabled,
      isFocused = _ref.isFocused,
      isSelected = _ref.isSelected,
      _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return {
    backgroundColor: isSelected ? colors.primary : isFocused ? colors.primary25 : 'transparent',
    color: isDisabled ? colors.neutral20 : isSelected ? colors.neutral0 : 'inherit',
    cursor: 'default',
    display: 'block',
    fontSize: 'inherit',
    padding: spacing.baseUnit * 2 + 'px ' + spacing.baseUnit * 3 + 'px',
    width: '100%',
    userSelect: 'none',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',

    // provide some affordance on touch devices
    ':active': {
      backgroundColor: isSelected ? colors.primary : colors.primary50
    }
  };
};

var Option = function Option(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      isDisabled = props.isDisabled,
      isFocused = props.isFocused,
      isSelected = props.isSelected,
      innerRef = props.innerRef,
      innerProps = props.innerProps;

  return React.createElement(
    'div',
    _extends({
      ref: innerRef,
      className: cx( /*#__PURE__*/css(getStyles('option', props), 'label:Option;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9wdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF1RVEiLCJmaWxlIjoiT3B0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBSZWFjdCwgeyB0eXBlIE5vZGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjc3MgfSBmcm9tICdlbW90aW9uJztcblxuaW1wb3J0IHR5cGUgeyBDb21tb25Qcm9wcywgUHJvcHNXaXRoU3R5bGVzLCBJbm5lclJlZiB9IGZyb20gJy4uL3R5cGVzJztcblxudHlwZSBTdGF0ZSA9IHtcbiAgLyoqIFdldGhlciB0aGUgb3B0aW9uIGlzIGRpc2FibGVkLiAqL1xuICBpc0Rpc2FibGVkOiBib29sZWFuLFxuICAvKiogV2V0aGVyIHRoZSBvcHRpb24gaXMgZm9jdXNlZC4gKi9cbiAgaXNGb2N1c2VkOiBib29sZWFuLFxuICAvKiogV2hldGhlciB0aGUgb3B0aW9uIGlzIHNlbGVjdGVkLiAqL1xuICBpc1NlbGVjdGVkOiBib29sZWFuLFxufTtcbnR5cGUgSW5uZXJQcm9wcyA9IHtcbiAgaWQ6IHN0cmluZyxcbiAga2V5OiBzdHJpbmcsXG4gIG9uQ2xpY2s6IE1vdXNlRXZlbnRIYW5kbGVyLFxuICBvbk1vdXNlT3ZlcjogTW91c2VFdmVudEhhbmRsZXIsXG4gIHRhYkluZGV4OiBudW1iZXIsXG59O1xuZXhwb3J0IHR5cGUgT3B0aW9uUHJvcHMgPSBQcm9wc1dpdGhTdHlsZXMgJlxuICBDb21tb25Qcm9wcyAmXG4gIFN0YXRlICYge1xuICAgIC8qKiBUaGUgY2hpbGRyZW4gdG8gYmUgcmVuZGVyZWQuICovXG4gICAgY2hpbGRyZW46IE5vZGUsXG4gICAgLyoqIElubmVyIHJlZiB0byBET00gTm9kZSAqL1xuICAgIGlubmVyUmVmOiBJbm5lclJlZixcbiAgICAvKiogcHJvcHMgcGFzc2VkIHRvIHRoZSB3cmFwcGluZyBlbGVtZW50IGZvciB0aGUgZ3JvdXAuICovXG4gICAgaW5uZXJQcm9wczogSW5uZXJQcm9wcyxcbiAgICAvKiBUZXh0IHRvIGJlIGRpc3BsYXllZCByZXByZXNlbnRpbmcgdGhlIG9wdGlvbi4gKi9cbiAgICBsYWJlbDogc3RyaW5nLFxuICAgIC8qIFR5cGUgaXMgdXNlZCBieSB0aGUgbWVudSB0byBkZXRlcm1pbmUgd2hldGhlciB0aGlzIGlzIGFuIG9wdGlvbiBvciBhIGdyb3VwLlxuICAgIEluIHRoZSBjYXNlIG9mIG9wdGlvbiB0aGlzIGlzIGFsd2F5cyBgb3B0aW9uYC4gKi9cbiAgICB0eXBlOiAnb3B0aW9uJyxcbiAgICAvKiBUaGUgZGF0YSBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9uLiAqL1xuICAgIGRhdGE6IGFueSxcbiAgfTtcblxuZXhwb3J0IGNvbnN0IG9wdGlvbkNTUyA9ICh7XG4gIGlzRGlzYWJsZWQsXG4gIGlzRm9jdXNlZCxcbiAgaXNTZWxlY3RlZCxcbiAgdGhlbWU6IHsgc3BhY2luZywgY29sb3JzIH0sXG59OiBPcHRpb25Qcm9wcykgPT4gKHtcbiAgYmFja2dyb3VuZENvbG9yOiBpc1NlbGVjdGVkXG4gICAgPyBjb2xvcnMucHJpbWFyeVxuICAgIDogaXNGb2N1c2VkID8gY29sb3JzLnByaW1hcnkyNSA6ICd0cmFuc3BhcmVudCcsXG4gIGNvbG9yOiBpc0Rpc2FibGVkXG4gICAgPyBjb2xvcnMubmV1dHJhbDIwXG4gICAgOiBpc1NlbGVjdGVkID8gY29sb3JzLm5ldXRyYWwwIDogJ2luaGVyaXQnLFxuICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgZm9udFNpemU6ICdpbmhlcml0JyxcbiAgcGFkZGluZzogYCR7c3BhY2luZy5iYXNlVW5pdCAqIDJ9cHggJHtzcGFjaW5nLmJhc2VVbml0ICogM31weGAsXG4gIHdpZHRoOiAnMTAwJScsXG4gIHVzZXJTZWxlY3Q6ICdub25lJyxcbiAgV2Via2l0VGFwSGlnaGxpZ2h0Q29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcblxuICAvLyBwcm92aWRlIHNvbWUgYWZmb3JkYW5jZSBvbiB0b3VjaCBkZXZpY2VzXG4gICc6YWN0aXZlJzoge1xuICAgIGJhY2tncm91bmRDb2xvcjogaXNTZWxlY3RlZCA/IGNvbG9ycy5wcmltYXJ5IDogY29sb3JzLnByaW1hcnk1MCxcbiAgfSxcbn0pO1xuXG5jb25zdCBPcHRpb24gPSAocHJvcHM6IE9wdGlvblByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcywgaXNEaXNhYmxlZCwgaXNGb2N1c2VkLCBpc1NlbGVjdGVkLCBpbm5lclJlZiwgaW5uZXJQcm9wcyB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgcmVmPXtpbm5lclJlZn1cbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGNzcyhnZXRTdHlsZXMoJ29wdGlvbicsIHByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnb3B0aW9uJzogdHJ1ZSxcbiAgICAgICAgICAnb3B0aW9uLS1pcy1kaXNhYmxlZCc6IGlzRGlzYWJsZWQsXG4gICAgICAgICAgJ29wdGlvbi0taXMtZm9jdXNlZCc6IGlzRm9jdXNlZCxcbiAgICAgICAgICAnb3B0aW9uLS1pcy1zZWxlY3RlZCc6IGlzU2VsZWN0ZWQsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZVxuICAgICAgKX1cbiAgICAgIHsuLi5pbm5lclByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE9wdGlvbjtcbiJdfQ== */')), {
        'option': true,
        'option--is-disabled': isDisabled,
        'option--is-focused': isFocused,
        'option--is-selected': isSelected
      }, className)
    }, innerProps),
    children
  );
};

var placeholderCSS = function placeholderCSS(_ref) {
  var _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return {
    color: colors.neutral50,
    marginLeft: spacing.baseUnit / 2,
    marginRight: spacing.baseUnit / 2,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)'
  };
};

var Placeholder = function Placeholder(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      innerProps = props.innerProps;

  return React.createElement(
    'div',
    _extends({
      className: cx( /*#__PURE__*/css(getStyles('placeholder', props), 'label:Placeholder;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYWNlaG9sZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTJCUSIsImZpbGUiOiJQbGFjZWhvbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgUmVhY3QsIHsgdHlwZSBOb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnZW1vdGlvbic7XG5cbmltcG9ydCB0eXBlIHsgQ29tbW9uUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCB0eXBlIFBsYWNlaG9sZGVyUHJvcHMgPSBDb21tb25Qcm9wcyAmIHtcbiAgLyoqIFRoZSBjaGlsZHJlbiB0byBiZSByZW5kZXJlZC4gKi9cbiAgY2hpbGRyZW46IE5vZGUsXG4gIC8qKiBwcm9wcyBwYXNzZWQgdG8gdGhlIHdyYXBwaW5nIGVsZW1lbnQgZm9yIHRoZSBncm91cC4gKi9cbiAgaW5uZXJQcm9wczogeyBbc3RyaW5nXTogYW55IH0sXG59O1xuXG5leHBvcnQgY29uc3QgcGxhY2Vob2xkZXJDU1MgPSAoeyB0aGVtZTogeyBzcGFjaW5nLCBjb2xvcnMgfSB9OiBQbGFjZWhvbGRlclByb3BzKSA9PiAoe1xuICBjb2xvcjogY29sb3JzLm5ldXRyYWw1MCxcbiAgbWFyZ2luTGVmdDogc3BhY2luZy5iYXNlVW5pdCAvIDIsXG4gIG1hcmdpblJpZ2h0OiBzcGFjaW5nLmJhc2VVbml0IC8gMixcbiAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gIHRvcDogJzUwJScsXG4gIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUwJSknLFxufSk7XG5cbmNvbnN0IFBsYWNlaG9sZGVyID0gKHByb3BzOiBQbGFjZWhvbGRlclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgY3gsIGdldFN0eWxlcywgaW5uZXJQcm9wcyB9ID0gcHJvcHM7XG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgY3NzKGdldFN0eWxlcygncGxhY2Vob2xkZXInLCBwcm9wcykpLFxuICAgICAgICB7XG4gICAgICAgICAgJ3BsYWNlaG9sZGVyJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxhY2Vob2xkZXI7XG4iXX0= */')), {
        'placeholder': true
      }, className)
    }, innerProps),
    children
  );
};

var css$2 = function css$$1(_ref) {
  var isDisabled = _ref.isDisabled,
      _ref$theme = _ref.theme,
      spacing = _ref$theme.spacing,
      colors = _ref$theme.colors;
  return {
    color: isDisabled ? colors.neutral40 : colors.neutral80,
    marginLeft: spacing.baseUnit / 2,
    marginRight: spacing.baseUnit / 2,
    maxWidth: 'calc(100% - ' + spacing.baseUnit * 2 + 'px)',
    overflow: 'hidden',
    position: 'absolute',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    top: '50%',
    transform: 'translateY(-50%)'
  };
};

var SingleValue = function SingleValue(props) {
  var children = props.children,
      className = props.className,
      cx = props.cx,
      getStyles = props.getStyles,
      isDisabled = props.isDisabled,
      innerProps = props.innerProps;

  return React.createElement(
    'div',
    _extends({
      className: cx( /*#__PURE__*/css(getStyles('singleValue', props), 'label:SingleValue;' + (process.env.NODE_ENV === 'production' ? '' : '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNpbmdsZVZhbHVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXFDUSIsImZpbGUiOiJTaW5nbGVWYWx1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY3NzIGFzIGVtb3Rpb25Dc3MgfSBmcm9tICdlbW90aW9uJztcbmltcG9ydCB0eXBlIHsgQ29tbW9uUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5cbnR5cGUgU3RhdGUgPSB7XG4gIC8qKiBXaGV0aGVyIHRoaXMgaXMgZGlzYWJsZWQuICovXG4gIGlzRGlzYWJsZWQ6IGJvb2xlYW4sXG59O1xudHlwZSBWYWx1ZVByb3BzID0ge1xuICAvKiogVGhlIGNoaWxkcmVuIHRvIGJlIHJlbmRlcmVkLiAqL1xuICBjaGlsZHJlbjogc3RyaW5nLFxuICAvKiBUaGUgZGF0YSBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9uIHJlbmRlcmVkIGluIHRoZSBTaW5nbGUgVmFsdWUgY29tcG9uZW50LiAqL1xuICBkYXRhOiBhbnksXG4gIC8qKiBQcm9wcyBwYXNzZWQgdG8gdGhlIHdyYXBwaW5nIGVsZW1lbnQgZm9yIHRoZSBncm91cC4gKi9cbiAgaW5uZXJQcm9wczogYW55LFxufTtcbmV4cG9ydCB0eXBlIFNpbmdsZVZhbHVlUHJvcHMgPSBDb21tb25Qcm9wcyAmIFZhbHVlUHJvcHMgJiBTdGF0ZTtcblxuZXhwb3J0IGNvbnN0IGNzcyA9ICh7IGlzRGlzYWJsZWQsIHRoZW1lOiB7IHNwYWNpbmcsIGNvbG9ycyB9IH06IFNpbmdsZVZhbHVlUHJvcHMpID0+ICh7XG4gIGNvbG9yOiBpc0Rpc2FibGVkID8gY29sb3JzLm5ldXRyYWw0MCA6IGNvbG9ycy5uZXV0cmFsODAsXG4gIG1hcmdpbkxlZnQ6IHNwYWNpbmcuYmFzZVVuaXQgLyAyLFxuICBtYXJnaW5SaWdodDogc3BhY2luZy5iYXNlVW5pdCAvIDIsXG4gIG1heFdpZHRoOiBgY2FsYygxMDAlIC0gJHtzcGFjaW5nLmJhc2VVbml0ICogMn1weClgLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICB0b3A6ICc1MCUnLFxuICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01MCUpJyxcbn0pO1xuXG5jb25zdCBTaW5nbGVWYWx1ZSA9IChwcm9wczogU2luZ2xlVmFsdWVQcm9wcykgPT4ge1xuICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIGN4LCBnZXRTdHlsZXMsIGlzRGlzYWJsZWQsIGlubmVyUHJvcHMgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgIGVtb3Rpb25Dc3MoZ2V0U3R5bGVzKCdzaW5nbGVWYWx1ZScsIHByb3BzKSksXG4gICAgICAgIHtcbiAgICAgICAgICAnc2luZ2xlLXZhbHVlJzogdHJ1ZSxcbiAgICAgICAgICAnc2luZ2xlLXZhbHVlLS1pcy1kaXNhYmxlZCc6IGlzRGlzYWJsZWRcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lXG4gICAgICApfVxuICAgICAgey4uLmlubmVyUHJvcHN9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2luZ2xlVmFsdWU7XG4iXX0= */')), {
        'single-value': true,
        'single-value--is-disabled': isDisabled
      }, className)
    }, innerProps),
    children
  );
};

var components = {
  ClearIndicator: ClearIndicator,
  Control: Control,
  DropdownIndicator: DropdownIndicator,
  DownChevron: DownChevron,
  CrossIcon: CrossIcon,
  Group: Group,
  GroupHeading: GroupHeading,
  IndicatorsContainer: IndicatorsContainer,
  IndicatorSeparator: IndicatorSeparator,
  Input: Input,
  LoadingIndicator: LoadingIndicator,
  Menu: Menu,
  MenuList: MenuList,
  MenuPortal: MenuPortal,
  LoadingMessage: LoadingMessage,
  NoOptionsMessage: NoOptionsMessage,
  MultiValue: MultiValue,
  MultiValueContainer: MultiValueContainer,
  MultiValueLabel: MultiValueLabel,
  MultiValueRemove: MultiValueRemove,
  Option: Option,
  Placeholder: Placeholder,
  SelectContainer: SelectContainer,
  SingleValue: SingleValue,
  ValueContainer: ValueContainer
};

var defaultComponents = function defaultComponents(props) {
  return _extends({}, components, props.components);
};

var defaultStyles = {
  clearIndicator: clearIndicatorCSS,
  container: containerCSS,
  control: css$1,
  dropdownIndicator: dropdownIndicatorCSS,
  group: groupCSS,
  groupHeading: groupHeadingCSS,
  indicatorsContainer: indicatorsContainerCSS,
  indicatorSeparator: indicatorSeparatorCSS,
  input: inputCSS,
  loadingIndicator: loadingIndicatorCSS,
  loadingMessage: loadingMessageCSS,
  menu: menuCSS,
  menuList: menuListCSS,
  menuPortal: menuPortalCSS,
  multiValue: multiValueCSS,
  multiValueLabel: multiValueLabelCSS,
  multiValueRemove: multiValueRemoveCSS,
  noOptionsMessage: noOptionsMessageCSS,
  option: optionCSS,
  placeholder: placeholderCSS,
  singleValue: css$2,
  valueContainer: valueContainerCSS
};

// Merge Utility
// Allows consumers to extend a base Select with additional styles

function mergeStyles(source) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // initialize with source styles
  var styles = _extends({}, source);

  // massage in target styles
  Object.keys(target).forEach(function (key) {
    if (source[key]) {
      styles[key] = function (rsCss, props) {
        return target[key](source[key](rsCss, props), props);
      };
    } else {
      styles[key] = target[key];
    }
  });

  return styles;
}

var colors = {
  primary: '#2684FF',
  primary75: '#4C9AFF',
  primary50: '#B2D4FF',
  primary25: '#DEEBFF',

  danger: '#DE350B',
  dangerLight: '#FFBDAD',

  neutral0: 'hsl(0, 0%, 100%)',
  neutral5: 'hsl(0, 0%, 95%)',
  neutral10: 'hsl(0, 0%, 90%)',
  neutral20: 'hsl(0, 0%, 80%)',
  neutral30: 'hsl(0, 0%, 70%)',
  neutral40: 'hsl(0, 0%, 60%)',
  neutral50: 'hsl(0, 0%, 50%)',
  neutral60: 'hsl(0, 0%, 40%)',
  neutral70: 'hsl(0, 0%, 30%)',
  neutral80: 'hsl(0, 0%, 20%)',
  neutral90: 'hsl(0, 0%, 10%)'
};

var borderRadius = 4;
var baseUnit = 4; /* Used to calculate consistent margin/padding on elements */
var controlHeight = 38; /* The minimum height of the control */
var menuGutter = baseUnit * 2; /* The amount of space between the control and menu */

var spacing = {
  baseUnit: baseUnit,
  controlHeight: controlHeight,
  menuGutter: menuGutter
};

var defaultTheme = {
  borderRadius: borderRadius,
  colors: colors,
  spacing: spacing
};

var defaultProps = {
  backspaceRemovesValue: true,
  blurInputOnSelect: isTouchCapable(),
  captureMenuScroll: !isTouchCapable(),
  closeMenuOnSelect: true,
  closeMenuOnScroll: false,
  components: {},
  controlShouldRenderValue: true,
  escapeClearsValue: false,
  filterOption: createFilter(),
  formatGroupLabel: formatGroupLabel,
  getOptionLabel: getOptionLabel,
  getOptionValue: getOptionValue,
  isDisabled: false,
  isLoading: false,
  isMulti: false,
  isRtl: false,
  isSearchable: true,
  isOptionDisabled: isOptionDisabled,
  loadingMessage: function loadingMessage() {
    return 'Loading...';
  },
  maxMenuHeight: 300,
  minMenuHeight: 140,
  menuIsOpen: false,
  menuPlacement: 'bottom',
  menuPosition: 'absolute',
  menuShouldBlockScroll: false,
  menuShouldScrollIntoView: !isMobileDevice(),
  noOptionsMessage: function noOptionsMessage() {
    return 'No options';
  },
  openMenuOnFocus: false,
  openMenuOnClick: true,
  options: [],
  pageSize: 5,
  placeholder: 'Select...',
  screenReaderStatus: function screenReaderStatus(_ref) {
    var count = _ref.count;
    return count + ' result' + (count !== 1 ? 's' : '') + ' available';
  },
  styles: {},
  tabIndex: '0',
  tabSelectsValue: true
};

var instanceId = 1;

var Select = function (_Component) {
  inherits(Select, _Component);

  // Lifecycle
  // ------------------------------

  // Refs
  // ------------------------------

  // Misc. Instance Properties
  // ------------------------------

  function Select(props) {
    classCallCheck(this, Select);

    var _this = possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

    _initialiseProps.call(_this);

    var value = props.value;

    _this.cacheComponents = memoizeOne(_this.cacheComponents, exportedEqual).bind(_this);
    _this.cacheComponents(props.components);
    _this.instancePrefix = 'react-select-' + (_this.props.instanceId || ++instanceId);

    var selectValue = cleanValue(value);
    var menuOptions = _this.buildMenuOptions(props, selectValue);

    _this.state.menuOptions = menuOptions;
    _this.state.selectValue = selectValue;
    return _this;
  } // TODO


  createClass(Select, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.startListeningComposition();
      this.startListeningToTouch();

      if (this.props.closeMenuOnScroll && document && document.addEventListener) {
        // Listen to all scroll events, and filter them out inside of 'onScroll'
        document.addEventListener('scroll', this.onScroll, true);
      }

      if (this.props.autoFocus) {
        this.focusInput();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _props = this.props,
          options = _props.options,
          value = _props.value,
          inputValue = _props.inputValue;
      // re-cache custom components

      this.cacheComponents(nextProps.components);
      // rebuild the menu options
      if (nextProps.value !== value || nextProps.options !== options || nextProps.inputValue !== inputValue) {
        var _selectValue = cleanValue(nextProps.value);
        var _menuOptions = this.buildMenuOptions(nextProps, _selectValue);
        var _focusedValue = this.getNextFocusedValue(_selectValue);
        var _focusedOption = this.getNextFocusedOption(_menuOptions.focusable);
        this.setState({ menuOptions: _menuOptions, selectValue: _selectValue, focusedOption: _focusedOption, focusedValue: _focusedValue });
      }
      // some updates should toggle the state of the input visibility
      if (this.inputIsHiddenAfterUpdate != null) {
        this.setState({
          inputIsHidden: this.inputIsHiddenAfterUpdate
        });
        delete this.inputIsHiddenAfterUpdate;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props2 = this.props,
          isDisabled = _props2.isDisabled,
          menuIsOpen = _props2.menuIsOpen;
      var isFocused = this.state.isFocused;


      if (
      // ensure focus is restored correctly when the control becomes enabled
      isFocused && !isDisabled && prevProps.isDisabled ||
      // ensure focus is on the Input when the menu opens
      isFocused && menuIsOpen && !prevProps.menuIsOpen) {
        this.focusInput();
      }

      // scroll the focused option into view if necessary
      if (this.menuListRef && this.focusedOptionRef && this.scrollToFocusedOptionOnUpdate) {
        scrollIntoView(this.menuListRef, this.focusedOptionRef);
      }
      this.scrollToFocusedOptionOnUpdate = false;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.stopListeningComposition();
      this.stopListeningToTouch();
      document.removeEventListener('scroll', this.onScroll, true);
    }
  }, {
    key: 'onMenuOpen',

    // ==============================
    // Consumer Handlers
    // ==============================

    value: function onMenuOpen() {
      this.props.onMenuOpen();
    }
  }, {
    key: 'onMenuClose',
    value: function onMenuClose() {
      var _props3 = this.props,
          isSearchable = _props3.isSearchable,
          isMulti = _props3.isMulti;

      this.announceAriaLiveContext({
        event: 'input',
        context: { isSearchable: isSearchable, isMulti: isMulti }
      });
      this.onInputChange('', { action: 'menu-close' });
      this.props.onMenuClose();
    }
  }, {
    key: 'onInputChange',
    value: function onInputChange(newValue, actionMeta) {
      this.props.onInputChange(newValue, actionMeta);
    }

    // ==============================
    // Methods
    // ==============================

  }, {
    key: 'focusInput',
    value: function focusInput() {
      if (!this.inputRef) return;
      this.inputRef.focus();
    }
  }, {
    key: 'blurInput',
    value: function blurInput() {
      if (!this.inputRef) return;
      this.inputRef.blur();
    }

    // aliased for consumers

  }, {
    key: 'openMenu',
    value: function openMenu(focusOption) {
      var _state = this.state,
          menuOptions = _state.menuOptions,
          selectValue = _state.selectValue;
      var isMulti = this.props.isMulti;

      var openAtIndex = focusOption === 'first' ? 0 : menuOptions.focusable.length - 1;

      if (!isMulti) {
        var selectedIndex = menuOptions.focusable.indexOf(selectValue[0]);
        if (selectedIndex > -1) {
          openAtIndex = selectedIndex;
        }
      }

      this.scrollToFocusedOptionOnUpdate = true;
      this.inputIsHiddenAfterUpdate = false;

      this.onMenuOpen();
      this.setState({
        focusedValue: null,
        focusedOption: menuOptions.focusable[openAtIndex]
      });

      this.announceAriaLiveContext({ event: 'menu' });
    }
  }, {
    key: 'focusValue',
    value: function focusValue(direction) {
      var _props4 = this.props,
          isMulti = _props4.isMulti,
          isSearchable = _props4.isSearchable;
      var _state2 = this.state,
          selectValue = _state2.selectValue,
          focusedValue = _state2.focusedValue;

      // Only multiselects support value focusing

      if (!isMulti) return;

      this.setState({
        focusedOption: null
      });

      var focusedIndex = selectValue.indexOf(focusedValue);
      if (!focusedValue) {
        focusedIndex = -1;
        this.announceAriaLiveContext({ event: 'value' });
      }

      var lastIndex = selectValue.length - 1;
      var nextFocus = -1;
      if (!selectValue.length) return;

      switch (direction) {
        case 'previous':
          if (focusedIndex === 0) {
            // don't cycle from the start to the end
            nextFocus = 0;
          } else if (focusedIndex === -1) {
            // if nothing is focused, focus the last value first
            nextFocus = lastIndex;
          } else {
            nextFocus = focusedIndex - 1;
          }
          break;
        case 'next':
          if (focusedIndex > -1 && focusedIndex < lastIndex) {
            nextFocus = focusedIndex + 1;
          }
          break;
      }

      if (nextFocus === -1) {
        this.announceAriaLiveContext({
          event: 'input',
          context: { isSearchable: isSearchable, isMulti: isMulti }
        });
      }

      this.setState({
        inputIsHidden: nextFocus === -1 ? false : true,
        focusedValue: selectValue[nextFocus]
      });
    }
  }, {
    key: 'focusOption',
    value: function focusOption() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'first';
      var pageSize = this.props.pageSize;
      var _state3 = this.state,
          focusedOption = _state3.focusedOption,
          menuOptions = _state3.menuOptions;

      var options = menuOptions.focusable;

      if (!options.length) return;
      var nextFocus = 0; // handles 'first'
      var focusedIndex = options.indexOf(focusedOption);
      if (!focusedOption) {
        focusedIndex = -1;
        this.announceAriaLiveContext({ event: 'menu' });
      }

      if (direction === 'up') {
        nextFocus = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
      } else if (direction === 'down') {
        nextFocus = (focusedIndex + 1) % options.length;
      } else if (direction === 'pageup') {
        nextFocus = focusedIndex - pageSize;
        if (nextFocus < 0) nextFocus = 0;
      } else if (direction === 'pagedown') {
        nextFocus = focusedIndex + pageSize;
        if (nextFocus > options.length - 1) nextFocus = options.length - 1;
      } else if (direction === 'last') {
        nextFocus = options.length - 1;
      }
      this.scrollToFocusedOptionOnUpdate = true;
      this.setState({
        focusedOption: options[nextFocus],
        focusedValue: null
      });
    }
  }, {
    key: 'getTheme',


    // ==============================
    // Getters
    // ==============================

    value: function getTheme() {
      // Use the default theme if there are no customizations.
      if (!this.props.theme) {
        return defaultTheme;
      }
      // If the theme prop is a function, assume the function
      // knows how to merge the passed-in default theme with
      // its own modifications.
      if (typeof this.props.theme === 'function') {
        return this.props.theme(defaultTheme);
      }
      // Otherwise, if a plain theme object was passed in,
      // overlay it with the default theme.
      return _extends({}, defaultTheme, this.props.theme);
    }
  }, {
    key: 'getCommonProps',
    value: function getCommonProps() {
      var clearValue = this.clearValue,
          getStyles = this.getStyles,
          setValue = this.setValue,
          selectOption = this.selectOption,
          props = this.props;
      var classNamePrefix = props.classNamePrefix,
          isMulti = props.isMulti,
          isRtl = props.isRtl,
          options = props.options;
      var selectValue = this.state.selectValue;

      var hasValue = this.hasValue();
      var getValue = function getValue() {
        return selectValue;
      };
      var cxPrefix = classNamePrefix;

      var cx = classNames.bind(null, cxPrefix);
      return {
        cx: cx,
        clearValue: clearValue,
        getStyles: getStyles,
        getValue: getValue,
        hasValue: hasValue,
        isMulti: isMulti,
        isRtl: isRtl,
        options: options,
        selectOption: selectOption,
        setValue: setValue,
        selectProps: props,
        theme: this.getTheme()
      };
    }
  }, {
    key: 'getNextFocusedValue',
    value: function getNextFocusedValue(nextSelectValue) {
      if (this.clearFocusValueOnUpdate) {
        this.clearFocusValueOnUpdate = false;
        return null;
      }
      var _state4 = this.state,
          focusedValue = _state4.focusedValue,
          lastSelectValue = _state4.selectValue;

      var lastFocusedIndex = lastSelectValue.indexOf(focusedValue);
      if (lastFocusedIndex > -1) {
        var nextFocusedIndex = nextSelectValue.indexOf(focusedValue);
        if (nextFocusedIndex > -1) {
          // the focused value is still in the selectValue, return it
          return focusedValue;
        } else if (lastFocusedIndex < nextSelectValue.length) {
          // the focusedValue is not present in the next selectValue array by
          // reference, so return the new value at the same index
          return nextSelectValue[lastFocusedIndex];
        }
      }
      return null;
    }
  }, {
    key: 'getNextFocusedOption',
    value: function getNextFocusedOption(options) {
      var lastFocusedOption = this.state.focusedOption;

      return lastFocusedOption && options.indexOf(lastFocusedOption) > -1 ? lastFocusedOption : options[0];
    }

    // ==============================
    // Helpers
    // ==============================

  }, {
    key: 'hasValue',
    value: function hasValue() {
      var selectValue = this.state.selectValue;

      return selectValue.length > 0;
    }
  }, {
    key: 'hasOptions',
    value: function hasOptions() {
      return !!this.state.menuOptions.render.length;
    }
  }, {
    key: 'countOptions',
    value: function countOptions() {
      return this.state.menuOptions.focusable.length;
    }
  }, {
    key: 'isClearable',
    value: function isClearable() {
      var _props5 = this.props,
          isClearable = _props5.isClearable,
          isMulti = _props5.isMulti;

      // single select, by default, IS NOT clearable
      // multi select, by default, IS clearable

      if (isClearable === undefined) return isMulti;

      return isClearable;
    }
  }, {
    key: 'isOptionDisabled',
    value: function isOptionDisabled$$1(option, selectValue) {
      return typeof this.props.isOptionDisabled === 'function' ? this.props.isOptionDisabled(option, selectValue) : false;
    }
  }, {
    key: 'isOptionSelected',
    value: function isOptionSelected(option, selectValue) {
      var _this2 = this;

      if (selectValue.indexOf(option) > -1) return true;
      if (typeof this.props.isOptionSelected === 'function') {
        return this.props.isOptionSelected(option, selectValue);
      }
      var candidate = this.getOptionValue(option);
      return selectValue.some(function (i) {
        return _this2.getOptionValue(i) === candidate;
      });
    }
  }, {
    key: 'filterOption',
    value: function filterOption(option, inputValue) {
      return this.props.filterOption ? this.props.filterOption(option, inputValue) : true;
    }
  }, {
    key: 'formatOptionLabel',
    value: function formatOptionLabel(data, context) {
      if (typeof this.props.formatOptionLabel === 'function') {
        var _inputValue = this.props.inputValue;
        var _selectValue2 = this.state.selectValue;

        return this.props.formatOptionLabel(data, {
          context: context,
          inputValue: _inputValue,
          selectValue: _selectValue2
        });
      } else {
        return this.getOptionLabel(data);
      }
    }
  }, {
    key: 'formatGroupLabel',
    value: function formatGroupLabel$$1(data) {
      return this.props.formatGroupLabel(data);
    }

    // ==============================
    // Mouse Handlers
    // ==============================

  }, {
    key: 'startListeningComposition',


    // ==============================
    // Composition Handlers
    // ==============================

    value: function startListeningComposition() {
      if (document && document.addEventListener) {
        document.addEventListener('compositionstart', this.onCompositionStart, false);
        document.addEventListener('compositionend', this.onCompositionEnd, false);
      }
    }
  }, {
    key: 'stopListeningComposition',
    value: function stopListeningComposition() {
      if (document && document.removeEventListener) {
        document.removeEventListener('compositionstart', this.onCompositionStart);
        document.removeEventListener('compositionend', this.onCompositionEnd);
      }
    }
  }, {
    key: 'startListeningToTouch',


    // ==============================
    // Touch Handlers
    // ==============================

    value: function startListeningToTouch() {
      if (document && document.addEventListener) {
        document.addEventListener('touchstart', this.onTouchStart, false);
        document.addEventListener('touchmove', this.onTouchMove, false);
        document.addEventListener('touchend', this.onTouchEnd, false);
      }
    }
  }, {
    key: 'stopListeningToTouch',
    value: function stopListeningToTouch() {
      if (document && document.removeEventListener) {
        document.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
      }
    }

    // ==============================
    // Focus Handlers
    // ==============================

    // ==============================
    // Keyboard Handlers
    // ==============================

  }, {
    key: 'buildMenuOptions',


    // ==============================
    // Menu Options
    // ==============================

    value: function buildMenuOptions(props, selectValue) {
      var _this3 = this;

      var _props$inputValue = props.inputValue,
          inputValue = _props$inputValue === undefined ? '' : _props$inputValue,
          options = props.options;


      var toOption = function toOption(option, id) {
        var isDisabled = _this3.isOptionDisabled(option, selectValue);
        var isSelected = _this3.isOptionSelected(option, selectValue);
        var label = _this3.getOptionLabel(option);
        var value = _this3.getOptionValue(option);

        if (_this3.shouldHideSelectedOptions() && isSelected || !_this3.filterOption({ label: label, value: value, data: option }, inputValue)) {
          return;
        }

        var onHover = isDisabled ? undefined : function () {
          return _this3.onOptionHover(option);
        };
        var onSelect = isDisabled ? undefined : function () {
          return _this3.selectOption(option);
        };
        var optionId = _this3.getElementId('option') + '-' + id;

        return {
          innerProps: {
            id: optionId,
            onClick: onSelect,
            onMouseMove: onHover,
            onMouseOver: onHover,
            role: 'option',
            tabIndex: -1
          },
          data: option,
          isDisabled: isDisabled,
          isSelected: isSelected,
          key: optionId,
          label: label,
          type: 'option',
          value: value
        };
      };

      return options.reduce(function (acc, item, itemIndex) {
        if (item.options) {
          // TODO needs a tidier implementation
          if (!_this3.hasGroups) _this3.hasGroups = true;

          var items = item.options;

          var children = items.map(function (child, i) {
            var option = toOption(child, itemIndex + '-' + i);
            if (option && !option.isDisabled) acc.focusable.push(child);
            return option;
          }).filter(Boolean);
          if (children.length) {
            var groupId = _this3.getElementId('group') + '-' + itemIndex;
            acc.render.push({
              type: 'group',
              key: groupId,
              data: item,
              options: children
            });
          }
        } else {
          var option = toOption(item, '' + itemIndex);
          if (option) {
            acc.render.push(option);
            if (!option.isDisabled) acc.focusable.push(item);
          }
        }
        return acc;
      }, { render: [], focusable: [] });
    }

    // ==============================
    // Renderers
    // ==============================

  }, {
    key: 'constructAriaLiveMessage',
    value: function constructAriaLiveMessage() {
      var _state5 = this.state,
          ariaLiveContext = _state5.ariaLiveContext,
          selectValue = _state5.selectValue,
          focusedValue = _state5.focusedValue,
          focusedOption = _state5.focusedOption;
      var _props6 = this.props,
          options = _props6.options,
          menuIsOpen = _props6.menuIsOpen,
          inputValue = _props6.inputValue,
          screenReaderStatus = _props6.screenReaderStatus;

      // An aria live message representing the currently focused value in the select.

      var focusedValueMsg = focusedValue ? valueFocusAriaMessage({
        focusedValue: focusedValue,
        getOptionLabel: this.getOptionLabel,
        selectValue: selectValue
      }) : '';
      // An aria live message representing the currently focused option in the select.
      var focusedOptionMsg = focusedOption && menuIsOpen ? optionFocusAriaMessage({
        focusedOption: focusedOption,
        getOptionLabel: this.getOptionLabel,
        options: options
      }) : '';
      // An aria live message representing the set of focusable results and current searchterm/inputvalue.
      var resultsMsg = resultsAriaMessage({
        inputValue: inputValue,
        screenReaderMessage: screenReaderStatus({ count: this.countOptions() })
      });

      return focusedValueMsg + ' ' + focusedOptionMsg + ' ' + resultsMsg + ' ' + ariaLiveContext;
    }
  }, {
    key: 'renderInput',
    value: function renderInput() {
      var _props7 = this.props,
          isDisabled = _props7.isDisabled,
          isSearchable = _props7.isSearchable,
          inputId = _props7.inputId,
          inputValue = _props7.inputValue,
          tabIndex = _props7.tabIndex;
      var Input = this.components.Input;
      var inputIsHidden = this.state.inputIsHidden;


      var id = inputId || this.getElementId('input');

      if (!isSearchable) {
        // use a dummy input to maintain focus/blur functionality
        return React.createElement(DummyInput, {
          id: id,
          innerRef: this.getInputRef,
          onBlur: this.onInputBlur,
          onChange: noop,
          onFocus: this.onInputFocus,
          readOnly: true,
          disabled: isDisabled,
          tabIndex: tabIndex,
          value: ''
        });
      }

      // aria attributes makes the JSX "noisy", separated for clarity
      var ariaAttributes = {
        'aria-autocomplete': 'list',
        'aria-label': this.props['aria-label'],
        'aria-labelledby': this.props['aria-labelledby']
      };

      var _commonProps = this.commonProps,
          cx = _commonProps.cx,
          theme = _commonProps.theme;


      return React.createElement(Input, _extends({
        autoCapitalize: 'none',
        autoComplete: 'off',
        autoCorrect: 'off',
        cx: cx,
        getStyles: this.getStyles,
        id: id,
        innerRef: this.getInputRef,
        isDisabled: isDisabled,
        isHidden: inputIsHidden,
        onBlur: this.onInputBlur,
        onChange: this.handleInputChange,
        onFocus: this.onInputFocus,
        spellCheck: 'false',
        tabIndex: tabIndex,
        theme: theme,
        type: 'text',
        value: inputValue
      }, ariaAttributes));
    }
  }, {
    key: 'renderPlaceholderOrValue',
    value: function renderPlaceholderOrValue() {
      var _this4 = this;

      var _components = this.components,
          MultiValue = _components.MultiValue,
          MultiValueContainer = _components.MultiValueContainer,
          MultiValueLabel = _components.MultiValueLabel,
          MultiValueRemove = _components.MultiValueRemove,
          SingleValue = _components.SingleValue,
          Placeholder = _components.Placeholder;
      var commonProps = this.commonProps;
      var _props8 = this.props,
          controlShouldRenderValue = _props8.controlShouldRenderValue,
          isDisabled = _props8.isDisabled,
          isMulti = _props8.isMulti,
          inputValue = _props8.inputValue,
          placeholder = _props8.placeholder;
      var _state6 = this.state,
          selectValue = _state6.selectValue,
          focusedValue = _state6.focusedValue,
          isFocused = _state6.isFocused;


      if (!this.hasValue() || !controlShouldRenderValue) {
        return inputValue ? null : React.createElement(
          Placeholder,
          _extends({}, commonProps, {
            key: 'placeholder',
            isDisabled: isDisabled,
            isFocused: isFocused
          }),
          placeholder
        );
      }

      if (isMulti) {
        var selectValues = selectValue.map(function (opt) {
          var isFocused = opt === focusedValue;
          return React.createElement(
            MultiValue,
            _extends({}, commonProps, {
              components: {
                Container: MultiValueContainer,
                Label: MultiValueLabel,
                Remove: MultiValueRemove
              },
              isFocused: isFocused,
              isDisabled: isDisabled,
              key: _this4.getOptionValue(opt),
              removeProps: {
                onClick: function onClick() {
                  return _this4.removeValue(opt);
                },
                onTouchEnd: function onTouchEnd() {
                  return _this4.removeValue(opt);
                },
                onMouseDown: function onMouseDown(e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              },
              data: opt
            }),
            _this4.formatOptionLabel(opt, 'value')
          );
        });
        return selectValues;
      }

      if (inputValue) {
        return null;
      }

      var singleValue = selectValue[0];
      return React.createElement(
        SingleValue,
        _extends({}, commonProps, { data: singleValue, isDisabled: isDisabled }),
        this.formatOptionLabel(singleValue, 'value')
      );
    }
  }, {
    key: 'renderClearIndicator',
    value: function renderClearIndicator() {
      var ClearIndicator = this.components.ClearIndicator;
      var commonProps = this.commonProps;
      var _props9 = this.props,
          isDisabled = _props9.isDisabled,
          isLoading = _props9.isLoading;
      var isFocused = this.state.isFocused;


      if (!this.isClearable() || !ClearIndicator || isDisabled || !this.hasValue() || isLoading) {
        return null;
      }

      var innerProps = {
        onMouseDown: this.onClearIndicatorMouseDown,
        onTouchEnd: this.onClearIndicatorTouchEnd,
        'aria-hidden': 'true'
      };

      return React.createElement(ClearIndicator, _extends({}, commonProps, {
        innerProps: innerProps,
        isFocused: isFocused
      }));
    }
  }, {
    key: 'renderLoadingIndicator',
    value: function renderLoadingIndicator() {
      var LoadingIndicator = this.components.LoadingIndicator;
      var commonProps = this.commonProps;
      var _props10 = this.props,
          isDisabled = _props10.isDisabled,
          isLoading = _props10.isLoading;
      var isFocused = this.state.isFocused;


      if (!LoadingIndicator || !isLoading) return null;

      var innerProps = { 'aria-hidden': 'true' };
      return React.createElement(LoadingIndicator, _extends({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: 'renderIndicatorSeparator',
    value: function renderIndicatorSeparator() {
      var _components2 = this.components,
          DropdownIndicator = _components2.DropdownIndicator,
          IndicatorSeparator = _components2.IndicatorSeparator;

      // separator doesn't make sense without the dropdown indicator

      if (!DropdownIndicator || !IndicatorSeparator) return null;

      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;


      return React.createElement(IndicatorSeparator, _extends({}, commonProps, {
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: 'renderDropdownIndicator',
    value: function renderDropdownIndicator() {
      var DropdownIndicator = this.components.DropdownIndicator;

      if (!DropdownIndicator) return null;
      var commonProps = this.commonProps;
      var isDisabled = this.props.isDisabled;
      var isFocused = this.state.isFocused;


      var innerProps = {
        onMouseDown: this.onDropdownIndicatorMouseDown,
        onTouchEnd: this.onDropdownIndicatorTouchEnd,
        'aria-hidden': 'true'
      };

      return React.createElement(DropdownIndicator, _extends({}, commonProps, {
        innerProps: innerProps,
        isDisabled: isDisabled,
        isFocused: isFocused
      }));
    }
  }, {
    key: 'renderMenu',
    value: function renderMenu() {
      var _this5 = this;

      var _components3 = this.components,
          Group = _components3.Group,
          GroupHeading = _components3.GroupHeading,
          Menu$$1 = _components3.Menu,
          MenuList$$1 = _components3.MenuList,
          MenuPortal$$1 = _components3.MenuPortal,
          LoadingMessage$$1 = _components3.LoadingMessage,
          NoOptionsMessage$$1 = _components3.NoOptionsMessage,
          Option = _components3.Option;
      var commonProps = this.commonProps;
      var _state7 = this.state,
          focusedOption = _state7.focusedOption,
          menuOptions = _state7.menuOptions;
      var _props11 = this.props,
          captureMenuScroll = _props11.captureMenuScroll,
          inputValue = _props11.inputValue,
          isLoading = _props11.isLoading,
          loadingMessage = _props11.loadingMessage,
          minMenuHeight = _props11.minMenuHeight,
          maxMenuHeight = _props11.maxMenuHeight,
          menuIsOpen = _props11.menuIsOpen,
          menuPlacement = _props11.menuPlacement,
          menuPosition = _props11.menuPosition,
          menuPortalTarget = _props11.menuPortalTarget,
          menuShouldBlockScroll = _props11.menuShouldBlockScroll,
          menuShouldScrollIntoView = _props11.menuShouldScrollIntoView,
          noOptionsMessage = _props11.noOptionsMessage,
          onMenuScrollToTop = _props11.onMenuScrollToTop,
          onMenuScrollToBottom = _props11.onMenuScrollToBottom;


      if (!menuIsOpen) return null;

      // TODO: Internal Option Type here
      var render = function render(props) {
        // for performance, the menu options in state aren't changed when the
        // focused option changes so we calculate additional props based on that
        var isFocused = focusedOption === props.data;
        props.innerRef = isFocused ? _this5.getFocusedOptionRef : undefined;

        return React.createElement(
          Option,
          _extends({}, commonProps, props, { isFocused: isFocused }),
          _this5.formatOptionLabel(props.data, 'menu')
        );
      };

      var menuUI = void 0;

      if (this.hasOptions()) {
        menuUI = menuOptions.render.map(function (item) {
          if (item.type === 'group') {
            var type = item.type,
                group = objectWithoutProperties(item, ['type']);

            var headingId = item.key + '-heading';

            return React.createElement(
              Group,
              _extends({}, commonProps, group, {
                Heading: GroupHeading,
                headingProps: {
                  id: headingId
                },
                label: _this5.formatGroupLabel(item.data)
              }),
              item.options.map(function (option) {
                return render(option);
              })
            );
          } else if (item.type === 'option') {
            return render(item);
          }
        });
      } else if (isLoading) {
        var message = loadingMessage({ inputValue: inputValue });
        if (message === null) return null;
        menuUI = React.createElement(
          LoadingMessage$$1,
          commonProps,
          message
        );
      } else {
        var _message = noOptionsMessage({ inputValue: inputValue });
        if (_message === null) return null;
        menuUI = React.createElement(
          NoOptionsMessage$$1,
          commonProps,
          _message
        );
      }
      var menuPlacementProps = {
        minMenuHeight: minMenuHeight,
        maxMenuHeight: maxMenuHeight,
        menuPlacement: menuPlacement,
        menuPosition: menuPosition,
        menuShouldScrollIntoView: menuShouldScrollIntoView
      };

      var menuElement = React.createElement(
        MenuPlacer,
        _extends({}, commonProps, menuPlacementProps),
        function (_ref2) {
          var ref = _ref2.ref,
              _ref2$placerProps = _ref2.placerProps,
              placement = _ref2$placerProps.placement,
              maxHeight = _ref2$placerProps.maxHeight;
          return React.createElement(
            Menu$$1,
            _extends({}, commonProps, menuPlacementProps, {
              innerRef: ref,
              innerProps: {
                onMouseDown: _this5.onMenuMouseDown,
                onMouseMove: _this5.onMenuMouseMove
              },
              isLoading: isLoading,
              placement: placement
            }),
            React.createElement(
              ScrollCaptorSwitch,
              {
                isEnabled: captureMenuScroll,
                onTopArrive: onMenuScrollToTop,
                onBottomArrive: onMenuScrollToBottom
              },
              React.createElement(
                ScrollBlock,
                { isEnabled: menuShouldBlockScroll },
                React.createElement(
                  MenuList$$1,
                  _extends({}, commonProps, {
                    innerRef: _this5.getMenuListRef,
                    isLoading: isLoading,
                    maxHeight: maxHeight
                  }),
                  menuUI
                )
              )
            )
          );
        }
      );

      // positioning behaviour is almost identical for portalled and fixed,
      // so we use the same component. the actual portalling logic is forked
      // within the component based on `menuPosition`
      return menuPortalTarget || menuPosition === 'fixed' ? React.createElement(
        MenuPortal$$1,
        _extends({}, commonProps, {
          appendTo: menuPortalTarget,
          controlElement: this.controlRef,
          menuPlacement: menuPlacement,
          menuPosition: menuPosition
        }),
        menuElement
      ) : menuElement;
    }
  }, {
    key: 'renderFormField',
    value: function renderFormField() {
      var _this6 = this;

      var _props12 = this.props,
          delimiter = _props12.delimiter,
          isDisabled = _props12.isDisabled,
          isMulti = _props12.isMulti,
          name = _props12.name;
      var selectValue = this.state.selectValue;


      if (!name || isDisabled) return;

      if (isMulti) {
        if (delimiter) {
          var _value = selectValue.map(function (opt) {
            return _this6.getOptionValue(opt);
          }).join(delimiter);
          return React.createElement('input', { name: name, type: 'hidden', value: _value });
        } else {
          var input = selectValue.length > 0 ? selectValue.map(function (opt, i) {
            return React.createElement('input', {
              key: 'i-' + i,
              name: name,
              type: 'hidden',
              value: _this6.getOptionValue(opt)
            });
          }) : React.createElement('input', { name: name, type: 'hidden' });

          return React.createElement(
            'div',
            null,
            input
          );
        }
      } else {
        var _value2 = selectValue[0] ? this.getOptionValue(selectValue[0]) : '';
        return React.createElement('input', { name: name, type: 'hidden', value: _value2 });
      }
    }
  }, {
    key: 'renderLiveRegion',
    value: function renderLiveRegion() {
      if (!this.state.isFocused) return null;
      return React.createElement(
        A11yText,
        { 'aria-live': 'assertive' },
        React.createElement(
          'p',
          { id: 'aria-selection-event' },
          '\xA0',
          this.state.ariaLiveSelection
        ),
        React.createElement(
          'p',
          { id: 'aria-context' },
          '\xA0',
          this.constructAriaLiveMessage()
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _components4 = this.components,
          Control = _components4.Control,
          IndicatorsContainer = _components4.IndicatorsContainer,
          SelectContainer = _components4.SelectContainer,
          ValueContainer = _components4.ValueContainer;
      var _props13 = this.props,
          className = _props13.className,
          id = _props13.id,
          isDisabled = _props13.isDisabled;
      var isFocused = this.state.isFocused;


      var commonProps = this.commonProps = this.getCommonProps();

      return React.createElement(
        SelectContainer,
        _extends({}, commonProps, {
          className: className,
          innerProps: {
            id: id,
            onKeyDown: this.onKeyDown
          },
          isDisabled: isDisabled,
          isFocused: isFocused
        }),
        this.renderLiveRegion(),
        React.createElement(
          Control,
          _extends({}, commonProps, {
            innerRef: this.getControlRef,
            innerProps: {
              onMouseDown: this.onControlMouseDown,
              onTouchEnd: this.onControlTouchEnd
            },
            isDisabled: isDisabled,
            isFocused: isFocused
          }),
          React.createElement(
            ValueContainer,
            _extends({}, commonProps, { isDisabled: isDisabled }),
            this.renderPlaceholderOrValue(),
            this.renderInput()
          ),
          React.createElement(
            IndicatorsContainer,
            _extends({}, commonProps, { isDisabled: isDisabled }),
            this.renderClearIndicator(),
            this.renderLoadingIndicator(),
            this.renderIndicatorSeparator(),
            this.renderDropdownIndicator()
          )
        ),
        this.renderMenu(),
        this.renderFormField()
      );
    }
  }]);
  return Select;
}(Component);

Select.defaultProps = defaultProps;

var _initialiseProps = function _initialiseProps() {
  var _this7 = this;

  this.state = {
    ariaLiveSelection: '',
    ariaLiveContext: '',
    focusedOption: null,
    focusedValue: null,
    inputIsHidden: false,
    isFocused: false,
    isComposing: false,
    menuOptions: { render: [], focusable: [] },
    selectValue: []
  };
  this.blockOptionHover = false;
  this.clearFocusValueOnUpdate = false;
  this.hasGroups = false;
  this.initialTouchX = 0;
  this.initialTouchY = 0;
  this.instancePrefix = '';
  this.openAfterFocus = false;
  this.scrollToFocusedOptionOnUpdate = false;
  this.controlRef = null;

  this.getControlRef = function (ref) {
    _this7.controlRef = ref;
  };

  this.focusedOptionRef = null;

  this.getFocusedOptionRef = function (ref) {
    _this7.focusedOptionRef = ref;
  };

  this.menuListRef = null;

  this.getMenuListRef = function (ref) {
    _this7.menuListRef = ref;
  };

  this.inputRef = null;

  this.getInputRef = function (ref) {
    _this7.inputRef = ref;
  };

  this.cacheComponents = function (components$$1) {
    _this7.components = defaultComponents({ components: components$$1 });
  };

  this.focus = this.focusInput;
  this.blur = this.blurInput;

  this.onChange = function (newValue, actionMeta) {
    var _props14 = _this7.props,
        onChange = _props14.onChange,
        name = _props14.name;

    onChange(newValue, _extends({}, actionMeta, { name: name }));
  };

  this.setValue = function (newValue) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'set-value';
    var option = arguments[2];
    var _props15 = _this7.props,
        closeMenuOnSelect = _props15.closeMenuOnSelect,
        isMulti = _props15.isMulti;

    _this7.onInputChange('', { action: 'set-value' });
    if (closeMenuOnSelect) {
      _this7.inputIsHiddenAfterUpdate = !isMulti;
      _this7.onMenuClose();
    }
    // when the select value should change, we should reset focusedValue
    _this7.clearFocusValueOnUpdate = true;
    _this7.onChange(newValue, { action: action, option: option });
  };

  this.selectOption = function (newValue) {
    var _props16 = _this7.props,
        blurInputOnSelect = _props16.blurInputOnSelect,
        isMulti = _props16.isMulti;


    if (isMulti) {
      var _selectValue3 = _this7.state.selectValue;

      if (_this7.isOptionSelected(newValue, _selectValue3)) {
        var candidate = _this7.getOptionValue(newValue);
        _this7.setValue(_selectValue3.filter(function (i) {
          return _this7.getOptionValue(i) !== candidate;
        }), 'deselect-option', newValue);
        _this7.announceAriaLiveSelection({
          event: 'deselect-option',
          context: { value: _this7.getOptionLabel(newValue) }
        });
      } else {
        _this7.setValue([].concat(toConsumableArray(_selectValue3), [newValue]), 'select-option', newValue);
        _this7.announceAriaLiveSelection({
          event: 'select-option',
          context: { value: _this7.getOptionLabel(newValue) }
        });
      }
    } else {
      _this7.setValue(newValue, 'select-option');
      _this7.announceAriaLiveSelection({
        event: 'select-option',
        context: { value: _this7.getOptionLabel(newValue) }
      });
    }

    if (blurInputOnSelect) {
      _this7.blurInput();
    }
  };

  this.removeValue = function (removedValue) {
    var selectValue = _this7.state.selectValue;

    var candidate = _this7.getOptionValue(removedValue);
    _this7.onChange(selectValue.filter(function (i) {
      return _this7.getOptionValue(i) !== candidate;
    }), {
      action: 'remove-value',
      removedValue: removedValue
    });
    _this7.announceAriaLiveSelection({
      event: 'remove-value',
      context: {
        value: removedValue ? _this7.getOptionLabel(removedValue) : undefined
      }
    });
    _this7.focusInput();
  };

  this.clearValue = function () {
    var isMulti = _this7.props.isMulti;

    _this7.onChange(isMulti ? [] : null, { action: 'clear' });
  };

  this.popValue = function () {
    var selectValue = _this7.state.selectValue;

    var lastSelectedValue = selectValue[selectValue.length - 1];
    _this7.announceAriaLiveSelection({
      event: 'pop-value',
      context: {
        value: lastSelectedValue ? _this7.getOptionLabel(lastSelectedValue) : undefined
      }
    });
    _this7.onChange(selectValue.slice(0, selectValue.length - 1), {
      action: 'pop-value',
      removedValue: lastSelectedValue
    });
  };

  this.getOptionLabel = function (data) {
    return _this7.props.getOptionLabel(data);
  };

  this.getOptionValue = function (data) {
    return _this7.props.getOptionValue(data);
  };

  this.getStyles = function (key, props) {
    var base = defaultStyles[key](props);
    base.boxSizing = 'border-box';
    var custom = _this7.props.styles[key];
    return custom ? custom(base, props) : base;
  };

  this.getElementId = function (element) {
    return _this7.instancePrefix + '-' + element;
  };

  this.getActiveDescendentId = function () {
    var menuIsOpen = _this7.props.menuIsOpen;
    var _state8 = _this7.state,
        menuOptions = _state8.menuOptions,
        focusedOption = _state8.focusedOption;


    if (!focusedOption || !menuIsOpen) return undefined;

    var index = menuOptions.focusable.indexOf(focusedOption);
    var option = menuOptions.render[index];

    return option && option.key;
  };

  this.announceAriaLiveSelection = function (_ref3) {
    var event = _ref3.event,
        context = _ref3.context;

    _this7.setState({
      ariaLiveSelection: valueEventAriaMessage(event, context)
    });
  };

  this.announceAriaLiveContext = function (_ref4) {
    var event = _ref4.event,
        context = _ref4.context;

    _this7.setState({
      ariaLiveContext: instructionsAriaMessage(event, _extends({}, context, {
        label: _this7.props['aria-label']
      }))
    });
  };

  this.onMenuMouseDown = function (event) {
    if (event.button !== 0) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    _this7.focusInput();
  };

  this.onMenuMouseMove = function (event) {
    _this7.blockOptionHover = false;
  };

  this.onControlMouseDown = function (event) {
    var openMenuOnClick = _this7.props.openMenuOnClick;

    if (!_this7.state.isFocused) {
      if (openMenuOnClick) {
        _this7.openAfterFocus = true;
      }
      _this7.focusInput();
    } else if (!_this7.props.menuIsOpen) {
      _this7.openMenu('first');
    } else {
      // $FlowFixMe HTMLElement type does not have tagName property
      if (event.target.tagName !== 'INPUT') {
        _this7.onMenuClose();
      }
    }
    // $FlowFixMe HTMLElement type does not have tagName property
    if (event.target.tagName !== 'INPUT') {
      event.preventDefault();
    }
  };

  this.onDropdownIndicatorMouseDown = function (event) {
    // ignore mouse events that weren't triggered by the primary button
    if (event && event.type === 'mousedown' && event.button !== 0) {
      return;
    }
    if (_this7.props.isDisabled) return;
    var _props17 = _this7.props,
        isMulti = _props17.isMulti,
        menuIsOpen = _props17.menuIsOpen;

    _this7.focusInput();
    if (menuIsOpen) {
      _this7.inputIsHiddenAfterUpdate = !isMulti;
      _this7.onMenuClose();
    } else {
      _this7.openMenu('first');
    }
    event.preventDefault();
    event.stopPropagation();
  };

  this.onClearIndicatorMouseDown = function (event) {
    // ignore mouse events that weren't triggered by the primary button
    if (event && event.type === 'mousedown' && event.button !== 0) {
      return;
    }
    _this7.clearValue();
    event.stopPropagation();
    _this7.openAfterFocus = false;
    setTimeout(function () {
      return _this7.focusInput();
    });
  };

  this.onScroll = function (event) {
    if (typeof _this7.props.closeMenuOnScroll === 'boolean') {
      if (event.target instanceof HTMLElement && isDocumentElement(event.target)) {
        _this7.props.onMenuClose();
      }
    } else if (typeof _this7.props.closeMenuOnScroll === 'function') {
      if (_this7.props.closeMenuOnScroll(event)) {
        _this7.props.onMenuClose();
      }
    }
  };

  this.onCompositionStart = function () {
    _this7.setState({
      isComposing: true
    });
  };

  this.onCompositionEnd = function () {
    _this7.setState({
      isComposing: false
    });
  };

  this.onTouchStart = function (_ref5) {
    var _ref5$touches = slicedToArray(_ref5.touches, 1),
        touch = _ref5$touches[0];

    _this7.initialTouchX = touch.clientX;
    _this7.initialTouchY = touch.clientY;
    _this7.userIsDragging = false;
  };

  this.onTouchMove = function (_ref6) {
    var _ref6$touches = slicedToArray(_ref6.touches, 1),
        touch = _ref6$touches[0];

    var deltaX = Math.abs(touch.clientX - _this7.initialTouchX);
    var deltaY = Math.abs(touch.clientY - _this7.initialTouchY);
    var moveThreshold = 5;

    _this7.userIsDragging = deltaX > moveThreshold || deltaY > moveThreshold;
  };

  this.onTouchEnd = function (event) {
    if (_this7.userIsDragging) return;

    // type cast the EventTarget
    var target = event.target;

    // close the menu if the user taps outside
    if (_this7.controlRef && !_this7.controlRef.contains(target) && _this7.menuListRef && !_this7.menuListRef.contains(target)) {
      _this7.blurInput();
    }

    // reset move vars
    _this7.initialTouchX = 0;
    _this7.initialTouchY = 0;
  };

  this.onControlTouchEnd = function (event) {
    if (_this7.userIsDragging) return;

    _this7.onControlMouseDown(event);
  };

  this.onClearIndicatorTouchEnd = function (event) {
    if (_this7.userIsDragging) return;

    _this7.onClearIndicatorMouseDown(event);
  };

  this.onDropdownIndicatorTouchEnd = function (event) {
    if (_this7.userIsDragging) return;

    _this7.onDropdownIndicatorMouseDown(event);
  };

  this.handleInputChange = function (event) {
    var inputValue = event.currentTarget.value;
    _this7.inputIsHiddenAfterUpdate = false;
    _this7.onInputChange(inputValue, { action: 'input-change' });
    _this7.onMenuOpen();
  };

  this.onInputFocus = function (event) {
    var _props18 = _this7.props,
        isSearchable = _props18.isSearchable,
        isMulti = _props18.isMulti;

    if (_this7.props.onFocus) {
      _this7.props.onFocus(event);
    }
    _this7.inputIsHiddenAfterUpdate = false;
    _this7.announceAriaLiveContext({
      event: 'input',
      context: { isSearchable: isSearchable, isMulti: isMulti }
    });
    _this7.setState({
      isFocused: true
    });
    if (_this7.openAfterFocus || _this7.props.openMenuOnFocus) {
      _this7.openMenu('first');
    }
    _this7.openAfterFocus = false;
  };

  this.onInputBlur = function (event) {
    if (_this7.menuListRef && _this7.menuListRef.contains(document.activeElement)) {
      _this7.inputRef.focus();
      return;
    }
    if (_this7.props.onBlur) {
      _this7.props.onBlur(event);
    }
    _this7.onInputChange('', { action: 'input-blur' });
    _this7.onMenuClose();
    _this7.setState({
      focusedValue: null,
      isFocused: false
    });
  };

  this.onOptionHover = function (focusedOption) {
    if (_this7.blockOptionHover || _this7.state.focusedOption === focusedOption) {
      return;
    }
    _this7.setState({ focusedOption: focusedOption });
  };

  this.shouldHideSelectedOptions = function () {
    var _props19 = _this7.props,
        hideSelectedOptions = _props19.hideSelectedOptions,
        isMulti = _props19.isMulti;

    if (hideSelectedOptions === undefined) return isMulti;
    return hideSelectedOptions;
  };

  this.onKeyDown = function (event) {
    var _props20 = _this7.props,
        isMulti = _props20.isMulti,
        backspaceRemovesValue = _props20.backspaceRemovesValue,
        escapeClearsValue = _props20.escapeClearsValue,
        inputValue = _props20.inputValue,
        isClearable = _props20.isClearable,
        isDisabled = _props20.isDisabled,
        menuIsOpen = _props20.menuIsOpen,
        onKeyDown = _props20.onKeyDown,
        tabSelectsValue = _props20.tabSelectsValue,
        openMenuOnFocus = _props20.openMenuOnFocus;
    var _state9 = _this7.state,
        isComposing = _state9.isComposing,
        focusedOption = _state9.focusedOption,
        focusedValue = _state9.focusedValue,
        selectValue = _state9.selectValue;


    if (isDisabled) return;

    if (typeof onKeyDown === 'function') {
      onKeyDown(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    // Block option hover events when the user has just pressed a key
    _this7.blockOptionHover = true;
    switch (event.key) {
      case 'ArrowLeft':
        if (!isMulti || inputValue) return;
        _this7.focusValue('previous');
        break;
      case 'ArrowRight':
        if (!isMulti || inputValue) return;
        _this7.focusValue('next');
        break;
      case 'Delete':
      case 'Backspace':
        if (inputValue) return;
        if (focusedValue) {
          _this7.removeValue(focusedValue);
        } else {
          if (!backspaceRemovesValue) return;
          if (isMulti) {
            _this7.popValue();
          } else if (isClearable) {
            _this7.clearValue();
          }
        }
        break;
      case 'Tab':
        if (event.shiftKey || !menuIsOpen || !tabSelectsValue || !focusedOption ||
        // don't capture the event if the menu opens on focus and the focused
        // option is already selected; it breaks the flow of navigation
        openMenuOnFocus && _this7.isOptionSelected(focusedOption, selectValue)) {
          return;
        }
        _this7.selectOption(focusedOption);
        break;
      case 'Enter':
        if (menuIsOpen) {
          if (!focusedOption) return;
          if (isComposing) return;
          _this7.selectOption(focusedOption);
        } else {
          _this7.focusOption('first');
        }
        break;
      case 'Escape':
        if (menuIsOpen) {
          _this7.inputIsHiddenAfterUpdate = false;
          _this7.onInputChange('', { action: 'menu-close' });
          _this7.onMenuClose();
        } else if (isClearable && escapeClearsValue) {
          _this7.clearValue();
        }
        break;
      case ' ':
        // space
        if (inputValue) {
          return;
        }
        if (!menuIsOpen) {
          _this7.openMenu('first');
          break;
        }
        if (!focusedOption) return;
        _this7.selectOption(focusedOption);
        break;
      case 'ArrowUp':
        if (menuIsOpen) {
          _this7.focusOption('up');
        } else {
          _this7.openMenu('last');
        }
        break;
      case 'ArrowDown':
        if (menuIsOpen) {
          _this7.focusOption('down');
        } else {
          _this7.openMenu('first');
        }
        break;
      case 'PageUp':
        if (!menuIsOpen) return;
        _this7.focusOption('pageup');
        break;
      case 'PageDown':
        if (!menuIsOpen) return;
        _this7.focusOption('pagedown');
        break;
      case 'Home':
        if (!menuIsOpen) return;
        _this7.focusOption('first');
        break;
      case 'End':
        if (!menuIsOpen) return;
        _this7.focusOption('last');
        break;
      default:
        return;
    }
    event.preventDefault();
  };
};

var manageState = function manageState(SelectComponent) {
  var _class, _temp2;

  return _temp2 = _class = function (_Component) {
    inherits(StateManager, _Component);

    function StateManager() {
      var _ref;

      var _temp, _this, _ret;

      classCallCheck(this, StateManager);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = StateManager.__proto__ || Object.getPrototypeOf(StateManager)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        inputValue: _this.props.inputValue !== undefined ? _this.props.inputValue : _this.props.defaultInputValue,
        menuIsOpen: _this.props.menuIsOpen !== undefined ? _this.props.menuIsOpen : _this.props.defaultMenuIsOpen,
        value: _this.props.value !== undefined ? _this.props.value : _this.props.defaultValue
      }, _this.onChange = function (value, actionMeta) {
        _this.callProp('onChange', value, actionMeta);
        _this.setState({ value: value });
      }, _this.onInputChange = function (value, actionMeta) {
        // TODO: for backwards compatibility, we allow the prop to return a new
        // value, but now inputValue is a controllable prop we probably shouldn't
        var newValue = _this.callProp('onInputChange', value, actionMeta);
        _this.setState({
          inputValue: newValue !== undefined ? newValue : value
        });
      }, _this.onMenuOpen = function () {
        _this.callProp('onMenuOpen');
        _this.setState({ menuIsOpen: true });
      }, _this.onMenuClose = function () {
        _this.callProp('onMenuClose');
        _this.setState({ menuIsOpen: false });
      }, _temp), possibleConstructorReturn(_this, _ret);
    }

    createClass(StateManager, [{
      key: 'focus',
      value: function focus() {
        this.select.focus();
      }
    }, {
      key: 'blur',
      value: function blur() {
        this.select.blur();
      }
    }, {
      key: 'getProp',
      value: function getProp(key) {
        return this.props[key] !== undefined ? this.props[key] : this.state[key];
      }
    }, {
      key: 'callProp',
      value: function callProp(name) {
        if (typeof this.props[name] === 'function') {
          var _props;

          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          return (_props = this.props)[name].apply(_props, toConsumableArray(args));
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return React.createElement(SelectComponent, _extends({}, this.props, {
          ref: function ref(_ref2) {
            _this2.select = _ref2;
          },
          inputValue: this.getProp('inputValue'),
          menuIsOpen: this.getProp('menuIsOpen'),
          onChange: this.onChange,
          onInputChange: this.onInputChange,
          onMenuClose: this.onMenuClose,
          onMenuOpen: this.onMenuOpen,
          value: this.getProp('value')
        }));
      }
    }]);
    return StateManager;
  }(Component), _class.defaultProps = {
    defaultInputValue: '',
    defaultMenuIsOpen: false,
    defaultValue: null
  }, _temp2;
};

var defaultProps$1 = {
  cacheOptions: false,
  defaultOptions: false
};

var makeAsyncSelect = function makeAsyncSelect(SelectComponent) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    inherits(Async, _Component);

    function Async(props) {
      classCallCheck(this, Async);

      var _this = possibleConstructorReturn(this, (Async.__proto__ || Object.getPrototypeOf(Async)).call(this));

      _this.mounted = false;
      _this.optionsCache = {};

      _this.handleInputChange = function (newValue, actionMeta) {
        var _this$props = _this.props,
            cacheOptions = _this$props.cacheOptions,
            onInputChange = _this$props.onInputChange;
        // TODO

        var inputValue = handleInputChange(newValue, actionMeta, onInputChange);
        if (!inputValue) {
          delete _this.lastRequest;
          _this.setState({
            inputValue: '',
            loadedInputValue: '',
            loadedOptions: [],
            isLoading: false,
            passEmptyOptions: false
          });
          return;
        }
        if (cacheOptions && _this.optionsCache[inputValue]) {
          _this.setState({
            inputValue: inputValue,
            loadedInputValue: inputValue,
            loadedOptions: _this.optionsCache[inputValue],
            isLoading: false,
            passEmptyOptions: false
          });
        } else {
          var request = _this.lastRequest = {};
          _this.setState({
            inputValue: inputValue,
            isLoading: true,
            passEmptyOptions: !_this.state.loadedInputValue
          }, function () {
            _this.loadOptions(inputValue, function (options) {
              if (!_this.mounted) return;
              if (options) {
                _this.optionsCache[inputValue] = options;
              }
              if (request !== _this.lastRequest) return;
              delete _this.lastRequest;
              _this.setState({
                isLoading: false,
                loadedInputValue: inputValue,
                loadedOptions: options || [],
                passEmptyOptions: false
              });
            });
          });
        }
        return inputValue;
      };

      _this.state = {
        defaultOptions: Array.isArray(props.defaultOptions) ? props.defaultOptions : undefined,
        inputValue: props.inputValue,
        isLoading: props.defaultOptions === true ? true : false,
        loadedOptions: [],
        passEmptyOptions: false
      };
      return _this;
    }

    createClass(Async, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        this.mounted = true;
        var defaultOptions = this.props.defaultOptions;
        var inputValue = this.state.inputValue;

        if (defaultOptions === true) {
          this.loadOptions(inputValue, function (options) {
            if (!_this2.mounted) return;
            var isLoading = !!_this2.lastRequest;
            _this2.setState({ defaultOptions: options || [], isLoading: isLoading });
          });
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        // if the cacheOptions prop changes, clear the cache
        if (nextProps.cacheOptions !== this.props.cacheOptions) {
          this.optionsCache = {};
        }
        if (nextProps.defaultOptions !== this.props.defaultOptions) {
          this.setState({
            defaultOptions: Array.isArray(nextProps.defaultOptions) ? nextProps.defaultOptions : undefined
          });
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.mounted = false;
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.select.focus();
      }
    }, {
      key: 'blur',
      value: function blur() {
        this.select.blur();
      }
    }, {
      key: 'loadOptions',
      value: function loadOptions(inputValue, callback) {
        var loadOptions = this.props.loadOptions;

        if (!loadOptions) return callback();
        var loader = loadOptions(inputValue, callback);
        if (loader && typeof loader.then === 'function') {
          loader.then(callback, function () {
            return callback();
          });
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var _props = this.props,
            loadOptions = _props.loadOptions,
            props = objectWithoutProperties(_props, ['loadOptions']);
        var _state = this.state,
            defaultOptions = _state.defaultOptions,
            inputValue = _state.inputValue,
            isLoading = _state.isLoading,
            loadedInputValue = _state.loadedInputValue,
            loadedOptions = _state.loadedOptions,
            passEmptyOptions = _state.passEmptyOptions;

        var options = passEmptyOptions ? [] : inputValue && loadedInputValue ? loadedOptions : defaultOptions || [];
        return (
          // $FlowFixMe
          React.createElement(SelectComponent, _extends({}, props, {
            filterOption: this.props.filterOption || null,
            ref: function ref(_ref) {
              _this3.select = _ref;
            },
            options: options,
            isLoading: isLoading,
            onInputChange: this.handleInputChange
          }))
        );
      }
    }]);
    return Async;
  }(Component), _class.defaultProps = defaultProps$1, _temp;
};
var Async = makeAsyncSelect(manageState(Select));

var compareOption = function compareOption(inputValue, option) {
  var candidate = inputValue.toLowerCase();
  return option.value.toLowerCase() === candidate || option.label.toLowerCase() === candidate;
};

var builtins = {
  formatCreateLabel: function formatCreateLabel(inputValue) {
    return 'Create "' + inputValue + '"';
  },
  isValidNewOption: function isValidNewOption(inputValue, selectValue, selectOptions) {
    return !(!inputValue || selectValue.some(function (option) {
      return compareOption(inputValue, option);
    }) || selectOptions.some(function (option) {
      return compareOption(inputValue, option);
    }));
  },
  getNewOptionData: function getNewOptionData(inputValue, optionLabel) {
    return {
      label: optionLabel,
      value: inputValue,
      __isNew__: true
    };
  }
};

var defaultProps$2 = _extends({
  allowCreateWhileLoading: false,
  createOptionPosition: 'last'
}, builtins);

var makeCreatableSelect = function makeCreatableSelect(SelectComponent) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    inherits(Creatable, _Component);

    function Creatable(props) {
      classCallCheck(this, Creatable);

      var _this = possibleConstructorReturn(this, (Creatable.__proto__ || Object.getPrototypeOf(Creatable)).call(this, props));

      _this.onChange = function (newValue, actionMeta) {
        var _this$props = _this.props,
            getNewOptionData = _this$props.getNewOptionData,
            inputValue = _this$props.inputValue,
            isMulti = _this$props.isMulti,
            onChange = _this$props.onChange,
            onCreateOption = _this$props.onCreateOption,
            value = _this$props.value;

        if (actionMeta.action !== 'select-option') {
          return onChange(newValue, actionMeta);
        }
        var newOption = _this.state.newOption;

        var valueArray = Array.isArray(newValue) ? newValue : [newValue];

        if (valueArray[valueArray.length - 1] === newOption) {
          if (onCreateOption) onCreateOption(inputValue);else {
            var newOptionData = getNewOptionData(inputValue, inputValue);
            var newActionMeta = { action: 'create-option' };
            if (isMulti) {
              onChange([].concat(toConsumableArray(cleanValue(value)), [newOptionData]), newActionMeta);
            } else {
              onChange(newOptionData, newActionMeta);
            }
          }
          return;
        }
        onChange(newValue, actionMeta);
      };

      var options = props.options || [];
      _this.state = {
        newOption: undefined,
        options: options
      };
      return _this;
    }

    createClass(Creatable, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var allowCreateWhileLoading = nextProps.allowCreateWhileLoading,
            createOptionPosition = nextProps.createOptionPosition,
            formatCreateLabel = nextProps.formatCreateLabel,
            getNewOptionData = nextProps.getNewOptionData,
            inputValue = nextProps.inputValue,
            isLoading = nextProps.isLoading,
            isValidNewOption = nextProps.isValidNewOption,
            value = nextProps.value;

        var options = nextProps.options || [];
        var newOption = this.state.newOption;

        if (isValidNewOption(inputValue, cleanValue(value), options)) {
          newOption = getNewOptionData(inputValue, formatCreateLabel(inputValue));
        } else {
          newOption = undefined;
        }
        this.setState({
          newOption: newOption,
          options: (allowCreateWhileLoading || !isLoading) && newOption ? createOptionPosition === 'first' ? [newOption].concat(toConsumableArray(options)) : [].concat(toConsumableArray(options), [newOption]) : options
        });
      }
    }, {
      key: 'focus',
      value: function focus() {
        this.select.focus();
      }
    }, {
      key: 'blur',
      value: function blur() {
        this.select.blur();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var props = objectWithoutProperties(this.props, []);
        var options = this.state.options;

        return React.createElement(SelectComponent, _extends({}, props, {
          ref: function ref(_ref) {
            _this2.select = _ref;
          },
          options: options,
          onChange: this.onChange
        }));
      }
    }]);
    return Creatable;
  }(Component), _class.defaultProps = defaultProps$2, _temp;
};
var Creatable = manageState(makeCreatableSelect(Select));

var AsyncCreatable = makeAsyncSelect(manageState(makeCreatableSelect(Select)));

// ==============================
// Fade Transition
// ==============================

var Fade = function Fade(_ref) {
  var Tag = _ref.component,
      _ref$duration = _ref.duration,
      duration = _ref$duration === undefined ? 1 : _ref$duration,
      inProp = _ref.in,
      onExited = _ref.onExited,
      props = objectWithoutProperties(_ref, ['component', 'duration', 'in', 'onExited']);

  var transition = {
    entering: { opacity: 0 },
    entered: { opacity: 1, transition: 'opacity ' + duration + 'ms' },
    exiting: { opacity: 0 },
    exited: { opacity: 0 }
  };

  return React.createElement(
    Transition,
    { mountOnEnter: true, unmountOnExit: true, 'in': inProp, timeout: duration },
    function (state) {
      var innerProps = {
        style: _extends({}, transition[state])
      };
      return React.createElement(Tag, _extends({ innerProps: innerProps }, props));
    }
  );
};
var collapseDuration = 260;

// wrap each MultiValue with a collapse transition; decreases width until
// finally removing from DOM
var Collapse = function (_Component) {
  inherits(Collapse, _Component);

  function Collapse() {
    var _ref2;

    var _temp, _this, _ret;

    classCallCheck(this, Collapse);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref2 = Collapse.__proto__ || Object.getPrototypeOf(Collapse)).call.apply(_ref2, [this].concat(args))), _this), _this.duration = collapseDuration, _this.state = { width: 'auto' }, _this.transition = {
      exiting: { width: 0, transition: 'width ' + _this.duration + 'ms ease-out' },
      exited: { width: 0 }
    }, _this.getWidth = function (ref) {
      if (ref && isNaN(_this.state.width)) {
        // cannot use `offsetWidth` because it is rounded
        var _ref$getBoundingClien = ref.getBoundingClientRect(),
            _width = _ref$getBoundingClien.width;

        _this.setState({ width: _width });
      }
    }, _this.getStyle = function (width) {
      return {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: width
      };
    }, _this.getTransition = function (state) {
      return _this.transition[state];
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  // width must be calculated; cannot transition from `undefined` to `number`


  // get base styles


  // get transition styles


  createClass(Collapse, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          children = _props.children,
          inProp = _props.in;
      var width = this.state.width;


      return React.createElement(
        Transition,
        {
          enter: false,
          mountOnEnter: true,
          unmountOnExit: true,
          'in': inProp,
          timeout: this.duration
        },
        function (state) {
          var style = _extends({}, _this2.getStyle(width), _this2.getTransition(state));
          return React.createElement(
            'div',
            { ref: _this2.getWidth, style: style },
            children
          );
        }
      );
    }
  }]);
  return Collapse;
}(Component);

// strip transition props off before spreading onto select component
// note we need to be explicit about innerRef for flow
var AnimatedInput = function AnimatedInput(WrappedComponent) {
  return function (_ref) {
    var inProp = _ref.in,
        onExited = _ref.onExited,
        appear = _ref.appear,
        enter = _ref.enter,
        exit = _ref.exit,
        innerRef = _ref.innerRef,
        props = objectWithoutProperties(_ref, ['in', 'onExited', 'appear', 'enter', 'exit', 'innerRef']);
    return (
      // $FlowFixMe
      React.createElement(WrappedComponent, _extends({ innerRef: innerRef }, props))
    );
  };
};

// strip transition props off before spreading onto actual component


var AnimatedMultiValue = function AnimatedMultiValue(WrappedComponent) {
  return function (_ref) {
    var inProp = _ref.in,
        onExited = _ref.onExited,
        props = objectWithoutProperties(_ref, ['in', 'onExited']);
    return React.createElement(
      Collapse,
      { 'in': inProp, onExited: onExited },
      React.createElement(WrappedComponent, _extends({ cropWithEllipsis: inProp }, props))
    );
  };
};

// fade in when last multi-value removed, otherwise instant
var AnimatedPlaceholder = function AnimatedPlaceholder(WrappedComponent) {
  return function (props) {
    return React.createElement(Fade, _extends({
      component: WrappedComponent,
      duration: props.isMulti ? collapseDuration : 1
    }, props));
  };
};

// instant fade; all transition-group children must be transitions

var AnimatedSingleValue = function AnimatedSingleValue(WrappedComponent) {
  return function (props) {
    return React.createElement(Fade, _extends({ component: WrappedComponent }, props));
  };
};

// make ValueContainer a transition group
var AnimatedValueContainer = function AnimatedValueContainer(WrappedComponent) {
  return function (props) {
    return React.createElement(TransitionGroup, _extends({ component: WrappedComponent }, props));
  };
};

var makeAnimated = function makeAnimated(externalComponents) {
  var components$$1 = defaultComponents({ components: externalComponents });
  var Input = components$$1.Input,
      MultiValue = components$$1.MultiValue,
      Placeholder = components$$1.Placeholder,
      SingleValue = components$$1.SingleValue,
      ValueContainer = components$$1.ValueContainer,
      rest = objectWithoutProperties(components$$1, ['Input', 'MultiValue', 'Placeholder', 'SingleValue', 'ValueContainer']);

  return _extends({
    Input: AnimatedInput(Input),
    MultiValue: AnimatedMultiValue(MultiValue),
    Placeholder: AnimatedPlaceholder(Placeholder),
    SingleValue: AnimatedSingleValue(SingleValue),
    ValueContainer: AnimatedValueContainer(ValueContainer)
  }, rest);
};

var AnimatedComponents = makeAnimated();

var Input$1 = AnimatedComponents.Input;
var MultiValue$1 = AnimatedComponents.MultiValue;
var Placeholder$1 = AnimatedComponents.Placeholder;
var SingleValue$1 = AnimatedComponents.SingleValue;
var ValueContainer$1 = AnimatedComponents.ValueContainer;

var index = memoizeOne(makeAnimated, exportedEqual);

var index$1 = manageState(Select);

export default index$1;
export { Select as SelectBase, Async, AsyncCreatable, Creatable, createFilter, index as makeAnimated, components, mergeStyles, defaultTheme };

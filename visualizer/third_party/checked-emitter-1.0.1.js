(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CheckedEmitter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var fbemitter = {
  EventEmitter: require('./lib/BaseEventEmitter')
};

module.exports = fbemitter;

},{"./lib/BaseEventEmitter":2}],2:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule BaseEventEmitter
 * @typechecks
 */

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EmitterSubscription = require('./EmitterSubscription');
var EventSubscriptionVendor = require('./EventSubscriptionVendor');

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');

/**
 * @class BaseEventEmitter
 * @description
 * An EventEmitter is responsible for managing a set of listeners and publishing
 * events to them when it is told that such events happened. In addition to the
 * data for the given event it also sends a event control object which allows
 * the listeners/handlers to prevent the default behavior of the given event.
 *
 * The emitter is designed to be generic enough to support all the different
 * contexts in which one might want to emit events. It is a simple multicast
 * mechanism on top of which extra functionality can be composed. For example, a
 * more advanced emitter may use an EventHolder and EventFactory.
 */

var BaseEventEmitter = (function () {
  /**
   * @constructor
   */

  function BaseEventEmitter() {
    _classCallCheck(this, BaseEventEmitter);

    this._subscriber = new EventSubscriptionVendor();
    this._currentSubscription = null;
  }

  /**
   * Adds a listener to be invoked when events of the specified type are
   * emitted. An optional calling context may be provided. The data arguments
   * emitted will be passed to the listener function.
   *
   * TODO: Annotate the listener arg's type. This is tricky because listeners
   *       can be invoked with varargs.
   *
   * @param {string} eventType - Name of the event to listen to
   * @param {function} listener - Function to invoke when the specified event is
   *   emitted
   * @param {*} context - Optional context object to use when invoking the
   *   listener
   */

  BaseEventEmitter.prototype.addListener = function addListener(eventType, listener, context) {
    return this._subscriber.addSubscription(eventType, new EmitterSubscription(this._subscriber, listener, context));
  };

  /**
   * Similar to addListener, except that the listener is removed after it is
   * invoked once.
   *
   * @param {string} eventType - Name of the event to listen to
   * @param {function} listener - Function to invoke only once when the
   *   specified event is emitted
   * @param {*} context - Optional context object to use when invoking the
   *   listener
   */

  BaseEventEmitter.prototype.once = function once(eventType, listener, context) {
    var emitter = this;
    return this.addListener(eventType, function () {
      emitter.removeCurrentListener();
      listener.apply(context, arguments);
    });
  };

  /**
   * Removes all of the registered listeners, including those registered as
   * listener maps.
   *
   * @param {?string} eventType - Optional name of the event whose registered
   *   listeners to remove
   */

  BaseEventEmitter.prototype.removeAllListeners = function removeAllListeners(eventType) {
    this._subscriber.removeAllSubscriptions(eventType);
  };

  /**
   * Provides an API that can be called during an eventing cycle to remove the
   * last listener that was invoked. This allows a developer to provide an event
   * object that can remove the listener (or listener map) during the
   * invocation.
   *
   * If it is called when not inside of an emitting cycle it will throw.
   *
   * @throws {Error} When called not during an eventing cycle
   *
   * @example
   *   var subscription = emitter.addListenerMap({
   *     someEvent: function(data, event) {
   *       console.log(data);
   *       emitter.removeCurrentListener();
   *     }
   *   });
   *
   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
   *   emitter.emit('someEvent', 'def'); // does not log anything
   */

  BaseEventEmitter.prototype.removeCurrentListener = function removeCurrentListener() {
    !!!this._currentSubscription ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Not in an emitting cycle; there is no current subscription') : invariant(false) : undefined;
    this._subscriber.removeSubscription(this._currentSubscription);
  };

  /**
   * Returns an array of listeners that are currently registered for the given
   * event.
   *
   * @param {string} eventType - Name of the event to query
   * @return {array}
   */

  BaseEventEmitter.prototype.listeners = function listeners(eventType) /* TODO: Array<EventSubscription> */{
    var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
    return subscriptions ? subscriptions.filter(emptyFunction.thatReturnsTrue).map(function (subscription) {
      return subscription.listener;
    }) : [];
  };

  /**
   * Emits an event of the given type with the given data. All handlers of that
   * particular type will be notified.
   *
   * @param {string} eventType - Name of the event to emit
   * @param {*} Arbitrary arguments to be passed to each registered listener
   *
   * @example
   *   emitter.addListener('someEvent', function(message) {
   *     console.log(message);
   *   });
   *
   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
   */

  BaseEventEmitter.prototype.emit = function emit(eventType) {
    var subscriptions = this._subscriber.getSubscriptionsForType(eventType);
    if (subscriptions) {
      var keys = Object.keys(subscriptions);
      for (var ii = 0; ii < keys.length; ii++) {
        var key = keys[ii];
        var subscription = subscriptions[key];
        // The subscription may have been removed during this event loop.
        if (subscription) {
          this._currentSubscription = subscription;
          this.__emitToSubscription.apply(this, [subscription].concat(Array.prototype.slice.call(arguments)));
        }
      }
      this._currentSubscription = null;
    }
  };

  /**
   * Provides a hook to override how the emitter emits an event to a specific
   * subscription. This allows you to set up logging and error boundaries
   * specific to your environment.
   *
   * @param {EmitterSubscription} subscription
   * @param {string} eventType
   * @param {*} Arbitrary arguments to be passed to each registered listener
   */

  BaseEventEmitter.prototype.__emitToSubscription = function __emitToSubscription(subscription, eventType) {
    var args = Array.prototype.slice.call(arguments, 2);
    subscription.listener.apply(subscription.context, args);
  };

  return BaseEventEmitter;
})();

module.exports = BaseEventEmitter;
}).call(this,require('_process'))

},{"./EmitterSubscription":3,"./EventSubscriptionVendor":5,"_process":9,"fbjs/lib/emptyFunction":6,"fbjs/lib/invariant":7}],3:[function(require,module,exports){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 * 
 * @providesModule EmitterSubscription
 * @typechecks
 */

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventSubscription = require('./EventSubscription');

/**
 * EmitterSubscription represents a subscription with listener and context data.
 */

var EmitterSubscription = (function (_EventSubscription) {
  _inherits(EmitterSubscription, _EventSubscription);

  /**
   * @param {EventSubscriptionVendor} subscriber - The subscriber that controls
   *   this subscription
   * @param {function} listener - Function to invoke when the specified event is
   *   emitted
   * @param {*} context - Optional context object to use when invoking the
   *   listener
   */

  function EmitterSubscription(subscriber, listener, context) {
    _classCallCheck(this, EmitterSubscription);

    _EventSubscription.call(this, subscriber);
    this.listener = listener;
    this.context = context;
  }

  return EmitterSubscription;
})(EventSubscription);

module.exports = EmitterSubscription;
},{"./EventSubscription":4}],4:[function(require,module,exports){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventSubscription
 * @typechecks
 */

'use strict';

/**
 * EventSubscription represents a subscription to a particular event. It can
 * remove its own subscription.
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EventSubscription = (function () {

  /**
   * @param {EventSubscriptionVendor} subscriber the subscriber that controls
   *   this subscription.
   */

  function EventSubscription(subscriber) {
    _classCallCheck(this, EventSubscription);

    this.subscriber = subscriber;
  }

  /**
   * Removes this subscription from the subscriber that controls it.
   */

  EventSubscription.prototype.remove = function remove() {
    if (this.subscriber) {
      this.subscriber.removeSubscription(this);
      this.subscriber = null;
    }
  };

  return EventSubscription;
})();

module.exports = EventSubscription;
},{}],5:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 * 
 * @providesModule EventSubscriptionVendor
 * @typechecks
 */

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = require('fbjs/lib/invariant');

/**
 * EventSubscriptionVendor stores a set of EventSubscriptions that are
 * subscribed to a particular event type.
 */

var EventSubscriptionVendor = (function () {
  function EventSubscriptionVendor() {
    _classCallCheck(this, EventSubscriptionVendor);

    this._subscriptionsForType = {};
    this._currentSubscription = null;
  }

  /**
   * Adds a subscription keyed by an event type.
   *
   * @param {string} eventType
   * @param {EventSubscription} subscription
   */

  EventSubscriptionVendor.prototype.addSubscription = function addSubscription(eventType, subscription) {
    !(subscription.subscriber === this) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'The subscriber of the subscription is incorrectly set.') : invariant(false) : undefined;
    if (!this._subscriptionsForType[eventType]) {
      this._subscriptionsForType[eventType] = [];
    }
    var key = this._subscriptionsForType[eventType].length;
    this._subscriptionsForType[eventType].push(subscription);
    subscription.eventType = eventType;
    subscription.key = key;
    return subscription;
  };

  /**
   * Removes a bulk set of the subscriptions.
   *
   * @param {?string} eventType - Optional name of the event type whose
   *   registered supscriptions to remove, if null remove all subscriptions.
   */

  EventSubscriptionVendor.prototype.removeAllSubscriptions = function removeAllSubscriptions(eventType) {
    if (eventType === undefined) {
      this._subscriptionsForType = {};
    } else {
      delete this._subscriptionsForType[eventType];
    }
  };

  /**
   * Removes a specific subscription. Instead of calling this function, call
   * `subscription.remove()` directly.
   *
   * @param {object} subscription
   */

  EventSubscriptionVendor.prototype.removeSubscription = function removeSubscription(subscription) {
    var eventType = subscription.eventType;
    var key = subscription.key;

    var subscriptionsForType = this._subscriptionsForType[eventType];
    if (subscriptionsForType) {
      delete subscriptionsForType[key];
    }
  };

  /**
   * Returns the array of subscriptions that are currently registered for the
   * given event type.
   *
   * Note: This array can be potentially sparse as subscriptions are deleted
   * from it when they are removed.
   *
   * TODO: This returns a nullable array. wat?
   *
   * @param {string} eventType
   * @return {?array}
   */

  EventSubscriptionVendor.prototype.getSubscriptionsForType = function getSubscriptionsForType(eventType) {
    return this._subscriptionsForType[eventType];
  };

  return EventSubscriptionVendor;
})();

module.exports = EventSubscriptionVendor;
}).call(this,require('_process'))

},{"_process":9,"fbjs/lib/invariant":7}],6:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

"use strict";

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
function emptyFunction() {}

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],7:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

function invariant(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))

},{"_process":9}],8:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],9:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
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
    var timeout = setTimeout(cleanUpNextTick);
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
    clearTimeout(timeout);
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
        setTimeout(drainQueue, 0);
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],10:[function(require,module,exports){
// Copyright (c) 2016 Patrick Dubroy <pdubroy@gmail.com>
// This software is distributed under the terms of the MIT License.

'use strict';

var EventEmitter = require('fbemitter').EventEmitter;
var inherits = require('inherits');

var ArrayProto = Array.prototype;

// When set to true, skip checks in certain cases.
var relaxed = false;

// CheckedEmitter
// --------------

function CheckedEmitter() {
  EventEmitter.call(this);
  this._eventTypes = Object.create(null);
}
inherits(CheckedEmitter, EventEmitter);
var SUPER_PROTO = EventEmitter.prototype;

// Register a new event type `eventType`. The remaining arguments are
// descriptive names of the arguments that will be passed to the callback.
// E.g., `e.register('propchange', 'propName', 'oldValue', 'newValue')`.
CheckedEmitter.prototype.registerEvent = function(eventType /* ...args */) {
  if (eventType in this._eventTypes) {
    throw new Error(
        "Event type '" + eventType + "' has already been registered");
  }
  var params = ArrayProto.slice.call(arguments, 1);
  this._eventTypes[eventType] = {name: eventType, params: params};
};

// Shorthand for registering multiple events at once.
// `obj` is a map of event types to an Array of event parameters.
CheckedEmitter.prototype.registerEvents = function(obj) {
  var self = this;
  Object.keys(obj).forEach(function(name) {
    self.registerEvent.apply(self, [name].concat(obj[name]));
  });
};

// Return an Array of objects representing every event that has been
// registered on this emitter.
CheckedEmitter.prototype.events = function() {
  var self = this;
  return Object.keys(this._eventTypes).map(function(name) {
    return self._eventTypes[name];
  });
};

CheckedEmitter.prototype._checkEventType = function(type, optArrLike, what) {
  if (!(type in this._eventTypes)) {
    throw new TypeError("'" + type + "' is not a registered event type");
  }
  if (optArrLike) {
    var evt = this._eventTypes[type];
    if (evt.params.length !== optArrLike.length) {
      var message = 'Wrong ' + what + " for '" + type + "': " +
          'expected ' + evt.params.length + ', got ' + optArrLike.length;
      throw new TypeError(message);
    }
  }
};

// The methods below here are all identical to those on fbemitter, except they
// throw an error if `eventType` does not match a registered event.
// See https://github.com/facebook/emitter for more info.

CheckedEmitter.prototype.addListener = function(eventType, callback) {
  if (!relaxed) {
    this._checkEventType(eventType, callback, 'callback arity');
  }
  return SUPER_PROTO.addListener.apply(this, arguments);
};

CheckedEmitter.prototype.once = function(eventType, callback) {
  this._checkEventType(eventType, callback, 'callback arity');

  // The super `once` implementation calls addListener with a wrapped callback.
  // Relax the checks to avoid raising a spurious error.
  relaxed = true;
  var result = SUPER_PROTO.once.apply(this, arguments);
  relaxed = false;
  return result;
};

CheckedEmitter.prototype.removeAllListeners = function(optEventType) {
  if (optEventType) {
    this._checkEventType(optEventType);
  }
  return SUPER_PROTO.removeAllListeners.apply(this, arguments);
};

CheckedEmitter.prototype.listeners = function(eventType) {
  this._checkEventType(eventType);
  return SUPER_PROTO.listeners.apply(this, arguments);
};

CheckedEmitter.prototype.emit = function(eventType /* ...args */) {
  var args = ArrayProto.slice.call(arguments, 1);
  this._checkEventType(eventType, args, 'number of arguments');
  return SUPER_PROTO.emit.apply(this, arguments);
};

module.exports = CheckedEmitter;

},{"fbemitter":1,"inherits":8}]},{},[10])(10)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmJlbWl0dGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZiZW1pdHRlci9saWIvQmFzZUV2ZW50RW1pdHRlci5qcyIsIm5vZGVfbW9kdWxlcy9mYmVtaXR0ZXIvbGliL0VtaXR0ZXJTdWJzY3JpcHRpb24uanMiLCJub2RlX21vZHVsZXMvZmJlbWl0dGVyL2xpYi9FdmVudFN1YnNjcmlwdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mYmVtaXR0ZXIvbGliL0V2ZW50U3Vic2NyaXB0aW9uVmVuZG9yLmpzIiwibm9kZV9tb2R1bGVzL2ZianMvbGliL2VtcHR5RnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxudmFyIGZiZW1pdHRlciA9IHtcbiAgRXZlbnRFbWl0dGVyOiByZXF1aXJlKCcuL2xpYi9CYXNlRXZlbnRFbWl0dGVyJylcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZmJlbWl0dGVyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBCYXNlRXZlbnRFbWl0dGVyXG4gKiBAdHlwZWNoZWNrc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbnZhciBFbWl0dGVyU3Vic2NyaXB0aW9uID0gcmVxdWlyZSgnLi9FbWl0dGVyU3Vic2NyaXB0aW9uJyk7XG52YXIgRXZlbnRTdWJzY3JpcHRpb25WZW5kb3IgPSByZXF1aXJlKCcuL0V2ZW50U3Vic2NyaXB0aW9uVmVuZG9yJyk7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG4vKipcbiAqIEBjbGFzcyBCYXNlRXZlbnRFbWl0dGVyXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIEV2ZW50RW1pdHRlciBpcyByZXNwb25zaWJsZSBmb3IgbWFuYWdpbmcgYSBzZXQgb2YgbGlzdGVuZXJzIGFuZCBwdWJsaXNoaW5nXG4gKiBldmVudHMgdG8gdGhlbSB3aGVuIGl0IGlzIHRvbGQgdGhhdCBzdWNoIGV2ZW50cyBoYXBwZW5lZC4gSW4gYWRkaXRpb24gdG8gdGhlXG4gKiBkYXRhIGZvciB0aGUgZ2l2ZW4gZXZlbnQgaXQgYWxzbyBzZW5kcyBhIGV2ZW50IGNvbnRyb2wgb2JqZWN0IHdoaWNoIGFsbG93c1xuICogdGhlIGxpc3RlbmVycy9oYW5kbGVycyB0byBwcmV2ZW50IHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHRoZSBnaXZlbiBldmVudC5cbiAqXG4gKiBUaGUgZW1pdHRlciBpcyBkZXNpZ25lZCB0byBiZSBnZW5lcmljIGVub3VnaCB0byBzdXBwb3J0IGFsbCB0aGUgZGlmZmVyZW50XG4gKiBjb250ZXh0cyBpbiB3aGljaCBvbmUgbWlnaHQgd2FudCB0byBlbWl0IGV2ZW50cy4gSXQgaXMgYSBzaW1wbGUgbXVsdGljYXN0XG4gKiBtZWNoYW5pc20gb24gdG9wIG9mIHdoaWNoIGV4dHJhIGZ1bmN0aW9uYWxpdHkgY2FuIGJlIGNvbXBvc2VkLiBGb3IgZXhhbXBsZSwgYVxuICogbW9yZSBhZHZhbmNlZCBlbWl0dGVyIG1heSB1c2UgYW4gRXZlbnRIb2xkZXIgYW5kIEV2ZW50RmFjdG9yeS5cbiAqL1xuXG52YXIgQmFzZUV2ZW50RW1pdHRlciA9IChmdW5jdGlvbiAoKSB7XG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG5cbiAgZnVuY3Rpb24gQmFzZUV2ZW50RW1pdHRlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQmFzZUV2ZW50RW1pdHRlcik7XG5cbiAgICB0aGlzLl9zdWJzY3JpYmVyID0gbmV3IEV2ZW50U3Vic2NyaXB0aW9uVmVuZG9yKCk7XG4gICAgdGhpcy5fY3VycmVudFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRvIGJlIGludm9rZWQgd2hlbiBldmVudHMgb2YgdGhlIHNwZWNpZmllZCB0eXBlIGFyZVxuICAgKiBlbWl0dGVkLiBBbiBvcHRpb25hbCBjYWxsaW5nIGNvbnRleHQgbWF5IGJlIHByb3ZpZGVkLiBUaGUgZGF0YSBhcmd1bWVudHNcbiAgICogZW1pdHRlZCB3aWxsIGJlIHBhc3NlZCB0byB0aGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gICAqXG4gICAqIFRPRE86IEFubm90YXRlIHRoZSBsaXN0ZW5lciBhcmcncyB0eXBlLiBUaGlzIGlzIHRyaWNreSBiZWNhdXNlIGxpc3RlbmVyc1xuICAgKiAgICAgICBjYW4gYmUgaW52b2tlZCB3aXRoIHZhcmFyZ3MuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0byBsaXN0ZW4gdG9cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBGdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgc3BlY2lmaWVkIGV2ZW50IGlzXG4gICAqICAgZW1pdHRlZFxuICAgKiBAcGFyYW0geyp9IGNvbnRleHQgLSBPcHRpb25hbCBjb250ZXh0IG9iamVjdCB0byB1c2Ugd2hlbiBpbnZva2luZyB0aGVcbiAgICogICBsaXN0ZW5lclxuICAgKi9cblxuICBCYXNlRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5fc3Vic2NyaWJlci5hZGRTdWJzY3JpcHRpb24oZXZlbnRUeXBlLCBuZXcgRW1pdHRlclN1YnNjcmlwdGlvbih0aGlzLl9zdWJzY3JpYmVyLCBsaXN0ZW5lciwgY29udGV4dCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaW1pbGFyIHRvIGFkZExpc3RlbmVyLCBleGNlcHQgdGhhdCB0aGUgbGlzdGVuZXIgaXMgcmVtb3ZlZCBhZnRlciBpdCBpc1xuICAgKiBpbnZva2VkIG9uY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgLSBOYW1lIG9mIHRoZSBldmVudCB0byBsaXN0ZW4gdG9cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXIgLSBGdW5jdGlvbiB0byBpbnZva2Ugb25seSBvbmNlIHdoZW4gdGhlXG4gICAqICAgc3BlY2lmaWVkIGV2ZW50IGlzIGVtaXR0ZWRcbiAgICogQHBhcmFtIHsqfSBjb250ZXh0IC0gT3B0aW9uYWwgY29udGV4dCBvYmplY3QgdG8gdXNlIHdoZW4gaW52b2tpbmcgdGhlXG4gICAqICAgbGlzdGVuZXJcbiAgICovXG5cbiAgQmFzZUV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIG9uY2UoZXZlbnRUeXBlLCBsaXN0ZW5lciwgY29udGV4dCkge1xuICAgIHZhciBlbWl0dGVyID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5hZGRMaXN0ZW5lcihldmVudFR5cGUsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGVtaXR0ZXIucmVtb3ZlQ3VycmVudExpc3RlbmVyKCk7XG4gICAgICBsaXN0ZW5lci5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCBvZiB0aGUgcmVnaXN0ZXJlZCBsaXN0ZW5lcnMsIGluY2x1ZGluZyB0aG9zZSByZWdpc3RlcmVkIGFzXG4gICAqIGxpc3RlbmVyIG1hcHMuXG4gICAqXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gZXZlbnRUeXBlIC0gT3B0aW9uYWwgbmFtZSBvZiB0aGUgZXZlbnQgd2hvc2UgcmVnaXN0ZXJlZFxuICAgKiAgIGxpc3RlbmVycyB0byByZW1vdmVcbiAgICovXG5cbiAgQmFzZUV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50VHlwZSkge1xuICAgIHRoaXMuX3N1YnNjcmliZXIucmVtb3ZlQWxsU3Vic2NyaXB0aW9ucyhldmVudFR5cGUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhbiBBUEkgdGhhdCBjYW4gYmUgY2FsbGVkIGR1cmluZyBhbiBldmVudGluZyBjeWNsZSB0byByZW1vdmUgdGhlXG4gICAqIGxhc3QgbGlzdGVuZXIgdGhhdCB3YXMgaW52b2tlZC4gVGhpcyBhbGxvd3MgYSBkZXZlbG9wZXIgdG8gcHJvdmlkZSBhbiBldmVudFxuICAgKiBvYmplY3QgdGhhdCBjYW4gcmVtb3ZlIHRoZSBsaXN0ZW5lciAob3IgbGlzdGVuZXIgbWFwKSBkdXJpbmcgdGhlXG4gICAqIGludm9jYXRpb24uXG4gICAqXG4gICAqIElmIGl0IGlzIGNhbGxlZCB3aGVuIG5vdCBpbnNpZGUgb2YgYW4gZW1pdHRpbmcgY3ljbGUgaXQgd2lsbCB0aHJvdy5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IFdoZW4gY2FsbGVkIG5vdCBkdXJpbmcgYW4gZXZlbnRpbmcgY3ljbGVcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogICB2YXIgc3Vic2NyaXB0aW9uID0gZW1pdHRlci5hZGRMaXN0ZW5lck1hcCh7XG4gICAqICAgICBzb21lRXZlbnQ6IGZ1bmN0aW9uKGRhdGEsIGV2ZW50KSB7XG4gICAqICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgKiAgICAgICBlbWl0dGVyLnJlbW92ZUN1cnJlbnRMaXN0ZW5lcigpO1xuICAgKiAgICAgfVxuICAgKiAgIH0pO1xuICAgKlxuICAgKiAgIGVtaXR0ZXIuZW1pdCgnc29tZUV2ZW50JywgJ2FiYycpOyAvLyBsb2dzICdhYmMnXG4gICAqICAgZW1pdHRlci5lbWl0KCdzb21lRXZlbnQnLCAnZGVmJyk7IC8vIGRvZXMgbm90IGxvZyBhbnl0aGluZ1xuICAgKi9cblxuICBCYXNlRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVDdXJyZW50TGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVDdXJyZW50TGlzdGVuZXIoKSB7XG4gICAgISEhdGhpcy5fY3VycmVudFN1YnNjcmlwdGlvbiA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdOb3QgaW4gYW4gZW1pdHRpbmcgY3ljbGU7IHRoZXJlIGlzIG5vIGN1cnJlbnQgc3Vic2NyaXB0aW9uJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIHRoaXMuX3N1YnNjcmliZXIucmVtb3ZlU3Vic2NyaXB0aW9uKHRoaXMuX2N1cnJlbnRTdWJzY3JpcHRpb24pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0aGF0IGFyZSBjdXJyZW50bHkgcmVnaXN0ZXJlZCBmb3IgdGhlIGdpdmVuXG4gICAqIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIC0gTmFtZSBvZiB0aGUgZXZlbnQgdG8gcXVlcnlcbiAgICogQHJldHVybiB7YXJyYXl9XG4gICAqL1xuXG4gIEJhc2VFdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyhldmVudFR5cGUpIC8qIFRPRE86IEFycmF5PEV2ZW50U3Vic2NyaXB0aW9uPiAqL3tcbiAgICB2YXIgc3Vic2NyaXB0aW9ucyA9IHRoaXMuX3N1YnNjcmliZXIuZ2V0U3Vic2NyaXB0aW9uc0ZvclR5cGUoZXZlbnRUeXBlKTtcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9ucyA/IHN1YnNjcmlwdGlvbnMuZmlsdGVyKGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlKS5tYXAoZnVuY3Rpb24gKHN1YnNjcmlwdGlvbikge1xuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbi5saXN0ZW5lcjtcbiAgICB9KSA6IFtdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBldmVudCBvZiB0aGUgZ2l2ZW4gdHlwZSB3aXRoIHRoZSBnaXZlbiBkYXRhLiBBbGwgaGFuZGxlcnMgb2YgdGhhdFxuICAgKiBwYXJ0aWN1bGFyIHR5cGUgd2lsbCBiZSBub3RpZmllZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSAtIE5hbWUgb2YgdGhlIGV2ZW50IHRvIGVtaXRcbiAgICogQHBhcmFtIHsqfSBBcmJpdHJhcnkgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byBlYWNoIHJlZ2lzdGVyZWQgbGlzdGVuZXJcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogICBlbWl0dGVyLmFkZExpc3RlbmVyKCdzb21lRXZlbnQnLCBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAqICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICogICB9KTtcbiAgICpcbiAgICogICBlbWl0dGVyLmVtaXQoJ3NvbWVFdmVudCcsICdhYmMnKTsgLy8gbG9ncyAnYWJjJ1xuICAgKi9cblxuICBCYXNlRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdChldmVudFR5cGUpIHtcbiAgICB2YXIgc3Vic2NyaXB0aW9ucyA9IHRoaXMuX3N1YnNjcmliZXIuZ2V0U3Vic2NyaXB0aW9uc0ZvclR5cGUoZXZlbnRUeXBlKTtcbiAgICBpZiAoc3Vic2NyaXB0aW9ucykge1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKTtcbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBrZXlzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tpaV07XG4gICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBzdWJzY3JpcHRpb25zW2tleV07XG4gICAgICAgIC8vIFRoZSBzdWJzY3JpcHRpb24gbWF5IGhhdmUgYmVlbiByZW1vdmVkIGR1cmluZyB0aGlzIGV2ZW50IGxvb3AuXG4gICAgICAgIGlmIChzdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50U3Vic2NyaXB0aW9uID0gc3Vic2NyaXB0aW9uO1xuICAgICAgICAgIHRoaXMuX19lbWl0VG9TdWJzY3JpcHRpb24uYXBwbHkodGhpcywgW3N1YnNjcmlwdGlvbl0uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5fY3VycmVudFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIGhvb2sgdG8gb3ZlcnJpZGUgaG93IHRoZSBlbWl0dGVyIGVtaXRzIGFuIGV2ZW50IHRvIGEgc3BlY2lmaWNcbiAgICogc3Vic2NyaXB0aW9uLiBUaGlzIGFsbG93cyB5b3UgdG8gc2V0IHVwIGxvZ2dpbmcgYW5kIGVycm9yIGJvdW5kYXJpZXNcbiAgICogc3BlY2lmaWMgdG8geW91ciBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFbWl0dGVyU3Vic2NyaXB0aW9ufSBzdWJzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZVxuICAgKiBAcGFyYW0geyp9IEFyYml0cmFyeSBhcmd1bWVudHMgdG8gYmUgcGFzc2VkIHRvIGVhY2ggcmVnaXN0ZXJlZCBsaXN0ZW5lclxuICAgKi9cblxuICBCYXNlRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fX2VtaXRUb1N1YnNjcmlwdGlvbiA9IGZ1bmN0aW9uIF9fZW1pdFRvU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbiwgZXZlbnRUeXBlKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHN1YnNjcmlwdGlvbi5saXN0ZW5lci5hcHBseShzdWJzY3JpcHRpb24uY29udGV4dCwgYXJncyk7XG4gIH07XG5cbiAgcmV0dXJuIEJhc2VFdmVudEVtaXR0ZXI7XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VFdmVudEVtaXR0ZXI7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICogXG4gKiBAcHJvdmlkZXNNb2R1bGUgRW1pdHRlclN1YnNjcmlwdGlvblxuICogQHR5cGVjaGVja3NcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgRXZlbnRTdWJzY3JpcHRpb24gPSByZXF1aXJlKCcuL0V2ZW50U3Vic2NyaXB0aW9uJyk7XG5cbi8qKlxuICogRW1pdHRlclN1YnNjcmlwdGlvbiByZXByZXNlbnRzIGEgc3Vic2NyaXB0aW9uIHdpdGggbGlzdGVuZXIgYW5kIGNvbnRleHQgZGF0YS5cbiAqL1xuXG52YXIgRW1pdHRlclN1YnNjcmlwdGlvbiA9IChmdW5jdGlvbiAoX0V2ZW50U3Vic2NyaXB0aW9uKSB7XG4gIF9pbmhlcml0cyhFbWl0dGVyU3Vic2NyaXB0aW9uLCBfRXZlbnRTdWJzY3JpcHRpb24pO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0V2ZW50U3Vic2NyaXB0aW9uVmVuZG9yfSBzdWJzY3JpYmVyIC0gVGhlIHN1YnNjcmliZXIgdGhhdCBjb250cm9sc1xuICAgKiAgIHRoaXMgc3Vic2NyaXB0aW9uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gRnVuY3Rpb24gdG8gaW52b2tlIHdoZW4gdGhlIHNwZWNpZmllZCBldmVudCBpc1xuICAgKiAgIGVtaXR0ZWRcbiAgICogQHBhcmFtIHsqfSBjb250ZXh0IC0gT3B0aW9uYWwgY29udGV4dCBvYmplY3QgdG8gdXNlIHdoZW4gaW52b2tpbmcgdGhlXG4gICAqICAgbGlzdGVuZXJcbiAgICovXG5cbiAgZnVuY3Rpb24gRW1pdHRlclN1YnNjcmlwdGlvbihzdWJzY3JpYmVyLCBsaXN0ZW5lciwgY29udGV4dCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBFbWl0dGVyU3Vic2NyaXB0aW9uKTtcblxuICAgIF9FdmVudFN1YnNjcmlwdGlvbi5jYWxsKHRoaXMsIHN1YnNjcmliZXIpO1xuICAgIHRoaXMubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB9XG5cbiAgcmV0dXJuIEVtaXR0ZXJTdWJzY3JpcHRpb247XG59KShFdmVudFN1YnNjcmlwdGlvbik7XG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlclN1YnNjcmlwdGlvbjsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIEV2ZW50U3Vic2NyaXB0aW9uXG4gKiBAdHlwZWNoZWNrc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBFdmVudFN1YnNjcmlwdGlvbiByZXByZXNlbnRzIGEgc3Vic2NyaXB0aW9uIHRvIGEgcGFydGljdWxhciBldmVudC4gSXQgY2FuXG4gKiByZW1vdmUgaXRzIG93biBzdWJzY3JpcHRpb24uXG4gKi9cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbnZhciBFdmVudFN1YnNjcmlwdGlvbiA9IChmdW5jdGlvbiAoKSB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnRTdWJzY3JpcHRpb25WZW5kb3J9IHN1YnNjcmliZXIgdGhlIHN1YnNjcmliZXIgdGhhdCBjb250cm9sc1xuICAgKiAgIHRoaXMgc3Vic2NyaXB0aW9uLlxuICAgKi9cblxuICBmdW5jdGlvbiBFdmVudFN1YnNjcmlwdGlvbihzdWJzY3JpYmVyKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEV2ZW50U3Vic2NyaXB0aW9uKTtcblxuICAgIHRoaXMuc3Vic2NyaWJlciA9IHN1YnNjcmliZXI7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGlzIHN1YnNjcmlwdGlvbiBmcm9tIHRoZSBzdWJzY3JpYmVyIHRoYXQgY29udHJvbHMgaXQuXG4gICAqL1xuXG4gIEV2ZW50U3Vic2NyaXB0aW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaWJlcikge1xuICAgICAgdGhpcy5zdWJzY3JpYmVyLnJlbW92ZVN1YnNjcmlwdGlvbih0aGlzKTtcbiAgICAgIHRoaXMuc3Vic2NyaWJlciA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBFdmVudFN1YnNjcmlwdGlvbjtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRTdWJzY3JpcHRpb247IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICogXG4gKiBAcHJvdmlkZXNNb2R1bGUgRXZlbnRTdWJzY3JpcHRpb25WZW5kb3JcbiAqIEB0eXBlY2hlY2tzXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG4vKipcbiAqIEV2ZW50U3Vic2NyaXB0aW9uVmVuZG9yIHN0b3JlcyBhIHNldCBvZiBFdmVudFN1YnNjcmlwdGlvbnMgdGhhdCBhcmVcbiAqIHN1YnNjcmliZWQgdG8gYSBwYXJ0aWN1bGFyIGV2ZW50IHR5cGUuXG4gKi9cblxudmFyIEV2ZW50U3Vic2NyaXB0aW9uVmVuZG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRXZlbnRTdWJzY3JpcHRpb25WZW5kb3IoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEV2ZW50U3Vic2NyaXB0aW9uVmVuZG9yKTtcblxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnNGb3JUeXBlID0ge307XG4gICAgdGhpcy5fY3VycmVudFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHN1YnNjcmlwdGlvbiBrZXllZCBieSBhbiBldmVudCB0eXBlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlXG4gICAqIEBwYXJhbSB7RXZlbnRTdWJzY3JpcHRpb259IHN1YnNjcmlwdGlvblxuICAgKi9cblxuICBFdmVudFN1YnNjcmlwdGlvblZlbmRvci5wcm90b3R5cGUuYWRkU3Vic2NyaXB0aW9uID0gZnVuY3Rpb24gYWRkU3Vic2NyaXB0aW9uKGV2ZW50VHlwZSwgc3Vic2NyaXB0aW9uKSB7XG4gICAgIShzdWJzY3JpcHRpb24uc3Vic2NyaWJlciA9PT0gdGhpcykgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnVGhlIHN1YnNjcmliZXIgb2YgdGhlIHN1YnNjcmlwdGlvbiBpcyBpbmNvcnJlY3RseSBzZXQuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIGlmICghdGhpcy5fc3Vic2NyaXB0aW9uc0ZvclR5cGVbZXZlbnRUeXBlXSkge1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uc0ZvclR5cGVbZXZlbnRUeXBlXSA9IFtdO1xuICAgIH1cbiAgICB2YXIga2V5ID0gdGhpcy5fc3Vic2NyaXB0aW9uc0ZvclR5cGVbZXZlbnRUeXBlXS5sZW5ndGg7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uc0ZvclR5cGVbZXZlbnRUeXBlXS5wdXNoKHN1YnNjcmlwdGlvbik7XG4gICAgc3Vic2NyaXB0aW9uLmV2ZW50VHlwZSA9IGV2ZW50VHlwZTtcbiAgICBzdWJzY3JpcHRpb24ua2V5ID0ga2V5O1xuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBidWxrIHNldCBvZiB0aGUgc3Vic2NyaXB0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHs/c3RyaW5nfSBldmVudFR5cGUgLSBPcHRpb25hbCBuYW1lIG9mIHRoZSBldmVudCB0eXBlIHdob3NlXG4gICAqICAgcmVnaXN0ZXJlZCBzdXBzY3JpcHRpb25zIHRvIHJlbW92ZSwgaWYgbnVsbCByZW1vdmUgYWxsIHN1YnNjcmlwdGlvbnMuXG4gICAqL1xuXG4gIEV2ZW50U3Vic2NyaXB0aW9uVmVuZG9yLnByb3RvdHlwZS5yZW1vdmVBbGxTdWJzY3JpcHRpb25zID0gZnVuY3Rpb24gcmVtb3ZlQWxsU3Vic2NyaXB0aW9ucyhldmVudFR5cGUpIHtcbiAgICBpZiAoZXZlbnRUeXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnNGb3JUeXBlID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zdWJzY3JpcHRpb25zRm9yVHlwZVtldmVudFR5cGVdO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHNwZWNpZmljIHN1YnNjcmlwdGlvbi4gSW5zdGVhZCBvZiBjYWxsaW5nIHRoaXMgZnVuY3Rpb24sIGNhbGxcbiAgICogYHN1YnNjcmlwdGlvbi5yZW1vdmUoKWAgZGlyZWN0bHkuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzdWJzY3JpcHRpb25cbiAgICovXG5cbiAgRXZlbnRTdWJzY3JpcHRpb25WZW5kb3IucHJvdG90eXBlLnJlbW92ZVN1YnNjcmlwdGlvbiA9IGZ1bmN0aW9uIHJlbW92ZVN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb24pIHtcbiAgICB2YXIgZXZlbnRUeXBlID0gc3Vic2NyaXB0aW9uLmV2ZW50VHlwZTtcbiAgICB2YXIga2V5ID0gc3Vic2NyaXB0aW9uLmtleTtcblxuICAgIHZhciBzdWJzY3JpcHRpb25zRm9yVHlwZSA9IHRoaXMuX3N1YnNjcmlwdGlvbnNGb3JUeXBlW2V2ZW50VHlwZV07XG4gICAgaWYgKHN1YnNjcmlwdGlvbnNGb3JUeXBlKSB7XG4gICAgICBkZWxldGUgc3Vic2NyaXB0aW9uc0ZvclR5cGVba2V5XTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFycmF5IG9mIHN1YnNjcmlwdGlvbnMgdGhhdCBhcmUgY3VycmVudGx5IHJlZ2lzdGVyZWQgZm9yIHRoZVxuICAgKiBnaXZlbiBldmVudCB0eXBlLlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIGFycmF5IGNhbiBiZSBwb3RlbnRpYWxseSBzcGFyc2UgYXMgc3Vic2NyaXB0aW9ucyBhcmUgZGVsZXRlZFxuICAgKiBmcm9tIGl0IHdoZW4gdGhleSBhcmUgcmVtb3ZlZC5cbiAgICpcbiAgICogVE9ETzogVGhpcyByZXR1cm5zIGEgbnVsbGFibGUgYXJyYXkuIHdhdD9cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZVxuICAgKiBAcmV0dXJuIHs/YXJyYXl9XG4gICAqL1xuXG4gIEV2ZW50U3Vic2NyaXB0aW9uVmVuZG9yLnByb3RvdHlwZS5nZXRTdWJzY3JpcHRpb25zRm9yVHlwZSA9IGZ1bmN0aW9uIGdldFN1YnNjcmlwdGlvbnNGb3JUeXBlKGV2ZW50VHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9zdWJzY3JpcHRpb25zRm9yVHlwZVtldmVudFR5cGVdO1xuICB9O1xuXG4gIHJldHVybiBFdmVudFN1YnNjcmlwdGlvblZlbmRvcjtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRTdWJzY3JpcHRpb25WZW5kb3I7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBtYWtlRW1wdHlGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gYWNjZXB0cyBhbmQgZGlzY2FyZHMgaW5wdXRzOyBpdCBoYXMgbm8gc2lkZSBlZmZlY3RzLiBUaGlzIGlzXG4gKiBwcmltYXJpbHkgdXNlZnVsIGlkaW9tYXRpY2FsbHkgZm9yIG92ZXJyaWRhYmxlIGZ1bmN0aW9uIGVuZHBvaW50cyB3aGljaFxuICogYWx3YXlzIG5lZWQgdG8gYmUgY2FsbGFibGUsIHNpbmNlIEpTIGxhY2tzIGEgbnVsbC1jYWxsIGlkaW9tIGFsYSBDb2NvYS5cbiAqL1xuZnVuY3Rpb24gZW1wdHlGdW5jdGlvbigpIHt9XG5cbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMgPSBtYWtlRW1wdHlGdW5jdGlvbjtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNGYWxzZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKGZhbHNlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUcnVlID0gbWFrZUVtcHR5RnVuY3Rpb24odHJ1ZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCA9IG1ha2VFbXB0eUZ1bmN0aW9uKG51bGwpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RoaXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgcmV0dXJuIGFyZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlGdW5jdGlvbjsiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICsgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSkpO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7IiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiJdfQ==

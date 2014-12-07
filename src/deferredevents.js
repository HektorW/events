/**
 * DeferredEvents
 *
 * @author HektorW
 * @mail hektorw@gmail.com
 */

/* global define:true */

(function(factory) {
  if (typeof define !== 'undefined' && define.amd) {
    define(['jquery'], factory);
  } else {
    window.DeferredEvents = factory(window.$);
  }
}(function($) {
  'use strict';


  function Data() {
    this.cache = {};
    this.expando = 'defferedevents' + Math.random();
  }
  Data.uid = 1;

  Data.prototype = {
    key: function(owner) {
      var unlock = owner[this.expando];

      if (!unlock) {
        unlock = Data.uid++;

        try {
          Object.defineProperties(owner, {
            value: unlock
          });
        } catch (e) {
          owner[this.expando] = unlock;
        }
      }

      if (!this.cache[unlock]) {
        this.cache[unlock] = {};
      }

      return unlock;
    },
    set: function(owner, name, value) {
      var unlock = this.key(owner),
        cache = this.cache[unlock];

      cache[name] = value;

      return cache;
    },
    get: function(owner, key) {
      var cache = this.cache[this.key(owner)];

      return key === undefined ?
        cache : cache[key];
    },
    remove: function(owner, key) {
      var i, name,
        unlock = this.key(owner),
        cache = this.cache[unlock];

      if (key === undefined) {
        this.cache[unlock] = {};
      } else {
        name = key.split(' ');

        i = name.length;
        while (i--) {
          delete cache[name[i]];
        }
      }
    }
  };



  var slice = Array.prototype.slice;


  var _timeoutID = null,
      _batchTime = 30,
      _eventQueue = [];

  var _data = new Data();

  function _addEventToQueue(obj, event, args, promise) {
    _eventQueue.push({
      obj: obj,
      event: event,
      args: args,
      index: 0,
      promise: promise
    });

    _batchEvents();
  }

  function _batchEvents() {
    if (!_canBatch()) {
      return;
    }

    while (_eventQueue.length) {
      var queueData = _eventQueue.shift();
      if (queueData) {
        var obj = queueData.obj,
            event = queueData.event,
            args = queueData.args,
            index = queueData.index;

        var eventData = _data.get(obj, event);

        var len = eventData && eventData.length || 0,
            start = _now();

        for (; index < len && _now() - start < _batchTime; index++) {
          var callback = eventData[index].callback;
          var context = eventData[index].context;
          callback.apply(context, args);
        }

        if (index < len) {
          queueData.index = index;
          _eventQueue.unshift(queueData);
          break;
        }

        queueData.promise.resolve();
      }
    }

    if (_eventQueue.length) {
      _scheduleBatch();
    }
  }

  function _timeoutCallback() {
    _timeoutID = null;
    _batchEvents();
  }

  function _scheduleBatch() {
    if (!_timeoutID) {
      _timeoutID = window.setTimeout(_timeoutCallback, 0);
    }
  }

  function _canBatch() {
    return (_timeoutID === null);
  }

  function _now() {
    return (new Date()).getTime();
  }


  function _isDOM(obj) {
    if (obj === window || obj === document) return true;
    if (typeof HTMLElement !== 'undefined') {
      return obj instanceof HTMLElement;
    }
  }





  var DeferredEvents = {
    addListener: function(obj, event, callback, context) {
      if (_isDOM(obj) || obj instanceof $) {
        return $(obj).on(event, $.proxy(callback, context));
      }

      var eventData = _data.get(obj, event);
      if (!eventData) {
        eventData = _data.set(obj, event, [])[event];
      }

      eventData.push({
        callback: callback,
        context: context
      });
    },

    removeListener: function(obj, event, callback, context) {
      var eventData = _data.get(obj, event);
      if (eventData) {
        if (!callback) {
          eventData.length = 0;
          return;
        }

        for (var i = 0; i < eventData.length; i++) {
          var data = eventData[i];
          if (callback === data.callback && (!context || context === data.context)) {
            eventData.splice(i--, 1);
          }
        }
      }
    },

    triggerEvent: function(obj, event) {
      var args = slice.call(arguments, 2);
      var promise = $.Deferred();

      if (_isDOM(obj)) {
        $.fn.trigger.apply($(obj), [event].concat(args));
        promise.resolve();
      } else {
        _addEventToQueue(obj, event, args, promise);
      }


      return promise;
    }
  };


  return DeferredEvents;
}));
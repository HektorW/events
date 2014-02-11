/**
 * Events
 * 
 * @author HektorW
 * @mail hektorw@gmail.com
 */

/* global define */

(function (factory) {
  if(typeof define !== 'undefined' && define.amd) {
    define([], factory);
  } else if (typeof exports !== 'undefined') {

  } else {
    window.Events = factory();
  }
}(function() {
  'use strict';

  var slice = Array.prototype.slice;

  var Events = {

    // listen to an event
    on: function(event, callback, context /* opt */) {
      if(!event || typeof callback !== 'function')
        throw "event type and callback of type function is required arguments";

      this._events || (this._events = {});
      (this._events[event] || (this._events[event] = [])).unshift({ // insert in reverse order
        callback: callback,
        _ctx: context, // private ctx, used in off method for comparison
        ctx: context || this
      });
      return this;
    },

    off: function(event, callback, ctx) {
      var key, i, ev, data, _cb, _ctx, events;

      if(!event && !callback && !ctx) {
        this._events = {};
        return this;
      }

      // if no event supplied we iterate over all
      events = event ? [this._events[event]] : this._events;

      for(key in events) {
        if(!events.hasOwnProperty(key))
          continue;

        ev = events[key];

        if(!callback && !ctx){
          // reset events array if only event was supplied
          ev.length = 0;
        }

        for(i = ev.length; i--; ) {
          data = ev[i];
          _cb = data.callback === callback;
          _ctx = data._ctx && data._ctx === ctx;
          if ((_cb && _ctx) || (!callback && _ctx) || (!ctx && _cb)) {
            ev.splice(i,1);
          }
        }
      }

      return this;
    },

    trigger: function(event) {
      if(!this._events) return this;
      var args = slice.call(arguments, 1);
      var events = this._events[event];
      if(events) _triggerEvents(events, args);
      return this;
    }
  };

  function _triggerEvents(events, args) {
    var ev, i;
    for(i = events.length ; i--; ) {
      (ev = events[i]).callback.apply(ev.ctx, args);
    }
  }

  return Events;
}));
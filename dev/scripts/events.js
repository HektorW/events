/**
 * Events
 * 
 * @author HektorW
 * @mail hektorw@gmail.com
 */

(function (factory) {
  if(typeof define !== 'undefined' && define.amd) {
    define([], factory);
  } else if (typeof exports !== 'undefined') {

  } else {
    window.Events = factory();
  }
}(function() {

  // listening to all
  // 
  // function: off
  // function: once


  var slice = Array.prototype.slice;

  var Events = {
    on: function(event, callback, context) {
      this._events || (this._events = {});
      (this._events[event] || (this._events[event] = [])).unshift({ // insert in reverse order
        callback: callback,
        ctx: context || this
      });
      return this;
    },

    off: function() { return this; },

    trigger: function(event) {
      if(!this._events) return this;
      var args = slice.call(arguments, 1);
      var events = this._events[event];
      if(events) _triggerEvents(events, args);
      return this;
    }
  };

  function _triggerEvents(events, args) {
    var ev, i = events.length;
    for( ; i--; ) {
      (ev = events[i]).callback.apply(ev.ctx, arguments);
    }
  }

  return Events;
}));
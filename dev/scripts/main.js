/* global console */

require([
  'events'
], function(Events) {
  
  function extend(dest, source) {
    for(var key in source) {
      dest[key] = source[key];
    }
  }


  var obj = window.obj = {
    toString: function() {return '"obj"';}
  };

  extend(obj, Events);

  var log = function(ev) {
    return function() {
      console.log(ev + ', ctx:' + this + ', args' + arguments);
    };
  };

  obj.on('foo', log('foo'));
  obj.on('bar', log('bar'));

  obj.trigger('foo');
  obj.trigger('foo');
  obj.trigger('bar');

  obj.off('foo', function() {});

  obj.trigger('foo');


  obj.once('baz', log('baz'));

  obj.trigger('baz');
  obj.trigger('baz');
  obj.trigger('baz');
});


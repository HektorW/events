
require([
  'events'
], function(Events) {
  
  function extend(dest, source) {
    for(var key in source) {
      dest[key] = source[key];
    }
  }


  window.obj = {
    toString: function() {return '"obj"';}
  };

  extend(obj, Events);

  var log = function(ev) {
    return function() {
      console.log(ev + ', ctx:' + this + ', args' + arguments);
    }
  }

  obj.on('ev', log('ev'));

});


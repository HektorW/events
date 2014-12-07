/* global console, requirejs */

requirejs.config({
	paths: {
		'jquery': '../bower_components/jquery/dist/jquery'
	}
});

require([
	'events',
	'deferredevents'
], function(Events, DeferredEvents) {

	function extend(dest, source) {
		for (var key in source) {
			dest[key] = source[key];
		}
	}


	var obj = window.obj = {
		toString: function() {
			return '"obj"';
		}
	};

	extend(obj, Events);

	function log(ev) {
		return function() {
			console.log(ev + ', ctx:' + this + ', args' + arguments);
		};
	}

	obj.on('foo', log('foo'));
	obj.on('bar', log('bar'));

	obj.trigger('foo');
	obj.trigger('foo');
	obj.trigger('bar');

	obj.off('foo', function() {});
	obj.trigger('foo');

	obj.off('foo');
	obj.trigger('foo');


	obj.once('baz', log('baz'));

	obj.trigger('baz');
	obj.trigger('baz');
	obj.trigger('baz');


	console.log('DeferredEvents');


	function wait(ms, msg) {
		var t = function() { return new Date()-0; };
		return function() {
			var s = t();
			while (t() - s < ms)
				;
			console.log('waited for ' +( t() - s) + 'ms', msg || '', [].slice.call(arguments,0).join());
		};
	}


	DeferredEvents.addListener(obj, 'foo', log('foo'));
	DeferredEvents.addListener(obj, 'bar', log('bar'));

	DeferredEvents.triggerEvent(obj, 'foo');
	DeferredEvents.triggerEvent(obj, 'foo', 'arg2', 'arg3');
	DeferredEvents.triggerEvent(obj, 'bar');


	DeferredEvents.addListener($('button'), 'click', log('jquery - buttonclick'));
	DeferredEvents.addListener($('button')[0], 'click', log('element - buttonclick'));


	DeferredEvents.removeListener(obj, 'foo', function() {});
	DeferredEvents.triggerEvent(obj, 'foo');

	DeferredEvents.removeListener(obj, 'foo');
	DeferredEvents.triggerEvent(obj, 'foo');


	for (var i = 0; i < 50; i++) {
		DeferredEvents.addListener(obj, 'wait16', wait(16, 'wait(16)'));
	}
	for (i = 0; i < 50; i++) {
		DeferredEvents.addListener(obj, 'wait5', wait(5, 'wait(5)'));
	}
	for (i = 0; i < 10; i++) {
		DeferredEvents.addListener(obj, 'wait50', wait(50, 'wait(50)'));
	}
	for (i = 0; i < 10; i++) {
		DeferredEvents.addListener(obj, 'wait500', wait(500, 'wait(500)'));
	}

	DeferredEvents.addListener($('button'), 'click', function() {
		DeferredEvents.triggerEvent.apply(DeferredEvents, [obj, 'wait16'].concat([].slice.call(arguments, 0)));
	});

	// DeferredEvents.triggerEvent(obj, 'wait16');
	// DeferredEvents.triggerEvent(obj, 'bar');
	// DeferredEvents.triggerEvent(obj, 'wait5');
	// DeferredEvents.triggerEvent(obj, 'wait500');
	// DeferredEvents.triggerEvent(obj, 'wait50');
	// DeferredEvents.triggerEvent(obj, 'wait16');
});
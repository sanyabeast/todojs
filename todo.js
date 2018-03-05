"use strict";
define(function(){

	var todo;

	var Todo = function(/*bool*/oneInstance){
		if (todo instanceof Todo && oneInstance === true){
			return todo;
		}

		this.schedule = {};
	};

	Todo.prototype = {
		onTaskAdded : null,
		onTaskRemoved : null,
		onTaskUpdated : null,
		constr : Todo,
		timeGetter : null,
		now : function(){
			if (this.timeGetter){
				return this.timeGetter();
			} else {
				return +new Date();
			}
		},
		in : function(value){
			return Date.now() + value;
		},
		nextTime : function(divider, now){
			now = now || this.now();
			return Math.ceil((now + 1) / divider) * divider;

		},
		minutes : function(value){
			return value * 60 * 1000;
		},
		seconds : function(value){
			return value * 1000;
		},
		hours : function(value){
			return value * 60 * 60 * 1000;
		},
		days : function(value){
			return value * 24 * 60 * 60 * 1000;
		},
		add : function(/*str*/name, /*str*/date, /*func*/callback, /*obj || undef*/options){
			var _this = this;
			var timeout = +new Date(date) - this.now();

			if (timeout < 0){
				console.warn("Todo: todo date have to be bigger than current date");
			} else {
				this.schedule[name] = new this.Task(this, name, date, callback, options || {}, function(){
					delete _this.schedule[name];
				});
			}

			if (typeof this.onTaskAdded == "function"){
				this.onTaskAdded(this, name, data, callback, options);
			}

			return this;

		},
		update : function(name, date, callback, options){
			if (this.schedule[name]){
				clearTimeout( this.schedule[name].timeoutID);
				delete this.schedule[name];
			}
			
			this.add(name, date, callback, options);

			if (typeof this.onTaskUpdated == "function"){
				this.onTaskUpdated(this, name, data, callback, options);
			}
		},
		remove : function(/*str*/name){
			if (!this.schedule[name]){
				console.warn("Todo: item to remove cannot be found in schedule");
			} else {
				clearTimeout(this.schedule[name].timeoutID);
				delete this.schedule[name];
			}

			if (typeof this.onTaskRemoved == "function"){
				this.onTaskRemoved(this, name);
			}

			return this;

		},
		Task : function(/*obj*/todo, /*str*/name, /*str || num*/date, /*func*/callback, /*obj*/options, /*func*/onExpire){
			this.todo = todo;
			this.onExpire = onExpire;
			this.name = name;
			this.date = date;
			this.callback = callback;
			this.options = options;
			this.repeatCount = 0;

			var timeout = +new Date(this.date) - (todo.now());

			this.invoke = this.invoke.bind(this);

			this.timeoutID = setTimeout(this.invoke, timeout);
		}
	};

	Todo.prototype.Task.prototype = {
		expire : function(){
			clearTimeout(this.timeoutID);
			this.onExpire();
		},
		invoke : function(){
			var repeat = false;
			this.repeatCount++;

			if (typeof this.options.repeat == "number" && this.options.repeatFreq){
				if (this.options.repeat < 0){
					repeat = true;
				} else {
					if (this.repeatCount < this.options.repeat){
						repeat = true;
					}
				}
			}

			if (repeat){
				this.timeoutID = setTimeout(this.invoke, this.options.repeatFreq);
			} else {
				this.expire();
			}

			if (this.options.context){
				this.callback.call(this.options.context, this);
			} else {
				this.callback(this);
			}

		}
	};

	todo = new Todo(true);
	return todo;

});
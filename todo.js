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
		constr : Todo,
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
			var timeout = +new Date(date) - +new Date();

			if (timeout < 0){
				console.warn("Todo: todo date have to be bigger than current date");
			} else {
				// this.schedule[name] = {
				// 	date : date,
				// 	name : name, 
				// 	callback : callback,
				// 	context : context,
				// 	options : options || {},
				// 	repeated : 0
				// 	timeoutID : setTimeout(function(){

				// 		_this.schedule[name].repeated++;

				// 		if (options.context){
				// 			callback.call(options.context);
				// 		} else {
				// 			callback();
				// 		}

				// 		if (typeof _this.schedule[name].options.repeat == "number"){

				// 		}

				// 		delete _this.schedule[name];

				// 	}, timeout)
				// };

				this.schedule[name] = new this.Task(name, date, callback, options || {}, function(){
					delete _this.schedule[name];
				});
			}

			return this;

		},
		remove : function(/*str*/name){
			if (!this.schedule[name]){
				console.warn("Todo: item to remove cannot be found in schedule");
			} else {
				clearTimeout(this.schedule[name].timeoutID);
				delete this.schedule[name];
			}

			return this;

		},
		Task : function(/*str*/name, /*str || num*/date, /*func*/callback, /*obj*/options, /*func*/onExpire){
			this.onExpire = onExpire;
			this.name = name;
			this.date = date;
			this.callback = callback;
			this.options = options;
			this.repeatCount = 0;

			var timeout = +new Date(this.date) - (+new Date());

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
			this.repeatCount++;

			if (this.options.context){
				this.callback.call(this.options.context, this);
			} else {
				this.callback(this);
			}

			if (typeof this.options.repeat == "number" && this.options.repeatFreq){
				if (this.options.repeat < 0){
					this.timeoutID = setTimeout(this.invoke, this.options.repeatFreq);
					return;
				} else {
					if (this.repeatCount < this.options.repeat){
						this.timeoutID = setTimeout(this.invoke, this.options.repeatFreq);
						return;
					}
				}
			}

			this.expire();

		}
	};

	todo = new Todo(true);
	return todo;

});
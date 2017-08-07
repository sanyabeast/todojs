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
		add : function(/*str*/name, /*str*/date, /*func*/callback, /*obj || undef*/context){
			var _this = this;
			var timeout = +new Date(date) - +new Date();

			if (timeout < 0){
				console.warn("Todo: todo date have to be bigger than current date");
			} else {
				this.schedule[name] = {
					date : date,
					name : name, 
					callback : callback,
					context : context,
					timeoutID : setTimeout(function(){

						if (context){
							callback.call(context);
						} else {
							callback();
						}

						delete _this.schedule[name];

					}, timeout)
				};
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
	};

	todo = new Todo(true);
	return todo;

});
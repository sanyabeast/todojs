# TodoJS

A lightweight JavaScript library for scheduling tasks to execute at specific times. TodoJS provides a simple API for adding, updating, and removing scheduled tasks with support for repeating tasks and custom contexts.

## Features

- Schedule tasks to run at specific times
- Use various time formats (date strings, timestamps, relative times)
- Repeat tasks with configurable frequency
- Execute callbacks with custom contexts
- Helper methods for time calculations
- AMD module compatible

## Usage

### Adding Tasks

```javascript
// Basic usage
todo.add(String name, String|Number date, Function callback, Object|undefined options);

// Examples
// Using date string
todo.add("logMessage", "2025-05-30T10:00:00", function() {
  console.log(this.message);
}, { message: "Task executed!" });

// Using timestamp (milliseconds)
todo.add("showAlert", 1717665600000, function() {
  alert("Time's up!");
});

// Using relative time (10 seconds from now)
todo.add("promptUser", todo.in(todo.seconds(10)), function() {
  this.name = prompt("What's your name?");
}, { id: 123 });

// Repeating task (every minute, 5 times)
todo.add("repeatTask", Date.now(), function() {
  console.log("Repeating task executed");
}, { 
  repeat: 5,
  repeatFreq: todo.minutes(1)
});

// Infinite repeating task (every hour)
todo.add("hourlyCheck", Date.now(), function() {
  checkStatus();
}, { 
  repeat: -1,
  repeatFreq: todo.hours(1)
});
```

### Updating Tasks

```javascript
todo.update("taskName", newDate, newCallback, newOptions);
```

### Removing Tasks

```javascript
todo.remove("taskName");
```

### Time Helper Methods

```javascript
// Get current time
const now = todo.now();

// Schedule for X time from now
const inFiveMinutes = todo.in(todo.minutes(5));
const inTwoHours = todo.in(todo.hours(2));
const inThreeDays = todo.in(todo.days(3));

// Get next time that matches a specific interval
const nextHour = todo.nextTime(3600000); // Next full hour
```

## Events

TodoJS provides event hooks for task lifecycle:

```javascript
todo.onTaskAdded = function(todo, name, date, callback, options) {
  console.log(`Task ${name} added`);
};

todo.onTaskRemoved = function(todo, name) {
  console.log(`Task ${name} removed`);
};

todo.onTaskUpdated = function(todo, name, date, callback, options) {
  console.log(`Task ${name} updated`);
};
```

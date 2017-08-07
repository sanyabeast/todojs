# todojs

## Adding
```javascript
todo.add(String name, String date, Function callback, Object || undefined context);
```

```javascript
todo.add(name, date, callback, context);

todo.add("logthistoconsole", "Mon Aug 07 2017 15:54:13 GMT+0300", function(){
  console.log(this);
}, { hello : "hello world" });

todo.add("alertrandom", 1502110533816, function(){
  alert(math.random());
});

todo.add("promptusername", +new Date() + 10000, function(){
  this.name = prompt("username");
}, { age : 22, surname : "Black" });
```

## Removing
```javascript
todo.remove("logthistoconsole");
todo.remove("alertrandom");
```

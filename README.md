# Chekhov
Chekhov Js Framework
## Note
<li> <h3>Although, Chekhov.JS (further ch.js) is a JS framework,</h3>
<h3>it does not act like one you usually see and you should always keep that in mind</h3>
<br>
</li>
<li> Remember that the script file should always be included after the <body> closing tag</li>
<li><h2>Key elements</h2></li>
<img src="./assets/chekhov.png"></img>
The first thing you'll need when using ch.js is the values object 

```js
let values =
    {
        all_kinds_of_data_you_need: all_the_values_you_need
    }
```
## then it's time to make a  
```js
new Chekhov()
```    
like this
```js
    let ch = new Chekhov({
        reactive: {
        // That's an example of a computed property
            msg: function () {
                if (values.name == "")
                    return "What's your name?"
                else
                    return `Bye ${values.name}! It was Great to meet you!`
            }
        }
    }, values)
```
## due to simpilcity of the framework it requires you to do a few things manually
but it still provides some handy shortcuts
```html
    <div ch-repeat array="values.array" iter="iterator">
        <h1 class="central" ch-bind>{{iterator}}</h1>
    </div>
```
for repeating something a few times but it requires setting up a computed property, that's pretty easy though
```js
            iterator: function (i) {
                return values.array[i]
            }
```
```html
<button ch-event trigger="click" linked="switch">Continue</button>
```
to call the linked method when the trigger event happens
## A little more
```html
        <input ch-model linked="name" dep="msg" trigger="input"/>
```
is used
for calling the linked method and updating the dep value when the trigger event happens
### Most important one
# Behold
```html
 <h1 ch-bind>{{some_value}}</h1>
```
which binds the inner value of the element to the property or a value contained in ch.data (e.g. ch.data.msg)

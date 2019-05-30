---
description: Guide
---

# Getting Started

## Chekhov.JS. Getting Started

Chekhov.JS usage if fairly straightfoward, you just need a JavaScript object  to contain all the values and  an instacne of Chekhov class  to bootstrap your website's reactivity and interactivity

### The first object you will need 



```javascript
// You of course can choose any name you like
let values = 
{
    // Which contains values which should be stored reactively and used in all kinds
    // of JS magic
    key: value,
    another_key: another_value
    // ... and so on
}
```

{% hint style="success" %}
Yay! You're now $$1/2 $$ ready
{% endhint %}

### And the other one

```javascript
let ch = new Chekhov({
    reactive:
    {
        message: function (i) {
            return `Hello ${values.messages[i].content}, great to meet you!`
        }
    }
}, values)
```

{% hint style="warning" %}
You can choose any names for your properties but those who start with \_ \(underscore\) will not be re-computed
{% endhint %}


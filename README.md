---
description: Guide
---

# Introduction

## In order to bring reactivity to your website

You will need a  Chekhov class instance and an object

#### The object you will need

```text
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

> Yay! You're now 1/2  ready

####  And a class instance

```text
let ch = new Chekhov({
    reactive:
    {
        message: function (i) {
            return `Hello ${values.messages[i].content}, great to meet you!`
        }
    }
}, values)
```

{% page-ref page="how-to-use-it.md" %}


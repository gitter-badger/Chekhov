/* jshint asi: true */
var ctrls = [];
function instances(type, constructor) {
  var instances = []
  ctrls[type] =
    {
      factory: constructor,
      type: type
    }
  var el = document.querySelectorAll(`[ch-${type}]`)
  for (var i = 0; i < el.length; i++) {
    instances[i] = new ctrls[type].factory(el[i])
    instances[i].type = type;
  }
  return instances
}
class Chekhov {
  constructor(object, values) {
    var repeats = instances('repeat', function (elem) {
      this.tag = elem.tagName.toLowerCase()
      this.array = elem.getAttribute("array")
      this.iter = elem.getAttribute("iter")
      this.attr = elem.getAttribute("attr")
      this.elem = elem
    })
    repeats.forEach(i => {
      values.iterator = -1;
      i.copy = i.elem.innerHTML
      i.elem.innerHTML = ""
      eval(i.array).forEach(j => {
        values.iterator++;
        if (!object.reactive.hasOwnProperty(i.iter)) {
          i.elem.innerHTML += i.copy.replace(new RegExp(`{{${i.iter}}}`, 'g'), j)
        }
        else {
          i.elem.innerHTML += i.copy.replace(new RegExp(`{{${i.iter}}}`, 'g'), object.reactive[i.iter](values.iterator))
        }
      });
    })
    var bindings = instances('bind', function (elem) {
      this.tag = elem.tagName.toLowerCase()
      this.copy = elem.innerHTML
      this.elem = elem
    })
    let proxy = new Proxy(object, {
      get: (target, prop) => {
        return target[prop];
      },
      set: (target, prop, value) => {
        bindings.forEach(i => {
          if (i.copy.match(`{{${prop}}}`, 'g') != null) {
            if (!object.reactive.hasOwnProperty(prop)) {
              i.elem.innerHTML = value.replace(new RegExp(`{{${prop}}}`, 'g'), value)
            }
            else {
              i.elem.innerHTML = target.reactive[prop]()
            }
          }
        });
        target[prop] = value;
        return true;
      }
    });
    var models = instances('model', function (elem) {
      this.tag = elem.tagName.toLowerCase()
      this.trigger = elem.getAttribute("trigger")
      this.linked = elem.getAttribute("linked")
      this.dep = elem.getAttribute("dep")
      this.elem = elem
    })
    models.forEach(i => {
      i.elem.addEventListener(i.trigger, () => {
        values[i.linked] = i.elem.value
        proxy[i.dep] = null
      })
    });
    var events = instances('event', function (elem) {
      this.tag = elem.tagName.toLowerCase()
      this.trigger = elem.getAttribute("trigger")
      this.linked = elem.getAttribute("linked")
      this.elem = elem
    })
    events.forEach(i => {
      i.elem.addEventListener("click", () => {
        object.reactive[i.linked]()
      })
    });
    
    var ifs = instances('if', function(elem)
    {
      this.tag = elem.tagName.toLowerCase()
      this.condition = elem.getAttribute("condition")
      this.elem = elem
    })
    ifs.forEach(i => {
        i.elem.hidden = !eval(i.condition) 
    });
    this.data = proxy
  }
}
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
    var std_factory = function (elem) {
      this.elem = elem
      this.copy = elem.innerHTML
      this.trigger = elem.getAttribute('trigger')
      this.linked = elem.getAttribute('linked')
      elem.innerHTML = ""
    }
    var fors = instances('for', std_factory)
    fors.forEach(i => {
      i.elem.innerHTML = ""
      values.iterator = -1
      values[i.linked].forEach(j => {
        values.iterator++
        if (!object.reactive.hasOwnProperty(i.trigger)) {
          i.elem.innerHTML = i.copy.replace(new RegExp(`{{${i.trigger}}}`, 'g'), value)
        }
        else {
          i.elem.innerHTML +=  i.copy.replace(new RegExp(`{{${i.trigger}}}`, 'g'), object.reactive[i.trigger](values.iterator))
        }
      });
    });
    var ifs = instances('if', std_factory)
    var srcs = instances('src', std_factory)
    for (let i = 0; i < srcs.length; i++) {
      const e = srcs[i];
      e.elem.src = object.reactive[e.linked](i)
    }
    var bindings = instances('bind', std_factory)
    let proxy = new Proxy(values, {
      get: (target, prop) => {
        return target[prop];
      },
      set: (target, prop, value) => {
        bindings.forEach(i => {
          if (!object.reactive.hasOwnProperty(prop) && i.copy.match(new RegExp(`{{${prop}}}`, 'g')) != null) {
            i.elem.innerHTML = i.copy.replace(new RegExp(`{{${prop}}}`, 'g'), value)
          }
          else if (i.copy.match(new RegExp(`{{${prop}}}`, 'g')) != null) {
            i.elem.innerHTML = i.copy.replace(new RegExp(`{{${prop}}}`, 'g'), object.reactive[prop]())
          }
        });
        
        ifs.forEach(i => {
          if (i.linked == prop) {
            i.elem.hidden = !value
          }
        });
        target[prop] = value;
        return true;
      }
    });

    var models = instances('model', std_factory)
    models.forEach(i => {
      i.elem.addEventListener(i.trigger, function () {
        proxy[i.linked] = i.elem.value
        Object.entries(object.reactive).forEach(f => {
          if(eval(f)[0][0]!= '_')
          {
            proxy[eval(f)[0]] = eval(f)[1](i.elem.value)
          }
        })
      })
    });
    this.data = proxy
  }
}
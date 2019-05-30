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
function tag_instances(type, constructor) {
  var tag_instances = []
  ctrls[type] =
    {
      factory: constructor,
      type: type
    }
  var el = document.getElementsByTagName(type)
  for (var i = 0; i < el.length; i++) {
    tag_instances[i] = new ctrls[type].factory(el[i])
    tag_instances[i].type = type;
  }
  return tag_instances
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
    this.index = document.URL
    console.log(`Index -> ${this.index}`)
    var portals = tag_instances('portal', std_factory)
    portals.forEach(i => {
      const inclusion = document.createElement('iframe')
      i.incl = inclusion
      inclusion.src = object.portal[i.linked]
      i.elem.appendChild(inclusion)
    });
    var fors = instances('for', std_factory)
    fors.forEach(i => {
      i.elem.innerHTML = ""
      var iter = -1
      for (let u = 0; u < values[i.linked].length; u++) {
        var j = values[i.linked][u];
        iter++
        if (!object.reactive.hasOwnProperty(i.trigger)) {
          i.elem.innerHTML = i.copy.replace(new RegExp(`{{${i.trigger}}}`, 'g'), value)
        }
        else {
          i.elem.innerHTML += i.copy.replace(new RegExp(`{{${i.trigger}}}`, 'g'), object.reactive[i.trigger](iter))
        }
      }
    });
    var srcs = instances('src', std_factory)
    for (let i = 0; i < srcs.length; i++) {
      const e = srcs[i];
      e.elem.src = object.reactive[e.linked](i - 1)
    }
    var ifs = instances('if', std_factory)
    var bindings = instances('bind', std_factory)
    console.log(routers)
    let proxy = new Proxy(values, {
      get: (target, prop) => {
        return target[prop];
      },
      set: (target, prop, value) => {
        fors.forEach(i => {
          i.elem.innerHTML = ""
          var iter = -1
          for (let u = 0; u < values[i.linked].length; u++) {
            var j = values[i.linked][u];
            iter++
            if (!object.reactive.hasOwnProperty(i.trigger)) {
              i.elem.innerHTML = i.copy.replace(new RegExp(`{{${i.trigger}}}`, 'g'), value)
            }
            else {
              i.elem.innerHTML += i.copy.replace(new RegExp(`{{${i.trigger}}}`, 'g'), object.reactive[i.trigger](iter))
            }
          }
        });
        portals.forEach(i => {
          i.incl.src = object.portal[i.linked]
        });
        ifs.forEach(i => {
          if (i.linked == prop) {
            i.elem.hidden = !value
          }
        });
        bindings.forEach(i => {
          if (!object.reactive.hasOwnProperty(prop) && i.copy.match(new RegExp(`{{${prop}}}`, 'g')) != null) {
            i.elem.innerHTML = i.copy.replace(new RegExp(`{{${prop}}}`, 'g'), value)
          }
          else if (i.copy.match(new RegExp(`{{${prop}}}`, 'g')) != null) {
            i.elem.innerHTML = i.copy.replace(new RegExp(`{{${prop}}}`, 'g'), object.reactive[prop]())
          }
        });

        var srcs = instances('src', std_factory)
        for (let i = 0; i < srcs.length; i++) {
          const e = srcs[i];
          e.elem.src = object.reactive[e.linked](i - 1)
        }
        target[prop] = value;
        return true;
      }
    });

    var models = instances('model', std_factory)
    models.forEach(i => {
      i.elem.addEventListener(i.trigger, function () {
        proxy[i.linked] = i.elem.value
        Object.entries(object.reactive).forEach(f => {
          if (eval(f)[0][0] != '_') {
            proxy[eval(f)[0]] = eval(f)[1](i.elem.value)
          }
        })
      })
    });
    var events = instances('event', std_factory)
    events.forEach(i => {
      i.elem.addEventListener(i.trigger, function () {
        object.reactive[i.linked]()
      }, {once: true} )
    });
    this.data = proxy
  }
}
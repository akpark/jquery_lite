(function() {
  if (typeof JLite === "undefined") {
    window.JLite = {};
  }

  var DNC = JLite.DOMNodeCollection = function(elementList){
    this.elementList = elementList;
  };

  var $l = JLite.$l = function(selector) {
    var elementList;
    if (selector instanceof Function) {
      if (document.readyState === "complete" ) {
        selector();
      } else {
        document.addEventListener("DOMContentLoaded", selector);
      }
    }
    if (selector instanceof HTMLElement) {
      elementList = [selector];
    } else {
      elementList = document.querySelectorAll(selector);
      elementList = Array.prototype.slice.call(elementList);
    }
    return new JLite.DOMNodeCollection(elementList);
  };

  DNC.prototype.html = function(str) {
    var innerHTML;
    if(str){
      innerHTML = str;
      this.elementList.forEach(function(el) {
        el.innerHTML = str;
      });
    }
    else {
      innerHTML = this.elementList[0].innerHTML;
    }
    return innerHTML;
  };

  DNC.prototype.empty = function (str) {
    var elementList = this.elementList;
    for (var i = 0; i < elementList.length; i++) {
      elementList[i].html = "";
    }
  };

  DNC.prototype.append = function(str) {
    this.elementList.forEach(function(el){
      el.innerHTML += str;
    });
  };

  DNC.prototype.attr = function(name, value){
    this.elementList.forEach(function(el) {
      el.setAttribute(name, value);
    });
  };

  DNC.prototype.addClass = function(className) {
    this.elementList.forEach(function(el) {
      // debugger
      var classNameArray;
      if (el.className === "") {
        el.className = className;
      } else {
        classNameArray = [el.className];
        classNameArray.push(className);
        el.className = classNameArray.join(' ');
      }
    });
  };

  DNC.prototype.removeClass = function(className) {
    var elementList = this.elementList;
    for (var i = 0; i < elementList.length; i++) {
      var classNameArray = elementList[i].className.split(" ");
      for (var j = 0; j < classNameArray.length; j++) {
        if (classNameArray[j] === className) {
          classNameArray.splice(j, 1);
          j -= 1;
        }
      }
      var classNames = classNameArray.join(" ");
      elementList[i].className = classNames;
    }
  };

  DNC.prototype.children = function() {
    var childrenList = [];
    var elementList = this.elementList;
    for (var i = 0; i < elementList.length; i++) {
      var children = elementList[i].children;
      childrenList.push(children);
    }
    return new JLite.DOMNodeCollection(childrenList);
  };

  DNC.prototype.parent = function() {
    var parentList = [];
    var elementList = this.elementList;
    for (var i=0; i<elementList.length; i++) {
      var parent = elementList[i].parentNode;
      parentList.push(parent);
    }
    return new JLite.DOMNodeCollection(parentList);
  };

  DNC.prototype.find = function(selector) {
    var elementList = this.elementList;
    var findList = [];
    for (var i = 0; i < elementList.length; i++) {
      var find = elementList[i].querySelectorAll(selector);
      findList.push(find);
    }
    return new JLite.DOMNodeCollection(findList);
  };

  DNC.prototype.remove = function() {
    var elementList = this.elementList;
    for (var i = 0; i < elementList.length; i++) {
      elementList[i].html = "";
    }
    this.elementList = undefined;
  };

  DNC.prototype.on = function(type, callback) {
    var elementList = this.elementList;
    for (var i = 0; i < elementList.length; i++) {
      var target = elementList[i];
      target.addEventListener(type, callback);
    }
  };

  DNC.prototype.extend = function() {
    var firstObject = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) {
      Object.keys(args[i]).forEach(function(key) {
        firstObject[key] = args[i][key];
      });
    }
    return firstObject;
  };

  DNC.prototype.ajax = function(options) {
    var defaults = {
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      data: "Give a function and/or data please",
      success: function(data) {
        console.log(data);
      },
      error: function() {
        console.log("An error occurred.");
      },
      method: 'GET',
      url: document.URL
    };
    options = this.extend(defaults, options);

    var xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
        if(xmlhttp.status == 200){
          options.success(JSON.parse(xmlhttp.responseText));
        } else if(xmlhttp.status == 400) {
          options.error();
        } else {
          alert('something else other than 200 was returned');
        }
      }
    };
    xmlhttp.open("GET", options.url, true);
    xmlhttp.send();
  };


})();

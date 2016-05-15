console.log('The Rocket Injected! Prepare for launch...');

(function (w, d) {
  'use strict';

  var mode = false,
      overlayEl = d.createElement('div'),
      overlayElLabel = d.createElement('div'),
      selectedElements = [],
      setMode = function(b) {
        mode = !!b;

        overlayElLabel.style.display = mode ? 'block' : 'none';
        overlayEl.style.display = mode ? 'block' : 'none';

        console.log('Mode set to ' + (mode ? 'select' : 'click'));

        drawSelected();
      },
      overlayElement = function(el) {
        if (!el.tagName.match(/^(?:p|h[1-6]|a|img|strong|em|b|i|li|dt|dd|span)$/i)) {
          overlayElLabel.style.display = 'none';
          overlayEl.style.display = 'none';

          return;
        }

        overlayElLabel.style.display = 'block';
        overlayEl.style.display = 'block';

        var rect = el.getClientRects();

        if (rect.length > 0) {
          overlayEl.style.height = rect[0].height + 'px';
          overlayEl.style.left = rect[0].left + 'px';
          overlayEl.style.width = rect[0].width + 'px';
          overlayEl.style.top = (rect[0].top + document.body.scrollTop) + 'px';

          overlayElLabel.innerText = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.replace(/ +/, '.') : '');

          overlayElLabel.style.left = rect[0].left + 'px';
          overlayElLabel.style.top = (rect[0].top + document.body.scrollTop - overlayElLabel.clientHeight) + 'px';

          if (parseInt(overlayElLabel.style.top, 10) < 0) {
            overlayElLabel.style.top = 0;
          }
        }
      },
      drawSelected = function() {
        var i,
            l = selectedElements.length,
            rect;

        for (i = 0; i < l; i = i + 1) {
          rect = selectedElements[i].element.getClientRects();

          selectedElements[i].overlay.style.display = mode ? 'block' : 'none';
          selectedElements[i].overlay.style.height = rect[0].height + 'px';
          selectedElements[i].overlay.style.left = rect[0].left + 'px';
          selectedElements[i].overlay.style.width = rect[0].width + 'px';
          selectedElements[i].overlay.style.top = (rect[0].top + document.body.scrollTop) + 'px';
        }

      },
      unselectElement = function(el) {
        var i,
            l = selectedElements.length,
            remove;

        for (i = 0; i < l; i = i + 1) {
          if (selectedElements[i].overlay === el) {
            remove = i;

            break;
          }
        }

        if (typeof remove === 'undefined') return;

        selectedElements[remove].overlay.parentElement.removeChild(selectedElements[remove].overlay);

        parent.postMessage({
          action: 'theRocket:XPathRemove',
          xpath: selectedElements[remove].xpath
        }, "*");

        selectedElements.splice(remove, 1);
      },
      selectElement = function(el) {
        if (!el.tagName.match(/^(?:p|h[1-6]|a|img|strong|em|b|i|li|dt|dd|span)$/i)) return;

        var xpath = getPathTo(el),
            overlayEl = d.createElement('div');

        overlayEl.style.border = '1px solid midnightblue';
        overlayEl.style.backgroundColor = 'deepskyblue';
        overlayEl.style.display = mode ? 'block' : 'none';
        overlayEl.style.opacity = 0.5;
        overlayEl.style.position = 'absolute';
        overlayEl.style.zIndex = 99997;

        overlayEl.addEventListener('click', function(e) {
          unselectElement(this);
        });

        selectedElements.push({
          xpath: xpath,
          element: el,
          overlay: overlayEl
        });

        w.document.body.appendChild(overlayEl);

        drawSelected();

        return xpath;
      };

  // http://stackoverflow.com/questions/2631820/im-storing-click-coordinates-in-my-db-and-then-reloading-them-later-and-showing/2631931#2631931
  function getPathTo(element) {
    if (element.id!=='')
        return 'id("'+element.id+'")';
    if (element===document.body)
        return element.tagName;

    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        if (sibling===element)
            return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
        if (sibling.nodeType===1 && sibling.tagName===element.tagName)
            ix++;
    }
  }

  // http://stackoverflow.com/questions/10596417/is-there-a-way-to-get-element-by-xpath-using-javascript-in-selenium-webdriver
  // https://gist.github.com/Joopmicroop/10471650
  //
  // Get the dom element out of the document with the xpath string aka get element by xpath
  function getElementByXPath(xPath, doc){
    if(!doc) doc = document;
    if(doc.evaluate) return doc.evaluate(xPath, document, null, 9, null).singleNodeValue;
    // for IE
    while(xPath.charAt(0) == '/') xPath = xPath.substr(1);
    var prevElem = doc;
    var arr = xPath.split('/');
    for(var i=0; i<arr.length; i++){
      var step = arr[i].split(/(\w*)\[(\d*)\]/gi).filter(function(v){ return !(v==''||v.match(/\s/gi)) },this);
      var elem = step[0];
      var elemNum = step[1]?step[1]-1:0; // -1 since xpath is 1 based
      if(i<arr.length-1) prevElem = prevElem.getElementsByTagName(elem)[elemNum];
      else return prevElem.getElementsByTagName(elem)[elemNum];
    }
  }

  overlayEl.style.border = '1px solid midnightblue';
  overlayEl.style.backgroundColor = 'deepskyblue';
  overlayEl.style.display = mode ? 'block' : 'none';
  overlayEl.style.opacity = 0.5;
  overlayEl.style.pointerEvents = 'none';
  overlayEl.style.position = 'absolute';
  overlayEl.style.zIndex = 99998;

  overlayElLabel.style.display = mode ? 'block' : 'none';
  overlayElLabel.style.backgroundColor = 'black';
  overlayElLabel.style.color = 'white';
  overlayElLabel.style.fontFamily = 'monospace';
  overlayElLabel.style.fontSize = '12px';
  overlayElLabel.style.opacity = 0.85;
  overlayElLabel.style.padding = '2px 5px';
  overlayElLabel.style.pointerEvents = 'none';
  overlayElLabel.style.position = 'absolute';
  overlayElLabel.style.zIndex = 99999;

  w.document.body.appendChild(overlayEl);
  w.document.body.appendChild(overlayElLabel);

  d.addEventListener('mouseover', function (e) {
    if (mode) {
      // console.log(e);
      overlayElement(e.target || e.srcElement);
    }
  });

  w.addEventListener('resize', function () {
    drawSelected();
  });

  d.addEventListener('click', function (e) {
    if (mode) {
      e.preventDefault();
      e.stopPropagation();

      parent.postMessage({
        action: 'theRocket:XPathAdd',
        xpath: selectElement(e.target || e.srcElement)
      }, "*");

      return;
    }
  });

  w.addEventListener("message", function (e) {
    var action;

    if (e.data && e.data.action && (action = e.data.action.match(/^theRocket:([\w_-]+)$/))) {
      switch (action[1]) {
        case 'mode':
          if (typeof e.data.value !== 'undefined' ) {
            setMode(e.data.value);
          }
        break;
      }
    }
  });


}(window, window.document))

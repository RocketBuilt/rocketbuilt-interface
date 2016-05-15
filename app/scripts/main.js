(function (w) {
  console.log('\'Allo \'Allo!');

  w.theRocket = document.getElementById('the-rocket');

  w.theRocket.addEventListener('load', function () {
    console.log('Removing iframe overlay...');
    var overlay = w.theRocket.parentElement.getElementsByClassName('embed--overlay');

    if (overlay.length > 0) {
      w.theRocket.parentElement.removeChild(overlay[0]);
    }
  })

  window.addEventListener("message", function(e) {
    // console.log("Message from child:", e.data);

    var action;

    if (e.data && e.data.action && (action = e.data.action.match(/^theRocket:([\w_-]+)$/))) {
      switch (action[1]) {
        case 'XPathAdd':
          if (typeof e.data.xpath !== 'undefined' ) {
            console.log('XPathAdd: ' + e.data.xpath);
          }
        break;

        case 'XPathRemove':
          if (typeof e.data.xpath !== 'undefined' ) {
            console.log('XPathRemove: ' + e.data.xpath);
          }
        break;
      }
    }
  });
}(window));

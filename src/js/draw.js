(function() {

  var canvas, ctx, container, ptCanvas, space, hostNameDict, pageStore;
  var body = document.querySelector("body");
  var screenshot = document.getElementById("ext-image");

  // If we're zoomed out already, continue the animation to reverse it fully
  if(document.getElementById("ext-canvas-container")) {
    if(screenshot) screenshot.style.animationPlayState = "running"
    document.getElementById("space").classList.add("ext-canvas-hide")
  } else {
    vAPI.messaging.send(
      'screenshot',
      { what: 'getScreenshotAndSiteInfo'},
      function(res) {
        pageStore = res.pageStore;
        hostNameDict = res.hostNameDict;
        window.extHasFired = true;
        doItAll(res.screenshot);
      }
    );
  }

  function doItAll(msg) {

    container = document.createElement("div");
    container.setAttribute("id", "ext-canvas-container");

    ptCanvas = document.createElement("canvas");
    ptCanvas.setAttribute("id", "ext-ptCanvas");

    image = document.createElement("img");
    image.setAttribute("id", "ext-image");
    image.classList.add("ext-image");
    container.appendChild(image);


    image.src = msg;

    body.appendChild(container);
    space = new CanvasSpace().display("#ext-canvas-container");
    resizeCanvas(space);

    image.addEventListener("animationend", function(e) {
      space.pause();
      document.body.removeChild(container)
    }, false)

    image.addEventListener("animationiteration", function(e) {
      image.style.animationPlayState = "paused";
    }, false)

    makeSpace();
    image.classList.add("ext-canvas-slide");

    window.addEventListener('resize', resizeCanvas, false);
  }


  function resizeCanvas(space) {
    image.width = window.innerWidth;
    image.height = window.innerHeight;
    space.resize(window.innerWidth, window.innerHeight)
  }

  // –––––––––

  function makeSpace() {

    var colors = {
      a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
      a5: "#96afed", a6: "#f5ead6", a7: "#f1f3f7", a8: "#e2e6ef"
    };
    var form = new Form( space );

    //// 2. Create Elements
    var pts = [];
    var center = new Vector( space.size.x/2, space.size.y/2 );
    var centerleft = new Vector( 0, space.size.y/2 );
    var line = new Line(center).to( space.size );
    var target = new Vector( 0, space.size.y/2 );
    var origin = new Vector(0,0);
    //var target = new Vector( 150, 400 );

    for (var i=0; i<Object.keys(hostNameDict).length; i++) {
      pts.push({
        name: Object.keys(hostNameDict)[i],
        info: hostNameDict[Object.keys(hostNameDict)[i]]
      });
    }

    pts.sort(function(prev,next){
      return prev.info.blockCount > next.info.blockCount
    });
    var easingFunction = function (t, b, c, d) {
      if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
      return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    };

    var tr = new Timer(2000)
    tr.start()
    var tt = new Timer(1000)
    tt.start()

    // 3. Visualize, Animate, Interact
    space.add({
      animate: function(time, fps, context) {
        img = document.getElementById("ext-image").getBoundingClientRect();
        centerleft = new Vector( img.left,img.top+img.height/2 );
        if(tr.check() === 1) {tr.start(true)}
        for (var i=0; i<pts.length; i++) {
          var pt = pts[i];
          var neg = i > pts.length/2 ? -1 : 1;
          var j = easingFunction(tt.check(),0,1,1);
          var point = centerleft
                    .$add(new Vector(space.size.x-200,(space.size.y/(pts.length-1))*i).subtract(centerleft).multiply(j))
          form.fill(`rgba(255,255,255,${j}` )
          form.font(15,"monospace")
          form.text( point, pt.name, 10000, 10, 5 )
          form.stroke("white", 1)
          form.circle( new Circle( point ).setRadius(Math.max(2,Math.round(Math.max(pts[i].info.allowCount, pts[i].info.blockCount))) ) )
          form.fill( colors["a"+(i > 7 ? 1 : i+1)]).stroke(0)

          var pair =  new Pair(centerleft).to(point);
          form.stroke("white", 1).line( pair )
          form.circle( new Circle(pair.interpolate(Easing.quadOut(tr.check(),0,1,1))).setRadius(Easing.quadOut(tr.check(),0,3,1)) )
        }
      }
    });

    // 4. Start playing
    space.bindMouse();
    space.play();
  }

  window.document.body.addEventListener("keydown", (e) => {
      if(e.keyCode === 72) {
        //typeH1();
      }
  }, false);

  window.setTimeout(() => {
  }, 2000);

  function typeH1() {
    [].slice.call(document.getElementsByTagName("h1")).sort((pre, cur) => {
      return (
        (cur.getBoundingClientRect().width * cur.getBoundingClientRect().height) -
        (pre.getBoundingClientRect().width * pre.getBoundingClientRect().height)
      )
    }).map((el, i) => {
      if(i === 0) {
        console.log(el)
        el.classList.add("bounce", "animated", "textmarker", "invers")
        window.setTimeout(() => {
          $(el).typed({strings: ["Chrome Extensions are great.", `Christ on a cross, this site has ${Math.floor(Math.random() * 40 + 1)} trackers!!!1!`], typeSpeed: 10, startDelay: 200});
        }, 1700);
      }
    });
  }

})();


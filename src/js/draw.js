(function() {

var canvas, ctx, container, ptCanvas, space, hostNameDict, pageStore;
var body = document.querySelector("body");

vAPI.messaging.send(
  'screenshot',
  { what: 'getScreenshotAndSiteInfo'},
  function(res) {
    pageStore = res.pageStore 
    hostNameDict = res.hostNameDict;
    doItAll(res.screenshot);
  }
);


function doItAll(msg) {

  container = document.createElement("div");
  container.setAttribute("id", "ext-canvas-container");

  ptCanvas = document.createElement("canvas");
  ptCanvas.setAttribute("id", "ext-ptCanvas");

  //ptCanvas.width = window.innerWidth;
  //ptCanvas.height = window.innerHeight;
  //ptCanvas.classList.add("ext-canvas");

  image = document.createElement("img");
  image.setAttribute("id", "ext-image");
  image.classList.add("ext-image");
  container.appendChild(image);

  //ctx = canvas.getContext('2d');
  resizeCanvas();

  //var img = new Image;
  //img.onload = function(){
    //ctx.drawImage(img,0,0, canvas.width, canvas.height); 
  //};
  image.src = msg;

  body.appendChild(container);
  space = new CanvasSpace().display("#ext-canvas-container");
  makeSpace();

  image.classList.add("ext-canvas-slide");
  //canvas.classList.add("ext-canvas-hide");

  window.addEventListener('resize', resizeCanvas, false);
}

function drawStuff() {
}

function resizeCanvas() {
  image.width = window.innerWidth;
  image.height = window.innerHeight;
  drawStuff();
}

// –––––––––

function makeCurveSpace() {

  var colors = {
    a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
    b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
  };
  var form = new Form( space );


  //// 2. Create Elements
  var pts = [];
  var center = space.size.$divide(2);
  var line = new Line(center).to( space.size );
  var target = new Vector( center );

  var trackers = Object.keys(hostNameDict);

  for (var i=0; i<trackers.length; i++) {
    pts.push( new PointSet( target ) );
  }

  space.add({
    animate: function(time, fps, context) {

      for (var i=0; i<pts.length; i++) {

        var pt = pts[i];
        form.stroke( "#fff", 2 );
        form.curve( new Curve( target ).to( target.$add(100, 20*i), target.$add(200, 30*i) ).bezier(20) );
      }
    }
  });

  space.bindMouse();
  space.play();
}
function makeSpace() {

  var colors = {
    a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
    b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
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
	var easingFunction = function (t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	};

  // 3. Visualize, Animate, Interact
  space.add({
    animate: function(time, fps, context) {
      if(typeof tt !== "object") {
        tt = new Timer(1000)
        tt.start()
      }
      for (var i=0; i<pts.length; i++) {
        var pt = pts[i];
        var neg = i > pts.length/2 ? -1 : 1;
        var j = easingFunction(tt.check(),0,1,1);
        var point = centerleft
                  .$add(new Vector(space.size.x-200,(space.size.y/(pts.length-1))*i).subtract(centerleft).multiply(j)) 
        form.fill( "white" )
        form.circle( new Circle( point ).setRadius(2) )
        form.fill(`rgba(255,255,255,${j}` )
        form.font(15,"Roboto Slab")
        form.text( point, pt.name, 10000, 10, 5 )
        form.line( new Pair(centerleft).to(point))
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


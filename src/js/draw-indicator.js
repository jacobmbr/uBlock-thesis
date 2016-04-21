(function() {
  var body = document.querySelector("body");
  var ind_container = document.createElement("div");
  ind_container.setAttribute("id", "indicator-container");
  body.appendChild(ind_container);
  sp = new CanvasSpace("ind-space").display("#indicator-container", function(a,b,c){

  });
  var form = new Form( sp );

  vAPI.messaging.send(
    'screenshot',
    { what: 'getCounts'},
    function(res) {
      drawIndicator(res);
    }
  );
  function drawIndicator(blockCounts) {
    var center = new Vector( sp.size.x/2, sp.size.y/2 )
    var pts = []
    for(i=0;i<blockCounts.allow;i++) { pts.push({vec: new Vector(Util.randomRange(0,3),Util.randomRange(0,3)).moveBy(center), a: 1})  }
    for(i=0;i<blockCounts.block;i++) { pts.push({vec: new Vector(Util.randomRange(0,12),Util.randomRange(0,12)).moveBy(center).rotate2D( Util.randomRange(0,360)*Const.one_degree, center), a: 0})  }
    sp.add({
      animate: function(time, fps, context) {
        for(i=0;i<pts.length;i++) {
          //form.triangle( new Triangle(center).to(10,30) );
          var curpt =  new Point( pts[i].vec.rotate2D( Util.randomRange(0,10)*Const.one_degree/8, center ) );
          form.fill("black").stroke("#eee")
          form.line( new Line(center).to( curpt ) );
          form.fill( pts[i].a === 0 ? "#ff2d5d" : "#42dc8e").stroke(0)
          form.circle( new Circle( curpt ).setRadius(2) )
        }
        //form.rect( new Rectangle(0,0,sp.size.x,sp.size.y) )
        //form.font(15,"monospace").text( new Point(5,10), blockCounts.allow, 1000,0,0 )
        //form.font(15,"monospace").text( new Point(5,20), blockCounts.block, 1000,0,0 )
      },
      onMouseAction: function(type,x,y,evt) {
        if(type === "up") {
          vAPI.messaging.send(
            "screenshot",
            {"what": "launch"}
          );
        }
      }
    });
    sp.bindMouse();
    sp.play();
  }

})();

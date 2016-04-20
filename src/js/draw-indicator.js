(function() {
  var body = document.querySelector("body");
  var ind_container = document.createElement("div");
  ind_container.setAttribute("id", "indicator-container");
  body.appendChild(ind_container);
  sp = new CanvasSpace("ind-space").display("#indicator-container", function(a,b,c){
    console.log(a,b,c)
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
    sp.add({
      animate: function(time, fps, context) {
        form.fill("black");
        //form.rect( new Rectangle(0,0,sp.size.x,sp.size.y) )
        form.font(15,"monospace").text( new Point(5,10), blockCounts.allow, 1000,0,0 )
        form.font(15,"monospace").text( new Point(5,20), blockCounts.block, 1000,0,0 )
      }
    });
    sp.bindMouse();
    sp.play();
  }

})();

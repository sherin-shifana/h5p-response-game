(function ($,ResponseGame,EventDispatcher) {

  ResponseGame.Shape = function ( paramsObj) {

    const that= this;
    EventDispatcher.call(this);

    this.shape = paramsObj.shape;
    this.color = paramsObj.color;
    this.isAnswer = paramsObj.isAnswer;

    this.status = null;

    this.timer = new ResponseGame.Timer();

    this.timer.setClockTime('0:04');
    this.timer.setMode(H5P.Timer.BACKWARD);


    this.timer.on('skipped',function(){

      that.status = 'skipped';
      // console.log('working');
      //store the status inits shape
      that.trigger('drawNext');
    })

    // this.count = 15;
    // this.canvasSize = 100;
  };


  //draw is converted to appendTo;

  ResponseGame.Shape.prototype.appendTo = function ($container, cSize) {

    //initiate Timer

    // draw shapes

    // append buttons

    this.canvasSize = cSize;
    $container.empty();
    this.$canvas = $('<canvas id="canvas" height="'+cSize+'px" width="'+cSize+'px"></canvas>').appendTo($container);
    this.prepareCanvas();
    this.drawNext();
  };


// added from parent code once again black

ResponseGame.Shape.prototype.draw = function($canvas,$container){

    const that = this;
    // const shape = this.shapesArray[that.currentItem]['shape'];
    // const item = this.shapesArray[that.currentItem];

    that.canvas = $canvas[0];
    const context = that.canvas.getContext('2d');
    that.canvasSize = window.innerWidth/3.5;

    const top = (that.canvasSize/4);
    const left = (that.canvasSize/4);

    context.clearRect(0, 0, that.canvas.width, that.canvas.height);
    context.beginPath();

    context.strokeStyle = that.color;
    context.fillStyle = that.color;


    switch (that.shape) {
      case 'triangle':
        context.moveTo(that.canvasSize/4+left, 0+top);
        context.lineTo(that.canvasSize/2+left,that.canvasSize/2+top);
        context.lineTo(0+left, that.canvasSize/2+top);
        break;

      case 'square':
      // square
        context.fillRect(0+left, 0+top, that.canvasSize/2, that.canvasSize/2);
        break;

      case 'circle':
      // circle
        context.arc(that.canvasSize/4+left, that.canvasSize/4+top, that.canvasSize/4, 0, 2 * Math.PI);
        break;
      }

      context.stroke();
      context.fill();
      context.closePath();
      $container.find('.progress').css('width','100%');
      $container.find('.progress').css('transition','width '+(that.timer.getTime()/1000)+'s' );
      that.timer.play();

}



  ResponseGame.Shape.prototype.drawNext = function () {
    this.draw();
  };

  ResponseGame.Shape.prototype.decrement = function () {
    this.count--;
  };

  ResponseGame.Shape.prototype.prepareCanvas = function () {
    const that = this;
    this.canvas = this.$canvas[0];
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.unitHt = this.height / 6;
    this.unitWt = this.width / 6;
    this.unit = 2;
    this.radius = this.canvasSize/5;
    this.gap = (this.canvasSize/50 < 5)?5: Math.floor(this.canvasSize/50);
    this.pos = this.canvasSize - this.gap;
  };

  // ResponseGame.Shape.prototype.drawShape = function (pathFromX, pathFromY,color, shape, radius, height, width ) {
  //   const context = this.canvas.getContext('2d');
  //   context.strokeStyle = color;
  //   context.fillStyle = color;
  //
  //   context.beginPath();
  //   switch(shape) {
  //     case 'triangle':
  //       context.moveTo(pathFromX, pathFromY);
  //       context.lineTo(pathFromX + (width/2), pathFromY + height);
  //       context.lineTo(pathFromX - (width/2), pathFromY+ height);
  //       break;
  //
  //     case 'square':
  //       context.fillRect(pathFromX, pathFromY, width, height);
  //       break;
  //
  //     case 'circle':
  //       context.arc(pathFromX, 4*pathFromY, radius, 0, 2 * Math.PI);
  //       break;
  //     }
  //
  //   context.stroke();
  //   context.fill();
  //   context.closePath();
  // };

  // ResponseGame.Shape.prototype.draw = function () {
  //   const that = this;
  //   switch (this.shape) {
  //     case 'triangle':
  //     // triangle
  //       that.drawShape(this.unitWt*3,this.unitHt*1.5,this.color,this.shape,0,this.height/3,this.height/3);
  //       break;
  //
  //     case 'square':
  //     // square
  //       that.drawShape(this.unitWt*2,this.unitHt*1.5,this.color,this.shape,0,this.height/3,this.height/3);
  //       break;
  //
  //     case 'circle':
  //     // circle
  //       that.drawShape(this.unitWt*3,this.unitHt/1.5,this.color,this.shape,this.radius,0,0);
  //       break;
  //     }
  // };

  ResponseGame.Shape.prototype.clearCanvas = function () {
    const context = this.canvas.getContext('2d');
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };



  return ResponseGame.Shape;
})(H5P.jQuery,H5P.ResponseGame,H5P.EventDispatcher);

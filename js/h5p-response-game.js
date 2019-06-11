H5P.ResponseGame = (function ($, UI) {

  function C(options, id) {
    const that = this;
    that.options = options;
    // Keep provided id.
    that.id = id;
  };

  C.prototype.attach = function ($container) {
    const that = this;
    $container.addClass("h5p-response-game");
    const $mainContainer = $('<div class="main-container"></div>');
    const $shape = $('<div class="shape"></div>');
    const $startBtn = $('<button class="start-button">Start</button>');


    if (this.options.selectShape){
      $shape.addClass("circle");
    }
    else {
      $shape.addClass("square");
    }

    function getRandomColor() {
      // var letters = '0123456789ABCDEF';
      var colors = ["#ff0000", "#0066ff", "#33cc33", "#000000", "#ffff1a"];
      // var color = '#';
      for (var i = 0; i < colors.length; i++) {
        color = colors[Math.floor(Math.random() * i)];
      }
      return color;
    }

    function setRandomColor() {
      $(".shape").css("background-color", getRandomColor());
      that.createdTime = Date.now();
      $shape.click(function(){
        this.currentColor = $(this).css('background-color');
        if(this.currentColor === 'rgb(0, 102, 255)') {
          this.clickedTime = Date.now();
          this.reactionTime = (this.clickedTime - that.createdTime) / 1000;
          console.log(this.reactionTime);
          that.$displayMsg = $('<div>'+this.reactionTime+'</div>');
        }
        else {
          that.$displayMsg = $('<div>wait for Blue!!</div>');
        }
      });

      that.$displayMsg.appendTo($mainContainer);
    }




    $startBtn.click (function() {
      $(this).remove();
      setInterval(setRandomColor, 1000);
    });


    $shape.appendTo($mainContainer);
    $startBtn.appendTo($mainContainer);
    $mainContainer.appendTo($container);
  };

  return C;
})(H5P.jQuery);

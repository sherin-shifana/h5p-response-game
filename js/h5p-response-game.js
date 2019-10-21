H5P.ResponseGame = (function ($, UI) {

  function ResponseGame(options, id) {
    this.options = options;
    this.id = id;
    this.maxOptions=15; //option in semantics
    this.maxAnswers= 9; //option in semantics
    this.minAnswers= 6; //option in semantics with minimum value
    this.maxTime = 2000;

    this.shapesArray = [];
    this.questShapes = [];
    // this.timer = new ResponseGame.Timer();
    // this.timer.setClockTime('00:00:00');
    // this.timer.setMode(H5P.Timer.FORWARD);

  }



  ResponseGame.prototype.createGameScreen = function () {
    const that = this;

    this.canvasSize = window.innerWidth/3.5;
    this.shapeDivSize = window.innerWidth/3;

    this.$gameScreen = $('<div class="game-screen"></div>');
    const $topDiv = $('<div class="top-div"></div>');
    const $questionContainer = $('<div class="question-container"></div>');
    const $shapeDiv = $('<div class="shape-div"></div>');
    this.$buttonContainer = $('<div class="predict-button-div"></div>');
    const $progressBar = $('<div class="progress-bar"></div>');

    const $scoreDiv = $('<div class="score-div"><span>Score</span></div>');
    const $timerDiv = $('<div class="timer-div"><span>Time : </span><time role="timer" datetime="PT00H00M0S">00:00:00</time></div>');
    this.$question = $('<p class="question"></p>');
    this.$questProgress = $('<div class="quest-progress"></div>');
    this.$progress = $('<div class="progress"></div>');
    this.$questProgress.css('width', this.canvasSize+3+'px');
    this.$canvas = $('<canvas height="'+this.canvasSize+'px" width="'+this.canvasSize+'px"></canvas>')
    this.$correctButton = $('<button class="score-button">Yes</button>');
    this.$inCorrectButton = $('<button class="score-button">No</button>');

    this.timer = new ResponseGame.Timer($timerDiv.find('time')[0]);
    that.createQuestion();

    this.timer.play();

    $scoreDiv.appendTo($topDiv);
    $timerDiv.appendTo($topDiv);

    this.$question.appendTo($questionContainer);
    this.$progress.appendTo(this.$questProgress);

    this.$canvas.appendTo($shapeDiv);
    this.$questProgress.appendTo($shapeDiv);
    // this.$correctButton.appendTo(this.$buttonContainer);
    // this.$inCorrectButton.appendTo(this.$buttonContainer);

    $topDiv.appendTo(this.$gameScreen);
    $questionContainer.appendTo(this.$gameScreen);
    $shapeDiv.appendTo(this.$gameScreen);
    // this.$buttonContainer.appendTo(this.$gameScreen);
    $progressBar.appendTo(this.$gameScreen);

    this.$gameScreen.appendTo(that.$container);

  };

  ResponseGame.prototype.drawShape = function(){

    const that = this;
    that.createShape();
    that.$question.append(that.questions[that.currentShapeIndex]);
    that.currentShape =   that.questShapes[that.currentShapeIndex];
    that.currentShape.draw(that.$canvas, that.$container);
    console.log(that.currentShape.isAnswer);
    that.$buttonContainer.empty();
    that.$correctButton.addClass((that.currentShape.isAnswer)+'-answer').appendTo(that.$buttonContainer);;
    that.$inCorrectButton.addClass((!that.currentShape.isAnswer)+'-answer').appendTo(that.$buttonContainer);;

    that.$buttonContainer.appendTo(that.$gameScreen);
    that.currentShapeIndex++;

    that.currentShape.on('drawNext',function(){
      // console.log('coming');
      that.drawNext();
      that.$progress.css('width','0');
      that.$progress.css('transition','none');
    });

    that.currentShape.on('attempted',function(e,isCorrect){
      // console.log(isCorrect);

      that.drawNext();
      that.$progress.css('width','0');
      that.$correctButton.addClass('disabled');
      that.$inCorrectButton.addClass('disabled');
    });

    that.$buttonContainer.find('.score-button').on('click',function(){

      that.currentShape.timer.stop();

      if($(this).hasClass('true-answer')){
        that.currentShape.status = 'correct';
      }
      else{
        that.currentShape.status = 'incorrect';
      }

      that.$correctButton.attr('disabled',true);
      that.$inCorrectButton.attr('disabled',true);
      that.drawNext();

    });
  }

  ResponseGame.prototype.drawNext = function(){

    const that = this;

    if(that.currentShapeIndex < that.questShapes.length){
      // adding some delay
      setTimeout(function(){
          that.createQuestion();
          that.drawShape();
      },100);

    }
    else{
      that.$container.empty()
      that.appendFinalScreen(that.$container);
    }
  }

  ResponseGame.prototype.appendFinalScreen = function($container){

    const that = this;

    $('<h1>Hello</h1>').appendTo($container);

    that.$list = $('<table />').appendTo($container);

    that.shapesArray.forEach(function(shape,index){
      $('<tr><td>'+index+'</td><td>'+shape.status+'</td>\
      <td>'+shape.timer.getTime()+'</td></tr>').appendTo(that.$list);
    });

  }

  ResponseGame.prototype.startGame = function (currentLevel) {
    const that = this;
    that.$container.empty();
    this.currentLevel = currentLevel;
    that.createGameScreen();
    this.currentShapeIndex = 0;
    // that.drawShape();
  };
  ResponseGame.prototype.createTitleScreen = function () {
    const that = this;
    const $titleScreen = $('<div class="title-screen"></div>');
    const $levelSelectText = $('<p class="lvl-select-txt">Choose the difficulty level</p>');
    const $levelSelectContainer = $('<div class="btn-group" data-toggle="buttons"></div>');
    const $easyLvl = $('<button class="btn btn-easy" value="easy">Easy</button>');
    const $mediumLvl = $('<button class="btn btn-medium" value="medium">Medium</button>');
    const $hardLvl = $('<button class="btn btn-hard" value="hard">Hard</button>');

    let clicked = 0;
    let currentTargetVal = '';
    $easyLvl.appendTo($levelSelectContainer);
    $mediumLvl.appendTo($levelSelectContainer);
    $hardLvl.appendTo($levelSelectContainer);

    $levelSelectContainer.children().on('click', function (e) {
      currentTargetVal = e.currentTarget.value;
      clicked = 1;
    });
    const $startButton = UI.createButton( {
      title: 'start button',
      'text': 'Start',
      'class': 'start-button',
      click: function(){
        if (clicked === 1) {
            that.startGame(currentTargetVal);
        }
      }
    });

    $levelSelectText.appendTo($titleScreen);
    $levelSelectContainer.appendTo($titleScreen);
    $startButton.appendTo($titleScreen);

    return $titleScreen;
  };
  ResponseGame.prototype.attach = function ($container) {
    const that = this;
    this.$container = $container;
    this.$container.addClass('h5p-response-game');
    this.$container.append(that.createTitleScreen());
  };
  return ResponseGame;

})(H5P.jQuery, H5P.JoubelUI);

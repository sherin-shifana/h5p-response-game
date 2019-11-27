H5P.ResponseGame = (function ($, UI) {

  function ResponseGame(options, id) {
    this.options = options;
    this.id = id;

    this.maxOptions=this.options.maxOptions;
    this.maxAnswers=this.options.maxAnswers;
    this.minAnswers= this.options.minAnswers;
    this.maxTime = this.options.maxTime;
    this.colors = this.options.colors;
    this.shapes = ["triangle", "circle", "square"];
    this.score = 0;
    this.shapesArray = [];
    this.answerArray = [];
    this.questionArray = [];
    this.questShapes = [];
  }

  ResponseGame.prototype.createAnswer = function () {
    const that = this;
    this.getRandomElm = arr => arr[Math.floor(Math.random() * arr.length)];
    for (let i = 0; i < that.maxOptions; i++) {
      const rColor = this.getRandomElm(this.colors);
      const rShape = this.getRandomElm(this.shapes);
      const array = this.colors.concat(this.shapes);
      H5P.shuffleArray(array);
      this.answer = {'color':null, 'shape':null};
      if (that.currentLevel === 'easy') {
        const obj = this.getRandomElm(array);
        this.colors.includes(obj) ? (this.answer.color = obj , this.question = 'The color of the shape is '+obj) :
          (this.answer.shape = obj, this.question = 'Is it a '+obj);
      }
      else if (that.currentLevel === 'medium' || that.currentLevel === 'hard') {
        this.answer.color = rColor;
        this.answer.shape = rShape;
        this.question = 'Is it a '+rShape+ ' with '+rColor+' color?';
      }
      that.answerArray.push(this.answer);
      that.questionArray.push(this.question)
    }
    // console.log(that.answerArray, that.questionArray);


  };

  ResponseGame.prototype.createShapeArray = function () {
    const that = this;
    let correctAnswerCount = 0;
    // console.log(that.shapesArray.length);
    while (that.shapesArray.length < that.maxOptions) {
      let rColor = that.colors[Math.floor(Math.random()*that.colors.length)];
      let rShape = that.shapes[Math.floor(Math.random()*that.shapes.length)];
      let answer = that.answerArray[this.shapesArray.length];
      this.shape = {'color' : rColor, 'shape' : rShape};
      if (answer.color === null) {
        (answer.shape === rShape) ? (this.shape['isAnswer'] = true, correctAnswerCount+=1) : (this.shape['isAnswer'] = false);
      }
      else if (answer.shape === null) {
        // console.log("s");
        (answer.color === rColor) ? (this.shape['isAnswer'] = true, correctAnswerCount+=1) : (this.shape['isAnswer'] = false);
      }
      else {
        (answer.color === rColor && answer.shape === rShape) ? (this.shape['isAnswer'] = true, correctAnswerCount+=1) : (this.shape['isAnswer'] = false);
      }
      that.shapesArray.push(this.shape);
    }

    while (correctAnswerCount < that.minAnswers) {
      let rIndex = Math.floor(Math.random()*that.answerArray.length);
      let ans = that.answerArray[rIndex];
      if (ans.color === null) {
        that.shapesArray[rIndex] = Object.assign({},{'color':that.colors[Math.floor(Math.random()*that.colors.length)]},{'shape':ans.shape},{'isAnswer':true});
      }
      else if (ans.shape === null) {
        that.shapesArray[rIndex] = Object.assign({},{'color':ans.color},{'shape':that.shapes[Math.floor(Math.random()*that.shapes.length)]},{'isAnswer':true});
      }
      else {
        that.shapesArray[rIndex] = Object.assign({},ans,{'isAnswer':true});
      }
      correctAnswerCount+=1;
    }

    for (var i = 0; i < that.shapesArray.length; i++) {
      // console.log(that.shapesArray[i], that.currentLevel);
      that.questShapes.push(new ResponseGame.Shape(that.shapesArray[i], that.currentLevel));
    }
  };

  ResponseGame.prototype.createProgressBar = function () {
    const that = this;
    let $bar, $tooltip, tooltip;
      $bar = $('<div>', { 'class': 'progress-bar' });
      $bar.hide();

      $tooltip = $('<div>', { 'class': 'tooltip' });
      tooltip = '5/10';
      $tooltip.html(tooltip);
      // $bar.append($tooltip);

      return $bar;
  };
  ResponseGame.prototype.createGameScreen = function () {
    const that = this;

    this.canvasSize = window.innerWidth/3.5;
    this.shapeDivSize = window.innerWidth/3;
    this.totalResponseTime = 0;
    this.$gameScreen = $('<div class="game-screen"></div>');
    const $topDiv = $('<div class="top-div"></div>');
    const $questionContainer = $('<div class="question-container"></div>');
    this.$avgResponseTime = $('<div class="response-time">Avg response time  <span>0ms</span></div>');
    this.$shapeDiv = $('<div class="shape-div"></div>');
    this.$buttonContainer = $('<div class="predict-button-div"></div>');
    this.$progressBar = that.createProgressBar();
    this.$progressBar.show();
    this.$scoreDiv = $('<div class="score-div">Score <span>'+that.score+'</span></div>');
    this.$timerDiv = $('<div class="timer-div"></div>');
    this.$timer = $('<div class="timer">Time <span><time role="timer" datetime="PT00H00M0S">00:00:00</time></span></div>').appendTo(this.$timerDiv);
    this.$question = $('<p class="question"></p>');
    this.$questProgress = $('<div class="quest-progress"></div>');
    this.$progress = $('<div class="progress"></div>');
    this.$questProgress.css('width', this.canvasSize+3+'px');
    this.$canvas = $('<canvas height="'+this.canvasSize+'px" width="'+this.canvasSize+'px"></canvas>')
    this.$correctButton = $('<button class="score-button">Yes</button>');
    this.$inCorrectButton = $('<button class="score-button">No</button>');

    this.timer = new ResponseGame.Timer(this.$timerDiv.find('time')[0]);
    this.timer.play();

    this.$scoreDiv.appendTo($topDiv);
    this.$timerDiv.appendTo($topDiv);

    this.$question.appendTo($questionContainer);
    this.$progress.appendTo(this.$questProgress);

    this.$canvas.appendTo(this.$shapeDiv);
    this.$questProgress.appendTo(this.$shapeDiv);
    // this.$correctButton.appendTo(this.$buttonContainer);
    // this.$inCorrectButton.appendTo(this.$buttonContainer);
    this.$avgResponseTime.appendTo(this.$timerDiv);
    $topDiv.appendTo(this.$gameScreen);

    $questionContainer.appendTo(this.$gameScreen);
    this.$shapeDiv.appendTo(this.$gameScreen);
    // this.$buttonContainer.appendTo(this.$gameScreen);


    this.$gameScreen.appendTo(that.$container);

  };

  ResponseGame.prototype.drawShape = function(){

    const that = this;
    that.$question.empty();
    that.$scoreDiv.find('span').empty();
    that.$avgResponseTime.find('span').empty();
    that.$progressBar.css('width', (that.currentShapeIndex/that.maxOptions)*100 + '%');
    that.$question.append(that.questionArray[that.currentShapeIndex]);
    that.currentShape =  that.questShapes[that.currentShapeIndex];
    that.currentShape.draw(that.$canvas, that.$container);

    that.$buttonContainer.empty();
    that.$correctButton.addClass((that.currentShape.isAnswer)+'-answer').appendTo(that.$buttonContainer);;
    that.$inCorrectButton.addClass((!that.currentShape.isAnswer)+'-answer').appendTo(that.$buttonContainer);;
    // console.log(that.currentShape.isAnswer, !that.currentShape.isAnswer);
    that.$buttonContainer.appendTo(that.$gameScreen);
    that.$progressBar.appendTo(that.$gameScreen);
    that.currentShapeIndex++;

    that.currentShape.on('drawNext',function(){
      that.drawNext();
      that.$progress.css('width','100%');
      that.$progress.css('transition','none');
    });

    that.currentShape.on('attempted',function(e,isCorrect){
      // console.log(isCorrect);

      that.drawNext();
      that.$progress.css('width','100%');
      that.$correctButton.addClass('disabled');
      that.$inCorrectButton.addClass('disabled');
    });


    that.$buttonContainer.find('.score-button').on('click',function(){

      that.currentShape.timer.stop();
      that.$progress.css('width','100%');
      that.$progress.css('transition','none');
      that.clickCount++;
      that.rTime = that.currentShape.totalTime - that.currentShape.timer.getTime();
      // console.log(that.rTime);
      that.totalResponseTime += that.rTime;

      if($(this).hasClass('true-answer')){
        that.score+=1;
        that.currentShape.status = 'correct';

        $(this).addClass('correct-answer');
      }
      else{
        // console.log("false");
        that.currentShape.status = 'incorrect';
        $(this).addClass('incorrect-answer');
      }
      // console.log(that.currentShape.status);
      // that.$correctButton.attr('disabled',true);
      // that.$inCorrectButton.attr('disabled',true);
      that.drawNext();

    });
    that.$scoreDiv.find('span').append(that.score);
    if (that.rTime) {
      that.$avgResponseTime.find('span').append(that.rTime+'ms');
    }


  }

  ResponseGame.prototype.drawNext = function(){

    const that = this;
    if(that.$correctButton.attr('class').includes('true-answer')) {
      // console.log("true");
      that.$correctButton.removeClass('true-answer');

    }
    else if (that.$correctButton.attr('class').includes('false-answer')) {
      that.$correctButton.removeClass('false-answer');
    }

    if (that.$inCorrectButton.attr('class').includes('true-answer')) {
      that.$inCorrectButton.removeClass('true-answer');
    }
    else if (that.$inCorrectButton.attr('class').includes('false-answer')) {
      that.$inCorrectButton.removeClass('false-answer');
    }
    // that.$correctButton.removeClass('correct-answer');
    // that.$correctButton.removeClass('incorrect-answer');
    // that.$inCorrectButton.removeClass('correct-answer');
    // that.$inCorrectButton.removeClass('incorrect-answer');
    if(that.$correctButton.hasClass('correct-answer')) {
      console.log("correct");
      setTimeout(function(){that.$correctButton.removeClass('correct-answer');}, 200);
    }
    else if (that.$correctButton.hasClass('incorrect-answer')) {
      console.log("incorrect");
      setTimeout(function(){that.$correctButton.removeClass('incorrect-answer');}, 200);
    }

    if (that.$inCorrectButton.hasClass('correct-answer')) {
      setTimeout(function(){that.$inCorrectButton.removeClass('correct-answer');}, 200);
    }
    else if (that.$inCorrectButton.hasClass('incorrect-answer')) {
      setTimeout(function(){that.$inCorrectButton.removeClass('incorrect-answer');}, 200);
    }

    if(that.currentShapeIndex < that.questShapes.length){
      // adding some delay
      setTimeout(function(){
          that.drawShape();
      },100);

    }
    else{
      that.$container.empty()
      that.appendFinalScreen(that.$container);
    }
  }

  ResponseGame.prototype.resetTask = function () {
    const that = this;
    that.$container.empty();
    that.score = 0;
    that.currentLevel = '';
    that.shapesArray.length=0;
    this.answerArray.length = 0;
    this.questionArray.length = 0;
    this.questShapes.length = 0;
    that.rTime =0
    that.attach(that.$container);
  };


  ResponseGame.prototype.appendFinalScreen = function($container){

    const that = this;
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    let total = 0;
    let totalTime;

    that.questShapes.forEach(function(shape,index){
      if (shape.status === 'correct') {
        correct++;
      }
      else if (shape.status === 'incorrect') {
        incorrect++;
      }
      else {
        skipped++;
      }

      totalTime = shape.totalTime;
      // $('<tr><td>'+index+'</td><td>'+shape.status+'</td>\
      // <td>'+shape.timer.getTime()+'</td></tr>').appendTo(that.$list);
    });


    $('<h1 class="message">Finished!</h1>').appendTo($container);
    const $progressBar = $('<div></div>').appendTo($container);
    this.$scoreBar = UI.createScoreBar(that.maxOptions);
    that.$scoreBar.setScore(correct);
    this.$scoreBar.appendTo($container);
    const $timeSpent = $('<div class="time-spent">Time <span>'+that.$timerDiv.find('time')[0].innerText+'</span></div>').appendTo($container);
    that.$resultDiv = $('<div class="result-div"></div>').appendTo($container);
    const $leftDiv = $('<div class="left-div"></div>').appendTo(that.$resultDiv);
    const $rightDiv = $('<div class="right-div"></div>').appendTo(that.$resultDiv);
    if (that.totalResponseTime>0) {
      this.avgResponseTime = Math.round(that.totalResponseTime/(correct+incorrect));
    }
    else {
      this.avgResponseTime = 0;
    }

    console.log(that.avgResponseTime, totalTime);
    let progress= (that.avgResponseTime/totalTime)*100;
    const $responseTimeDiv = $('<div>Average Reaction Time</div>').appendTo($leftDiv);
    $('<div class="response-progress"><span class="avg-time">'+that.avgResponseTime+'ms </span><span class="feedback"> </span>'+
    '<div class="progress-outbar">'+'<div class="progress"></div>'+'</div></div>').appendTo($responseTimeDiv);

    $leftDiv.find('.progress').css('width', progress+'%');
    if (progress===0) {
      $responseTimeDiv.find('.feedback').append('<b>Are you sleeping?</b>');

    }
    else if (progress>0 && progress <= 20) {
      $leftDiv.find('.progress').css('background-color','green');
      $responseTimeDiv.find('.feedback').append('Good').css('color','green');
    }
    else if (progress > 20 && progress <= 60) {
      $leftDiv.find('.progress').css('background-color','#ffa241');
      $responseTimeDiv.find('.feedback').append('Moderate').css('color','#ffa241');
    }
    else {
      $leftDiv.find('.progress').css('background-color','red');
      $responseTimeDiv.find('.feedback').append('Bad').css('color','red');
    }

    $('<p>Skipped questions :'+skipped+'</p>').appendTo($rightDiv);
    $('<p>Correct answers :'+correct+'</p>').appendTo($rightDiv);
    $('<p>Incorrect answers :'+incorrect+'</p>').appendTo($rightDiv);

    that.$retryButton = UI.createButton({
      title: 'retry',
      'text': 'Retry',
      'class': 'retry-button',
      click: function() {
        that.resetTask();
      }
    }).appendTo($container);
  }

  ResponseGame.prototype.startGame = function (currentLevel) {
    const that = this;
    console.log(currentLevel);
    that.$container.empty();
    this.currentLevel = currentLevel;
    that.createGameScreen();
    that.createAnswer();
    that.createShapeArray();
    this.currentShapeIndex = 0;
    this.totalTime = 0;
    this.clickCount = 0;
    that.$avgResponseTime.find('span').empty();
    that.drawShape();
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

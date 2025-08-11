const levels = {
  level1 : { key:'level1', label: 'Level 1', low: 3, high: 4, margin: 16, baseScore: 1000 },
  level2 : { key:'level2', label: 'Level 2', low: 4, high: 4, margin: 16, baseScore: 2000 },
  level3 : { key:'level3', label: 'Level 3', low: 3, high: 6, margin: 12, baseScore: 3000 },
  level4 : { key:'level4', label: 'Level 4', low: 4, high: 5, margin: 14, baseScore: 4000 },
  level5 : { key:'level5', label: 'Level 5', low: 4, high: 6, margin: 12, baseScore: 5000 },
  level6 : { key:'level6', label: 'Level 6', low: 4, high: 7, margin: 10, baseScore: 6000 },
  level7 : { key:'level7', label: 'Level 7', low: 5, high: 6, margin: 12, baseScore: 7000 },
  level8 : { key:'level8', label: 'Level 8', low: 4, high: 8, margin: 8, baseScore: 8000 },
  level9 : { key:'level9', label: 'Level 9', low: 6, high: 6, margin: 12, baseScore: 9000 },
  level10 : { key:'level10', label: 'Level 10', low: 5, high: 8, margin: 8, baseScore: 10000 },
  level11 : { key:'level11', label: 'Level 11', low: 6, high: 7, margin: 10, baseScore: 11000 },
  level12 : { key:'level12', label: 'Level 12', low: 6, high: 8, margin: 8, baseScore: 12000 },
  level13 : { key:'level13', label: 'Level 13', low: 5, high: 10, margin: 6, baseScore: 13000 },
  level14 : { key:'level14', label: 'Level 14', low: 7, high: 8, margin: 8, baseScore: 14000 },
  level15 : { key:'level15', label: 'Level 15', low: 4, high: 15, margin: 2, baseScore: 15000 },
  level16 : { key:'level16', label: 'Level 16', low: 8, high: 8, margin: 8, baseScore: 16000 },
};

const timer = {
  paused: true,
  timeElapsed: 0,
  start: function(){
    window.setInterval(function(){
      if(!timer.paused){
        timer.timeElapsed++;
        document.getElementById('timer').innerText = timer.getAsString();
      }
    },10);
  },
  pause: function(){
    this.paused = true;
  },
  resume: function(){
    this.paused = false;
  },
  reset: function(){
    this.timeElapsed = 0;
  },
  getTime: function(){
    return this.timeElapsed;
  },
  getAsString: function(){
    const minutes = String(Math.floor(this.timeElapsed/6000)).padStart(2, '0');
    const seconds = String(Math.floor((this.timeElapsed%6000)/100)).padStart(2, '0');
    const miliSeconds = String(Math.floor((this.timeElapsed%6000)%100)).padStart(2, '0');
    return `${minutes}:${seconds}:${miliSeconds}`;
  }

};

const clickCounter = {
  clicks: 0,
  print: function(){
    document.getElementById('clicks').innerText = this.clicks;
  },
  countClick: function(){
    this.clicks++;
    this.print();
  },
  getClicks: function(){
    return this.clicks;
  },
  reset: function(){
    this.clicks = 0;
    this.print();
  }
};

const screen = (function(){
  return {
    canvasMaxHeight : function() { return window.innerHeight - 80; },
    canvasMaxWidth : function() { return window.innerWidth; },
    orientationPortrait: function() { return window.innerHeight > window.innerWidth; },
    calculateBoxWidth: function(level) {
      const potentialWidth = Math.floor((this.canvasMaxWidth()/(this.orientationPortrait() ? level.low : level.high)) - ((level.margin*2)+2));
      const potentialHeight = (potentialWidth + (level.margin * 2) +2) * (this.orientationPortrait() ? level.high : level.low);

      if(this.canvasMaxHeight() < potentialHeight){
        return Math.floor((this.canvasMaxHeight()/(this.orientationPortrait() ? level.high : level.low)) - ((level.margin*2)+2));
      } else {
        return potentialWidth;
      }

    },
    calculateCanvasWidth : function(level,boxWidth){
      return (boxWidth+ (level.margin * 2) + 2) * (this.orientationPortrait() ? level.low : level.high);
    }
  }
})();

const fn = {
  removeSubset: function(A, B) {
    return A.filter(item => !B.includes(item));
  },
  playSound: function(event) {
    const audio = new Audio(`./sounds/${event}.mp3`);
    audio.play();
  },
  sort: function (arr, prop, ascending = true) {
    return arr.sort((a, b) => {
      if (a[prop] < b[prop]) return ascending ? -1 : 1;
      if (a[prop] > b[prop]) return ascending ? 1 : -1;
      return 0;
    });
  }
};


const gameSetUp = {
  scoreBoardSize : 16,
  currentLevel : null,
  gridSize: 0,
  numberOfAvailableImages: 178,
  images: [],
  positions: [],
  setUp: function(level,rerun){
    this.currentLevel = level.key;
    this.gridSize  = level.low * level.high;

    this.images = [];
    for(let i=0; i < this.numberOfAvailableImages; i++){
      this.images.push(i);
    }

    this.positions = [];
    for(let i=0; i < this.gridSize; i++){
      this.positions.push(i);
    }
    this.rerun = rerun;
  },
  getImages: function(){
    return this.images;
  },
  getPositions: function(){
    return this.positions;
  },
  getRandomImageNumber: function(scope, sub){
    const tempSet = fn.removeSubset(scope,sub);
    const randomNumber = Math.floor(Math.random() * 1000) % tempSet.length;
    return tempSet[randomNumber];
  },
  getRandomPosition:function(scope,sub){
    const tempSet = fn.removeSubset(scope,sub);
    return tempSet[Math.floor(Math.random() * 1000) % tempSet.length];
  },
  pickPositions: function(){
    const returnable = [];
    for(let i = 0; i < this.gridSize; i++){
      returnable.push(this.getRandomPosition(this.positions,returnable));
    }
    return returnable;
  },
  pickImages : function(){
    const returnable = [];
    for(let i = 0; i < this.numberOfAvailableImages; i++){
      returnable.push(this.getRandomImageNumber(this.images,returnable));
    }
    return returnable;
  },
  getGridSize: function(){
    return this.gridSize;
  }
};

const render = {
  setScoreBoardTab : function(topScore){
    if(topScore){
      document.getElementById('score-board-tab').innerHTML = `<div class="animate-l-r ar-l"></div><div class="animate-r-l ar-r"></div><span>Score Board</span>`;
    } else {
      document.getElementById('score-board-tab').innerHTML = 'Score Board';
    }
  },
  newScore: function(score){

    let title =  '<h2>Score</h2>';

    if(score.highScore){
      title = '<h2 class="new-score-tiitle"><div class="animate-up-down ex-l"></div><div class="animate-up-down ex-r"></div><span>New High Score</span></h2>';
      this.setScoreBoardTab(true);
    }

    if(score.topScore){
      this.setScoreBoardTab(true);
    }

    return `<div id="your-score" class="visible">
      ${title}

      <table>
        <thead>
          <tr>
            <th>Clicks</th><th>Time</th><th>Score</th>
          </tr>
        </thead>
        <tbody>
            <td>${score.clicks}</td><td>${score.time}</td><td>${score.score}</td> </tr>
        </tbody>
      </table>
    </div>`;
  },
  scoreBoard : function(){
    this.setScoreBoardTab(false);
    const scores = JSON.parse(localStorage.getItem('scores'));
    if(scores === null){
      return `<div>
        No historical data available. Please play a game to make history.!
      </div>`;
    } else {
      let scoresHTML = '';
      for(let score of scores){
        scoresHTML += `<tr class="${score.topScore || score.highScore ? 'highlight' : ''}"> <td>${score.level}</td> <td class="text-center"> ${score.date} </td><td class="text-right">${score.clicks}</td><td class="text-center">${score.time}</td><td class="text-right">${score.score}</td> </tr>`
      }
      return `<table>
        <thead>
          <tr>
            <th>Level</th><th class="text-center">Date/Time</th><th class="text-right">Clicks</th><th class="text-center">Time</th><th class="text-right">Score</th>
          </tr>
        </thead>
        <tbody>
            ${scoresHTML}
        </tbody>
      </table>`;
    }

  },
  box: function(pos,imageNumber,width,height,margin){
    return `<div class="box" style="width:${width}px; height: ${height}px; margin: ${margin}px">
      <div class="image" data-pos="${pos}"><img src="./images/${imageNumber}.png" /> </div>
      <div class="lid" data-pos="${pos}" data-image="${imageNumber}"></div>
    </div>`
  },
  canvas: function(html){
    document.getElementById('canvas').innerHTML = html;
  },
  setCanvasWidth: function(canvasWidth){
    document.getElementById('canvas').style.width = `${canvasWidth}px`;
  },
  getLevelOptionsHTML: function(){
    let html = '';
    for(const key of Object.keys(levels)){
      html+=`<option value="${key}" ${ key === gameSetUp.currentLevel ? 'selected' : ''}>${levels[key].label}</option>`;
    }
    return html;
  }
};

const gamePlay = {
  resetScoreBoard : function(){
    const scores = JSON.parse(localStorage.getItem('scores'));
    if(scores !== null) {
      for(const score of scores) {
        score.topScore = false;
        score.highScore = false;
      }
      localStorage.setItem('scores',JSON.stringify(fn.sort(scores,'score',false)));
    }
  },
  isLidOpen: function(lid) {
    return lid.classList.contains('opened');
  },
  isPairDiscovered: function(lid) {
    return lid.classList.contains('discovered');
  },
  closeLid: function(lid){
    lid.classList.remove('opened');
  },
  openLid: function(lid){
    lid.classList.add('opened');
  },
  getOpenLids: function(){
    return document.getElementsByClassName('lid opened');
  },
  calculateScore: function(clicks, timeInMiliSeconds, matrixSize, weightClicks = 0.5, weightTime = 0.8) {
    if (matrixSize % 2 !== 0 || matrixSize < 12 || matrixSize > 64) {
      throw new Error("Matrix size must be an even number between 12 and 64.");
    }

    const date = new Date();
    const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()];
    const d = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const level = levels[gameSetUp.currentLevel];

    if(gameSetUp.rerun){
      return {
        date : `${date.getUTCFullYear()}-${month}-${d} ${hours}:${minutes}:${seconds}`,
        level : level.label,
        time : timer.getAsString(),
        clicks : clicks,
        score : 0,
        topScore : false,
        highScore: false,
      };
    }

    const pairs = matrixSize / 2;
    const targetClicks = pairs * 2; // 2 clicks per pair
    const targetTime = targetClicks * 0.4; // 400 ms per click → seconds

    const a = Math.log(2) / targetClicks;
    const b = Math.log(2) / targetTime;

    const clickScore = level.baseScore * Math.exp(-a * clicks);
    const timeScore = level.baseScore * Math.exp(-b * timeInMiliSeconds/100);

    const finalScore = Math.floor(clickScore * weightClicks + timeScore * weightTime);

    const scoreData = {
      date : `${date.getUTCFullYear()}-${month}-${d} ${hours}:${minutes}:${seconds}`,
      level : level.label,
      time : timer.getAsString(),
      clicks : clicks,
      score : finalScore,
      topScore : true,
      highScore: false,
    }
    const scores = JSON.parse(localStorage.getItem('scores'));

    if(scores === null){
      scoreData.highScore = true;
      localStorage.setItem('scores',JSON.stringify([scoreData]));
    } else {
      if(scores.length < gameSetUp.scoreBoardSize){
        const scoresSorted = fn.sort(scores,'score',false);
        if(finalScore >= scoresSorted[0].score){
          scoreData.highScore = true;
        }
        scoresSorted.push(scoreData);

        const scoresReSorted = fn.sort(scoresSorted,'score',false);
        localStorage.setItem('scores',JSON.stringify(scoresReSorted));

      } else {
        const scoresSorted = fn.sort(scores,'score',false);
        if(scoresSorted[gameSetUp.scoreBoardSize - 1].score < finalScore){
          if(finalScore >= scoresSorted[0].score){
            scoreData.highScore = true;
          }

          scoresSorted[gameSetUp.scoreBoardSize - 1] = scoreData;
          const scoresReSorted = fn.sort(scoresSorted,'score',false);
          localStorage.setItem('scores',JSON.stringify(scoresReSorted));

        } else {
          scoreData.newHighScore = false;
          scoreData.topScore = false;
        }
      }
    }

    return scoreData;
  },
  gameCompleted : function(){
    dialogBox.show();
    fn.playSound('applaud');
    timer.pause();

    const score = this.calculateScore(clickCounter.getClicks(),timer.getTime(),gameSetUp.getGridSize());

    document.getElementById('new-score-container').innerHTML = render.newScore(score);


  },
  markAsDiscovered: function(lid1, lid2){

    fn.playSound('discovered');
    gamePlay.closeLid(lid2);
    lid1.classList.add('discovered');
    lid2.classList.add('discovered');

    if(gamePlay.hasAllDiscovered()){
      this.gameCompleted();
    }
  },
  hasAllDiscovered: function(){
    return document.getElementsByClassName('discovered').length === gameSetUp.gridSize;
  },
  reset: function (){
    for(const lid of document.getElementsByClassName('lid')){
      if(lid.classList.contains('opened')){
        lid.classList.remove('opened');
      }

      if(lid.classList.contains('discovered')){
        lid.classList.remove('discovered');
      }
    }
  }
};

const dialogBox = {
  element: document.getElementById('dialog'),
  init: function(){

    const levelSelector = document.getElementById('level');
    const levelOptions = render.getLevelOptionsHTML();
    levelSelector.innerHTML = levelOptions;

    levelSelector.onchange = function(event){
      if(gameSetUp.currentLevel !== this.value || gamePlay.hasAllDiscovered()){
        document.getElementById('resume-btn').setAttribute('disabled','disabled');
        document.getElementById('reset-btn').setAttribute('disabled','disabled');
      } else {
        document.getElementById('resume-btn').removeAttribute('disabled');
        document.getElementById('reset-btn').removeAttribute('disabled');
      }
    }

    const actionsContainer = document.getElementById('actions');


    document.getElementById('new-game-btn').onclick = function(){
      document.getElementById('resume-btn').removeAttribute('disabled');
      document.getElementById('reset-btn').removeAttribute('disabled');
      render.setScoreBoardTab(false);
      gameSetUp.rerun = false;
      init({
        level: levelSelector.value
      });
      timer.reset();
      clickCounter.reset();
      dialogBox.close();
      gamePlay.resetScoreBoard();
      if(document.getElementById('your-score') !== null){
        document.getElementById('your-score').remove();
      }
      window.setTimeout(function(){
          timer.resume();
      },400);

    }

    document.getElementById('reset-btn').onclick = function(){
      gamePlay.reset();
      timer.reset();
      clickCounter.reset();
      dialogBox.close();
      render.setScoreBoardTab(false);
      gameSetUp.rerun = true;
      gamePlay.resetScoreBoard();
      if(document.getElementById('your-score') !== null){
        document.getElementById('your-score').remove();
      }
      window.setTimeout(function(){
          timer.resume();
      },400);
    }

    document.getElementById('resume-btn').onclick = function(){
      dialogBox.close();
      window.setTimeout(function(){
          timer.resume();
      },400);
    }


    for(const tab of document.getElementsByClassName('tab')){
      tab.onclick = function(){
        if(!this.classList.contains('active')){
          for(const activeTab of document.getElementsByClassName('tab active')){
            activeTab.classList.remove('active');
            document.getElementById(activeTab.dataset.target).classList.remove('active');
          }
          this.classList.add('active');
          document.getElementById(this.dataset.target).classList.add('active');

          if(this.dataset.target === 'scores'){
            document.getElementById('scores').innerHTML = render.scoreBoard();
          }
        }
      };
    }
  },
  show: function(){

    if(gamePlay.hasAllDiscovered()){
      document.getElementById('resume-btn').setAttribute('disabled','disabled');
    }

    if(!this.element.classList.contains('visible')){
      this.element.classList.add('visible');
      window.setTimeout(function(){
        document.getElementById('dialog-bg').classList.add('animate');
        document.getElementById('dialog-box').classList.add('animate');
      },100);

    }
  },
  close: function(){
    const dialog = this.element;
    if(this.element.classList.contains('visible')){
      document.getElementById('dialog-bg').classList.remove('animate');
      document.getElementById('dialog-box').classList.remove('animate');
      window.setTimeout(function(){
        dialog.classList.remove('visible');
      },400);

    }
  }
};



const init = function(game){
  function drawGrid(level,rerun = false){
    gameSetUp.setUp(level,rerun);
    const pickedImages = gameSetUp.pickImages();
    const pickedPositions = gameSetUp.pickPositions();
    const boxWidth = screen.calculateBoxWidth(level);
    const marginSize=level.margin;
    const canvasWidth = screen.calculateCanvasWidth(level,boxWidth);

    render.setCanvasWidth(canvasWidth);

    let imgPos = [];

    const numberOfImages = pickedPositions.length/2;

    for(let i = 0; i < pickedPositions.length ; i++){
      let j = i < numberOfImages ? i : i - numberOfImages;

      imgPos[pickedPositions[i]] = pickedImages[j];
    }

    let html = '';

    for(let j=0; j < gameSetUp.gridSize; j++) {
      html+=render.box(j,imgPos[j],boxWidth,boxWidth,marginSize);
    }

    render.canvas(html);

    for(const lid of document.getElementsByClassName('lid')){
      lid.onclick = function (event){

        if(!gamePlay.isPairDiscovered(this) && !gamePlay.isLidOpen(this)){
          clickCounter.countClick();
        }

        if(gamePlay.isPairDiscovered(this)){
          return;
        }

        const imageNumber = this.dataset.image;
        if(gamePlay.isLidOpen(this)){
          fn.playSound('close');
          gamePlay.closeLid(this);
        } else {
          let discovered = false;
          for(const el of gamePlay.getOpenLids()){
            if(el.dataset.image === imageNumber){
              gamePlay.markAsDiscovered(el,this);
              discovered = true;
            } else {
              gamePlay.closeLid(el);
            }
          }

          if(!discovered){
            fn.playSound('open');
            gamePlay.openLid(this);
          }
        }
      }
    }

  }

  let gridDrawn = false;

  drawGrid(levels[game.level]);

  document.getElementById('pause').onclick = function(event){
    dialogBox.show();
    timer.pause();
  }
};


init({
  level: 'level1'
});

dialogBox.init();
timer.start();

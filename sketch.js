var PLAY = 1;
var END = 0;

var gameState = PLAY;

var tower, towerImage, player1, player1_image, ghost, ghost_image;

var points, pointsImage, pointsGroup, obstacle, obstacle1, obstacle2, obstacle3, obstaclesGroup;

var score, coins, scoreSound, coinSound, gameoverSound;

var invisibleBlock1, invisibleBlock2;

var gameOver;

localStorage["HighestScore"] = 0;

function preload() {

  towerImage = loadImage("Track.jpg");
  player1_image = loadAnimation("b1.jpg", "b2.jpg", "b3.jpg", "b4.jpg", "b5.jpg", "b6 (2).jpg", "b7 (2).jpg", "b8 (2).jpg", "b9 (2).jpg", "b10 (2).jpg", "g1.jpg");
  ghost_image = loadAnimation("ghost-standing.png", "ghost-jumping.png");
  pointsImage = loadImage("download.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle.png");
  scoreSound = loadSound("woohoo.wav");
  coinSound = loadSound("cashRegister.wav");
  gameoverSound = loadSound("scream.wav");
  gameoverImage = loadImage("hg.png");
  
}

function setup() {
  createCanvas(600, 600);
  
  tower = createSprite(295, 300);
  tower.addImage(towerImage);
  tower.scale = 0.85;
  tower.velocityY = 10;

  player1 = createSprite(300, 420);
  player1.addAnimation("running", player1_image);
  player1.frameDelay = 3;
  player1.scale = 1.3;

  ghost = createSprite(300, 525);
  ghost.addAnimation("moving", ghost_image);
  ghost.scale = 0.5;
  
  invisibleBlock1=createSprite(20,300,40,600);
  invisibleBlock1.visible=false;
  
  invisibleBlock2=createSprite(580,300,40,600);  
  invisibleBlock2.visible=false;
  
  score = 0;
  coins = 0;

  pointsGroup = new Group();
  obstaclesGroup = new Group();

}

function draw() {
  background("black");

  ghost.x = player1.x;

  if (gameState === PLAY) {
    if (tower.y > 1200) {
      tower.y = 300;
    }

    if (player1.isTouching(pointsGroup)) {
      coins = coins + 6;
      pointsGroup.destroyEach();
      coinSound.play();
    }
    
     if(obstaclesGroup.isTouching(pointsGroup)){
      coins = coins + 6;
      pointsGroup.destroyEach();
    }

    if (keyDown(RIGHT_ARROW)) {
      player1.x = player1.x + 3;
    }

    if (keyDown(LEFT_ARROW)) {
      player1.x = player1.x - 3;
    }

    score = score + Math.round(getFrameRate() / 60);
    
    if(score%250===0){
      scoreSound.play(); 
    } 
    
    player1.collide(invisibleBlock1);
    
    player1.collide(invisibleBlock2);

    spawnCoin();
    spawnObstacles();

    drawSprites();
    fill("yellow");
    textSize(16);
    text("Coins: " + coins, 510, 40);

    fill("yellow");
    textSize(18);
    text("Score: " + score, 495, 25);


    if (player1.isTouching(obstaclesGroup)) {
      gameState = END;
      gameoverSound.play();
      ghost.x=player1.x;
    }
  }

  if (gameState === END) {
    
    textSize(40);
    fill("yellow");
    text("GAME OVER", 190, 300);

    if (localStorage["HighestScore"] < score) {
      localStorage["HighestScore"] = score;
    }

    text("Your Score: " + localStorage["HighestScore"], 170,200);
  
    }
  }

  function spawnCoin() {
    if (frameCount % 250 === 0) {
      points = createSprite(300, 10);
      points.addImage(pointsImage);
      points.x = Math.round(random(200, 400));
      points.scale = 0.6;
      points.velocityY = 4 + 2 * score / 150;
      points.lifetime = 800;
      pointsGroup.add(points);
    }
  }

  function spawnObstacles() {
    if (frameCount % 210 === 0) {
      obstacle = createSprite(300, 10);
      obstacle.velocityY = 4 + 2 * score / 150;

      obstacle.x = Math.round(random(150, 450));

      var rand = Math.round(random(1, 3));
      switch (rand) {
        case 1:
          obstacle.addImage(obstacle1);
          break;
        case 2:
          obstacle.addImage(obstacle2);
          break;
        case 3:
          obstacle.addImage(obstacle3);
          break;
        default:
          break;
      }
      obstacle.lifetime = 800;
      obstaclesGroup.add(obstacle);
    }
  }
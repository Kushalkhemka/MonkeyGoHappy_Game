//Declaration of Global Variables
var monkey,monkey_run,monkey_stop;
var banana ,banana_img;
var obstacle,obstacle_img;
var orange, orange_img;
//Group variables
var foodGroup,obsGroup,orangeGroup,birdsGroup;
//Score & losing system
var survivalTime,score,chances;
var ground,ground_img;
var gameOver,gameOver_img;
var restart,restart_img;
//Game States
var START=1;
var PLAY=2;
var END=0;
var gameState=START;
//sound variables
var longjump_sound;
var jumpSound;
var dieSound;
var checkPointSound;
var gameOverSound;
var bird,bird_img;
var music,music_button,neffex_music;

function preload()
{
  //To load monkey animation
  monkey_run =   loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  

  //To load banana and obstacle
  banana_img = loadImage("banana.png");
  obstacle_img = loadImage("obstacle.png");
  ground_img=loadImage("ground2.png");
  orange_img=loadImage("orange.png");
  gameOver_img=loadImage("gameover.png");
  restart_img=loadImage("restart.png");
  bird_anim=loadAnimation("b1.png","b2.png");
  music_button=loadImage("playMusic.png");

  //To load sounds  
  longjump_sound=loadSound("longjump.mp3");
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkPointSound=loadSound("checkPoint.mp3");
  gameOverSound=loadSound("gameOver.mp3");
  neffex_music=loadSound("neffex.mp3");
}



function setup() {
  //To create a canvas
  createCanvas(600,400);
  
  //To create monkey sprite
  monkey=createSprite(60,325,10,10);  
  monkey.addAnimation("run",monkey_run);
  //Scaling to adjust the animation
  monkey.scale=0.110;
  //monkey.debug=true;
  //To make monkey look like it is on the ground not outside it
  monkey.setCollider("rectangle",0,0,550,340);
  
  //To create ground sprite
  ground=createSprite(200,358,1200,8);
  ground.addImage(ground_img);
  
  //To declare new Groups
  foodGroup=new Group();
  obsGroup=new Group();
  orangeGroup=new Group();
  birdsGroup=new Group();
  
  //Initial value of survival Time
  survivalTime=10;
  //Initial value of score
  score=0;
  //Initial value of chances
  chances=3;
  
  //To create gameOver sprite
  gameOver=createSprite(300,150,10,10)
  gameOver.addImage(gameOver_img);
  gameOver.scale=1.5;
  
  //To create restart 
  restart=createSprite(305,220,10,10);
  restart.addImage(restart_img);
  restart.scale=0.3;
  
  //To create play music  button for reader
  music=createSprite(550,80,10,10);
  music.addImage(music_button);
  music.scale=0.1;
}


function draw()
{
  //To assign the background
  background("white");
  
  if(gameState===START)
  {
   //To make restart & game Over invisible
   gameOver.visible=false;
   restart.visible=false;
   music.visible=false;
    
   //Instructions for playing this game/USER GUIDE
   background("azure");
   fill("red");
   textSize(20);
   text("Read all the instructions carefully before playing:-",50,80);
   fill("red");
   textSize(16);
   text("1.Press Space Key to Start the Game",50,110);
   fill("black");
   text("2.Press UP Arrow Key for long jump",50,135);
   text("3.Press Space Key to Jump",50,160);
   text("4.Try to collect max oranges to get more survival time",50,190);
   text("5.Don't Let Survival Time 0 otherwise game will end",50,220);
   text("6.Collect bananas to score and get survival time",50,250);
   text("7.Avoid the obstacles otherwise you will lose 1 chance from 3",50,280);
   text("8.Try to Score high, With more score game will get more difficult",50,310);
   text("9.Avoid Long Jump unnecessary as it decrease survival time",50,340);
   text("10.Avoid birds also otherwise you will again lose 1 chance from 3",50,370)
    
   textSize(20);
   text("ALL THE BEST!!",240,395);
   
   //To make monkey & ground invisible during start state
   monkey.visible=false;
   ground.visible=false;

   //Condition for entering in PLAY state
   if(keyDown("space")&&gameState===START)
   {
     gameState=PLAY;
   }
   
  }
  else if(gameState===PLAY)
  {
    //To make monkey & ground visible during PLAY state
    ground.visible=true;
    monkey.visible=true;
    //To make play button visible
    music.visible=true;
    
    //To increase the ground speed with increasement in score
    ground.velocityX=-(4+score/10);
    
    //Adding background changing effect
    if(score%10===0)
    {
      background("yellow");
    }else if(score%5===0)
    {
      background("lightgreen");
    }else if(score%8===0)
    {
      background("pink");
    }
    
    //To make the monkey jump to surmount obstacles
    if(keyDown("space")&&monkey.y>320)
    { 
      //To assign upward velocity to monkey
      monkey.velocityY=-11;
      jumpSound.play();
    }
    
    //To make monkey long jump to collect oranges
    else if(keyDown("UP_ARROW")&&monkey.y>320)
    {
      //To make monkey move up
      monkey.velocityY=-16.5;
      //Monkey get hungry and survival time decrease with long jump
      survivalTime=survivalTime-1;
      //To play long jump sound
      longjump_sound.play();
    } 
    
    //To add gravity 
    monkey.velocityY=monkey.velocityY+0.5;
    
    //To increase the score when monkey touches banana
    if(monkey.isTouching(foodGroup))
    {
      foodGroup.destroyEach();
      score=score+2;
      survivalTime=survivalTime+5;
    }
    
    //To add bonus to score when monkey touches oranges
    if(monkey.isTouching(orangeGroup))
    {
      orangeGroup.destroyEach();
      score=score+5;
      survivalTime=survivalTime+10;
    } 
    
    
    //To decrease survival time with frame rate
    if(frameCount%110===0)
    {
      survivalTime=survivalTime-1;
    }
    
    //To detect and decrease the chanes when monkey touches any       obstacles
    if(monkey.isTouching(obsGroup))
    {
      chances=chances-1;
      obsGroup.destroyEach();
      dieSound.play();
    }
    
    //To detect and decrease the chances if monkey touches the bird
    if(monkey.isTouching(birdsGroup))
    {
      chances=chances-1;
      birdsGroup.destroyEach();
      dieSound.play();
    }
    
    //To play a beep sound in multiple of 20 i.e.20,40,60,80
    if(score>0&&score%20===0)
    {
      //Adding beep sound 
      checkPointSound.play();
    }
    
    //To call other functions in draw function for execution
    obstacles();
    food();
    bonusFood();
    trex_bird();
  }
  else if(gameState===END)
  {
    //To make restart & game Over visible
    gameOver.visible=true;
    restart.visible=true;
    //To make play button also invisible
    music.visible=false;
    
    //Destroying objects and setting up their velocity 0 when the     game ends
    ground.velocityX=0
    foodGroup.setVelocityEach(0);
    foodGroup.destroyEach();
    orangeGroup.setVelocityEach(0);
    orangeGroup.destroyEach();
    obsGroup.setVelocityEach(0);
    obsGroup.destroyEach();
    birdsGroup.setVelocityEach(0);
    birdsGroup.destroyEach();
  }
  
  if(ground.x<0)
  {
    //To give infinite scrolling effect to ground
    ground.x=ground.width/2;
  }

  //To make monkey collide with the ground
  monkey.collide(ground);
  
  //End state condition
  if(chances===0||survivalTime===0)
  {
    gameState=END;
  }
  
  //To restart the game when clicked on restart button
  if(mousePressedOver(restart))
  {
    //Calling restart function
    reset();
  }
  
  //To configure music play button
  if(mousePressedOver(music))
  {
    //Playing neffex cold when play button pressed
    neffex_music.play();
  }
  
  //To draw the sprites
  drawSprites();
  
  //Displaying scoring & losing system
  fill("black");
  textSize(18);
  text("Score Board: "+score,20,35);
  text("Survival Time: "+survivalTime,450,35);
  text("Chances: "+chances,250,35);
  
  
}


function obstacles()
{
  //To make obstacles appear at interval of 130 frames
  if(frameCount%170===0)
  {
  //To create obstacle sprite
  obstacle=createSprite(600,330,10,10);
  //To add image to banana
  obstacle.addImage(obstacle_img);
  //Scaling to adjust banana
  obstacle.scale=0.15;
  //To assign velocity to banana
  obstacle.velocityX=-(4+score/15);
  //To assign lifetime to banana to avoid memory leaks
  obstacle.lifetime=155;
  //Adding obstacles to obsgroup
  obsGroup.add(obstacle);
  }
}

function food()
{
  //To make banana appear at interval of 150 frames
  if(frameCount%150===0)
  {
    //To create banana sprite
    banana=createSprite(600,Math.round(random(120,270)),10,10);
    //To add image to banana
    banana.addImage(banana_img);
    //To assign velocity to banana
    banana.velocityX=-(3.5+score/10);
    //Scaling to adjust image
    banana.scale=0.1;
    //To assign lifetime to banana
    banana.lifetime=200;
    //Add banana to foodgroup
    foodGroup.add(banana);
  }
  
}

function bonusFood()
{
  //To make orange appear at interval of 250 frames
  if(frameCount%250===0)
  {
  //To create orange sprite
  orange=createSprite(600,Math.round(random(40,150)),10,10);
  //To add image to orange 
  orange.addImage(orange_img);
  //Scaling to adjust the image
  orange.scale=0.015;
  //To assign velocity to orange
  orange.velocityX=-(5+score/8);
  //To assign lifetime to orange
  orange.lifetime=120;
  //To add orange to orangegroup
  orangeGroup.add(orange);
  }
}

function trex_bird()
{
  //To make bird appear at interval  of 225 frames
  if(frameCount%225===0)
  {
    //To create bird sprite
    bird=createSprite(600,Math.round(random(30,180)),10,10);
    //To add image to bird
    bird.addAnimation("fly",bird_anim);
    //Scaling of adjust the bird image
    bird.scale=0.35;
    //To assign velocity to bird
    bird.velocityX=-(5.5+score/8);
    //To assign lifetime to bird
    lifetime=110;
    //To add bird to birdsGroup
    birdsGroup.add(bird);
  }
}


function reset()
{
  //Initial 
  gameState=PLAY;
  score=0;
  chances=3;
  survivalTime=10;
  gameOver.visible=false;
  restart.visible=false;
}


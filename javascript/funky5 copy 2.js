// Create the canvas
var canvas = document.createElement("canvas");

//var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");
//var viewportWidth = window.innerWidth;
//var viewportHeight = window.innerHeight;
canvas.width = 1000;
canvas.height = 500;




document.body.appendChild(canvas);

// load spritesheets sector 5.1

var spriteSheet = [ "images/baby.png" , "images/firefox.png " ];
var currentHero = 0;

// preload sprite images sector 5.2
for (var i = 0; i < spriteSheet.src; i++) {
	var i = new Image();
	i.src = spriteSheet[i]; 
}



// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/blackbg.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/char1.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";





// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	speedX: 0,
	speedY: 0,
};
var monster = {
	hit: false
};
var monstersCaught = 0;



// hero offset object
var offset = {
	x: 0,
	y: 0
};

// projectile object
var playerBullets = [];

function Bullet(I){
	I.active = true;
	I.xVelocity = 0;
	I.yVelocity = 0;
	I.width = 3;
	I.height = 3;
	I.color = "#FF0000";

	I.travel = function(){
		if (I.sx === 0 && I.sy === 0){
			I.xVelocity = 0;
			I.yVelocity = 10;
		}
		else if (I.sx > 0 && I.sy === 0){
			I.xVelocity = 10;
			I.yVelocity = 0;
		}
		else if (I.sx < 0 && I.sy === 0){
			I.xVelocity = -10;
			I.yVelocity = 0;
		}
		else if (I.sx == 0 && I.sy > 0){
			I.xVelocity = 0;
			I.yVelocity = 10;
		}
		else if (I.sx == 0 && I.sy < 0){
			I.xVelocity = 0;
			I.yVelocity = -10
		}	
	}

	I.inBounds = function() {
		return I.x >= 0 && I.x <= canvas.width &&
		   I.y >= 0 && I.y <= canvas.height;
	};
	
	I.draw = function() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height)
	};
	
	I.update = function() {
		I.x += I.xVelocity;
		I.y += I.yVelocity;
		
		I.active = I.active && I.inBounds();
	}
	
	return I;
}
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

function collides(a, b) {
	return 	a.x < b.x + 32 &&
		a.x + 32 > b.x &&
		a.y < b.y + 32 &&
		a.y + 32 > b.y;
}

function handleCollisions() {
	playerBullets.forEach(function(bullet) {
	  //enemies.forEach(function(enemy) {
		if(collides(bullet, monster)) {
			++ monstersCaught;
			monster.hit = true;
			//reset();
			bullet.active = false;
		}
	 // });
	});
}

/*====================================================   update  function 	===============================================*/

var update = function (modifier) {
	
	//var speedX = 0
	//var speedY = 0
	
	
	if (38 in keysDown) { // Player holding up
		hero.speedY = 0;
		hero.speedX = 0;
		hero.y -= hero.speed * modifier;
		hero.speedY = -hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.speedY = 0;
		hero.speedX = 0;
		hero.y += hero.speed * modifier;
		hero.speedY = hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.speedY = 0;
		hero.speedX = 0;
		hero.x -= hero.speed * modifier;
		hero.speedX -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.speedY = 0
		hero.speedX = 0;
		hero.x += hero.speed * modifier;
		hero.speedX = hero.speed * modifier;
	}

	if (32 in keysDown) {
		var bulletPosition = {
			x: hero.x,
			y: hero.y,
			sx: hero.speedX,
			sy: hero.speedY,
		}

		playerBullets.push(Bullet({
			sx: bulletPosition.sx,
			sy: bulletPosition.sy,
			speed : 5,
			x: bulletPosition.x + 16,
			y: bulletPosition.y + 16
		}));
	};
	
/*============================================= play controls end ===================================*/

	// calculate sprite offset
	function calculateSpriteOffset(speedX, speedY) {
		if (hero.speedX == 0 && hero.speedY == 0) {
			// char not moving
			offset.x = 0;
			offset.y = 128;
		} else if ( hero.speedX > 0 && hero.speedY === 0 ){
			// char moving right
			offset.x = 0;
			offset.y = 192;
		} else if ( hero.speedX < 0 && hero.speedY === 0 ){
			// char moving left
			offset.x = 0;
			offset.y = 224;
		} else if ( hero.speedX === 0 && hero.speedY > 0 ){
			// char moving down
			offset.x = 0;
			offset.y = 128;
		} else if ( hero.speedX === 0 && hero.speedY < 0 ){
			// char moving up
			offset.x = 0;
			offset.y = 160;
		} /*else if ( speedX > 0 && speedY < 0 ){
			// right and up
			offset.x = 0;
			offset.y = 0;
		} else if ( speedX > 0 && speedY > 0 ){
			// right and down
			offset.x = 0;
			offset.y = 32;
		} else if ( speedX < 0 && speedY < 0 ){
			// left and up
			offset.x = 0;
			offset.y = 64;
		} else if ( speedX > 0 && speedY > 0 ){
			// left and down
			offset.x = 0;
			offset.y = 96;
		}*/
	}
		
	calculateSpriteOffset(hero.speedX, hero.speedY);	
	
	
// is character walking out of the screen?
	if ( hero.x < canvas.width - canvas.width ) 
	{
		// coordinates of 0, re render char to appear at X
		hero.x = 0
	}
	
	if ( hero.x > canvas.width - 32  )
	{
		hero.x = canvas.width - 32
	}
	
	if ( hero.y < (canvas.height - canvas.height) ) {
		hero.y = 0
	}
	
	if ( hero. y > canvas.height - 32)
	{
		hero.y = canvas.height - 32
	}

	

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
	
	playerBullets.forEach(function(bullet){
		bullet.travel();
		bullet.update();
	});
	
	playerBullets = playerBullets.filter(function(bullet){
		return bullet.active;
	})

	handleCollisions();
};


/*====================================================   Draw function 	===============================================*/
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
/*
		function tint (heroImage) {
			var buff = document.createElement( "canvas" );
			buff.width  = heroImage.width;
			buff.height = heroImage.height;
			var ctx = buff.getContext("2d")
			ctx.drawImage(heroImage, 0, 0)
			//ctx.save();
			ctx.globalCompositeOperation = "source-in";
			ctx.fillStyle = "#FF0000";
			ctx.fillRect(0, 0, 32 ,32)
			//ctx.restore()
			return buff;
		}

	
		//var tintImg = 
		ctx.drawImage(tint(heroImage), 0, 0); */

		ctx.drawImage(heroImage, offset.x, offset.y, 32 , 32, hero.x, hero.y, 32, 32);
		

	}

	if (monsterReady) {

		if (monster.hit){

		function tint () {
			var buff = document.createElement( "canvas" );
			buff.width  = monsterImage.width;
			buff.height = monsterImage.height;
			var ctx = buff.getContext("2d")
			ctx.drawImage(monsterImage, 0, 0)
			//ctx.save();
			ctx.globalCompositeOperation = "source-in";
			ctx.fillStyle = "#FF0000";
			ctx.fillRect(0, 0, 32 ,32)
			//ctx.restore()
			return buff;
		}

		ctx.drawImage(tint(),monster.x, monster.y);
		} else {


		ctx.drawImage(monsterImage, monster.x, monster.y);
		}	

		monster.hit = false;
	}
	




	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	
	// hero position
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Heros position: " + hero.x + " : " + hero.y, 32, 60);
	
	// map width + grid 
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("offset: " + offset.x + " : " + offset.y, 32, 90);
	
	// draw bullets
	playerBullets.forEach(function(bullet) {
		bullet.draw();
	});
	
	// frame rate
	
	
	
};



/*====================================================   Main 	===============================================*/
// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible

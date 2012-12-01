// A generic sprite class

var Sprite = (src, width, height, offsetX, offsetY) {

	this.spritesheet = new Image();
	this.spritesheet.src = src;
	
	this.currentFrame = 0;
	
	this.width = width;
	this.height = height;
	this.offsetX = offsetX;
	this.offsetY = offsetY;

	
}

Sprite.prototype.setPosition = function(x, y) {
	this.posX = x;
	this.posY = y;
}

Sprite.prototype.setOffset = function(x, y) {
	this.offsetX = x;
	this.offsetY = y;
}

Sprite.prototype.draw = function(c) {
	c.drawImage(this.spritesheet, this.offsetX, this.offsetYj
}




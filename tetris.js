var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");

var width = 10;
var height = 20;
var tilez = 24;
canvas.width = width * tilez;
canvas.height = height * tilez;

var board = [];
for(var row = 0; row < 20; row++){
  board[row] = [];
  for(var tile = 0; tile < 10; tile++){
    board[row][tile] = false;
  }
}

function drawSquare(x, y){
  ctx.fillRect(x * tilez, y * tilez, tilez, tilez);
  ss = ctx.strokeStyle;
  ctx.strokeStyle = "#555";
  ctx.strokeRect(x * tilez, y * tilez, tilez, tilez);
  ctx.strokeStyle = "#888";
  ctx.strokeRect(x * tilez + 3*tilez/8, y * tilez + 3*tilez/8, tilez/4, tilez/4);
  ctx.strokeStyle = ss;
}

function drawBoard(){
  fs = ctx.fillStyle();
  for(var y = 0; y < height; y++){
    for(var x = 0; x < width; x++){
      ctx.fillStyle = board[y][x] ? 'red' : 'white';
      drawSquare(x, y, tilez, tilez);
    }
  }
  ctx.fillStyle = fs;
}

function Piece(patterns, color){
  this.pattern = patterns[0];
  this.patterns = patterns;
  this.patterni = 0;

  this.color = color;

  this.x = 0;
  this.y = -2;
}

Piece.prototype.draw = function(){
  fs = ctx.fillStyle();
  ctx.fillStyle = this.color;
  for(var ix = 0; ix < this.pattern.length; ix ++){
    for(var iy = 0; iy < this.pattern.length; iy++){
      if(this.pattern[ix][iy]){
        drawSquare(this.x + ix, this.y + iy);
      }
    }
  }
  ctx.fillStyle = fs;
};

Piece.prototype.down = function(){
  this.undraw();
  this.y++;
  this.draw();
};

Piece.prototype.moveRight = function(){
  this.undraw();
  this.x++;
  this.draw();
};

Piece.prototype.moveLeft = function(){
  this.undraw();
  this.x--;
  this.draw();
};

Piece.prototype.rotate = function(){
  this.undraw();
  this.patterni = (this.patterni + 1) % this.patterns.length;
  this.pattern = this.patterns[this.patterni];
  this.draw;
};

Piece.prototype._fill = function(color){
  fs = ctx.fillStyle;
  ctx.fillStyle = color;
  var x = this.x;
  var y = this.y;
  for(var ix = 0; ix < this.pattern.length; ix++){
    for (var iy = 0; iy < this.pattern.length; iy++){
      if (this.pattern[ix][iy]){
        drawSquare(x + ix, y + iy);
      }
    }
  }
};

Piece.prototype.undraw = function(ctx){
  this._fill("black");
};

Piece.prototype.draw = function(ctx){
  this._fill(this.color);
};

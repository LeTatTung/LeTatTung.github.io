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

var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");
var linecount = document.getElementById("lines");
var clear = window.getComputedStyle(canvas).getPropertyValue('background-color');

var width = 10;
var height = 20;
var tilez = 24;
canvas.width = width * tilez;
canvas.height = height * tilez;
var done = false;
var board = [];

var pieces = [
  [I, "cyan"],
  [J, "blue"],
  [L, "orange"],
  [O, "yellow"],
  [S, "green"],
  [T, "purple"],
  [Z, "red"]
];

var WAL = 1;
var BLOCK = 2;

var piece = null;
var downI = {};

var lines = 0;

var dropStart = Date.now();
for(var row = 0; row < height; row++){
  board[row] = [];
  for(var tile = 0; tile < width; tile++){
    board[row][tile] = "";
  }
}

function drawSquare(x, y){
  ctx.fillRect(x * tilez, y * tilez, tilez, tilez);
  var ss = ctx.strokeStyle;
  ctx.strokeStyle = "#555";
  ctx.strokeRect(x * tilez, y * tilez, tilez, tilez);
  ctx.strokeStyle = "#888";
  ctx.strokeRect(x * tilez + 3*tilez/8, y * tilez + 3*tilez/8, tilez/4, tilez/4);
  ctx.strokeStyle = ss;
}

function drawBoard(){
  var fs = ctx.fillStyle;
  for(var y = 0; y < height; y++){
    for(var x = 0; x < width; x++){
      ctx.fillStyle = board[y][x] || clear;
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

  this.x = width/2 - parseInt(Math.ceil(this.pattern.length/2), 10);
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
// day khoi xuong
Piece.prototype.down = function(){
  if (this._collides(0, 1, this.pattern)){
    this.lock();
    piece = newPiece();
  }else{
    this.undraw();
    this.y++;
    this.draw();
  }
};
// sang phai
Piece.prototype.moveRight = function(){
  if (!this._collides(1, 0, this.pattern)){
    this.undraw();
    this.x++;
    this.draw();
  }
};
// sang trai
Piece.prototype.moveLeft = function(){
  if (!this._collides(-1, 0, this.pattern)){
    this.undraw();
    this.x--;
    this.draw();
  }
};
// xoay
Piece.prototype.rotate = function(){
  var nextpat = this.patterns[(this.patterni + 1) % this.patterns.length];
  var nudge = 0;
  if (this._collides(0, 0, nextpat)){
    // check xem sau khi va cham thi di chuyen ve phia nao
    // - 1 la va cham voi tuong phai di chuyen ve trai
    // 1 la va cham voi tuong trai, di chuyen ve phai
    nudge = this.x > width/2 ? -1 : 1;
  }
  if (!this._collides(0, 0, nextpat)){
    this.undraw();
    this.x += nudge;
    this.patterni = (this.patterni + 1) % this.patterns.length;
    this.pattern = this.patterns[this.patterni];
    this.draw();
  }
};

Piece.prototype._fill = function(color){
  var fs = ctx.fillStyle;
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
  ctx.fillStyle = fs;
};
// xoa bo vi tri cu da di qua
Piece.prototype.undraw = function(ctx){
  this._fill(clear);
};
// ve them vi tri moi khi den
Piece.prototype.draw = function(ctx){
  this._fill(this.color);
};
// ham xu ly va cham
// dung _ vi day chi la trong noi bo Piece, ko dc goi tren 1 bien
// day la quy uoc cua JS
Piece.prototype._collides = function(dx, dy, pat){
  for (var ix = 0; ix < pat.length; ix++){
    for (var iy = 0; iy < pat.length; iy++){
      if (!pat[ix][iy]){
        continue;
      }
      var x = this.x + ix + dx;
      var y = this.y + iy + dy;
      if (y >= height || x < 0 || x>= width){
        return WAL;
      }
      if (y < 0){
        // bo qua truong hop di qua day duoi
        continue;
      }
      if (board[y][x] !== ""){
        return BLOCK;
      }
    }
  }
  return 0;
};

// ham xu ly su kien nhan dau vao tu ban phim
document.body.addEventListener("keydown", function(e){
  if (downI[e.keyCode] !== null){
    clearInterval(downI[e.keyCode]);
  }
  key(e.keyCode);
  downI[e.keyCode] = setInterval(key.bind(this, e.keyCode), 200);
}, false);

document.body.addEventListener("keyup", function(e){
  if (downI[e.keyCode] !== null){
    clearInterval(downI[e.keyCode]);
  }
  downI[e.keyCode] = null;
}, false);

function key(k){
  if (done){
    return;
  }
  if (k == 38){
    // truong hop nguoi dung an mui ten len
    piece.rotate();
    dropStart = Date.now();
  }
  if (k == 40){
    // truong hop nguoi dung an mui ten xuong
    piece.down();
  }
  if (k == 37){
    // nguoi dung an sang trai
    piece.moveLeft();
    dropStart = Date.now();
  }
  if (k == 39){
    // nguoi dung an sang phai
    piece.moveRight();
    dropStart = Date.now();
  }
}
// the game loop

function main(){
  var now = Date.now();
  var delta = now - dropStart;
  if (delta > 1000){
    piece.down();
    dropStart = now;
  }
  if (!done){
    requestAnimationFrame(main);
  }
}

Piece.prototype.lock = function(){
  for (var ix = 0; ix < this.pattern.length; ix++){
    for (var iy = 0; iy < this.pattern.length; iy ++){
      if (!this.pattern[ix][iy]){
        continue;
      }
      if (this.y + iy < 0){
        // ket thuc game
        alert("you're done");
        done = true;
        return;
      }
      board[this.y + iy][this.x + ix] = this.color;
    }
  }
  // xu ly khi 1 hang dc lap day thi xoa hang do di
  // ghi de hang tren xuong
  // cong them vao line 1 diem
  var nlines = 0;
  for (var y = 0; y < height; y++){
    var line = true;
    for (var x = 0; x < width; x++){
      line = line && board[y][x] !== "";
    }
    if (line){
      for (var y2 = y; y2 > 1; y2--){
        for (var x = 0; x < width; x++){
          board[y2][x] = board[y2-1][x];
        }
      }
      for (var x = 0; x < width; x++){
        board[0][x] = false;
      }
      nlines++;
    }
  }
  if (nlines > 0){
    lines += nlines;
    drawBoard();
    linecount.textContent = "Lines: " +lines;
  }
};

function newPiece(){
  var p = pieces[parseInt(Math.random() * pieces.length, 10)];
  return new Piece(p[0], p[1]);
}

piece = newPiece();
drawBoard();
linecount.textContent = "Lines: " +lines;
main();

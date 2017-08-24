var canvas = document.querySelector(".outputcanvas");
var ctx = canvas.getContext("2d");
var cursorX = 0;
var cursorY = 0;

//defaults
function clearCanvas() {
    cursorX = 0;
    cursorY = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = "#ff00ff";
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 1;
}
clearCanvas();

function moveTo(x, y){
    cursorX = x;
    cursorY = y;
}
function moveBy(x, y){
    cursorX += x;
    cursorY +=y;
}
function circle(r){
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
}
function square(s){
    ctx.fillRect(cursorX, cursorY, s, s);
    ctx.strokeRect(cursorX, cursorY, s, s);
}
function lineTo(startX, startY, endX, endY){
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function fillColor(c){
    ctx.fillStyle = c;
}
function opacity(value){
    ctx.globalAlpha = value;
}
function stroke(thickness, color){
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
}

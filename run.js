var canvas = document.querySelector(".outputcanvas");
var ctx = canvas.getContext("2d");
var cursorX = 0;
var cursorY = 0;

canvas.width = 500;
canvas.height = 500;

function readCode(){
    'use strict';
    resetCanvas();
    var tmp = document.createElement("DIV");
    tmp.innerHTML = codeContainer.innerHTML;
//    console.log(tmp.textContent || tmp.innerText || "");
    var outputJS = tmp.textContent || tmp.innerText || "";
    var prependJS = "var doLoop; function animate(){};"
    var appendJS = "function loop() {"
                        +"animate();"
                        +"doLoop = requestAnimationFrame(loop);"
                    +"}"
                    +"console.log(animate);"
                    +"loop();";
    var usercode = "";
    usercode = prependJS + outputJS + appendJS;
    console.log(usercode);
    var codeEval = eval;
    codeEval(usercode);
    //var codeEval = eval(usercode);
}

//defaults
function clearCanvas() {
    var fillSave = ctx.fillStyle;
    var alphaSave = ctx.globalAlpha;
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2b3035";
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = fillSave;
    ctx.globalAlpha = alphaSave;
}

function resetCanvas() {
    cursorX = 0;
    cursorY = 0;
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2b3035";
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = "#ff00ff";
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
}
resetCanvas();

function repeat(repetitions, loopSubject){
    for(var i = 0; i<repetitions; i++){
        loopSubject();
    }
}

function randomNumber(from, to){
    return Math.random() * (to - from) + from;
}

// var doLoop;
// function animate(){
//     //stub to be overwritten by usercode
// }
// //usercode
// function loop() {
//     animate();
//     doLoop = requestAnimationFrame(loop);
// }
// loop();

function moveTo(x, y){
    cursorX = x;
    cursorY = y;
}
function moveToRandom(){
    cursorX = Math.random()*500;
    cursorY = Math.random()*500;
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
    ctx.fillRect(cursorX - (s / 2), cursorY - (s / 2), s, s);
    ctx.strokeRect(cursorX - (s / 2), cursorY - (s / 2), s, s);
}
function lineTo(startX, startY, endX, endY){
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}
function background(color){
    var tmpColor = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = tmpColor;
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

//TODO here: https://docs.google.com/spreadsheets/d/1Uj9Zr4Z-awpuOd76hMkw0RaSiUKQx7IPALZatrH0Tac/edit#gid=0

var codeContainer = document.querySelector('.code');
var toolbox = document.querySelector('.toolbox');
var menu = document.querySelector(".toolbox-menu");

var commands = {
    "drawing": {
        "moveTo": {
            "labelstub": "moveTo",
            "type": "function",
            "parameters": {
                "x": {
                    "type": "number",
                    "value": 10
                },
                "y": {
                    "type": "number",
                    "value": 10
                }
            }
        },
        "moveBy": {
            "labelstub": "moveBy",
            "type": "function",
            "parameters": {
                "x": {
                    "type": "number",
                    "value": 10
                },
                "y": {
                    "type": "number",
                    "value": 10
                }
            }
        },
        "circle": {
            "labelstub": "circle",
            "type": "function",
            "parameters": {
                "radius": {
                    "type": "number",
                    "value": 20
                }
            }
        },
        "square": {
            "labelstub": "square",
            "type": "function",
            "parameters": {
                "size": {
                    "type": "number",
                    "value": 40
                }
            }
        },
        "line": {
            "labelstub": "lineTo",
            "type": "function",
            "parameters": {
                "startX": {
                    "type": "number",
                    "value": 10
                },
                "startY": {
                    "type": "number",
                    "value": 10
                },
                "endX": {
                    "type": "number",
                    "value": 110
                },
                "endY": {
                    "type": "number",
                    "value": 10
                }
            }
        }
    },
    "style": {
        "color": {
            "labelstub": "fillColor",
            "type": "function",
            "parameters": {
                "color": {
                    "type": "color",
                    "value": "#ffff00"
                }
            }
        },
        "opacity": {
            "labelstub": "opacity",
            "type": "function",
            "parameters": {
                "opacity": {
                    "type": "number",
                    "value": 0.9
                }
            }
        },
        "stroke": {
            "labelstub": "stroke",
            "type": "function",
            "parameters": {
                "thickness": {
                    "type": "number",
                    "value": 1
                },
                "color": {
                    "type": "color",
                    "value": "#ff00ff"
                }
            }
        },
    }
};

function clearCursors(){
    var carat = document.querySelector(".carat")
    if(carat){
        carat.remove();
    }
    var editing = document.querySelector(".editing")
    if(editing){
        editing.classList.remove("editing");
    }
    var currentHighlight = document.querySelector(".highlight");
    if(currentHighlight){
        currentHighlight.classList.remove("highlight");
    }
}

function advanceCursor(){
    var currentHighlight = document.querySelector(".highlight");
    if(currentHighlight){
        currentHighlight.classList.remove("highlight");
    }

    var nextParam = currentHighlight.nextSibling.nextSibling;
    if(nextParam){
        nextParam.classList.add("highlight");
        parameterClicked(nextParam);
    }else{
        var nextObject = currentHighlight.parentNode.nextSibling;
        if(nextObject.classList.contains("emptyLine")){
            var lastLine = document.querySelector(".emptyLine");
            moveCursor(lastLine);
            readCode();
        }
        else{
            currentHighlight.parentNode.nextSibling.firstChild.classList.add("highlight");
        }
    }
}

function editParam(commandObj, param){
    clearCursors();
    param.classList.add("highlight");
    var editorType = param.getAttribute("param-type");
    if(editorType === "color"){
        showColorgrid();
    }
    if(editorType === "number"){
        showNumpad();
    }
}

function parameterClicked(target){
    var command = target.parentNode.querySelector(".label").innerHTML;
    editParam(command, target);
    var defaultAttribute = target.getAttribute("data-default-value");
    target.setAttribute("data-value", "");
    target.childNodes[0].nodeValue = defaultAttribute;
}

function moveCursor(codeBlock){
    clearCursors();
    var cursor = document.createElement("span");
    cursor.classList.add("carat");
    codeBlock.appendChild(cursor);
}

function editLine(e){
    clearCursors();
    e.target.classList.add("editing");
}

function numPressed(target){
    var attr = target.getAttribute("data-value");
    if(!isNaN(parseInt(attr)) || attr === "."){
        var param = document.querySelector(".highlight");
        if(param.hasAttribute("data-value")){
            var currentValue = param.getAttribute("data-value");
            var newValue = currentValue + target.getAttribute("data-value");
        }else{
            var newValue = target.getAttribute("data-value");
        }
        param.setAttribute("data-value", newValue);
        param.childNodes[0].nodeValue = newValue;
    }
    if(attr === "done"){
        hideNumpad();
        advanceCursor();
    }
}

function colorPressed(target){
    var param = document.querySelector(".highlight");
    var newValue = "\"" + target.getAttribute("data-value") + "\"";
    param.setAttribute("data-value", newValue);
    param.childNodes[0].nodeValue = newValue;
    hideColorgrid();
    advanceCursor();
}

function hideNumpad(){
    var numPad = document.querySelector(".numpad");
    numPad.style.display = "none";
}
function showNumpad(){
    var numPad = document.querySelector(".numpad");
    numPad.style.display = "block";
}

function hideColorgrid(){
    var colorpad = document.querySelector(".colorpad");
    colorpad.style.display = "none";
}
function showColorgrid(){
    var colorpad = document.querySelector(".colorpad");
    colorpad.style.display = "block";
}

function returnDOM(element) {
    var domElem = document.createElement("span");
    domElem.classList.add("codeblock");
    var labelStub = document.createElement("span");
    labelStub.classList.add("label");
    var labelStubText = document.createTextNode(element.labelstub);
    labelStub.appendChild(labelStubText);
    domElem.appendChild(labelStub);
    if(element.type === "function"){
        var openBracket = document.createElement("span");
        openBracket.appendChild(document.createTextNode("("));
        domElem.appendChild(openBracket);
        var i = 0;
        for(var param in element.parameters){
            if (element.parameters.hasOwnProperty(param)) {
                var paramNode = document.createElement("span");
                paramNode.classList.add("param");
                //add type to param
                paramNode.setAttribute("param-type", element.parameters[param].type);
                paramNode.setAttribute("data-default-value", param);
                paramNode.appendChild(document.createTextNode(param));
                domElem.appendChild(paramNode);
                var paramCount = Object.keys(element.parameters).length;
                if(i < paramCount - 1){
                    var comma = document.createElement("span");
                    comma.appendChild(document.createTextNode(", "));
                    domElem.appendChild(comma);
                }
                i++;
            }
        }
        var closeBracket = document.createElement("span");
        closeBracket.appendChild(document.createTextNode(");"));
        domElem.appendChild(closeBracket);
    }
    return domElem;
}

function createCodeElement(e, commandObj) {
    if (typeof commandObj === 'undefined'){
        var codeInsert = document.createElement("span")
        codeInsert.classList.add("codeblock");
        codeInsert.classList.add("emptyLine");
    }else{
        //var commandObj = commands.drawing[e.target.id];
        var codeInsert = returnDOM(commandObj);
    }
    codeInsert.addEventListener("click", function(event){
        if(event.target.classList.contains("codeblock")){
            moveCursor(event.target);
        }
    });
    // codeContainer.appendChild(codeInsert);
    var carat = document.querySelector(".carat");
    var highlight = document.querySelector(".highlight");
    var editing = document.querySelector(".editing");
    if(carat){
        if(!carat.parentNode.classList.contains("emptyLine")){
            codeContainer.insertBefore(codeInsert, carat.parentNode.nextSibling);
        }else{
            codeContainer.insertBefore(codeInsert, document.querySelector(".emptyLine"));
        }
    }
    if(highlight){
        codeContainer.insertBefore(codeInsert, highlight.parentNode.nextSibling);
    }
    if(editing){
        codeContainer.replaceChild(codeInsert, editing.parentNode);
    }
    if(!highlight && !carat && !editing){
        codeContainer.insertBefore(codeInsert, document.querySelector(".emptyLine"));
    }
    var label = codeInsert.querySelector(".label");
    if(label != undefined){
        label.addEventListener('click', editLine);
    }
    var paramsList = codeInsert.querySelectorAll(".param");
    if(paramsList.length > 0){
        editParam(commandObj, paramsList[0]);
    }
    for(var i = 0; i < paramsList.length; i++){
        paramsList[i].addEventListener('click', function(event){
            parameterClicked(event.target);
        });
    }
}
//create default empty line
createCodeElement();


//label for toolbox
function createLabel(commandObj){
    //where function, return parameters in brackets
    var jsString = commandObj.labelstub
    if(commandObj.type === "function"){
        jsString += "(";
        var paramCount = Object.keys(commandObj.parameters).length;
        var i = 0;
        for(var param in commandObj.parameters){
            if (commandObj.parameters.hasOwnProperty(param)) {
                jsString += param;
                if(i < paramCount - 1){
                    jsString += ", ";
                }
                i++;
            }
        }
        jsString += ")";
    }
    return jsString;
}

function constructToolBoxTab(commandsObj) {
    var tab = document.createElement("span");
    tab.classList.add("tab");
    for (var key in commandsObj) {
       if (commandsObj.hasOwnProperty(key)) {
           (function() {
               var commandObj = commandsObj[key];
               var inputElement = document.createElement("span");
               var inputElementLabel = document.createTextNode(createLabel(commandObj));
               inputElement.appendChild(inputElementLabel);
               inputElement.id = key;
               inputElement.classList.add("tapinput");
               inputElement.addEventListener('click', function(event){
                   createCodeElement(event, commandObj);
               }, false);
               tab.appendChild(inputElement);
           })();
       }
    }
    toolbox.appendChild(tab);
}

function changeToolbox(menuItem, commands){
    //move selected menu item style
    var selectedMenu = document.querySelector(".menu-selected");
    if(selectedMenu){
        selectedMenu.classList.remove("menu-selected");
    }
    menuItem.classList.add("menu-selected");

    //delete existing toolbox
    var currentToolbox = document.querySelector(".tab");
    if(currentToolbox){
        toolbox.removeChild(currentToolbox);
    }

    //make new toolbox
    constructToolBoxTab(commands);
}

function readCode(){
    clearCanvas();
    //console.log(codeContainer.innerHTML);
    var tmp = document.createElement("DIV");
    tmp.innerHTML = codeContainer.innerHTML;
    console.log(tmp.textContent || tmp.innerText || "");
    var outputJS = tmp.textContent || tmp.innerText || "";
    eval(outputJS);
}

function init(){
    //create menu
    for (var key in commands) {
       if (commands.hasOwnProperty(key)) {
           (function() {
               var _key = key;
               var menuElement = document.createElement("span");
               menuElement.classList.add("menu-item");
               menuElement.appendChild(document.createTextNode(key));
               menuElement.addEventListener('click', function(event){
                   changeToolbox(this, commands[_key]);
               });
               menu.appendChild(menuElement);
           })();
       }
    }
    // ADD ENTER BUTTON
    var inputElement = document.createElement("span");
    var inputElementLabel = document.createTextNode("enter");
    inputElement.appendChild(inputElementLabel);
    inputElement.id = "enter";
    inputElement.classList.add("tapinput");
    inputElement.addEventListener("click", advanceCursor);
    toolbox.appendChild(inputElement);

    //create toolbox
    changeToolbox(document.querySelector(".menu-item"), commands.drawing);

    //add listeners to numpad
    var numBlocks = document.querySelectorAll(".numgrid");
    for(var i = 0; i < numBlocks.length; i++){
        numBlocks[i].addEventListener('click', function(event){
            numPressed(event.target);
        });
    }

    //add listeners to colorpad
    var colorBlocks = document.querySelectorAll(".colorgrid");
    for(var i = 0; i < colorBlocks.length; i++){
        colorBlocks[i].addEventListener('click', function(event){
            colorPressed(event.target);
        });
    }
}
init();

//TODO here: https://docs.google.com/spreadsheets/d/1Uj9Zr4Z-awpuOd76hMkw0RaSiUKQx7IPALZatrH0Tac/edit#gid=0

var codeContainer = document.querySelector('.code');
var toolbox = document.querySelector('.toolbox');
var menu = document.querySelector(".toolbox-menu");

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


function hasClass(elem, cls) {
    var str = " " + elem.className + " ";
    var testCls = " " + cls + " ";
    return(str.indexOf(testCls) != -1) ;
}

function nextByClass(node, cls) {
    while (node = node.nextSibling) {
        if (hasClass(node, cls)) {
            return node;
        }
    }
    return null;
}

function getNextEditable(currentElement){
    var params = codeContainer.querySelectorAll(".param");
    var param;
    //if cursor on an attribute / param
    for(var i = 0; i < params.length; i++){
        if(params[i] === currentElement){
            param = params[i+1];
            return params[i+1];
        }
    }

    if(!param){
        var currentCodeBlock = currentElement.parentNode;
        if(currentElement.classList.contains("carat")){
            //if cursor on end of line
            var codeBlocks = codeContainer.querySelectorAll(".codeblock");
            var currentBlock;
            for(var i = 0; i < codeBlocks.length; i++){
                if(codeBlocks[i] === currentCodeBlock){
                    currentBlock = codeBlocks[i];
                    nextBlock = nextByClass(currentBlock, "codeblock");
                    return nextBlock;
                }
            }
        }
    }
}

function advanceCursor(){
    var currentHighlight = document.querySelector(".highlight");
    if(currentHighlight){
        console.log(currentHighlight);
        currentHighlight.classList.remove("highlight");
        var nextParam = currentHighlight.nextSibling.nextSibling;
        if(nextParam){
            nextParam.classList.add("highlight");
            parameterClicked(nextParam);
        }else{
            var nextObject = getNextEditable(currentHighlight);
            if(nextObject){
                nextObject.classList.add("highlight");
            }
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
        var param = document.querySelector(".highlight");
        if(param != null){
            if(param.getAttribute("param-type") === "number"){
                //editor is currently editing value
                var newValue = param.getAttribute("data-value");
                // console.log(newValue);
                if(newValue != null && newValue != ""){
                    console.log(newValue);
                    param.setAttribute("data-default-value", newValue);
                }
            }
        }
        console.log(param.getAttribute("data-default-value"));
        hideNumpad();
        advanceCursor();
        readCode();
    }
}

function colorPressed(target){
    hideNumpad();
    var param = document.querySelector(".highlight");
    var newValue = "\"" + target.getAttribute("data-value") + "\"";
    param.setAttribute("data-value", newValue);
    param.childNodes[0].nodeValue = newValue;
    param.setAttribute("data-default-value", newValue);
    hideColorgrid();
    advanceCursor();
    readCode();
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

function createEmptyLine(){
    var codeInsert = document.createElement("span")
    codeInsert.classList.add("codeblock");
    codeInsert.classList.add("emptyLine");
    codeInsert.addEventListener("click", function(event){
        if(event.target.classList.contains("codeblock")){
            moveCursor(event.target);
        }
    });
    return codeInsert;
}

function createCodeElement(e, commandObj) {
    //TODO: remove creating empty lines from this function.
    //make commandObj required, and fill in createEmptyLine function
    if (typeof commandObj === 'undefined'){
        var codeInsert = document.createElement("span")
        codeInsert.classList.add("codeblock");
        codeInsert.classList.add("emptyLine");
    }else{
        var domElem = document.createElement("span");
        domElem.classList.add("codeblock");
        if(commandObj.type === "value"){
            domElem.classList.add("inline-codeblock");
        }
        var labelStub = document.createElement("span");
        labelStub.classList.add("label");
        var labelStubText = document.createTextNode(commandObj.labelstub);
        labelStub.appendChild(labelStubText);
        domElem.appendChild(labelStub);
        //if element has parameters, add them
        if(commandObj.parameters){
            var openBracket = document.createElement("span");
            openBracket.appendChild(document.createTextNode("("));
            domElem.appendChild(openBracket);
            var i = 0;
            for(var param in commandObj.parameters){
                if (commandObj.parameters.hasOwnProperty(param)) {
                    var paramNode = document.createElement("span");
                    paramNode.classList.add("param");
                    //add type to param
                    paramNode.setAttribute("param-type", commandObj.parameters[param].type);

                    var param = commandObj.parameters[param];
                    if(param.type === "color"){
                        var paramString = "\"" + param.value + "\"";
                    }else{
                        var paramString = param.value;
                    }
                    paramNode.setAttribute("data-default-value", paramString);
                    paramNode.appendChild(document.createTextNode(paramString));
                    domElem.appendChild(paramNode);
                    var paramCount = Object.keys(commandObj.parameters).length;
                    if(i < paramCount - 1){
                        var comma = document.createElement("span");
                        comma.appendChild(document.createTextNode(", "));
                        domElem.appendChild(comma);
                    }
                    i++;
                }
            }
            if(commandObj.type != "control"){
                var closeBracket = document.createElement("span");
                if(commandObj.type != "value"){
                    closeBracket.appendChild(document.createTextNode(");"));
                }else{
                    closeBracket.appendChild(document.createTextNode(")"));
                }
                domElem.appendChild(closeBracket);
            }
        }
        if(commandObj.type === "control"){
            //labelStub.style.display = "block";
            var empty = createEmptyLine();
            domElem.appendChild(empty);
            var labelClose = document.createElement("span");
            labelClose.classList.add("labelclose");
            var labelCloseText = document.createTextNode(commandObj.labelclose);
            labelClose.appendChild(labelCloseText);
            domElem.appendChild(labelClose);
        }
        var codeInsert = domElem;
    }
    codeInsert.addEventListener("click", function(event){
        if(event.target.classList.contains("codeblock")){
            moveCursor(event.target);
        }
    });

    var carat = document.querySelector(".carat");
    var highlight = document.querySelector(".highlight");
    var editing = document.querySelector(".editing");


    if(commandObj){
        //if param, insert over current highlight value, or error
        if(commandObj.type === "value"){
            console.log("value");
            if(highlight){
                console.log(highlight);
                highlight.parentNode.replaceChild(codeInsert, highlight);
            }
        //not param, so replace line, or insert new line
        }else{
            if(carat){
                if(!carat.parentNode.classList.contains("emptyLine")){
                    var nextEditable = getNextEditable(carat);
                    //var caratPos = carat.parentNode.nextSibling;
                    nextEditable.parentNode.insertBefore(codeInsert, nextEditable);
                }else{
                    // insert code before empty line
                    var empty = carat.parentNode;
                    empty.parentNode.insertBefore(codeInsert, empty);
                }
            }
            if(highlight){
                highlight.parentNode.parentNode.insertBefore(codeInsert, highlight.parentNode.nextSibling);
            }
            if(editing){
                editing.parentNode.parentNode.replaceChild(codeInsert, editing.parentNode);
            }
            if(!highlight && !carat && !editing){
                var nextEmptyLine = document.querySelector(".emptyLine");
                if(nextEmptyLine){
                    nextEmptyLine.parentNode.insertBefore(codeInsert, nextEmptyLine);
                }else{
                    codeContainer.insertBefore(codeInsert, nextEmptyLine);
                }
            }
        }
        var label = codeInsert.querySelector(".label");
        if(label != undefined){
            label.addEventListener('click', editLine);
        }
        var blocksList = codeInsert.querySelector(".emptyLine");
        if(blocksList){
            //move carat to empty line.
            moveCursor(blocksList);
        }
        var paramsList = codeInsert.querySelectorAll(".param");
        if(paramsList.length > 0){
            editParam(commandObj, paramsList[0]);
        }
        for(var i = 0; i < paramsList.length; i++){
            if(paramsList[i].getAttribute("param-type") != "function"){
                console.log(paramsList[i]);
                paramsList[i].addEventListener('click', function(event){
                    parameterClicked(event.target);
                });
            }
        }
    }
}


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
    hideNumpad();
    hideColorgrid();
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

    //create default empty line
    var empty = createEmptyLine();
    codeContainer.appendChild(empty);

    // ADD ENTER BUTTON
    // var inputElement = document.createElement("span");
    // var inputElementLabel = document.createTextNode("enter");
    // inputElement.appendChild(inputElementLabel);
    // inputElement.id = "enter";
    // inputElement.classList.add("tapinput");
    // inputElement.addEventListener("click", advanceCursor);
    // toolbox.appendChild(inputElement);

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

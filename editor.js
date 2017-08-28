//TODO here: https://docs.google.com/spreadsheets/d/1Uj9Zr4Z-awpuOd76hMkw0RaSiUKQx7IPALZatrH0Tac/edit#gid=0

var codeContainer = document.querySelector('.code');
var toolbox = document.querySelector('.toolbox');
var menu = document.querySelector(".toolbox-menu");
var topMenu = document.querySelector(".menu");

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

function previousByClass(node, cls) {
    while (node = node.previousSibling) {
        if (hasClass(node, cls)) {
            return node;
        }
    }
    return null;
}

function getNextEditableParam(currentElement){
    var params = currentElement.parentNode.querySelectorAll(".param");
    var param;
    //if cursor on an attribute / param
    for(var i = 0; i < params.length; i++){
        if(params[i] === currentElement){
            param = params[i+1];
            if(i+1 < params.length){
                return params[i+1];
            }else{
                return getNextCodeblock(currentElement.parentNode);
            }
        }
    }
}

function getPreviousEditableParam(currentElement){
    var params = currentElement.parentNode.querySelectorAll(".param");
    var param;
    //if cursor on an attribute / param
    for(var i = 0; i < params.length; i++){
        if(params[i] === currentElement){
            param = params[i - 1];
            if(i - 1 >= 0){
                return params[i - 1];
            }else{
                return currentElement.parentNode.querySelector(".label");
            }
        }
    }
}

function moveToPreviousEditable() {
    /*
    order or elements:
    label, parameters, child codeblock
    */
    //cursor on end of line or blank line
    var carat = document.querySelector(".carat");
    //cursor highlighting param
    var highlight = document.querySelector(".highlight");
    //cursor highlighting codeblock label
    var editing = document.querySelector(".editing");

    var previousEditable;
    if(carat){
        var codeOnLine = carat.parentNode.querySelector(".label");
        if(codeOnLine){
            //cursor on end of line with code. Move in to last param or label.
            var paramsAndLabels = carat.parentNode.querySelectorAll(".label, .param");
            previousEditable = paramsAndLabels[paramsAndLabels.length - 1];
        }else{
            //moving from empty line to code block above
            previousEditable = getPreviousCodeblock(carat.parentNode);
            if(previousEditable){
                emptyLines = previousEditable.querySelectorAll(".emptyLine");
                if(emptyLines.length > 0){
                    previousEditable = emptyLines[emptyLines.length - 1];
                }else{
                    var params = previousEditable.querySelectorAll(".param");
                    if(params.length > 0){
                        previousEditable = params[params.length - 1];
                    }
                }
            }else{
                previousEditable = carat.parentNode.previousSibling;
            }
        }
    }
    if(highlight){
        previousEditable = getPreviousEditableParam(highlight);
    }
    if(editing){
        var codeBlocks = codeContainer.querySelectorAll(".codeblock");
        if(editing.parentNode === codeBlocks[0]){
            previousEditable = codeBlocks[codeBlocks.length - 1];
        }else{
            var previousBlock = editing.parentNode.previousSibling;
            var previousBlockParams = previousBlock.querySelectorAll(".param");
            if(previousBlockParams.length > 0){
                previousEditable = previousBlockParams[previousBlockParams.length - 1];
            }else{
                previousEditable = previousBlock;
            }
        }
    }
    clearCursors();

    if(previousEditable.classList.contains("param")){
        previousEditable.classList.add("highlight");
        parameterClicked(previousEditable);
    }
    else if(previousEditable.classList.contains("emptyLine")){
        moveCursor(previousEditable);
    }
    else if(previousEditable.classList.contains("codeblock")){
        var label = previousEditable.querySelector(".label");
        label.classList.add("editing");
    }
    else if(previousEditable.classList.contains("label")){
        previousEditable.classList.add("editing");
    }
}

function moveToNextEditable() {
    //cursor on end of line or empty line
    var carat = document.querySelector(".carat");
    //cursor highlighting param
    var highlight = document.querySelector(".highlight");
    //cursor highlighting codeblock label
    var editing = document.querySelector(".editing");

    var nextEditable;
    if(carat){
        nextEditable = getNextCodeblock(carat);
        if(!nextEditable){
            var codeblock = codeContainer.querySelector(".codeblock");
            nextEditable = codeblock.querySelector(".label");
        }
    }
    if(highlight){
        nextEditable = getNextEditableParam(highlight);
    }
    if(editing){
        labelsAndParams = editing.parentNode.querySelectorAll(".param, .label, .emptyLine");
        nextEditable = labelsAndParams[1];
    }
    clearCursors();

    if(nextEditable.classList.contains("param")){
        nextEditable.classList.add("highlight");
        parameterClicked(nextEditable);
    }
    else if(nextEditable.classList.contains("emptyLine")){
        moveCursor(nextEditable);
    }
    else if(nextEditable.classList.contains("codeblock")){
        var label = nextEditable.querySelector(".label");
        label.classList.add("editing");
    }
    else if(nextEditable.classList.contains("label")){
        nextEditable.classList.add("editing");
    }

}

function getNextCodeblock(currentElement){
    //traverse up from currentElement untill hits codeblock
    var currentCodeBlock;
    if(currentElement.classList.contains("codeblock")){
        currentCodeBlock = currentElement;
    }
    else if(currentElement.parentNode.classList.contains("codeblock")){
        currentCodeBlock = currentElement.parentNode;
    }
    nextBlock = nextByClass(currentCodeBlock, "codeblock");
    if(nextBlock === null){
        //nothing at this level, move up one.
        nextBlock = nextByClass(currentCodeBlock.parentNode, "codeblock");
    }
    return nextBlock;
}

function getPreviousCodeblock(currentElement){
    //TODO: traverse up from currentElement untill hits codeblock
    var currentCodeBlock;
    if(currentElement.classList.contains("codeblock")){
        currentCodeBlock = currentElement;
    }
    else if(currentElement.parentNode.classList.contains("codeblock")){
        currentCodeBlock = currentElement.parentNode;
    }
    previousBlock = previousByClass(currentCodeBlock, "codeblock");
    if(previousBlock === null){
        //nothing at this level, move up one.
        previousBlock = previousByClass(currentCodeBlock.parentNode, "codeblock");
    }
    return previousBlock;
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
                if(newValue != null && newValue != ""){
                    param.setAttribute("data-default-value", newValue);
                }
            }
        }
        hideNumpad();
        moveToNextEditable();
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
    moveToNextEditable();
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

function wrapElementInLi(element){
    var listItem = document.createElement("li");
    listItem.appendChild(element);
    return listItem;
}

function createCodeElement(e, commandObj) {
    //create code element base
    var domElem = document.createElement("span");
    domElem.classList.add("codeblock");
    if(commandObj.type === "value"){
        domElem.classList.add("inline-codeblock");
    }else if(commandObj.type === "function"){
        domElem.classList.add("single-line-codeblock");
    }else if(commandObj.type === "control"){
        domElem.classList.add("multi-line-codeblock");
    }

    //all elements have a label
    var labelStub = document.createElement("span");
    labelStub.classList.add("label");
    var labelStubText = document.createTextNode(commandObj.labelstub);
    labelStub.appendChild(labelStubText);
    //control objects (multiline) need list on label item
    // if(commandObj.type === "control"){
    //     labelStub = wrapElementInLi(labelStub);
    // }
    domElem.appendChild(labelStub);

    //add parameters
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
        // empty = wrapElementInLi(empty);
        domElem.appendChild(empty);
        var labelClose = document.createElement("span");
        labelClose.classList.add("labelclose");
        var labelCloseText = document.createTextNode(commandObj.labelclose);
        labelClose.appendChild(labelCloseText);
        // labelClose = wrapElementInLi(labelClose);
        domElem.appendChild(labelClose);
    }else if(commandObj.type === "function"){
        // domElem = wrapElementInLi(domElem);
    }

    domElem.addEventListener("click", function(event){
        if(event.target.classList.contains("codeblock")){
            moveCursor(event.target);
        }
    });


    //Insert created element into the DOM (needs to out where to insert).
    //TODO: move this logic out of the create element function
    var carat = document.querySelector(".carat");
    var highlight = document.querySelector(".highlight");
    var editing = document.querySelector(".editing");

    if(commandObj){
        //if param, insert over current highlight value, or error
        if(commandObj.type === "value"){
            if(highlight){
                highlight.parentNode.replaceChild(domElem, highlight);
            }
        //not param, so replace line, or insert new line
        }else{
            if(carat){
                if(!carat.parentNode.classList.contains("emptyLine")){
                    var nextEditable = getNextEditableParam(carat);
                    //var caratPos = carat.parentNode.nextSibling;
                    nextEditable.parentNode.insertBefore(domElem, nextEditable);
                }else{
                    // insert code before empty line
                    var empty = carat.parentNode;
                    empty.parentNode.insertBefore(domElem, empty);
                }
            }
            if(highlight){
                var nextBlock = getNextCodeblock(highlight);
                nextBlock.parentNode.insertBefore(domElem, nextBlock);
            //    highlight.parentNode.parentNode.insertBefore(domElem, highlight.parentNode.nextSibling);
            }
            if(editing){
                editing.parentNode.parentNode.replaceChild(domElem, editing.parentNode);
            }
            if(!highlight && !carat && !editing){
                var nextEmptyLine = document.querySelector(".emptyLine");
                if(nextEmptyLine){
                    nextEmptyLine.parentNode.insertBefore(domElem, nextEmptyLine);
                }else{
                    codeContainer.insertBefore(domElem, nextEmptyLine);
                }
            }
        }
        var label = domElem.querySelector(".label");
        if(label != undefined){
            label.addEventListener('click', editLine);
        }
        var blocksList = domElem.querySelector(".emptyLine");
        if(blocksList){
            //move carat to empty line.
            moveCursor(blocksList);
        }
        var paramsList = domElem.querySelectorAll(".param");
        if(paramsList.length > 0){
            editParam(commandObj, paramsList[0]);
        }
        for(var i = 0; i < paramsList.length; i++){
            if(paramsList[i].getAttribute("param-type") != "function"){
                paramsList[i].addEventListener('click', function(event){
                    parameterClicked(event.target);
                });
            }
        }
    }
    updateLineNumbers();
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

function updateLineNumbers(){
    //TODO: stop replacing whole element each time!
    var singleLines = codeContainer.querySelectorAll(".single-line-codeblock, .emptyLine");
    var doubleLines = codeContainer.querySelectorAll(".multi-line-codeblock");
    var lineCount = singleLines.length + doubleLines.length * 2;
    var lineNumbers = document.createElement("div");
    for(var i = 0; i < lineCount; i++){
        var lineNumber = document.createElement("span");
        lineNumber.appendChild(document.createTextNode(i + 1));
        lineNumbers.appendChild(lineNumber);
    }
    var lineNumberContainer = document.querySelector(".line-numbers");
    lineNumberContainer.innerHTML = "";
    lineNumberContainer.appendChild(lineNumbers);
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

    //add functionality to top menu
    var refreshBtn = topMenu.querySelector("#refresh");
    refreshBtn.addEventListener("click", readCode);
    var clearBtn = topMenu.querySelector("#clear");
    clearBtn.addEventListener("click", function() {
        codeContainer.innerHTML = "";
        codeContainer.appendChild(createEmptyLine());
    });

    var arrowLeft = document.querySelector("#arrow-left");
    arrowLeft.addEventListener("click", function() {
        moveToPreviousEditable();
        readCode();
    });
    var arrowRight = document.querySelector("#arrow-right");
    arrowRight.addEventListener("click", function() {
        moveToNextEditable();
        readCode();
    });

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

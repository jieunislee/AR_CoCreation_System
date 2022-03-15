let socket = io();

var markerPositionX;
var markerPositionY;

let canvas = new fabric.Canvas('c1');
let canvas2 = new fabric.Canvas('c2');
let canvas3 = new fabric.Canvas('c3');
let canvas4 = new fabric.Canvas('c4');
let canvas5 = new fabric.Canvas('c5');
let canvasMaster = new fabric.Canvas('cMaster');

let line, triangle, origX, origY, isFreeDrawing = false;
let isRectActive = false, isCircleActive = false, isArrowActive = false, activeColor = '#ffffff';
let isLoadedFromJson = false;

//init variables
let div = $("#canvasWrapper");
let $canvas = $("#c1");
let $canvas2 = $("#c2");
let $canvas3 = $("#c3");
let $canvas4 = $("#c4");
let $canvas5 = $("#c5");
let $canvasMaster = $("#cMaster");

//width and height of canvas's wrapper
let w, h;
w = div.width();
h = div.height();
$canvas.width(w).height(h);

//set w & h for canvas
canvas.setHeight(320);
canvas.setWidth(400);
canvas2.setHeight(320);
canvas2.setWidth(400);
canvas3.setHeight(320);
canvas3.setWidth(400);
canvas4.setHeight(320);
canvas4.setWidth(400);
canvas5.setHeight(320);
canvas5.setWidth(400);
canvasMaster.setHeight(1070);
canvasMaster.setWidth(1910);

var group1, group2, group3, group4, group5;
var groupInfo1 = {
  left: 0,
  top: 0,
  scaleX: 1,
  scaleY: 1
};

var groupInfo2 = {
  left: 0,
  top: 0,
  scaleX: 0,
  scaleY: 0
};

var groupInfo3 = {
  left: 0,
  top: 0,
  scaleX: 0,
  scaleY: 0
};

var groupInfo4 = {
  left: 0,
  top: 0,
  scaleX: 0,
  scaleY: 0
};

var groupInfo5 = {
  left: 0,
  top: 0,
  scaleX: 0,
  scaleY: 0
};

function initCanvas(canvas) {
    canvas.clear();
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        //color: '#ffffff',

    });
    canvas.freeDrawingBrush.width = 5;
    canvas.isDrawingMode = false;
    // canvas.backgroundColor = 'black';

    return canvas;
}

function setBrush(options) {
    if (options.width !== undefined) {
        canvas.freeDrawingBrush.width = parseInt(options.width, 10);
    }

    if (options.color !== undefined) {
        canvas.freeDrawingBrush.color = options.color;
    }
}

function setCanvasSelectableStatus(val) {
    canvas.forEachObject(function(obj) {
        obj.lockMovementX = ! val;
        obj.lockMovementY = ! val;
        obj.hasControls = val;
        obj.hasBorders = val;
        obj.selectable = val;
    });
    canvas.renderAll();
}

function setFreeDrawingMode(val) {
    isFreeDrawing = val;
    disableShapeMode();
}

function removeCanvasEvents() {
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.off('object:moving');
}

function enableShapeMode() {
    removeCanvasEvents();
    isFreeDrawing = canvas.isDrawingMode;
    canvas.isDrawingMode = false;
    canvas.selection = false;
    setCanvasSelectableStatus(false);
}

function disableShapeMode() {
    removeCanvasEvents();
    canvas.isDrawingMode = isFreeDrawing;
    if (isFreeDrawing) {
        $("#drwToggleDrawMode").addClass('active');
    }
    canvas.selection = true;
    isArrowActive = isRectActive = isCircleActive = false;
    setCanvasSelectableStatus(true);
}

function deleteObjects() {
    let activeGroup = canvas.getActiveObjects();

    if (activeGroup) {
        canvas.discardActiveObject();
        activeGroup.forEach(function (object) {
            canvas.remove(object);
        });
    }
}

function emitEvent() {
    let aux = canvasMaster;
    let json = aux.toJSON();
    let data = {
        w: w,
        h: h,
        data: json
    };
    socket.emit('drawingProjection', data);
}

socket.on('drawingProjection', function (obj) {
    isLoadedFromJson = true;
    canvasMaster.loadFromJSON(obj.data);
    console.log("test")
});

$(function () {
    //Canvas init
    initCanvas(canvas).renderAll();
    initCanvas(canvas2).renderAll();
    initCanvas(canvas3).renderAll();
    initCanvas(canvas4).renderAll();
    initCanvas(canvas5).renderAll();
    initCanvas(canvasMaster).renderAll();

    //canvas events
    // canvasMaster.on('mouse:up', function() {
    //     if (! isLoadedFromJson) {
    //         emitEvent();
    //     }
    //     isLoadedFromJson = false;
    //     console.log("test");
    // });

    //dynamically resize the canvas on window resize
    // $(window)
    //     .on('resize', function () {
    //         w = div.width();
    //         h = div.height();
    //         canvas.setHeight(h);
    //         canvas.setWidth(w);
    //         $canvas.width(w).height(h);
    //     })
    //     .on('keydown', function (e) {
    //         if (e.keyCode === 46) { //delete key
    //             deleteObjects();
    //         }
    //     });


    canvas.renderAll();

    //Sockets
    socket.emit('ready', "Page loaded");

    socket.on('drawing1', function (obj) {
        //set this flag, to disable infinite rendering loop
        isLoadedFromJson = true;

        //calculate ratio by dividing this canvas width to sender canvas width
        // let ratio = w / obj.w;
        let ratio = 0.5;

        //reposition and rescale each sent canvas object
        obj.data.objects.forEach(function(object) {
            object.left *= ratio;
            object.scaleX *= ratio;
            object.top *= ratio;
            object.scaleY *= ratio;
            console.log(object)

        });

        canvas.loadFromJSON(obj.data);

        //copy to master canvas
        if(group1 != null){
          groupInfo1.left = group1.left;
          groupInfo1.top = group1.top;
          groupInfo1.scaleX = group1.scaleX;
          groupInfo1.scaleY = group1.scaleY;
          canvasMaster.remove(group1);
        }

        var objs = []
        for (var i = 0 ; i < canvas.getObjects().length; i++) {
            objs.push(canvas.getObjects()[i])
        }
        group1 = new fabric.Group(objs);
        canvasMaster.add(group1);
        // canvasMaster.renderAll();

        if(groupInfo1.scaleX != 0){
          group1.left = groupInfo1.left;
          group1.top = groupInfo1.top;
          group1.scaleX = groupInfo1.scaleX;
          group1.scaleY = groupInfo1.scaleY;
        }

        setBorderText();
        canvasMaster.renderAll();

    });

    socket.on('drawing2', function (obj) {
        //set this flag, to disable infinite rendering loop
        isLoadedFromJson = true;

        //calculate ratio by dividing this canvas width to sender canvas width
        // let ratio = w / obj.w;
        let ratio = 0.5;

        //reposition and rescale each sent canvas object
        obj.data.objects.forEach(function(object) {
            object.left *= ratio;
            object.scaleX *= ratio;
            object.top *= ratio;
            object.scaleY *= ratio;
        });

        canvas2.loadFromJSON(obj.data);

        //copy to master canvas
        if(group2 != null){
          groupInfo2.left = group2.left;
          groupInfo2.top = group2.top;
          groupInfo2.scaleX = group2.scaleX;
          groupInfo2.scaleY = group2.scaleY;
          canvasMaster.remove(group2);
        }

        var objs = []
        for (var i = 0 ; i < canvas2.getObjects().length; i++) {
            objs.push(canvas2.getObjects()[i])
        }
        group2 = new fabric.Group(objs);
        canvasMaster.add(group2);

        if(groupInfo2.scaleX != 0){
          group2.left = groupInfo2.left;
          group2.top = groupInfo2.top;
          group2.scaleX = groupInfo2.scaleX;
          group2.scaleY = groupInfo2.scaleY;
        }

        setBorderText();
        canvasMaster.renderAll();
    });

    socket.on('drawing3', function (obj) {
        //set this flag, to disable infinite rendering loop
        isLoadedFromJson = true;

        //calculate ratio by dividing this canvas width to sender canvas width
        // let ratio = w / obj.w;
        let ratio = 0.5;

        //reposition and rescale each sent canvas object
        obj.data.objects.forEach(function(object) {
            object.left *= ratio;
            object.scaleX *= ratio;
            object.top *= ratio;
            object.scaleY *= ratio;
        });

        canvas3.loadFromJSON(obj.data);

        //copy to master canvas
        if(group3 != null){
          groupInfo3.left = group3.left;
          groupInfo3.top = group3.top;
          groupInfo3.scaleX = group3.scaleX;
          groupInfo3.scaleY = group3.scaleY;
          canvasMaster.remove(group3);
        }

        var objs = []
        for (var i = 0 ; i < canvas3.getObjects().length; i++) {
            objs.push(canvas3.getObjects()[i])
        }
        group3 = new fabric.Group(objs);
        canvasMaster.add(group3);

        if(groupInfo3.scaleX != 0){
          group3.left = groupInfo3.left;
          group3.top = groupInfo3.top;
          group3.scaleX = groupInfo3.scaleX;
          group3.scaleY = groupInfo3.scaleY;
        }

        setBorderText();
        canvasMaster.renderAll();
    });

    socket.on('drawing4', function (obj) {
        //set this flag, to disable infinite rendering loop
        isLoadedFromJson = true;

        //calculate ratio by dividing this canvas width to sender canvas width
        // let ratio = w / obj.w;
        let ratio = 0.5;

        //reposition and rescale each sent canvas object
        obj.data.objects.forEach(function(object) {
            object.left *= ratio;
            object.scaleX *= ratio;
            object.top *= ratio;
            object.scaleY *= ratio;
        });

        canvas4.loadFromJSON(obj.data);

        //copy to master canvas
        if(group4 != null){
          groupInfo4.left = group4.left;
          groupInfo4.top = group4.top;
          groupInfo4.scaleX = group4.scaleX;
          groupInfo4.scaleY = group4.scaleY;
          canvasMaster.remove(group4);
        }

        var objs = []
        for (var i = 0 ; i < canvas4.getObjects().length; i++) {
            objs.push(canvas4.getObjects()[i])
        }
        group4 = new fabric.Group(objs);
        canvasMaster.add(group4);

        if(groupInfo4.scaleX != 0){
          group4.left = groupInfo4.left;
          group4.top = groupInfo4.top;
          group4.scaleX = groupInfo4.scaleX;
          group4.scaleY = groupInfo4.scaleY;
        }

        setBorderText();
        canvasMaster.renderAll();
    });

    socket.on('drawing5', function (obj) {
        //set this flag, to disable infinite rendering loop
        isLoadedFromJson = true;

        //calculate ratio by dividing this canvas width to sender canvas width
        // let ratio = w / obj.w;
        let ratio = 0.5;

        //reposition and rescale each sent canvas object
        obj.data.objects.forEach(function(object) {
            object.left *= ratio;
            object.scaleX *= ratio;
            object.top *= ratio;
            object.scaleY *= ratio;
        });

        canvas5.loadFromJSON(obj.data);

        //copy to master canvas
        if(group5 != null){
          groupInfo5.left = group5.left;
          groupInfo5.top = group5.top;
          groupInfo5.scaleX = group5.scaleX;
          groupInfo5.scaleY = group5.scaleY;
          canvasMaster.remove(group5);
        }

        var objs = []
        for (var i = 0 ; i < canvas5.getObjects().length; i++) {
            objs.push(canvas5.getObjects()[i])
        }
        group5 = new fabric.Group(objs);
        canvasMaster.add(group5);

        if(groupInfo5.scaleX != 0){
          group5.left = groupInfo5.left;
          group5.top = groupInfo5.top;
          group5.scaleX = groupInfo5.scaleX;
          group5.scaleY = groupInfo5.scaleY;
        }

        setBorderText();
        canvasMaster.renderAll();
    });


    // socket.on('position1', function (data) {
    //     markerPositionX = data.x;
    //     markerPositionY = data.y;
    //     $("#canvasIndicator").css("top", markerPositionY + "px")
    //     $("#canvasIndicator").css("left", markerPositionX + "px")
    //     console.log(data)
    // });
    //
    // socket.on('markerStamp', function (data) {
    //     var canvasNum = data[7];
    //     console.log(data)
    //     $("#canvasWrapper" + canvasNum).css("top", markerPositionY + "px")
    //     $("#canvasWrapper" + canvasNum).css("left", markerPositionX + "px")
    // });
});

$("#canvasWrapper1").on('click', function () {
    console.log("test")
});

var borderState = false;


$(document).keypress(function(event){
    if (event.keyCode == 13) { //enter
      if(borderState == true){
        group1.item(0).set({opacity: 1, fill: 'none', strokeWidth: 2, stroke: "#fff"});
        group2.item(0).set({opacity: 1, fill: 'none', strokeWidth: 2, stroke: "#fff"});
        group3.item(0).set({opacity: 1, fill: 'none', strokeWidth: 2, stroke: "#fff"});
        group4.item(0).set({opacity: 1, fill: 'none', strokeWidth: 2, stroke: "#fff"});
        group5.item(0).set({opacity: 1, fill: 'none', strokeWidth: 2, stroke: "#fff"});
        group1.item(1).set({opacity: 1});
        group2.item(1).set({opacity: 1});
        group3.item(1).set({opacity: 1});
        group4.item(1).set({opacity: 1});
        group5.item(1).set({opacity: 1});
        canvasMaster.renderAll();
        borderState = false;
      }else if(borderState == false){
        group1.item(0).set({opacity: 0, fill: 'none', strokeWidth: 2, stroke: "none"});
        group2.item(0).set({opacity: 0, fill: 'none', strokeWidth: 2, stroke: "none"});
        group3.item(0).set({opacity: 0, fill: 'none', strokeWidth: 2, stroke: "none"});
        group4.item(0).set({opacity: 0, fill: 'none', strokeWidth: 2, stroke: "none"});
        group5.item(0).set({opacity: 0, fill: 'none', strokeWidth: 2, stroke: "none"});
        group1.item(1).set({opacity: 0});
        group2.item(1).set({opacity: 0});
        group3.item(1).set({opacity: 0});
        group4.item(1).set({opacity: 0});
        group5.item(1).set({opacity: 0});
        canvasMaster.renderAll();
        borderState = true;
      }
    }
});

function setBorderText(){
  if(borderState == false){
    group1.item(0).set({opacity: 1, fill: 'none', strokeWidth: 2, stroke: "#fff"});
    group2.item(0).set({opacity: 1, fill: 'none', strokeWidth: 2, stroke: "#fff"});
    group3.item(0).set({opacity: 1, fill: 'none', strokeWidth: 2, stroke: "#fff"});
    group4.item(0).set({opacity: 1, fill: 'none', strokeWidth: 2, stroke: "#fff"});
    group5.item(0).set({opacity: 1, fill: 'none', strokeWidth: 2, stroke: "#fff"});
    group1.item(1).set({opacity: 1});
    group2.item(1).set({opacity: 1});
    group3.item(1).set({opacity: 1});
    group4.item(1).set({opacity: 1});
    group5.item(1).set({opacity: 1});
    canvasMaster.renderAll();
  }else if(borderState == true){
    group1.item(0).set({opacity: 0, fill: 'none', strokeWidth: 2, stroke: "none"});
    group2.item(0).set({opacity: 0, fill: 'none', strokeWidth: 2, stroke: "none"});
    group3.item(0).set({opacity: 0, fill: 'none', strokeWidth: 2, stroke: "none"});
    group4.item(0).set({opacity: 0, fill: 'none', strokeWidth: 2, stroke: "none"});
    group5.item(0).set({opacity: 0, fill: 'none', strokeWidth: 2, stroke: "none"});
    group1.item(1).set({opacity: 0});
    group2.item(1).set({opacity: 0});
    group3.item(1).set({opacity: 0});
    group4.item(1).set({opacity: 0});
    group5.item(1).set({opacity: 0});
    canvasMaster.renderAll();
  }
}


function calcDist(_p1, _p2){
  var _dist;
  _dist = Math.sqrt((_p1.x -_p2.x)*(_p1.x -_p2.x) + (_p1.y -_p2.y)*(_p1.y -_p2.y));
  return _dist;
}

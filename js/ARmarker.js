//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////
// var socket = io.connect('192.249.28.101:8080');
var socket = io.connect('143.248.250.206:8080');

// init renderer
var renderer	= new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize( 650, 800 );
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild( renderer.domElement );
// array of functions for the rendering loop
var onRenderFcts= [];
// init scene and camera
var scene	= new THREE.Scene();
//////////////////////////////////////////////////////////////////////////////////
//		Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////
// Create a camera
var camera = new THREE.Camera();
scene.add(camera);
////////////////////////////////////////////////////////////////////////////////
//          handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////
var arToolkitSource = new THREEx.ArToolkitSource({
  // to read from the webcam
  sourceType : 'webcam',
  // // to read from an image
  // sourceType : 'image',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',
  // to read from a video
  // sourceType : 'video',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
  // resolution of at which we initialize in the source image
   sourceWidth: 1920,
   sourceHeight: 1080,
   // resolution displayed for the source
   displayWidth: 1920,
   displayHeight: 1080,
})
arToolkitSource.init(function onReady(){
  onResize();
})
// handle resize
window.addEventListener('resize', function(){
  onResize();
})
function onResize(){
  arToolkitSource.onResizeElement()
  arToolkitSource.copyElementSizeTo(renderer.domElement)
  if( arToolkitContext.arController !== null ){
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
  }
}
////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////
// create atToolkitContext
var arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
  detectionMode: 'mono',
})
// initialize it
arToolkitContext.init(function onCompleted(){

  // copy projection matrix to camera
  camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
})
// update artoolkit on every frame
onRenderFcts.push(function(){
  if( arToolkitSource.ready === false )	return
  arToolkitContext.update( arToolkitSource.domElement )
  // update scene.visible if the marker is seen
  scene.visible = camera.visible
})


// ;(function(){
// build markerControls
var markerRoot1 = new THREE.Group
markerRoot1.name = 'marker1'
scene.add(markerRoot1)
var markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
  type : 'pattern',
  patternUrl : './res/patts/marker1.patt',
})

var markerRoot2 = new THREE.Group
markerRoot2.name = 'marker2'
scene.add(markerRoot2)
var markerControls2 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot2, {
  type : 'pattern',
  patternUrl : './res/patts/marker2.patt',
})

var position1 = {x:-1000, y:-1000};
var position2 = {x:-1000, y:-1000};
var position_calibration1;
var position_calibration2;

var counter1 = 0;
var counter2 = 0;
var limit = 10;

var icounter1 = 0;
var icounter2 = 0;
var ilimit = 20;

var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
  // keep looping
  requestAnimationFrame( animate );
  // measure time
  lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
  var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec	= nowMsec
  // call each update function
  onRenderFcts.forEach(function(onRenderFct){
    onRenderFct(deltaMsec/1000, nowMsec/1000)
  })

  if(markerRoot1.visible){
    position1 = getScreenPosition(markerRoot1.position);
    counter1 ++;
    if(counter1 > limit){
      socket.emit('position1', {x:position1.x, y:position1.y});
      console.log(position1.x)
      counter1 = 0;
    }
  }else{
    icounter1 ++;
    if(icounter1 > ilimit){
      socket.emit('position1', {x: -1000, y:-1000});
      icounter1 = 0;
    }
  }

  if(markerRoot2.visible){
    position2 = getScreenPosition(markerRoot2.position);
    counter2 ++;
    if(counter2 > limit){
      socket.emit('position2', {x:position2.x, y:position2.y});
      counter2 = 0;
    }
  }
  // else{
  //   icounter2 ++;
  //   if(icounter2 > ilimit){
  //     socket.emit('position2', {x: -1000, y:-1000});
  //     icounter2 = 0;
  //   }
  // }
});

function getScreenPosition(position) {
    var vector = new THREE.Vector3( position.x, position.y, position.z );

    vector.project(camera);

    vector.x = Math.round( (   vector.x + 1 ) * window.innerWidth / 2 );
    vector.y = Math.round( ( - vector.y + 1 ) * window.innerHeight / 2 );

    return vector;
}

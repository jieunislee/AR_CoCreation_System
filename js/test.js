var selected = false;
var isRuleEditing = false;


$("#fullScreen_test").click(function(){
  document.documentElement.requestFullscreen();
  $("#fullScreen_test").hide();
});
//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////
// init renderer
var renderer	= new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize( 640, 480 );
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
})
arToolkitSource.init(function onReady(){
  onResize()
})
// handle resize
window.addEventListener('resize', function(){
  onResize()

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
var markerRoot_s1 = new THREE.Group
markerRoot_s1.name = 'marker_s1'
scene.add(markerRoot_s1)
var markerControls_s1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot_s1, {
  type : 'pattern',
  patternUrl : './public/res/patts/s1.patt',
  // changeMatrixMode: 'cameraTransformMatrix'
})

var markerRoot_s2 = new THREE.Group
markerRoot_s2.name = 'marker_s2'
scene.add(markerRoot_s2)
var markerControls_s2 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot_s2, {
  type : 'pattern',
  patternUrl : './public/res/patts/s2.patt',
})

var markerRoot_s3 = new THREE.Group
markerRoot_s3.name = 'marker_s3'
scene.add(markerRoot_s3)
var markerControls_s3 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot_s3, {
  type : 'pattern',
  patternUrl : './public/res/patts/s3.patt',
})

var markerRoot_m1 = new THREE.Group
markerRoot_m1.name = 'marker_m1'
scene.add(markerRoot_m1)
var markerControls_m1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot_m1, {
  type : 'pattern',
  patternUrl : './public/res/patts/m1.patt',
})

var markerRoot_m2 = new THREE.Group
markerRoot_m2.name = 'marker_m2'
scene.add(markerRoot_m2)
var markerControls_m2 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot_m2, {
  type : 'pattern',
  patternUrl : './public/res/patts/m2.patt',
})

var markerRoot_m3 = new THREE.Group
markerRoot_m3.name = 'marker_m3'
scene.add(markerRoot_m3)
var markerControls_m3 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot_m3, {
  type : 'pattern',
  patternUrl : './public/res/patts/m3.patt',
})

var markerRoot_r1 = new THREE.Group
markerRoot_r1.name = 'marker_r1'
scene.add(markerRoot_r1)
var markerControls_r1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot_r1, {
  type : 'pattern',
  patternUrl : './public/res/patts/r1.patt',
})

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
  // console.log(markerControls.object3d.position.x)
  // console.log("x:  " + markerRoot1.position.x + "y:  " + markerRoot1.position.y)

  var position_m1 = getScreenPosition(markerRoot_m1.position);
  $("#left_wing").css("left", position_m1.x - 800 + 80);
  $("#left_wing").css("top", position_m1.y - 300);

  var position_m2 = getScreenPosition(markerRoot_m2.position);
  $("#right_wing").css("left", position_m2.x - 80);
  $("#right_wing").css("top", position_m2.y -300);
  // var position_s1 = getScreenPosition(markerRoot_s1.position);
  // $("#s1_text_container").css("left", position_s1.x);
  // $("#s1_text_container").css("top", position_s1.y);
  // $("#s1_text").html(markerRoot_s1.position.z.toFixed(2));
  //
  // var position_s2 = getScreenPosition(markerRoot_s2.position);
  // $("#s2_text_container").css("left", position_s2.x);
  // $("#s2_text_container").css("top", position_s2.y);
  // $("#s2_text").html(markerRoot_s2.position.z.toFixed(2));
  //
  // var position_s3 = getScreenPosition(markerRoot_s3.position);
  // $("#s3_text_container").css("left", position_s3.x);
  // $("#s3_text_container").css("top", position_s3.y);
  // $("#s3_text").html(markerRoot_s3.position.z.toFixed(2));
  //
  // var position_m1 = getScreenPosition(markerRoot_m1.position);
  // $("#m1_text_container").css("left", position_m1.x);
  // $("#m1_text_container").css("top", position_m1.y);
  // $("#m1_text").html(markerRoot_m1.position.z.toFixed(2));
  //
  // var position_m2 = getScreenPosition(markerRoot_m2.position);
  // $("#m2_text_container").css("left", position_m2.x);
  // $("#m2_text_container").css("top", position_m2.y);
  // $("#m2_text").html(markerRoot_m2.position.z.toFixed(2));
  //
  // var position_m3 = getScreenPosition(markerRoot_m3.position);
  // $("#m3_text_container").css("left", position_m3.x);
  // $("#m3_text_container").css("top", position_m3.y);
  // $("#m3_text").html(markerRoot_m3.position.z.toFixed(2));

  if(selected == false)  $("#component_define_select_btn").html(findClosestQRcode());
  if(isRuleEditing == true) $("#rule_define_select_btn").html(findClosestQRcode());
  if(isRuleEditing == false) $("#rule_define_select_btn").html(findClosestRuleQRcode());
})

function getScreenPosition(position) {
    var vector = new THREE.Vector3( position.x, position.y, position.z );

    vector.project(camera);

    vector.x = Math.round( (   vector.x + 1 ) * window.innerWidth / 2 );
    vector.y = Math.round( ( - vector.y + 1 ) * window.innerHeight / 2 );

    return vector;
}

var closestQRcode;
function findClosestQRcode(){
  var _max = Number.NEGATIVE_INFINITY;
  if(markerRoot_s1.visible && _max < markerRoot_s1.position.z) {
    _max = markerRoot_s1.position.z.toFixed(2);
    closestQRcode = "S1";
  }

  if(markerRoot_s2.visible && _max < markerRoot_s2.position.z) {
    _max = markerRoot_s2.position.z.toFixed(2);
    closestQRcode = "S2";
  }

  if(markerRoot_s3.visible && _max < markerRoot_s3.position.z) {
    _max = markerRoot_s3.position.z.toFixed(2);
    closestQRcode = "S3";
  }

  if(markerRoot_m1.visible && _max < markerRoot_m1.position.z) {
    _max = markerRoot_m1.position.z.toFixed(2);
    closestQRcode = "M1";
  }

  if(markerRoot_m2.visible && _max < markerRoot_m2.position.z) {
    _max = markerRoot_m2.position.z.toFixed(2);
    closestQRcode = "M2";
  }

  if(markerRoot_m3.visible && _max < markerRoot_m3.position.z) {
    _max = markerRoot_m3.position.z.toFixed(2);
    closestQRcode = "M3";
  }

  if(!markerRoot_s1.visible && !markerRoot_s2.visible && !markerRoot_s3.visible && !markerRoot_m1.visible && !markerRoot_m2.visible && !markerRoot_m3.visible){
    closestQRcode = "Select";
  }

  return closestQRcode;
}

var closestRuleQRCode;
function findClosestRuleQRcode(){
  var _max = Number.NEGATIVE_INFINITY;
  if(markerRoot_r1.visible && _max < markerRoot_r1.position.z) {
    _max = markerRoot_r1.position.z.toFixed(2);
    closestRuleQRCode = "R1";
  }

  if(!markerRoot_r1.visible){
    closestRuleQRCode = "New"
  }

  return closestRuleQRCode;
}

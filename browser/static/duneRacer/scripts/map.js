var heights;
var camera, scene, renderer, geometry, material, mesh, projector,ground,controls, plane,texture;
var quality = 50;
var groundSize = 2000;
var mouseValue = 0;

var wireframe = false;
var wireframeMaterial;

$(document).ready(function() {
  if (! Detector.webgl) Detector.addGetWebGLMessage();
  init();
  animate();


  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xefd1b5, 0.005);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 200;
    camera.position.z = 1000;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.x = .5;
    directionalLight.position.y = .5;
    directionalLight.position.z = .5;

    scene.add(directionalLight);
    var light = new THREE.PointLight(0xff0040, 900, 50);
    light.position.x = -1000;
    light.position.z = 100;
    scene.add(light);

    wireframeMaterial = material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff, fog:true, wireframe:true } );

    controls = new THREE.ModifiedRollControls(camera);
    controls.movementSpeed = 100;
    controls.lookSpeed = 3;
    controls.constrainVertical = [-.7,.7];

    scene.add(camera);

    plane = new THREE.PlaneGeometry(groundSize, groundSize, quality, quality);
    rebuildGround(true);

    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setClearColorHex(0xffffff, 1);
    renderer.setSize(window.innerWidth - 30, window.innerHeight - 30);

    projector = new THREE.Projector();

    document.body.appendChild(renderer.domElement);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
  }


  function onDocumentMouseDown(event) {
    event.preventDefault();
    if (event.button == 2) {
      mouseValue = -1;
    } else {
      mouseValue = 1
    }
    handleClick(event);
  }

  function onDocumentMouseUp(event) {
    event.preventDefault();
    mouseValue = 0;
  }

  function onDocumentMouseMove(event) {
    if (mouseValue != 0) {
      handleClick(event);
    }
  }

  function handleClick(event) {
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    projector.unprojectVector(vector, camera);

    var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

    var intersects = ray.intersectObjects([ground]);
    if (intersects.length > 0) {
      var x = intersects[0].point.x;
      var y = intersects[0].point.z;
      var positionX = Math.round(((groundSize / 2 + x) / groundSize) * quality);
      var positionY = Math.round(((groundSize / 2 + y) / groundSize) * quality);

      updateGroundHeight(positionX, positionY, 5 * mouseValue);
      rebuildGround();
    }
  }

  function updateGroundHeight(x, y, value) {
    heights[x][y] += value;
    var newHeight = heights[x][y];
    var siblingHeight = getSiblingHeightChange(newHeight, x, y + 1);
    if (siblingHeight != 0) {
      updateGroundHeight(x, y + 1, siblingHeight);
    }
    siblingHeight = getSiblingHeightChange(newHeight, x, y - 1);
    if (siblingHeight != 0) {
      updateGroundHeight(x, y - 1, siblingHeight);
    }
    siblingHeight = getSiblingHeightChange(newHeight, x + 1, y);
    if (siblingHeight != 0) {
      updateGroundHeight(x + 1, y, siblingHeight);
    }
    siblingHeight = getSiblingHeightChange(newHeight, x - 1, y);
    if (siblingHeight != 0) {
      updateGroundHeight(x - 1, y, siblingHeight);
    }
  }

  function getSiblingHeightChange(height, x1, y1) {
    var maxDifference = 30;
    var rtnHeightChange = 0;
    if (x1 >= 0
      && y1 >= 0
      && heights.length > x1
      && heights[x1].length > (y1)
      && Math.abs(height - heights[x1][y1]) > maxDifference
      ) {
      var testHeight = heights[x1][y1];
      if (height > testHeight) {
        rtnHeightChange = (height - maxDifference) - testHeight;
      } else {
        rtnHeightChange = (height + maxDifference) - testHeight;
      }
    }
    return rtnHeightChange;
  }


  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    if (typeof controls != "undefined") {
      controls.update();
    }
    renderer.render(scene, camera);
  }
});
function rebuildGround(firstTime) {
  if (!firstTime) {
    scene.remove(ground);
  }
  plane = new THREE.PlaneGeometry(groundSize, groundSize, quality, quality);
  var heights = getGroundHeights();
  for (var i = 0, l = plane.vertices.length; i < l; i ++) {
    var x = (i % (quality + 1));
    var y = Math.floor(i / (quality + 1));
    plane.vertices[ i ].position.z = heights[x][y];
  }
  rebuildMaterial();
  ground = new THREE.Mesh(plane, material);
  ground.rotation.x = -90 * Math.PI / 180;
  scene.add(ground);
}

function getGroundHeights() {
  if (typeof heights == "undefined") {
    heights = [];
    for (var i = 0; i <= quality; i++) {
      heights[i] = [];
      for (var j = 0; j <= quality; j++) {
        heights[i][j] = Math.random() * 25;
//          heights[i][j] = 0;
      }
    }
  }
  return heights;
}

function rebuildMaterial() {
  if(wireframe){
    material = wireframeMaterial;
  }else{
    texture = new THREE.Texture(generateTexture(getHeights2D(), quality, quality), new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
    texture.needsUpdate = true;
    material = new THREE.MeshBasicMaterial({ map: texture });
  }
}

function exportMap() {
  var heightsJSON = JSON.stringify(heights);
  var compressed = LZMA.compress(heightsJSON);
//  var mapStorage = window.localStorage.getItem("mapStorage");
//  if(typeof mapStorage == "string"){
//    mapStorage =  $.parseJSON(mapStorage);
//  }
//  if(typeof mapStorage != "object" || mapStorage == null){
//    mapStorage = [];
//  }
  mapStorage = [];
  mapStorage.push(compressed);
  window.localStorage.setItem("mapStorage", JSON.stringify(mapStorage));
}

function importMap() {
  var mapStorage = window.localStorage.getItem("mapStorage");
  if (mapStorage != null) {
    mapStorage = $.parseJSON(mapStorage);
    if (mapStorage.length > 0) {
      heights = $.parseJSON(LZMA.decompress(mapStorage[0]));
      rebuildGround();
    }
  }
}

function toggleWireframe() {
  wireframe = !wireframe;
  rebuildGround();
}


function getHeights2D() {
  var rtnHeights = new Float32Array(plane.vertices.length);
  for (var i = 0, l = plane.vertices.length; i < l; i ++) {
    rtnHeights[i] = plane.vertices[ i ].position.z;
  }
  return rtnHeights;
}


function generateTexture(data, width, height) {
  var canvas, canvasScaled, context, image, imageData,
    level, diff, vector3, sun, shade;

  vector3 = new THREE.Vector3(0, 0, 0);

  sun = new THREE.Vector3(1, 1, 1);
  sun.normalize();

  canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext('2d');
  context.fillStyle = '#000';
  context.fillRect(0, 0, width, height);

  image = context.getImageData(0, 0, canvas.width, canvas.height);
  imageData = image.data;

  for (var i = 0, j = 0, l = imageData.length; i < l; i += 4,j ++) {
    vector3.x = data[ j - 2 ] - data[ j + 2 ];
    vector3.y = 2;
    vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
    vector3.normalize();
    shade = vector3.dot(sun);
    imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
    imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
    imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
  }
  context.putImageData(image, 0, 0);

  // Scaled 4x

  canvasScaled = document.createElement('canvas');
  canvasScaled.width = width * 4;
  canvasScaled.height = height * 4;

  context = canvasScaled.getContext('2d');
  context.scale(4, 4);
  context.drawImage(canvas, 0, 0);

  image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
  imageData = image.data;

  for (var i = 0, l = imageData.length; i < l; i += 4) {
    var v = ~~ ( Math.random() * 5 );
    imageData[ i ] += v;
    imageData[ i + 1 ] += v;
    imageData[ i + 2 ] += v;
  }
  context.putImageData(image, 0, 0);
  return canvasScaled;
}
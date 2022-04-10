import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('#bg');
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const gui = new dat.GUI();
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('static/normal-bg2.png');
const torusnormalTexture = textureLoader.load('static/normal-bg2.png');
let INTERSECTED = null;
let mixer;


const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;

scene.add(camera);

let top;
let top2;
let middle;
let bottom;
let bottom2;

const rockMaterial = new THREE.MeshStandardMaterial({color: 0x212121});
rockMaterial.metalness = 0.9;
rockMaterial.roughness = .75;

loader.load( 'models/test/top.glb', function ( gltf ) {
  const model = gltf.scene;
  scene.add( model );
  top = model;
  top.userData.isContainer = true;
  console.log(top)
  top.traverse((o) => {
    if (o.isMesh) o.material = rockMaterial;
  });
}, function ( xhr ) {
  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}, function ( error ) {
  console.error( error );
} );

loader.load( 'models/test/top2.glb', function ( gltf ) {
  scene.add( gltf.scene );
  top2 = gltf.scene;
  top2.traverse((o) => {
    if (o.isMesh) o.material = rockMaterial;
  });
}, function ( xhr ) {
  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}, function ( error ) {
  console.error( error );
} );

loader.load( 'models/test/middle.glb', function ( gltf ) {
  const model = gltf.scene;
  middle = gltf.scene;
  middle.traverse((o) => {
    if (o.isMesh) o.material = rockMaterial;
  });
  scene.add(model)
}, function ( xhr ) {
  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}, function ( error ) {
  console.error( error );
} );

loader.load( 'models/test/bottom2.glb', function ( gltf ) {
  scene.add( gltf.scene );
  bottom2 = gltf.scene;
  bottom2.traverse((o) => {
    if (o.isMesh) o.material = rockMaterial;
  });
}, function ( xhr ) {
  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}, function ( error ) {
  console.error( error );
} );

loader.load( 'models/test/bottom.glb', function ( gltf ) {
  scene.add( gltf.scene );
  bottom = gltf.scene;
  bottom.traverse((o) => {
    if (o.isMesh) o.material = rockMaterial;
  });
}, function ( xhr ) {
  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}, function ( error ) {
  console.error( error );
} );








// Sphare
const sphareGeometry = new THREE.SphereBufferGeometry( .5, 64, 64 );
const sphareMaterial = new THREE.MeshStandardMaterial();
sphareMaterial.metalness = 0.7;
sphareMaterial.roughness = 0.2;
sphareMaterial.normalMap = normalTexture;
sphareMaterial.color = new THREE.Color(0x292929);
const sphere = new THREE.Mesh(sphareGeometry, sphareMaterial);

scene.add(sphere);

function addLight() {
  // Light 1
  const pointLightColor = { color: 0xffffff }
  const pointLight = new THREE.PointLight(pointLightColor.color);
  pointLight.position.set(1.1,1.5,0.5);
  pointLight.intensity = 4.3;
  pointLight.color.set(pointLightColor);

  // Light 2
  const pointLight2Color = { color: 0xb6a653 }
  const pointLight2 = new THREE.PointLight(pointLight2Color.color);
  pointLight2.position.set(1.9,-3,-1.5);
  pointLight2.intensity = 1.3;
  pointLight2.color.set(pointLight2Color)

  // Light 3 
  const pointLight3Color = { color: 0x46bff }
  const pointLight3 = new THREE.PointLight(0x46bff);
  pointLight3.position.set(-4.9,-2.6,-2);
  pointLight3.intensity = 3.6;
  pointLight3.color.set(pointLight3Color)

  scene.add(pointLight, pointLight2, pointLight3);

  // Light helpers
  const light1 = gui.addFolder('Light 1');
  light1.add(pointLight.position, 'x').min(-6).max(6).step(0.1);
  light1.add(pointLight.position, 'y').min(-3).max(3).step(0.1);
  light1.add(pointLight.position, 'z').min(-3).max(3).step(0.1);
  light1.add(pointLight, 'intensity').min(0).max(10).step(0.1);
  light1.addColor(pointLightColor, 'color')
    .onChange(() => {
      pointLight.color.set(pointLightColor.color);
    });

  const light2 = gui.addFolder('Light 2');
  light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.1);
  light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.1);
  light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.1);
  light2.add(pointLight2, 'intensity').min(0).max(10).step(0.1);
  light2.addColor(pointLight2Color, 'color')
    .onChange(() => {
      pointLight2.color.set(pointLight2Color.color);
    });

  const light3 = gui.addFolder('Light 3');
  light3.add(pointLight3.position, 'x').min(-6).max(6).step(0.1);
  light3.add(pointLight3.position, 'y').min(-3).max(3).step(0.1);
  light3.add(pointLight3.position, 'z').min(-3).max(3).step(0.1);
  light3.add(pointLight3, 'intensity').min(0).max(10).step(0.1);
  light3.addColor(pointLight3Color, 'color')
    .onChange(() => {
      pointLight3.color.set(pointLight3Color.color);
    });

  // const pointHelperLight1 = new THREE.PointLightHelper(pointLight, 1);
  // const pointHelperLight2 = new THREE.PointLightHelper(pointLight2, 1);
  // const pointHelperLight3 = new THREE.PointLightHelper(pointLight3, 1);
  // scene.add(pointHelperLight1, pointHelperLight2, pointHelperLight3)
}

addLight();




const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2);
// renderer.shadowMap.enabled = true;
// renderer.physicallyCorrectLights = true;

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
controls.enableDamping = true;

const clock = new THREE.Clock();

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

const onPointerMove = ( event ) => {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


const onDocumentMouseMove = (event) => {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
}

const chooseObjects = () => {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xFF101010);
      // INTERSECTED.geometry.parameters.radius += 2;
    }
  } else {
    if (INTERSECTED)  {
      INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    }

    INTERSECTED = null;
    
  }
}

const render = () => {


  const elapsedTime = clock.getElapsedTime();
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  sphere.rotation.y = .5 * elapsedTime;
  sphere.rotation.y += .5 * (targetX - sphere.rotation.y);
  sphere.rotation.x += .05 * (targetY - sphere.rotation.x);
  sphere.rotation.z += -.05 * (targetY - sphere.rotation.x);
  
  if (top) {
    top.rotation.y = .2 * elapsedTime;
  }
  if (top2) {
    top2.rotation.y = .2 * elapsedTime;
  }
  if (middle) {
    middle.rotation.y = .1 * elapsedTime;
  }
  if (bottom) {
    bottom.rotation.y = .2 * elapsedTime;
  }
  if (bottom2) {
    bottom2.rotation.y = .2 * elapsedTime;
  }

}

const animate = () => {

  chooseObjects();
  render();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

animate();

window.addEventListener( 'pointermove', onPointerMove );
document.addEventListener('mousemove', onDocumentMouseMove);
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  
})





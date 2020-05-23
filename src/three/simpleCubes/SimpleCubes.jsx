import React from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from "three";
import { Vector3 } from 'three';

let camera, scene, renderer, controls;
let geometry, material;
let cube;
let running = false;

function init() {
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        70
    );
    camera.position.z = 10;

    scene = new THREE.Scene();

    //Cube

    geometry = new THREE.BoxGeometry(.9, .9, .9);
    var material1 = new THREE.MeshPhongMaterial({ color: 0xfca503 });

    cube = new THREE.Mesh(geometry, material1);
    scene.add(cube);

    //Plane

    geometry = new THREE.PlaneGeometry(500, 500, 20);
    material = new THREE.MeshPhongMaterial({ reflectivity: 1, shininess: 50, color: 0x333333 });
    let plane = new THREE.Mesh(geometry, material);
    scene.add(plane)
    plane.rotateX(-Math.PI / 2);
    plane.position.y = -5;


    //Lights

    let aLight = new THREE.AmbientLight(0xffffff, .1);
    scene.add(aLight);
    let directLight = new THREE.DirectionalLight(0xffffff, .5)
    directLight.position.set(1, 1, 1);
    scene.add(directLight);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementsByClassName('animation-div')[0].appendChild(renderer.domElement);


    //OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
}

//É aqui que anima o bagulho

function animate() {
    if (running) requestAnimationFrame(animate);

    cube.position.set(0, 0, 0)
    cube.rotateY(0.05)
    cube.translateZ(2);
    controls.update();
    renderer.render(scene, camera);
}


//Isso é REACT 
//Quando a rota /simple-cubes é acessada, ele cria <div class="animation-div"></div> 
//É aí que vai rodar o canvas 3d
//Depois vai rodar o componentDidMount, e aí inicia a animação

class SimpleCubes extends React.Component {

    componentWillUnmount() {
        console.log('Unmmonting');
        running = false;
    }

    componentDidMount() {
        running = true;
        init();
        animate();
    }

    render() {


        return (<div class="animation-div"></div>)
    }
}

export default SimpleCubes
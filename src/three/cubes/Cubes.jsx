import React from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from "three";
import { Vector3 } from 'three';
//import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
//import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
//import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import './cubes.css'

//var composer;
const cubesRow = 30;
const cubesCol = 30;
let colorIntensity = 1;
const cubesNumber = cubesCol * cubesRow;
let wavesNumber = 2;
var camera, scene, renderer, controls;
let geometry, material;
let cubes;

var params = {
    wavesNumber,
    colorIntensity: 1
};

function init() {
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        70
    );
    camera.position.z = 10;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(.9, .9, .9);
    var material1 = new THREE.MeshPhongMaterial({ color: 0xfca503, shininess: 50, reflectivity: 1, emissive: 0xffff00 });

    var cube = new THREE.Mesh(geometry, material1);
    //scene.add(cube);

    cubes = [];

    for (let row = 0; row < cubesRow; row++) {
        cubes.push([]);
        for (let col = 0; col < cubesCol; col++) {
            let material = new THREE.MeshPhongMaterial().copy(material1)
            let nCube = new THREE.Mesh(geometry, material);
            nCube.position.set(row - cubesRow / 2, 0, col);
            scene.add(nCube);

            cubes[row].push(nCube);
        }
    }


    console.log(cubes);


    //Plane

    geometry = new THREE.PlaneGeometry(500, 500, 20);
    material = new THREE.MeshPhongMaterial({ reflectivity: 1, shininess: 50, color: 0x222222 });
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

    initGUI();
}

let theta = 0;

function animate() {
    requestAnimationFrame(animate);

    animateCubes(cubes);
    controls.update();
    renderer.render(scene, camera);
}

function animateCubes(cubes) {
    let K = wavesNumber * Math.PI / cubesRow;

    let positions = cubes.map((cubeRow, row) => {
        cubeRow.map((cube, col) => {
            let py = 4 * Math.sin(theta + (row + col) * K);
            cube.position.y = py;
            cube.rotation.x = theta;
            cube.material.setValues({ emissiveIntensity: (py + 4) / 8 * colorIntensity })
        })
    })
    console.log(positions);

    theta += .01;
}

//GUI

function initGUI() {
    var gui = new GUI();

    gui.add(params, 'colorIntensity', 0, 1).onChange(function (value) {

        colorIntensity = Number(value);

    });

    gui.add(params, 'wavesNumber', 0.0, 3).onChange(function (value) {

        wavesNumber = Number(value);

    });

}

class Cubes extends React.Component {

    componentWillUnmount() {
        console.log('Unmmonting');
        document.getElementsByClassName("dg main")[0].remove()
    }

    componentDidMount() {
        init();
        animate();
    }

    render() {


        return (<div class="animation-div"></div>)
    }
}

export default Cubes
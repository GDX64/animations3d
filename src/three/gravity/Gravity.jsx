import React from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from "three";
import { Vector3 } from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import Loading from '../../utilities/loading/Loading'

var composer;
var camera, scene, renderer, controls;
let geometry, material, mesh, sphere1, sphere2;
const Ts = .0002;

var params = {
    exposure: 1,
    bloomStrength: 1,
    bloomThreshold: 0,
    bloomRadius: .2
};

function init(reactFather) {
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        70
    );
    camera.position.z = 10;

    scene = new THREE.Scene();

    geometry = new THREE.SphereGeometry(.2, 64, 64);
    var material1 = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xff00ff });
    var material2 = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xffff00 });

    sphere1 = new THREE.Mesh(geometry, material1);
    sphere2 = new THREE.Mesh(geometry, material2);

    sphere1.position.x = 5;
    sphere2.position.x = -5;

    scene.add(sphere1);
    scene.add(sphere2);

    sphere2.mass = 5; //these do not exist on threejs
    sphere1.mass = 5;
    sphere1.anteriorP = new Vector3().copy(sphere1.position).sub(new Vector3(0, .0, 1).multiplyScalar(Ts))
    sphere2.anteriorP = new Vector3().copy(sphere2.position).sub(new Vector3(0, -.0, -1).multiplyScalar(Ts))

    //Plane

    geometry = new THREE.PlaneGeometry(500, 500, 20);
    material = new THREE.MeshPhongMaterial({ reflectivity: 1, shininess: 50, color: 0x222222 });
    let plane = new THREE.Mesh(geometry, material);
    scene.add(plane)
    plane.rotateX(-Math.PI / 2);
    plane.position.y = -4;


    //Lights

    let aLight = new THREE.AmbientLight(0xffffff, .1);
    scene.add(aLight);
    let directLight = new THREE.DirectionalLight(0xffffff, .2)
    directLight.position.set(1, 1, 1);
    scene.add(directLight);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-3d').appendChild(renderer.domElement);

    //bloom
    var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    composer = new EffectComposer(renderer);
    var renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    initGUI(bloomPass)

    //OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    animate();
    reactFather.setState({ ready: true })

}

function animate() {
    requestAnimationFrame(animate);
    gSimulation(sphere1, sphere2);
    gSimulation(sphere2, sphere1);

    controls.update();
    composer.render();
    //renderer.render(scene, camera);
}


function gSimulation(b1, b2) {
    const K = 20;
    let g;
    [...Array(50)].forEach(() => {
        let difVec = new Vector3().copy(b2.position)
        difVec.sub(b1.position)

        g = b2.mass * K / (difVec.length() ** 3);
        g = difVec.multiplyScalar(g * Ts ** 2);

        let newPosition = [0, 1, 2].map(item => {
            let np = g.getComponent(item) + 2 * b1.position.getComponent(item) - b1.anteriorP.getComponent(item);
            return np
        })
        b1.anteriorP.copy(b1.position);
        b1.position.set(...newPosition);


    })

    b1.material.setValues({ emissiveIntensity: g.length() * 1000000 })

}

//GUI

function initGUI(bloomPass) {
    var gui = new GUI();

    gui.add(params, 'exposure', 0.1, 2).onChange(function (value) {

        renderer.toneMappingExposure = Math.pow(value, 4.0);

    });

    gui.add(params, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {

        bloomPass.threshold = Number(value);

    });

    gui.add(params, 'bloomStrength', 0.0, 3.0).onChange(function (value) {

        bloomPass.strength = Number(value);

    });

    gui.add(params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange(function (value) {

        bloomPass.radius = Number(value);

    });
}

class Gravity extends React.Component {
    state = {
        ready: false
    }

    componentDidMount() {
        console.log('Moutend');
        init(this);
    }

    componentWillUnmount() {
        const htmlElement = document.getElementsByClassName("dg main")[0]
        if (htmlElement) htmlElement.remove();
        console.log("removing");
    }

    render() {

        return (<>
            {this.state.ready ? "" : <Loading data="scene" />}
            <div id="canvas-3d">
            </div>
        </>)

    }

}

export default Gravity
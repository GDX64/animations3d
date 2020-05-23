import React, { Component } from 'react'
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

var camera, scene, renderer, controls, mixer, composer;
let light
let modelToLoad = 'rings2.glb'

let animated = false

var params = {
    exposure: 1,
    bloomStrength: 1,
    bloomThreshold: 0,
    bloomRadius: .2
};

function init() {
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        100
    );
    camera.position.z = 12;

    scene = new THREE.Scene();

    // let geometry = new THREE.SphereGeometry(0.02, 16, 16);
    // let material = new THREE.MeshPhongMaterial({ color: 0xffffff, emissiveIntensity: 1, emissive: 0xffffff });

    // let sphere = new THREE.Mesh(geometry, material);
    // scene.add(sphere);

    //Adding lights

    light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(15, 10, 0);
    scene.add(light);

    let aLight = new THREE.AmbientLight(0xffffff, .1);
    scene.add(aLight);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Loading Model

    var loader = new GLTFLoader();

    loader.load(modelToLoad, function (gltf) {
        console.log(gltf);
        scene.add(gltf.scene);
        if (animated) {
            var model = gltf.scene;
            mixer = new THREE.AnimationMixer(model);
            var clips = gltf.animations;
            clips.forEach(function (clip) {
                mixer.clipAction(clip).play();
            });
        }
        animate();

    }, undefined, function (error) {

        console.error(error);
        console.log("Deu PAAAAU");
    });

    //OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;

    //Bloom
    var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    composer = new EffectComposer(renderer);
    var renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    initGUI(bloomPass)

}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (animated) mixer.update(.01);
    composer.render();
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


class BlenderLoad extends Component {

    componentDidMount() {
        console.log('Moutend');
        init();
    }

    render() {
        return (<div id="canvas-3d">
        </div>)
    }

}

export default BlenderLoad
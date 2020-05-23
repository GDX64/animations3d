import "./planet.css"
import React, { Component } from 'react'
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GUI, gui } from 'three/examples/jsm/libs/dat.gui.module';
import { Vector3 } from "three";
import Loading from "../../utilities/loading/Loading";

var camera, scene, renderer, controls, mixer, composer;
let mesh, light, sphere;
//my objects
let sun, mars, earth, satelite;

let running = false; //variable to control the animation loop

//my vars
let sateliteSpeed = 0.003;

var params = {
    exposure: 1,
    bloomStrength: 1.5,
    bloomThreshold: .65,
    bloomRadius: .2,
    sateliteSpeed,
    lightIntensity: 2
};

function init(reactFather) {
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
    );

    //creating scene
    scene = new THREE.Scene();

    //Load background texture
    const backLoader = new THREE.TextureLoader();
    let backLoaderPromise = new Promise((resolve, reject) => {
        backLoader.load('background.png', function (texture) {
            scene.background = texture;

            resolve('ok');

        });
    })


    //Adding lights

    light = new THREE.PointLight(0xffffff, 2.5, 1000);
    light.position.set(0, 0, 0);
    scene.add(light);

    let aLight = new THREE.AmbientLight(0xffffff, .1);
    light.castShadow = true;            // default false
    scene.add(aLight);

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512;  // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5;       // default
    light.shadow.camera.far = 500      // default

    //Renderer

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // the default
    renderer.setClearAlpha(0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    document.getElementById('canvas-3d').appendChild(renderer.domElement);

    //Loading Model

    var loader = new GLTFLoader();

    let modelLoad = new Promise((resolve, reject) => {
        loader.load('planets.glb', function (gltf) {
            console.log(gltf);
            scene.add(gltf.scene);
            let model = gltf.scene;

            satelite = model.children[1];
            sun = model.children[2];
            earth = model.children[3];
            mars = model.children[4];

            satelite.children[0].castShadow = true;
            mars.receiveShadow = true;

            light.position.copy(sun.position);
            sun.material.setValues({ emissiveIntensity: 100, emissive: 0xffff00 })

            resolve('ok')

        }, undefined, function (error) {

            console.error(error);
            console.log("Deu PAAAAU");
            reject('deu pau')
        });

    })

    //OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    camera.position.z = 5;

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

    Promise.all([modelLoad, backLoaderPromise]).then(() => {
        reactFather.setState({ ready: true });
        animate();
    })

}

function animate() {
    if (running === true) requestAnimationFrame(animate);
    //renderer.render(scene, camera);

    earth.rotation.y += .001;
    mars.rotation.y += .001;
    //satelite.rotation.z += .003;
    satelite.rotateOnWorldAxis(new Vector3(0, 1, 1), sateliteSpeed)
    // mixer.update(.01);
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

    gui.add(params, 'sateliteSpeed', 0.001, 0.01).step(0.0005).onChange(function (value) {

        sateliteSpeed = Number(value)

    });

    gui.add(params, 'lightIntensity', 0.1, 3).step(0.01).onChange(function (value) {

        light.intensity = Number(value);

    });

    // gui.add({
    //     hello: () => {
    //         console.log(camera)
    //         const cameraState = JSON.stringify(camera.matrix.toArray());
    //         console.log(cameraState);
    //     }
    // }, 'hello');

}


class Planets extends Component {
    state = {
        ready: false
    }

    componentDidMount() {
        console.log('Moutend');
        init(this);
        running = true;
    }

    componentWillUnmount() {
        document.getElementsByClassName("dg main")[0].remove();
        console.log("removing");
        running = false;
    }

    render() {

        return (<>
            {this.state.ready ? "" : <Loading data="scene" />}
            <div id="canvas-3d">
            </div>
        </>)

    }

}

export default Planets
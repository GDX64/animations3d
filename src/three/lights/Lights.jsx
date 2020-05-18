import React from 'react'
import * as THREE from "three";

var camera, scene, renderer;
let geometry, material, mesh, light, sphere;

let theta = .01;

function init() {
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
    );
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.SphereGeometry(0.02, 16, 16);
    material = new THREE.MeshPhongMaterial({ color: 0xffffff, emissiveIntensity: 1, emissive: 0xffffff });

    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    var geometry = new THREE.TorusBufferGeometry(0.3, 0.1, 16, 32);
    var material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 0;

    let matrix = new THREE.Matrix4();
    // matrix.makeTranslation(.2, 0, 0);
    // matrix.premultiply(new THREE.Matrix4().makeRotationZ(1));
    // console.log({ matrix });

    mesh.geometry.translate(0, 0, 0);
    mesh.applyMatrix4(matrix)
    scene.add(mesh);

    light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 0);
    scene.add(light);
    sphere.add(light);

    let aLight = new THREE.AmbientLight(0xffffff, .1);
    scene.add(aLight);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    console.log(mesh.matrix, light.matrix);

}

function animate() {
    requestAnimationFrame(animate);
    sphere.position.x = 0;
    sphere.position.y = 0;
    sphere.position.z = 0;
    sphere.rotation.y += 0.01;
    sphere.translateX(.5)

    //mesh.rotation.y += 0.02;
    //mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta)

    renderer.render(scene, camera);
}

function Lights() {
    init();
    animate();


    return (<>
    </>)
}

export default Lights
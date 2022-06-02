import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

class App {
    #domContainer;
    #renderer;
    #scene;
    #camera;
    #control;
    #solarSystem;
    #earthSystem;
    #moonSystem;

    constructor() {
        console.log("Hello, three.js");

        const domContainer = document.querySelector("#webgl_container");
        this.#domContainer = domContainer;
        // 필드화. 또다른 매소드에서도 참조 가능.

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        // 픽셀 배율 설정.
        // console.log(window.devicePixelRatio);
        //모니터마다 다름. 고해성도면 1 이상 값이 나옴. 픽셀이 미려하게 출력이 됨
        domContainer.appendChild(renderer.domElement);
        this.#renderer = renderer;

        const scene = new THREE.Scene();
        this.#scene = scene;

        this.#setupCamera();
        this.#setupLight();
        this.#setupControls();
        this.#setupModel();

        this.resize();

        window.onresize = this.resize.bind(this);
        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        console.log("resize done")
        const width = this.#domContainer.clientWidth;
        const height = this.#domContainer.clientHeight;

        this.#camera.aspect = width / height;
        this.#camera.updateProjectionMatrix();

        this.#renderer.setSize(width, height);
    }

    // # 의미. App class 밖에서는 사용 못함.
    #setupCamera() {
        const width = this.#domContainer.clientWidth;
        const height = this.#domContainer.clientHeight;

        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );

        camera.position.set(4, 4, 14);
        this.#camera = camera;
    }

    #setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.#scene.add(light);
    }

    #setupModel() {
        // this.#scene.add(new THREE.AxesHelper(20));

        const solarSystem = new THREE.Object3D();
        //위치. 좌표축 개념만 담는.
        this.#scene.add(solarSystem);
        solarSystem.add(new THREE.AxesHelper(1));

        const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);

        const sunMaterial = new THREE.MeshPhongMaterial({
            emissive: 0xffff00,
            flatShading: true,
            //각져 보이게 하기
            transparent: true,
            opacity: 0.5,
        });

        const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
        solarSystem.add(sunMesh);
        sunMesh.scale.set(5, 5, 5);

        const earthSystem = new THREE.Object3D();
        solarSystem.add(earthSystem);
        earthSystem.position.x = 10;
        //(10, 0, 0) 보다 빠름.
        earthSystem.add(new THREE.AxesHelper(1));


        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff,
            emissive: 0x112244,
            flatShading: true,
            transparent: true,
            opacity: 0.5,
        });
        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
        earthSystem.add(earthMesh);

        const moonSystem = new THREE.Object3D();
        earthSystem.add(moonSystem);
        moonSystem.position.x = 2;
        moonSystem.add(new THREE.AxesHelper(1));

        const moonMaterial = new THREE.MeshPhongMaterial({
            color: 0x888888,
            emissive: 0x222222,
            flatShading: true,
            transparent: true,
            opacity: 0.5,
        });
        const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
        moonSystem.add(moonMesh);
        moonMesh.scale.set(0.5, 0.5, 0.5);

        this.#solarSystem = solarSystem;
        this.#earthSystem = earthSystem;
        this.#moonSystem = moonSystem;

    }


    #setupControls() {
        const control = new OrbitControls(this.#camera, this.#domContainer);
        this.#control = control;
    }


    update(time) {
        time *= 0.001;

        this.#solarSystem.rotation.y = time / 2;
        this.#earthSystem.rotation.y = time * 2;
        this.#moonSystem.rotation.y = time * 6;
        this.#control.update();
    }

    render(time) {
        this.#renderer.render(this.#scene, this.#camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }
}

window.onload = function () {
    new App();
}
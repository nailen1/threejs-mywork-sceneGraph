import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"

class App {
    #domContainer;
    #renderer;
    #scene;
    #camera;
    #mesh;
    #control;
    // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes/Private_class_fields

    constructor() {
        console.log("Hello, three.js");

        const domContainer = document.querySelector("#webgl_container");
        this.#domContainer = domContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
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
        console.log("resize");
        const width = this.#domContainer.clientWidth;
        const height = this.#domContainer.clientHeight;

        this.#camera.aspect = width / height;
        this.#camera.updateProjectionMatrix();

        this.#renderer.setSize(width, height);
    }

    #setupCamera() {
        const width = this.#domContainer.clientWidth;
        const height = this.#domContainer.clientHeight;

        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );

        camera.position.set(0, 0, 2);
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
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
        const mesh = new THREE.Mesh(geometry, material);

        this.#scene.add(mesh);

        this.#mesh = mesh;
    }

    #setupControls() {
        const control = new OrbitControls(this.#camera, this.#domContainer);
        this.#control = control;
    }

    update(time) {
        time *= 0.001; // MS -> Second
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

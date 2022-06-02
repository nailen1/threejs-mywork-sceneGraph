import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

class App {
    #domContainer;
    #renderer;
    #scene;
    #camera;
    #cube;
    #control;

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

        camera.position.set(0, 0, 5);
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
        // const geometry = new THREE.BoxGeometry(1, 2, 3, 2, 2, 1);
        // 길이크기, 각축의 분할단위
        // const geometry = new THREE.CircleGeometry(2, 16, THREE.Math.degToRad(30), Math.PI * 1);
        // const geometry = new THREE.ConeGeometry(2, 4, 32, 1, true, Math.PI / 2, Math.PI / 2);
        // three.js 는 높이방향이 y축. 주의.
        // const geometry = new THREE.CylinderGeometry(0.5, 2, 4, 32, 3, true, Math.PI * 3 / 4, Math.PI * 3 / 4);
        // const geometry = new THREE.SphereGeometry(2, 8, 32, 0, Math.PI);
        // const geometry = new THREE.RingGeometry(1, 2, 16, 4);
        // const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        const geometry = new THREE.TorusGeometry(2, 0.5, 3, 16);


        const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
        const mesh = new THREE.Mesh(geometry, fillMaterial);

        const lineMaterial = new THREE.LineBasicMaterial({ color: "#ffff00" });
        const line = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            lineMaterial
        );

        const group = new THREE.Group();
        group.add(mesh);
        group.add(line);
        // mesh line 을 하나의 그룹으로 만들어야.

        this.#scene.add(group);
        this.#cube = group;

        const axis = new THREE.AxesHelper(10);
        this.#scene.add(axis);
        // r x, g y, b z - axis

    }

    #setupControls() {
        const control = new OrbitControls(this.#camera, this.#domContainer);
        this.#control = control;
    }

    update(time) {
        time *= 0.001;
        // ms -> s
        // console.log(time);
        // this.#cube.rotation.x = time;
        // this.#cube.rotation.y = time;
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
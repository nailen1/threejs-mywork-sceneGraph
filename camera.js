import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "../examples/jsm/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "../examples/jsm/helpers/RectAreaLightHelper.js";

class App {
    #domContainer;
    #renderer;
    #scene;
    #camera;
    #control;
    #light;


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

        if (this.#camera instanceof THREE.PerspectiveCamera) {
            this.#camera.aspect = width / height;
        } else if (this.#camera instanceof THREE.OrthographicCamera) {
            const aspect = width / height;
            const left = -1 * aspect;
            const right = 1 * aspect;
            const top = 1 * aspect;
            const bottom = -1 * aspect;

            this.#camera.left = left;
            this.#camera.right = right;
            this.#camera.top = top;
            this.#camera.bottom = bottom;
            //이래야 가로세류 비율 리사이즈시 안깨짐. Ortho 경우.
        }
        this.#camera.updateProjectionMatrix();
        // 투영행렬 재개선해야. 추가 안하면 비율 깨짐

        this.#renderer.setSize(width, height);
    }

    // # 의미. App class 밖에서는 사용 못함.
    #setupCamera() {
        const width = this.#domContainer.clientWidth;
        const height = this.#domContainer.clientHeight;

        // const camera = new THREE.PerspectiveCamera(
        //     60,
        //     width / height,
        //     0.1,
        //     100,
        // );
        // camera.zoom = 1 * 0.7;
        // perspectivecamera는 fov 줄여서 확대축소함. 인간은 60도 정도라고 한다.


        const aspect = width / height;
        const left = -1 * aspect;
        const right = 1 * aspect;
        const top = 1 * aspect;
        const bottom = -1 * aspect;
        const near = 0.1;
        const far = 100;
        const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        camera.zoom = 1 * 0.3;


        camera.position.set(0, 7, 7);
        // camera.target.position.set(0,0,0);
        // camera.lookAt(1, 0, 0);
        this.#camera = camera;
    }

    #lightHelper = null;
    #setupLight() {
        // const color = 0xffffff;
        // const intensity = 1;
        // const light = new THREE.DirectionalLight(color, intensity);
        // light.position.set(-1, 2, 4);
        // this.#scene.add(light);

        //환경광. 불 다 꺼도 어렴풋 형체가 보이는 광. 0.2 정도가 적당
        // const light = new THREE.AmbientLight(0xff0000, 0.2);

        //하늘과 땅의 빛
        // const light = new THREE.HemisphereLight("#b0d8f5", "#bb7a1c", 0.2);

        // const light = new THREE.DirectionalLight("#ffffff", 1);
        // const lightHelper = new THREE.DirectionalLightHelper(light);
        // light.position.set(5, 5, 0);
        // //위치는 전혀 무관, 노멀벡터로 방향만 관여.
        // light.target.position.set(0, 0, 0);
        // this.#scene.add(lightHelper);
        // //방향 제대로 하려면 헬퍼도 갱신해줘야.
        // this.#scene.add(light.target);
        // // this.#lightHelper = lightHelper;

        // const light = new THREE.PointLight("#ffff00", 1);
        // const lightHelper = new THREE.PointLightHelper(light, 0.5, "#ffff00");
        // // 헬퍼도 크기와 색 옵션 설정가능. 여러광원효과 식별위해
        // light.position.set(0, 5, 0);

        // const light = new THREE.SpotLight(0xfffffff, 1);
        // const lightHelper = new THREE.SpotLightHelper(light);
        // light.position.set(0, 5, 0);
        // light.target.position.set(0, 0, 0);
        // this.#scene.add(light.target);
        // light.angle = THREE.Math.PI / 18;
        // light.penumbra = 0.5;
        // //감쇄율. 칼처럼 잘리는 경계면 자연스럽계.

        //형광등 효과. 최신 광원효과?
        RectAreaLightUniformsLib.init();
        const light = new THREE.RectAreaLight(0xffffff, 10, 5, 2);
        const lightHelper = new RectAreaLightHelper(light);
        light.position.set(0, 5, 0);
        light.rotation.x = -Math.PI / 2

        this.#scene.add(lightHelper);
        this.#scene.add(light);

        this.#light = light;
        this.#lightHelper = lightHelper;

    }


    #setupModel() {

        // 넓은 바닥면
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: "#2c3e50",
            roughness: 0.5,
            metalness: 0.5,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;

        this.#scene.add(ground);

        // const axis = new THREE.AxesHelper(10);
        // this.#scene.add(axis);

        // 하얀색 큰 구
        const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
        const bigSphereMaterial = new THREE.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.1,
            metalness: 0.2,
            transparent: true,
            opacity: 0.3,
        });
        const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
        bigSphere.rotation.x = -Math.PI / 2;
        this.#scene.add(bigSphere);

        // 토러스 
        const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
        const torusMaterial = new THREE.MeshStandardMaterial({
            color: "#9b59b6",
            roughness: 0.5,
            metalness: 0.9,
        });
        for (let i = 0; i < 8; i++) {
            const torusPivot = new THREE.Object3D();
            torusPivot.add(new THREE.AxesHelper());
            //부모 scene과 동일한 원점을 가지는 좌표축 가짐
            const torus = new THREE.Mesh(torusGeometry, torusMaterial);
            torusPivot.rotation.y = Math.PI / 4 * i;
            torusPivot.add(torus);
            torus.position.set(3, 0.5, 0);
            this.#scene.add(torusPivot);
        };

        //빨간공
        const smallSphererPivot = new THREE.Object3D();
        const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const smallSphereMaterial = new THREE.MeshStandardMaterial({
            color: "#e74c3c",
            roughness: 0.2,
            metalness: 0.5,
        });
        smallSphererPivot.name = "smallSpherePivot";
        // #smallSpherePivot 필드가 아닌, 이름으로 불러버리는 빙식.
        const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
        smallSphere.position.set(3, 0.5, 0);
        smallSphererPivot.add(smallSphere);
        this.#scene.add(smallSphererPivot);

        // 카메라가 작은구의 다음위치를 바라보도록 하기 위한 Obj3D
        const targetPivot = new THREE.Object3D();
        this.#scene.add(targetPivot);
        const target = new THREE.Object3D();
        targetPivot.add(target);
        targetPivot.name = "targetPivot";
        target.position.set(3, 0.5, 0);

    }

    #setupControls() {
        const control = new OrbitControls(this.#camera, this.#domContainer);
        this.#control = control;
    }

    update(time) {
        time *= 0.001;
        // ms -> s
        // console.log(time);

        const smallSpherePivot = this.#scene.getObjectByName("smallSpherePivot");
        // smallSpherePivot 이 null 도 undefined 도 아닐때,
        if (smallSpherePivot) {
            if (this.#light) {
                const smallSphere = smallSpherePivot.children[0];
                smallSpherePivot.rotation.y = THREE.Math.degToRad(50 * time);

                // smallSphere.getWorldPosition(this.#camera.position);
                // lookAt 이용하면 이거로 카메라 시점 변경

                // const pt = new THREE.Vector3();
                // console.log(pt);
                // smallSphere.getWorldPosition(pt);
                // this.#camera.lookAt(pt);

                // const targetPivot = this.#scene.getObjectByName("targetPivot");
                // if (targetPivot) {
                //     targetPivot.rotation.y = THREE.Math.degToRad(time * 50 + 10);
                //     const target = targetPivot.children[0];
                //     target.getWorldPosition();
                // }
                // //실패
            }
        }

        if (this.#lightHelper) {
            //this.#lightHelper.update();
            //RectAreaLightHelper 의 경우 이걸 지워줘야 함!!
            this.#control.update();
        }
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
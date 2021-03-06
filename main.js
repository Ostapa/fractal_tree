function init() {
    let scene = new THREE.Scene();
    let stats = new Stats();
    document.body.appendChild(stats.domElement);

    // setup 2 lights 
    let topLight = getSpotLight(1, 'rgb(255, 220, 180)');
    let bottomLight = getPointLight(.33, 'rgb(255, 220, 180)');

    topLight.position.x = 0;
    topLight.position.y = 15;
    topLight.position.z = -4;

    bottomLight.position.x = 0;
    bottomLight.position.y = 10;
    bottomLight.position.z = 0;

    scene.add(topLight, bottomLight);

    drawBranch(scene, 1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,10,0));

    let plane = getPlane(50);
    plane.rotation.x = Math.PI/2;
    scene.add(plane);
    
    // setup camera 
    let cameraGroup = new THREE.Group();
    let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
    camera.position.x = 0;
    camera.position.y = 45;
    camera.position.z = 100;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraGroup.add(camera);
    cameraGroup.name = 'cameraGroup';
    scene.add(cameraGroup);

    // renderer
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor('rgb(51, 51, 51)');
    document.getElementById('webgl').appendChild(renderer.domElement);

    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, stats, controls);

    return scene;
}

function drawBranch(scene, length, vectorFrom, vectorTo) {
    let line = getLine(
        vectorFrom, 
        vectorTo);
    scene.add(line);
    vectorFrom = vectorTo;
    if(length < 6) {
        drawBranch(scene, length + 1, vectorFrom, 
            new THREE.Vector3(vectorTo.x + 5, vectorTo.y + length * .5, 0));
    }
}

function getPointLight(intensity, color) {
    let light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    return light;
}

function getSpotLight(intensity, color) {
    let light = new THREE.SpotLight(color, intensity);
    light.penumbra = .5;
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500
    light.shadow.camera.fov = 30
    light.shadow.bias = 0.001;

    return light;
}

function getPlane(size) {
    let geometry = new THREE.PlaneGeometry(size, size);
    let material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        side: THREE.DoubleSide
    });
    let plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;

    return plane;
}

function getLine(vectorFrom, vectorTo) {
    let material = new THREE.LineBasicMaterial({
        color: 'rgb(255, 51, 51)'
    });
    
    let geo = new THREE.Geometry();
    geo.vertices.push(
        vectorFrom,
        vectorTo
    );
    let line = new THREE.Line(geo, material);
    return line;
}

function update(renderer, scene, camera, stats, controls) {
    renderer.render(scene, camera);
    controls.update();
    stats.update();

    requestAnimationFrame(() => {
        update(renderer, scene, camera, stats, controls);
    });
}

var scene = init(); // to access scene object in the browser's console
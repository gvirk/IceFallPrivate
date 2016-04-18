/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = Physijs.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var CylinderGeometry = THREE.CylinderGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var LineBasicMaterial = THREE.LineBasicMaterial;
var PhongMaterial = THREE.MeshPhongMaterial;
var Material = THREE.Material;
var Texture = THREE.Texture;
var Line = THREE.Line;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var CScreen = config.Screen;
var Clock = THREE.Clock;
// Setup a Web Worker for Physijs
Physijs.scripts.worker = "/Scripts/lib/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "/Scripts/lib/Physijs/examples/js/ammo.js";
var myWorker = new Worker(Physijs.scripts.worker);
// Game Variables
var scene;
var currentScene;
var renderer;
var camera;
var scoreValue;
var livesValue;
var highScoreValue = 0;
var play;
var gameScene2;
var gameScene3;
var menu;
var over;
var exit;
var instruction1;
var instruction2;
var instruction3;
var stats;
var canvas;
var assets;
var manifest = [
    { id: "land", src: "../../Assets/audio/Land.wav" },
    { id: "hit", src: "../../Assets/audio/hit.wav" },
    { id: "ice_hit", src: "../../Assets/audio/ice_hit.wav" },
    { id: "enemy", src: "../../Assets/audio/enemy.wav" },
    { id: "coin", src: "../../Assets/audio/coin.mp3" },
    { id: "jump", src: "../../Assets/audio/Jump.wav" },
    { id: "CompanyLogo", src: "../../Assets/images/CompanyLogo.png" },
    { id: "InstructionPanel1", src: "../../Assets/images/InstructionsStage1.png" },
    { id: "InstructionPanel2", src: "../../Assets/images/InstructionsStage2.png" },
    { id: "InstructionPanel3", src: "../../Assets/images/InstructionsStage3.png" },
    { id: "BackButton", src: "../../Assets/images/BackButton.png" },
    { id: "StartButton", src: "../../Assets/images/StartButton.png" },
    { id: "PlayAgainButton", src: "../../Assets/images/PlayAgainButton.png" },
    { id: "InstructionButton", src: "../../Assets/images/InstructionButton.png" },
    { id: "menu", src: "../../Assets/audio/menu.mp3" },
    { id: "game1_background", src: "../../Assets/audio/game1_background.mp3" }
];
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
}
function setupCanvas() {
    canvas = document.getElementById("canvas");
    canvas.setAttribute("width", config.Screen.WIDTH.toString());
    canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
    canvas.style.backgroundColor = "#000000";
}
function init() {
    // setup the canvas for the game
    setupCanvas();
    // setup the default renderer
    setupRenderer();
    // setup the camera
    setupCamera();
    // set initial scene
    currentScene = config.Scene.MENU;
    changeScene();
    // Add framerate stats
    addStatsObject();
    document.body.appendChild(renderer.domElement);
    gameLoop(); // render the scene	
    // setup the resize event listener
    window.addEventListener('resize', onWindowResize, false);
}
// Window Resize Event Handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    scene.resize();
}
// Add Frame Rate Stats to the Scene
function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}
// Setup main game loop
function gameLoop() {
    stats.update();
    scene.update();
    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);
    // render the scene
    renderer.render(scene, camera);
}
// Setup default renderer
function setupRenderer() {
    renderer = new Renderer({ antialias: true });
    renderer.setClearColor(0x404040, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.autoClear = true;
    console.log("Finished setting up Renderer...");
}
// Setup main camera for the scene
function setupCamera() {
    camera = new PerspectiveCamera(35, config.Screen.RATIO, 0.1, 100);
    camera.name = "Main Camera";
    //camera.position.set(0, 10, 30);
    //camera.lookAt(new Vector3(0, 0, 0));
    console.log("Finished setting up Camera...");
}
function changeScene() {
    // Launch various scenes
    switch (currentScene) {
        case config.Scene.MENU:
            // show the MENU scene
            menu = new scenes.Menu();
            scene = menu;
            console.log("Starting MENU Scene");
            break;
        case config.Scene.PLAY:
            // show the PLAY scene
            play = new scenes.Play();
            scene = play;
            console.log("Starting PLAY Scene");
            break;
        case config.Scene.OVER:
            // show the game OVER scene
            over = new scenes.Over();
            scene = over;
            console.log("Starting OVER Scene");
            break;
        case config.Scene.INSTRUCTION1:
            // show the Instruction1 scene
            instruction1 = new scenes.Instruction1();
            scene = instruction1;
            console.log("Starting Instruction1 Scene");
            break;
        case config.Scene.INSTRUCTION2:
            // show the Instruction2 scene
            instruction2 = new scenes.Instruction2();
            scene = instruction2;
            console.log("Starting Instruction2 Scene");
            break;
        case config.Scene.INSTRUCTION3:
            // show the Instruction3 scene
            instruction3 = new scenes.Instruction3();
            scene = instruction3;
            console.log("Starting Instruction3 Scene");
            break;
        case config.Scene.EXIT:
            // show the exit scene
            exit = new scenes.Exit();
            scene = exit;
            console.log("Starting exit Scene");
            break;
        case config.Scene.GAMESCENE2:
            // show the GameScene2 scene
            gameScene2 = new scenes.GameScene2();
            scene = gameScene2;
            console.log("Starting GameScene2 Scene");
            break;
        case config.Scene.GAMESCENE3:
            // show the GameScene3 scene
            gameScene3 = new scenes.GameScene3();
            scene = gameScene3;
            console.log("Starting GameScene3 Scene");
            break;
    }
}
window.onload = preload;
//# sourceMappingURL=game.js.map
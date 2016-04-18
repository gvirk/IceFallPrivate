/**
 * The Scenes module is a namespace to reference all scene objects
 *
 * @module scenes
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var scenes;
(function (scenes) {
    /**
     * The Play class is where the main action occurs for the game
     *
     * @class Play
     * @param havePointerLock {boolean}
     */
    var GameScene3 = (function (_super) {
        __extends(GameScene3, _super);
        /**
         * @constructor
         */
        function GameScene3() {
            _super.call(this);
            this._initialize();
            this.start();
        }
        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++
        /**
         * Sets up the initial canvas for the play scene
         *
         * @method setupCanvas
         * @return void
         */
        GameScene3.prototype._setupCanvas = function () {
            canvas.setAttribute("width", config.Screen.WIDTH.toString());
            canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
            canvas.style.backgroundColor = "#000000";
            canvas.style.opacity = "0.5";
            canvas.style.position = "absolute";
        };
        /**
         * The initialize method sets up key objects to be used in the scene
         *
         * @method _initialize
         * @returns void
         */
        GameScene3.prototype._initialize = function () {
            // Create to HTMLElements
            this.blocker = document.getElementById("blocker");
            this.instructions = document.getElementById("instructions");
            this.blocker.style.display = "block";
            // setup canvas for menu scene
            this._setupCanvas();
            this.coinCount = 10;
            this.prevTime = 0;
            this.stage = new createjs.Stage(canvas);
            this.velocity = new Vector3(0, 0, 0);
            // setup a THREE.JS Clock object
            this.clock = new Clock();
            // Instantiate Game Controls
            this.keyboardControls = new objects.KeyboardControls();
            this.mouseControls = new objects.MouseControls();
        };
        /**
         * This method sets up the scoreboard for the scene
         *
         * @method setupScoreboard
         * @returns void
         */
        GameScene3.prototype.setupScoreboard = function () {
            // Add Lives Label
            this.livesLabel = new createjs.Text("LIVES: " + livesValue, "40px Consolas", "#ffffff");
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.livesLabel);
            console.log("Added Lives Label to stage");
            // Add Score Label
            this.scoreLabel = new createjs.Text("SCORE: " + scoreValue, "40px Consolas", "#ffffff");
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.scoreLabel);
            console.log("Added Score Label to stage");
        };
        /**
         * Add a background score to the scene
         *
         * @method sound
         * @return void
         */
        GameScene3.prototype.sound = function () {
            createjs.Sound.stop();
            createjs.Sound.play("game1_background");
            createjs.Sound.volume = 0.5;
        };
        /**
         * Add a spotLight to the scene
         *
         * @method addSpotLight
         * @return void
         */
        GameScene3.prototype.addSpotLight = function () {
            // Spot Light
            this.spotLight = new SpotLight(0xffffff);
            this.spotLight.position.set(100, 150, -15);
            this.spotLight.castShadow = true;
            this.spotLight.intensity = 2;
            this.spotLight.lookAt(new Vector3(0, 0, 0));
            this.spotLight.shadowCameraNear = 2;
            this.spotLight.shadowCameraFar = 200;
            this.spotLight.shadowCameraLeft = -5;
            this.spotLight.shadowCameraRight = 5;
            this.spotLight.shadowCameraTop = 5;
            this.spotLight.shadowCameraBottom = -5;
            this.spotLight.shadowMapWidth = 2048;
            this.spotLight.shadowMapHeight = 2048;
            this.spotLight.shadowDarkness = 0.5;
            this.spotLight.name = "Spot Light";
            this.spotLight.angle = 2;
            this.add(this.spotLight);
            console.log("Added spotLight to scene");
        };
        /**
         * Add a ground plane to the scene
         *
         * @method addGround
         * @return void
         */
        GameScene3.prototype.addGround = function () {
            this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/snow.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(8, 8);
            this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/snow.jpg');
            this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormal.repeat.set(8, 8);
            this.groundMaterial = new PhongMaterial();
            this.groundMaterial.map = this.groundTexture;
            this.groundMaterial.bumpMap = this.groundTextureNormal;
            this.groundMaterial.bumpScale = 0.2;
            this.groundGeometry = new BoxGeometry(100, 1, 100);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.name = "Ground";
            this.add(this.ground);
            console.log("Added Ground to scene");
        };
        GameScene3.prototype.addBoundary1 = function () {
            this.wallTexture = new THREE.TextureLoader().load('../../Assets/images/wall.jpg');
            this.wallTexture.wrapS = THREE.RepeatWrapping;
            this.wallTexture.wrapT = THREE.RepeatWrapping;
            this.wallTexture.repeat.set(2, 2);
            this.wallTextureNormal = new THREE.TextureLoader().load('../../Assets/images/wall.jpg');
            this.wallTextureNormal.wrapS = THREE.RepeatWrapping;
            this.wallTextureNormal.wrapT = THREE.RepeatWrapping;
            this.wallTextureNormal.repeat.set(4, 4);
            this.wallMaterial = new PhongMaterial();
            this.wallMaterial.map = this.wallTexture;
            this.wallMaterial.bumpMap = this.wallTextureNormal;
            this.wallMaterial.bumpScale = 0.2;
            this.ewallMaterial = new PhongMaterial({ color: 0x000000 });
            this.boundary1Geometry = new BoxGeometry(2, 4, 100);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.boundary1 = new Physijs.ConvexMesh(this.boundary1Geometry, this.wallPhysicsMaterial, 0);
            this.boundary1.receiveShadow = true;
            this.boundary1.name = "Wall";
            this.boundary1.position.set(49, 3, 0);
            this.add(this.boundary1);
            console.log("Added boundary 1");
        };
        GameScene3.prototype.addBoundary2 = function () {
            this.boundary2Geometry = new BoxGeometry(2, 4, 80);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.boundary2 = new Physijs.ConvexMesh(this.boundary2Geometry, this.wallPhysicsMaterial, 0);
            this.boundary2.receiveShadow = true;
            this.boundary2.name = "Wall";
            this.boundary2.position.set(0, 3, 49);
            this.boundary2.rotation.set(0, 1.570796, 0);
            this.add(this.boundary2);
            console.log("Added boundary 2");
        };
        GameScene3.prototype.addBoundary3 = function () {
            this.boundary3Geometry = new BoxGeometry(2, 4, 96);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.boundary3 = new Physijs.ConvexMesh(this.boundary3Geometry, this.wallPhysicsMaterial, 0);
            this.boundary3.receiveShadow = true;
            this.boundary3.name = "Wall";
            this.boundary3.position.set(0, 3, -49);
            this.boundary3.rotation.set(0, 1.570796, 0);
            this.add(this.boundary3);
            console.log("Added boundary 3");
        };
        GameScene3.prototype.addBoundary4 = function () {
            this.boundary4Geometry = new BoxGeometry(2, 4, 30);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.boundary4 = new Physijs.ConvexMesh(this.boundary4Geometry, this.wallPhysicsMaterial, 0);
            this.boundary4.receiveShadow = true;
            this.boundary4.name = "Wall";
            this.boundary4.position.set(-49, 3, -35);
            this.boundary4.rotation.set(0, 0, 0);
            this.add(this.boundary4);
            console.log("Added boundary 4");
        };
        GameScene3.prototype.addBoundary5 = function () {
            this.boundary5Geometry = new BoxGeometry(2, 4, 54);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.boundary5 = new Physijs.ConvexMesh(this.boundary5Geometry, this.wallPhysicsMaterial, 0);
            this.boundary5.receiveShadow = true;
            this.boundary5.name = "Wall";
            this.boundary5.position.set(-49, 3, 23);
            this.boundary5.rotation.set(0, 0, 0);
            this.add(this.boundary5);
            console.log("Added boundary 5");
        };
        GameScene3.prototype.addwall1 = function () {
            this.wall1Geometry = new BoxGeometry(2, 4, 74);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall1 = new Physijs.ConvexMesh(this.wall1Geometry, this.wallPhysicsMaterial, 0);
            this.wall1.receiveShadow = true;
            this.wall1.name = "Wall";
            this.wall1.position.set(37, 3, -1);
            this.wall1.rotation.set(0, 0, 0);
            this.add(this.wall1);
            console.log("Added Innerwall 1");
        };
        GameScene3.prototype.addwall2 = function () {
            this.wall2Geometry = new BoxGeometry(2, 4, 46);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall2 = new Physijs.ConvexMesh(this.wall2Geometry, this.wallPhysicsMaterial, 0);
            this.wall2.receiveShadow = true;
            this.wall2.name = "Wall";
            this.wall2.position.set(13, 3, 15);
            this.wall2.rotation.set(0, 1.570796, 0);
            this.add(this.wall2);
            console.log("Added Innerwall 2");
        };
        GameScene3.prototype.addwall3 = function () {
            this.wall3Geometry = new BoxGeometry(2, 4, 32);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall3 = new Physijs.ConvexMesh(this.wall3Geometry, this.wallPhysicsMaterial, 0);
            this.wall3.receiveShadow = true;
            this.wall3.name = "Wall";
            this.wall3.position.set(25, 3, 32);
            this.wall3.rotation.set(0, 0, 0);
            this.add(this.wall3);
            console.log("Added Innerwall 3");
        };
        GameScene3.prototype.addwall4 = function () {
            this.wall4Geometry = new BoxGeometry(2, 4, 40);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall4 = new Physijs.ConvexMesh(this.wall4Geometry, this.wallPhysicsMaterial, 0);
            this.wall4.receiveShadow = true;
            this.wall4.name = "Wall";
            this.wall4.position.set(25, 3, -6);
            this.wall4.rotation.set(0, 0, 0);
            this.add(this.wall4);
            console.log("Added Innerwall 4");
        };
        GameScene3.prototype.addwall5 = function () {
            this.wall5Geometry = new BoxGeometry(2, 4, 38);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall5 = new Physijs.ConvexMesh(this.wall5Geometry, this.wallPhysicsMaterial, 0);
            this.wall5.receiveShadow = true;
            this.wall5.name = "Wall";
            this.wall5.position.set(-5, 3, 27);
            this.wall5.rotation.set(0, 1.570796, 0);
            this.add(this.wall5);
            console.log("Added Innerwall 5");
        };
        GameScene3.prototype.addwall6 = function () {
            this.wall6Geometry = new BoxGeometry(2, 4, 38);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall6 = new Physijs.ConvexMesh(this.wall6Geometry, this.wallPhysicsMaterial, 0);
            this.wall6.receiveShadow = true;
            this.wall6.name = "Wall";
            this.wall6.position.set(-5, 3, 3);
            this.wall6.rotation.set(0, 1.570796, 0);
            this.add(this.wall6);
            console.log("Added Innerwall 6");
        };
        GameScene3.prototype.addwall7 = function () {
            this.wall7Geometry = new BoxGeometry(2, 4, 38);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall7 = new Physijs.ConvexMesh(this.wall7Geometry, this.wallPhysicsMaterial, 0);
            this.wall7.receiveShadow = true;
            this.wall7.name = "Wall";
            this.wall7.position.set(7, 3, -37);
            this.wall7.rotation.set(0, 1.570796, 0);
            this.add(this.wall7);
            console.log("Added Innerwall 7");
        };
        GameScene3.prototype.addwall8 = function () {
            this.wall8Geometry = new BoxGeometry(2, 4, 22);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall8 = new Physijs.ConvexMesh(this.wall8Geometry, this.wallPhysicsMaterial, 0);
            this.wall8.receiveShadow = true;
            this.wall8.name = "Wall";
            this.wall8.position.set(-37, 3, 18);
            this.wall8.rotation.set(0, 1.570796, 0);
            this.add(this.wall8);
            console.log("Added Innerwall 8");
        };
        GameScene3.prototype.addwall8a = function () {
            this.wall8aGeometry = new BoxGeometry(2, 4, 10);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall8a = new Physijs.ConvexMesh(this.wall8aGeometry, this.wallPhysicsMaterial, 0);
            this.wall8a.receiveShadow = true;
            this.wall8a.name = "Wall";
            this.wall8a.position.set(-43, 3, -21);
            this.wall8a.rotation.set(0, 1.570796, 0);
            this.add(this.wall8a);
            console.log("Added Innerwall 8a");
        };
        GameScene3.prototype.addwall9 = function () {
            this.wall9Geometry = new BoxGeometry(2, 4, 10);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall9 = new Physijs.ConvexMesh(this.wall9Geometry, this.wallPhysicsMaterial, 0);
            this.wall9.receiveShadow = true;
            this.wall9.name = "Wall";
            this.wall9.position.set(-43, 3, -3);
            this.wall9.rotation.set(0, 1.570796, 0);
            this.add(this.wall9);
            console.log("Added Innerwall 9");
        };
        GameScene3.prototype.addwall10 = function () {
            this.wall10Geometry = new BoxGeometry(2, 4, 40);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall10 = new Physijs.ConvexMesh(this.wall10Geometry, this.wallPhysicsMaterial, 0);
            this.wall10.receiveShadow = true;
            this.wall10.name = "Wall";
            this.wall10.position.set(-37, 3, -14);
            this.wall10.rotation.set(0, 0, 0);
            this.add(this.wall10);
            console.log("Added Innerwall 10");
        };
        GameScene3.prototype.addwall11 = function () {
            this.wall11Geometry = new BoxGeometry(2, 4, 70);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall11 = new Physijs.ConvexMesh(this.wall11Geometry, this.wallPhysicsMaterial, 0);
            this.wall11.receiveShadow = true;
            this.wall11.name = "Wall";
            this.wall11.position.set(-25, 3, -3);
            this.wall11.rotation.set(0, 0, 0);
            this.add(this.wall11);
            console.log("Added Innerwall 11");
        };
        GameScene3.prototype.addwall12 = function () {
            this.wall12Geometry = new BoxGeometry(2, 4, 36);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall12 = new Physijs.ConvexMesh(this.wall12Geometry, this.wallPhysicsMaterial, 0);
            this.wall12.receiveShadow = true;
            this.wall12.name = "Wall";
            this.wall12.position.set(-13, 3, -30);
            this.wall12.rotation.set(0, 0, 0);
            this.add(this.wall12);
            console.log("Added Innerwall 1");
        };
        GameScene3.prototype.addwall13 = function () {
            this.wall13Geometry = new BoxGeometry(2, 4, 28);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall13 = new Physijs.ConvexMesh(this.wall13Geometry, this.wallPhysicsMaterial, 0);
            this.wall13.receiveShadow = true;
            this.wall13.name = "Wall";
            this.wall13.position.set(-1, 3, -12);
            this.wall13.rotation.set(0, 0, 0);
            this.add(this.wall13);
            console.log("Added Innerwall 1");
        };
        GameScene3.prototype.addwall14 = function () {
            this.wall14Geometry = new BoxGeometry(2, 4, 28);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall14 = new Physijs.ConvexMesh(this.wall14Geometry, this.wallPhysicsMaterial, 0);
            this.wall14.receiveShadow = true;
            this.wall14.name = "Wall";
            this.wall14.position.set(11, 3, -22);
            this.wall14.rotation.set(0, 0, 0);
            this.add(this.wall14);
            console.log("Added Innerwall 14");
        };
        GameScene3.prototype.addwall15 = function () {
            this.wall15Geometry = new BoxGeometry(2, 4, 11);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall15 = new Physijs.ConvexMesh(this.wall15Geometry, this.wallPhysicsMaterial, 0);
            this.wall15.receiveShadow = true;
            this.wall15.name = "Wall";
            this.wall15.position.set(10, 3, 33.5);
            this.wall15.rotation.set(0, 0, 0);
            this.add(this.wall15);
            console.log("Added Innerwall 15");
        };
        GameScene3.prototype.addwall16 = function () {
            this.wall16Geometry = new BoxGeometry(2, 4, 11);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall16 = new Physijs.ConvexMesh(this.wall16Geometry, this.wallPhysicsMaterial, 0);
            this.wall16.receiveShadow = true;
            this.wall16.name = "Wall";
            this.wall16.position.set(-2, 3, 42.5);
            this.wall16.rotation.set(0, 0, 0);
            this.add(this.wall16);
            console.log("Added Innerwall 16");
        };
        GameScene3.prototype.addwall17 = function () {
            this.wall17Geometry = new BoxGeometry(2, 4, 11);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall17 = new Physijs.ConvexMesh(this.wall17Geometry, this.wallPhysicsMaterial, 0);
            this.wall17.receiveShadow = true;
            this.wall17.name = "Wall";
            this.wall17.position.set(-14, 3, 33.5);
            this.wall17.rotation.set(0, 0, 0);
            this.add(this.wall17);
            console.log("Added Innerwall 1");
        };
        GameScene3.prototype.addwall18 = function () {
            this.wall18Geometry = new BoxGeometry(2, 4, 5);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.wall18 = new Physijs.ConvexMesh(this.wall18Geometry, this.wallPhysicsMaterial, 0);
            this.wall18.receiveShadow = true;
            this.wall18.name = "Wall";
            this.wall18.position.set(-25, 3, 45.5);
            this.wall18.rotation.set(0, 0, 0);
            this.add(this.wall18);
            console.log("Added Innerwall 18");
        };
        GameScene3.prototype.addBoundary2a = function () {
            this.bluewallTexture = new THREE.TextureLoader().load('../../Assets/images/blue_wall.jpg');
            this.bluewallTexture.wrapS = THREE.RepeatWrapping;
            this.bluewallTexture.wrapT = THREE.RepeatWrapping;
            this.bluewallTexture.repeat.set(2, 2);
            this.bluewallTextureNormal = new THREE.TextureLoader().load('../../Assets/images/blue_wall.jpg');
            this.bluewallTextureNormal.wrapS = THREE.RepeatWrapping;
            this.bluewallTextureNormal.wrapT = THREE.RepeatWrapping;
            this.bluewallTextureNormal.repeat.set(4, 4);
            this.bluewallMaterial = new PhongMaterial();
            this.bluewallMaterial.map = this.bluewallTexture;
            this.bluewallMaterial.bumpMap = this.bluewallTextureNormal;
            this.bluewallMaterial.bumpScale = 0.2;
            this.boundary2aGeometry = new BoxGeometry(2, 4, 8);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.bluewallMaterial, 0, 0);
            this.boundary2a = new Physijs.ConvexMesh(this.boundary2aGeometry, this.wallPhysicsMaterial, 0);
            this.boundary2a.receiveShadow = true;
            this.boundary2a.name = "WinningWall";
            this.boundary2a.position.set(-44, 3, 49);
            this.boundary2a.rotation.set(0, 1.570796, 0);
            this.add(this.boundary2a);
            console.log("Added boundary 2a");
        };
        /**
         * Adds the enemy object to the scene
         *
         * @method addEnemy
         * @return void
         */
        GameScene3.prototype.addEnemy = function () {
            // Enemy Object
            this.enemyGeometry = new SphereGeometry(1, 32, 32);
            this.enemyMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xff2200 }), 0.4, 0);
            this.enemy = new Physijs.SphereMesh(this.enemyGeometry, this.enemyMaterial, 2);
            this.enemy.position.set(0, 60, -10);
            this.enemy.castShadow = true;
            this.enemy.name = "Enemy";
            this.add(this.enemy);
            console.log("Added Enemy to Scene");
        };
        /**
         * Adds the dig object to the scene
         *
         * @method addDig
         * @return void
         */
        GameScene3.prototype.addDig = function () {
            // Dig Object
            this.digGeometry = new SphereGeometry(1, 1, 32);
            this.digMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xff2200 }), 0.4, 0);
            this.dig = new Physijs.SphereMesh(this.digGeometry, this.digMaterial, 2);
            this.dig.position.set(0, 2, -10);
            this.dig.castShadow = true;
            this.dig.name = "Dig";
            this.add(this.dig);
            console.log("Added Dig to Scene");
        };
        /**
         * Have the enemy look at the player
         *
         * @method enemyLook
         * @remove void
         */
        GameScene3.prototype.enemyMoveAndLook = function () {
            this.enemy.lookAt(this.player.position);
            var direction = new Vector3(0, 0, 5);
            direction.applyQuaternion(this.enemy.quaternion);
            this.enemy.applyCentralForce(direction);
        };
        /**
         * Adds the player controller to the scene
         *
         * @method addPlayer
         * @return void
         */
        GameScene3.prototype.addPlayer = function () {
            // Player Object
            this.playerGeometry = new BoxGeometry(1.5, 3, 1.5);
            this.playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
            this.player = new Physijs.BoxMesh(this.playerGeometry, this.playerMaterial, 1);
            this.player.position.set(0, 30, 10);
            this.player.rotation.set(0, 3.14159, 0);
            this.player.receiveShadow = true;
            this.player.castShadow = true;
            this.player.name = "Player";
            // Player Left Hand Object
            this.playerLeftHandGeometry = new BoxGeometry(2, .5, .5);
            this.playerLeftHandMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
            this.playerLeftHand = new Physijs.BoxMesh(this.playerLeftHandGeometry, this.playerLeftHandMaterial, 1);
            this.playerLeftHand.position.set(-1, 0, 0);
            this.playerLeftHand.rotation.set(0, 3.14159, 0);
            this.playerLeftHand.receiveShadow = true;
            this.playerLeftHand.castShadow = true;
            this.playerLeftHand.name = "Player";
            this.player.add(this.playerLeftHand);
            // Player Right Hand Object
            this.playerRightHandGeometry = new BoxGeometry(2, .5, .5);
            this.playerRightHandMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
            this.playerRightHand = new Physijs.BoxMesh(this.playerRightHandGeometry, this.playerRightHandMaterial, 1);
            this.playerRightHand.position.set(1, 0, 0);
            this.playerRightHand.rotation.set(0, 3.14159, 0);
            this.playerRightHand.receiveShadow = true;
            this.playerRightHand.castShadow = true;
            this.playerRightHand.name = "Player";
            this.player.add(this.playerRightHand);
            this.add(this.player);
            console.log("Added Player to Scene");
        };
        /**
         * This method adds a coin to the scene
         *
         * @method addCoinMesh
         * @return void
         */
        GameScene3.prototype.addCoinMesh = function () {
            var self = this;
            this.coins = new Array(); // Instantiate a convex mesh array
            this.coinGeometry = new SphereGeometry(1, 32, 32);
            this.coinGeometry.scale(1, 0.5, 1);
            this.coinMaterial = Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture("../../Assets/images/DarkAntiqueGold.jpg") }), 0.4, 0);
            for (var count = 0; count < self.coinCount; count++) {
                this.coins[count] = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
                this.setCoinPosition(this.coins[count]);
                this.coins[count].castShadow = true;
                this.coins[count].name = "Coin";
                this.add(this.coins[count]);
                console.log("Added coins " + count + " to Scene");
            }
        };
        /**
         * This method randomly sets the coin object's position
         *
         * @method setCoinPosition
         * @return void
         */
        GameScene3.prototype.setCoinPosition = function (coin) {
            var randomPointX = Math.floor(Math.random() * 50) - 10;
            var randomPointZ = Math.floor(Math.random() * 50) - 10;
            coin.position.set(randomPointX, 10, randomPointZ);
            this.add(coin);
        };
        /**
         * Add the death plane to the scene
         *
         * @method addDeathPlane
         * @return void
         */
        GameScene3.prototype.addDeathPlane = function () {
            this.deathPlaneGeometry = new BoxGeometry(200, 1, 200);
            this.deathPlaneMaterial = Physijs.createMaterial(new MeshBasicMaterial({ color: 0xff0000 }), 0.4, 0.6);
            // make deathPlane invisible during play - comment out next two lines during debugging
            this.deathPlaneMaterial.transparent = true;
            this.deathPlaneMaterial.opacity = 0;
            this.deathPlane = new Physijs.BoxMesh(this.deathPlaneGeometry, this.deathPlaneMaterial, 0);
            this.deathPlane.position.set(0, -10, 0);
            this.deathPlane.name = "DeathPlane";
            this.add(this.deathPlane);
        };
        /**
         * Event Handler method for any pointerLockChange events
         *
         * @method pointerLockChange
         * @return void
         */
        GameScene3.prototype.pointerLockChange = function (event) {
            if (document.pointerLockElement === this.element) {
                // enable our mouse and keyboard controls
                this.keyboardControls.enabled = true;
                this.mouseControls.enabled = true;
                this.blocker.style.display = 'none';
            }
            else {
                if (livesValue <= 0) {
                    this.blocker.style.display = 'none';
                    document.removeEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
                }
                else {
                    this.blocker.style.display = '-webkit-box';
                    this.blocker.style.display = '-moz-box';
                    this.blocker.style.display = 'box';
                    this.instructions.style.display = '';
                }
                // disable our mouse and keyboard controls
                this.keyboardControls.enabled = false;
                this.mouseControls.enabled = false;
                console.log("PointerLock disabled");
            }
        };
        /**
         * Event handler for PointerLockError
         *
         * @method pointerLockError
         * @return void
         */
        GameScene3.prototype.pointerLockError = function (event) {
            this.instructions.style.display = '';
            console.log("PointerLock Error Detected!!");
        };
        // Check Controls Function
        /**
         * This method updates the player's position based on user input
         *
         * @method checkControls
         * @return void
         */
        GameScene3.prototype.checkControls = function () {
            if (this.keyboardControls.enabled) {
                this.velocity = new Vector3();
                var time = performance.now();
                var delta = (time - this.prevTime) / 1000;
                var direction = new Vector3(0, 0, 0);
                if (this.keyboardControls.moveForward) {
                    this.velocity.z -= 600.0 * delta;
                }
                if (this.keyboardControls.moveLeft) {
                    this.velocity.x -= 400.0 * delta;
                }
                if (this.keyboardControls.moveBackward) {
                    this.velocity.z += 600.0 * delta;
                }
                if (this.keyboardControls.moveRight) {
                    this.velocity.x += 400.0 * delta;
                }
                if (this.isGrounded) {
                    if (this.keyboardControls.jump) {
                        this.velocity.y += 4000.0 * delta;
                        if (this.player.position.y > 4) {
                            this.isGrounded = false;
                        }
                    }
                }
                this.player.setDamping(0.7, 0.1);
                // Changing player's rotation
                this.player.setAngularVelocity(new Vector3(0, this.mouseControls.yaw, 0));
                direction.addVectors(direction, this.velocity);
                direction.applyQuaternion(this.player.quaternion);
                if (Math.abs(this.player.getLinearVelocity().x) < 20 && Math.abs(this.player.getLinearVelocity().y) < 10) {
                    this.player.applyCentralForce(direction);
                }
                this.cameraLook();
                // isGrounded ends
                //reset Pitch and Yaw
                this.mouseControls.pitch = 0;
                this.mouseControls.yaw = 0;
                this.prevTime = time;
            } // Controls Enabled ends
            else {
                this.player.setAngularVelocity(new Vector3(0, 0, 0));
            }
        };
        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++
        /**
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        GameScene3.prototype.start = function () {
            var _this = this;
            createjs.Sound.stop();
            // setup the class context to use within events
            var self = this;
            this.sound();
            // Set Up Scoreboard
            this.setupScoreboard();
            this.addCoinMesh();
            //check to see if pointerlock is supported
            this.havePointerLock = 'pointerLockElement' in document ||
                'mozPointerLockElement' in document ||
                'webkitPointerLockElement' in document;
            // Check to see if we have pointerLock
            if (this.havePointerLock) {
                this.element = document.body;
                this.instructions.addEventListener('click', function () {
                    // Ask the user for pointer lock
                    console.log("Requesting PointerLock");
                    _this.element.requestPointerLock = _this.element.requestPointerLock ||
                        _this.element.mozRequestPointerLock ||
                        _this.element.webkitRequestPointerLock;
                    _this.element.requestPointerLock();
                });
                document.addEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
            }
            // Scene changes for Physijs
            this.name = "Play Scene";
            this.fog = new THREE.Fog(0xffffff, 0, 750);
            this.setGravity(new THREE.Vector3(0, -10, 0));
            // Add Spot Light to the scene
            this.addSpotLight();
            // Ground Object
            this.addGround();
            // Add player controller
            this.addPlayer();
            // Add custom coin imported from Blender
            //this.addCoinMesh();
            // Add death plane to the scene
            this.addDeathPlane();
            //Add boundary1 to the scene
            this.addBoundary1();
            // Add Enemy Object
            this.addEnemy();
            // Add Enemy Object
            //this.addDig();
            //Add boundary2 to the scene
            this.addBoundary2();
            //Add boundary2a to the scene
            this.addBoundary2a();
            //Add boundary3 to the scene
            this.addBoundary3();
            this.addBoundary4();
            this.addBoundary5();
            this.addwall1();
            this.addwall2();
            this.addwall3();
            this.addwall4();
            this.addwall5();
            this.addwall6();
            this.addwall7();
            this.addwall8();
            this.addwall8a();
            this.addwall9();
            this.addwall10();
            this.addwall11();
            this.addwall12();
            this.addwall13();
            this.addwall14();
            this.addwall15();
            this.addwall16();
            this.addwall17();
            this.addwall18();
            // Collision check for DeathPlane
            this.deathPlane.addEventListener('collision', function (otherObject) {
                // if a coin falls off the ground, reset
                if (otherObject.name === "Coin") {
                    this.remove(otherObject);
                    this.setCoinPosition(otherObject);
                }
                // if the enemy falls off the ground, reset
                if (otherObject.name === "Enemy") {
                    self.remove(otherObject);
                    self.enemy.position.set(0, 60, Math.floor(Math.random() * 50) - 10);
                    self.add(self.enemy);
                    self.enemy.setLinearVelocity(new Vector3(0, 0, 0));
                    self.enemyMoveAndLook();
                }
            }.bind(self));
            // Collision Check with player
            this.player.addEventListener('collision', function (eventObject) {
                if (eventObject.name === "Ground") {
                    self.isGrounded = true;
                    createjs.Sound.play("land");
                }
                if (eventObject.name === "Coin") {
                    createjs.Sound.play("coin");
                    self.remove(eventObject);
                    self.setCoinPosition(eventObject);
                    scoreValue += 100;
                    self.scoreLabel.text = "SCORE: " + scoreValue;
                }
                if (eventObject.name === "Enemy" || eventObject.name === "Dig") {
                    createjs.Sound.play("enemy");
                    livesValue--;
                    if (livesValue <= 0) {
                        // Exit Pointer Lock
                        document.exitPointerLock();
                        self.children = []; // an attempt to clean up
                        self.player.remove(camera);
                        // Play the Game Over Scene
                        currentScene = config.Scene.OVER;
                        changeScene();
                    }
                    else {
                        // otherwise reset my player and update Lives
                        self.livesLabel.text = "LIVES: " + livesValue;
                        self.remove(self.player);
                        self.player.position.set(0, 30, 10);
                        self.player.rotation.set(0, 0, 0);
                        self.add(self.player);
                    }
                }
                if (eventObject.name === "WinningWall") {
                    createjs.Sound.play("hit");
                    scoreValue += 500;
                    self.scoreLabel.text = "SCORE: " + scoreValue;
                    self.livesLabel.text = "LIVES: " + livesValue;
                    // Exit Pointer Lock
                    document.exitPointerLock();
                    self.children = []; // an attempt to clean up
                    self.player.remove(camera);
                    // Play the Game Over Scene
                    currentScene = config.Scene.OVER;
                    changeScene();
                }
                if (eventObject.name === "DeathPlane") {
                    createjs.Sound.play("hit");
                    livesValue--;
                    if (livesValue <= 0) {
                        // Exit Pointer Lock
                        document.exitPointerLock();
                        self.children = []; // an attempt to clean up
                        self.player.remove(camera);
                        // Play the Game Over Scene
                        currentScene = config.Scene.OVER;
                        changeScene();
                    }
                    else {
                        // otherwise reset my player and update Lives
                        self.livesLabel.text = "LIVES: " + livesValue;
                        self.remove(self.player);
                        self.player.position.set(0, 30, 10);
                        self.player.rotation.set(0, 0, 0);
                        self.add(self.player);
                    }
                }
            }.bind(self));
            camera.rotation.set(-0.45, 0, 0);
            camera.position.set(0, 15, 20);
            this.player.add(camera);
        };
        /**
         * Camera Look function
         *
         * @method cameraLook
         * @return void
         */
        GameScene3.prototype.cameraLook = function () {
            var zenith = THREE.Math.degToRad(-20);
            var nadir = THREE.Math.degToRad(-20);
            var cameraPitch = camera.rotation.x + this.mouseControls.pitch;
            // Constrain the Camera Pitch
            // camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
        };
        /**
         * @method update
         * @returns void
         */
        GameScene3.prototype.update = function () {
            this.checkControls();
            this.enemyMoveAndLook();
            this.stage.update();
            if (!this.keyboardControls.paused) {
                this.simulate();
            }
        };
        /**
         * Responds to screen resizes
         *
         * @method resize
         * @return void
         */
        GameScene3.prototype.resize = function () {
            canvas.style.width = "100%";
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.update();
        };
        return GameScene3;
    })(scenes.Scene);
    scenes.GameScene3 = GameScene3;
})(scenes || (scenes = {}));
//# sourceMappingURL=GameScene3.js.map
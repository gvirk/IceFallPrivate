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
            this.livesLabel = new createjs.Text("LIVES: " + livesValue, "40px Algerian", "#ffffff");
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.livesLabel);
            console.log("Added Lives Label to stage");
            // Add Score Label
            this.scoreLabel = new createjs.Text("SCORE: " + scoreValue, "40px Algerian", "#ffffff");
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
        GameScene3.prototype.addIW1 = function () {
            this.iw1Geometry = new BoxGeometry(2, 4, 74);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw1 = new Physijs.ConvexMesh(this.iw1Geometry, this.wallPhysicsMaterial, 0);
            this.iw1.receiveShadow = true;
            this.iw1.name = "Wall";
            this.iw1.position.set(37, 3, -1);
            this.iw1.rotation.set(0, 0, 0);
            this.add(this.iw1);
            console.log("Added Innerwall 1");
        };
        GameScene3.prototype.addIW2 = function () {
            this.iw2Geometry = new BoxGeometry(2, 4, 46);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw2 = new Physijs.ConvexMesh(this.iw2Geometry, this.wallPhysicsMaterial, 0);
            this.iw2.receiveShadow = true;
            this.iw2.name = "Wall";
            this.iw2.position.set(13, 3, 15);
            this.iw2.rotation.set(0, 1.570796, 0);
            this.add(this.iw2);
            console.log("Added Innerwall 2");
        };
        GameScene3.prototype.addIW3 = function () {
            this.iw3Geometry = new BoxGeometry(2, 4, 32);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw3 = new Physijs.ConvexMesh(this.iw3Geometry, this.wallPhysicsMaterial, 0);
            this.iw3.receiveShadow = true;
            this.iw3.name = "Wall";
            this.iw3.position.set(25, 3, 32);
            this.iw3.rotation.set(0, 0, 0);
            this.add(this.iw3);
            console.log("Added Innerwall 3");
        };
        GameScene3.prototype.addIW4 = function () {
            this.iw4Geometry = new BoxGeometry(2, 4, 40);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw4 = new Physijs.ConvexMesh(this.iw4Geometry, this.wallPhysicsMaterial, 0);
            this.iw4.receiveShadow = true;
            this.iw4.name = "Wall";
            this.iw4.position.set(25, 3, -6);
            this.iw4.rotation.set(0, 0, 0);
            this.add(this.iw4);
            console.log("Added Innerwall 4");
        };
        GameScene3.prototype.addIW5 = function () {
            this.iw5Geometry = new BoxGeometry(2, 4, 38);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw5 = new Physijs.ConvexMesh(this.iw5Geometry, this.wallPhysicsMaterial, 0);
            this.iw5.receiveShadow = true;
            this.iw5.name = "Wall";
            this.iw5.position.set(-5, 3, 27);
            this.iw5.rotation.set(0, 1.570796, 0);
            this.add(this.iw5);
            console.log("Added Innerwall 5");
        };
        GameScene3.prototype.addIW6 = function () {
            this.iw6Geometry = new BoxGeometry(2, 4, 38);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw6 = new Physijs.ConvexMesh(this.iw6Geometry, this.wallPhysicsMaterial, 0);
            this.iw6.receiveShadow = true;
            this.iw6.name = "Wall";
            this.iw6.position.set(-5, 3, 3);
            this.iw6.rotation.set(0, 1.570796, 0);
            this.add(this.iw6);
            console.log("Added Innerwall 6");
        };
        GameScene3.prototype.addIW7 = function () {
            this.iw7Geometry = new BoxGeometry(2, 4, 38);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw7 = new Physijs.ConvexMesh(this.iw7Geometry, this.wallPhysicsMaterial, 0);
            this.iw7.receiveShadow = true;
            this.iw7.name = "Wall";
            this.iw7.position.set(7, 3, -37);
            this.iw7.rotation.set(0, 1.570796, 0);
            this.add(this.iw7);
            console.log("Added Innerwall 7");
        };
        GameScene3.prototype.addIW8 = function () {
            this.iw8Geometry = new BoxGeometry(2, 4, 22);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw8 = new Physijs.ConvexMesh(this.iw8Geometry, this.wallPhysicsMaterial, 0);
            this.iw8.receiveShadow = true;
            this.iw8.name = "Wall";
            this.iw8.position.set(-37, 3, 18);
            this.iw8.rotation.set(0, 1.570796, 0);
            this.add(this.iw8);
            console.log("Added Innerwall 8");
        };
        GameScene3.prototype.addIW8a = function () {
            this.iw8aGeometry = new BoxGeometry(2, 4, 10);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw8a = new Physijs.ConvexMesh(this.iw8aGeometry, this.wallPhysicsMaterial, 0);
            this.iw8a.receiveShadow = true;
            this.iw8a.name = "Wall";
            this.iw8a.position.set(-43, 3, -21);
            this.iw8a.rotation.set(0, 1.570796, 0);
            this.add(this.iw8a);
            console.log("Added Innerwall 8a");
        };
        GameScene3.prototype.addIW9 = function () {
            this.iw9Geometry = new BoxGeometry(2, 4, 10);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw9 = new Physijs.ConvexMesh(this.iw9Geometry, this.wallPhysicsMaterial, 0);
            this.iw9.receiveShadow = true;
            this.iw9.name = "Wall";
            this.iw9.position.set(-43, 3, -3);
            this.iw9.rotation.set(0, 1.570796, 0);
            this.add(this.iw9);
            console.log("Added Innerwall 9");
        };
        GameScene3.prototype.addIW10 = function () {
            this.iw10Geometry = new BoxGeometry(2, 4, 40);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw10 = new Physijs.ConvexMesh(this.iw10Geometry, this.wallPhysicsMaterial, 0);
            this.iw10.receiveShadow = true;
            this.iw10.name = "Wall";
            this.iw10.position.set(-37, 3, -14);
            this.iw10.rotation.set(0, 0, 0);
            this.add(this.iw10);
            console.log("Added Innerwall 10");
        };
        GameScene3.prototype.addIW11 = function () {
            this.iw11Geometry = new BoxGeometry(2, 4, 70);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw11 = new Physijs.ConvexMesh(this.iw11Geometry, this.wallPhysicsMaterial, 0);
            this.iw11.receiveShadow = true;
            this.iw11.name = "Wall";
            this.iw11.position.set(-25, 3, -3);
            this.iw11.rotation.set(0, 0, 0);
            this.add(this.iw11);
            console.log("Added Innerwall 11");
        };
        GameScene3.prototype.addIW12 = function () {
            this.iw12Geometry = new BoxGeometry(2, 4, 36);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw12 = new Physijs.ConvexMesh(this.iw12Geometry, this.wallPhysicsMaterial, 0);
            this.iw12.receiveShadow = true;
            this.iw12.name = "Wall";
            this.iw12.position.set(-13, 3, -30);
            this.iw12.rotation.set(0, 0, 0);
            this.add(this.iw12);
            console.log("Added Innerwall 1");
        };
        GameScene3.prototype.addIW13 = function () {
            this.iw13Geometry = new BoxGeometry(2, 4, 28);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw13 = new Physijs.ConvexMesh(this.iw13Geometry, this.wallPhysicsMaterial, 0);
            this.iw13.receiveShadow = true;
            this.iw13.name = "Wall";
            this.iw13.position.set(-1, 3, -12);
            this.iw13.rotation.set(0, 0, 0);
            this.add(this.iw13);
            console.log("Added Innerwall 1");
        };
        GameScene3.prototype.addIW14 = function () {
            this.iw14Geometry = new BoxGeometry(2, 4, 28);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw14 = new Physijs.ConvexMesh(this.iw14Geometry, this.wallPhysicsMaterial, 0);
            this.iw14.receiveShadow = true;
            this.iw14.name = "Wall";
            this.iw14.position.set(11, 3, -22);
            this.iw14.rotation.set(0, 0, 0);
            this.add(this.iw14);
            console.log("Added Innerwall 14");
        };
        GameScene3.prototype.addIW15 = function () {
            this.iw15Geometry = new BoxGeometry(2, 4, 11);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw15 = new Physijs.ConvexMesh(this.iw15Geometry, this.wallPhysicsMaterial, 0);
            this.iw15.receiveShadow = true;
            this.iw15.name = "Wall";
            this.iw15.position.set(10, 3, 33.5);
            this.iw15.rotation.set(0, 0, 0);
            this.add(this.iw15);
            console.log("Added Innerwall 15");
        };
        GameScene3.prototype.addIW16 = function () {
            this.iw16Geometry = new BoxGeometry(2, 4, 11);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw16 = new Physijs.ConvexMesh(this.iw16Geometry, this.wallPhysicsMaterial, 0);
            this.iw16.receiveShadow = true;
            this.iw16.name = "Wall";
            this.iw16.position.set(-2, 3, 42.5);
            this.iw16.rotation.set(0, 0, 0);
            this.add(this.iw16);
            console.log("Added Innerwall 16");
        };
        GameScene3.prototype.addIW17 = function () {
            this.iw17Geometry = new BoxGeometry(2, 4, 11);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw17 = new Physijs.ConvexMesh(this.iw17Geometry, this.wallPhysicsMaterial, 0);
            this.iw17.receiveShadow = true;
            this.iw17.name = "Wall";
            this.iw17.position.set(-14, 3, 33.5);
            this.iw17.rotation.set(0, 0, 0);
            this.add(this.iw17);
            console.log("Added Innerwall 1");
        };
        GameScene3.prototype.addIW18 = function () {
            this.iw18Geometry = new BoxGeometry(2, 4, 5);
            this.wallPhysicsMaterial = Physijs.createMaterial(this.wallMaterial, 0, 0);
            this.iw18 = new Physijs.ConvexMesh(this.iw18Geometry, this.wallPhysicsMaterial, 0);
            this.iw18.receiveShadow = true;
            this.iw18.name = "Wall";
            this.iw18.position.set(-25, 3, 45.5);
            this.iw18.rotation.set(0, 0, 0);
            this.add(this.iw18);
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
            this.addIW1();
            this.addIW2();
            this.addIW3();
            this.addIW4();
            this.addIW5();
            this.addIW6();
            this.addIW7();
            this.addIW8();
            this.addIW8a();
            this.addIW9();
            this.addIW10();
            this.addIW11();
            this.addIW12();
            this.addIW13();
            this.addIW14();
            this.addIW15();
            this.addIW16();
            this.addIW17();
            this.addIW18();
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
                if (eventObject.name === "Wall") {
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
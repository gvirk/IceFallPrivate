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
    var GameScene2 = (function (_super) {
        __extends(GameScene2, _super);
        /**
         * @constructor
         */
        function GameScene2() {
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
        GameScene2.prototype._setupCanvas = function () {
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
        GameScene2.prototype._initialize = function () {
            // Create to HTMLElements
            this.blocker = document.getElementById("blocker");
            this.instructions = document.getElementById("instructions");
            this.blocker.style.display = "block";
            // setup canvas for menu scene
            this._setupCanvas();
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
        GameScene2.prototype.setupScoreboard = function () {
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
         * Add a spotLight to the scene
         *
         * @method addSpotLight
         * @return void
         */
        GameScene2.prototype.addSpotLight = function () {
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
         * Add a background score to the scene
         *
         * @method sound
         * @return void
         */
        GameScene2.prototype.sound = function () {
            createjs.Sound.stop();
            createjs.Sound.play("game1_background");
            createjs.Sound.volume = 0.5;
        };
        /**
         * Adds the player controller to the scene
         *
         * @method addPlayer
         * @return void
         */
        GameScene2.prototype.addPlayer = function () {
            // Player Object
            this.playerGeometry = new BoxGeometry(1.5, 3, 1.5);
            this.playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
            this.player = new Physijs.BoxMesh(this.playerGeometry, this.playerMaterial, 1);
            this.player.position.set(0, 10, -100);
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
         * Add a ground plane to the scene
         *
         * @method addGround
         * @return void
         */
        GameScene2.prototype.addDeathGround = function () {
            this.deathGroundTexture = new THREE.TextureLoader().load('../../Assets/images/death-ground.jpg');
            this.deathGroundTexture.wrapS = THREE.RepeatWrapping;
            this.deathGroundTexture.wrapT = THREE.RepeatWrapping;
            this.deathGroundTexture.repeat.set(8, 8);
            this.deathGroundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/death-ground.jpg');
            this.deathGroundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.deathGroundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.deathGroundTextureNormal.repeat.set(8, 8);
            this.deathGroundMaterial = new PhongMaterial();
            this.deathGroundMaterial.map = this.deathGroundTexture;
            this.deathGroundMaterial.bumpMap = this.deathGroundTextureNormal;
            this.deathGroundMaterial.bumpScale = 0.2;
            this.deathGroundGeometry = new BoxGeometry(100, 1, 250);
            this.deathGroundPhysicsMaterial = Physijs.createMaterial(this.deathGroundMaterial, 0, 0);
            this.deathGround = new Physijs.ConvexMesh(this.deathGroundGeometry, this.deathGroundPhysicsMaterial, 0);
            this.deathGround.receiveShadow = true;
            this.deathGround.position.set(0, -15, 0);
            this.deathGround.name = "DeathGround";
            this.add(this.deathGround);
            console.log("Added Death Ground to scene");
        };
        /**
         * Event Handler method for any pointerLockChange events
         *
         * @method pointerLockChange
         * @return void
         */
        GameScene2.prototype.pointerLockChange = function (event) {
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
        GameScene2.prototype.pointerLockError = function (event) {
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
        GameScene2.prototype.checkControls = function () {
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
        /**
         * Add a ground plane to the scene
         *
         * @method addGround
         * @return void
         */
        GameScene2.prototype.addGround = function () {
            this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/snowGravel.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(8, 8);
            this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/snowGravel.jpg');
            this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormal.repeat.set(8, 8);
            this.groundMaterial = new PhongMaterial();
            this.groundMaterial.map = this.groundTexture;
            this.groundMaterial.bumpMap = this.groundTextureNormal;
            this.groundMaterial.bumpScale = 0.2;
            this.groundGeometry = new BoxGeometry(10, 0.1, 20);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.position.set(0, 0, 110);
            this.ground.receiveShadow = true;
            this.ground.name = "SavedGround";
            this.add(this.ground);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(0, 0, -100);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground";
            this.add(this.ground1);
            this.groundGeometry = new BoxGeometry(10, 0.1, 5);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(0, 0, -75);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground";
            this.add(this.ground1);
            this.groundGeometry = new BoxGeometry(10, 0.1, 10);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(0, 0, -55);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground";
            this.add(this.ground1);
            this.groundGeometry = new BoxGeometry(10, 0.1, 3);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(0, 0, -40);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground";
            this.add(this.ground1);
            this.groundGeometry = new BoxGeometry(10, 0.1, 7);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(0, 0, -20);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground";
            this.add(this.ground1);
            this.groundGeometry = new BoxGeometry(10, 0.1, 5);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(-15, 0, 0);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground1";
            this.add(this.ground1);
            this.groundGeometry = new BoxGeometry(10, 0.1, 5);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(15, 0, 0);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground";
            this.add(this.ground1);
            this.groundGeometry = new BoxGeometry(10, 0.1, 20);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(0, 0, 20);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground";
            this.add(this.ground1);
            this.groundGeometry = new BoxGeometry(1, 0.1, 15);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(-0.3, 0, 40);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground";
            this.add(this.ground1);
            this.groundGeometry = new BoxGeometry(1, 0.1, 15);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(0.3, 0, 50);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground";
            this.add(this.ground1);
            this.groundGeometry = new BoxGeometry(10, 0.1, 10);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(0, 0, 70);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground";
            this.add(this.ground1);
            this.groundGeometry = new BoxGeometry(10, 0.1, 5);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground1 = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground1.position.set(0, 0, 90);
            this.ground1.receiveShadow = true;
            this.ground1.name = "Ground";
            this.add(this.ground1);
            console.log("Added Ground to scene");
        };
        /**
         * Add a coid plane to the scene
         *
         * @method addCoin
         * @return void
         */
        GameScene2.prototype.addCoin = function () {
            this.coinGeometry = new SphereGeometry(1, 32, 32);
            this.coinGeometry.scale(1, 0.5, 1);
            this.coinPhysicsMaterial = Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture("../../Assets/images/DarkAntiqueGold.jpg") }), 0.4, 0);
            this.coin = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
            this.coin.position.set(0, 2, -75);
            this.coin.castShadow = true;
            this.coin.name = "Coin";
            this.add(this.coin);
            console.log("coin added");
            this.coin = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
            this.coin.position.set(0, 2, -55);
            this.coin.castShadow = true;
            this.coin.name = "Coin";
            this.add(this.coin);
            console.log("coin added");
            this.coin = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
            this.coin.position.set(0, 2, -40);
            this.coin.castShadow = true;
            this.coin.name = "Coin";
            this.add(this.coin);
            console.log("coin added");
            this.coin = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
            this.coin.position.set(0, 2, -20);
            this.coin.castShadow = true;
            this.coin.name = "Coin";
            this.add(this.coin);
            console.log("coin added");
            this.coin = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
            this.coin.position.set(-15, 2, 0);
            this.coin.castShadow = true;
            this.coin.name = "Coin";
            this.add(this.coin);
            console.log("coin added");
            this.coin = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
            this.coin.position.set(15, 2, 0);
            this.coin.castShadow = true;
            this.coin.name = "Coin";
            this.add(this.coin);
            console.log("coin added");
            this.coin = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
            this.coin.position.set(0, 2, 20);
            this.coin.castShadow = true;
            this.coin.name = "Coin";
            this.add(this.coin);
            console.log("coin added");
            this.coin = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
            this.coin.position.set(0, 2, 40);
            this.coin.castShadow = true;
            this.coin.name = "Coin";
            this.add(this.coin);
            console.log("coin added");
            this.coin = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
            this.coin.position.set(0, 2, 50);
            this.coin.castShadow = true;
            this.coin.name = "Coin";
            this.add(this.coin);
            console.log("coin added");
            this.coin = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
            this.coin.position.set(0, 2, 70);
            this.coin.castShadow = true;
            this.coin.name = "Coin";
            this.add(this.coin);
            console.log("coin added");
            this.coin = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
            this.coin.position.set(0, 2, 90);
            this.coin.castShadow = true;
            this.coin.name = "Coin";
            this.add(this.coin);
            console.log("coin added");
            console.log("Added Ground to scene");
        };
        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++
        /**
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        GameScene2.prototype.start = function () {
            var _this = this;
            createjs.Sound.stop();
            // setup the class context to use within events
            var self = this;
            this.sound();
            // Set Up Scoreboard
            this.setupScoreboard();
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
            this.addCoin();
            // Add player controller
            this.addPlayer();
            // Add custom coin imported from Blender
            //this.addCoinMesh();
            // Add death ground to the scene
            this.addDeathGround();
            // Collision Check with player
            this.player.addEventListener('collision', function (eventObject) {
                if (eventObject.name === "Ground") {
                    self.isGrounded = true;
                    createjs.Sound.play("land");
                }
                if (eventObject.name === "SavedGround") {
                    scoreValue += 500;
                    self.scoreLabel.text = "SCORE: " + scoreValue;
                    self.livesLabel.text = "LIVES: " + livesValue;
                    // Exit Pointer Lock
                    document.exitPointerLock();
                    self.children = []; // an attempt to clean up
                    self.player.remove(camera);
                    // Play the Instruction 3 Scene
                    currentScene = config.Scene.INSTRUCTION3;
                    changeScene();
                }
                if (eventObject.name === "Coin") {
                    createjs.Sound.play("coin");
                    self.remove(eventObject);
                    scoreValue += 100;
                    self.scoreLabel.text = "SCORE: " + scoreValue;
                }
                if (eventObject.name === "DeathGround") {
                    createjs.Sound.play("Mine");
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
                        self.player.position.set(0, 10, -100);
                        self.player.rotation.set(0, 3.14159, 0);
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
        GameScene2.prototype.cameraLook = function () {
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
        GameScene2.prototype.update = function () {
            this.checkControls();
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
        GameScene2.prototype.resize = function () {
            canvas.style.width = "100%";
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.update();
        };
        return GameScene2;
    })(scenes.Scene);
    scenes.GameScene2 = GameScene2;
})(scenes || (scenes = {}));
//# sourceMappingURL=GameScene2.js.map
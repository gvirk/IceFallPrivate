/**
 * The Scenes module is a namespace to reference all scene objects
 * 
 * @module scenes
 */
module scenes {
    /**
     * The Play class is where the main action occurs for the game
     * 
     * @class Play
     * @param havePointerLock {boolean}
     */
    export class Play extends scenes.Scene {
        private havePointerLock: boolean;
        private element: any;

        private blocker: HTMLElement;
        private instructions: HTMLElement;

        private spotLight: SpotLight;

        private groundGeometry: CubeGeometry;
        private groundPhysicsMaterial: Physijs.Material;
        private groundMaterial: PhongMaterial;
        private ground: Physijs.Mesh;
        private groundTexture: Texture;
        private groundTextureNormal: Texture;
        
        private deathGroundGeometry: CubeGeometry;
        private deathGroundPhysicsMaterial: Physijs.Material;
        private deathGroundMaterial: PhongMaterial;
        private deathGround: Physijs.Mesh;
        private deathGroundTexture: Texture;
        private deathGroundTextureNormal: Texture;
        
        private enemyGeometry: SphereGeometry;
        private enemyMaterial: Physijs.Material;
        private enemy: Physijs.Mesh;
        
        // private enemy2Geometry: SphereGeometry;
        // private enemy2Material: Physijs.Material;
        // private enemy2: Physijs.Mesh;
        
        // private enemy3Geometry: SphereGeometry;
        // private enemy3Material: Physijs.Material;
        // private enemy3: Physijs.Mesh;

       private playerGeometry: CubeGeometry;
        private playerMaterial: Physijs.Material;
        private player: Physijs.Mesh;
        
        private player1Geometry: CubeGeometry;
        private player1Material: Physijs.Material;
        private player1: Physijs.Mesh;

        private keyboardControls: objects.KeyboardControls;
        private mouseControls: objects.MouseControls;
        private isGrounded: boolean;

        private coinGeometry: SphereGeometry;
        private coinMaterial: Physijs.Material;
        private coins: Physijs.Mesh[];
        private coinCount: number;

        // private deathPlaneGeometry: CubeGeometry;
        // private deathPlaneMaterial: Physijs.Material;
        // private deathPlane: Physijs.Mesh;

        private velocity: Vector3;
        private prevTime: number;
        private clock: Clock;

        private stage: createjs.Stage;
        private scoreLabel: createjs.Text;
        private livesLabel: createjs.Text;

        /**
         * @constructor
         */
        constructor() {
            super();

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
        private _setupCanvas(): void {
            canvas.setAttribute("width", config.Screen.WIDTH.toString());
            canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
            canvas.style.backgroundColor = "#000000";
            canvas.style.opacity = "0.5";
            canvas.style.position = "absolute";
        }

        /**
         * The initialize method sets up key objects to be used in the scene
         * 
         * @method _initialize
         * @returns void
         */
        private _initialize(): void {
            // initialize score and lives values
            scoreValue = 0;
            livesValue = 5;
            console.log("Initialize score and lives values");

            // Create to HTMLElements
            this.blocker = document.getElementById("blocker");
            this.instructions = document.getElementById("instructions");
            this.blocker.style.display = "block";

            // setup canvas for menu scene
            this._setupCanvas();

            this.coinCount = 5;
            this.prevTime = 0;
            this.stage = new createjs.Stage(canvas);
            this.velocity = new Vector3(0, 0, 0);

            // setup a THREE.JS Clock object
            this.clock = new Clock();

            // Instantiate Game Controls
            this.keyboardControls = new objects.KeyboardControls();
            this.mouseControls = new objects.MouseControls();
        }
        /**
         * This method sets up the scoreboard for the scene
         * 
         * @method setupScoreboard
         * @returns void
         */
        private setupScoreboard(): void {
            // Add Lives Label
            this.livesLabel = new createjs.Text(
                "LIVES: " + livesValue,
                "40px Consolas",
                "#ffffff"
            );
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.livesLabel);
            console.log("Added Lives Label to stage");

            // Add Score Label
            this.scoreLabel = new createjs.Text(
                "SCORE: " + scoreValue,
                "40px Consolas",
                "#ffffff"
            );
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.scoreLabel);
            console.log("Added Score Label to stage");
        }

        /**
         * Add a spotLight to the scene
         * 
         * @method addSpotLight
         * @return void
         */
        private addSpotLight(): void {
            // Spot Light
            this.spotLight = new SpotLight(0xffffff);
            this.spotLight.position.set(20, 40, -15);
            this.spotLight.castShadow = true;
            this.spotLight.intensity = 2;
            this.spotLight.lookAt(new Vector3(0, 10, 5));
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
            this.add(this.spotLight);
            console.log("Added spotLight to scene");
        }
        
        /**
         * Add a background score to the scene
         * 
         * @method sound
         * @return void
         */
        public sound(): void {
            createjs.Sound.stop();
            createjs.Sound.play("game1_background");
            createjs.Sound.volume=0.5;
        }

        /**
         * Add a ground plane to the scene
         * 
         * @method addGround
         * @return void
         */
        private addGround(): void {
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

            this.groundGeometry = new BoxGeometry(32, 1, 32);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.name = "Ground";
            this.add(this.ground);
            console.log("Added Ground to scene");
        }
        
        /**
         * Add a ground plane to the scene
         * 
         * @method addGround
         * @return void
         */
        private addDeathGround(): void {
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

            this.deathGroundGeometry = new BoxGeometry(200, 1, 200);
            this.deathGroundPhysicsMaterial = Physijs.createMaterial(this.deathGroundMaterial, 0, 0);
            this.deathGround = new Physijs.ConvexMesh(this.deathGroundGeometry, this.deathGroundPhysicsMaterial, 0);
            this.deathGround.receiveShadow = true;
            this.deathGround.position.set(0, -15, 0);
            this.deathGround.name = "DeathGround";
            this.add(this.deathGround);
            console.log("Added Death Ground to scene");
        }

        /**
         * Adds the enemy object to the scene
         * 
         * @method addEnemy
         * @return void
         */
        private addEnemy(): void {
            // Enemy Object
            this.enemyGeometry = new SphereGeometry(1, 32, 1);
            this.enemyGeometry.scale(1, 1.5, 1);
            this.enemyMaterial = Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture("../../Assets/images/ice-texture.jpg") }), 0.4, 0);
            this.enemy = new Physijs.SphereMesh(this.enemyGeometry, this.enemyMaterial, 2);
            this.enemy.position.set(0, 60,  Math.floor(Math.random() * 20) - 10);
            this.enemy.castShadow = true;
            this.enemy.name = "Enemy";
            this.add(this.enemy);
            console.log("Added Enemy to Scene");
        }
        
        /**
         * Adds the enemy2 object to the scene
         * 
         * @method addEnemy2
         * @return void
         */
        // private addEnemy2(): void {
        //     // Enemy2 Object
        //     this.enemy2Geometry = new SphereGeometry(1, 32, 1);
        //     this.enemy2Geometry.scale(1, 1.5, 1);
        //     this.enemy2Material = Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture("../../Assets/images/ice-texture.jpg") }), 0.4, 0);
        //     this.enemy2 = new Physijs.SphereMesh(this.enemy2Geometry, this.enemy2Material, 2);
        //     this.enemy2.position.set(0, 60,  Math.floor(Math.random() * 20) - 10);
        //     this.enemy2.castShadow = true;
        //     this.enemy2.name = "Enemy2";
        //     this.add(this.enemy2);
        //     console.log("Added Enemy2 to Scene");
        // }
        
        /**
         * Adds the enemy3 object to the scene
         * 
         * @method addEnemy3
         * @return void
         */
        // private addEnemy3(): void {
        //     // Enemy3 Object
        //     this.enemy3Geometry = new SphereGeometry(1, 32, 1);
        //     this.enemy3Geometry.scale(1, 1.5, 1);
        //     this.enemy3Material = Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture("../../Assets/images/ice-texture.jpg") }), 0.4, 0);
        //     this.enemy3 = new Physijs.SphereMesh(this.enemy3Geometry, this.enemy3Material, 2);
        //     this.enemy3.position.set(0, 60,  Math.floor(Math.random() * 20) - 10);
        //     this.enemy3.castShadow = true;
        //     this.enemy3.name = "Enemy3";
        //     this.add(this.enemy3);
        //     console.log("Added Enemy3 to Scene");
        // }

        /**
         * Adds the player controller to the scene
         * 
         * @method addPlayer
         * @return void
         */
        private addPlayer(): void {
            // Player Object
            this.playerGeometry = new BoxGeometry(1.5,3,1.5);
            this.playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);

            this.player = new Physijs.BoxMesh(this.playerGeometry, this.playerMaterial, 1);
            this.player.position.set(0, 10, -100);
            this.player.rotation.set(0, 3.14159, 0);
            this.player.receiveShadow = true;
            this.player.castShadow = true;
            this.player.name = "Player";
            
            
            // Player left arm Object
            this.player1Geometry = new BoxGeometry(2,.5,.5);
            this.player1Material = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
            this.player1 = new Physijs.BoxMesh(this.player1Geometry, this.player1Material, 1);
            this.player1.position.set(-1,0,0);
            this.player1.rotation.set(0, 3.14159, 0);
            this.player1.receiveShadow = true;
            this.player1.castShadow = true;
            this.player1.name = "Player";
            this.player.add(this.player1);
            
            // Player right arm Object
            this.player1Geometry = new BoxGeometry(2,.5,.5);
            this.player1Material = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
            this.player1 = new Physijs.BoxMesh(this.player1Geometry, this.player1Material, 1);
            this.player1.position.set(1,0,0);
            this.player1.rotation.set(0, 3.14159, 0);
            this.player1.receiveShadow = true;
            this.player1.castShadow = true;
            this.player1.name = "Player";
            this.player.add(this.player1);
            
            
            this.add(this.player);
            console.log("Added Player to Scene");
        }

        /**
         * Add the death plane to the scene
         * 
         * @method addDeathPlane
         * @return void
         */
        // private addDeathPlane(): void {
        //     this.deathPlaneGeometry = new BoxGeometry(200, 1, 200);
        //     this.deathPlaneMaterial = Physijs.createMaterial(new MeshBasicMaterial({ color: 0xff0000 }), 0.4, 0.6);
        //     // make deathPlane invisible during play - comment out next two lines during debugging
        //     this.deathPlaneMaterial.transparent = true;
        //     this.deathPlaneMaterial.opacity = 0;

        //     this.deathPlane = new Physijs.BoxMesh(this.deathPlaneGeometry, this.deathPlaneMaterial, 0);
        //     this.deathPlane.position.set(0, -10, 0);
        //     this.deathPlane.name = "DeathPlane";
        //     this.add(this.deathPlane);
        // }

        /**
         * This method adds a coin to the scene
         * 
         * @method addCoinMesh
         * @return void
         */
        private addCoinMesh(): void {
            var self = this;

            this.coins = new Array<Physijs.Mesh>(); // Instantiate a convex mesh array
            
            this.coinGeometry = new SphereGeometry(1, 32, 32);
            this.coinGeometry.scale(1, 0.5, 1);
            this.coinMaterial = Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture("../../Assets/images/DarkAntiqueGold.jpg") }), 0.4, 0);
            for (var count: number = 0; count < self.coinCount; count++) {           
                this.coins[count] = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
                this.setCoinPosition(this.coins[count]);
                this.coins[count].castShadow = true;
                this.coins[count].name = "Coin";
                this.add(this.coins[count]);
                console.log("Added coins " + count + " to Scene");
            }

            // var coinLoader = new THREE.JSONLoader().load("../../Assets/imported/coin.json", function(geometry: THREE.Geometry) {
            //     var phongMaterial = new PhongMaterial({ color: 0xE7AB32 });
            //     phongMaterial.emissive = new THREE.Color(0xE7AB32);

            //     var coinMaterial = Physijs.createMaterial((phongMaterial), 0.4, 0.6);

            //     for (var count: number = 0; count < self.coinCount; count++) {
            //         self.coins[count] = new Physijs.ConvexMesh(geometry, coinMaterial);
            //         self.coins[count].receiveShadow = true;
            //         self.coins[count].castShadow = true;
            //         self.coins[count].name = "Coin";
            //         self.setCoinPosition(self.coins[count]);
            //         console.log("Added Coin " + count + " to the Scene");
            //     }
            // });
        }

        /**
         * This method randomly sets the coin object's position
         * 
         * @method setCoinPosition
         * @return void
         */
        private setCoinPosition(coin: Physijs.Mesh): void {
            var randomPointX: number = Math.floor(Math.random() * 20) - 10;
            var randomPointZ: number = Math.floor(Math.random() * 20) - 10;
            coin.position.set(randomPointX, 10, randomPointZ);
            this.add(coin);
        }

        /**
         * Event Handler method for any pointerLockChange events
         * 
         * @method pointerLockChange
         * @return void
         */
        pointerLockChange(event): void {
            if (document.pointerLockElement === this.element) {
                // enable our mouse and keyboard controls
                this.keyboardControls.enabled = true;
                this.mouseControls.enabled = true;
                this.blocker.style.display = 'none';
            } else {
                if (livesValue <= 0) {
                    this.blocker.style.display = 'none';
                    document.removeEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                    document.removeEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                    document.removeEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
                } else {
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
        }

        /**
         * Event handler for PointerLockError
         * 
         * @method pointerLockError
         * @return void
         */
        private pointerLockError(event): void {
            this.instructions.style.display = '';
            console.log("PointerLock Error Detected!!");
        }

        // Check Controls Function

        /**
         * This method updates the player's position based on user input
         * 
         * @method checkControls
         * @return void
         */
        private checkControls(): void {
            if (this.keyboardControls.enabled) {
                this.velocity = new Vector3();

                var time: number = performance.now();
                var delta: number = (time - this.prevTime) / 1000;

                if (this.isGrounded) {
                    var direction = new Vector3(0, 0, 0);
                    if (this.keyboardControls.moveForward) {
                        this.velocity.z -= 400.0 * delta;
                    }
                    if (this.keyboardControls.moveLeft) {
                        this.velocity.x -= 400.0 * delta;
                    }
                    if (this.keyboardControls.moveBackward) {
                        this.velocity.z += 400.0 * delta;
                    }
                    if (this.keyboardControls.moveRight) {
                        this.velocity.x += 400.0 * delta;
                    }
                    if (this.keyboardControls.jump) {
                        this.velocity.y += 4000.0 * delta;
                        if (this.player.position.y > 4) {
                            this.isGrounded = false;
                            createjs.Sound.play("jump");
                        }
                    }
                    if (this.keyboardControls.nextLevel) {
                        currentScene = config.Scene.INSTRUCTION2;
                        changeScene();
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

                } // isGrounded ends

                //reset Pitch and Yaw
                this.mouseControls.pitch = 0;
                this.mouseControls.yaw = 0;

                this.prevTime = time;
            } // Controls Enabled ends
            else {
                this.player.setAngularVelocity(new Vector3(0, 0, 0));
            }
        }
        
        /**
         * Have the enemy look at the player
         * 
         * @method enemyLook
         * @remove void
         */
        private enemyMoveAndLook(): void {
            this.enemy.lookAt(this.player.position);
            var direction = new Vector3(0, 0, 5);
            direction.applyQuaternion(this.enemy.quaternion);
            this.enemy.applyCentralForce(direction);
        }
        
        /**
         * Have the enemy2 look at the player
         * 
         * @method enemy2Look
         * @remove void
         */
        // private enemy2MoveAndLook(): void {
        //     this.enemy2.lookAt(this.player.position);
        //     var direction = new Vector3(0, 0, 5);
        //     direction.applyQuaternion(this.enemy2.quaternion);
        //     this.enemy2.applyCentralForce(direction);
        // }
        
        /**
         * Have the enemy3 look at the player
         * 
         * @method enemy3Look
         * @remove void
         */
        // private enemy3MoveAndLook(): void {
        //     this.enemy3.lookAt(this.player.position);
        //     var direction = new Vector3(0, 0, 5);
        //     direction.applyQuaternion(this.enemy3.quaternion);
        //     this.enemy3.applyCentralForce(direction);
        // }

        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++

        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */
        public start(): void {
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

                this.instructions.addEventListener('click', () => {

                    // Ask the user for pointer lock
                    console.log("Requesting PointerLock");

                    this.element.requestPointerLock = this.element.requestPointerLock ||
                        this.element.mozRequestPointerLock ||
                        this.element.webkitRequestPointerLock;

                    this.element.requestPointerLock();
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
            
            // Death Ground Object
            this.addDeathGround();

            // Add Enemy Object
            this.addEnemy();
            
            // Add Enemy2 Object
            // this.addEnemy2();
            
             // Add Enemy3 Object
            // this.addEnemy3();

            // Add player controller
            this.addPlayer();

            // Add custom coin imported from Blender
            this.addCoinMesh();

            // Add death plane to the scene
            // this.addDeathPlane();

            // Collision Check with player
            this.player.addEventListener('collision', function(eventObject) {
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
                    if(scoreValue===500)
                    {
                        currentScene = config.Scene.INSTRUCTION2;
                        changeScene();
                    }
                }
                
                if (eventObject.name === "DeathGround") {
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
                    } else {
                        // otherwise reset my player and update Lives
                        self.livesLabel.text = "LIVES: " + livesValue;
                        self.remove(self.player);
                        self.player.position.set(0, 30, 10);
                        self.player.rotation.set(0, 0, 0);
                        self.add(self.player);
                    }
                }
                
                if(eventObject.name === "Enemy" || eventObject.name === "Enemy2" || eventObject.name === "Enemy3") {
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
                    } else {
                        // otherwise reset my player and update Lives
                        self.livesLabel.text = "LIVES: " + livesValue;
                        self.remove(self.player);
                        self.player.position.set(0, 30, 10);
                        self.player.rotation.set(0, 0, 0);
                        self.add(self.player);
                    }
                }
               
            }.bind(self));
            
            // Collision check for DeathPlane
            this.deathGround.addEventListener('collision', function(otherObject){
                
                // if a coin falls off the ground, reset
                if (otherObject.name === "Coin") {
                    this.remove(otherObject);
                    this.setCoinPosition(otherObject);
                }
                
                // if the enemy falls off the ground, reset
                if(otherObject.name === "Enemy") {
                    self.remove(otherObject);
                    self.enemy.position.set(0, 60,  Math.floor(Math.random() * 50) - 10);
                    self.add(self.enemy);
                    self.enemy.setLinearVelocity(new Vector3(0, 0, 0));
                    self.enemyMoveAndLook();
                }
                
                // // if the enemy2 falls off the ground, reset
                // if(otherObject.name === "Enemy2") {
                //     self.remove(otherObject);
                //     self.enemy2.position.set( 0, 60,  Math.floor(Math.random() * 20) - 10);
                //     self.add(self.enemy2);
                //     self.enemy2.setLinearVelocity(new Vector3(0, 0, 0));
                //     self.enemy2MoveAndLook();
                // }
                
                // // if the enemy3 falls off the ground, reset
                // if(otherObject.name === "Enemy3") {
                //     self.remove(otherObject);
                //     self.enemy3.position.set(0, 60,  Math.floor(Math.random() * 20) - 10);
                //     self.add(self.enemy3);
                //     self.enemy3.setLinearVelocity(new Vector3(0, 0, 0));
                //     self.enemy3MoveAndLook();
                // }
            }.bind(self));
            
            // Collision check for Ground
            this.ground.addEventListener('collision', function(otherObject){
                
                // if the enemy falls on the the ground, reset
                if(otherObject.name === "Enemy") {
                    self.remove(otherObject);
                    createjs.Sound.play("ice_hit");
                    self.enemy.position.set(0, 60,  Math.floor(Math.random() * 50) - 10);
                    self.add(self.enemy);
                    self.enemy.setLinearVelocity(new Vector3(0, 0, 0));
                    self.enemyMoveAndLook();
                }
                
                // // if the enemy2 falls on the ground, reset
                // if(otherObject.name === "Enemy2") {
                //     self.remove(otherObject);
                //     createjs.Sound.play("ice_hit");                    
                //     self.enemy2.position.set( 0, 60,  Math.floor(Math.random() * 20) - 10);
                //     self.add(self.enemy2);
                //     self.enemy2.setLinearVelocity(new Vector3(0, 0, 0));
                //     self.enemy2MoveAndLook();
                // }
                
                // // if the enemy3 falls on the ground, reset
                // if(otherObject.name === "Enemy3") {
                //     self.remove(otherObject);
                //     createjs.Sound.play("ice_hit");                    
                //     self.enemy3.position.set(0, 60,  Math.floor(Math.random() * 20) - 10);
                //     self.add(self.enemy3);
                //     self.enemy3.setLinearVelocity(new Vector3(0, 0, 0));
                //     self.enemy3MoveAndLook();
                // }
            }.bind(self));
            
            // create parent-child relationship with camera and player
            
            camera.rotation.set(-0.45, 0, 0);
            camera.position.set(0, 15, 20);
            this.player.add(camera);

            this.simulate();
        }

        /**
         * Camera Look function
         * 
         * @method cameraLook
         * @return void
         */
        private cameraLook(): void {
            var zenith: number = THREE.Math.degToRad(-20);
            var nadir: number = THREE.Math.degToRad(-20);

            var cameraPitch: number = camera.rotation.x + this.mouseControls.pitch;

            // Constrain the Camera Pitch
            camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
        }

        /**
         * @method update
         * @returns void
         */
        public update(): void {

            this.coins.forEach(coin => {
                coin.setAngularFactor(new Vector3(0, 0, 0));
                coin.setAngularVelocity(new Vector3(0, 1, 0));
            });

            this.checkControls();

            this.enemyMoveAndLook();
            //this.enemy2MoveAndLook();
            //this.enemy3MoveAndLook();            

            this.stage.update();

            if (!this.keyboardControls.paused) {
                this.simulate();
            }
        }

        /**
         * Responds to screen resizes
         * 
         * @method resize
         * @return void
         */
        public resize(): void {
            canvas.style.width = "100%";
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.update();
        }
    }
}
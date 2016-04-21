/**
 * @module scenes
 */
module scenes {
    /**
     * Menu Scene extends scenes.Scene superclass is used to
     * create a custom menu for the THREEJS Game
     * 
     * @class Menu
     * @extends scene.Scene
     * @param blocker {HTMLElement}
     * @param _stage {createjs.Stage}
     * @param _gameLabel {createjs.Text}
     * @param _startButton {createjs.Bitmap}
     * @param _exitButton {createjs.Bitmap}
     */
    export class Menu extends scenes.Scene {
        private _blocker: HTMLElement;
        private _stage: createjs.Stage;
        private _gameLabel: createjs.Text;
        private _startButton: createjs.Bitmap;
        private _exitButton: createjs.Bitmap;
        

        private spotLight: SpotLight;

        private coinGeometry: Geometry;
        private coinMaterial: Physijs.Material;
        private coins: Physijs.ConcaveMesh[];
        private coinCount: number;
        private backgroundScore: createjs.AbstractSoundInstance;

        /**
         * Empty Constructor - calls _initialize and start methods
         * 
         * @constructor
         */
        constructor() {
            super();

            this._initialize();
            this.start();
        }

        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++++++

        private _setupCanvas(): void {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#ffffff";
            canvas.style.opacity = "0.5";
            canvas.style.position = "absolute";
        }

        /**
         * This method sets up default values for class member variables
         * and objects
         * 
         * @method _initialize
         * @return void
         */
        private _initialize(): void {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";

            // setup canvas for menu scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);

            this.coinCount = 1;
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
            this.spotLight.position.set(0, 0, -20);
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
            this.backgroundScore=createjs.Sound.play("menu");
            this.backgroundScore.volume=0.5;
            this.backgroundScore.loop=-1;
        }

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
            this.coinGeometry.scale(1, 1, 1);
            this.coinMaterial = Physijs.createMaterial(new LambertMaterial({ map: THREE.ImageUtils.loadTexture("../../Assets/images/CompanyLogoF.jpg") }), 0.4, 0);
            for (var count: number = 0; count < self.coinCount; count++) {           
                this.coins[count] = new Physijs.SphereMesh(this.coinGeometry, this.coinMaterial, 2);
                this.coins[count].position.set(0,2.5,0);
                this.coins[count].castShadow = true;
                this.coins[count].name = "Coin";
                this.add(this.coins[count]);
                console.log("Added coins " + count + " to Scene");
            }
        }

        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++++++

        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */
        public start(): void {
            // Scene changes for Physijs
            this.name = "Menu Scene";
            this.setGravity(new THREE.Vector3(0, 0, 0));
            
            this.sound();
            
            // Add Game Label
            this._gameLabel = new createjs.Text(
                " ICE FALL",
                "130px Indie Flower",
                "#000000");
            this._gameLabel.regX = this._gameLabel.getMeasuredWidth() * 0.5;
            this._gameLabel.regY = this._gameLabel.getMeasuredLineHeight() * 0.5;
            this._gameLabel.x = config.Screen.WIDTH * 0.5;
            this._gameLabel.y = config.Screen.HEIGHT * 0.5;
            this._stage.addChild(this._gameLabel);
            console.log("Added Game Label to the scene");
            
            this._gameLabel = new createjs.Text(
                " GV Games",
                "20px Indie Flower",
                "#000000");
            this._gameLabel.regX = this._gameLabel.getMeasuredWidth() * 0.5;
            this._gameLabel.regY = this._gameLabel.getMeasuredLineHeight() * 0.5;
            this._gameLabel.x = config.Screen.WIDTH * 0.5;
            this._gameLabel.y = config.Screen.HEIGHT * 0.4;
            this._stage.addChild(this._gameLabel);
            console.log("Added Game Label to the scene");

            // Add Start Button
            this._startButton = new createjs.Bitmap(assets.getResult("StartButton"));
            this._startButton.regX = this._startButton.getBounds().width * 1;
            this._startButton.regY = this._startButton.getBounds().height * 0.2;
            this._startButton.x = config.Screen.WIDTH * 0.5;
            this._startButton.y = (config.Screen.HEIGHT * 0.5) + 100;
            this._stage.addChild(this._startButton);
            console.log("Added Start Button to the Scene");

            this._startButton.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });

            this._startButton.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });

            this._startButton.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.INSTRUCTION1;
                changeScene();
            });
            
            // Add exit Button
            this._exitButton = new createjs.Bitmap(assets.getResult("ExitButton"));
            this._exitButton.regX = this._exitButton.getBounds().width * 0;
            this._exitButton.regY = this._exitButton.getBounds().height * 0.2;
            this._exitButton.x = config.Screen.WIDTH * 0.5;
            this._exitButton.y = (config.Screen.HEIGHT * 0.5) + 100;
            this._stage.addChild(this._exitButton);
            console.log("Added exit Button to the Scene");

            this._exitButton.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });

            this._exitButton.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });

            this._exitButton.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.EXIT;
                changeScene();
            });

            // Add Spot Light to the scene
            this.addSpotLight();

            // Add custom coin imported from Blender
            this.addCoinMesh();

            camera.position.set(0, 0, -20);
            camera.lookAt(new Vector3(0, 0, 0));
        }

        /**
         * The update method updates the animation loop and other objects
         * 
         * @method update
         * @return void
         */
        public update(): void {
            this.coins.forEach(coin => {
                coin.setAngularFactor(new Vector3(0, 0, 0));
                coin.setAngularVelocity(new Vector3(0, 1, 0));
            });
            
            this._stage.update();
            
            this.simulate();
        }

        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         * 
         * @method resize
         * @return void
         */
        public resize(): void {
            this._setupCanvas();
        }
    }
}
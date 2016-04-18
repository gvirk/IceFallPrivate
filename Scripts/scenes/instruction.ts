/**
 * @module scenes
 * 
 */

module scenes {
    /**
     * Instruction Scene extends scenes.Scene superclass is used to
     * create a custom instruction for the THREEJS Game
     * 
     * @class Instruction
     * @extends scene.Scene
     * @param blocker {HTMLElement}
     * @param _stage {createjs.Stage}
     * @param _gameLabel {createjs.Text}
     * @param _startButton {createjs.Bitmap}
     */
    export class Instruction extends scenes.Scene {
        private _blocker: HTMLElement;
        private _stage: createjs.Stage;
        private _instructionPanel: createjs.Bitmap;
        private _backButton: createjs.Bitmap;


        private spotLight: SpotLight;

        private coinGeometry: Geometry;
        private coinMaterial: Physijs.Material;
        private coins: Physijs.ConcaveMesh[];
        private coinCount: number;

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
            canvas.style.backgroundColor = "#000000";
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

            // setup canvas for Instruction scene
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
            this.spotLight.position.set(20, 40, -15);
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
            createjs.Sound.play("game1_background");
            createjs.Sound.volume=0.5;
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
            this.name = "Instruction Scene";
            this.setGravity(new THREE.Vector3(0, 0, 0));
            this.sound();
            //Adding Instruction sound
            // createjs.Sound.stop();
            // createjs.Sound.play("instruction");



            console.log("Added InstructionPanel to the Scene");
            // Add Company Logo
            this._instructionPanel = new createjs.Bitmap(assets.getResult("InstructionPanel"));
            this._instructionPanel.regX = this._instructionPanel.getBounds().width * 0.5;
            this._instructionPanel.regY = this._instructionPanel.getBounds().height * 0.5;
            this._instructionPanel.x = config.Screen.WIDTH * 0.5;
            this._instructionPanel.y = (config.Screen.HEIGHT * 0.45);
            this._stage.addChild(this._instructionPanel);
            console.log("Added InstructionPanel to the Scene");

            // Add Start Button
            this._backButton = new createjs.Bitmap(assets.getResult("BackButton"));
            this._backButton.regX = this._backButton.getBounds().width * 0.5;
            this._backButton.regY = this._backButton.getBounds().height * 0.5;
            this._backButton.x = config.Screen.WIDTH * 0.5;
            this._backButton.y = (config.Screen.HEIGHT * 0.9);
            this._stage.addChild(this._backButton);
            console.log("Added Start Button to the Scene");



            this._backButton.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });

            this._backButton.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1;
            });

            this._backButton.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.MENU;
                changeScene();
            });


            // Add Spot Light to the scene
            this.addSpotLight();



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
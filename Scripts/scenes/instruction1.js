var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @module scenes
 *
 */
var scenes;
(function (scenes) {
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
    var Instruction1 = (function (_super) {
        __extends(Instruction1, _super);
        /**
         * Empty Constructor - calls _initialize and start methods
         *
         * @constructor
         */
        function Instruction1() {
            _super.call(this);
            this._initialize();
            this.start();
        }
        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++++++
        Instruction1.prototype._setupCanvas = function () {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#000000";
            canvas.style.opacity = "0.5";
            canvas.style.position = "absolute";
        };
        /**
         * This method sets up default values for class member variables
         * and objects
         *
         * @method _initialize
         * @return void
         */
        Instruction1.prototype._initialize = function () {
            // initialize score and lives values
            scoreValue = 0;
            livesValue = 5;
            console.log("Initialize score and lives values");
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";
            // setup canvas for Instruction scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
        };
        /**
         * Add a spotLight to the scene
         *
         * @method addSpotLight
         * @return void
         */
        Instruction1.prototype.addSpotLight = function () {
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
        };
        /**
         * Add a background score to the scene
         *
         * @method sound
         * @return void
         */
        Instruction1.prototype.sound = function () {
            createjs.Sound.stop();
            createjs.Sound.play("instructionsbg");
            createjs.Sound.volume = 0.5;
        };
        Instruction1.prototype.setupScoreboard = function () {
            // Add Lives Label
            this.livesLabel = new createjs.Text("LIVES: ", "40px Consolas", "#ffffff");
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this._stage.addChild(this.livesLabel);
            console.log("Added Lives Label to stage");
            // Add Score Label
            this.scoreLabel = new createjs.Text("SCORE: ", "40px Consolas", "#ffffff");
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this._stage.addChild(this.scoreLabel);
            console.log("Added Score Label to stage");
        };
        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++++++
        /**
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        Instruction1.prototype.start = function () {
            // setup the class context to use within events
            var self = this;
            this.sound();
            // Set Up Scoreboard
            this.setupScoreboard();
            // Scene changes for Physijs
            this.name = "Instruction Scene 1";
            this.setGravity(new THREE.Vector3(0, 0, 0));
            console.log("Added InstructionPanel to the Scene");
            // Add Company Logo
            this._instructionPanel = new createjs.Bitmap(assets.getResult("InstructionPanel1"));
            this._instructionPanel.regX = this._instructionPanel.getBounds().width * 0.5;
            this._instructionPanel.regY = this._instructionPanel.getBounds().height * 0.5;
            this._instructionPanel.x = config.Screen.WIDTH * 0.5;
            this._instructionPanel.y = (config.Screen.HEIGHT * 0.5);
            this._stage.addChild(this._instructionPanel);
            console.log("Added InstructionPanel to the Scene");
            // Add Start Button
            this._playButton = new createjs.Bitmap(assets.getResult("StartButton"));
            this._playButton.regX = this._playButton.getBounds().width * 0.5;
            this._playButton.regY = this._playButton.getBounds().height * 0.5;
            this._playButton.x = config.Screen.WIDTH * 0.25;
            this._playButton.y = (config.Screen.HEIGHT * 0.9);
            this._stage.addChild(this._playButton);
            console.log("Added Start Button to the Scene");
            // Add Back Button
            this._backButton = new createjs.Bitmap(assets.getResult("BackButton"));
            this._backButton.regX = this._backButton.getBounds().width * 0.5;
            this._backButton.regY = this._backButton.getBounds().height * 0.5;
            this._backButton.x = config.Screen.WIDTH * 0.75;
            this._backButton.y = (config.Screen.HEIGHT * 0.9);
            this._stage.addChild(this._backButton);
            console.log("Added Back Button to the Scene");
            this._playButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._playButton.on("mouseout", function (event) {
                event.target.alpha = 1;
            });
            this._playButton.on("click", function (event) {
                currentScene = config.Scene.PLAY;
                changeScene();
            });
            this._backButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._backButton.on("mouseout", function (event) {
                event.target.alpha = 1;
            });
            this._backButton.on("click", function (event) {
                currentScene = config.Scene.MENU;
                changeScene();
            });
            // Add Spot Light to the scene
            this.addSpotLight();
            camera.position.set(0, 0, -20);
            camera.lookAt(new Vector3(0, 0, 0));
        };
        /**
         * The update method updates the animation loop and other objects
         *
         * @method update
         * @return void
         */
        Instruction1.prototype.update = function () {
            this._stage.update();
            this.simulate();
        };
        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         *
         * @method resize
         * @return void
         */
        Instruction1.prototype.resize = function () {
            canvas.style.width = "100%";
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this._stage.update();
        };
        return Instruction1;
    })(scenes.Scene);
    scenes.Instruction1 = Instruction1;
})(scenes || (scenes = {}));
//# sourceMappingURL=instruction1.js.map
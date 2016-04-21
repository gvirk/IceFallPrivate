var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var scenes;
(function (scenes) {
    /**
     * This class instantiates the game over scene object
     *
     * @class Over
     * @extends scenes.Scene
     */
    var Over = (function (_super) {
        __extends(Over, _super);
        /**
         * Empty Contructor
         *
         * @constructor
         */
        function Over() {
            _super.call(this);
            this._initialize();
            this.start();
        }
        /**
         * Sets up a reference to the canvas HTML Element
         *
         * @method _setupCanvas
         * @return void
         */
        Over.prototype._setupCanvas = function () {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#000000";
            canvas.style.opacity = "0.8";
            canvas.style.position = "absolute";
        };
        /**
         * This method sets up default values for class member variables
         * and objects
         *
         * @method _initialize
         * @return void
         */
        Over.prototype._initialize = function () {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";
            // setup canvas for menu scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
        };
        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++
        /**
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        Over.prototype.start = function () {
            // Scene changes for Physijs
            this.name = "Game Over Scene";
            this.fog = new THREE.Fog(0xffffff, 0, 750);
            this.setGravity(new THREE.Vector3(0, -10, 0));
            var self = this;
            createjs.Sound.stop();
            createjs.Sound.play("gameOver");
            //check for high score changes
            if (scoreValue > highScoreValue) {
                highScoreValue = scoreValue;
            }
            if (livesValue > 0) {
                createjs.Sound.play("cheers");
                this._gameOverLabel = new createjs.Text("Congratulations", "80px Indie Flower", "#ffffff");
                this._gameOverLabel.regX = this._gameOverLabel.getMeasuredWidth() * 0.5;
                this._gameOverLabel.regY = this._gameOverLabel.getMeasuredLineHeight() * 0.5;
                this._gameOverLabel.x = config.Screen.WIDTH * 0.5;
                this._gameOverLabel.y = (config.Screen.HEIGHT * 0.5) - 100;
                this._stage.addChild(this._gameOverLabel);
            }
            else {
                this._gameOverLabel = new createjs.Text("GAME OVER", "80px Indie Flower", "#ffffff");
                this._gameOverLabel.regX = this._gameOverLabel.getMeasuredWidth() * 0.5;
                this._gameOverLabel.regY = this._gameOverLabel.getMeasuredLineHeight() * 0.5;
                this._gameOverLabel.x = config.Screen.WIDTH * 0.5;
                this._gameOverLabel.y = (config.Screen.HEIGHT * 0.5) - 100;
                this._stage.addChild(this._gameOverLabel);
            }
            this._scoreLabel = new createjs.Text("Your Score: " + scoreValue, "40px Indie Flower", "#ffffff");
            this._scoreLabel.regX = this._scoreLabel.getMeasuredWidth() * 0.5;
            this._scoreLabel.regY = this._scoreLabel.getMeasuredLineHeight() * 0.5;
            this._scoreLabel.x = config.Screen.WIDTH * 0.5;
            this._scoreLabel.y = config.Screen.HEIGHT * 0.5;
            this._stage.addChild(this._scoreLabel);
            this._restartButton = new createjs.Bitmap(assets.getResult("PlayAgainButton"));
            this._restartButton.regX = this._restartButton.getBounds().width * 0.5;
            this._restartButton.regY = this._restartButton.getBounds().height * 0.5;
            this._restartButton.x = config.Screen.WIDTH * 0.5;
            this._restartButton.y = (config.Screen.HEIGHT * 0.5) + 150;
            this._stage.addChild(this._restartButton);
            this._restartButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._restartButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._restartButton.on("click", function (event) {
                scoreValue = 0;
                livesValue = 5;
                currentScene = config.Scene.INSTRUCTION1;
                changeScene();
            });
            camera.position.set(0, 10, -20);
            camera.lookAt(new Vector3(0, 0, 0));
        };
        /**
         * The update method updates the animation loop and other objects
         *
         * @method update
         * @return void
         */
        Over.prototype.update = function () {
            this._stage.update();
            this.simulate();
        };
        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         *
         * @method resize
         * @return void
         */
        Over.prototype.resize = function () {
            this._setupCanvas();
        };
        return Over;
    })(scenes.Scene);
    scenes.Over = Over;
})(scenes || (scenes = {}));
//# sourceMappingURL=over.js.map
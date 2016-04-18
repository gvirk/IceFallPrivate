var config;
(function (config) {
    var Screen = (function () {
        function Screen() {
        }
        Screen.WIDTH = window.innerWidth;
        Screen.HEIGHT = window.innerHeight;
        Screen.RATIO = window.innerWidth / window.innerHeight;
        return Screen;
    })();
    config.Screen = Screen;
    // Scene Constants
    var Scene = (function () {
        function Scene() {
        }
        Scene.MENU = 0;
        Scene.INSTRUCTION1 = 1;
        Scene.INSTRUCTION2 = 2;
        Scene.INSTRUCTION3 = 3;
        Scene.PLAY = 4;
        Scene.GAMESCENE2 = 5;
        Scene.GAMESCENE3 = 6;
        Scene.OVER = 7;
        Scene.EXIT = 8;
        return Scene;
    })();
    config.Scene = Scene;
})(config || (config = {}));
//# sourceMappingURL=screen.js.map
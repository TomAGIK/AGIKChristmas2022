// Import constants
import { dimensions, screenSize } from "./constants/dimensions.js";
import { textStyles } from "./constants/textStyles.js";

// Import functions
import { getLeft } from "./utilityFunctions/getLeft.js";
import { getRight } from "./utilityFunctions/getRight.js";
import { getTop } from "./utilityFunctions/getTop.js";
import { getBottom } from "./utilityFunctions/getBottom.js";

// Import classes
import { Screen } from "./classes/Screen.js";

// Import plugins
import { ButtonPlugin } from "./classes/plugins/Button.js";
import { PopupPlugin } from "./classes/plugins/Popup.js";

// Refresh page when resized to a certain threshold
var previousWidth = globalThis.innerWidth;

window.addEventListener('resize', () => {
    if(globalThis.innerWidth >=1024 && previousWidth < 1024) {
        location.reload();
    } else if (globalThis.innerWidth < 1024 && previousWidth >= 1024) {
        location.reload();
    }
    previousWidth = globalThis.innerWidth;
});

// Initialise constants
const config = {
    type: Phaser.AUTO,
    backgroundColor: '#FFF',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: document.getElementById("phaser"),
        // Place the game in the centre of its container
        autoCenter: Phaser.Scale.CENTER_BOTH,
        max: { width: dimensions.x, height: dimensions.y },
        width: dimensions.x,
        height: dimensions.y,
    },
    dom: {
        createContainer: true,
    },
    plugins: {
        global: [{
            key: 'ButtonPlugin',
            plugin: ButtonPlugin,
            start: true
        }, {
            key: 'PopupPlugin',
            plugin: PopupPlugin,
            start: true
        }],
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

// Set different dimensions for mobile and desktop
const constants = (screenSize === 'lg') ? {
    logo1PaddingTop: 10,
    logo1Scale: 0.3,
    gameTitle: "Christmas Smack",
    titleMarginTop: 10,
    playButtonMarginTop: 100,
    instructionsButtonMarginTop: 100,
    instructionsPopupMarginX: 180,
    instructionsPopupMarginY: 80,
} : {
    logo1PaddingTop: 10,
    logo1Scale: 0.3,
    gameTitle: "Christmas\nSmack",
    titleMarginTop: 10,
    playButtonMarginTop: 100,
    instructionsButtonMarginTop: 100,
    instructionsPopupMarginX: 50,
    instructionsPopupMarginY: 80,
}

// Initialise global game variables
var screens = {};
var popups = {};

const game = new Phaser.Game(config);

function preload() {
    // Assign useful dimensions to variables
    this.gameWidth = this.sys.game.canvas.width;
    this.gameHeight = this.sys.game.canvas.height;
    this.center = { x: this.gameWidth/2, y: this.gameHeight/2 }

    // Load images
    this.load.image("logo", "../images/Logo.png");

}

function create() {

    // Create screen objects and children
    screens = {
        introScreen: new Screen(this, 0, 0, initIntroScreenChildren(this)),
    }

    // Create all popups
    popups = {
        instructions: this.add.popup(0, 0, initInstructionsPopup(this)),
    }

    startGame();
}

function update() {}

function initIntroScreenChildren(scene) {
    var objects = {};

    // AGIK Logo
    objects["logo"] = scene.add.image(0, 0, "logo").setScale(constants.logo1Scale).setOrigin(0.5, 0);
    objects["logo"].setPosition(scene.center.x, getTop(objects["logo"]) + constants.logo1PaddingTop);

    // Game title
    objects["title"] = scene.add.text(scene.center.x, getBottom(objects["logo"])+constants.titleMarginTop, constants.gameTitle, textStyles.titleBlue1).setOrigin(0.5, 0);

    // Play button
    objects["playBtn"] = scene.add.button(scene.center.x, getBottom(objects["title"])+constants.playButtonMarginTop, "PLAY", textStyles.bodyWhite);

    // How To Play button
    objects["instructionsBtn"] = scene.add.button(scene.center.x, getBottom(objects["playBtn"])+constants.instructionsButtonMarginTop, "HOW TO PLAY", textStyles.bodyWhite);
    // Show instructions popup on click
    objects["instructionsBtn"].on('pointerup', () => popups.instructions.setVisible(true));

    return objects;
}

function initInstructionsPopup(scene) {
    var objects = {};

    // White background
    objects["bg"] = scene.add.rectangle(scene.center.x, scene.center.y, scene.gameWidth - 2*constants.instructionsPopupMarginX, scene.gameHeight - 2*constants.instructionsPopupMarginY, 0xffffff)

    return objects;
}

function startGame() {
    // Hide everything except the start screen
    Object.keys(screens).forEach(screen => screens[screen].setVisible(false));
    Object.keys(popups).forEach(popup => popups[popup].setVisible(false));
    screens["introScreen"].setVisible(true);
}

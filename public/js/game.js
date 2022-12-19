// Import constants
import { dimensions, screenSize } from "./constants/dimensions.js";
import { textStyles } from "./constants/textStyles.js";
import { colours } from "./constants/colours.js";

// Import functions
import { getLeft } from "./utilityFunctions/getLeft.js";
import { getRight } from "./utilityFunctions/getRight.js";
import { getTop } from "./utilityFunctions/getTop.js";
import { getBottom } from "./utilityFunctions/getBottom.js";
import { getRandomInt } from "./utilityFunctions/getRandomInt.js";
import { getRandomNumber } from "./utilityFunctions/getRandomNumber.js";
import { midpoint } from "./utilityFunctions/midpoint.js";

// Import classes
import { API } from "./classes/API.js";
import { Screen } from "./classes/Screen.js";

// Import plugins
import { ButtonPlugin } from "./classes/plugins/Button.js";
import { PopupPlugin } from "./classes/plugins/Popup.js";

// Mole class specific to this game
class Mole extends Phaser.GameObjects.Image {

    constructor(scene, x, y) {

        // Create an image object and add it to the display list
        super(scene, x, y, "gram");
        scene.add.existing(this);

        // Initialise properties
        this.startY = y;
        this.endY = y - constants.moleDisplacement;
        this.visibleTimeout;

        // Resize mole to correct scale and set as interactive
        this.setScale(constants.moleScale).setInteractive({ useHandCursor: false }).setVisible(false);

        // Initialise snow blast animation
        this.whackedAnim = scene.add.sprite(this.x, this.endY, "snowBlast", "0").setScale(constants.animationScale).setDepth(1);
        this.whackedAnim.anims.create({
            key: "whacked",
            frames: animations.snowBlast.frames,
            repeat: 0,
            frameRate: 48,
        });

        // Add event listener
        this.on("pointerdown", this.clicked );

        // Add the intro and outro tween animations
        this.moveUp = scene.tweens.add({
            targets: this,
            props: {
                y: { from: this.startY, to: this.endY, duration: constants.moleAnimationDuration }
            },
            paused: true,
        });
        this.moveDown = scene.tweens.add({
            targets: this,
            props: {
                y: { from: this.endY, to: this.startY, duration: constants.moleAnimationDuration }
            },
            paused: true,
            onComplete: this.timeoutCallback,
        });
    }

    show() {
        //
        // Moves this mole up, shows it for a random time, then hides it
        //

        var timeout; // this holds the time the mole will be shown for

        // Randomise the mole appearance
        this.randomiseTexture();

        // Depending on the stage, hide the mole after a randomly generated number of seconds
        switch(curStage) {
            case 1:
                timeout = getRandomNumber(0.75, 1.5, 2)*1000;
                break;
            case 2:
                timeout = getRandomNumber(0.6, 1.35, 2)*1000;
                break;
            case 3:
                timeout = getRandomNumber(0.65, 0.75, 2)*1000;
                break;
            case 4:
                timeout = getRandomNumber(0.5, 0.7, 2)*1000;
                break;
        }
        this.visibleTimeout = setTimeout(() => { this.hide("timedOut") }, timeout);

        // Show the mole and run the move up animation
        // NOTE: the mole must be set visible AFTER the timeout has been set otherwise the world explodes
        this.setVisible(true);
        this.moveUp.play();
    }

    hide(reason) {
        //
        // Hides the mole in different ways depending on
        // the 'reason' the mole needs to be hidden
        //

        switch (reason) {
            case "timedOut":
                // Animate the mole out if it hasn't been clicked fast enough
                this.moveDown.play();
                break;
            case "reset":
                // Reset mole position and animations on game end
                this.reset();
                break;
            case "whacked":
                // Play whacked sounds and animation
                audio.effects.successfulWhack.play();
                this.whackedAnim.play("whacked");

                // Reset mole position and animations
                this.reset();

                // Show another mole after a small randomised timeout
                this.visibleTimeout = setTimeout(showMole, getRandomNumber(0.2, 0.5, 1)*1000);
                break;
        }
    }

    timeoutCallback(tween, targets) {
        //
        // Hide this mole and show another after the down animation has completed
        //

        targets[0].setVisible(false);
        showMole();
    }

    reset() {
        //
        // Reset mole animations, timeouts, and position
        //

        // Clears the current timeout if present
        clearTimeout(this.visibleTimeout);

        // Trying to stop a tween that hasn't started caused issues, so
        // play the tweens if they haven't run yet, then stop them
        if (!this.moveDown.hasStarted) { this.moveDown.play(); }
        this.moveDown.stop();
        if (!this.moveUp.hasStarted) { this.moveUp.play(); }
        this.moveUp.stop();

        // Reset the mole position, and hide it
        this.setPosition(this.x, this.startY);
        this.setVisible(false);
    }

    clicked() {
        //
        // Update the player score, and hide the mole
        //

        // The texture key maps to the points object
        updateScore(textures[this.texture.key].points);

        this.hide("whacked");

    }

    randomiseTexture() {
        //
        // Randomises the mole texture based on the keys and probabilities
        // contained in the textures object
        //

        // Initialise variables
        var prob = Math.random();
        var cumulativeProbs = 0;
        var newTexture;

        // Set the new texture based on the probabilities in the textures object
        Object.keys(textures).some(texture => {
            cumulativeProbs += textures[texture].probability;
            if (prob <= cumulativeProbs) {
                newTexture = texture;
                return true;
            }
        });

        this.setTexture(newTexture);
    }

}

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
    audio: {
        disableWebAudio: true
    },
};

// Set different constants for mobile and desktop
const constants = (screenSize === 'lg') ? {
    // Links
    startScreenBg: "../images/desktopStartScreenBackground.png",
    instructionsBg: "../images/desktopHTPBackground.png",
    popupBg: "../images/desktopHTPTextBg.png",
    mainBg: "../images/mainBg/1 top.png",
    mainBgSections: ["../images/mainBg/2 top-mid.png", "../images/mainBg/3 mid.png", "../images/mainBg/4 bot.png"],
    addLeaderboardEntryBg: "../images/desktopAddLeaderboardBg.png",
    addLeaderboardEntryPopupBg: "../images/leaderboard-details.png",
    addLeaderboardHTML: "../html/inputs/desktopAddLeaderboardEntry.html",
    gameOverBg: "../images/desktopGameOverBackground.png",

    // Start screen
    playBtnPointerOverTexture: "playHover",
    playBtnOffsetY: 175,
    instructionsBtnPointerOverTexture: "instructionsHover",
    instructionsBtnMarginTop: 140,

    // Game instructions
    gameInstructionsPt1: `Different things will pop up out of holes, and you must bash them to gain points.\n\nYou will have 30 seconds to gain as many points as you can.`,
    gameInstructionsPt2: `Be careful though! if you smack\nsanta you will lose`,
    gameInstructionsPt3: `200pts`,
    instructionBlueTextStyle: textStyles.instructionsBlue,
    instruction2BlueTextStyle: textStyles.instructionsBlue2,
    instructionRedTextStyle: textStyles.instructionsRed,
    closeBtnPointerOverTexture: "closeHover",
    closeBtnMarginTop: 75,
    closeBtnMarginRight: 120,
    instructionTextPt1OffsetY: 300,
    instructionTextPt2OffsetY: 825,
    instructionTextPt2OffsetX: 30,
    instructionTextPt3OffsetY: 870,
    instructionTextPt3OffsetX: 212,

    // Main game
    stage1End: 25,
    stage2End: 20,
    stage3End: 10,
    moleCoordinates: [
        [[475, 720], [800, 720], [1120, 720], [1445, 720]],
        [[410, 875], [780, 875], [1140, 875], [1510, 875]],
        [[335, 1040], [750, 1040], [1170, 1040], [1585, 1040]],
    ],
    moleScale: 1,
    scoreTextPaddingTop: 265,
    scoreTextPaddingLeft: 340,
    timerTextPaddingTop: 265,
    timerTextPaddingLeft: 1460,
    gameHitZonePoints: [[200, 435], [1720, 435], [1930, 1080], [-10, 1080]],
    scoreOriginX: 0.5,
    moleDisplacement: 130,
    hammerScale: 0.75,
    animationScale: 18,
    moleAnimationDuration: 500,

    // Input leaderboard data
    addLeaderboardEntryPopupLocation: { x: 1920/2, y: 1080/2 },
    addLeaderboardEntryPopupScale: 0.9583,
    skipBtnMarginLeft: 675,
    submitBtnMarginLeft: 1225,
    submitSkipBtnsMarginTop: 865,
    submitBtnScale: 1,
    submitBtnPointerOverTexture: "submitHover",
    skipBtnScale: 1,
    skipBtnPointerOverTexture: "skipHover",
    inputsMarginLeft: 1070,
    inputsMarginTop: 590,

    // Game over screen
    playAgainBtnPointerOverTexture: "playAgainHover",
    playAgainBtnMarginTop: 170,
    finalScoreLocation: { x: 455, y: 600 },

    // Leaderboard
    leaderboardListItems: 10,
    leaderboardHeader_name: { x: 1100, y: 310 },
    leaderboardHeader_pts: { x: 1580, y: 310 },
    leaderboardRanks: { x: 1010, y: 366, displacement: 55, },
    leaderboardName: { x: 1100, y: 366, displacement: 55, },
    leaderboardPoints: { x: 1580, y: 366, displacement: 55, },
} : {
    // Links
    startScreenBg: "../images/mobileStartScreenBackground.png",
    instructionsBg: "../images/mobileHTPBackground.jpg",
    popupBg: "../images/mobileHTPTextBg.png",
    mainBg: "../images/mainBg/1m top.png",
    mainBgSections: ["../images/mainBg/2m top mid.png", "../images/mainBg/3m mid.png", "../images/mainBg/4m bot mid.png", "../images/mainBg/5m bot.png"],
    addLeaderboardEntryBg: "../images/mobileAddLeaderboardBg.jpg",
    addLeaderboardEntryPopupBg: "../images/leaderboard-details-mobile.png",
    addLeaderboardHTML: "../html/inputs/mobileAddLeaderboardEntry.html",
    gameOverBg: "../images/mobileGameOverBackground.png",

    // Start screen
    playBtnPointerOverTexture: "playDown",
    playBtnOffsetY: 50,
    instructionsBtnPointerOverTexture: "instructionsDown",
    instructionsBtnMarginTop: 140,

    // Game instructions
    gameInstructionsPt1: `Different things will\npop up out of holes,\nand you must bash\nthem to gain points.\n\nYou will have 30\nseconds to gain as\nmany points as\nyou can.`,
    gameInstructionsPt2: `Be careful though!\nif you smack santa\n\nyou will lose`,
    gameInstructionsPt3: `200pts`,
    instructionBlueTextStyle: textStyles.instructionsBlueMobile,
    instruction2BlueTextStyle: textStyles.instructionsBlue2Mobile,
    instructionRedTextStyle: textStyles.instructionsRedMobile,
    closeBtnPointerOverTexture: "closeDown",
    closeBtnMarginTop: 75,
    closeBtnMarginRight: 70,
    instructionTextPt1OffsetY: 290,
    instructionTextPt2OffsetY: 1050,
    instructionTextPt2OffsetX: 50,
    instructionTextPt3OffsetY: 1186,
    instructionTextPt3OffsetX: 190,

    // Main game
    stage1End: 25,
    stage2End: 20,
    stage3End: 10,
    moleCoordinates: [
        [[215, 810], [455, 810], [688, 810]],
        [[190, 935], [455, 935], [716, 935]],
        [[165, 1060], [455, 1060], [744, 1060]],
        [[145, 1190], [455, 1190], [768, 1190]],
    ],
    moleScale: 0.8,
    scoreTextPaddingTop: 165,
    scoreTextPaddingLeft: 808,
    timerTextPaddingTop: 350,
    timerTextPaddingLeft: 540,
    gameHitZonePoints: [[45, 510], [865, 510], [960, 1420], [-40, 1420]],
    scoreOriginX: 1,
    moleDisplacement: 160,
    hammerScale: 0.6,
    animationScale: 15,
    moleAnimationDuration: 500,

    // Input leaderboard data
    addLeaderboardEntryPopupLocation: { x: 900/2, y: 1420/2 },
    addLeaderboardEntryPopupScale: 0.5417,
    skipBtnMarginLeft: 290,
    submitBtnMarginLeft: 620,
    submitSkipBtnsMarginTop: 895,
    submitBtnScale: 0.625,
    submitBtnPointerOverTexture: "submitDown",
    skipBtnScale: 0.625,
    skipBtnPointerOverTexture: "skipDown",
    inputsMarginLeft: 540,
    inputsMarginTop: 740,

    // Game over screen
    playAgainBtnPointerOverTexture: "playAgainDown",
    playAgainBtnMarginTop: 115,
    finalScoreLocation: { x: 450, y: 500 },

    // Leaderboard
    leaderboardListItems: 5,
    leaderboardHeader_name: { x: 180, y: 1000 },
    leaderboardHeader_pts: { x: 600, y: 1000 },
    leaderboardRanks: { x: 110, y: 1060, displacement: 55, },
    leaderboardName: { x: 180, y: 1060, displacement: 55, },
    leaderboardPoints: { x: 600, y: 1060, displacement: 55, },
}

// Initialise global game variables
var api = new API;
var screens = {}; // Contains all the game screens
var popups = {}; // Contains all the game popups
var audio = {}; // Contains all the sounds used in the game
var animations = {}; // Contains the animations in the game
var player = { // Holds information about the current player
    name: "",
    attempts: 0,
    score: 0,
    email: "",
};
var countdown = { // Contains the time before play initiates, and the interval id is added later on
    time: 3,
}
var timer; // Timer interval id is assigned to this
var timeLimit = 30; // Time limit on the game
var timeRemaining;
var emitter; // Variable to hold the event emitter for the game
var textures = { // The different textures for the moles, and the corresponding point worth of each
    "reindeer": {points: 50, probability: 0.3},
    "elf": {points: 100, probability: 0.3},
    "agik": {points: 150, probability: 0.2},
    "gram": {points: 300, probability: 0.1},
    "santa": {points: -200, probability: 0.1},
}
var visibleMoles = []; // Array of all moles currently visible
var curStage = 0;

const game = new Phaser.Game(config);

function preload() {
    // Assign useful dimensions to variables
    this.gameWidth = this.sys.game.canvas.width;
    this.gameHeight = this.sys.game.canvas.height;
    this.center = { x: this.gameWidth/2, y: this.gameHeight/2 };

    // Load images
    this.load.atlas("snowBlast", "../animations/snow-blast-web-23frames.png", "../animations/snowBlast.json");
    this.load.image("logo", "../images/Logo.png");
    this.load.image("startScreenBg", constants.startScreenBg);
    this.load.image("instructionsBg", constants.instructionsBg);
    this.load.image("popupBg", constants.popupBg);
    this.load.image("gameOverBg", constants.gameOverBg);
    this.load.image("playIdle", "../images/buttons/play-idle.png");
    this.load.image("playHover", "../images/buttons/play-hovered.png");
    this.load.image("playDown", "../images/buttons/play-clicked.png");
    this.load.image("mainBg", constants.mainBg);
    this.load.image("playAgainIdle", "../images/buttons/play-again-idle.png");
    this.load.image("playAgainHover", "../images/buttons/play-again-hovered.png");
    this.load.image("playAgainDown", "../images/buttons/play-again-clicked.png");
    this.load.image("instructionsIdle", "../images/buttons/htp-idle.png");
    this.load.image("instructionsHover", "../images/buttons/htp-hovered.png");
    this.load.image("instructionsDown", "../images/buttons/htp-clicked.png");
    this.load.image("closeIdle", "../images/buttons/close-idle.png");
    this.load.image("closeHover", "../images/buttons/close-hovered.png");
    this.load.image("closeDown", "../images/buttons/close-clicked.png");
    this.load.image("skipIdle", "../images/buttons/skip-idle.png");
    this.load.image("skipHover", "../images/buttons/skip-hovered.png");
    this.load.image("skipDown", "../images/buttons/skip-clicked.png");
    this.load.image("submitIdle", "../images/buttons/submit-idle.png");
    this.load.image("submitHover", "../images/buttons/submit-hovered.png");
    this.load.image("submitDown", "../images/buttons/submit-clicked.png");
    this.load.image("hammerIdle", "../images/hammer-idle.png");
    this.load.image("hammerDown", "../images/hammer-smack.png");
    this.load.image("elf", "../images/moles/mole-elf.png");
    this.load.image("agik", "../images/moles/mole-agik.png");
    this.load.image("gram", "../images/moles/mole-graham.png");
    this.load.image("santa", "../images/moles/mole-santa.png");
    this.load.image("reindeer", "../images/moles/mole-reindeer.png");
    for (let i = 0; i < constants.mainBgSections.length; i ++) {
        this.load.image(`bg${i+1}`, constants.mainBgSections[i]);
    }
    this.load.image("addLeaderboardEntryBg", constants.addLeaderboardEntryBg);
    this.load.image("addLeaderboardEntryPopupBg", constants.addLeaderboardEntryPopupBg);

    // Load entry boxes
    this.load.html("addLeaderboardInputs", constants.addLeaderboardHTML);

    // Load audio
    this.load.audio({
        key: "gameMusic",
        url: [ "../audio/Christmas Rock.mp3" ]
    });
    this.load.audio({
        key: "successfulWhack",
        url: [ "../audio/Character Gets Whacked-snowy.mp3" ]
    });
    this.load.audio({
        key: "unsuccessfulWhack",
        url: [ "../audio/Single Hammer Hit on Wood 01.mp3" ]
    });

}

function create() {
    // Create event emitter
    emitter = new Phaser.Events.EventEmitter();
    emitter.on("updateTimeRemaining", updateTimeRemaining);
    emitter.on("startCountdown", updateCountdown);

    // Create all audios
    audio = initAudio(this);

    // Create animations
    animations = initAnimations(this);

    // Create screen objects and children
    screens = {
        introScreen: new Screen(this, 0, 0, initIntroScreenChildren(this)),
        mainGame: new Screen(this, 0, 0, initMainGameChildren(this)),
        gameOverScreen: new Screen(this, 0, 0, initGameOverScreenChildren(this)),
    }

    // Create all popups
    popups = {
        instructions: this.add.popup(0, 0, initInstructionsPopup(this)),
        addLeaderboardEntry: this.add.popup(0, 0, initAddLeaderboardDataPopup(this)),
    }

    loadStartScreen();

    // Object.keys(screens).forEach(screen => screens[screen].setVisible(false));
    // Object.keys(popups).forEach(popup => popups[popup].setVisible(false));
    // gameOver(6969);

}

function update() {
    var pointer = this.input.activePointer;
    var canvasStyles = this.sys.canvas.style;



    if (screens.mainGame.visible) {
        if (Phaser.Geom.Polygon.Contains(screens["mainGame"]["gameZone"].input.hitArea, pointer.x, pointer.y)) {
                screens["mainGame"]["hammer"].x = pointer.x;
                screens["mainGame"]["hammer"].y = pointer.y;
                canvasStyles.cursor = "none";
                if (pointer.isDown) {
                    screens["mainGame"]["hammer"].setTexture("hammerDown").setOrigin(0.35, 0.62);
                } else {
                    screens["mainGame"]["hammer"].setTexture("hammerIdle").setOrigin(0.1, 0.5);
                }
            } else {
                screens["mainGame"]["hammer"].setTexture("hammerIdle").setOrigin(0.1, 0.5);
                canvasStyles.cursor = "default";
            }
    }
}

function initIntroScreenChildren(scene) {
    var objects = {};

    // Background
    objects["bg"] = scene.add.image(scene.center.x, scene.center.y, "startScreenBg").setOrigin(0.5);

    // Play button
    objects["playBtn"] = scene.add.image(scene.center.x, scene.center.y + constants.playBtnOffsetY, "playIdle");
    objects["playBtn"].setInteractive({ useHandCursor: true })
    .on("pointerover", () => { objects["playBtn"].setTexture(constants.playBtnPointerOverTexture) })
    .on("pointerout", () => { objects["playBtn"].setTexture("playIdle") })
    .on("pointerdown", () => { objects["playBtn"].setTexture("playDown") })
    .on("pointerup", () => { objects["playBtn"].setTexture("playHover"); initialiseGame(); });

    // How to play button
    objects["instructionsBtn"] = scene.add.image(scene.center.x, getBottom(objects["playBtn"]) + constants.instructionsBtnMarginTop, "instructionsIdle").setOrigin(0.5);
    objects["instructionsBtn"].setInteractive({ useHandCursor: true })
    .on("pointerover", () => { objects["instructionsBtn"].setTexture(constants.instructionsBtnPointerOverTexture) })
    .on("pointerout", () => { objects["instructionsBtn"].setTexture("instructionsIdle") })
    .on("pointerdown", () => { objects["instructionsBtn"].setTexture("instructionsDown") })
    .on("pointerup", () => { objects["instructionsBtn"].setTexture("instructionsHover"); popups.instructions.show(); });

    return objects;
}

function initInstructionsPopup(scene) {
    var objects = {};

    // Dim background
    objects["bg"] = scene.add.image(scene.center.x, scene.center.y, "instructionsBg").setOrigin(0.5);
    objects["bg"].setInteractive().on("pointerup", () => popups["instructions"].hide());

    // Popup background
    objects["popupBg"] = scene.add.image(scene.center.x, scene.center.y, "popupBg").setOrigin(0.5);
    objects["popupBg"].setInteractive();

    // Close button
    objects["closeBtn"] = scene.add.image(scene.gameWidth - constants.closeBtnMarginRight, constants.closeBtnMarginTop, "closeIdle").setOrigin(0.5);
    objects["closeBtn"].setInteractive({ useHandCursor: true })
    .on("pointerover", () => { objects["closeBtn"].setTexture(constants.closeBtnPointerOverTexture) })
    .on("pointerout", () => { objects["closeBtn"].setTexture("closeIdle") })
    .on("pointerdown", () => { objects["closeBtn"].setTexture("closeDown") })
    .on("pointerup", () => { objects["closeBtn"].setTexture("closeHover"); popups.instructions.hide(); });

    // Instructions text part 1
    objects["instructionsPt1"] = scene.add.text(scene.center.x, constants.instructionTextPt1OffsetY, constants.gameInstructionsPt1.toUpperCase(), constants.instructionBlueTextStyle).setOrigin(0.5, 0);

    // Instructions text part 2
    objects["instructionsPt2"] = scene.add.text(scene.center.x - constants.instructionTextPt2OffsetX, constants.instructionTextPt2OffsetY, constants.gameInstructionsPt2.toUpperCase(), constants.instruction2BlueTextStyle).setOrigin(0.5, 0);

    // Instructions text part 3
    objects["instructionsPt3"] = scene.add.text(scene.center.x + constants.instructionTextPt3OffsetX, constants.instructionTextPt3OffsetY, constants.gameInstructionsPt3.toUpperCase(), constants.instructionRedTextStyle).setOrigin(0.5, 0);


    return objects;
}

function initMainGameChildren(scene) {
    var objects = {};

    // Background Image 1
    objects["bg0"] = scene.add.image(0, 0, "mainBg").setOrigin(0);

    // Score text
    objects["score"] = scene.add.text(constants.scoreTextPaddingLeft, constants.scoreTextPaddingTop, `${player.score}`, textStyles.score).setOrigin(constants.scoreOriginX, 0);

    // Time remaining
    objects["timeRemaining"] = scene.add.text(constants.timerTextPaddingLeft, constants.timerTextPaddingTop, `0:30`, textStyles.timer).setOrigin(0, 0);

    objects["gameZone"] = scene.add.polygon(0, 0, constants.gameHitZonePoints).setOrigin(0)
    .setInteractive({ hitArea: new Phaser.Geom.Polygon(constants.gameHitZonePoints), hitAreaCallback: Phaser.Geom.Polygon.Contains })
    .on("pointerdown", () => { audio.effects.unsuccessfulWhack.play() });

    // Create a mole at each hole
    constants.moleCoordinates.forEach((row, y) => {
        // var rowNum = y;
        row.forEach((location, x) => {
            // Add the mole at the correct placement, with a random texture
            objects[`location${x}${y}`] = new Mole(
                scene,
                location[0],
                location[1]
                );
        });

        // Add the next piece of the background
        objects[`bg${y+1}`] = scene.add.image(0, 0, `bg${y+1}`).setOrigin(0);
    });

    // Hammer
    objects["hammer"] = scene.add.image(scene.center.x, scene.center.y, "hammerIdle").setOrigin(0.1, 0.5).setScale(constants.hammerScale);

    // Starting countdown
    objects["countdown"] = scene.add.text(scene.center.x, scene.center.y, `${countdown.time}`, textStyles.timerLg).setOrigin(0.5);

    return objects;
}

function initAddLeaderboardDataPopup(scene) {
    var objects = {};

    // Background
    objects["bg"] = scene.add.image(0, 0, "addLeaderboardEntryBg").setOrigin(0).setInteractive();

    // Popup Background
    objects["popupBg"] = scene.add.image(constants.addLeaderboardEntryPopupLocation.x, constants.addLeaderboardEntryPopupLocation.y, "addLeaderboardEntryPopupBg").setOrigin(0.5).setScale(constants.addLeaderboardEntryPopupScale);

    // Input fields
    objects["inputFields"] = scene.add.dom(constants.inputsMarginLeft, constants.inputsMarginTop).createFromCache("addLeaderboardInputs").setOrigin(0.5, 0.5);

    objects["blockInputBgClick"] = scene.add.rectangle(objects["inputFields"].x, objects["inputFields"].y, objects["inputFields"].displayWidth*2.07, objects["inputFields"].displayHeight*2.07, 0xffffff, 0)
    .setOrigin(objects["inputFields"].originX, objects["inputFields"].originY)
    .setInteractive();

    objects["bg"].on("pointerdown", () => { objects["inputFields"].getChildByName("name").blur(); objects["inputFields"].getChildByName("email").blur(); });

    // Submit button
    objects["submitBtn"] = scene.add.image(constants.submitBtnMarginLeft, constants.submitSkipBtnsMarginTop, "submitIdle").setScale(constants.submitBtnScale);
    objects["submitBtn"].setInteractive({ useHandCursor: true })
    .on("pointerover", () => { objects["submitBtn"].setTexture(constants.submitBtnPointerOverTexture) })
    .on("pointerout", () => { objects["submitBtn"].setTexture("submitIdle") })
    .on("pointerdown", () => { objects["submitBtn"].setTexture("submitDown") })
    .on("pointerup", () => {
        objects["submitBtn"].setTexture("submitHover");

        var nameInput = objects["inputFields"].getChildByName("name");
        var emailInput = objects["inputFields"].getChildByName("email");

        nameInput.blur();
        emailInput.blur();

        emailInput.className = "";
        nameInput.className = "";

        if (emailInput.validity.valid && nameInput.validity.valid) {

            player.name = nameInput.value;
            player.email = emailInput.value;

            // API CALL - Add leaderboard entry
	        api.leaderboard_create({
                name: player.name,
	            email: player.email,
	            score: player.score,
	        });

            refreshLeaderboard();

            popups.addLeaderboardEntry.hide();

        } else {
            if (!emailInput.validity.valid) {
                emailInput.className = "invalid";
            }
            if (!nameInput.validity.valid) {
                nameInput.className = "invalid";
            }
        }

    });

    // Skip button
    objects["skipBtn"] = scene.add.image(constants.skipBtnMarginLeft, constants.submitSkipBtnsMarginTop, "skipIdle").setScale(constants.skipBtnScale);
    objects["skipBtn"].setInteractive({ useHandCursor: true })
    .on("pointerover", () => { objects["skipBtn"].setTexture(constants.skipBtnPointerOverTexture) })
    .on("pointerout", () => { objects["skipBtn"].setTexture("skipIdle") })
    .on("pointerdown", () => { objects["skipBtn"].setTexture("skipDown") })
    .on("pointerup", () => { objects["skipBtn"].setTexture("skipHover"); refreshLeaderboard(); popups.addLeaderboardEntry.hide(); });

    return objects;
}

function initGameOverScreenChildren(scene) {
    var objects = {};
    // Background image
    objects["bg"] = scene.add.image(scene.center.x, scene.center.y, "gameOverBg").setOrigin(0.5);

    // Leaderboard headers
    objects[`leaderboardHeaderName`] = scene.add.text(constants.leaderboardHeader_name.x, constants.leaderboardHeader_name.y, `NAME`, textStyles.leaderboard).setOrigin(0, 0.5);
    objects[`leaderboardHeaderPoints`] = scene.add.text(constants.leaderboardHeader_pts.x, constants.leaderboardHeader_pts.y, `PTS`, textStyles.leaderboard).setOrigin(0, 0.5);

    for (let i = 0; i < constants.leaderboardListItems; i++) {
        objects[`leaderboardRank${i+1}`] = scene.add.text(constants.leaderboardRanks.x, (constants.leaderboardRanks.displacement*i)+constants.leaderboardRanks.y, `${i+1}.`, textStyles.leaderboard).setOrigin(0, 0.5);
        objects[`leaderboardName${i+1}`] = scene.add.text(constants.leaderboardName.x, (constants.leaderboardName.displacement*i)+constants.leaderboardName.y, ``, textStyles.leaderboard).setOrigin(0, 0.5);
        objects[`leaderboardPts${i+1}`] = scene.add.text(constants.leaderboardPoints.x, (constants.leaderboardPoints.displacement*i)+constants.leaderboardPoints.y, ``, textStyles.leaderboard).setOrigin(0, 0.5);
    }

    // Score
    objects["scoreText"] = scene.add.text(constants.finalScoreLocation.x, constants.finalScoreLocation.y, player.score, textStyles.finalScore).setOrigin(0.5);

    // Play again button
    objects["playAgainBtn"] = scene.add.image(objects["scoreText"].x, getBottom(objects["scoreText"]) + constants.playAgainBtnMarginTop, "playAgainIdle").setOrigin(0.5);
    objects["playAgainBtn"].setInteractive({ useHandCursor: true })
    .on("pointerover", () => { objects["playAgainBtn"].setTexture(constants.playAgainBtnPointerOverTexture) })
    .on("pointerout", () => { objects["playAgainBtn"].setTexture("playAgainIdle") })
    .on("pointerdown", () => { objects["playAgainBtn"].setTexture("playAgainDown") })
    .on("pointerup", () => { objects["playAgainBtn"].setTexture("playAgainHover"); initialiseGame(); });

    return objects;
}

function loadStartScreen() {
    // Hide everything except the start screen
    Object.keys(screens).forEach(screen => screens[screen].setVisible(false));
    Object.keys(popups).forEach(popup => popups[popup].setVisible(false));
    screens["introScreen"].setVisible(true);

}

function initialiseGame() {
    // Reset game variables
    player.attempts ++;
    player.score = 0;
    timeRemaining = timeLimit;
    screens["mainGame"]["countdown"].setVisible(true);
    screens["mainGame"]["countdown"].setText("3");
    screens["mainGame"]["score"].setText(`${player.score}`);
    screens["mainGame"]["timeRemaining"].setText(`0:30`);

    // Object.keys(screens["mainGame"]).filter(key => key.includes("location")).forEach(mole => screens["mainGame"][mole].hide("timedOut")); // Hide all visible moles

    // Hide start and end screen and show the main game
    screens["introScreen"].setVisible(false);
    screens["gameOverScreen"].setVisible(false);
    screens["mainGame"].setVisible(true);

    // Starts the countdown for play begin
    countdown.time = 3;
    countdown.timer = setInterval(() => {
        emitter.emit("startCountdown");
    }, 1000);

}

function startGameplay() {
    // Starts the game timer
    timer = setInterval(() => {
        emitter.emit("updateTimeRemaining");
    }, 1000);

    // Play game music
    audio.music.gameMusic.play();
    audio.music.gameMusic.fadeIn.play();

    // Show one mole at a time
    stage1();

}

function stage1() {

    curStage = 1;
    showMole();

    setTimeout(() => {
        stage2();
    }, (timeLimit-constants.stage1End)*1000);

}

function stage2() {

    curStage = 2;
    showMole();

    setTimeout(() => {
        stage3();
    }, (constants.stage1End-constants.stage2End)*1000);

}

function stage3() {

    curStage = 3;
    showMole();

    setTimeout(() => {
        stage4();
    }, (constants.stage2End-constants.stage3End)*1000);

}

function stage4() {

    curStage = 4;
    showMole();

}

function gameOver(finalScore) {
    // Hide game screen and show game over
    clearTimeout(timer);

    Object.keys(screens["mainGame"]).filter(key => key.includes("location")).forEach(mole => screens["mainGame"][mole].hide("reset")); // Hide all visible moles

    // Show the data input popup
    popups["addLeaderboardEntry"].show();

    screens["mainGame"].setVisible(false);
    screens["gameOverScreen"].setVisible(true);
    screens["gameOverScreen"]["scoreText"].setText(finalScore);
}

function updateTimeRemaining() {
    // Decrements the time, updates the display, and ends the game if time has run out
    timeRemaining --;
    if (timeRemaining > 9) {
        screens["mainGame"].timeRemaining.setText(`0:${timeRemaining}`);
    } else if (timeRemaining > 0) {
        screens["mainGame"].timeRemaining.setText(`0:0${timeRemaining}`);
    } else {
        screens["mainGame"].timeRemaining.setText(`0:00`); // Update display
        // visibleMoles.forEach(mole => mole.hide("reset")); // Hide all visible moles
        // visibleMoles = []; // reset array
        // clearInterval(timer); // Stop countdown timer
        // clearTimeout(curStageTimeout); // Stop game execution
        gameOver(player.score); // Show game end screen
    }
}

function updateCountdown() {
    // Counts down from 3
    // Starts the gameplay when it finishes

    countdown.time --;
    if (countdown.time > 0) {
        screens["mainGame"].countdown.setText(`${countdown.time}`);
    } else {
        screens["mainGame"].countdown.setText(`GO!`);
        clearInterval(countdown.timer);
        setTimeout(() => {
            screens["mainGame"].countdown.setVisible(false);
            startGameplay();
        }, 1000);
    }
}

function updateScore(increment) {
    // Updates the player's score, and the display
    player.score += increment;
    screens["mainGame"].score.setText(`${player.score}`);
}

function showMole() {

    // Shows a mole that is not already visible

    do { // Get random coordinates
        var x = getRandomInt(0, constants.moleCoordinates[0].length-1);
        var y = getRandomInt(0, constants.moleCoordinates.length-1);
        // var x = 0;
        // var y = 0;
    } while (screens["mainGame"][`location${x}${y}`].visible); // check if mole at this location is visible already

    // // Update mole texture -> MOVE TO MOLE CLASS
    // screens["mainGame"][`location${x}${y}`].setTexture(randomiseTexture());

    // Set mole to visible
    // visibleMoles.push([x, y]); // SHOULD BE IN MOLE CLASS
    screens["mainGame"][`location${x}${y}`].show();

}

function refreshLeaderboard() {
    // API CALL - Get leaderboard data
    api.leaderboard_index().then(res => {
        let ranks = res.data;
        // Loop through the required number of entries
        for (let i = 0; i < constants.leaderboardListItems; i++) {
            // If name is too long - cut into ellipsis
            if (ranks[i]) {
                if (ranks[i].name.length > 10) {
                    screens["gameOverScreen"][`leaderboardName${i+1}`].setText(ranks[i].name.toUpperCase().substr(0, 10)+"...");
                }
                else {
                    screens["gameOverScreen"][`leaderboardName${i+1}`].setText(ranks[i].name.toUpperCase());
                }
                // Text - Rank & Score
                screens["gameOverScreen"][`leaderboardPts${i+1}`].setText(ranks[i].score);
            }
        }
    });
}

function initAudio(scene) {
    var audio = { music: {}, effects: {} }

    // Don't stop the music on un-focus
    scene.sound.pauseOnBlur = false;

    audio.music["gameMusic"] = scene.sound.add("gameMusic", { loop: false, volume: 0 });
    audio.music.gameMusic.fadeIn = scene.tweens.add({
        targets: audio.music.gameMusic,
        volume: 0.4,
        duration: 2000,
    });

    audio.effects["successfulWhack"] = scene.sound.add("successfulWhack", { loop: false });

    audio.effects["unsuccessfulWhack"] = scene.sound.add("unsuccessfulWhack", { loop: false, volume: 0.6 });

    return audio;
}

function initAnimations(scene) {
    var objects = { snowBlast: { frames: [], }, };
    for (var i=0; i<23; i++) {
        objects.snowBlast.frames.push({ key: "snowBlast", frame: i.toString() });
    }

    return objects;
}

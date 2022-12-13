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
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        scene.add.existing(this);
        this.scene = scene;
        this.startY = y;
        this.endY = y - 200;
        this.setScale(constants.moleScale).setInteractive({ useHandCursor: true }).setVisible(false);
        this.moveUp = scene.tweens.add({
            targets: this,
            y: this.endY,
            duration: 1000,
            paused: true,
        });
        this.moveDownTimeOut = scene.tweens.add({
            targets: this,
            y: this.startY,
            duration: 1000,
            paused: true,
            onComplete: this.hideCallback,
        });
    }

    show() {
        this.setVisible(true);
        this.moveUp.play();
    }

    hide(reason) {
        if (reason === "timedOut") {
            this.moveDownTimeOut.play();
        }
    }

    hideCallback(tween, targets) {
        showMole();
        targets[0].setVisible(false);
        visibleMoles.shift();
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
};

// Set different dimensions for mobile and desktop
const constants = (screenSize === 'lg') ? {
    bg_main: "../images/mainBg/1 top.png",
    instructionsPopupMarginX: 180,
    instructionsPopupMarginY: 80,
    instructionsHeaderMarginTop: 35,
    gameInstructionsPt1: `Different things will pop up out of holes, and you must bash them to gain points.\n\nYou will have 30 seconds to gain as many points as you can.`,
    gameInstructionsPt2: `Be careful though! if you smack\nsanta you will lose`,
    gameInstructionsPt3: `200pts`,
    instructionTextMarginTop: 30,
    logo2PaddingTop: 20,
    logo2PaddingLeft: 20,
    logo2Scale: 0.2,
    scoreTextPaddingTop: 265,
    scoreTextPaddingLeft: 380,
    timerTextPaddingTop: 265,
    timerTextPaddingLeft: 1460,
    countdownMarginTop: 20,
    holeLocations: [
        [[0, 0], [1, 0], [2, 0], [3, 0]],
        [[0, 1], [1, 1], [2, 1], [3, 1]],
        [[0, 2], [1, 2], [2, 2], [3, 2]],
    ],
    moleScale: 1,
    moleCoordinates: [
        [475, 720], [800, 720], [1120, 720], [1445, 720],
        [410, 875], [780, 875], [1140, 875], [1510, 875],
        [335, 1040], [750, 1040], [1170, 1040], [1585, 1040],
    ],
    stage1End: 25,
    stage2End: 20,
    stage3End: 10,
    gameOverBg: "../images/desktopGameOverBackground.png",
    finalScoreLocation: { x: 455, y: 600 },
    playAgainBtnMarginTop: 170,
    playAgainBtnPointerOverTexture: "playAgainHover",
    startScreenBg: "../images/desktopStartScreenBackground.png",
    playBtnOffsetY: 175,
    playBtnPointerOverTexture: "playHover",
    instructionsBtnMarginTop: 140,
    instructionsBtnPointerOverTexture: "instructionsHover",
    instructionsBg: "../images/desktopHTPBackground.png",
    closeBtnMarginTop: 75,
    closeBtnMarginRight: 120,
    closeBtnPointerOverTexture: "closeHover",
    popupBg: "../images/desktopHTPTextBg.png",
    instructionBlueTextStyle: textStyles.instructionsBlue,
    instruction2BlueTextStyle: textStyles.instructionsBlue2,
    instructionRedTextStyle: textStyles.instructionsRed,
    instructionTextPt1OffsetY: 300,
    instructionTextPt2OffsetY: 825,
    instructionTextPt2OffsetX: 30,
    instructionTextPt3OffsetY: 870,
    instructionTextPt3OffsetX: 212,
    leaderboardListItems: 10,
    leaderboardHeader_name: { x: 1100, y: 310 },
    leaderboardHeader_pts: { x: 1580, y: 310 },
    leaderboardRanks: { x: 1010, y: 366 },
    leaderboardName: { x: 1100, y: 366 },
    leaderboardPoints: { x: 1580, y: 366 },
    gameHitZonePoints: [[170, 515], [1750, 515], [1930, 1080], [-10, 1080]],
    mainBgSections: ["../images/mainBg/2 top-mid.png", "../images/mainBg/3 mid.png", "../images/mainBg/4 bot.png"],
} : {
    bg_main: "../images/mainBg/1m top.png",
    instructionsPopupMarginX: 50,
    instructionsPopupMarginY: 80,
    instructionsHeaderMarginTop: 35,
    gameInstructionsPt1: `Different things will\npop up out of holes,\nand you must bash\nthem to gain points.\n\nYou will have 30\nseconds to gain as\nmany points as\nyou can.`,
    gameInstructionsPt2: `Be careful though!\nif you smack santa\n\nyou will lose`,
    gameInstructionsPt3: `200pts`,
    instructionTextMarginTop: 50,
    logo2PaddingTop: 20,
    logo2PaddingLeft: 20,
    logo2Scale: 0.15,
    scoreTextPaddingTop: 165,
    scoreTextPaddingLeft: 808,
    timerTextPaddingTop: 350,
    timerTextPaddingLeft: 540,
    countdownMarginTop: 20,
    holeLocations: [
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 3], [1, 3], [2, 3]],
    ],
    moleScale: 0.8,
    moleCoordinates: [
        [215, 810], [455, 810], [688, 810],
        [190, 935], [455, 935], [716, 935],
        [165, 1060], [455, 1060], [744, 1060],
        [145, 1190], [455, 1190], [768, 1190],
    ],
    stage1End: 25,
    stage2End: 20,
    stage3End: 10,
    gameOverBg: "../images/mobileGameOverBackground.png",
    finalScoreLocation: { x: 450, y: 500 },
    playAgainBtnMarginTop: 115,
    playAgainBtnPointerOverTexture: "playAgainDown",
    startScreenBg: "../images/mobileStartScreenBackground.png",
    playBtnOffsetY: 50,
    playBtnPointerOverTexture: "playDown",
    instructionsBtnMarginTop: 140,
    instructionsBtnPointerOverTexture: "instructionsDown",
    instructionsBg: "../images/mobileHTPBackground.jpg",
    closeBtnMarginTop: 75,
    closeBtnMarginRight: 70,
    closeBtnPointerOverTexture: "closeDown",
    popupBg: "../images/mobileHTPTextBg.png",
    instructionBlueTextStyle: textStyles.instructionsBlueMobile,
    instruction2BlueTextStyle: textStyles.instructionsBlue2Mobile,
    instructionRedTextStyle: textStyles.instructionsRedMobile,
    instructionTextPt1OffsetY: 290,
    instructionTextPt2OffsetX: 50,
    instructionTextPt2OffsetY: 1050,
    instructionTextPt3OffsetX: 190,
    instructionTextPt3OffsetY: 1186,
    leaderboardListItems: 5,
    leaderboardHeader_name: { x: 180, y: 1000 },
    leaderboardHeader_pts: { x: 600, y: 1000 },
    leaderboardRanks: { x: 110, y: 1060 },
    leaderboardName: { x: 180, y: 1060 },
    leaderboardPoints: { x: 600, y: 1060 },
    gameHitZonePoints: [[45, 510], [865, 510], [960, 1420], [-40, 1420]],
    mainBgSections: ["../images/mainBg/2m top mid.png", "../images/mainBg/3m mid.png", "../images/mainBg/4m bot mid.png", "../images/mainBg/5m bot.png"],
}

// Initialise global game variables
var api = new API;
var screens = {}; // Contains all the game screens
var popups = {}; // Contains all the game popups
var player = { // Holds information about the current player
    name: "",
    attempts: 0,
    score: 0,
};
var countdown = { // Contains the time before play initiates, and the interval id is added later on
    time: 3,
}
var timer; // Timer interval id is assigned to this
var timeRemaining = 30; // Time limit on the game
var emitter; // Variable to hold the event emitter for the game
var points = { // The different textures for the moles, and the corresponding point worth of each
    "reindeer": 50,
    "elf": 100,
    "agik": 150,
    "gram": 300,
    "santa": -200,
}

var visibleMoles = []; // Array of the locations of all moles currently visible
var curStageTimeout; // Will hold the timeout ID for stage 1

const game = new Phaser.Game(config);

function preload() {
    // Assign useful dimensions to variables
    this.gameWidth = this.sys.game.canvas.width;
    this.gameHeight = this.sys.game.canvas.height;
    this.center = { x: this.gameWidth/2, y: this.gameHeight/2 };

    // Load images
    this.load.image("logo", "../images/Logo.png");
    this.load.image("startScreenBg", constants.startScreenBg);
    this.load.image("instructionsBg", constants.instructionsBg);
    this.load.image("popupBg", constants.popupBg);
    this.load.image("gameOverBg", constants.gameOverBg);
    this.load.image("playIdle", "../images/buttons/play-idle.png");
    this.load.image("playHover", "../images/buttons/play-hovered.png");
    this.load.image("playDown", "../images/buttons/play-clicked.png");
    this.load.image("bg_main", constants.bg_main);
    this.load.image("playAgainIdle", "../images/buttons/play-again-idle.png");
    this.load.image("playAgainHover", "../images/buttons/play-again-hovered.png");
    this.load.image("playAgainDown", "../images/buttons/play-again-clicked.png");
    this.load.image("instructionsIdle", "../images/buttons/htp-idle.png");
    this.load.image("instructionsHover", "../images/buttons/htp-hovered.png");
    this.load.image("instructionsDown", "../images/buttons/htp-clicked.png");
    this.load.image("closeIdle", "../images/buttons/close-idle.png");
    this.load.image("closeHover", "../images/buttons/close-hovered.png");
    this.load.image("closeDown", "../images/buttons/close-clicked.png");
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
}

function create() {
    // Create event emitter
    emitter = new Phaser.Events.EventEmitter();
    emitter.on("updateTimeRemaining", updateTimeRemaining);
    emitter.on("startCountdown", updateCountdown);

    // Create screen objects and children
    screens = {
        introScreen: new Screen(this, 0, 0, initIntroScreenChildren(this)),
        mainGame: new Screen(this, 0, 0, initMainGameChildren(this)),
        gameOverScreen: new Screen(this, 0, 0, initGameOverScreenChildren(this)),
    }

    // Create all popups
    popups = {
        instructions: this.add.popup(0, 0, initInstructionsPopup(this)),
    }

    // loadStartScreen();

    Object.keys(screens).forEach(screen => screens[screen].setVisible(false));
    Object.keys(popups).forEach(popup => popups[popup].setVisible(false));
    screens["mainGame"].setVisible(true);
    initialiseGame();

}

function update() {
    var pointer = this.input.activePointer;

    if (Phaser.Geom.Polygon.Contains(screens["mainGame"]["gameZone"].input.hitArea, pointer.x, pointer.y)) {
        screens["mainGame"]["hammer"].x = pointer.x;
        screens["mainGame"]["hammer"].y = pointer.y;
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
    objects["bg0"] = scene.add.image(0, 0, "bg_main").setOrigin(0);

    // Score text
    objects["score"] = scene.add.text(constants.scoreTextPaddingLeft, constants.scoreTextPaddingTop, `${player.score}`, textStyles.score).setOrigin(1, 0);

    // Time remaining
    objects["timeRemaining"] = scene.add.text(constants.timerTextPaddingLeft, constants.timerTextPaddingTop, `0:30`, textStyles.timer).setOrigin(0, 0);

    // Create a mole at each hole
    constants.holeLocations.forEach((row, i) => {
        var rowNum = i;
        row.forEach((location, i) => {
            // Add the mole at the correct placement, with a random texture
            objects[`location${location[0]}${location[1]}`] = new Mole(
                scene,
                constants.moleCoordinates[rowNum*row.length + i][0],
                constants.moleCoordinates[rowNum*row.length + i][1],
                setMoleTexture()
                );

            // When clicked, hide the mole and update the user's score
            objects[`location${location[0]}${location[1]}`].on("pointerdown", () => { moleClicked(location) });
        });

        // Add the next piece of the background
        objects[`bg${rowNum+1}`] = scene.add.image(0, 0, `bg${rowNum+1}`).setOrigin(0);
    });

    // Hammer
    objects["hammer"] = scene.add.image(scene.center.x, scene.center.y, "hammerIdle").setOrigin(0.1, 0.5);

    objects["gameZone"] = scene.add.polygon(0, 0, constants.gameHitZonePoints).setOrigin(0)
    .setInteractive({ hitArea: new Phaser.Geom.Polygon(constants.gameHitZonePoints), hitAreaCallback: Phaser.Geom.Polygon.Contains })
    .on("pointerdown", () => { objects["hammer"].setTexture("hammerDown").setOrigin(0.35, 0.62) })
    .on("pointerup", () => { objects["hammer"].setTexture("hammerIdle").setOrigin(0.1, 0.5) });

    // Starting countdown
    objects["countdown"] = scene.add.text(scene.center.x, scene.center.y, `${countdown.time}`, textStyles.timerLg).setOrigin(0.5);

    return objects;
}

function initGameOverScreenChildren(scene) {
    var objects = {};

    // API CALL - Leaderboard List
    api.leaderboard_index().then(res => {
        let ranks = res.data;

        // List Headers
        objects["leaderboardNameHeader"] = scene.add.text(constants.leaderboardHeader_name.x, constants.leaderboardHeader_name.y, "NAME", textStyles.leaderboard).setOrigin(0, 0.5).setVisible(false);
        objects["leaderboardPointsHeader"] = scene.add.text(constants.leaderboardHeader_pts.x, constants.leaderboardHeader_pts.y, "PTS", textStyles.leaderboard).setOrigin(0, 0.5).setVisible(false);

        // Loop through the top 10
        for (let i = 0; i < constants.leaderboardListItems; i++) {
            // If name is too long - cut into ellipsis
            if (ranks[i]) {
	            if (ranks[i].name.length > 10) {
                    objects[`leaderboardRank${i+1}`] = scene.add.text(constants.leaderboardName.x, (55*i+1)+constants.leaderboardName.y, ranks[i].name.toUpperCase().substr(0, 10)+"...", textStyles.leaderboard).setOrigin(0, 0.5).setVisible(false);
                }
	            else {
	                objects[`leaderboardRank${i+1}`] = scene.add.text(constants.leaderboardName.x, (55*i+1)+constants.leaderboardName.y, ranks[i].name.toUpperCase(), textStyles.leaderboard).setOrigin(0, 0.5).setVisible(false);
                }
                // Text - Rank & Score
                objects[`leaderboardRankText${i+1}`] = scene.add.text(constants.leaderboardRanks.x, (55*i+1)+constants.leaderboardRanks.y, (i+1)+'.', textStyles.leaderboard).setOrigin(0, 0.5).setVisible(false);
                objects[`leaderboardScore${i+1}`] = scene.add.text(constants.leaderboardPoints.x, (55*i+1)+constants.leaderboardPoints.y, ranks[i].score, textStyles.leaderboard).setOrigin(0, 0.5).setVisible(false);
            }
            // screens["gameOverScreen"].add([objects[`leaderboardRank${i+1}`], objects[`leaderboardRankText${i+1}`], objects[`leaderboardScore${i+1}`]]);
        }
        // screens["gameOverScreen"].add([objects["leaderboardNameHeader"], objects["leaderboardPointsHeader"]]);
    });

    // Background image
    objects["bg"] = scene.add.image(scene.center.x, scene.center.y, "gameOverBg").setOrigin(0.5);

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

function initLeaderboard() {
    // To do
}

function loadStartScreen() {
    // Hide everything except the start screen
    Object.keys(screens).forEach(screen => screens[screen].setVisible(false));
    Object.keys(popups).forEach(popup => popups[popup].setVisible(false));
    screens["introScreen"].setVisible(true);

}

function initialiseGame() {
    // Set game variables
    player.name = player.name ?? "AAA";
    player.attempts ++;

    // Hide start and end screen and show the main game
    screens["introScreen"].setVisible(false);
    screens["gameOverScreen"].setVisible(false);
    screens["mainGame"].setVisible(true);

    // Starts the countdown for play begin
    countdown.timer = setInterval(() => {
        emitter.emit("startCountdown");
    }, 1000);

}

function startGameplay() {
    // Starts the game timer
    timer = setInterval(() => {
        emitter.emit("updateTimeRemaining");
    }, 1000);

    // Show one mole at a time
    stage1();

}

function stage1(step="init") {

    // Set random display time
    var showForTime = getRandomNumber(1, 2.1, 1)*1000;

    if(step === "init") {
        // Show first mole and run next step
        showMole();
        curStageTimeout = setTimeout(() => {
            stage1(1);
        }, showForTime);
    } else {
        // hideMole will show a new mole once the moleToHide is hidden
        hideMole();

        // Run stage 2 at appropriate time
        curStageTimeout = setTimeout(() => {
            (timeRemaining > constants.stage1End) ? stage1(1) : stage2();
        }, showForTime + 1000);
    }

}

function stage2(step="init") {
    // Set random display time
    // -> moles will be shown for a total of showForTime*2 (min: 1s max: 1.5s)
    var showForTime = getRandomNumber(0.5, 0.75, 2)*1000;

    if (step === "init") {
        // Add second mole and run next step
        showMole();
        curStageTimeout = setTimeout(() => {
            stage2(1)
        }, showForTime);
    } else if (step === 1) {

        // hideMole will show a new mole once the moleToHide is hidden
        hideMole();

        // Run stage 3 at appropriate time
        curStageTimeout = setTimeout(() => {
            (timeRemaining > constants.stage2End) ? stage2(1) : stage3();
        }, showForTime + 1000);
    }

}

function stage3(step="init") {
    // Set random display time
    // -> moles will be shown for a total of showForTime*3 (min: 0.99s max: 1.2s)
    var showForTime = getRandomNumber(0.33, 0.6, 2)*1000;

    if (step === "init") {
        // Add third mole and run next step
        showMole();
        if (visibleMoles.length < 3) { // Show extra mole if one gets clicked right as time ticks over
            showMole();
        }
        curStageTimeout = setTimeout(() => {
            stage3(1)
        }, showForTime);
    } else if (step === 1) {

        // hideMole will show a new mole once the moleToHide is hidden
        hideMole();

        // Run stage 4 at appropriate time
        curStageTimeout = setTimeout(() => {
            (timeRemaining > constants.stage3End) ? stage3(1) : stage4();
        }, showForTime + 1000);
    }
}

function stage4(step="init") {
    // Set random display time
    // -> moles will be shown for a total of showForTime*4 (min: 0.25s max: 0.75s)
    var showForTime = getRandomNumber(0.25, 0.25, 2)*1000;

    if (step === "init") {
        // Add fourth mole and run next step
        showMole();
        if (visibleMoles.length < 3) { // Show extra mole if one gets clicked right as time ticks over
            showMole();
        }
        curStageTimeout = setTimeout(() => {
            stage4(1)
        }, 500);
    } else if (step === 1) {
        // hideMole will show a new mole once the moleToHide is hidden
        hideMole();

        // Run stage 4 at appropriate time
        curStageTimeout = setTimeout(() => {
            stage4(1);
        }, showForTime + 1000);
    }
}

function gameOver(finalScore) {
    // Hide game screen and show game over
    // API CALL - Leaderboard List
    api.leaderboard_create({
        name: String(Date.now()),
        email: String(Date.now()+'@email.com'),
        company: String('Company '+Date.now()),
        score: Math.floor(Math.random() * 10000) + 1000,
    }).then(res => {
        alert('A record is randomly generated for the sake of data sample');
    });
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
        visibleMoles.forEach(mole => screens["mainGame"][`location${mole[0]}${mole[1]}`].setVisible(false)); // Hide all visible moles
        visibleMoles = []; // reset array
        clearInterval(timer); // Stop countdown timer
        clearInterval(curStageTimeout); // Stop game execution
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

function setMoleTexture() {
    // Returns a string based on the following percentages
    // santa -> 10%
    // reindeer -> 30%
    // elf -> 30%
    // agik -> 20%
    // gram -> 10%

    var probability = Math.random();
    var texture;

    // This is redundant at the moment, but I've left it because
    // this is going to get updated with the texture frames when they're ready
    if (probability <= 0.1) {
        texture = "santa";
    } else if (probability <= 0.4) {
        texture = "reindeer";
    } else if (probability <= 0.7) {
        texture = "elf";
    } else if (probability <= 0.9) {
        texture = "agik";
    } else {
        texture = "gram";
    }

    return texture;
}

function moleClicked(mole) {
    clearTimeout(curStageTimeout); // Kill current stage execution
    hideMole(mole);
    updateScore(points[screens["mainGame"][`location${mole[0]}${mole[1]}`].fillColor]); // Update score based on point value of texture
    // Restart stage execution
    if (timeRemaining > constants.stage1End) {
        stage1();
    } else if (timeRemaining > constants.stage2End) {
        stage2();
    } else if (timeRemaining > constants.stage3End) {
        stage3();
    } else {
        stage4();
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
        var x = getRandomInt(0, constants.holeLocations[0].length-1);
        var y = getRandomInt(0, constants.holeLocations.length-1);
    } while (visibleMoles.filter(coords => coords.join() === [x, y].join()).length); // check if mole at this location is visible already

    // Update mole texture
    screens["mainGame"][`location${x}${y}`].setTexture(setMoleTexture());

    // Set mole to visible
    visibleMoles.push([x, y]);
    screens["mainGame"][`location${x}${y}`].show();

}

function hideMole(target=[]) {
    // Hides the target mole if given, otherwise hides the mole
    // that has been shown for the longest time

    var moleToHide;

    if (target.length) {
        var indexToHide;
        moleToHide = target;
        visibleMoles.every((mole, i) => {
            if (mole.join() === target.join()) {
                indexToHide = i;
                return false;
            } else {
                return true;
            }
        });
        visibleMoles.splice(indexToHide, 1);
    } else {
        moleToHide = visibleMoles[0];
        screens["mainGame"][`location${moleToHide[0]}${moleToHide[1]}`].hide("timedOut");
    }


}

function hammerDownDesktop() {

}

function hammerDownMobile() {

}

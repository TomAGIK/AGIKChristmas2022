// Import constants
import { dimensions, screenSize } from "./constants/dimensions.js";
import { textStyles } from "./constants/textStyles.js";

// Import functions
import { getLeft } from "./utilityFunctions/getLeft.js";
import { getRight } from "./utilityFunctions/getRight.js";
import { getTop } from "./utilityFunctions/getTop.js";
import { getBottom } from "./utilityFunctions/getBottom.js";
import { getRandomInt } from "./utilityFunctions/getRandomInt.js";
import { getRandomNumber } from "./utilityFunctions/getRandomNumber.js";

// Import classes
import { API } from "./classes/API.js";
import { Screen } from "./classes/Screen.js";

// Import plugins
import { ButtonPlugin } from "./classes/plugins/Button.js";
import { PopupPlugin } from "./classes/plugins/Popup.js";
import { midpoint } from "./utilityFunctions/midpoint.js";
import { colours } from "./constants/colours.js";

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
    bg_main: "../images/bg_main.png",
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
    scoreTextPaddingTop: 310,
    scoreTextPaddingLeft: 330,
    timerTextPaddingTop: 265,
    timerTextPaddingLeft: 1630,
    countdownMarginTop: 20,
    mainGameBgPlaceholder: "../images/Whack a Mole placeholder.png",
    holeLocations: [
        [[0, 0], [1, 0], [2, 0], [3, 0]],
        [[0, 1], [1, 1], [2, 1], [3, 1]],
        [[0, 2], [1, 2], [2, 2], [3, 2]],
    ],
    moleSize: { width: 100, height: 200 },
    moleStartingOffset: { x: 230, y: 200 },
    moleSeparationDistance: { x: 470, y: 300 },
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
    leaderboardListItems: 10,
    leaderboardHeader_name: { x: 1100, y: 310 },
    leaderboardHeader_pts: { x: 1580, y: 310 },
    leaderboardRanks: { x: 1010, y: 366 },
    leaderboardName: { x: 1100, y: 366 },
    leaderboardPoints: { x: 1580, y: 366 },
} : {
    bg_main: "../images/bg_main_mobile.png",
    instructionsPopupMarginX: 50,
    instructionsPopupMarginY: 80,
    instructionsHeaderMarginTop: 35,
    gameInstructionsPt1: `Different things will pop up\nout of the snow holes, and\nyou must ‘smack’ them to\ngain points.
    You will have one minute\nto gain as many points\nas you can.
    *image of reindeer* 50 points
    *image of an elf* 100 points
    *image of agik character with Christmas hat* 150 points\n
    *image of graham’s face*\n300 points
    Be careful though! If you\nsmack santa, you will\nlose 200 points.`,
    instructionTextMarginTop: 25,
    logo2PaddingTop: 20,
    logo2PaddingLeft: 20,
    logo2Scale: 0.15,
    scoreTextPaddingTop: 225,
    scoreTextPaddingLeft: 700,
    timerTextPaddingTop: 350,
    timerTextPaddingLeft: 700,
    countdownMarginTop: 20,
    mainGameBgPlaceholder: "../images/Whack a Mole placeholder mobile.png",
    holeLocations: [
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
    ],
    moleSize: { width: 100, height: 200 },
    moleStartingOffset: { x: 140, y: 150 },
    moleSeparationDistance: { x: 315, y: 350 },
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
    instructionTextPt1OffsetY: 100,
    instructionTextPt2OffsetX: 835,
    leaderboardListItems: 5,
    leaderboardHeader_name: { x: 180, y: 1000 },
    leaderboardHeader_pts: { x: 600, y: 1000 },
    leaderboardRanks: { x: 110, y: 1060 },
    leaderboardName: { x: 180, y: 1060 },
    leaderboardPoints: { x: 600, y: 1060 },
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
var timeRemaining = 5; // Time limit on the game
var emitter; // Variable to hold the event emitter for the game
var points = { // The different textures for the moles, and the corresponding point worth of each
    0x964b00: 50,
    0x00ff00: 100,
    0xff0000: 150,
    0xffd700: 300
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
    this.load.image("placeholderBg", constants.mainGameBgPlaceholder);
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

    loadStartScreen();
}

function update() {}

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

    return objects;
}

function initMainGameChildren(scene) {
    var objects = {};

    // Background Image
    objects["bg"] = scene.add.image(0, 0, "bg_main").setOrigin(0);
    objects["bg"].setDisplaySize(dimensions.x, (objects["bg"].displayHeight/objects["bg"].displayWidth)*dimensions.x);

    // AGIK logo
    // objects["logo"] = scene.add.image(constants.logo2PaddingLeft, constants.logo2PaddingTop, "logo").setOrigin(0).setScale(constants.logo2Scale);
    // let logoCentre = midpoint([getLeft(objects["logo"]), getTop(objects["logo"])], [getRight(objects["logo"]), getBottom(objects["logo"])]);

    // Score text
    objects["score"] = scene.add.text(constants.scoreTextPaddingLeft, constants.scoreTextPaddingTop, `${player.score}`, textStyles.score).setOrigin(0.5, 0.5);

    // Time remaining
    objects["timeRemaining"] = scene.add.text(constants.timerTextPaddingLeft, constants.timerTextPaddingTop, `${timeRemaining}`, textStyles.timer).setOrigin(0.5, 0);

    // Starting countdown
    objects["countdown"] = scene.add.text(scene.center.x, scene.center.y, `${countdown.time}`, textStyles.timer).setOrigin(0.5);

    // Create a mole at each hole
    constants.holeLocations.forEach((row, i) => {
        var rowNum = i;
        row.forEach((location, i) => {
            // Add the mole at the correct placement, with a random texture
            objects[`location${location[0]}${location[1]}`] = scene.add.rectangle(
                i*constants.moleSeparationDistance.x + constants.moleStartingOffset.x,
                rowNum*constants.moleSeparationDistance.y + constants.moleStartingOffset.y,
                constants.moleSize.width,
                constants.moleSize.height,
                colours[setMoleTexture()][1].num
                ).setInteractive({ useHandCursor: true }).setVisible(false);

            // When clicked, hide the mole and update the user's score
            objects[`location${location[0]}${location[1]}`].on("pointerdown", () => { moleClicked(location) });
        });
    });

    return objects;
}

function initGameOverScreenChildren(scene) {
    var objects = {};

    // API CALL - Leaderboard List
    api.leaderboard_index().then(res => {
        let ranks = res.data;

        // List Headers
        objects["leaderboard"] = [];
        objects["leaderboard"][0] = scene.add.text(constants.leaderboardHeader_name.x, constants.leaderboardHeader_name.y, "NAME", textStyles.leaderboard).setOrigin(0, 0.5);
        objects["leaderboard"][1] = scene.add.text(constants.leaderboardHeader_pts.x, constants.leaderboardHeader_pts.y, "PTS", textStyles.leaderboard).setOrigin(0, 0.5);

        // Loop through the top 10
        for (let i = 0; i < constants.leaderboardListItems; i++) {
            // If name is too long - cut into ellipsis
            if (ranks[i].name.length > 10)
                objects["leaderboard"][objects["leaderboard"].length] = scene.add.text(constants.leaderboardName.x, (55*i+1)+constants.leaderboardName.y, ranks[i].name.toUpperCase().substr(0, 10)+"...", textStyles.leaderboard).setOrigin(0, 0.5);
            else
                objects["leaderboard"][objects["leaderboard"].length] = scene.add.text(constants.leaderboardName.x, (55*i+1)+constants.leaderboardName.y, ranks[i].name.toUpperCase(), textStyles.leaderboard).setOrigin(0, 0.5);

            // Text - Rank & Score
            objects["leaderboard"][objects["leaderboard"].length] = scene.add.text(constants.leaderboardRanks.x, (55*i+1)+constants.leaderboardRanks.y, (i+1)+'.', textStyles.leaderboard).setOrigin(0, 0.5);
            objects["leaderboard"][objects["leaderboard"].length] = scene.add.text(constants.leaderboardPoints.x, (55*i+1)+constants.leaderboardPoints.y, ranks[i].score, textStyles.leaderboard).setOrigin(0, 0.5);
        }
        screens.gameOverScreen.add(objects["leaderboard"]);
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

function loadStartScreen() {
    // Hide everything except the start screen
    Object.keys(screens).forEach(screen => screens[screen].setVisible(false));
    Object.keys(popups).forEach(popup => popups[popup].setVisible(false));
    screens["introScreen"].setVisible(true);

    // To see just the game over screen, comment line above, and uncomment line below
    // screens["gameOverScreen"].setVisible(true);

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
        // Show mole first so that the same mole will not be shown twice in a row
        showMole();
        hideMole();

        // Run stage 2 at appropriate time
        curStageTimeout = setTimeout(() => {
            (timeRemaining > constants.stage1End) ? stage1(1) : stage2();
        }, showForTime);
    }

}

function stage2(step="init") {
    // Set random display time
    // -> moles will be shown for a total of showForTime*2 (min: 0.75s max: 1s)
    var showForTime = getRandomNumber(0.375, 0.5, 2)*1000;

    if (step === "init") {
        // Add second mole and run next step
        showMole();
        if (visibleMoles.length < 2) { // Show two moles if one gets clicked right as time ticks over
            showMole();
        }
        curStageTimeout = setTimeout(() => {
            stage2(1)
        }, showForTime);
    } else if (step === 1) {

        // Show mole first so that the same mole will not be shown twice in a row
        showMole();
        hideMole();

        // Run stage 3 at appropriate time
        curStageTimeout = setTimeout(() => {
            (timeRemaining > constants.stage2End) ? stage2(1) : stage3();
        }, showForTime);
    }

}

function stage3(step="init") {
    // Set random display time
    // -> moles will be shown for a total of showForTime*3 (min: 0.75s max: 1s)
    var showForTime = getRandomNumber(0.25, 0.5, 2)*1000;

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

        // Show mole first so that the same mole will not be shown twice in a row
        showMole();
        hideMole();

        // Run stage 4 at appropriate time
        curStageTimeout = setTimeout(() => {
            (timeRemaining > constants.stage3End) ? stage3(1) : stage4();
        }, showForTime);
    }
}

function stage4(step="init") {
    // Set random display time
    // -> moles will be shown for a total of showForTime*4 (min: 0.25s max: 0.75s)
    var showForTime = getRandomNumber(0.0625, 0.1875, 2)*1000;

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
        // Show mole first so that the same mole will not be shown twice in a row
        showMole();
        hideMole();

        // Run stage 4 at appropriate time
        curStageTimeout = setTimeout(() => {
            stage4(1);
        }, showForTime);
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
    if (timeRemaining > 0) {
        screens["mainGame"].timeRemaining.setText(`${timeRemaining}`);
    } else {
        screens["mainGame"].timeRemaining.setText(`0`); // Update display
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
    // brown -> 50%
    // green -> 30%
    // red -> 18%
    // gold -> 2%

    var probability = Math.random();
    var texture;

    // This is redundant at the moment, but I've left it because
    // this is going to get updated with the texture frames when they're ready
    if (probability <= 0.5) {
        texture = "brown";
    } else if (probability <= 0.8) {
        texture = "green";
    } else if (probability <= 0.98) {
        texture = "red";
    } else {
        texture = "gold";
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
    screens["mainGame"][`location${x}${y}`].setFillStyle(colours[setMoleTexture()][1].num);

    // Set mole to visible
    visibleMoles.push([x, y]);
    screens["mainGame"][`location${x}${y}`].setVisible(true);

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
        moleToHide = visibleMoles.shift();
    }

    screens["mainGame"][`location${moleToHide[0]}${moleToHide[1]}`].setVisible(false);

}

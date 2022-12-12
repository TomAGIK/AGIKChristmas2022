import { dimensions } from "./dimensions.js";
import { colours } from "./colours.js";

const fontFamily = '"Myriad Pro", Myriad, "Liberation Sans", "Nimbus Sans L", "Helvetica Neue", Helvetica, Arial, sans-serif';

export const textStyles = {
    heading1Black: {
        fontSize: '68px',
        align: 'center',
        wordWrap: { width: dimensions.x - 30, useAdvancedWrap: true },
        color: '#000',
        fontFamily: fontFamily,
    },
    heading1Blue1: {
        fontSize: '68px',
        align: 'center',
        wordWrap: { width: dimensions.x - 30, useAdvancedWrap: true },
        color: colours.blue[1].hex,
        fontFamily: fontFamily,
        fontStyle: "bold",
    },
    titleBlue1: {
        fontSize: '92px',
        align: 'center',
        wordWrap: { width: dimensions.x - 30, useAdvancedWrap: true },
        color: colours.blue[1].hex,
        fontFamily: fontFamily,
        fontStyle: "bold",
    },
    heading2Blue1: {
        fontSize: '50px',
        align: 'center',
        wordWrap: { width: dimensions.x - 30, useAdvancedWrap: true },
        color: colours.blue[1].hex,
        fontFamily: fontFamily,
        fontStyle: "bold",
    },
    bodyWhite: {
        fontSize: '55px',
        align: 'center',
        wordWrap: { width: dimensions.x - 30, useAdvancedWrap: true },
        color: '#FFF',
        fontFamily: fontFamily,
    },
    bodyBlack: {
        fontSize: '55px',
        align: 'center',
        wordWrap: { width: dimensions.x - 30, useAdvancedWrap: true },
        color: "#000",
        fontFamily: fontFamily,
    },
    bodyBlue1Bold: {
        fontSize: '55px',
        align: 'center',
        wordWrap: { width: dimensions.x - 30, useAdvancedWrap: true },
        color: colours.blue[1].hex,
        fontFamily: fontFamily,
        fontStyle: "bold",
    },
    bodyBlue1: {
        fontSize: '55px',
        align: 'center',
        wordWrap: { width: dimensions.x - 30, useAdvancedWrap: true },
        color: colours.blue[1].hex,
        fontFamily: fontFamily,
    },
    previewSubject: {
        fontSize: '55px',
        align: 'left',
        color: '#000',
        fontFamily: fontFamily,
    },
    previewRead: {
        fontSize: '55px',
        align: 'center',
        wordWrap: { width: dimensions.x - 30, useAdvancedWrap: true },
        color: "#999999",
        fontFamily: fontFamily,
    },
    previewSubjectRead: {
        fontSize: '55px',
        align: 'left',
        color: '#999999',
        fontFamily: fontFamily,
    },
    email: {
        fontSize: '55px',
        align: 'left',
        color: '#000',
        wordWrap: { width: dimensions.x - 100, useAdvancedWrap: true },
        fontFamily: fontFamily,
    },
    calloutBody: {
        fontSize: '55px',
        align: 'left',
        color: '#000',
        wordWrap: { width: 550, useAdvancedWrap: true },
        fontFamily: fontFamily,
    },
    timer: {
        fontSize: '100px',
        align: 'center',
        color: '#FFF',
        wordWrap: { width: 550, useAdvancedWrap: true },
        fontFamily: "Score",
    },
    score: {
        fontSize: '100px',
        align: 'center',
        color: '#fab824',
        wordWrap: { width: 550, useAdvancedWrap: true },
        fontFamily: "Score",
    },
    finalScore: {
        fontSize: '200px',
        align: 'left',
        color: '#fab824',
        wordWrap: { width: 550, useAdvancedWrap: true },
        fontFamily: "Score",
    },
    leaderboard: {
        fontSize: '44px',
        align: 'left',
        color: colours.blue[1].hex,
        wordWrap: { width: 1000, useAdvancedWrap: true },
        fontFamily: 'Kid_Games',
    }
};

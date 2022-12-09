// Generates a random number between min and max (inclusive min, exclusive max) with the amount of decimal places specified
export function getRandomNumber(min, max, decimalPlaces) {
    return (Math.random() * (max - min) + min).toFixed(decimalPlaces) * 1;
}

'use strict';

// Create script properties to set the number of letters and update speed
export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'numLetters',
        label: 'Number of Letters',
        value: 10,
        min: 1,
        max: 100,
        integer: true
    })
    .addSlider({
        name: 'updateInterval',
        label: 'Update Interval (seconds)',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .finish();

let nextUpdate = 0;

// Function to generate random letters
function getRandomLetters(length) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
}

/**
 * @param {String} value - for property 'text'
 * @return {String} - update current property value
 */
export function update(value) {
    if (engine.runtime >= nextUpdate) {
        const numLetters = scriptProperties.numLetters;
        const newText = getRandomLetters(numLetters);
        nextUpdate = engine.runtime + scriptProperties.updateInterval;
        return newText;
    }
    return value;
}

'use strict';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'disabledValue',
        label: 'Disabled Value',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .addSlider({
        name: 'enabledValue',
        label: 'Enabled Value',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .addCheckbox({
        name: 'enableScript',
        label: 'Enable',
        value: true,
    })
    .addSlider({
        name: 'fadeSpeed',
        label: 'Fade Speed',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .finish();

let targetValue = 1;
let currentValue = 1;
let firstUpdate = true;  // This flag ensures the correct value is applied immediately at startup

export function init() {
    // Initialize currentValue directly based on enableScript state
    currentValue = scriptProperties.enableScript ? scriptProperties.enabledValue : scriptProperties.disabledValue;
    targetValue = currentValue;  // Ensure targetValue is in sync to prevent initial fading
}

export function update() {
    if (firstUpdate) {
        // Apply the initial value immediately without fading
        currentValue = scriptProperties.enableScript ? scriptProperties.enabledValue : scriptProperties.disabledValue;
        targetValue = currentValue;
        firstUpdate = false;  // Reset the flag after the first update
    } else {
        // Determine targetValue based on enableScript state
        targetValue = scriptProperties.enableScript ? scriptProperties.enabledValue : scriptProperties.disabledValue;

        const fadeSpeed = engine.frametime * scriptProperties.fadeSpeed;
        const delta = targetValue - currentValue;

        // Smoothly transition only if there's a significant difference
        if (Math.abs(delta) > 0.01) {
            currentValue += delta * fadeSpeed;
        } else {
            currentValue = targetValue;
        }
    }

    return currentValue;
}

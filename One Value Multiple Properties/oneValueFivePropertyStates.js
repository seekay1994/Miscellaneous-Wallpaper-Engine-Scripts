'use strict';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'state1Value',
        label: 'State 1 Value',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .addCheckbox({
        name: 'enableState1',
        label: 'Enable State 1',
        value: true
    })
    .addSlider({
        name: 'state2Value',
        label: 'State 2 Value',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .addCheckbox({
        name: 'enableState2',
        label: 'Enable State 2',
        value: false
    })
    .addSlider({
        name: 'state3Value',
        label: 'State 3 Value',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .addCheckbox({
        name: 'enableState3',
        label: 'Enable State 3',
        value: false
    })
    .addSlider({
        name: 'state4Value',
        label: 'State 4 Value',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .addCheckbox({
        name: 'enableState4',
        label: 'Enable State 4',
        value: false
    })
    .addSlider({
        name: 'state5Value',
        label: 'State 5 Value',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .addCheckbox({
        name: 'enableState5',
        label: 'Enable State 5',
        value: false
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
let firstUpdate = true;

export function init() {
    // Initialize currentValue based on the enabled state
    currentValue = getActiveStateValue();
    targetValue = currentValue;
}

export function update() {
    if (firstUpdate) {
        // Apply the initial value immediately without fading
        currentValue = getActiveStateValue();
        targetValue = currentValue;
        firstUpdate = false;
    } else {
        // Determine targetValue based on enabled state
        targetValue = getActiveStateValue();

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

// Helper function to get the value of the active state
function getActiveStateValue() {
    if (scriptProperties.enableState1) {
        return scriptProperties.state1Value;
    }
    if (scriptProperties.enableState2) {
        return scriptProperties.state2Value;
    }
    if (scriptProperties.enableState3) {
        return scriptProperties.state3Value;
    }
    if (scriptProperties.enableState4) {
        return scriptProperties.state4Value;
    }
    if (scriptProperties.enableState5) {
        return scriptProperties.state5Value;
    }
    // Default to State 1 value if no other state is enabled
    return scriptProperties.state1Value;
}

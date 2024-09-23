'use strict';

export var scriptProperties = createScriptProperties()
    .addSlider({ name: 'state1Value', label: 'State 1 Value', value: 1, min: 0.1, max: 10, integer: false })
    .addCheckbox({ name: 'enableState1', label: 'Enable State 1', value: true })
    .addSlider({ name: 'state2Value', label: 'State 2 Value', value: 1, min: 0.1, max: 10, integer: false })
    .addCheckbox({ name: 'enableState2', label: 'Enable State 2', value: false })
    .addSlider({ name: 'state3Value', label: 'State 3 Value', value: 1, min: 0.1, max: 10, integer: false })
    .addCheckbox({ name: 'enableState3', label: 'Enable State 3', value: false })
    .addSlider({ name: 'state4Value', label: 'State 4 Value', value: 1, min: 0.1, max: 10, integer: false })
    .addCheckbox({ name: 'enableState4', label: 'Enable State 4', value: false })
    .addSlider({ name: 'state5Value', label: 'State 5 Value', value: 1, min: 0.1, max: 10, integer: false })
    .addCheckbox({ name: 'enableState5', label: 'Enable State 5', value: false })
    .finish();

let currentValue = 1;

export function init() {
    // Initialize currentValue based on the enabled state
    currentValue = getActiveStateValue();
}

export function update() {
    // Apply the value of the active state instantly
    currentValue = getActiveStateValue();
    return currentValue;
}

// Helper function to get the value of the active state using a switch statement
function getActiveStateValue() {
    switch (true) {
        case scriptProperties.enableState1:
            return scriptProperties.state1Value;
        case scriptProperties.enableState2:
            return scriptProperties.state2Value;
        case scriptProperties.enableState3:
            return scriptProperties.state3Value;
        case scriptProperties.enableState4:
            return scriptProperties.state4Value;
        case scriptProperties.enableState5:
            return scriptProperties.state5Value;
        default:
            return scriptProperties.state1Value;
    }
}

'use strict';

import * as WEMath from 'WEMath';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'minValue',
        label: 'Minimum Value',
        value: 0,
        min: 0,
        max: 100,
        integer: false
    })
    .addSlider({
        name: 'maxValue',
        label: 'Maximum Value',
        value: 100,
        min: 0,
        max: 100,
        integer: false
    })
    .addSlider({
        name: 'transitionSpeed',
        label: 'Transition Speed',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .finish();

let targetValue;
let currentValue;

export function init(value) {
    currentValue = value;
    setNewTargetValue();
}

export function update(value) {
    const frameTime = engine.frametime * scriptProperties.transitionSpeed;
    currentValue = WEMath.mix(currentValue, targetValue, frameTime);
    
    if (Math.abs(currentValue - targetValue) < 0.01) {
        setNewTargetValue();
    }
    
    return currentValue;
}

function setNewTargetValue() {
    targetValue = Math.random() * (scriptProperties.maxValue - scriptProperties.minValue) + scriptProperties.minValue;
}

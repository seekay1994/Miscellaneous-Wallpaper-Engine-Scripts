'use strict';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'angle',
        label: 'Angle',
        value: 30,
        min: 0,
        max: 180,
        integer: false
    })
    .addSlider({
        name: 'speed',
        label: 'Speed',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .finish();

export function update(value) {
    const timeFactor = engine.runtime * scriptProperties.speed;
    
    value.z = Math.sin(timeFactor) * scriptProperties.angle;
    
    return value;
}

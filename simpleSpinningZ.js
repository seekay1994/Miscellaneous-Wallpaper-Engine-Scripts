'use strict';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'speed',
        label: 'Speed',
        value: 10,
        min: -250,
        max: 250,
        integer: true
    })
.finish();

export function update(value) {
    value.z = (engine.runtime * scriptProperties.speed) % 360;
    return value;
}
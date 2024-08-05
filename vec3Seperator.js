'use strict';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'x',
        label: 'X',
        value: 0,
        min: 0,
        max: 1,
        integer: false
    })
    .addSlider({
        name: 'y',
        label: 'Y',
        value: 0,
        min: 0,
        max: 1,
        integer: false
    })
    .addSlider({
        name: 'z',
        label: 'Z',
        value: 1,
        min: 0,
        max: 1,
        integer: false
    })
    .finish();

/**
 * @param {Vec3} value - for property 'Thresholds'
 * @return {Vec3} - update current property value
 */
export function update(value) {
    value.x = scriptProperties.x;
    value.y = scriptProperties.y;
    value.z = scriptProperties.z;
    return value;
}
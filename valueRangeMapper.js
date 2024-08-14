'use strict';

import * as WEMath from 'WEMath';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'actualMin',
        label: 'Actual Min',
        value: 0,
        min: 0,
        max: 1,
        integer: false
    })
    .addSlider({
        name: 'actualMax',
        label: 'Actual Max',
        value: 1,
        min: 0,
        max: 1,
        integer: false
    })
    .addSlider({
        name: 'visualValue',
        label: 'Visual Value',
        value: 0.5,
        min: 0,
        max: 1,
        integer: false
    })
    .finish();

/**
 * @param {Number} value - for the property this script is bound to.
 * @return {Number} - the mapped value based on actualMin and actualMax.
 */
export function update(value) {
    const actualMin = scriptProperties.actualMin;
    const actualMax = scriptProperties.actualMax;
    const visualValue = scriptProperties.visualValue;

    // Map the visualValue (0 to 1) to the actual range (actualMin to actualMax)
    const actualValue = actualMin + (visualValue * (actualMax - actualMin));

    // Return the calculated actual value
    return actualValue;
}

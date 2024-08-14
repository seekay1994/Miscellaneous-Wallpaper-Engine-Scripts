'use strict';

import * as WEMath from 'WEMath';

// Create script properties for user adjustments
export var scriptProperties = createScriptProperties()
    .addColor({
        name: 'morningColor',
        label: 'Morning Color',
        value: new Vec3(1, 0.8, 0.5) // Light orange
    })
    .addColor({
        name: 'afternoonColor',
        label: 'Afternoon Color',
        value: new Vec3(1, 1, 1) // White
    })
    .addColor({
        name: 'eveningColor',
        label: 'Evening Color',
        value: new Vec3(0.7, 0.4, 0.2) // Orange-brown
    })
    .addColor({
        name: 'nightColor',
        label: 'Night Color',
        value: new Vec3(0, 0, 0.5) // Dark blue
    })
    .addSlider({
        name: 'transitionDuration',
        label: 'Transition Duration (minutes)',
        value: 30,
        min: 1,
        max: 60,
        integer: true
    })
    .finish();

let currentColor = new Vec3(1, 1, 1);
let targetColor = new Vec3(1, 1, 1);
let transitionTime = 0;
let transitionProgress = 0;

/**
 * @param {Vec3} value - for property 'color'
 * @return {Vec3} - update current property value
 * This function updates the background color based on the time of day.
 */
export function update(value) {
    let now = new Date();
    let hours = now.getHours() + now.getMinutes() / 60;

    if (hours >= 6 && hours < 12) {
        targetColor = scriptProperties.morningColor;
    } else if (hours >= 12 && hours < 18) {
        targetColor = scriptProperties.afternoonColor;
    } else if (hours >= 18 && hours < 20) {
        targetColor = scriptProperties.eveningColor;
    } else {
        targetColor = scriptProperties.nightColor;
    }

    if (transitionProgress < 1) {
        transitionProgress += engine.frametime / (scriptProperties.transitionDuration * 60);
        currentColor = WEMath.mix(currentColor, targetColor, transitionProgress);
    } else {
        transitionProgress = 0;
        currentColor = targetColor;
    }

    value = currentColor;
    return value;
}

'use strict';

import * as WEMath from 'WEMath';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'minX',
        label: 'Minimum X Value',
        value: 0,
        min: -100,
        max: 100,
        integer: false
    })
    .addSlider({
        name: 'maxX',
        label: 'Maximum X Value',
        value: 1,
        min: -100,
        max: 100,
        integer: false
    })
    .addSlider({
        name: 'frequencyX',
        label: 'Frequency X (Hz)',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .addSlider({
        name: 'minY',
        label: 'Minimum Y Value',
        value: 0,
        min: -100,
        max: 100,
        integer: false
    })
    .addSlider({
        name: 'maxY',
        label: 'Maximum Y Value',
        value: 1,
        min: -100,
        max: 100,
        integer: false
    })
    .addSlider({
        name: 'frequencyY',
        label: 'Frequency Y (Hz)',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .addSlider({
        name: 'minZ',
        label: 'Minimum Z Value',
        value: 0,
        min: -100,
        max: 100,
        integer: false
    })
    .addSlider({
        name: 'maxZ',
        label: 'Maximum Z Value',
        value: 1,
        min: -100,
        max: 100,
        integer: false
    })
    .addSlider({
        name: 'frequencyZ',
        label: 'Frequency Z (Hz)',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .finish();

/**
 * @param {Vec3} value - for the property this script is attached to
 * @return {Vec3} - the updated oscillating value
 */
export function update(value) {
    let minX = scriptProperties.minX;
    let maxX = scriptProperties.maxX;
    let frequencyX = scriptProperties.frequencyX;

    let minY = scriptProperties.minY;
    let maxY = scriptProperties.maxY;
    let frequencyY = scriptProperties.frequencyY;

    let minZ = scriptProperties.minZ;
    let maxZ = scriptProperties.maxZ;
    let frequencyZ = scriptProperties.frequencyZ;

    // Calculate oscillating values using sine wave for each axis
    let oscillationX = (Math.sin(engine.runtime * frequencyX * 2 * Math.PI) + 1) / 2;
    let oscillationY = (Math.sin(engine.runtime * frequencyY * 2 * Math.PI) + 1) / 2;
    let oscillationZ = (Math.sin(engine.runtime * frequencyZ * 2 * Math.PI) + 1) / 2;

    // Map the oscillation to the range [min, max] for each axis
    let x = WEMath.mix(minX, maxX, oscillationX);
    let y = WEMath.mix(minY, maxY, oscillationY);
    let z = WEMath.mix(minZ, maxZ, oscillationZ);

    return new Vec3(x, y, z);
}

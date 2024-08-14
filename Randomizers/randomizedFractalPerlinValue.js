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
    .addCombo({
        name: 'fractalCount',
        label: 'Number of Fractals',
        options: [
            { label: 'No Fractal', value: 'one' },
            { label: '1 Fractals', value: 'two' },
            { label: '2 Fractals', value: 'three' }
        ],
        value: 1
    })
    .addSlider({
        name: 'noiseScale1',
        label: 'Noise Speed',
        value: 1,
        min: 0.1,
        max: 10,
        integer: false
    })
    .addSlider({
        name: 'noiseScale2',
        label: 'Fractal 1 Speed',
        value: 2,
        min: 0.1,
        max: 10,
        integer: false
    })
    .addSlider({
        name: 'noiseScale3',
        label: 'Fractal 2 Speed',
        value: 4,
        min: 0.1,
        max: 10,
        integer: false
    })
    .finish();

function getStepsValue(stepsString) {
    switch (stepsString) {
        case 'one': return 1;
        case 'two': return 2;
        case 'three': return 3;
        default: return 1; // default to 1 if something goes wrong
    }
}

// Basic hash function for noise generation
function hash(n) {
    return Math.sin(n) * 43758.5453123 % 1;
}

// 1D Noise function based on sine waves (as an approximation)
function noise(x, scale) {
    x *= scale;
    let intX = Math.floor(x);
    let fracX = x - intX;

    let v1 = hash(intX);
    let v2 = hash(intX + 1);

    return WEMath.mix(v1, v2, fracX);
}

function perlinNoise(x, scales, fractalCount) {
    let total = 0;
    let maxValue = 0;
    let amplitude = 1;

    for (let i = 0; i < getStepsValue(scriptProperties.fractalCount); i++) {
        total += noise(x, scales[i]) * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
    }

    return total / maxValue;
}

// Called every frame
export function update(value) {
    let scales = [scriptProperties.noiseScale1, scriptProperties.noiseScale2, scriptProperties.noiseScale3];
    let fractalCount = getStepsValue(scriptProperties.fractalCount);

    let noiseValue = perlinNoise(engine.runtime, scales, getStepsValue(scriptProperties.fractalCount));

    let range = scriptProperties.maxValue - scriptProperties.minValue;
    let mappedValue = scriptProperties.minValue + noiseValue * range;

    return mappedValue;
}
'use strict';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'minVisibleDuration',
        label: 'Min Visible Duration',
        value: 5,
        min: 1,
        max: 60,
        integer: true
    })
    .addSlider({
        name: 'maxVisibleDuration',
        label: 'Max Visible Duration',
        value: 10,
        min: 1,
        max: 60,
        integer: true
    })
    .addSlider({
        name: 'minInvisibleDuration',
        label: 'Min Invisible Duration',
        value: 10,
        min: 1,
        max: 60,
        integer: true
    })
    .addSlider({
        name: 'maxInvisibleDuration',
        label: 'Max Invisible Duration',
        value: 20,
        min: 1,
        max: 60,
        integer: true
    })
    .finish();

let isVisible = false;
let timer = 0;
let visibleDuration, invisibleDuration;

function getRandomDuration(min, max) {
    return Math.random() * (max - min) + min;
}

export function init() {
    visibleDuration = getRandomDuration(scriptProperties.minVisibleDuration, scriptProperties.maxVisibleDuration);
    invisibleDuration = getRandomDuration(scriptProperties.minInvisibleDuration, scriptProperties.maxInvisibleDuration);
    
    thisLayer.visible = false;
    isVisible = false;
    timer = 0;
    
    shared.bsodVisibility = false;
}

export function update() {
    timer += engine.frametime;
    updateVisibility();
}

function updateVisibility() {
    if (isVisible) {
        if (timer >= visibleDuration) {
            thisLayer.visible = false;
            isVisible = false;
            shared.bsodVisibility = false;
            timer = 0;
            invisibleDuration = getRandomDuration(scriptProperties.minInvisibleDuration, scriptProperties.maxInvisibleDuration);
        }
    } else {
        if (timer >= invisibleDuration) {
            thisLayer.visible = true;
            isVisible = true;
            shared.bsodVisibility = true;
            timer = 0;
            visibleDuration = getRandomDuration(scriptProperties.minVisibleDuration, scriptProperties.maxVisibleDuration);
        }
    }
}

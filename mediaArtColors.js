'use strict';

// Transition duration (can be adjusted via script property)
export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'transitionSpeed',
        label: 'Transition Speed (seconds)',
        value: 1,
        min: 0.1,
        max: 5,
        integer: false
    })
    .addCombo({
        name: 'colorSelection',
        label: 'Event Color Selection',
        options: [
            { label: 'Primary Color', value: 'primaryColor' },
            { label: 'Secondary Color', value: 'secondaryColor' },
            { label: 'Tertiary Color', value: 'tertiaryColor' },
            { label: 'Text Color', value: 'textColor' },
            { label: 'High Contrast Color', value: 'highContrastColor' }
        ]
    })
    .finish();

let newColor = new Vec3(0, 0, 0);
let oldColor = new Vec3(0, 0, 0);
let timer = scriptProperties.transitionSpeed;
let selectedColorKey = 'highContrastColor';

/**
 * @param {Vec3} value - for property 'clearcolor'
 * @return {Vec3} - update current property value
 */
export function update() {
    let color = newColor;
    const duration = scriptProperties.transitionSpeed;
    
    if (timer < duration) {
        color = newColor.subtract(oldColor).multiply(timer / duration).add(oldColor);
        timer += engine.frametime;
    }
    return color;
}

/**
 * @param {MediaThumbnailEvent} event
 */
export function mediaThumbnailChanged(event) {
    timer = 0;
    oldColor = newColor;
    
    // Use the pre-selected color based on the init function
    newColor = event[selectedColorKey];
}

/**
 * Initialize the script and determine the selected color property.
 */
export function init() {
    selectedColorKey = scriptProperties.colorSelection;
}

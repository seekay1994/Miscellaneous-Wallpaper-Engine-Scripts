'use strict';

export var scriptProperties = createScriptProperties()
    .addText({
        name: 'sharedValueName',
        label: 'Shared Value Name',
        value: 'sharedValueName'
    })
    .addCheckbox({
        name: 'useMultiplier',
        label: 'Multiplier Mode',
        value: false // Use the shared value as a multiplier
    })
    .finish();

// Axis controls
const applyX = true;
const applyY = false;
const applyZ = false;

let initialValue;

export function init(value) {
    initialValue = value ?? 1;
}

export function update(value) {
    const sharedValue = shared[scriptProperties.sharedValueName] ?? 1;
    const useMultiplier = scriptProperties.useMultiplier;

    if (typeof initialValue === 'number') {
        // Handle Number type
        return useMultiplier
            ? Math.max(initialValue * sharedValue, 0.01)
            : Math.max(sharedValue, 0.01);
    } else if (initialValue instanceof Vec2) {
        // Handle Vec2 type
        return new Vec2(
            applyX ? (useMultiplier ? Math.max(initialValue.x * sharedValue, 0.01) : sharedValue) : initialValue.x,
            applyY ? (useMultiplier ? Math.max(initialValue.y * sharedValue, 0.01) : sharedValue) : initialValue.y
        );
    } else if (initialValue instanceof Vec3) {
        // Handle Vec3 type
        return new Vec3(
            applyX ? (useMultiplier ? Math.max(initialValue.x * sharedValue, 0.01) : sharedValue) : initialValue.x,
            applyY ? (useMultiplier ? Math.max(initialValue.y * sharedValue, 0.01) : sharedValue) : initialValue.y,
            applyZ ? (useMultiplier ? Math.max(initialValue.z * sharedValue, 0.01) : sharedValue) : initialValue.z
        );
    }
}

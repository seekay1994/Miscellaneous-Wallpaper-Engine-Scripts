'use strict';

export var scriptProperties = createScriptProperties()
    .addText({
        name: 'sharedValueName',
        label: 'Shared Multiplier Name',
        value: 'multiplierValue'
    })
    .finish();

let initialValue;

export function init(value) {
    initialValue = value ?? 1;
}

export function update(value) {
    const multiplier = shared[scriptProperties.sharedValueName] ?? 1;

    if (typeof initialValue === 'number') {
        // Handle Number type
        return Math.max(initialValue * multiplier, 0.01);
    } else if (initialValue instanceof Vec2) {
        // Handle Vec2 type
        return new Vec2(
            Math.max(initialValue.x * multiplier, 0.01),
            Math.max(initialValue.y * multiplier, 0.01)
        );
    } else if (initialValue instanceof Vec3) {
        // Handle Vec3 type
        return new Vec3(
            Math.max(initialValue.x * multiplier, 0.01),
            Math.max(initialValue.y * multiplier, 0.01),
            Math.max(initialValue.z * multiplier, 0.01)
        );
    }
}

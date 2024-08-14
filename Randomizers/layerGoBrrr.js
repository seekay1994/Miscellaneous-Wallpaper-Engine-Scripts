'use strict';

import * as WEMath from 'WEMath';

const MIN_SCALE = 0.1;
const MAX_SCALE = 1.0;

// @param {Vec3} value - for property 'origin'
// @return {Vec3} - update current property value
export function update(value) {
    // Update origin
    let canvasSize = engine.canvasSize;
    value.x = Math.random() * canvasSize.x;
    value.y = Math.random() * canvasSize.y;

    // Update angle
    thisLayer.angles = new Vec3(thisLayer.angles.x, thisLayer.angles.y, Math.random() * 360);

    // Update scale
    let scaleValue = MIN_SCALE + Math.random() * (MAX_SCALE - MIN_SCALE);
    thisLayer.scale = new Vec3(scaleValue, scaleValue, thisLayer.scale.z);

    return value;
}

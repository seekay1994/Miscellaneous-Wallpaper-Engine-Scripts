'use strict';

export function update(value) {
	const pendulumAngle = thisLayer.getParent().angles.z;
	value.z = -pendulumAngle;
	return value;
}

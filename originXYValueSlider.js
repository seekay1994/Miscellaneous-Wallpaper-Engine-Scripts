'use strict';

export var scriptProperties = createScriptProperties()
	.addSlider({
		name: 'posX',
		label: 'Position X (%)',
		value: 50,
		min: 0,
		max: 100,
		integer: false
	})
	.addSlider({
		name: 'posY',
		label: 'Position Y (%)',
		value: 50,
		min: 0,
		max: 100,
		integer: false
	})
	.finish();

/**
 * @param {Vec3} value - for property 'Thresholds'
 * @return {Vec3} - update current property value
 */
export function update(value) { 
	value.x = scriptProperties.posX*(engine.canvasSize.x/100);
	value.y = scriptProperties.posY*(engine.canvasSize.y/100);
	return value;
}
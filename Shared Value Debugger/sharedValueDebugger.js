'use strict';

/*
Shared Value Debugger - by seekay
Add shared value keys ('shared.valueName' so the key is 'valueName') to 
display them in an easy to set up "debug window". (use ',' in-between keys)

Use '#n' to add a gap in-between values for better readability. 

Shared values that contain an array will result 
in a sub-menu that requires another click to expand.

This can also be used to make custom sub-menus by combining sets of 
shared values into an array somewhere else and use it here.
Every array entry will result in one new line.
*/

export var scriptProperties = createScriptProperties()
	.addText({   name: 'keys', 			label: 'Shared Keys', 			value: 'value1, #n, value2, #n, value3' })		// Shared value keys
	.addColor({  name: 'solidColor', 	label: 'Background Color', 		value: new Vec3(0.15, 0.15, 0.2) })				// Text background color
	.addSlider({ name: 'pointSize', 	label: 'Point Size', 			value: 16, min: 6, max: 32, integer: true })	// Point size of text
	.addSlider({ name: 'paddingSize', 	label: 'Padding Size', 			value: 16, min: 0, max: 32, integer: true })	// Text padding
	.addSlider({ name: 'gapSize', 		label: '#n Gap Size', 			value: 10, min: 5, max: 25, integer: true })	// Size of cisual gaps created by #n and expanded arrays
.finish();

const TEXT_SCALE = 0.5 									// Text scaling to make the text appear sharper (Default: 0.25)
const MAX_DECIMALS = 2;									// Max number of decimals any number can have 	(Default: 2)
const ANIM_SPEED = 8; 									// Animation Speed				(Default: 8)
const FONT = 'fonts/RobotoMono-Regular.ttf';						// Name/Location of the font that should be used (there does not seem to be a standard way to reference a font. Some require the path, others just the name)
const STORAGE_KEY_BASE = "sharedDebugMenuStateCK_";					// Key used for local storage

let windowLayers = [];									// Array storing data about each debug layer (and gaps)
let showWindows = false;								// Toggle for showing or hiding all debug layers
const valueCache = {};									// Cache for values that may be temporarily undefined/null
let holderLayer;									// Reference to parent layer used for alignment and coloring

//Builds UI layers based on keys input
export function init() {
	holderLayer = thisLayer.getParent();
	let index = 0;

	// Restore visibility state from localStorage
	const storedVisible = localStorage.get(STORAGE_KEY_BASE + "mainVisible");
	if (typeof storedVisible === "boolean") {
		showWindows = storedVisible;
	}

	// Iterate over each shared key (or gap '#n') and create corresponding layers
	for (const rawKey of scriptProperties.keys.split(',')) {
		const key = rawKey.trim();
		if (key === '#n') {
			windowLayers.push({ key: '#n' }); // Push gap placeholder
			continue;
		}

		const debugKey = `debugMenu${index++}`; // Unique ID for each debug layer
		const textColor = getTextContrastColor(scriptProperties.solidColor); // Choose text color based on background

		// Restore stored expanded state if available
		const storedExpanded = localStorage.get(STORAGE_KEY_BASE + debugKey);
		if (typeof storedExpanded === "boolean") {
			shared[debugKey] = storedExpanded;
		}

		// Create the text layer for displaying the value
		const textLayer = thisScene.createLayer({
			type: 'text',
			name: `WindowText_${key}`,
			origin: new Vec3(0, 0, 0),
			scale: new Vec3(TEXT_SCALE),
			text: {
				script: `export function cursorClick() {
					shared["${debugKey}"] = !shared["${debugKey}"];
					localStorage.set("${STORAGE_KEY_BASE + debugKey}", shared["${debugKey}"]);
				}`,
				value: ''
			},
			color: textColor,
			opaquebackground: true,
			backgroundcolor: scriptProperties.solidColor,
			font: FONT,
			pointsize: scriptProperties.pointSize,
			padding: 4,
			horizontalalign: 'left'
		});

		textLayer._visibilityTimer = 0; // Internal fade animation timer
		textLayer._smoothY = 0; // Smooth Y-positioning

		windowLayers.push({ key, debugKey, textLayer, children: [], isArray: false }); // Add to layer stack
	}
}

// Refresh debug values and layer positions
export function update() {
	thisLayer.color = scriptProperties.solidColor;
	const origin = holderLayer.origin.add(new Vec3(thisLayer.size.x + scriptProperties.gapSize, 0, 0)); // Position to the right of the base layer

	let yOffset = 0;
	let zIndex = 1024; // Layer hierarchy index (decreasing)
	const deltaTime = Math.min(1, engine.frametime * ANIM_SPEED);

	for (const win of windowLayers) {
		if (win.key === '#n') {
			yOffset -= scriptProperties.gapSize;
			continue;
		}

		const rawValue = shared[win.key];
		const hasValidValue = rawValue !== null && rawValue !== undefined;
		const value = hasValidValue ? rawValue : valueCache[win.key]; // Use cached if null/undefined
		if (hasValidValue) valueCache[win.key] = rawValue;

		win.isArray = Array.isArray(value); // Check if the value is an array
		const height = updateTextLayer(win, value, origin, yOffset, zIndex--, deltaTime); // Update main value line

		let childHeight = 0;
		if (win.isArray) {
			childHeight = updateChildLayers(win, value, origin, yOffset, zIndex, deltaTime); // Add entries for arrays
			cleanupOrphanedChildren(win, value.length); // Remove old unused children
			zIndex -= value.length;
		}

		let effectiveHeight = height;
		let postGap = 0;
		if (win.isArray && win.children[0]) {
			const childEase = easeInOutQuart(win.children[0]._visibilityTimer);
			effectiveHeight *= (1.0 - childEase);
			postGap = scriptProperties.gapSize * childEase;
		}

		yOffset -= effectiveHeight + childHeight + postGap;  // Move Y-position downward
	}
}

// Handles main text-layers
function updateTextLayer(win, value, origin, yOffset, zIndex, deltaTime) {
	const layer = win.textLayer;
	const isArray = win.isArray;
	const key = win.key;

	const height = (layer.size?.y || 20) * TEXT_SCALE;
	const textColor = getTextContrastColor(scriptProperties.solidColor);
	const targetVisibility = showWindows ? 1 : 0;

	holderLayer.scale = new Vec3(1, height * 0.66, 1); // Adjust parent layer height to match text-height

	layer._visibilityTimer = smoothStep(layer._visibilityTimer, targetVisibility, deltaTime);
	const alpha = easeInOutQuart(layer._visibilityTimer);

	layer._smoothY += (yOffset - layer._smoothY) * deltaTime;
	layer.text = isArray ? `${key} >` : `${key}: ${format(value)}`; // Display array as collapsible or direct value

	layer.origin = origin.add(new Vec3(5, layer._smoothY));
	layer.scale = new Vec3(TEXT_SCALE);
	layer.pointsize = scriptProperties.pointSize;
	layer.backgroundcolor = scriptProperties.solidColor;
	layer.padding = scriptProperties.paddingSize;
	layer.color = textColor;
	layer.alpha = alpha;
	layer.visible = alpha > 0.001;
	layer.z = zIndex;

	return height * alpha; // Return visual height contribution
}

// Handles child-text-layers
function updateChildLayers(win, valueArray, origin, yOffset, zIndexStart, deltaTime) {
	const expanded = shared[win.debugKey]; // Only show if expanded
	const baseX = (win.textLayer.size?.x * TEXT_SCALE) + scriptProperties.gapSize;
	const baseColor = colorManager(scriptProperties.solidColor, 0.6); // Slightly lighter/darker background
	const textColor = getTextContrastColor(baseColor);

	let totalHeight = 0;
	let entryY = yOffset;

	for (let i = 0; i < valueArray.length; i++) {
		const value = valueArray[i];
		const key = `${win.key}[${i}]`;

		if (value != null) valueCache[key] = value;

		let child = win.children[i];
		if (!child) {
			// Create child layer
			child = win.children[i] = thisScene.createLayer({
				type: 'text',
				name: `WindowText_${key}`,
				origin: new Vec3(0, 0, 0),
				scale: new Vec3(TEXT_SCALE),
				text: '',
				color: textColor,
				opaquebackground: true,
				backgroundcolor: baseColor,
				font: 'fonts/RobotoMono-Regular.ttf',
				pointsize: scriptProperties.pointSize,
				padding: 4,
				horizontalalign: 'left'
			});
			child._visibilityTimer = 0;
			child._smoothY = 0;
		}

		child._visibilityTimer = smoothStep(child._visibilityTimer, (showWindows && expanded) ? 1 : 0, deltaTime);
		const eased = easeInOutQuart(child._visibilityTimer);
		const height = child.size.y * TEXT_SCALE;

		child._smoothY += (entryY - child._smoothY) * deltaTime;
		child.origin = origin.add(new Vec3(baseX, child._smoothY));
		child.scale = new Vec3(TEXT_SCALE);
		child.pointsize = scriptProperties.pointSize;
		child.padding = scriptProperties.paddingSize;
		child.backgroundcolor = baseColor;
		child.color = textColor;
		child.alpha = eased;
		child.text = format(valueCache[key]);
		child.visible = eased > 0.001;
		child.z = zIndexStart - i;

		entryY -= height * eased;
		totalHeight += height * eased;
	}

	return totalHeight; // Total space taken by children
}

// Clean up unused children
function cleanupOrphanedChildren(win, validLength) {
	for (let i = validLength; i < win.children.length; i++) {
		const orphan = win.children[i];
		if (orphan && orphan._visibilityTimer <= 0.001) {
			orphan.visible = false;
			thisScene.destroyLayer(orphan);
			win.children[i] = null;
		}
	}
}

// Limit any number to MAX_DECIMALS if needed
function format(value) {
	if (typeof value === 'number') {
		return Math.floor(value * 100) !== value * 100 ? value.toFixed(MAX_DECIMALS) : value.toString();
	}
	if (value instanceof Vec2) return `(${format(value.x)}, ${format(value.y)})`;
	if (value instanceof Vec3) return `(${format(value.x)}, ${format(value.y)}, ${format(value.z)})`;
	return value;
}

// Adjust background fill color for array entries based on luminance
function colorManager(color, factor) {
	const lum = 0.299 * color.x + 0.587 * color.y + 0.114 * color.z;
	const mod = v => lum > 0.5 ? Math.min(1, v + (1 - v) * factor) : Math.max(0, v * (1 - factor));

	holderLayer.color = new Vec3(mod(color.x), mod(color.y), mod(color.z));
	
	return new Vec3(mod(color.x), mod(color.y), mod(color.z));
}

// Return black or white depending on the background fill color luminance
function getTextContrastColor(color) {
	return (0.299 * color.x + 0.587 * color.y + 0.114 * color.z) > 0.5 ? new Vec3(0, 0, 0) : new Vec3(1, 1, 1);
}

// Easing function used animation
function easeInOutQuart(t) {
	return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

// Smooth value transition with speed control
function smoothStep(current, target, speed) {
	const delta = (target - current) * speed;
	return Math.max(0, Math.min(1, current + delta));
}

// Toggle visibility of the entire debug menu when clicked
export function cursorClick() {
	showWindows = !showWindows;
	localStorage.set(STORAGE_KEY_BASE + "mainVisible", showWindows);
}

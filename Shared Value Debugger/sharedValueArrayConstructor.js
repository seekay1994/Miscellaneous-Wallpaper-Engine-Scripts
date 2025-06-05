'use strict';

/*
Shared Value Debugger helper script - by seekay

Add shared values keys in the same way as in the main script 
and this will return an array that, when used on the main script,
will result in a sub-menu with all your shared values displayed in order.
*/

export var scriptProperties = createScriptProperties()
  .addText({ name: 'keys', label: 'Shared Keys', value: 'value1, value2, value3' })
  .finish();

let cachedKeys = []; // Cached parsed keys

// Parse the keys from script property
export function init() {
  cachedKeys = parseKeys(scriptProperties.keys);
}

// Helper function to parse and clean up the comma-separated input string
function parseKeys(keyString) {
  return keyString.split(',').map(name => name.trim()).filter(Boolean);
}

export function update() {
  // Build the array with formatted key-value strings
  shared.constructedArray = cachedKeys.map(name => {
    let value = shared[name]; // Get value from shared object
    // If value is undefined, mark it, otherwise show the value
    return `${name}: ${value !== undefined ? value : "[undefined]"}`;
  });
}
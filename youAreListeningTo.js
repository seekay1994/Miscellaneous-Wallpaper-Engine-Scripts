'use strict';

var mediaData = "You are listening to nothing \n by nobody";
const to = "You are listening to \"";
const by = "\" \n by ";

/**
 * @param {String} value - for property 'text'
 * @return {String} - update current property value
 */
export function update(value) {
	return mediaData;
}


/**
 * @param {MediaPropertiesEvent} event
 */
export function mediaPropertiesChanged(event) {
	mediaData 	= to 
			+ event.title 
			+ by 
			+ event.artist;
	
}

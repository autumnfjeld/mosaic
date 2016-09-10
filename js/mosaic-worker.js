'use strict';
/**
 * Breaks down the image canvas into tiles and computes the average color value in 
 * @param  {object} height, width, pixel data for the image, tile parameters
 * @postMessage  {array}  hexidecimal color for a row of tiles
 */
function mosaicWorker(data){
	var start = Date.now(), end, deltaT;
	var pixelsInRGB =data.image.data,
			imgWidth =   data.image.width,
			imgHeight =  data.image.height,
	    tileWidth =  data.tile.width,
	    tileHeight = data.tile.height,
			//Simplify problem by using only interger # of tiles, disgarding 'extra' pixels, ok if image size >> tile size
			xTiles = Math.floor(imgWidth / tileWidth),				  //# tiles in the x direction
			yTiles = Math.floor(imgHeight / tileHeight),				//# tiles in the y direction
			avgRGB = null, 
			tileHexColor,
			row,
			i, j, x, y;																					//counters and pixel positions

		for (j=0; j < yTiles; j++){  													//iterate thru rows of tiles
			row = [];
		  for (i=0; i < xTiles; i++) {  											//iterate thru columns of tiles
				x = i * tileWidth;  															// x pixel position in canvas 
				y = j * tileHeight; 															// y pixel position in canvas
				
				avgRGB = getTileAvgRGB(x, y, tileWidth, tileWidth, imgWidth, pixelsInRGB);
				// tileHexColor = {};
				// tileHexColor[i] = rgbToHex(avgRGB);

				// debugger;
				row.push(rgbToHex(avgRGB));
			}
			// console.log('Row ', j, ' of ', yTiles, ' rows in Image', 'len: ', row.length, row);
			var obj = {row: j, rowColors: row};
			// console.log(obj);
			postMessage(obj);
			// postMessage(row);
		}
		end = Date.now();
		deltaT = end - start;
		console.log('WORKER IS DONE.  deltaT:',deltaT, 'ms');
		postMessage({done:'done', finalRow:j});
		
}

/**
 * Computes the average rgb values over a range of pixels in a tile
 * @param  {integer} x        pixel position in x
 * @param  {integer} y        pixel position in y
 * @param  {integer} xPixels  number of x pixels in a tile
 * @param  {integer} yPixels  number of y pixels in a tile
 * @param  {integer} imgWidth width of original image in pixels
 * @param  {array} data       Uint8ClampedArray representing a one-dimensional array containing the pixel data in the RGBA order
 * @return {object} avgRGB    object with r, g, b color props
 */
function getTileAvgRGB(x, y, xPixels, yPixels, imgWidth, data){
		var tileData = [],  
				pixelData = [],
				rgbSums = {r: 0, g: 0, b: 0},
				avgRGB = {},
				row, col, prop;			

		for (row = y; row < (y + yPixels); row++ ){			 				//iterate over pixel rows
			for (col = x; col < (x + xPixels); col++) {						//iterate over pixel cols
				rgbSums['r'] += data[(row*imgWidth + col)*4 + 0];
				rgbSums['g'] += data[(row*imgWidth + col)*4 + 1];
				rgbSums['b'] += data[(row*imgWidth + col)*4 + 2];
				// tileData.push(pixelData);  	//will be an array of 16x16
			}
		} 
			for (prop in rgbSums){
				avgRGB[prop] = Math.floor(rgbSums[prop]/(xPixels*yPixels));
			}
			return avgRGB;
}

/**
 * Converts rgb to hexidecimal
 * @param  {object} rgbObj  object with r, g, b color props
 * @return {string}        hexidecimal color string
 */
function rgbToHex(rgbObj){
	function componentToHex(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}
	return componentToHex(rgbObj['r']) + componentToHex(rgbObj['g']) + componentToHex(rgbObj['b']);
};	
 

onmessage = function(e){
  console.log('message received', e);
    mosaicWorker(e.data);
};
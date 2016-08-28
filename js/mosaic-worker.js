

/**
 * //take in all pixel data
 * //process row
 * //send row back to controller
 * //controller will call server to get svgs
 * 
 */

//make class
//
function MosaicRow(){
	this.
	this.rows =[];
}

function mosaicWorker(data){
	console.log('mosaicWorker', data);
	// debugger;
	var pixelsInRGB =  data.image.data,
			imgWidth =   data.image.width,
			imgHeight =  data.image.height,
	    tileWidth =  data.tile.width,
	    tileHeight = data.tile.height,
			//Simplify problem by using interger # of tiles
			xTiles = Math.floor(imgWidth / tileWidth),			  //# tiles in the x direction
			yTiles = Math.floor(imgHeight / tileHeight),			//# tiles in the y direction
			avgRGB = null, 
			tileHexColor = {},
			row = [],
			i, j, x, y;									//counters and pixel positions


		console.log('xtiles', xTiles, 'yTiles', yTiles);
		for (j=0; j < yTiles; j++){  //iterate thru rows of tiles
			row = [];
		  for (i=0; i < xTiles; i++) {  //iterate thru columns of tiles
				x = i * tileWidth;  		// x pixel position in canvas 
				y = j * tileHeight; 		// y pixel position in canvas
				
				avgRGB = getTileAvgRGB(x, y, tileWidth, tileWidth, imgWidth, pixelsInRGB);
				tileHexColor[i] = rgbToHex(avgRGB);
				row.push(tileHexColor);
			}

			postMessage(row);
			// console.log('Row ', j, ' of ', yTiles, ' rows in Image', 'len: ', row.length);
		}
		postMessage('done');
		self.close();
}

function getTileAvgRGB(x, y, xPixels, yPixels, imgWidth, data){
		
		var tileData = [],  
				pixelData = [],
				rgbSums = {r: 0, g: 0, b: 0},
				avgRGB = {},
				row, col, prop;					//counters

		for (row = y; row < (y + yPixels); row++ ){			 			//iterate over pixel rows
			for (col = x; col < (x + xPixels); col++) {					//iterate over pixel cols
				// console.log('array index kind of', (row*imgWidth + col)*4);
				// console.log('data point ', data[(row*imgWidth + col)*4 + 0]);
				rgbSums['r'] += data[(row*imgWidth + col)*4 + 0];
				rgbSums['g'] += data[(row*imgWidth + col)*4 + 1];
				rgbSums['b'] += data[(row*imgWidth + col)*4 + 2];
				tileData.push(pixelData);  //will be an array of 16x16
			}
		} 
			for (prop in rgbSums){
				avgRGB[prop] = Math.floor(rgbSums[prop]/(xPixels*yPixels));
			}
			// console.log('getTileAvgRGB: ', avgRGB);
			return avgRGB;

}


function rgbToHex(rgbObj){

	function componentToHex(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}

	return componentToHex(rgbObj['r']) + componentToHex(rgbObj['g']) + componentToHex(rgbObj['b']);

};	


onmessage = function(e){
  console.log('message received', e);
    // var imgData = e.data;
    mosaicWorker(e.data);
};
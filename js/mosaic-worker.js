

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
			xTiles = Math.floor(imgWidth / tileWidth),			//# tiles in the x direction
			yTiles = Math.floor(imgHeight / tileHeight),			//# tiles in the y direction
			avgRGB = {},
			row = [],
			x, y;

		for (var j=0; j < yTiles; j++){  //iterate thru rows of tiles
			row = [];
		  for (var i=0; i < xTiles; i++) {  //iterate thru columns of tiles
				x = i * tileWidth;  		// x pixel position in canvas 
				y = j * tileHeight; 		// y pixel position in canvas
				
				avgRGB[i] = getTileAvgRGB(x, y, tileWidth, tileWidth, imgWidth, pixelsInRGB);
				row.push(avgRGB);
			}

			postMessage(row);
			//post to webworker
			//how to store data
			// row = { 1: hex, 2:hex}  send this back to controller to call server
			console.log('Row ', j, ' of ', yTiles, ' rows in Image', row);
		}
		postMessage('done');

}

function getTileAvgRGB(x, y, xPixels, yPixels, imgWidth, data){
		
		var tileData = [],  
				pixelData = [],
				rgbSums = {r: 0, g: 0, b: 0},
				avgRGB = {};

		// this.skipPixels = 0;
		//iterate over every pixel, summing the r, g, & b
		for (var row=y; row < (y + yPixels); row++ ){			 			//iterate over pixel rows
			for (var col=x; col < (x + xPixels); col++) {					//iterate over cols
				// console.log('array index kind of', (row*imgWidth + col)*4);
				// console.log('data point ', data[(row*imgWidth + col)*4 + 0]);
				rgbSums['r'] += data[(row*imgWidth + col)*4 + 0];
				rgbSums['g'] += data[(row*imgWidth + col)*4 + 1];
				rgbSums['b'] += data[(row*imgWidth + col)*4 + 2];
				tileData.push(pixelData);  //will be an array of 16x16
			}
		} 
			for (var prop in rgbSums){
				avgRGB[prop] = Math.floor(rgbSums[prop]/(xPixels*yPixels));
			}
			// console.log('getTileAvgRGB: ', avgRGB);
			return avgRGB;

	};


onmessage = function(e){
  console.log('message received', e);
    // var imgData = e.data;
    mosaicWorker(e.data);
};
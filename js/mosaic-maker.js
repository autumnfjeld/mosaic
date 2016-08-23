(function(){
	'use strict';
	/**
	 * Mosaic module to create mosaic from image
	 * @constructor
	 */
	function Mosaic(userOptions){
		console.log('Mosaic', userOptions);
		if (!userOptions.sourceImg) {
			throw new Error('source image not defined');
		}

		this.mergeOptions(userOptions);

		//ensure sure image is loaded before processing
		if (this.options.sourceImg.complete) {
			this.init();
		} else {
			this.options.sourceImg.onload = this.init.bind(this);
		}
	}

	//TODO After upload use new Image() to set image ****

	Mosaic.prototype.options = {
		'sourceImg': null,
		'mosaicEl': null,
		'tileWidth':  window.TILE_WIDTH,
		'tileHeight': window.TILE_HEIGHT,   //namespace these!
		'canvasWidth': null,
		'canvasHeight': null
	};

	/**
	 * @param  {object} destination  Final object
	 * @param  {object} source       Source object, to be merged into destination
	 * @return {}
	 */
	Mosaic.prototype.mergeOptions = function(userOptions){
		for (var prop in userOptions){
			if (userOptions.hasOwnProperty(prop)){
				this.options[prop] = userOptions[prop];
			}
		}
		console.log('this.options', this.options);
	}	

	// Mosaic.prototype.setImage = function(sourceImg){
	// 	console.log('sourceImg', sourceImg);
	// 	var img = new Image();
	// 	img.crossOrigin = 'anonymous';  //for local dev
	// 	img.src = sourceImg.src;
	// 	console.log('img', img);
	// 	this.options.sourceImg = img;
	// }

	Mosaic.prototype.init = function(){
		// console.log('this.options.sourceImg', this.options.sourceImg);
		this.options.canvasWidth = this.options.sourceImg.naturalWidth;
		this.options.canvasHeight = this.options.sourceImg.naturalHeight;
		this.options.tilesX = Math.floor(this.options.canvasWidth / this.options.tileWidth);
		this.options.tilesY = Math.floor(this.options.canvasHeight / this.options.tileHeight);

		this.getTileColors();
		console.log('end', this);
	};

	Mosaic.prototype.getTileColors = function(){
		// debugger;
		var options = this.options,
				tileSize = this.options.tileWidth,   	//assumes tiles will be square or circle  
				xPixels = options.tileWidth,  				//number of pixels in a tile in x direction
				yPixels = options.tileHeight;  				//number of pixels in a tile in y direction
		    imageData = this.getImageData(), 			// [r1,g1,b1,a1,r2,g2,b2,a2]
		    colorData = imageData.data,
		    imageWidth = imageData.width;

		for (var j=0; j < options.tilesY; j++){  //iterate thru rows of tiles
		  for (var i=0; i < options.tilesX; i++) {  //iterate thru columns of tiles
				var x = i * options.tileWidth,  		// x pixel position in canvas 16
				    y = j * options.tileHeight; 		// y pixel position in canvas
				this.getTileAvgRGB(x, y, xPixels, yPixels, imageWidth, colorData);
				//send color back to controller to fetch svg from server
			}
		}
	}

	/**
	 * Gets the r,g,b,a data for the pixels in a tile where x,y represent (0,0) of tile coords
	 * @param  {integer} x  			 x pixel position in canvas, min x in tile
	 * @param  {integer} y  			 y pixel position in canvas, min y in tile tile
	 * @param  {integer} xPixels	 num of pixels in tile in x  
   * @param  {integer} yPixels   num of pixels in tile in y 
	 * @param  {integer} imgWidth  width (height) dimension of canvas
	 * @param  {array} data  			 rgba data in format [r1,g1,b1,a1,r2,g2,b2,a2]
	 * @return {array}   					 rgbdata [[r1,g1,b1,a1], [r2,g2,b2,a2],...] of size tileWidthxtileHeight
	 */
	Mosaic.prototype.getTileAvgRGB = function(x, y, xPixels, yPixels, imgWidth, data){
		//will go over 16x16 pixels > data array is 16x16x4 
		// debugger;
		var tileData = [],  //length 256
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
			console.log('getTileAvgRGB: ', avgRGB);
			return avgRGB;
	};


	window.app = window.app || {};
	window.app.Mosaic = Mosaic;

})(window);



/**
 * Divide image into grids each 16x16
 * Create canvas-image (& acontext) from original image
 * use getImageData to get the pixel data for the context
 *   - data = [r1, g1, b1, a1, r2, g2, b2, a2, r3, g3, b3, a3]
 * Draw
 */


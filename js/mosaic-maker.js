(function(){
	'use strict';
	console.log('running mosaic constructor');
	/**
	 * Mosaic module to create mosaic from image
	 * @constructor
	 */
	function Mosaic(userOptions){
		// console.log('Mosaic', userOptions);
		if (!userOptions.sourceImg) {
			throw new Error('source image not defined');
		}

		this.mergeOptions(userOptions);

		//ensure image is loaded before processing
		// this.init();
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
	 * @param  {object} userOptions       Source object, to be merged into destination
	 */
	Mosaic.prototype.mergeOptions = function(userOptions){
		for (var prop in userOptions){
			if (userOptions.hasOwnProperty(prop)){
				this.options[prop] = userOptions[prop];
			}
		}
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
		this.options.canvasWidth = this.options.sourceImg.naturalWidth;
		this.options.canvasHeight = this.options.sourceImg.naturalHeight;
		this.options.tilesX = Math.floor(this.options.canvasWidth / this.options.tileWidth);
		this.options.tilesY = Math.floor(this.options.canvasHeight / this.options.tileHeight);

		console.log('Mosaic.init options:', this.options);
		this.getTileColors();
	};

	Mosaic.prototype.getTileColors = function(){
		// debugger;
		var options = this.options,
				tileSize = this.options.tileWidth,   	//assumes tiles will be square or circle  
				xPixels = options.tileWidth,  				//number of pixels in a tile in x direction
				yPixels = options.tileHeight,  				//number of pixels in a tile in y direction
		    imageData = this.getImageData(), 			// [r1,g1,b1,a1,r2,g2,b2,a2]
		    colorData = imageData.data,
		    imageWidth = imageData.width;

		for (var j=0; j < options.tilesY; j++){  //iterate thru rows of tiles
		  for (var i=0; i < options.tilesX; i++) {  //iterate thru columns of tiles
				var x = i * options.tileWidth,  		// x pixel position in canvas 16
				    y = j * options.tileHeight; 		// y pixel position in canvas
				
				this.getTileAvgRGB(x, y, xPixels, yPixels, imageWidth, colorData);

			}
			//how to store data
			// row = { 1: hex, 2:hex}  send this back to controller to call server
			console.log('Row ', j, ' of ', options.tilesY, ' rows in Image');
		}
		console.log('getTileColors DONE');
	}

	//get Image Data
	Mosaic.prototype.getImageData = function(){
		var img = this.options.sourceImg,
		    w = this.options.canvasWidth,
		    h = this.options.canvasHeight,
		    canvas = document.createElement('canvas'),
		    context = canvas.getContext('2d');

    context.canvas.width = this.options.canvasWidth,
    context.canvas.height = this.options.canvasHeight;    

		context.drawImage(img, 0, 0);

		var imageData = context.getImageData(0, 0, w, h);
		// console.log('imageData', imageData.data);

		//test
		var test = document.getElementById('testshowcanvas');
		test.appendChild(canvas);
		return imageData;

	};	

	/**
	 * Gets the r,g,b,a data for the pixels in a tile where x,y represent (0,0) of tile coords
	 * @param  {integer} x  			 x pixel position in canvas, min x in tile
	 * @param  {integer} y  			 y pixel position in canvas, min y in tile tile
	 * @param  {integer} xPixels	 num pixels in x direction in a tile
	 * @param  {integer} yPixels	 num pixels in x direction in a tile
	 * @param  {integer} imgWidth  width (height) dimension of canvas
	 * @param  {array} data  			 rgba data in format [r1,g1,b1,a1,r2,g2,b2,a2]
	 * @return {array}   					 rgbdata [[r1,g1,b1,a1], [r2,g2,b2,a2],...] of size tileWidthxtileHeight
	 */
	Mosaic.prototype.getTileAvgRGB = function(x, y, xPixels, yPixels, imgWidth, data){
		
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

	Mosaic.prototype.rgbToHex = function(rgbObj){
		
		function componentToHex(c) {
		    var hex = c.toString(16);
		    return hex.length == 1 ? "0" + hex : hex;
		}

		return "#" + componentToHex(rgbObj['r']) + componentToHex(rgbObj['g']) + componentToHex(rgbObj['b']);

	}



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


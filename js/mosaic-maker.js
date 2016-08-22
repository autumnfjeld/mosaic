(function(){
	'use strict';
	console.log('running mosaic constructor');
	/**
	 * Mosaic module to create mosaic from image
	 * @constructor
	 */
	function Mosaic(userOptions){
		console.log('Mosaic', userOptions);
		if (!userOptions.sourceImg) {
			throw new Error('source image not defined');
		}
		// this.setImage(userOptions.sourceImg);
		this.mergeOptions(userOptions);

		//make sure image is uploaded before calling
		this.init();
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
		//Find number of tiles in x & y directions
		this.options.tilesX = Math.floor(this.options.canvasWidth / this.options.tileWidth);
		this.options.tilesY = Math.floor(this.options.canvasHeight / this.options.tileHeight);

		this.drawImageOnCanvas();
		console.log('end', this);
	};

	Mosaic.prototype.drawImageOnCanvas = function(){
		var img = this.options.sourceImg,
		    w = this.options.canvasWidth,
		    h = this.options.canvasHeight,
		    canvas = document.createElement('canvas'),
		    context = canvas.getContext('2d');    

		context.drawImage(img, 0, 0);

		var imageData = context.getImageData(0, 0, 16, 16);
		console.log('imageData', imageData.data);
		// debugger;
		//test
		var test = document.getElementById('testshowcanvas');
		test.appendChild(canvas);

		// canvas.width = this.options.tileWidth * this.options.

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


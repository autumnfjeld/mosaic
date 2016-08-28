(function(){
	'use strict';
	/**
	 * the pixelImageData property will hold
	 * 
	 * @constructor
	 * @param { node} sourceImage [varname] [description]
	 */
	function ImageModel(sourceImage){

		if (!sourceImage) {
			throw new Error('source image not defined');
			//TODO: alert user of problem
		}

		//TODO catch COORS image problem

		this.srcImage = {
			imgEl: sourceImage,
			width: null,
			height: null
		};

		this.canvas = {};

	}

	/**
	 * Buffer function to allow waiting for image load, then populate data and compute
	 * @return {[type]} [description]
	 */
	ImageModel.prototype.init = function(sourceImage){

		return new Promise(function(resolve, reject){
			// console.log('in Promise this', this);

				//ensure image is loaded before processing
				if (this.srcImage.imgEl.complete) {
					this.getPixelData();
					resolve(this.canvas);
				} else {
					this.srcImage.imgEl.onload = function(){
						this.getPixelData();
						resolve(this.canvas);
					}.bind(this);
					//TODO timeout here in case never loads, maybe reject can do timeout
				}
		}.bind(this));

	};

	ImageModel.prototype.setImageDimensions = function(){
		this.srcImage.width = this.srcImage.imgEl.naturalWidth;
		this.srcImage.height = this.srcImage.imgEl.naturalHeight;
	}

	//should be a private function ?????
	ImageModel.prototype.getPixelData = function(){

		this.setImageDimensions();

		var img = this.srcImage.imgEl,
		    w = this.srcImage.width,
		    h = this.srcImage.height,		    
		    canvas = document.createElement('canvas'),
		    context = canvas.getContext('2d');
		
    context.canvas.width = w,     //note: case where img is not an integer # of tiles is handled in #######
    context.canvas.height = h;    
		context.drawImage(img, 0, 0);

		this.canvas = context.getImageData(0, 0, w, h);   //getting data by row won't achieve significant speed gain
		console.log('DONE imageData', this.canvas);

		return this.canvas;

		//test
		var test = document.getElementById('testshowcanvas');
		test.appendChild(canvas);
  };

	window.app = window.app || {}; 
	window.app.ImageModel = ImageModel;

})(window);

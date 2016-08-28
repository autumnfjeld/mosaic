'use strict';
(function(){
	/**
	 * 
	 * @constructor
	 * @param {node} sourceImage 
	 */
	function ImageModel(sourceImage){
		if (!sourceImage) {
			throw new Error('source image not defined');
		}
		this.srcImage = {
			imgEl: sourceImage,
			width: null,
			height: null
		};
		this.canvas = {};
	}

	/**
	 * Init computation of pixel data which will populate this.canvas
	 * Data provided in promise resolve as a convience
	 * @resolve {object}  canvas image data 
	 */
	ImageModel.prototype.init = function(){
		return new Promise(function(resolve, reject){
				if (this.srcImage.imgEl.complete) {
					this.getPixelData();
					resolve(this.canvas);
				} else {
					this.srcImage.imgEl.onload = function(){
						this.getPixelData();
						resolve(this.canvas);
					}.bind(this);
					//TODO setup timeout to send reject if if case never loads
				}
		}.bind(this));
	};

	/**
	 * Set source image dimesions on the model
	 */
	ImageModel.prototype.setImageDimensions = function(){
		this.srcImage.width = this.srcImage.imgEl.naturalWidth;
		this.srcImage.height = this.srcImage.imgEl.naturalHeight;
	};

	/**
	 * Create an html canvas context and to get pixel image data
	 * @return {object}  canvas dimensions and pixel rgb
	 */
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
  };

	window.app = window.app || {}; 
	window.app.ImageModel = ImageModel;

})(window);

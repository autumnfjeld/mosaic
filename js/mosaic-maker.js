(function(){
	'use strict';
	console.log('running mosaic');
	/**
	 * Mosaic module to create mosaic from image
	 * @constructor
	 */
	function Mosaic(userOptions){
		console.log('Mosaic', userOptions);

		if (!userOptions.original) {
			throw new Error('original image not defined');
		}

		this.mergeOptions(userOptions);

		//make sure image is uploaded before calling
		this.init();
	}

	Mosaic.prototype.options = {
		'original': null,
		'mosaicEl': null
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

	Mosaic.prototype.init = function(){

	};

	Mosaic.prototype.createCanvasFromImage = function(img){

	}


	window.app = window.app || {};
	window.app.Mosaic = Mosaic;

})(window);
/**
 * @constructor
 * @param {object} options Options for creating the mosaic
 */


(function(){
	'use strict';

	/**
	 * ViewController module for orchestrating view & mosaic model
	 * @constructor
	 */
	function ViewController(){
		console.log('init ViewController');
		this.imageEl = null;

		this.tile = {
			width:  window.TILE_WIDTH,
			height: window.TILE_HEIGHT
		};

		// Init models
		this.imageModel = null;
		this.mosaicModel = [];  //array of objects {1: hex1, 2: hex2}
		
		// var testImage =  document.getElementById('source-image');
		// var maker = new app.Mosaic({  'sourceImg': testImage});

	}

	/**
	 * handler for onchange on #......
	 * @param  {[type]} image [description]
	 * @return {[type]}       [description]
	 */
	ViewController.prototype.processImage = function(image){
		// document.getElementById('source-image').src = image;
		this.imageEl = document.getElementById('source-image');
		// console.log('ViewController.loadImage', this.imageEl);

		this.imageModel = new app.ImageModel(this.imageEl);		
		this.imageModel.init().then(function(res){
			// console.log('res', res);
		  // console.log('From ViewController Instance:  this.imageModel', this.imageModel.canvas);
		  this.makeMosaic(this.imageModel.canvas);
			
		}.bind(this));  //NEED a promise here?
		//TODO: process rejection

	};

	ViewController.prototype.makeMosaic = function(canvas){
		// debugger;
		console.log('img data length', canvas.data.length);
		// console.log('canvas.data', canvas.data);
		// var buffer = canvas.data.buffer;
		// console.log('canvas.data.buffer', buffer);
		// debugger;
		var mosaicWorker = new Worker('js/mosaic-worker.js');
		var workerData = {
			image: canvas,
			tile: this.tile
		};
		mosaicWorker.postMessage(workerData);
		//TODO optimize with ArrayBuffer   is a Uint8ClampedArray a 
		mosaicWorker.onmessage = function(e){
			if (e.data === 'done'){

			} else {
				console.log('+++++Message from worker', e);
				this.getSvgTiles(e.data);
				
			}
		}.bind(this);
		//make sure to send a special termination msg
	};

	ViewController.prototype.getSvgTiles = function(hexColorRow){
		console.log('getting SVG tiles', hexColorRow);
		//call server
		//on promise completed call this.display
	};

	ViewController.prototype.display = function(){

	};

	window.app = window.app || {};
	window.app.ViewController = ViewController;

})(window);



(function(){
	'use strict';
	/**
	 * Namespace constructor
	 * @constructor
	 */
	function MosaicApp(){
		this.vc = new app.ViewController();
		// this.model = new app.ImageData();
		// this.worker = new Worker('mosaic-maker.js')
		
	}
	
	window.mosaicApp = new MosaicApp();
	// console.log('mosaicApp', window.mosaicApp);
	window.mosaicApp.vc.processImage();  //for dev

})();



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
		this.mosaicRow = [];  //array of objects {1: hex1, 2: hex2}
		
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
		//worker returns hex colors row by row
		var mosaicWorker = new Worker('js/mosaic-worker.js');
		var workerData = {
			image: canvas,
			tile: this.tile
		};
		mosaicWorker.postMessage(workerData);
		//TODO explore optimization with Uint8ClampedArray as ArrayBuffer
		mosaicWorker.onmessage = function(e){
			if (e.data === 'done'){
				//done stuff ?
			} else {
				// console.log('Got a row of tiles from worker', e);
				this.getSvgTiles(e.data);	
			}
		}.bind(this);
		//make sure to send a special termination msg
	};

	ViewController.prototype.getHexTiles = function(hexColorRow){
		//call server
		//on promise completed call this.display
	};



	//instantate new row
	ViewController.prototype.getSvgTiles = function(hexColorRow){
		console.log('NEW ROW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
		var i, len = hexColorRow.length,
				svgObj = {},
				svgRow = [],
				promises= [];
				console.log('promises', promises);
		//tiles processed in order, keep index for display order
		
			// debugger;
			for (i = 0; i < len; i++){  //loop through all tiles in a row
			  console.log(i, ' index of ', hexColorRow.length -1 , ' tile-indexes in this row', hexColorRow[i][i]);
				svgRow[i] = new app.Resource(i, hexColorRow[i][i]);
		
				//the promises array keeps correct ordering of tiles 
				promises.push(
					new Promise(function(resolve, reject){
						new app.Resource(i, hexColorRow[i][i]).then(function(svg){
							resolve(svg);  //this gets pushed into promises array
							// console.log('tile',tile,'  svg string', svg);
						});
					})
				);

			}
			console.log('promises populated', promises);
			Promise.all(promises).then(function(values){
				console.log('values', values);
				// console.log(svgRow)
				this.display(values);
			}.bind(this));
	}

	ViewController.prototype.display = function(svgs){
		console.log('Got ', svgs.length, 'svgs', svgs);
		var svgRow = svgs.join('');
		var mosaicEl = document.getElementById('mosaic');
		var div = document.createElement('div');
		div.innerHTML = svgRow;
		// div.innerHTML
		mosaicEl.appendChild(div);

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
	console.log('mosaicApp', window.mosaicApp);
	window.mosaicApp.vc.processImage();  //for dev

})();


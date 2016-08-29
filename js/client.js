
'use strict';
(function(){

	/**
	 * ViewController module for orchestrating view & mosaic model
	 * @constructor
	 */
	function ViewController(){
		this.imageEl = document.getElementById('source-image');;
		this.mosaicEl = document.getElementById('mosaic');	;
		this.imageModel = null;
		this.tile = {
			width:  window.TILE_WIDTH,
			height: window.TILE_HEIGHT
		};
	}

	/**
	 * Handler for onchange event on file input, initiates model and image processing
	 * @param  {file} image file
	 */
	ViewController.prototype.loadImage = function(ev){
	  ev.preventDefault();
	  var dt = ev.dataTransfer;
	  if (dt.items){
	  	var file = dt.items[0].getAsFile();
	  	console.log('file', file);
	  } else {
	  	var file = dt.file[0];	
	  }
		if (!file.type.match(/^image/)){
			alert('Please upload an image file.');  //TODO replace ugly alerts!
			return;	 
		} else {
			this.imageEl.src = window.URL.createObjectURL(file);			
		}
		this.init();
	};


	ViewController.prototype.disableDefaultDrag = function(ev) {
		ev.preventDefault();
	};

	/**
	 * Reset mosaic div
	 */
	ViewController.prototype.reset = function(){
		this.mosaicEl.innerHTML = '';
	};

	/**
	 * Instantiates the mosaic model, starts web worker processing, and inits view for render
	 * @param  {file} image file
	 */
	ViewController.prototype.init = function(image){
		// this.resetView();
		this.imageModel = new app.ImageModel(this.imageEl);		
		this.imageModel.init().then(function(res){
			//init pixel computations
		  this.initMosaicWorker(this.imageModel.canvas);
		  console.log('imageModel', this.imageModel);
		}.bind(this)); 
	};


	/**
	 * Initiates computation of mosaic with web worker
	 * TODO explore optimization with Uint8ClampedArray as ArrayBuffer
	 * @param  {[type]} canvas [description]
	 * @return {[type]}        [description]
	 */
	ViewController.prototype.initMosaicWorker = function(canvas){
		this.mosaicWorker = new Worker('js/mosaic-worker.js');
		var workerData = {
			image: canvas,
			tile: this.tile
		};
		this.mosaicWorker.postMessage(workerData);
		this.mosaicWorker.onmessage = function(e){
			if (e.data === 'done'){
				this.mosaicWorker.terminate();
			} else {
				this.getSvgTiles(e.data);	
			}
		}.bind(this);
	};

	/**
	 * Fetch a row of tiles from the server and collect in an array of promises
	 * The promises array ensures tiles remain in the correct order
	 * @param  {array} hexColorRow  hexidecimal colors to be rendered
	 * @return {[type]}             [description]
	 */
	ViewController.prototype.getSvgTiles = function(hexColorRow){
		console.log('Fetching svg tiles for a new ROW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
		var i, len = hexColorRow.length,
				svgObj = {},
				svgRow = [],
				promises= [];
	
			for (i = 0; i < len; i++){ 
				promises.push(
					new Promise(function(resolve, reject){
						new app.Resource(i, hexColorRow[i][i]).then(
							function(svg){
							  resolve(svg);  
							}).catch(function(e){
								console.log('Error fetching tile', e);
								if (this.mosaicWorker) this.mosaicWorker.terminate();
						}.bind(this))
					}.bind(this))
				);
			}

			Promise.all(promises).then(
				function(values){
				  this.render(values);
			  }.bind(this),
			  function(reason){
			  	console.log('Promise.all fail', reason);
			  }
			);
	}

	/**
	 * Render a row of svg tiles
	 * @param  {array} svgs svg tags in string format
	 */
	ViewController.prototype.render = function(svgs){
		var div = document.createElement('div');
		div.className = 'flex-row mosaic';
		div.innerHTML = svgs.join('');
		this.mosaicEl.appendChild(div);
	};

	window.app = window.app || {};
	window.app.ViewController = ViewController;

})(window);



(function(){
	/**
	 * Namespace constructor
	 * @constructor
	 */
	function MosaicApp(){
		this.vc = new app.ViewController();		
	}
	
	window.mosaicApp = new MosaicApp();

	//For Dev
	//
	// var testEl = document.getElementById('test-image');
	// var srcEl = document.getElementById('source-image');
	// srcEl.src = testEl.src;
	// window.mosaicApp.vc.processImage();  //for dev

})();


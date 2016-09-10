
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
		this.mosaicRows = null;
	}

	/**
	 * Handler for onchange event on file input, initiates model and image processing
	 * @param  {event} ev - file load event
	 */
	ViewController.prototype.loadImage = function(ev){
	  ev.preventDefault();
	  var dt = ev.dataTransfer;
	  if (dt.items){
	  	var file = dt.items[0].getAsFile();
	  } else {
	  	var file = dt.file[0];	
	  }
		if (!file.type.match(/^image/)){
			alert('Please upload an image file.');  //todo nice UI feedback
			return;	 
		} else {
			this.imageEl.src = window.URL.createObjectURL(file);			
		}
		this.init();
	};

	/**
	 * Prevent default browser behavior when image dragged into browser window
	 * @param  {[type]} ev browser event
	 */
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
	 * Instantiates the image model, then starts web worker processing
	 */
	ViewController.prototype.init = function(){
		this.reset();
		this.imageModel = new app.ImageModel(this.imageEl);		
		this.imageModel.init().then(function(res){
		  this.initMosaicWorker(this.imageModel.canvas);   //init pixel color computations
		}.bind(this)); 
	};

	/**
	 * Initiates computation of mosaic color data with web worker
	 * TODO explore optimization with Uint8ClampedArray as ArrayBuffer
	 * @param  {[type]} canvas [description]
	 */
	ViewController.prototype.initMosaicWorker = function(canvas){
		this.mosaicRows = [];
		this.mosaicWorker = new Worker('js/mosaic-worker.js');
		var workerData = {
			image: canvas,
			tile: this.tile
		};
		this.mosaicWorker.postMessage(workerData);
		this.mosaicWorker.onmessage = function(e){
			this.mosaicRows.push(e.data);
			if (this.mosaicRows.length === 1) this.chainRows();   //kick off server calls as soon as first row of colors is available
		}.bind(this);
	};

	/**
	 * Fetch a row of tiles from the server and collect in an array of promises
	 * The promises array ensures tiles remain in the correct order
	 * @param  {array} hexColorRow  hexidecimal colors to be rendered
	 * @return {Promise<string>}             [description]
	 */
	ViewController.prototype.getSvgRow = function(hexColorRow){
		// console.log('Fetching svg tiles for a new ROW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', hexColorRow)
		var promises = hexColorRow.map(function(hexColor){
			return new app.Resource(hexColor);
		});

		return Promise.all(promises);

	};

	/**
	 * Recusively calls getSvg on each promise resolution from getSvg, 
	 * this throttles ajax calls and preserves row order for display when calling render function
	 */
	ViewController.prototype.chainRows = function(){
		console.log('start chain');
		var getRow = function(row){
			if (this.mosaicRows[row]) {    //mosaicRows will populate orders of mag faster than ajax calls are made
				this.getSvgRow(this.mosaicRows[row]).then(function(svgRow){
					// console.log('svgRow', svgRow);
					this.renderRow(svgRow);
				  row++;
					return getRow(row);
				}.bind(this)).catch(function(reason){
					alert('Error getting mosaic tiles from server.');
				});
			} else {
				console.log('final row', row ,this.mosaicRows[row]);
				return;
			}
		}.bind(this);

		getRow(0);

	};

	/**
	 * Render a row of svg tiles
	 * @param  {array} svgs svg tags in string format
	 */
	ViewController.prototype.renderRow= function(svgs){
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


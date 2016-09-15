
'use strict';
(function(){

	/**
	 * ViewController for orchestrating view & mosaic model
	 * @constructor
	 */
	function ViewController(){
		this.imageEl = document.getElementById('source-image');
		this.mosaicEl = document.getElementById('mosaic');
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
	  var dt = ev.dataTransfer,
	  		file;
	  if (dt.items){
	  	file = dt.items[0].getAsFile();
	  } else {
	  	file = dt.file[0];	
	  }
		if (!file.type.match(/^image/)){
			alert('Please upload an image file.');  //todo nice UI feedback
			return;	 
		} else {
			this.imageEl.src = window.URL.createObjectURL(file);			
		}
		this.updateUI();
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
	 * @return {Promises.<array>} array of promises 
	 */
	ViewController.prototype.getSvgRow = function(hexColorRow){
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
		var getRow = function(row){
			if (this.mosaicRows[row]) {     //mosaicRows will populate orders of mag faster than ajax calls are made
				this.getSvgRow(this.mosaicRows[row]).then(function(svgRow){
					this.renderRow(svgRow);
				  row++;
					return getRow(row);
				}.bind(this)).catch(function(reason){
					alert('Error getting mosaic tiles from server.');
				});
			} else {
				return;
			}
		}.bind(this);

		getRow(0);
	};

	/**
	 * Set UI for showing original image and mosaic
	 */
  ViewController.prototype.updateUI = function(){
  	this.imageEl.className = 'frame';
  	var dropZoneEl = document.getElementById('drop-zone');
  	dropZoneEl.style.backgroundColor = 'initial';
  	dropZoneEl.style.width = 'auto';
  	dropZoneEl.style.height = 'auto';
  };
  
	/**
	 * Render a row of svg tiles
	 * @param  {array} svgs  array of svg tags, each in string format
	 */
	ViewController.prototype.renderRow= function(svgs){
		this.mosaicEl.className = 'frame';
		var div = document.createElement('div');
		div.className = 'mosaic';
		div.style.display = 'flex';    //removes white space around svg element
		div.innerHTML = svgs.join('');
		this.mosaicEl.appendChild(div);
	};

	window.app = window.app || {};
	window.app.ViewController = ViewController;

})(window);



(function(){
	/**
	 * Namespace constructor
	 * @constructor MosaicApp
	 */
	function MosaicApp(){
		this.vc = new app.ViewController();		
	}
	
	window.mosaicApp = new MosaicApp();


})();


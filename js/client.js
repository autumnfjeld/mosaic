
(function(){
	'use strict';
	console.log('running ViewController')
	/**
	 * ViewController module for orchestrating view & mosaic computation
	 * @constructor
	 */
	function ViewController(){
		

	}

	//for initial dev
	ViewController.prototype.makeMosaic = function(){
	
	//For initial dev
		var mosaic = new window.app.Mosaic({
			original: document.getElementById('original-image'),
	    mosaicEl: document.getElementById('mosaic-image'),

		});		
	}


	window.app = window.app || {};
	window.app.ViewController = ViewController;

})(window);




(function(){
	'use strict';

	/**
	 * Namespace
	 */
	function MosaicApp(){
	  console.log('app', app)
		this.main = new app.ViewController();
	}
	
	var mosaicApp = new MosaicApp();

})();


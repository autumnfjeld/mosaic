
(function(){
	'use strict';
	console.log('running ViewController')
	/**
	 * ViewController module for orchestrating view & mosaic model
	 * @constructor
	 */
	function ViewController(){
		
		//dev
		this.makeMosaic();
	}

	//for initial dev
	ViewController.prototype.makeMosaic = function(){
		console.log('document', document);
	//For initial dev
		var mosaic = new window.app.Mosaic({
			'sourceImg': document.getElementById('source-image'),
	    'mosaicEl':  document.getElementById('mosaic')
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
		this.main = new app.ViewController();
	}
	
	var mosaicApp = new MosaicApp();

})();


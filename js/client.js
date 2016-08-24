
(function(){
	'use strict';
	console.log('running ViewController')
	/**
	 * ViewController module for orchestrating view & mosaic model
	 * @constructor
	 */
	function ViewController(){
		
	}

	/**
	 * handler for onchange on #......
	 * @param  {[type]} image [description]
	 * @return {[type]}       [description]
	 */
	ViewController.prototype.loadImage = function(image){
		document.getElementById('source-image').src = image;
		console.log('ViewController.loadImage', image);
		// debugger;
		// CALL WEBWORKER
		var mosaic = new window.app.Mosaic({
			'sourceImg': document.getElementById('source-image'),
      'mosaicEl':  document.getElementById('mosaic') //move this 
		});
	};


	window.app = window.app || {};
	window.app.ViewController = ViewController;

})(window);




(function(){
	'use strict';
	/**
	 * Namespace
	 */
	function MosaicApp(){
		this.vc = new app.ViewController();
	}
	
	window.mosaicApp = new MosaicApp();
	console.log('mosaicApp', window.mosaicApp);

})();


'use strict';
(function(){
  /**
   * Resource provider for fetching tiles (svg node string) from server
   * @constructor 
   * @param {string}  hexColor -  6 character hex 
   * @returns {Promise.<string>} returns an svg tag string
   */
  function Resource(hexColor) {

    var url = 'http://localhost:8765/color/' + hexColor;

    var promise = new Promise(function(resolve, reject){

      var xmlhttp = new XMLHttpRequest();

      //not catching net::ERR_INSUFFICIENT_RESOURCES (when MB images are loaded)
      xmlhttp.onreadystatechange = function() {
          if (this.readyState == XMLHttpRequest.DONE ) {
             if (this.status == 200) {
               resolve(this.responseText);   
             } else {
                 console.log('Status:', this.status, this);
                 reject(this.status);
             }
          }
      };
      xmlhttp.onerror = function (){
        reject(this.statusText);
      };

      xmlhttp.open("GET", url, true);
      xmlhttp.send();

    }.bind(this));

    return promise;
  }

  window.app = window.app || {}; 
  window.app.Resource = Resource;

})(window);



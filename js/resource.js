'use strict';
(function(){
  /**
   * Fetchs tiles (svg node string) from server
   * @constructor 
   * @param {string}  hexColor -  6 character hexidecimal string
   * @returns {Promise.<string>}  an svg tag string
   */
  function Resource(hexColor) {
    
    var url = window.location.origin + '/color/' + hexColor;

    var promise = new Promise(function(resolve, reject){

      var xmlhttp = new XMLHttpRequest();

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



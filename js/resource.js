'use strict';
(function(){
  /**
   * Fetchs tiles (svg node string) from server
   * @constructor 
   * @param {string}  hexColor -  6 character hexidecimal string
   * @returns {Promise.<string>}  an svg tag string
   */
  function Resource(hexColor) {
    var url, promise;
    //for herko deply process.env.PORT sets the port
    if (typeof process !== 'undefined'){
      // port = process && process.env && process.env.PORT;
      url ='https://mosaic-node-server.herokuapp.com/';
    } else {
      url = 'http://localhost:8765';
    }
    
    url = url + '/color/' + hexColor;

    promise = new Promise(function(resolve, reject){

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



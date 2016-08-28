(function(){
  'use strict';
  console.log('running?')
  /**
   * 
   * 
   * @constructor
   * @param {integer} tile - tile position in a row
   * @param {string}  hexColor -  6 character hex 
   */
  function Resource(tile, hexColor) {
    // this.svg = '';
    this.tile = tile;
    var url = 'http://localhost:8765/color/' + hexColor;

    return new Promise(function(resolve, reject){

      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function() {
          if (this.readyState == XMLHttpRequest.DONE ) {
             if (this.status == 200) {
              console.log('tile number', tile);
             	 // console.log('success', xmlhttp);
               resolve(this.responseText);     //send back svg element string
               // this.svg = xmlhttp.responseText;
             } else {
                 console.log('something else other than 200 was returned', this.status);
                 reject(this.status);
             }
          }
      };
      xmlhttp.onerror = function (){
        reject(this.statusText);
      }

      xmlhttp.open("GET", url, true);
      xmlhttp.send();
      

    }.bind(this))


  }

  // loadXMLDoc();

  window.app = window.app || {}; 
  window.app.Resource = Resource;

})(window);



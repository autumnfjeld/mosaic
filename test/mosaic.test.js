var expect = chai.expect;



describe('App', function(){
   it('should exist', function() {
        expect(window.app).to.exist;
    });
});

describe('Mosaic Maker', function() {

  describe('initilization', function(){

    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = 'comida32x32.jpg';
    var mosaic = new app.Mosaic({
      'sourceImg': image
    });

    it('should accept options', function(){
      expect(mosaic.options.sourceImg).to.eql(image);
    });

    it('should throw an error if original image is not defined', function() {
        expect(app.Mosaic).to.throw(TypeError);
    });    
    
  });


  describe('Mosaic.prototype.getTileAvgRGB', function(){

    it('should correctly compute average rgb', function(){
      var imageData = [ 255,0,246,1 , 214,0,207,1 , 155,30,204,1 , 51,30,204,1];
      var avgRGB = {r:0,g:0,b:0};

      for (i = 0; i < imageData.length; i+=4){
        avgRGB['r'] += imageData[i];
        avgRGB['g'] += imageData[i+1];
        avgRGB['b'] += imageData[i+2];
        // console.log('avgRGB', avgRGB);
      }
      for (prop in avgRGB){
        avgRGB[prop] = Math.floor(avgRGB[prop]/(imageData.length/4));
      }
      console.log('avgRGB', avgRGB);
      expect(app.Mosaic.prototype.getTileAvgRGB(0, 0, 2, 2, 2, imageData)).to.eql(avgRGB);

    });
    
  });

  describe('Mosaic.prototype.rgbToHex', function(){

    it('should correctly compute hex from rgb', function(){
      var rgb1 = {r: 51, g: 30, b: 204},
          rgb2 = {r: 155, g: 30, b: 204};

      expect(app.Mosaic.prototype.rgbToHex(rgb1)).to.eql('#331ecc');
      expect(app.Mosaic.prototype.rgbToHex(rgb2)).to.eql('#9b1ecc');
    });
  });

});




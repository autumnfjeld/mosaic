var expect = chai.expect;

var image = new Image();

describe('App', function(){
   it('should exist', function() {
        expect(window.app).to.exist;
    });
});

describe('Mosaic Maker', function() {

    var mosaic = new app.Mosaic({
      'original': image
    });

    it('should accept options', function(){
      expect(mosaic.options.original).to.eql(image);
    });

    it('should throw an error if original image is not defined', function() {
        expect(app.Mosaic).to.throw(TypeError);
    });    

});

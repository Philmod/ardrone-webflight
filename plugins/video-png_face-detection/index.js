var cv = require('opencv')
  ;

function video(name, deps) {

  var s = new cv.ImageStream()
    
  var latestImage;

  // Add a new route to fetch camera image
  deps.app.get('/camera/:id', function(req, res) {
    if (!latestImage) {
      res.writeHead(301, {"Location": "/plugin/" + name + "/images/nofeed.jpg"});
      res.end();
      return;
    }
    
    res.writeHead(200, {'Content-Type': 'image/png'});
    return res.end(latestImage, "binary");
  });

  // Stream the images into a stream of Matrices
  s.on('data', function(matrix){
    matrix.detectObject(cv.FACE_CASCADE, {}, function(e, faces) {
      if (e) return console.error('Error while detecting object on image : ', e);
      for (var i=0; i<faces.length; i++) {
        var x = faces[i];
        matrix.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
      }
      latestImage = matrix.toBuffer();
    });
  })
  deps.client.createPngStream().pipe(s);

};

module.exports = video;

function video(name, deps) {
    
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

    // Add a handler on images update
    deps.client.createPngStream()
      .on('error', console.log)
      .on('data', function(frame) { 
        latestImage = frame;
        deps.data.latestImage = latestImage; // Expose the latestImage
    }); 

};

module.exports = video;

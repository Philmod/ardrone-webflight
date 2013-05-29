var fs        = require('fs')
  , directory = 'pictures';

function picture(name, deps) {
  deps.io.sockets.on('connection', function (socket) {
    socket.on('/picture/take', function (data) {
        console.log("take picture");

        var filename = 'ardrone_' + (new Date).getTime() + '.png';

        if (!fs.existsSync(directory)) fs.mkdirSync(directory);

        var lastPng = deps.data.latestImage;
        if (lastPng) {
	        fs.writeFile('./' + directory + '/' + filename, lastPng, function(e) {
	    			if (e) socket.emit('/picture/error', 'Error while saving image : ' + JSON.stringify(e));
	    			else socket.emit('/picture/ok', filename);
	    		});
	      }
	      else socket.emit('/picture/error', 'No image.')

    });
  });
};

module.exports = picture;

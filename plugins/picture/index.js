var fs = require('fs');

function picture(name, deps) {
  deps.io.sockets.on('connection', function (socket) {
    socket.on('/picture/take', function (data) {
        console.log("take picture");

        var filename = 'ardrone_' + (new Date).getTime() + '.png';

        if (!fs.existsSync('pictures')) fs.mkdirSync('pictures');

        var lastPng = deps.data.latestImage;
        if (lastPng) {
	        fs.writeFile('/pictures/' + filename, lastPng, function(e) {
	    			if (e) socket.emit('/picture/error', 'Error while saving image : ' + JSON.stringify(e));
	    			else socket.emit('/picture/ok', filename);
	    		});
	      }
	      else socket.emit('/picture/error', 'No image.')

    });
  });
};

module.exports = picture;

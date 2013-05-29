(function (window, undefined) {
    'use strict';

    var Picture;

    Picture = function Picture(cockpit) {
        var self = this;
        console.log("Loading Picture-taker plugin.");

        // Instance variables
        this.cockpit = cockpit;

        // Add required UI elements
        $(".header-container .wrapper").prepend('<div id="picture"><img src="/plugin/picture/images/picture.png" alt="take a picture"></div>');
        
        // Send socket when click on the picture
        $('#picture').on('click', function(ev) {
          self.cockpit.socket.emit('/picture/take', {});
        });

        // Add some listeners for socket.io
        this.cockpit.socket.on('/picture/ok', function(data) {
          $.notifyBar({
            cssClass : "success",
            html     : 'Picture saved : ' + JSON.stringify(data)
          });
        });
        this.cockpit.socket.on('/picture/error', function(e) {
          $.notifyBar({
            cssClass : "error",
            html     : 'Error while saving the picture: ' + JSON.stringify(e),
            // delay    : 2000,
            // animationSpeed: "normal"
          });
        });
        
    };

    window.Cockpit.plugins.push(Picture);

}(window, undefined));

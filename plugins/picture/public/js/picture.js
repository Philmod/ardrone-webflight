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
          console.log('picture taken : ', data);
        });
        this.cockpit.socket.on('/picture/error', function(e) {
          console.log('error : ', e);
        });
        
    };

    window.Cockpit.plugins.push(Picture);

}(window, undefined));

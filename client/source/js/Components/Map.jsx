'use strict';

import React, {MapView, Component} from 'React';

var map = null;

export default class Map extends Component{
  initMap() {
    var self = this;
    var myLatLng = {lat: 16.075371, lng: 108.222260};
    var mapOptions = {
      zoom: 14,
      // draggable: false,
      zoomControl: false,
      mapTypeControl: false,
      overviewMapControl: false,
      panControl: false,
      streetViewControl: false,
      center: myLatLng
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'Hello World!',
      icon: './img/logo_short.png'
    });

    var contentString = '<div id="iw-container">' +
      '<div class="iw-title">Porcelain Factory of Vista Alegre</div>' +
      '<div class="iw-content">' +
      '<div class="iw-subTitle">History</div>' +
      '<img src="http://maps.marnoto.com/en/5wayscustomizeinfowindow/images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
      '<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
      '<div class="iw-subTitle">Contacts</div>' +
      '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>'+
      '<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>'+
      '</div>' +
      '<div class="iw-bottom-gradient"></div>' +
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString,

      // Assign a maximum value for the width of the infowindow allows
      // greater control over the various content elements
      maxWidth: 350
    });
    google.maps.event.addListener(infowindow, 'domready', function() {

      // Reference to the DIV that wraps the bottom of infowindow
      var iwOuter = $('.gm-style-iw');

      /* Since this div is in a position prior to .gm-div style-iw.
       * We use jQuery and create a iwBackground variable,
       * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
       */
      var iwBackground = iwOuter.prev();

      // Removes background shadow DIV
      iwBackground.children(':nth-child(2)').css({'display' : 'none'});

      // Removes white background DIV
      iwBackground.children(':nth-child(4)').css({'display' : 'none'});

      // Moves the infowindow 115px to the right.
      iwOuter.parent().parent().css({left: '115px'});

      // Moves the shadow of the arrow 76px to the left margin.
      iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

      // Moves the arrow 76px to the left margin.
      iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

      // Changes the desired tail shadow color.
      iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

      // Reference to the div that groups the close button elements.
      var iwCloseBtn = iwOuter.next();

      // Apply the desired effect to the close button
      iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});

      // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
      if($('.iw-content').height() < 140){
        $('.iw-bottom-gradient').css({display: 'none'});
      }

      // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
      iwCloseBtn.mouseout(function(){
        $(this).css({opacity: '1'});
      });
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

    // Try HTML5 geolocation.
    //if (navigator.geolocation) {
    //  navigator.geolocation.getCurrentPosition(function(position) {
    //    var pos = {
    //      lat: position.coords.latitude,
    //      lng: position.coords.longitude
    //    };
    //
    //    infoWindow.setPosition(pos);
    //    infoWindow.setContent('Location found.');
    //    map.setCenter(pos);
    //  }, function() {
    //    self.handleLocationError(true, infoWindow, map.getCenter());
    //  });
    //} else {
    //  // Browser doesn't support Geolocation
    //  self.handleLocationError(false, infoWindow, map.getCenter());
    //}
  }

  //handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //  infoWindow.setPosition(pos);
  //  infoWindow.setContent(browserHasGeolocation ?
  //    'Error: The Geolocation service failed.' :
  //    'Error: Your browser doesn\'t support geolocation.');
  //}

  componentDidMount(){
    this.initMap();
  }

  render(){
    return (
      <div id="map"></div>
    );
  }
}

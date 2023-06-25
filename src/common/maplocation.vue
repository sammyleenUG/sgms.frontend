<template>

</template>

<script>
import Swal from "sweetalert2"

export default {
  name: 'map-location',
  props: {
    latitude: {
      type: String,
      required: false,
    },
    longitude: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      required: true
    },
    readonly: {
      type: Boolean,
      required: false
    }
  },
  mounted() {
    this.showMap = this.show;
  },
  created() {
    this.getUserLocation();
  },
  data() {
    return {
      // userLatitude: 0.34454,
      // userLongitude: 32.61092,
      userLatitude: null,
      userLongitude: null,
      markers: [],
      OriginalMarker: null,
      draggedMaker: null,
      markerSearch: null,
      changeLocation: true,
      showMap: false,
      userPlace: '',
      userAddress: '',
    }
  },
  methods: {

    getUserLocation() {
      let app = this;
      if (!navigator.geolocation) {
        $.getJSON('https://ipapi.co/json/', function (data) {
          app.userLatitude = data.latitude;
          app.userLongitude = data.longitude;
        });
        return Swal.fire('Info', 'Geolocation not supported by your browser', 'info')
      }
      navigator.geolocation.getCurrentPosition(function (position) {
        app.userLatitude = position.coords.latitude;
        app.userLongitude = position.coords.longitude;
      }, function () {
        $.getJSON('https://ipapi.co/json/', function (data) {
          app.userLatitude = data.latitude;
          app.userLongitude = data.longitude;
        });
      });
    },

    setCoordinateData(latitude, longitude) {
      let app = this;
      app.userLatitude = latitude;
      app.userLongitude = longitude;
    },

    openLocationMap() {

      let app = this;

      Swal.fire({
        title: '<small style="font-size: 14px;">' + app.title + '</small>',
        padding: 20,
        html: app.readonly ?
          "<div class='row' id='unicef-map-container' style='height: 400px; margin: 10px 3px;'></div>" : "<div class='input-group'>" +
          "<input type='text' class='form-control' id='search-place'>" +
          "<div class='input-group-append'><i class='fas fa-search input-group-text' style='color: #666; font-size: 13px;'></i></div></div>" +
          "<div class='row' id='unicef-map-container' style='height: 400px; margin: 10px 3px;'></div>",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#D33',
        confirmButtonText: 'Yes, Use This Location',
        allowOutsideClick: false,
        showConfirmButton: !app.readonly,
        onClose() {
          app.showMap = false;
        },
        onOpen: () => {
          if (app.latitude != null && app.longitude != null) {
            app.userLatitude = parseFloat(app.latitude);
            app.userLongitude = parseFloat(app.longitude);
          }
          setTimeout(function () {
            app.drawMap(app.userLatitude, app.userLongitude);
          },2000);

        }
      }).then((confirm) => {
        if (confirm.value) {
          if (app.markerSearch != null) {
            app.onGeodecode(app.markerSearch)
          } else if (app.draggedMaker != null) {
            app.onGeodecode(app.draggedMaker)
          } else {
            app.onGeodecode(app.OriginalMarker)
          }
          app.changeLocation = false;
        } else {}
      });
    },

    drawMap(lat, lng) {
      var app = this

      var mapId = document.getElementById('map-container'),
        map;
      map = new google.maps.Map(mapId, {
        center: new google.maps.LatLng(lat, lng),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      app.OriginalMarker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        draggable: !app.readonly,
        map: map
      });

      app.markers.push(app.OriginalMarker)

      if (!app.readonly) {
        var input = (document.getElementById('search-place'));
        var autoComplete = new google.maps.places.Autocomplete(input);

        autoComplete.setComponentRestrictions({
          country: ["ug"],
        });

        autoComplete.addListener('place_changed', function () {
          var place = autoComplete.getPlace();

          if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          app.userAddress = place.formatted_address;
          app.userPlace = place.name;

          app.setMapOnAll(null, app.markers)
          app.markerSearch = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            draggable: true,
          });

          app.userLatitude = place.geometry.location.lat()
          app.userLongitude = place.geometry.location.lng()

          app.draggedMaker = null
          app.OriginalMarker = null
          app.markers.push(app.markerSearch)

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }

          app.dragMarker(app.markerSearch, map)
          map.panTo(app.markerSearch.getPosition());
        });

        app.dragMarker(app.OriginalMarker, map)

        google.maps.event.trigger(map, 'resize');
        map.panTo(app.OriginalMarker.getPosition());
      }
    },

    dragMarker(marker, map) {
      var app = this;
      app.draggedMaker = null

      var btn = $(".swal2-confirm");
      google.maps.event.addListener(marker, 'dragend', function (event) {
        app.markerSearch = null
        app.draggedMaker = marker

        btn.text('Yes, Use This Location');
      });

      google.maps.event.addListener(marker, 'dragstart', function (event) {
        btn.text(' loading');
        $("<i class=\"fa fa-spinner fa-spin\"> </i>").prependTo(`.swal2-confirm`);
      });

      map.panTo(marker.getPosition());
      map.setZoom(17);

      google.maps.event.trigger(map, 'resize');
    },

    setMapOnAll(map, markers) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    },

    onGeodecode(marker) {
      var position = marker.getPosition();
      let app = this;

      var latlng = {
        lat: parseFloat(position.lat()),
        lng: parseFloat(position.lng()),
      };

      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({
        location: latlng
      }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          app.userAddress = results[0].formatted_address;
          app.setCoordinateData(position.lat(), position.lng());
          app.onSelectLocation();
        } else {
          app.setCoordinateData(position.lat(), position.lng());
          app.onSelectLocation();
        }
      });
    },

    onSelectLocation() {
      let app = this;
      this.$emit('clicked', {
        lat: app.userLatitude,
        lng: app.userLongitude,
        addr: app.userAddress,
        place: app.userPlace,
      });
    }
  },

  watch: {
    show: function (newVal, oldVal) {
      this.openLocationMap();
    }
  }
}
</script>

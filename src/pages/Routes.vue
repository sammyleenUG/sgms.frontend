<template>
  <div id="map"></div>
</template>
<script>

import Swal from "sweetalert2";
import axios from "axios";
import {main_system_url} from "@/common/main_system_url";
import {token} from "@/common/token";

export default {
  data () {
    return {
      isloading: false,
      bins: null,
    }
  },

  mounted(){
    this.getBins()
  },

  methods: {
    async getBins(){
      await axios.get(main_system_url + '/api/bins', {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          this.bins = response.data.bins;
          this.initMap(this.bins);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    initMap(bins) {
      let app = this;
      setTimeout(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: latitude, lng: longitude },
              });

              const userLocation = new google.maps.LatLng(
                latitude, longitude
              );

              //kiteezi dumping site
              const destination = new google.maps.LatLng(
                0.4111145128249173, 32.5757945204573
              );

              app.setupUsersLocation(map,userLocation);
              app.setupDestinationLocation(map,destination)
              app.setupBins(map,bins);
              app.setupRoute(map,userLocation,destination);
            },
            (error) => {
              console.error('Error getting current location:', error);
              // Handle error if user denies or there's an issue getting the location
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
          // Handle error if browser does not support geolocation
        }
      }, 500);
    },

    setupRoute(map,userLocation,destination){
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true, // Suppress the default markers
      });

      // Configure the DirectionsRequest object
      const request = {
        origin: userLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING, // You can change the travel mode if needed
      };

      // Call the route() method of DirectionsService to get the route
      directionsService.route(request, (response, status) => {
        if (status === 'OK') {
          // Display the route on the map
          directionsRenderer.setDirections(response);
        } else {
          console.error('Directions request failed:', status);
        }
      });
    },

    setupBins(map,bins){

      console.log(bins);
      const geocoder = new google.maps.Geocoder();

      // Loop through your API data array
      for (const place of bins) {
        const { bin_reference_number,status } = place;
        let { latitude, longitude } = place;

        // Convert latitude and longitude to numbers
        latitude = +latitude;
        longitude = +longitude;

        let markerIcon = '';

        // Set marker icon based on status
        if (status === 'Full') {
          markerIcon = 'img/icons/red-bin.png';
        } else if (status === 'Filling') {
          markerIcon = 'img/icons/green-bin.png';
        } else if (status === 'Empty') {
          markerIcon = 'img/icons/blue-bin.png';
        }

        const marker = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          title: bin_reference_number,
          icon: {
            url: markerIcon,
            scaledSize: new google.maps.Size(40, 40),
          },
        });

        // Reverse geocode the user's location to get the place name
        // geocoder.geocode({ location: {
        //       lat: latitude,
        //       lng: longitude
        //     }
        //   }, (results, status) => {
        //   if (status === 'OK' && results[0]) {
        //     // Get the formatted address for the user's location
        //     const userPlaceName = results[0].formatted_address;
        //
        //     // Set the marker label to the user's place name
        //     marker.setLabel(userPlaceName);
        //   } else {
        //     console.error('Reverse geocoding failed for user location:', status);
        //   }
        // });


        // Show info window when marker is clicked
        marker.addListener('click', () => {
          let html = '<b>Location</b><br> ' + place.location + '<hr>';
          html += '<b>Status</b><br>' + place.status + '<hr>';
          html += '<b>Bin Level</b><br>' + place.bin_level + '<hr>';
          html += '<b>Air Quality</b><br>' + place.air_quality + '<hr>';

          Swal.fire({
            title: bin_reference_number,
            html: '<div class="text-left">' + html + '</div>',
            showCancelButton: false,
            showConfirmButton: false,
          });
        });

      }
    },

    setupUsersLocation(map,userLocation){

      const userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        label: 'You are here',
      });

      const geocoder = new google.maps.Geocoder();

      // // Reverse geocode the user's location to get the place name
      // geocoder.geocode({ location: userLocation }, (results, status) => {
      //   if (status === 'OK' && results[0]) {
      //     // Get the formatted address for the user's location
      //     const userPlaceName = results[0].formatted_address;
      //
      //     // Set the marker label to the user's place name
      //     userMarker.setLabel(userPlaceName);
      //   } else {
      //     console.error('Reverse geocoding failed for user location:', status);
      //   }
      // });

    },

    setupDestinationLocation(map,destination){

      // Create a marker for the destination with a label
      const destinationMarker = new google.maps.Marker({
        position: destination,
        map: map,
        label: 'Kiteezi Dumping site',
      });

      const geocoder = new google.maps.Geocoder();

      // // Reverse geocode the destination to get the place name
      // geocoder.geocode({ location: destination }, (results, status) => {
      //   if (status === 'OK' && results[0]) {
      //     // Get the formatted address for the destination
      //     const destinationPlaceName = results[0].formatted_address;
      //
      //     // Set the marker label to the destination place name
      //     destinationMarker.setLabel(destinationPlaceName);
      //   } else {
      //     console.error('Reverse geocoding failed for destination:', status);
      //   }
      // });
    }


  }
}
</script>
<style>
#map {
  min-height: calc(100vh - 123px);
}
</style>

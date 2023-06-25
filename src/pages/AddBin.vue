<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <h4 slot="header" class="card-title">Add Bin</h4>
            <form @submit.prevent="submit()">
              <div class="row">
                <div class="col-md-6">
                  <base-input type="number"
                              label="Bin Capacity (cm)"
                              placeholder="20"
                              v-model="bin_capacity" required>
                  </base-input>
                </div>

              </div>

              <div class="row">

                <div class="col-md-6">
                  <base-input type="text"
                              label="Location"
                              placeholder="kampala,Uganda"
                              @click="openLocationPicker"
                              id="location-guy"
                              v-model="location.name" required>
                  </base-input>
<!--                  <input-->
<!--                    v-model="location"-->
<!--                    placeholder="kampala,Uganda"-->
<!--                    @click="openLocationPicker"-->
<!--                    class="form-control"-->
<!--                    aria-describedby="addon-right addon-left">-->
                </div>

              </div>
              <div class="row">

                <div class="col-md-6">
                  <label>Supervisor</label>
                  <select class="form-control" v-model="supervisor" required>
                    <option v-for="supervisor in supervisors" :value="supervisor.id">
                      {{ supervisor.name }}
                    </option>
                  </select>
<!--                  <base-input type="email"-->
<!--                              label="Supervisor"-->
<!--                              placeholder="john Doe"-->
<!--                              v-model="supervisor">-->
<!--                  </base-input>-->
                </div>
              </div>


              <div class="text-center">
                <button type="submit" class="btn btn-info btn-fill float-right">
                  Submit
                </button>
              </div>
              <div class="clearfix"></div>
            </form>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Card from 'src/components/Cards/Card.vue'
import Swal from "sweetalert2";
import axios from "axios";
import {main_system_url} from "@/common/main_system_url";
import {token} from "@/common/token";
import alert from "@/common/mixins/alert";

export default {
  mixins: [alert],
  components: {
    Card
  },
  data () {
    return {
      bin_capacity: 20,
      location: {
        coords: '',
        name: '',
      },
      supervisor: '',
      supervisors: [],
    }
  },
  mounted(){
    this.getStaff();
  },
  methods: {
    submit () {

      let app = this;

      let formData = new FormData();
      formData.append('location',this.location.coords);
      formData.append('supervisor_id',this.supervisor);
      formData.append('bin_capacity',this.bin_capacity)

      Swal.showLoading();

      axios.post(main_system_url + '/api/bins', formData,{
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        }).then((response) => {
          app.$router.go();
          app.showSuccessMessage('Added bin details successfully');
        })
        .catch((error) => {
          // Handle any error that occurred during the request
          if (error.response && error.response.status === 422) {
            // If the response has a status code of 422 (Unprocessable Entity)
            const responseData = error.response.data;
            if (responseData && responseData.errors && responseData.errors.phone_number) {
              const errorMessage = responseData.errors.phone_number[0];
              app.showErrorMessage(errorMessage);
              // Display the error message to the user or handle it accordingly
            }
          } else {
            app.showErrorMessage(error);
          };
        });
    },

    getStaff(){
      axios.get(main_system_url + '/api/supervisors', {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }).then((response) => {
          this.supervisors = response.data;
        }
      ).catch((error) => {
        console.error("Error:", error);
      })
    },

    openLocationPicker: function () {
      Swal.fire({
        title: 'Select bin location',
        html: '<div id="map"></div>',
        showCancelButton: false,
        showConfirmButton: false,
        didRender: () => {
          this.initMap();
        },
      });
    },

    initMap() {
      let app = this;
      setTimeout(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: latitude, lng: longitude },
                zoom: 12,
              });

              // Add click event listener to the map
              map.addListener('click', (event) => {
                  const clickedLocation = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                  };

                // Reverse geocode the selected location to get the place name
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: clickedLocation }, (results, status) => {
                  if (status === 'OK' && results[0]) {

                    console.log(results);

                    const placeName = results[0].formatted_address;

                    app.location.name = placeName;
                    app.location.coords = clickedLocation.lat + ', ' + clickedLocation.lng;
                    Swal.close();
                  } else {
                    app.showErrorMessage('Geo failed')
                  }
                });

              });
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
  },
}

</script>
<style>
.swal2-popup {
  font-size: 0.875rem; /* Adjust the font size as needed */
}

.swal2-title {
  font-size: 1rem; /* Adjust the title font size as needed */
}

.swal2-content {
  font-size: 0.875rem; /* Adjust the content font size as needed */
}

</style>


<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card class="strpied-tabled-with-hover"
                body-classes="table-full-width table-responsive"
          >
            <template slot="header">
              <div class="row">

                  <div class="col-9">
                    <h4 class="card-title">Staff</h4>
                    <p class="card-category">Here is a list of staff registered to the system</p>
                  </div>
                  <div class="col-3 text-right pr-4">
                    <button class="btn btn-primary btn-fill" @click="triggerAdd()">
                      <i class="nc-icon nc-simple-add pr-2"></i>Add Supervisor
                    </button>
                  </div>

              </div>
            </template>
            <div style="margin-left:1rem">
              <l-table v-if="!isloading && supervisors.length > 0" class="table-hover table-striped table-sm"
                       :columns="columns"
                       :data="supervisors"
                       endpoint="staff"
              >
              </l-table>
            </div>
            <div class="text-center" v-if="isloading">
              <span class="spinner spinner-border" style="display: inline-block;"></span>
            </div>
          </card>

        </div>

      </div>
    </div>
  </div>
</template>
<script>

import Card from 'src/components/Cards/Card.vue'
import axios from 'axios'
import {main_system_url} from "@/common/main_system_url";
import {token} from "@/common/token";
import LTable from 'src/components/Table.vue';
import alert from "@/common/mixins/alert";
import Swal from 'sweetalert2';

export default {
  mixins: [alert],
  components: {
    Card,
    LTable,
  },
  data () {
    return {
      columns:[
        'name',
        'email',
        'phone_number'
      ],
      supervisors: [],

      isloading: false,
    }
  },
  mounted() {
    this.getStaff();
  },
  methods:{

    getStaff(){
      this.isloading = true;
      axios.get(main_system_url + '/api/supervisors', {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }).then((response) => {
          // console.log('repsonse',response)
          this.supervisors = response.data;
          this.isloading = false
        }
      ).catch((error) => {
        console.error("Error:", error);
      })
    },
    triggerAdd(){

        Swal.fire({
          title: 'Add Supervisor',
          html: `
          <p class="text-warning">Required fields are marked with a *</p>
          <input id="name" class="swal2-input" placeholder="Name*" required="true"/>
          <input type="email" id="email" class="swal2-input" placeholder="Email*" required="true"/>
          <input type="number" id="phone" class="swal2-input" placeholder="Phone Number" />
          <input id="password" type="password" class="swal2-input" placeholder="Password*" required="true"/>
          <input id="confirm" type="password" class="swal2-input" placeholder="Confirm Password*" required="true"/>
        `,
          showCancelButton: true,
          confirmButtonText: 'Submit',
          showLoaderOnConfirm: true,

          didOpen: () => {
            Swal.getPopup().querySelector('#name').focus();
          },
          inputAttributes: {
            autocapitalize: 'on'
          },
          preConfirm: () => {
            const name = Swal.getPopup().querySelector('#name').value;
            const email = Swal.getPopup().querySelector('#email').value;
            const phone_number = Swal.getPopup().querySelector('#phone').value;
            const password = Swal.getPopup().querySelector('#password').value;
            const confirm = Swal.getPopup().querySelector('#confirm').value;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(name == '' || email == '' || password == '' || confirm == '') {
              Swal.showValidationMessage('Please fill all required fields');
            }

            else if (!emailRegex.test(email)) {
              Swal.showValidationMessage('Invalid email address');
            }


            else if (password !== confirm) {
              Swal.showValidationMessage('Passwords do not match');
            }else{

              const formData = new FormData();
              formData.append('name',name);
              formData.append('email',email);
              formData.append('phone_number',phone_number)
              formData.append('password',password)
              formData.append('password_confirmation',confirm)
              formData.append('role','Supervisor')

              return axios.post(main_system_url + '/api/create-account', formData)
                .then((response) => {
                  console.log(response)
                  if(response.status !== 200){
                    throw new Error(response.status);
                  }

                  return response;
                })
                .catch((error) => {
                  // Handle any error that occurred during the request
                  if (error.response && error.response.status === 422) {
                    // If the response has a status code of 422 (Unprocessable Entity)
                    const responseData = error.response.data;
                    if (responseData && responseData.errors && responseData.errors.phone_number) {
                      const errorMessage = responseData.errors.phone_number[0];
                      Swal.showValidationMessage(errorMessage);
                      // Display the error message to the user or handle it accordingly
                    }
                  } else {
                    Swal.showValidationMessage(error);
                  };
                });
              }

            },
          allowOutsideClick: () => !Swal.isLoading(),

        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.go();
            this.showSuccessMessage('Staff has been registered successfully')
          }
        });
    },
  }
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

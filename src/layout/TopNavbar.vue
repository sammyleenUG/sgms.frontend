<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <button type="button"
              class="navbar-toggler navbar-toggler-right"
              :class="{toggled: $sidebar.showSidebar}"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
              @click="toggleSidebar">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">
        <ul class="navbar-nav ml-auto pl-4">
          <base-dropdown :title="user">
            <a class="dropdown-item pl-4 pt-4" href="#">
              Get Help
              <br><span class="text-muted" style="font-size:0.8rem;">Are you stack?</span>
            </a>
            <a class="dropdown-item pl-4" href="#" @click.prevent="logout()">
              Logout
              <br><span class="text-muted" style="font-size:0.8rem;">End session</span>
            </a>
          </base-dropdown>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
  import axios from "axios";
  import {main_system_url} from "@/common/main_system_url";
  import {token} from "@/common/token";
  import Swal from "sweetalert2";
  import alert from "@/common/mixins/alert";

  export default {
    mixins: [alert],
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },
    data () {
      return {
        activeNotifications: false,
        user: null,
      }
    },

    mounted(){
      this.user = localStorage.getItem('user')
    },
    methods: {
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      },

      logout(){
        let app = this;
        Swal.showLoading();

        axios.post(main_system_url + '/api/logout','',{
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }).then((response) => {
          localStorage.clear()
          app.showInfoMessage('Session ended');
          app.$router.go();
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
      }
    }
  }

</script>
<style>

</style>

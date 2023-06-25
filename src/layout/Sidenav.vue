<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/admin/dashboard">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/admin/staff">
        <i class="nc-icon nc-circle-09"></i>
        <p>Supervisors</p>
      </sidebar-link>

      <sidebar-link to="/admin/bins">
        <i class="nc-icon nc-app"></i>
        <p>Bins</p>
      </sidebar-link>

<!--      <sidebar-link to="/admin/icons">-->
<!--        <i class="nc-icon nc-atom"></i>-->
<!--        <p>Icons</p>-->
<!--      </sidebar-link>-->
      <sidebar-link to="/admin/routes">
        <i class="nc-icon nc-pin-3"></i>
        <p>Routes</p>
      </sidebar-link>
      <sidebar-link to="/admin/notifications">
        <i class="nc-icon nc-bell-55"></i>
        <p>Notifications</p>
      </sidebar-link>
      <sidebar-link to="/admin/reports">
        <i class="nc-icon nc-paper-2"></i>
        <p>Reports</p>
      </sidebar-link>

    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './MobileMenu.vue'
  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      },

    }
  }

</script>

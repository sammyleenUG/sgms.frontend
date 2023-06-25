import DashboardLayout from '../layout/Sidenav.vue'
// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'
import {main_system_url} from "@/common/main_system_url";

// Admin pages
import Overview from '@/pages/Dashboard.vue'
import UserProfile from 'src/pages/UserProfile.vue'
import TableList from 'src/pages/TableList.vue'
import Icons from 'src/pages/Icons.vue'
import Routes from 'src/pages/Routes.vue'
import Notifications from 'src/pages/Notifications.vue'
import Bins from "@/pages/Bins";
import Staff from "@/pages/Staff";
import {token} from "@/common/token";
import AddBin from "@/pages/AddBin";
import Reports from "@/pages/Reports";

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
      // Retrieve values from URL parameters
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const user = params.get('user');

      // Save the session using localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);



      // Clear URL parameters
      window.history.replaceState({}, document.title, to.path);


      if (token) {
        // Proceed to the route
        next('/admin/dashboard');
      } else {
        // Redirect to the login page or any other desired page
        window.location.href = main_system_url + '/login-through-app';
      }
    }
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Overview
      },
      {
        path: 'staff',
        name: 'Staff',
        component: Staff
      },
      {
        path: 'bins',
        name: 'Bins',
        component: Bins
      },

      {
        path: 'add-bin',
        name: 'Add-Bin',
        component: AddBin,
      },

      {
        path: 'icons',
        name: 'Icons',
        component: Icons
      },
      {
        path: 'routes',
        name: 'Routes',
        component: Routes
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      },

      {
        path: 'reports',
        name: 'reports',
        component: Reports
      },


      // {
      //   path: 'user',
      //   name: 'User',
      //   component: UserProfile
      // },
    ],
    beforeEnter: (to, from, next) => {
      // Check if token and user are set in localStorage

      if (token) {
        // Proceed to the route
        next();
      } else {
        // Redirect to the login page or any other desired page
        window.location.href = main_system_url + '/login-through-app';
      }
    }
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes

import Swal from 'sweetalert2';

export default {
  methods:{
    showErrorMessage: function (message) {
      Swal.fire({
        icon: 'error',
        text: message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    },

    showSuccessMessage: function (message) {
      Swal.fire(
        'Yay',
        message,
        'success'
      );
    },

    showInfoMessage: function (message) {
      Swal.fire({
        icon: 'info',
        text: message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }
  }
}

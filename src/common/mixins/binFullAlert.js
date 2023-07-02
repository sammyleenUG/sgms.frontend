import Swal from 'sweetalert2';
import axios from "axios";
import {main_system_url} from "@/common/main_system_url";
import {token} from "@/common/token";

export default {
  data () {
    return {
      bins: null,
    }
  },
  mounted(){

  },
  methods:{
    checkFullBin(){
      await axios.get(main_system_url + '/api/check-full-bin', {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if(response.data.bins){

          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
}

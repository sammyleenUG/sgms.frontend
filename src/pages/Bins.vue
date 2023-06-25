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
                  <h4 class="card-title">Bins</h4>
                  <p class="card-category">Here is a list of bins registered to the system</p>
                </div>
                <div class="col-3 text-right pr-4">
                  <a type="button" class="btn btn-primary btn-fill" href="/#/admin/add-bin">
                    <i class="nc-icon nc-simple-add pr-2"></i>Add Bin
                  </a>
                </div>

              </div>
            </template>
            <div style="margin-left:1rem">
            <l-table v-if="!isloading && bins.length > 0" class="table-hover table-striped table-sm"
                     :columns="columns"
                     :data="bins"
                     endpoint="bins"
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
import LTable from 'src/components/Table.vue'
import Card from 'src/components/Cards/Card.vue'
import {main_system_url} from "@/common/main_system_url";
import {token} from "@/common/token";
import axios from 'axios';

export default {
  components: {
    LTable,
    Card
  },
  data () {
    return {
      columns:[
        'bin_reference_number',
        'location',
        'status',
        'bin_capacity',
        'air_quality',
        'bin_level',
        'created_at'
      ],

      bins:[],

      isloading: false,
    }
  },
  mounted(){
    this.getBins();
  },
  methods:{
    async getBins(){
      this.isloading = true;

      await axios.get(main_system_url + '/api/bins', {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // console.log(response)
          this.bins = response.data.bins;
          // console.log('bin',Object.values(this.bins))
          this.isloading = false
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
}
</script>
<style>
</style>

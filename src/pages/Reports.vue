<template xmlns="http://www.w3.org/1999/html">
  <div class="content">
    <div class="container-fluid">
      <card>
        <div class="row">
          <div class="col-8">
            <label>Please identify the report you would like to export</label>
            <select v-model="report_type" class="form-control">
              <option value="all_bin_levels">Bin Levels</option>
              <option value="all_air_quality">Air Quality</option>
              <option value="single_bin_levels">Single Bin Bin Levels</option>
              <option value="single_air_quality">Single Bin Air Quality</option>
            </select>
          </div>
          <div class="col-4" v-if="report_type == 'single_bin_levels' || report_type == 'single_air_quality'">
            <label>Select Bin</label>
            <select v-model="bin_selected" class="form-control">
              <option v-for="bin in bins" value="bin.id" >
                {{ bin.bin_reference_number }}
              </option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <l-table v-if="bin_levels" class="table-hover table-striped table-sm"
                     :columns="bin_levels_columns"
                     :data="bin_levels"
                     endpoint="export">
            </l-table>
            <l-table v-else-if="air_quality" class="table-hover table-striped table-sm"
                     :columns="air_quality_columns"
                     :data="air_quality"
                     endpoint="export">
            </l-table>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import Card from 'src/components/Cards/Card.vue'
import axios from "axios";
import {main_system_url} from "@/common/main_system_url";
import {token} from "@/common/token";
import LTable from "@/components/Table";


export default {
  components: {
    Card,
    LTable,
  },
  data () {
    return {
      report_type: '',
      bins: null,
      bin_selected: null,

      bin_levels_columns: ['bin_reference_number','bin_level','created_at'],
      air_quality_columns: ['bin_reference_number','bin_air_quality','created_at'],

      bin_levels:null,
      air_quality: null
    }
  },

  mounted(){
    this.fetchBins();


  },

  watch: {
    report_type: function(newValue,oldValue){
      let app = this
      if(newValue == 'all_bin_levels'){
        app.fetchBinLevels();
      }

      if(newValue == 'all_air_quality'){
        app.fetchAirQuality();
      }
    }
  },
  methods: {
    async fetchBins(){
      await axios.get(main_system_url + '/api/bins', {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          this.bins = response.data.bins;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    async fetchBinLevels(){
      await axios.get(main_system_url + '/api/reports/levels', {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          this.bin_levels = response.data.bin_levels;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    async fetchAirQuality(){
      await axios.get(main_system_url + '/api/reports/quality', {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          this.air_quality = response.data.bin_air_quality;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

  }
}

</script>
<style lang="scss">

</style>

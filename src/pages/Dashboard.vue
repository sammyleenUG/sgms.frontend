<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="nc-icon nc-app text-success"></i>
            </div>
            <div slot="content">
              <p class="card-category">Bins</p>
              <h4 class="card-title">{{ total }}</h4>
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-success">
              <i class="nc-icon nc-layers-3 text-danger"></i>
            </div>
            <div slot="content">
              <p class="card-category">Full</p>
              <h4 class="card-title">+{{ full }}</h4>
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-danger">
              <i class="nc-icon nc-circle text-warning"></i>
            </div>
            <div slot="content">
              <p class="card-category">Filling</p>
              <h4 class="card-title">+{{ filling }}</h4>
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-info">
              <i class="nc-icon nc-nc-check-2 text-success"></i>
            </div>
            <div slot="content">
              <p class="card-category">Empty</p>
              <h4 class="card-title">+{{ empty }}</h4>
            </div>

          </stats-card>
        </div>

      </div>
      <div class="row">
        <div class="col-md-8">
          <chart-card
            :chart-data="barChart.data"
            :chart-options="barChart.options"
            :chart-responsive-options="barChart.responsiveOptions"
            chart-type="Bar" v-if="!isprocessing">
            <template slot="header">
              <h4 class="card-title">General Stats</h4>
              <p class="card-category">Bin levels with Bin Air Quality</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Average Bin Levels
                <i class="fa fa-circle text-danger"></i> Average Air Quality
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-check"></i> Data information certified
              </div>
            </template>
          </chart-card  >
          <div class="text-center" v-if="isprocessing">
            <span class="spinner spinner-border" style="display: inline-block;"></span>
          </div>
        </div>
        <div class="col-md-4">
          <chart-card :chart-data="pieChart.data" chart-type="Pie" v-if="!isprocessing">
            <template slot="header">
              <h4 class="card-title">Performance</h4>
              <p class="card-category">Response to garbage emptying</p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> In time
                <i class="fa fa-circle text-danger"></i> Delayed
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-clock-o"></i> Updated moments ago
              </div>
            </template>
          </chart-card>
          <div class="text-center" v-if="isprocessing">
            <span class="spinner spinner-border" style="display: inline-block;"></span>
          </div>
        </div>
      </div>
<!--      <div class="row">-->
<!--        <div class="col-md-12">-->
<!--          <chart-card :chart-data="lineChart.data"-->
<!--                      :chart-options="lineChart.options"-->
<!--                      :responsive-options="lineChart.responsiveOptions" v-if="!isprocessing">-->
<!--            <template slot="header">-->
<!--              <h4 class="card-title">Insights and Trends </h4>-->
<!--              <p class="card-category">Comprehensive Daily Statistics for Bin Fill Analysis</p>-->
<!--            </template>-->
<!--            <template slot="footer">-->
<!--              <div class="legend">-->
<!--                <i class="fa fa-circle text-info"></i> Bin Levels-->
<!--              </div>-->
<!--              <hr>-->
<!--              <div class="stats">-->
<!--                <i class="fa fa-history"></i> Updated 3 minutes ago-->
<!--              </div>-->
<!--            </template>-->
<!--          </chart-card>-->
<!--          <div class="text-center" v-if="isprocessing">-->
<!--            <span class="spinner spinner-border" style="display: inline-block;"></span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

    </div>
  </div>
</template>
<script>
  import ChartCard from 'src/components/Cards/ChartCard.vue'
  import StatsCard from 'src/components/Cards/StatsCard.vue'
  import LTable from 'src/components/Table.vue'
  import {main_system_url} from "@/common/main_system_url";
  import axios from "axios";

  export default {
    components: {
      LTable,
      ChartCard,
      StatsCard
    },
    data () {
      return {
        empty: 0,
        full: 0,
        filling: 0,
        total: 0,

        isprocessing: true,

        editTooltip: 'Edit Task',
        deleteTooltip: 'Remove',
        pieChart: {
          data: {
            labels: ['40%', '20%', '40%'],
            series: [40,40]
          }
        },
        // lineChart: {
        //   data: {
        //     labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
        //     series: [
        //       [287, 385, 490, 492, 554, 586, 698, 695],
        //     ]
        //   },
        //   options: {
        //     low: 0,
        //     high: 800,
        //     showArea: false,
        //     height: '245px',
        //     axisX: {
        //       showGrid: false
        //     },
        //     lineSmooth: true,
        //     showLine: true,
        //     showPoint: true,
        //     fullWidth: true,
        //     chartPadding: {
        //       right: 50
        //     }
        //   },
        //   responsiveOptions: [
        //     ['screen and (max-width: 640px)', {
        //       axisX: {
        //         labelInterpolationFnc (value) {
        //           return value[0]
        //         }
        //       }
        //     }]
        //   ]
        // },
        barChart: {
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [
              [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
              [412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636, 695]
            ]
          },
          options: {
            seriesBarDistance: 10,
            axisX: {
              showGrid: false
            },
            height: '245px'
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc (value) {
                  return value[0]
                }
              }
            }]
          ]
        },

      }
    },
    mounted(){
      this.getStatisticalData();
    },
    methods: {
      getStatisticalData(){
        axios.get(main_system_url + '/api/statistics')
          .then((response) => {
            this.empty = response.data.empty_bins;
            this.full = response.data.full_bins;
            this.filling = response.data.filling_bins;
            this.total = this.empty + this.full + this.filling;

            let bin_levels_per_hour = response.data.bin_level__per_hour_graph;

            let bin_air_quality_per_hour = response.data.bin_air_quality_per_hour_graph;

            this.barChart.data.labels = bin_levels_per_hour.map(entry => entry.period);
            this.barChart.data.series[0] =  bin_levels_per_hour.map(entry => entry.avg_bin_level);
            this.barChart.data.series[1] = bin_air_quality_per_hour.map(entry => entry.avg_bin_air_quality)

            let percentage_to_empty = this.calculatePercentagePerformance(bin_levels_per_hour);

            this.pieChart.data.labels = [percentage_to_empty + '%',(100 - percentage_to_empty) + '%'];
            this.pieChart.data.series = [percentage_to_empty,(100 - percentage_to_empty)];
            this.isprocessing = false;

          })
          .catch((error) => {
            console.error("Error:", error);
          });
      },
      calculatePercentagePerformance(binLevelPerHourGraph){
        let aboveThreshold = false;
        let totalTimeAboveThreshold = 0;
        let totalTime = 0;

        for (let i = 0; i < binLevelPerHourGraph.length; i++) {
          const binLevel = binLevelPerHourGraph[i].avg_bin_level;

          if (binLevel > 70) {
            aboveThreshold = true;
          } else if (aboveThreshold && binLevel <= 70) {
            totalTimeAboveThreshold += 3; // Assuming each period is 3 hours
            aboveThreshold = false;
          }

          totalTime += 3; // Assuming each period is 3 hours
        }

        return (totalTimeAboveThreshold / totalTime) * 100;

      }
    },


  }
</script>
<style>

</style>

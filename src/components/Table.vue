<template>

  <table class="table" id="myDataTable">
    <thead>
      <slot name="columns">
        <tr>
          <th>#</th>
          <th v-for="column in columns" :key="column">
            {{ formatColumnName(column) }}
          </th>
          <th></th>
        </tr>
      </slot>
    </thead>
    <tbody>
    <tr v-for="(item, index) in data" :key="index">
      <slot :row="item">
        <td>{{ index + 1}}</td>
        <td v-for="column in columns" :key="column" v-if="hasValue(item, column)">
          <span v-html="itemValue(item, column)"></span>
        </td>
        <td>
          <button class="btn btn-primary mr-2"><i class="nc-icon nc-ruler-pencil"></i></button>
          <button class="btn btn-danger" @click="deleteItem(item.id)"><i class="nc-icon nc-simple-remove"></i></button>
        </td>
      </slot>
    </tr>
    </tbody>
  </table>
</template>
<script>

import $ from 'jquery';
import 'datatables.net';
import axios from "axios";
import {main_system_url} from "@/common/main_system_url";
import alert from "@/common/mixins/alert";
import Swal from "sweetalert2";
import {token} from "@/common/token";


export default {
    name: 'l-table',
    mixins: [alert],
    props: {
      columns: Array,
      data: Array,
      endpoint: String,
    },
    mounted() {
      $(this.$el).DataTable();
    },
    methods: {
      hasValue (item, column) {
        return item[column.toLowerCase()] !== 'undefined'
      },
      itemValue(item, column) {
        const value = item[column.toLowerCase()];

        if (column === 'created_at') {
          // Format 'created_at' column as 2, Jun 23
          return this.formatCreatedAt(value);
        } else if (column === 'bin_reference_number') {
          // Cut off first 5 characters for 'bin_reference_number' column
          return this.cutOffFirstCharacters(value, 14);
        } else if(column === 'status'){
          return this.formatStatusColor(value);
        }

        return this.checkEmptyColumn(value);
      },

      checkEmptyColumn(value) {
        if (value === null || value === undefined || value === '') {
          return 'N/A';
        }
        return value;
      },

      formatStatusColor(value){
        if(value == 'Full'){
          return '<span class="badge badge-danger pr-2 pl-2">' + value + '</span>'
        }
        else if(value == 'Filling'){
          return '<span class="badge badge-success pr-2 pl-2">' + value + '</span>'
        }
        else if(value == 'Empty'){
          return '<span class="badge badge-primary pr-2 pl-2">' + value + '</span>'
        }
      },

      formatCreatedAt(value) {
        if (!value) {
          return 'N/A';
        }

        const date = new Date(value);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      },

      cutOffFirstCharacters(value, count) {
        if (!value || value.length <= count) {
          return 'N/A';
        }

        return value.substring(count);
      },

      formatColumnName(column) {
        if (column === 'bin_reference_number') {
          // Format 'bin_reference_number' column as 'Name' and truncate the first 5 characters
          return 'Name';
        }

        else if(column === 'bin_capacity'){
          return 'Capacity(CM)';
        }

        else if(column === 'created_at'){
          return 'Date';
        }

        else if(column === 'air_quality'){
          return 'Quality';
        }
        else if(column === 'bin_level'){
          return 'level';
        }
        else {
          // Remove underscore and return other column names as is
          return column.replace(/_/g, ' ');
        }
      },

      deleteItem(item_id){
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
              axios.delete(main_system_url + '/api/' + this.endpoint + '/' + item_id, {
                  headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                  },
                })
                .then(response => {
                  this.showSuccessMessage("Item deleted successfully");
                  let app = this;
                  setTimeout(function(){
                    app.$router.go();
                  },1000)

                })
                .catch(error => {
                  this.showErrorMessage('Something happened');
                });
          }
        })
      }
    }
  }
</script>
<style>
</style>

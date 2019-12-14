<template>
  <v-layout>
    <v-flex class="text-center">
      <img src="/v.png" alt="Vuetify.js" class="mb-5">
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
    </v-flex>
    <table v-if="parse_csv">
      <thead>
        <tr>
          <th
            v-for="key in parse_header"
            :key="key"
            @click="sortBy(key)"
            :class="{ active: sortKey == key }"
          >
            {{ key | capitalize }}
            <span :class="sortOrders[key] > 0 ? 'asc' : 'dsc'" class="arrow" />
          </th>
        </tr>
      </thead>
      <tr v-for="csv in parse_csv" :key="csv">
        <td v-for="key in parse_header" :key="key">
          {{ csv[key] }}
        </td>
      </tr>
    </table>
  </v-layout>
</template>

<script>
import axios from 'axios';

export default {
  filters: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  },
  data: vm => ({
    channel_name: '',
    channel_fields: [],
    channel_entries: [],
    parse_header: [],
    parse_csv: [],
    sortOrders: {},
    sortKey: ''
  }),

  mounted() {
    this.getMails();
  },

  methods: {
    async getMails() {
      try {
        const response = await axios.get(
          'http://localhost:3003/mail/' + this.$route.query.id
        );

        if (response.status === 200) {
          // const data = response.data;

          // const reader = new FileReader();
          // reader.
          // const csv = await fs.readFileSync(data.file);

          const resData = await axios.get(
            'http://localhost:3003/mail/open/' + this.$route.query.id
          );

          if (resData.status === 200) {
            // console.log('DATA = ', resData.data);
            this.parse_csv = this.csvJSON(resData.data);
          }
        }
      }
      catch (error) {
        //
      }
    },
    sortBy(key) {
      const vm = this;
      vm.sortKey = key;
      vm.sortOrders[key] = vm.sortOrders[key] * -1;
    },
    csvJSON(csv) {
      const vm = this;

      const lines = csv.split('\n');

      const result = [];
      const headers = lines[0].split(',');
      vm.parse_header = lines[0].split(',');
      lines[0].split(',').forEach(function(key) {
        vm.sortOrders[key] = 1;
      });

      lines.map(function(line, indexLine) {
        if (indexLine < 1) {
          return;
        } // Jump header line

        const obj = {};
        const currentline = line.split(',');

        headers.map(function(header, indexHeader) {
          obj[header] = currentline[indexHeader];
        });

        result.push(obj);
      });

      result.pop(); // remove the last item because undefined values

      return result; // JavaScript object
    },
    loadCSV(e) {
      const vm = this;
      if (window.FileReader) {
        const reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        // Handle errors load
        reader.onload = function(event) {
          const csv = event.target.result;
          vm.parse_csv = vm.csvJSON(csv);
        };
        reader.onerror = function(evt) {
          if (evt.target.error.name === 'NotReadableError') {
            alert("Canno't read file !");
          }
        };
      }
      else {
        alert('FileReader are not supported in this browser.');
      }
    }
  }
};
</script>

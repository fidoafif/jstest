<template>
  <v-card>
    <v-tabs v-model="tab" background-color="dark">
      <v-tab>Mailing List Upload</v-tab>
      <v-tab>List Of Mailing</v-tab>

      <v-tab-item>
        <v-container fluid>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="name" label="Mailing Name" required />

            <v-col cols="12" lg="6">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dateFormatted"
                    @blur="date = parseDate(dateFormatted)"
                    v-on="on"
                    label="Date"
                    hint="MM/DD/YYYY format"
                    persistent-hint
                  />
                </template>
                <v-date-picker v-model="date" @input="menu1 = false" no-title />
              </v-menu>
            </v-col>

            <v-file-input v-model="file" label="File input" />

            <v-btn @click="submitData" color="blue">
              Submit
            </v-btn>
          </v-form>
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container fluid>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    Mailing List
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in mails" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td @click="navigateDetail(item)">
                    <a>
                      see detail
                    </a>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  data: vm => ({
    name: '',
    file: null,
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false,
    mails: []
  }),

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },

  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    }
  },

  mounted() {
    this.getMails();
  },

  methods: {
    async getMails() {
      try {
        const response = await axios.get('http://localhost:3003/mail');

        if (response.status === 200) {
          const data = response.data;

          this.mails = data;
        }
      }
      catch (error) {
        //
      }
    },
    formatDate(date) {
      if (!date) {
        return null;
      }

      const [year, month, day] = date.split('-');
      return `${month}/${day}/${year}`;
    },

    parseDate(date) {
      if (!date) {
        return null;
      }

      const [month, day, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },

    navigateDetail(item) {
      this.$router.push({ path: '/detail', query: { id: item.id } });
    },

    async submitData() {
      if (this.file !== null && this.name !== '') {
        try {
          const response = await axios.post('http://localhost:3003/mail', {
            name: this.name
          });

          if (response.status === 201) {
            const data = response.data;

            this.uploadData(data.id);
            this.getMails();
          }
        }
        catch (error) {
          //
        }
      }
    },

    async uploadData(id) {
      try {
        const formData = new FormData();
        formData.append('file', this.file);
        await axios.post('http://localhost:3003/mail/upload/' + id, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      catch (error) {
        //
      }
    }
  }
};
</script>

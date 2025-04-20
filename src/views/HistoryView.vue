<template>



    <div class="my-bg min-h-screen p-4">

      <div class="flex flex-col min-h-screen justify-center items-center h-full my-bg rounded-t-xl" v-if="!history">
        <div class="flex items-center justify-center ">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-e-4 border-blue-500"></div>
        </div>
      </div>


      <div v-if="history" v-for="(item, index) in history" :key="index" class="bg-white rounded-lg border-b-2 border-gray-400 mb-4 p-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-500">{{ item.data.date }}</span>
          <!-- <div class="flex items-center">
            <span v-for="star in 5" :key="star" class="text-yellow-400 text-lg">
              <img v-if="star > item.rating" src="../assets/star-o.png" alt="">
              <img v-if="star <= item.rating" src="../assets/star.png" alt="">
            </span>
          </div> -->
        </div>
        <div class="space-y-3 my-4">
          <div class="flex items-center space-x-3">
            <img src="../assets/target.svg" alt="">
            <div class="text-start">{{ item.data.address_from }}</div>
          </div>
          <div class="flex items-center space-x-3">
            <img src="../assets/location.svg" alt="">
            <div class="text-start">{{ item.data.address_to }}</div>
          </div>
        </div>
        <div class="flex justify-between">
          <p class="text-blue-500 text-start text-lg font-semibold mt-2">{{ item.data.sum }} {{ item.data.currency }} </p>
          <button class="text-blue-800" @click="repeatTrip(item)">{{ this.$store.state.langLoaded.rout_repeat  }}</button>
        </div>
      </div>


      <div v-if="hasMore" class="flex justify-center my-4">
        <button
          @click="loadHistory"
          class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
          :disabled="loading"
        >
          

          <div class="flex flex-col justify-center items-center h-full rounded-t-xl" v-if="loading">
            <div class="flex items-center justify-center ">
              <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-e-4 border-white"></div>
            </div>
          </div>

          <span v-else class="font-bold text-xl">></span>
        </button>
      </div>

      
    </div>


    <!-- Load More Button -->
  






  </template>
  
 

  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        history: [],
        page: 1,
        hasMore: true,
        loading: false
      };
    },
    async mounted() {
      const r = await axios.post(`${process.env.VUE_APP_API_URL}/check-order/`, {
        uid: this.$route.query.uid,
        tg_id: this.$route.query.tg_id
      });
      this.$store.state.langLoaded = r.data.lang_text;
  
      await this.loadHistory(); // Load initial page
    },
    methods: {
      async loadHistory() {
        if (this.loading || !this.hasMore) return;
  
        this.loading = true;
  
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/history/`, {
          tg_id: this.$route.query.tg_id,
          page: this.page
        });
  
        const newItems = response.data.result || [];
        if (newItems.length === 0) {
          this.hasMore = false;
        } else {
          this.history = [...this.history, ...newItems];
          this.page++;
        }
  
        this.loading = false;
      },
  
      async repeatTrip(trip) {
        let response = await axios.post(`${process.env.VUE_APP_API_URL}/get-place-details/`, {
          place_id: trip.data.place_id_from,
          lang_code: "ru"
        });
  
        this.$store.state.startPoint = {
          title: response.data.street + ", " + response.data.city,
          lat: response.data.lat,
          lon: response.data.lon,
          place_id: response.data.place_id
        };
  
        response = await axios.post(`${process.env.VUE_APP_API_URL}/get-place-details/`, {
          place_id: trip.data.place_id_to,
          lang_code: "ru"
        });
  
        this.$store.state.chooseMode = 'end';
        this.$store.state.endPoint = {
          title: response.data.street + ", " + response.data.city,
          lat: response.data.lat,
          lon: response.data.lon,
          place_id: response.data.place_id
        };
  
        this.$router.push(`/repeat?tg_id=${this.$route.query.tg_id}&uid=${this.$route.query.uid}`);
      }
    }
  };
  </script>
  




  
  <style>
  body {
    font-family: 'Inter', sans-serif;
  }
  </style>
  
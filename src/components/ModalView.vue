<template>

    <div class="h-full w-full absolute top-0 bg-gray-400 z-50 flex justify-center  backdrop-blur">
        <div class="border-2 rounded-lg my-bg h-full w-full p-4 space-y-5 pt-10">

            <div class="w-full border-2 px-3 space-x-3 bg-white rounded-lg">
                <div  class="flex">
                    <img @click="() => this.$store.state.modalOn = false" width="17" src="../assets/clear.svg" alt="">
                    <input :placeholder="$store.state.langLoaded.enter_address_to" @input="updateLocs" v-model="inpValue" class="text-lg p-3 w-full outline-none font-semibold" type="text">
                </div>
                <!-- <img @click="() => this.$store.state.modalOn = false" width="25" src="../assets/clear.svg" alt=""> -->
            </div>

            <div>

                

                <div 
                class="flex items-center rtl:space-x-reverse  space-x-3 border-b-2 border-gray-300 p-3 cursor-pointer"
                v-if="!inpValue && $store.state.chooseMode == 'start'"
                
                @click="selectPoint(this.$store.state.recentLocation, true)">
                    <img src="../assets/location.svg" alt="">
                    <div>
                        <div class="text-start font-bold">{{ this.$store.state.langLoaded.last_location_text }}</div>
                        <div class="text-start text-gray-400">{{ this.$store.state.recentLocation.full_address }}</div>
                    </div>
                    

                </div>

                <div v-if="addresses.length == 0" class="flex items-center mt-4 justify-center ">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-e-4 border-blue-500"></div>
                </div>

                <div v-for="address in addresses" 
                class="flex items-center rtl:space-x-reverse space-x-3 border-b-2 border-gray-300 p-3 cursor-pointer"
                @click="selectPoint(address)">
                    <img src="../assets/location.svg" alt="">
                    <div>
                        <div class="text-start">{{ address.title }}</div>
                        <div class="text-start text-gray-400">{{ address.description }}</div>
                    </div>
                    

                </div>

                

            </div>

        </div>
    </div>

</template>


<script>

import $ from "jquery";
import axios from 'axios';


export default {
  name: 'Modal1',
  data: () => ({
    inpValue: '',
    debounceTimer: null, // Timer for debouncing
    addresses: [],
  }),
  mounted() {
    this.updateLocs();
  },
  methods: {
    updateLocs() {
      // Clear any existing timer
      if (this.debounceTimer) clearTimeout(this.debounceTimer);

      // Set a new timer
      this.debounceTimer = setTimeout(async () => {
        console.log('fetching hints...');
        try {
          const response = await axios.post(`${process.env.VUE_APP_API_URL}/get-addresses/`, {
            query: this.inpValue,
            tg_id: this.$route.query.tg_id
            
        });
          this.addresses = response.data.addresses;
        } catch (error) {
          console.error('Error fetching hints:', error);
        }
      }, 1500); // Delay in milliseconds
    },
    async selectPoint(p, recent=false) {

        if(this.$store.state.chooseMode == 'start') {

            const response = await axios.post(`${process.env.VUE_APP_API_URL}/get-place-details/`, {
                place_id: p.place_id,
                lang_code: "ru"
            })

            let a = response.data


            if(recent) {
              a.title = a.street + ", " + a.city
            } else {
              a.title = p.title + ", " + a.city
            }



            this.$store.state.startPoint = a
            console.log(this.$store.state.startPoint);


        } else {
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/get-place-details/`, {
                place_id: p.place_id,
                lang_code: "ru"
            })

            let a = response.data

            if(recent) {
              a.title = a.street + ", " + a.city
            } else {
              a.title = p.title + ", " + a.city
            }


            this.$store.state.endPoint = a



            // this.$store.state.zoom = 11
            console.log(this.$store.state.endPoint);


            await this.calcDetails();
        }

        this.$store.state.modalOn = false
    },
    async calcDetails() {
      console.log('getting details...')
      const response = await axios.post(`${process.env.VUE_APP_API_URL}/pre-order/`, {
                uid: this.$route.query.uid,
                tg_id: this.$route.query.tg_id,
                place_id_from: this.$store.state.startPoint.place_id,
                place_id_to: this.$store.state.endPoint.place_id,
               
            })


      console.log(response.data);
      this.$store.state.routeInfo = response.data


      this.$store.state.zoom = this.setNeededZoom();


    },
    setNeededZoom() {

      let distance = this.$store.state.routeInfo.total_distance

      console.log(distance)

      let optimalZoom =  -1.83 * Math.log(distance) + 28.19

      console.log(optimalZoom)

      return optimalZoom;
    }


  },
};



</script>   

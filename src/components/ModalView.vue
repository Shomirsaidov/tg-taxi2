<template>

    <div class="h-screen w-full absolute px-8 top-0 bg-gray-400 z-50 flex justify-center items-center bg-opacity-75 backdrop-blur">
        <div class="border-2 rounded-lg my-bg p-4 space-y-10 pt-10">

            <div class="flex justify-between border-2 px-3 bg-white rounded-lg">
                <div  class="flex">
                    <img @click="() => this.$store.state.modalOn = false" width="25" src="../assets/arrow-left.svg" alt="">
                    <input placeholder="кирова 56" @input="updateLocs" v-model="inpValue" class="text-lg p-3 outline-none font-semibold" type="text">
                </div>
                <img @click="() => this.$store.state.modalOn = false" src="../assets/clear.svg" alt="">
            </div>

            <div>

                <div v-if="addresses.length == 0" class="flex items-center justify-center ">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-e-4 border-blue-500"></div>
                </div>

                <div v-for="address in addresses" 
                class="flex items-center space-x-3 border-b-2 border-gray-300 p-3"
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
    async selectPoint(p) {

        if(this.$store.state.chooseMode == 'start') {

            const response = await axios.post(`${process.env.VUE_APP_API_URL}/get-place-details/`, {
                place_id: p.place_id,
                lang_code: "ru"
            })

            let a = response.data
            a.title = p.title

            this.$store.state.startPoint = a
            console.log(this.$store.state.startPoint);


        } else {
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/get-place-details/`, {
                place_id: p.place_id,
                lang_code: "ru"
            })

            let a = response.data
            a.title = p.title

            this.$store.state.endPoint = a
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

    }
  },
};



</script>   

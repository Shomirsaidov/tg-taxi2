<template>
  <div class="bg-white flex flex-col justify-between  shadow-lg max-w-md mx-auto h-screen ">
    




    <ModalView v-if="this.$store.state.modalOn"/>
    <ModalPrompt v-if="this.$store.state.offer"/>
    <ModalAlert v-if="this.$store.state.cancel"/>

    <ModalInfo v-if="this.infoModal"/>
    <ModalSuccess v-if="this.$store.state.successModal"/>



    <div class="p-3 bg-white text-center font-semibold border-b">
      Тестовый заказ
    </div>

    <!-- Map Section -->
    <div v-if="!this.$store.state.modalOn && !this.$store.state.offer && !this.$store.state.successModal && !this.$store.state.cancel && this.$store.state.langLoaded" class="relative map" >

      <l-map
        class="w-full "
        :zoom="13"
        :center="[this.$store.state.startPoint.lat, this.$store.state.startPoint.lon]"]
      >
        <l-tile-layer :url="tileLayerUrl" :attribution="tileLayerAttribution" />
        <!-- Markers -->
        <l-marker :lat-lng="[this.$store.state.startPoint.lat, this.$store.state.startPoint.lon]">
          <l-popup>{{ this.$store.state.startPoint.title }}</l-popup>
        </l-marker>
        <l-marker :lat-lng="[this.$store.state.endPoint.lat, this.$store.state.endPoint.lon]">
          <l-popup>{{ this.$store.state.endPoint.title }}</l-popup>
        </l-marker>

        <!-- <l-polyline
          :lat-lngs="routeCoordinates"
          color="blue"
          weight="4"
          opacity="0.7"
        /> -->

      </l-map>
    </div>

    <div class="flex flex-col justify-center items-center h-full my-bg rounded-t-xl" v-if="!this.$store.state.langLoaded">
      <div class="flex items-center justify-center ">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-e-4 border-blue-500"></div>
      </div>
    </div>

    


    <div class="flex flex-col justify-between h-full my-bg rounded-t-xl" v-if="this.$store.state.langLoaded">

      <div class="my-bg rounded-t-xl mt-0 p-4">

      <!-- Address Fields -->
      <div class="mt-4 space-y-2">
        <div @click="() => {
          this.$store.state.modalOn = true
          this.$store.state.chooseMode = 'start'
        }" class="flex items-center space-x-3 px-3 py-3 border rounded-md text-sm shadow-sm  bg-white">
          <img src="../assets/target.svg" alt="">
          <div class="w-full text-start">{{ this.$store.state.startPoint.title }}</div>
        </div>
        <div @click="() => {
          this.$store.state.modalOn = true
          this.$store.state.chooseMode = 'end'
        }" class="flex items-center space-x-3 px-3 py-2 border rounded-md text-sm shadow-sm bg-white">
          <img src="../assets/location.svg" alt="">
          <div class="w-full text-start">{{ this.$store.state.endPoint.title }}</div>

        </div>
      </div>

      <!-- Payment -->






      <button @click="showPayOptions" style="background: #89AED0" class="p-3 text-white rounded mt-2 w-full font-semibold text-center flex items-center justify-center space-x-2">
        <div>{{ this.$store.state.langLoaded.passenger_select_pay_methods }}</div>
        <img src="../assets/upwards.png" alt="">
      </button>


      <div class="hidden payment_options">
        <div clas="bg-white">
        <div class="bg-white p-2 px-5 border-b flex items-center">
          <label class="flex-1 text-start" for="p1">{{ this.$store.state.langLoaded.method_cash }}</label>
          <input
            id="p1"
            :value="this.$store.state.langLoaded.method_cash"
            v-model="selectedPaymentOpts"
            type="checkbox"
            class="h-6 w-6 text-blue-600 rounded focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="bg-white p-2 px-5 border-b flex items-center">
          <label class="flex-1 text-start" for="p2">{{ this.$store.state.langLoaded.method_card }}</label>
          <input
            id="p2"
            :value="this.$store.state.langLoaded.method_card"
            v-model="selectedPaymentOpts"

            type="checkbox"
            class="h-6 w-6 text-blue-600 rounded focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="bg-white p-2 px-5 border-b flex items-center">
          <label class="flex-1 text-start" for="p3">{{ this.$store.state.langLoaded.method_wallets }}</label>
          <input
            id="p3"
            :value="this.$store.state.langLoaded.method_wallets"
            v-model="selectedPaymentOpts"

            type="checkbox"
            class="h-6 w-6 text-blue-600 rounded focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="bg-white p-2 px-5 border-b flex items-center">
          <label class="flex-1 text-start" for="p4">{{ this.$store.state.langLoaded.method_balance }}</label>
          <input
            id="p4"
            :value="this.$store.state.langLoaded.method_balance"
            v-model="selectedPaymentOpts"

            type="checkbox"
            class="h-6 w-6 text-blue-600 rounded focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="bg-white p-2 px-5 border-b flex items-center">
          <label class="flex-1 text-start" for="p5">{{ this.$store.state.langLoaded.method_any }}</label>
          <input
            id="p5"
            :value="this.$store.state.langLoaded.method_any"
            v-model="selectedPaymentOpts"

            type="checkbox"
            class="h-6 w-6 text-blue-600 rounded focus:ring focus:ring-blue-200"
          />
        </div>
      </div>



        <button @click="showPayOptions" class="my-blue p-2 text-white rounded rounded-t-none w-full font-semibold text-center flex items-center justify-center space-x-2">
          <div>OK</div>
        </button>
      </div>
      










      <!-- Transport Options -->
<div class="mt-4 grid grid-cols-2 gap-2">
  <button
    v-for="(option, index) in transportOptions"
    :key="index"
    @click="selectOption(index)"
    :class="[
      'p-2 border rounded-md shadow',
      isSelected(index) ? 'my-blue text-white' : 'bg-white'
    ]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <img :src="option.icon" alt="" />
        <div :class="isSelected(index) ? 'text-lgg font-semibold' : 'text-lgg'">
          {{ option.label }}
          
        </div>
      </div>
      <div>
        <input
          type="checkbox"
          :checked="isSelected(index)"
          class="h-6 w-6 text-blue-600 rounded focus:ring focus:ring-blue-200"
          readonly
        />
      </div>
    </div>


    <div class="flex items-center justify-between mt-2" v-if="this.$store.state.routeInfo">
          <button class="bg-blue-200 rounded px-2 text-black">{{ this.$store.state.routeInfo.estimated_duration_text  }}</button>
          
          <button v-if="index == 0" class="bg-blue-200 rounded px-2 text-black">{{ this.$store.state.routeInfo.transport_type_dict.taxi_price }}</button>
          <button v-if="index == 1" class="bg-blue-200 rounded px-2 text-black">{{ this.$store.state.routeInfo.transport_type_dict.private_price }}</button>
          <button v-if="index == 2" class="bg-blue-200 rounded px-2 text-black">{{ this.$store.state.routeInfo.transport_type_dict.moto_price }}</button>
          <button v-if="index == 3" class="bg-blue-200 rounded px-2 text-black">{{ this.$store.state.routeInfo.transport_type_dict.taxi_price }}</button>

    </div>

  </button>

</div>


      <div class="mt-3 mb-20">
          <textarea v-model="commentsForOrder" :placeholder="this.$store.state.langLoaded.enter_order_comment_btn" class="w-full px-3 py-2 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"></textarea>
      </div>

      <!-- Footer Buttons -->
      


      </div>


      <div class=" flex space-x-2 font-semibold my-bg p-4 fixed w-full bottom-0">
        <button @click="() => this.$store.state.offer = true" class="flex-1 p-2 text-sm text-white border shadow-xl rounded-xl hover:bg-blue-100 my-blue-2">
          {{ this.$store.state.langLoaded.offer_price_btn }}
        </button>
        <button @click="createOrder" class="flex-1 p-2 text-sm text-white  rounded-xl shadow-xl hover:bg-blue-600 my-blue">
          <span v-if="!this.creatingOrder">
            {{ this.$store.state.langLoaded.confirm_order_btn }}
          </span>

          <div class="flex flex-col justify-center items-center h-full rounded-t-xl" v-if="this.creatingOrder">
            <div class="flex items-center justify-center ">
              <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-e-4 border-white"></div>
            </div>
          </div>

        </button>


        <button @click="() => this.$store.state.cancel = true" class="flex-1 p-2 text-sm text-white  rounded-xl shadow-xl hover:bg-red-600 my-red">
          {{ this.$store.state.langLoaded.cancel_order_btn }}
        </button>
      </div>

    </div>

  </div>
</template>

<script>

import $ from "jquery";

import ModalView from "@/components/ModalView.vue";
import ModalAlert from "@/components/ModalAlert.vue";
import ModalPrompt from "@/components/ModalPrompt.vue";
import ModalInfo from "@/components/ModalMessage.vue";
import ModalSuccess from "@/components/ModalSuccess.vue";


import { LMap, LTileLayer, LMarker, LPopup,LPolyline } from "vue3-leaflet";
import axios from "axios";

export default {
  name: "TaxiOrderComponent",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LPolyline,
    ModalView,
    ModalAlert,
    ModalPrompt,
    ModalSuccess
  },
  data() {
    return {
      selectedOptions: [],
      infoModal: false,
      timeIsUp: false,
      selectedTransports: [],
      selectedPaymentOpts: [],
      commentsForOrder: '',
      creatingOrder: false,
      tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      tileLayerAttribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        transportOptions: [
        {
          label: "Такси",
          icon: require("../assets/car.svg"),
          details: { sum: "234 грн", time: "15 мин" },
        },
        {
          label: "Частный водитель",
          icon: require( "../assets/private.svg"),
          details: { sum: "234 грн", time: "15 мин" },
        },
        {
          label: "Мотоцикл",
          icon: require("../assets/moto.svg"),
          details: { sum: "234 грн", time: "15 мин" },
        },
        {
          label: "Главное быстро",
          icon: require("../assets/clock.svg"),
          note: "Отметить все виды транспорта",
        },
      ],
    };
  },
  computed: {
    routeCoordinates() {
      const start = this.$store.state.startPoint;
      const end = this.$store.state.endPoint;
      
      // Check if start and end points exist
      if (!start || !end || !start.lat || !start.lon || !end.lat || !end.lon) {
        console.error("Start or End point coordinates are missing");
        return [];
      }

      console.log( [
        [start.lat, start.lon], // Start point
        [end.lat, end.lon]      // End point
      ])

      return [
        [start.lat, start.lon], // Start point
        [end.lat, end.lon]      // End point
      ];
    },
    
  },
  async mounted() {
    // When the component is mounted, set the map as ready
    await this.preCheck();
  },
  watch: {
    // Watch the store state directly
    '$store.state.startPoint': {
      handler(newValue, oldValue) {
        console.log(`startPoint changed from ${oldValue} to ${newValue}`);
        // this.triggerAction(newValue);
      },
      immediate: true // Optional: Trigger the handler immediately with the current value
    },
    'selectedPaymentOpts': {
      handler(newValue, oldValue) {
        console.log(`payment changed from ${oldValue} to ${newValue}`);
        // this.triggerAction(newValue);
      },
    }
  },
  methods: {
    showPayOptions() {
      $('.payment_options').slideToggle();
    },
    selectOption(index) {
      if (!this.selectedOptions) {
        this.selectedOptions = [];
      }
      
      const optionIndex = this.selectedOptions.indexOf(index);
      if (optionIndex === -1) {
        this.selectedOptions.push(index);
      } else {
        this.selectedOptions.splice(optionIndex, 1);
      }

      this.selectedTransports = []

      this.selectedOptions.forEach(key => {
        this.selectedTransports.push(this.transportOptions[key].label)
      })

      console.log(this.selectedTransports)

    },
    
    async preCheck() {
      const response = await axios.post(`${process.env.VUE_APP_API_URL}/check-order/`, {
                uid: this.$route.query.uid,
                tg_id: this.$route.query.tg_id
            })

      console.log(response); 
      if(response.status !== 200) {
        this.infoModal = true;
      } else {
        this.$store.state.langLoaded = response.data.lang_text;
        this.$store.state.startPoint = {
          title: response.data.city, 
          lat: response.data.latitude,
          lon: response.data.longitude,

        };

        this.transportOptions[0].label = this.$store.state.langLoaded.transport_taxi;
        this.transportOptions[1].label = this.$store.state.langLoaded.transport_private;
        this.transportOptions[2].label = this.$store.state.langLoaded.transport_moto;
        this.transportOptions[3].label = this.$store.state.langLoaded.transport_all;

        console.log(this.$store.state.langLoaded)
      }


    },
    isSelected(index) {
      return this.selectedOptions.includes(index);
    },
    async createOrder() {

      this.creatingOrder = true

      console.log({
                uid: this.$route.query.uid,
                tg_id: this.$route.query.tg_id,
                place_id_from : this.$store.state.startPoint.place_id,
                place_id_to: this.$store.state.endPoint.place_id,
                passenger_pay_methods: this.selectedPaymentOpts,
                passenger_transport_type: this.selectedTransports,
                comment: this.commentsForOrder,
                price: 0,
            })

      const response = await axios.post(`${process.env.VUE_APP_API_URL}/create-order/`, {
                uid: this.$route.query.uid,
                tg_id: this.$route.query.tg_id,
                place_id_from : this.$store.state.startPoint.place_id,
                place_id_to: this.$store.state.endPoint.place_id,
                passenger_pay_methods: this.selectedPaymentOpts,
                passenger_transport_type: this.selectedTransports,
                comment: this.commentsForOrder,
                price: 0,
            })

      if(response.data.status == 'ok') {
        this.$store.state.successModal = true;
        this.$store.state.successMessage = response.data.message;
        this.creatingOrder = false

      }
            
    }
  },
};
</script>

<style >

.map {
  min-height: 400px;
}

.my-bg {
  background: #EFEFF3;
}

.my-blue-2 {
  background: #89AED0;
}

.my-red {
  background: #E85D5D;
}

.my-blue {
  background: #52A2EB;
}

.text-xss {
 font-size: 9px;
}


.text-mdd {
 font-size: 13px;
}

.text-lgg {
 font-size: 14px;
}

.text-my-blue {
  color: #52A2EB;
}

.cover {
  background-image: url(../assets/background.png);
  background-size: cover;
}


</style>

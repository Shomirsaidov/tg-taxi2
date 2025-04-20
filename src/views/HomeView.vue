<template>
  <div class="bg-white flex flex-col justify-between  shadow-lg max-w-md mx-auto h-screen ">
    




    <ModalView v-if="this.$store.state.modalOn"/>
    <ModalPrompt v-if="this.$store.state.offer"/>
    <ModalAlert v-if="this.$store.state.cancel"/>
    <ModalError v-if="this.$store.state.error"/>

    
    <ModalSuccess v-if="this.$store.state.successModal"/>


    <div class="p-3 bg-white text-center font-semibold border-b" v-if="is_test_order && this.$store.state.langLoaded">
      {{ this.$store.state.langLoaded.test_order }}
    </div>


    <!-- Map Section -->
    <div v-if="!this.$store.state.modalOn && !this.$store.state.error && !this.$store.state.offer && !this.$store.state.successModal && !this.$store.state.cancel && this.$store.state.langLoaded" class="relative map " >

      <l-map
        class="w-full"
        :zoom="this.$store.state.zoom"
        :center="this.$store.getters.midPoint"
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

      <div class="my-bg rounded-t-xl mt-0 p-5">

      <!-- Address Fields -->
      <div class="mt-1 space-y-2">
        <div @click="() => {
          this.$store.state.modalOn = true
          this.$store.state.chooseMode = 'start'
        }" class="flex items-center space-x-3 px-3 py-3 border rounded-md text-sm shadow-sm  bg-white cursor-pointer">
          <img src="../assets/target.svg" alt="">
          <div class="w-full text-start">{{ this.$store.state.startPoint.title }}</div>
        </div>
        <button :disabled="disabledEndSelecion" @click="() => {
          this.$store.state.modalOn = true
          this.$store.state.chooseMode = 'end'
        }" :class="[disabledEndSelecion ? 'bg-gray-200 text-gray-400' : 'bg-white']" class="flex w-full items-center space-x-3 px-3 py-2 border rounded-md text-sm shadow-sm cursor-pointer">
          <img src="../assets/location.svg" alt="">
          <div class="w-full text-start">{{ this.endText }}</div>

        </button>
      </div>

      <!-- Payment -->






      <button @click="showPayOptions" style="background: #89AED0" class="p-3 text-white rounded mt-2 w-full font-semibold text-center flex items-center justify-center space-x-2">
        <div>{{ this.$store.state.langLoaded.passenger_select_pay_methods }}</div>
        <img src="../assets/upwards.png" alt="">
      </button>


      <div class="hidden payment_options">
        <div clas="bg-white">

        <div class="bg-white p-2 px-5 border-b flex items-center">
          <label class="flex-1 text-start" for="p5">{{ this.$store.state.langLoaded.method_any }}</label>
          <input
            id="p5"
            value="any"
            v-model="selectedPaymentOpts"

            type="checkbox"
            class="h-6 w-6 text-blue-600 rounded focus:ring focus:ring-blue-200"
          />
        </div>

        <div class="bg-white p-2 px-5 border-b flex items-center">
          <label class="flex-1 text-start" for="p1">{{ this.$store.state.langLoaded.method_cash }}</label>
          <input
            id="p1"
            value="cash"
            v-model="selectedPaymentOpts"
            type="checkbox"
            class="h-6 w-6 text-blue-600 rounded focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="bg-white p-2 px-5 border-b flex items-center">
          <label class="flex-1 text-start" for="p2">{{ this.$store.state.langLoaded.method_card }}</label>
          <input
            id="p2"
            value="card"
            v-model="selectedPaymentOpts"

            type="checkbox"
            class="h-6 w-6 text-blue-600 rounded focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="bg-white p-2 px-5 border-b flex items-center">
          <label class="flex-1 text-start" for="p3">{{ this.$store.state.langLoaded.method_wallets }}</label>
          <input
            id="p3"
            value="e-wallets"
            v-model="selectedPaymentOpts"

            type="checkbox"
            class="h-6 w-6 text-blue-600 rounded focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="bg-white p-2 px-5 border-b flex items-center">
          <label class="flex-1 text-start" for="p4">{{ this.$store.state.langLoaded.method_balance }}</label>
          <input
            id="p4"
            value="balance"
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
    <div class="flex items-center justify-between ">
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
          <button v-if="index !== 3" class="bg-blue-200 rounded px-2 text-black">{{ this.$store.state.routeInfo.estimated_duration_text  }}</button>
          
          <button v-if="index == 0" class="bg-blue-200 rounded px-2 text-black">{{ this.$store.state.routeInfo.transport_type_dict.taxi_price }} <span v-if="this.$store.state.offeredPrice">{{ this.$store.state.routeInfo.currency_symbol }}</span></button>
          <button v-if="index == 1" class="bg-blue-200 rounded px-2 text-black">{{ this.$store.state.routeInfo.transport_type_dict.private_price }} <span v-if="this.$store.state.offeredPrice">{{ this.$store.state.routeInfo.currency_symbol }}</span></button>
          <button v-if="index == 2" class="bg-blue-200 rounded px-2 text-black">{{ this.$store.state.routeInfo.transport_type_dict.moto_price }} <span v-if="this.$store.state.offeredPrice">{{ this.$store.state.routeInfo.currency_symbol }}</span></button>

    </div>

  </button>

</div>


      <div class="mt-5 mb-20">
          <textarea v-model="commentsForOrder" :placeholder="this.$store.state.langLoaded.enter_order_comment_btn" class="w-full px-3 py-2 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"></textarea>
      </div>

      <!-- Footer Buttons -->
      


      </div>


      <div class=" flex space-x-2 font-semibold my-bg p-4 fixed w-full bottom-0" v-if="!this.$store.state.modalOn">
        <button @click="() => this.$store.state.offer = true" :disabled="disabledOffer" :class="[disabledOffer ? 'bg-gray-300' : 'my-blue-2']"  class="flex-1 p-2 text-sm text-white border shadow-xl rounded-xl">
          {{ this.$store.state.langLoaded.offer_price_btn }}
        </button>
        <button @click="createOrder" :disabled="disabledOrder" :class="[disabledOrder ? 'bg-gray-300' : 'my-blue']" class="flex-1 p-2 text-sm text-white  rounded-xl shadow-xl my-blue">
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
import ModalError from "@/components/ModalMessage.vue";

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
    ModalSuccess,
    ModalError,
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
          label: "taxi",
          value: "taxi",

          icon: require("../assets/car.svg"),
          details: { sum: "234 грн", time: "15 мин" },
        },
        {
          label: "private",
          value: "private",

          icon: require( "../assets/private.svg"),
          details: { sum: "234 грн", time: "15 мин" },
        },
        {
          label: "moto",
          value: "moto",

          icon: require("../assets/moto.svg"),
          details: { sum: "234 грн", time: "15 мин" },
        },
        {
          label: "taxi",
          value: "taxi",


          icon: require("../assets/clock.svg"),
          note: "Отметить все виды транспорта",
        },
      ],
    };
  },
  computed: {

    is_test_order() {
      if(this.$route.query.is_test == 'true') {
        return true
      } 

      return false
    },

    disabledEndSelecion() {
      if(this.$store.state.startPoint.title == this.$store.state.langLoaded.enter_address_from) {
        return true
      }
      return false
    },

    disabledOffer() {
      if(this.$store.state.routeInfo?.transport_type_dict.taxi_price) {
        return 0;
      }
      return 1;
    },

    disabledOrder() {
      if(this.selectedPaymentOpts.length !== 0 && this.selectedTransports.length !== 0 && this.$store.state.startPoint.title !== this.$store.state.langLoaded.enter_address_from) {
        return 0;
      }
      return 1;
    },
    
    endText() {
      if(this.$store.state.startPoint.title == this.$store.state.langLoaded.enter_address_from) {
        return this.$store.state.langLoaded.enter_address_to;
      } else {
        return this.$store.state.endPoint.title;
      }
    },
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
    finalOrderData() {
      if(this.$store.state.offeredPrice) {
        return {
            uid: this.$route.query.uid,
            tg_id: this.$route.query.tg_id,
            place_id_from : this.$store.state.startPoint.place_id,
            place_id_to: this.$store.state.endPoint.place_id,
            passenger_pay_methods: this.selectedPaymentOpts,
            passenger_transport_type: this.selectedTransports,
            comment: this.commentsForOrder,
            price: this.$store.state.offeredPrice,
            is_test: this.is_test_order
        }
      }

      return {
          uid: this.$route.query.uid,
          tg_id: this.$route.query.tg_id,
          place_id_from : this.$store.state.startPoint.place_id,
          place_id_to: this.$store.state.endPoint.place_id,
          passenger_pay_methods: this.selectedPaymentOpts,
          passenger_transport_type: this.selectedTransports,
          comment: this.commentsForOrder,
          is_test: this.is_test_order

      }

    }
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
    '$store.state.endPoint': {
      handler(newValue, oldValue) {
        console.log(`endPoint changed from ${oldValue} to ${newValue}`);
        
        $('.payment_options').slideToggle();
      },
      immediate: true // Optional: Trigger the handler immediately with the current value
    },
    selectedPaymentOpts: {
      handler(newValue, oldValue) {
        console.log(`after payment changed from ${oldValue} to ${newValue}`);

        const hasAny = newValue.includes('any');
        const hadAny = oldValue.includes('any');
        const anyTypeDisselected = hadAny && !hasAny;

        // If 'any' was deselected, clear all selections
        if (anyTypeDisselected && oldValue.length == 5) {
          if (this.selectedPaymentOpts.length !== 0) {
            this.selectedPaymentOpts = [];
          }
          return;
        }

        // If 'any' is selected, set the full list only if not already set
        if (!hadAny && hasAny && newValue.length !== 5) {
          this.selectedPaymentOpts = [
            'any',
            'cash',
            'e-wallets',
            'card',
            'balance'
          ];
        } else if(hasAny && newValue.length < 5) {
          console.log('inside my block !')
          this.selectedPaymentOpts = this.selectedPaymentOpts.filter(item => item !== 'any');
        }


        if(!hasAny && newValue.length == 4) {
          this.selectedPaymentOpts = [
            'any',
            'cash',
            'e-wallets',
            'card',
            'balance'
          ];
        }
        

        console.log(`after payment changed from ${oldValue} to ${newValue}`);
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    showPayOptions() {
      $('.payment_options').slideToggle();
    },
    selectOption(index) {

      console.log(this.selectOptions);
       
      if (!this.selectedOptions) {
        this.selectedOptions = [];
      }
      
      const optionIndex = this.selectedOptions.indexOf(index);
      if (optionIndex === -1) {
        this.selectedOptions.push(index);

        if(index == 3) {
          this.selectedOptions.push(0,1,2)
        }

      } else {

        this.selectedOptions.splice(optionIndex, 1);

        if(index == 3) {
          this.selectedOptions = this.selectedOptions.filter(num => ![0, 1, 2].includes(num));
        }

      }

      this.selectedTransports = []

      this.selectedOptions.forEach(key => {
        this.selectedTransports.push(this.transportOptions[key].value)
      })

      console.log(this.selectedTransports)

    },
    
    async preCheck() {
      const response = await axios.post(`${process.env.VUE_APP_API_URL}/check-order/`, {
                uid: this.$route.query.uid,
                tg_id: this.$route.query.tg_id
            })

      this.$store.state.recentLocation = response.data.predefined_place_id_from;

      console.log(response); 
      if(response.data.status == 'error') {
        console.error("some error")
        this.$store.state.error = true;
        this.$store.state.errorText = response.data.message;

      } else {
        this.$store.state.langLoaded = response.data.lang_text;
        let textFrom = this.$store.state.langLoaded.enter_address_from;

        this.$store.state.startPoint = {
          title: textFrom, 
          lat: response.data.latitude,
          lon: response.data.longitude,

        };

        console.log(this.$store.state.startPoint)

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


      console.log(this.selectedPaymentOpts)
      this.creatingOrder = true

      try {

        const response = await axios.post(`${process.env.VUE_APP_API_URL}/create-order/`, this.finalOrderData)

        if(response.data.status == 'ok') {
          this.$store.state.successModal = true;
          this.$store.state.successMessage = response.data.message;
          this.creatingOrder = false

        } else {
          this.creatingOrder = false
          this.$store.state.error = true;

          this.$store.state.errorText = response.data.status;
        }


      }

      catch(e) {

        
        this.creatingOrder = false
        this.$store.state.error = true;
        this.$store.state.errorText = e.message;

        console.log(this.$store.errorText);

      }
      
      
      

      


      
            
    }
  },
};
</script>

<style >

.map {
  min-height: 40vh;
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

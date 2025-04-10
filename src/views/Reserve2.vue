<template>
    <div class="bg-white flex flex-col justify-between  shadow-lg max-w-md mx-auto h-screen ">
      
  
  
  
  
      <ModalView v-if="this.$store.state.modalOn"/>
  
  
      <!-- Map Section -->
      <div v-if="!this.$store.state.modalOn" class="relative map" >
  
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
  
  
      <div class="flex flex-col justify-between h-full my-bg rounded-t-xl">
  
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
  
        <!-- Transport Options -->
        <!-- Transport Options -->
  <div class="mt-4 grid grid-cols-2 gap-2">
    <button
      v-for="(option, index) in transportOptions"
      :key="index"
      @click="selectOption(index)"
      :class="[
        'p-2 border rounded-md shadow',
        selectedOption === index ? 'my-blue text-white' : 'bg-white'
      ]"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <img :src="option.icon" alt="" />
          <div :class="selectedOption === index ? 'text-lgg font-semibold' : 'text-lgg'">
            {{ option.label }}
          </div>
        </div>
        <div>
          <input
            type="checkbox"
            :checked="selectedOption === index"
            class="h-6 w-6 text-blue-600 rounded focus:ring focus:ring-blue-200"
            readonly
          />
        </div>
      </div>
      <div v-if="option.details" class="grid grid-cols-2 space-x-2 mt-2 w-full">
        <div>
          <div class="text-start text-xss">Сумма</div>
          <div
            :class="[
              'rounded text-mdd w-full',
              selectedOption === index ? 'bg-white text-my-blue font-bold' : 'bg-blue-200'
            ]"
          >
            {{ option.details.sum }}
          </div>
        </div>
        <div>
          <div class="text-start text-xss">Время поездки</div>
          <div
            :class="[
              'rounded text-mdd w-full',
              selectedOption === index ? 'bg-white text-my-blue font-bold' : 'bg-blue-200'
            ]"
          >
            {{ option.details.time }}
          </div>
        </div>
      </div>
      <div v-else class="text-start text-xss"><i>{{ option.note }}</i></div>
    </button>
  </div>
  
  
        <div class="mt-3">
            <textarea placeholder="примечания к заказу" class="w-full px-3 py-2 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"></textarea>
        </div>
  
        <!-- Footer Buttons -->
        
  
  
        </div>
  
  
        <div class=" flex space-x-2 font-semibold my-bg p-4">
          <button class="flex-1 p-2 text-sm text-white border shadow-xl rounded-xl hover:bg-blue-100 my-blue-2">
            Предложить свою цену
          </button>
          <button class="flex-1 p-2 text-sm text-white  rounded-xl shadow-xl hover:bg-blue-600 my-blue">
            Подтвердить заказ
          </button>
          <button class="flex-1 p-2 text-sm text-white  rounded-xl shadow-xl hover:bg-red-600 my-red">
            Отменить заказ
          </button>
        </div>
  
      </div>
  
    </div>
  </template>
  
  <script>
  
  
  import ModalView from "@/components/ModalView.vue";
  import { LMap, LTileLayer, LMarker, LPopup,LPolyline } from "vue3-leaflet";
  
  export default {
    name: "TaxiOrderComponent",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      LPolyline,
      ModalView
    },
    data() {
      return {
        selectedOption: null,
        timeIsUp: false,
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
      }
    },
    mounted() {
      // When the component is mounted, set the map as ready
      
    },
    methods: {
      selectOption(index) {
        this.selectedOption = index; // Update selected button index
      },
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
  
<template>
    <div class="bg-white flex flex-col justify-between shadow-lg max-w-md mx-auto h-screen">
      <ModalView v-if="this.$store.state.modalOn" />
  
      <!-- Map Section -->
      <div v-if="!this.$store.state.modalOn" class="relative map" ref="mapContainer">
        <!-- Mapbox Map will be rendered here -->
      </div>
  
      <div class="flex flex-col justify-between h-full my-bg rounded-t-xl">
        <!-- Address Fields -->
        <div class="mt-4 space-y-2">
          <div @click="openModal('start')" class="flex items-center space-x-3 px-3 py-3 border rounded-md text-sm shadow-sm bg-white">
            <img src="../assets/target.svg" alt="" />
            <div class="w-full text-start">{{ this.$store.state.startPoint.title }}</div>
          </div>
          <div @click="openModal('end')" class="flex items-center space-x-3 px-3 py-2 border rounded-md text-sm shadow-sm bg-white">
            <img src="../assets/location.svg" alt="" />
            <div class="w-full text-start">{{ this.$store.state.endPoint.title }}</div>
          </div>
        </div>
  
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
  
        <!-- Footer Buttons -->
        <div class="mt-3">
          <textarea placeholder="примечания к заказу" class="w-full px-3 py-2 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"></textarea>
        </div>
  
        <div class="flex space-x-2 font-semibold my-bg p-4">
          <button class="flex-1 p-2 text-sm text-white border shadow-xl rounded-xl hover:bg-blue-100 my-blue-2">
            Предложить свою цену
          </button>
          <button class="flex-1 p-2 text-sm text-white rounded-xl shadow-xl hover:bg-blue-600 my-blue">
            Подтвердить заказ
          </button>
          <button class="flex-1 p-2 text-sm text-white rounded-xl shadow-xl hover:bg-red-600 my-red">
            Отменить заказ
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ModalView from "@/components/ModalView.vue";
  import mapboxgl from "mapbox-gl";  // Import Mapbox GL
  
  export default {
    name: "TaxiOrderComponent",
    components: {
      ModalView,
    },
    data() {
      return {
        selectedOption: null,
        timeIsUp: false,
        mapboxAccessToken: "pk.eyJ1IjoiYWJ1YmFrcnNoIiwiYSI6ImNsaDF0NXo3NzA3Y24zb25wMmViZ3ExbTMifQ.mxkSE9xxV486lzxogWKhdw",
        transportOptions: [
          {
            label: "Такси",
            icon: require("../assets/car.svg"),
            details: { sum: "234 грн", time: "15 мин" },
          },
          {
            label: "Частный водитель",
            icon: require("../assets/private.svg"),
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
  
        if (!start || !end || !start.lat || !start.lon || !end.lat || !end.lon) {
          console.error("Start or End point coordinates are missing");
          return [];
        }
  
        return [
          [start.lon, start.lat], // Start point (lon, lat)
          [end.lon, end.lat],     // End point (lon, lat)
        ];
      },
    },
    mounted() {
      mapboxgl.accessToken = this.mapboxAccessToken;
      this.initializeMap();
    },
    methods: {
      openModal(mode) {
        this.$store.state.modalOn = true;
        this.$store.state.chooseMode = mode;
      },
      selectOption(index) {
        this.selectedOption = index;
      },
      initializeMap() {
        const map = new mapboxgl.Map({
          container: this.$refs.mapContainer, // Container for the map
          style: "mapbox://styles/mapbox/streets-v11", // Map style
          center: [this.$store.state.startPoint.lon, this.$store.state.startPoint.lat], // Initial position (lon, lat)
          zoom: 13,
        });
  
        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());
  
        // Add markers
        new mapboxgl.Marker()
          .setLngLat([this.$store.state.startPoint.lon, this.$store.state.startPoint.lat])
          .setPopup(new mapboxgl.Popup().setText(this.$store.state.startPoint.title))
          .addTo(map);
  
        new mapboxgl.Marker()
          .setLngLat([this.$store.state.endPoint.lon, this.$store.state.endPoint.lat])
          .setPopup(new mapboxgl.Popup().setText(this.$store.state.endPoint.title))
          .addTo(map);
  
        // Add polyline (route)
        if (this.routeCoordinates.length > 0) {
          map.on("load", () => {
            map.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: this.routeCoordinates,
                },
              },
            });
            map.addLayer({
              id: "route",
              type: "line",
              source: "route",
              paint: {
                "line-color": "#0000FF",
                "line-width": 4,
                "line-opacity": 0.7,
              },
            });
          });
        }
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
  
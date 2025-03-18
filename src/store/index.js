import { createStore } from 'vuex'

export default createStore({
  state: {
    modalOn: 0,
    offer: 0,
    cancel: 0,
    chooseMode: 'start',
    startPoint: {title: 'Москва',lat: 55.7509544,lon: 37.61757549999999},
    endPoint: {title: 'выберите адрес',lat: 55.6509544,lon: 37.61757549999999},
    routeInfo: null,
    langLoaded: null,
    successMessage: 'Ваш заказ принят',
    successModal: false
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

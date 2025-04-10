<template>

    <div class="h-screen w-full absolute px-8 top-0 bg-gray-400 z-50 flex justify-center items-center bg-opacity-75 backdrop-blur">
        <div class="border-2 rounded-lg bg-white p-4 space-y-10 pt-4">
            <div class="flex justify-end">
                <img @click="() => this.$store.state.offer = false" src="../assets/clear.svg" alt="">
            </div>
            <h2 class="text-start text-xl font-bold">{{ this.$store.state.langLoaded.offer_price_btn }}</h2>
            <div class="flex items-center">
                <input v-model="localPrice" type="number" class="p-2 border-2 rounded-xl me-3 outline-none border-blue-400">
                <div class="text-my-blue font-bold">{{ currencySymbol }}</div>
            </div>
            <div class=" flex space-x-2 font-semibold">
                <button @click="offerPrice" class="flex-1 p-3  text-white  rounded-xl shadow-xl hover:bg-blue-500 my-blue">
                    {{ this.$store.state.langLoaded.continue_btn }}
                </button>
                <button @click="closeWebApp" class="flex-1 p-3 text-white  rounded-xl shadow-xl hover:bg-red-600 my-red ">
                    {{ this.$store.state.langLoaded.cancel_order_btn }}

                </button>
                
            </div>

        </div>
    </div>

</template>


<script>


export default {
    name: 'Modal Alert',
    data: () => ({
        localPrice: null,
    }),
    computed: {
        currencySymbol() {
            return this.$store.state.routeInfo?.currency_symbol || '$';
        }
    },
    methods: {
        offerPrice() {

            this.$store.state.offeredPrice = this.localPrice;

            this.$store.state.routeInfo.transport_type_dict.taxi_price = this.$store.state.offeredPrice;
            this.$store.state.routeInfo.transport_type_dict.private_price = this.$store.state.offeredPrice;
            this.$store.state.routeInfo.transport_type_dict.moto_price = this.$store.state.offeredPrice;
            this.$store.state.offer = false
        },
        closeWebApp() {
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.close(); // Закрытие приложения
            } else {
                console.error("Ошибка: Telegram WebApp не обнаружен!");
            }
        }
    }
}


</script>   
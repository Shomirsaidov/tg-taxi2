<template>

    <div class="h-screen w-full absolute px-8 top-0 bg-gray-400 z-50 flex justify-center items-center bg-opacity-75 backdrop-blur">
        <div class="border-2 rounded-lg bg-white p-4 space-y-10 pt-4">
            <div class="flex justify-end">
                <img @click="() => this.$store.state.cancel = false" src="../assets/clear.svg" alt="">
            </div>
            <h2 class="text-xl font-bold">{{ this.$store.state.langLoaded.cancel_question }}</h2>
            <div class=" flex space-x-2 font-semibold">
                <button @click="closeWebApp" class="flex-1 p-3  text-white  rounded-xl shadow-xl hover:bg-red-600 my-red">
                    {{ this.$store.state.langLoaded.cancel_order_btn }}
                </button>
                <button @click="() => this.$store.state.cancel = false" class="flex-1 p-3 text-white  rounded-xl shadow-xl hover:bg-blue-600 my-blue">
                    {{ this.$store.state.langLoaded.continue_btn }}
                </button>
                
            </div>

        </div>
    </div>

</template>


<script>


export default {
    name: 'Modal Alert',
    mounted() {
        if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready(); // Telegram WebApp готов
        }
    },
    methods: {
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
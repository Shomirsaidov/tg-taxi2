<template>

    <div class="h-screen w-full absolute px-8 top-0 bg-gray-400 z-50 flex justify-center items-center bg-opacity-75 backdrop-blur">
        <div class="border-2 rounded-lg bg-white p-4 space-y-10 pt-4">
            <div class="flex justify-end">
                <img @click="() => this.$store.state.offer = false" src="../assets/clear.svg" alt="">
            </div>
            <h2 class="text-start text-xl font-bold">Ваша цена?</h2>
            <div class="flex items-center">
                <input type="text" class="p-2 border-2 rounded-xl me-3 outline-none border-blue-400" placeholder="220">
                <div class="text-my-blue">грн</div>
            </div>
            <div class=" flex space-x-2 font-semibold">
                <button class="flex-1 p-3  text-white  rounded-xl shadow-xl hover:bg-red-600 my-red">
                    Да, отменить заказ
                </button>
                <button class="flex-1 p-3 text-white  rounded-xl shadow-xl hover:bg-blue-600 my-blue">
                    Нет, продолжить
                </button>
                
            </div>

        </div>
    </div>

</template>


<script>


export default {
    name: 'Modal Alert'
}


</script>   
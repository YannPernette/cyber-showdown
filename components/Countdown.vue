<script setup lang="ts">
import { io } from "socket.io-client";
import { useRoute } from "vue-router";

const props = defineProps<{
    id: string
}>();

const socket = ref();
const config = useRuntimeConfig().public;
const route = useRoute();
const countdownText = ref("En attente de l'autre joueur...");
const showCountdown = ref(true);
const numbers = ["Préparez-vous", "GO!"];
let index = 0;

const updateCountdown = () => {
    countdownText.value = numbers[index];

    index++;
    if (index < numbers.length) {
        setTimeout(updateCountdown, 1000);
    } else {
        setTimeout(() => (showCountdown.value = false), 1000);
    }

    setTimeout(() => {
        socket.value = io(config.apiTrackingBaseUrl);
        socket.value.emit("start-game", props.id);
    }, 1500);
};

onMounted(() => {
    socket.value = io(config.apiTrackingBaseUrl);

    socket.value.emit("join-session", props.id);

    socket.value.on("start-countdown", () => {
        updateCountdown()
    });
});
</script>

<template>
    <div v-if="showCountdown" class="countdown">{{ countdownText }}</div>
</template>

<style lang="scss" scoped>
.countdown {
    font-size: 5rem;
    font-weight: bold;
    text-align: center;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: scale(0.8);
    }

    50% {
        opacity: 1;
        transform: scale(1);
    }

    100% {
        opacity: 0;
        transform: scale(1.2);
    }
}
</style>
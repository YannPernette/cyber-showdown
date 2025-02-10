<script setup lang='ts'>
import { Rive } from '@rive-app/canvas';
import { io } from 'socket.io-client'

const props = defineProps<{ id: string }>();

const socket = ref();
const config = useRuntimeConfig().public;

const { data } = await useAsyncData('random-game', async () =>
  await useAPI(`/random-game`, { method: 'GET' })
);

const riveCanvasGame = ref();
const riveCanvasTime = ref();
const result = ref('');
let riveInstanceGame: Rive | null = null;
let riveInstanceTime: Rive | null = null;
const gameWinConditionMet = ref(false);
const timeFinished = ref(false);

onMounted(() => {
  socket.value = io(config.apiTrackingBaseUrl);

  if (!riveCanvasGame.value || !riveCanvasTime.value || !data.value?.name || !data.value?.time || !data.value?.win_condition) {
    console.error('Canvas ou données du jeu manquants');
    return;
  }

  // Rejoindre la session
  socket.value.emit("join-session", props.id);

  setTimeout(() => {
    socket.value.emit("player-ready", props.id);
  }, 1500);

  socket.value.on("game-started", () => {
    startAnimations();
  });

  // Initialisation de Rive pour le jeu
  riveInstanceGame = new Rive({
    src: `/games/${data.value.name}.riv`,
    canvas: riveCanvasGame.value,
    autoplay: false,
    stateMachines: "State Machine 1",
    onLoad: () => {
      if (riveInstanceGame) {
        riveInstanceGame.resizeDrawingSurfaceToCanvas();
      }
    },
    onStateChange: (event) => {
      const stateData = event?.data;
      if (Array.isArray(stateData) && stateData.includes(data.value.win_condition)) {
        gameWinConditionMet.value = true;
      }
    },
  });

  // Initialisation de Rive pour le temps
  riveInstanceTime = new Rive({
    src: `/games/time/${data.value.time}.riv`,
    canvas: riveCanvasTime.value,
    autoplay: false,
    stateMachines: "State Machine 1",
    onLoad: () => {
      if (riveInstanceTime) {
        riveInstanceTime.resizeDrawingSurfaceToCanvas();
      }
    },
    onStateChange: (event) => {
      const stateData = event?.data;
      if (Array.isArray(stateData) && stateData.includes('Finished')) {
        timeFinished.value = true;
        if (!gameWinConditionMet.value) {
          console.log("Temps écoulé");
          socket.value.emit('decrease-lives', props.id);
          useAPI(`/session/${props.id}/decrease-lives`, { method: 'POST', body: {} });
          result.value = 'loose';
          setTimeout(() => location.reload(), 2000);
        }
      }
    },
  });
});

// Fonction pour démarrer les animations
const startAnimations = () => {
  if (riveInstanceGame) {
    riveInstanceGame.play();
  }
  if (riveInstanceTime) {
    riveInstanceTime.play();
  }
};

// Vérification combinée pour recharger la page après victoire
watch([gameWinConditionMet, timeFinished], () => {
  if (gameWinConditionMet.value && timeFinished.value) {
    console.log("Temps écoulé, GAGNÉ");
    result.value = 'win';
    setTimeout(() => location.reload(), 2000);
  }
});
</script>


<template>
  <div>
    <div v-if="result === 'loose'">JEU PERDU</div>
    <div v-if="result === 'win'">JEU GAGNE</div>
    <canvas ref="riveCanvasGame" />
    <canvas ref="riveCanvasTime" />
  </div>
</template>


<style>
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
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
        // Récupère les dimensions de l'artboard
        const { minX, minY, maxX, maxY } = riveInstanceGame.bounds;
        const width = maxX - minX;
        const height = maxY - minY;

        // Redimensionne le canvas pour qu'il corresponde à la taille de l'artboard Rive
        riveCanvasGame.value.width = width;
        riveCanvasGame.value.height = height;

        // Redimensionne la surface de dessin si nécessaire
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
        // Récupère les dimensions de l'artboard
        const { minX, minY, maxX, maxY } = riveInstanceTime.bounds;
        const width = maxX - minX;
        const height = maxY - minY;

        // Redimensionne le canvas pour qu'il corresponde à la taille de l'artboard Rive
        riveCanvasTime.value.width = width;
        riveCanvasTime.value.height = height;

        // Redimensionne la surface de dessin si nécessaire
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
    }
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
});
</script>


<template>
  <div>
    <div class="level-result" :class="{ '-is-visible': result === 'loose' }">
      <span class="level-result__text -loose">Niveau échoué</span>
    </div>
    <div class="level-result" :class="{ '-is-visible': result === 'win' }">
      <span class="level-result__text -win">Niveau réussi</span>
    </div>

    <div class="rive">
      <canvas ref="riveCanvasGame" class="rive__game" />
      <canvas ref="riveCanvasTime" class="rive__time" />
    </div>
  </div>
</template>


<style lang='scss'>
canvas {
  display: block;
  width: 100%;
  // height: 100%;
}

.level-result {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  display: grid;
  grid-template-columns: 4fr 1fr;
  pointer-events: none;
  transform: translateY(-100%);
  transition: all .5s ease;

  &.-is-visible {
    transform: none;
  }

  &__text {
    font-family: $pressStart;
    font-size: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;

    &.-loose {
      background-color: $danger;
      color: $light;
    }

    &.-win {
      background-color: $primary;
      color: $black;
    }
  }
}

.rive {
  // height: 10%;
  width: 90%;
  display: grid;
  grid-template-rows: 3fr 1fr;
  justify-self: center;

}
</style>
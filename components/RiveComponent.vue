<script setup lang='ts'>
import { Rive } from '@rive-app/canvas';

const { data } = await useAsyncData('random-game', async () =>
  await useAPI(`/random-game`, {
    method: 'GET'
  })
)

const riveCanvasGame = ref();
const riveCanvasTime = ref();
let riveInstanceGame = null;
let riveInstanceTime = null;
const gameWinConditionMet = ref(false);  // Suivi si la condition de victoire est atteinte
const timeFinished = ref(false);          // Suivi si le temps est écoulé

onMounted(() => {
  if (!riveCanvasGame.value || !riveCanvasTime.value || !data.value?.name || !data.value?.time || !data.value?.win_condition) {
    console.error('Canvas ou données du jeu manquants');
    return;
  }

  // Instance de Rive pour le jeu
  riveInstanceGame = new Rive({
    src: `/games/${data.value.name}.riv`,
    canvas: riveCanvasGame.value,
    autoplay: false, // Ne commence pas l'animation immédiatement
    stateMachines: "State Machine 1",
    onLoad: () => {
      riveInstanceGame.resizeDrawingSurfaceToCanvas();
    },
    onStateChange: (event) => {
      const stateData = event?.data;
      // Vérification de la condition de victoire dans GameInstance
      if (Array.isArray(stateData) && stateData.includes(data.value.win_condition)) {
        gameWinConditionMet.value = true; // Condition de victoire atteinte
        console.log("C'est gagné !");
      }
    },
  });

  // Instance de Rive pour le temps
  riveInstanceTime = new Rive({
    src: `/games/time/${data.value.time}.riv`,
    canvas: riveCanvasTime.value,
    autoplay: false, // Ne commence pas l'animation immédiatement
    stateMachines: "State Machine 1",
    onLoad: () => {
      riveInstanceTime.resizeDrawingSurfaceToCanvas();
    },
    onStateChange: (event) => {
      const stateData = event?.data;
      // Vérification de l'état "Finished" du temps dans TimeInstance
      if (Array.isArray(stateData) && stateData.includes('Finished')) {
        timeFinished.value = true;  // Temps écoulé
        if (!gameWinConditionMet.value) { // Affiche "Temps écoulé" si la condition de victoire n'est pas remplie
          console.log("Temps écoulé");
        }
      }
    },
  });
});

// Fonction pour démarrer toutes les animations
const startAnimations = () => {
  if (riveInstanceGame) {
    riveInstanceGame.play();  // Démarre l'animation pour le jeu
    console.log("Animation du jeu lancée !");
  }

  if (riveInstanceTime) {
    riveInstanceTime.play();  // Démarre l'animation pour le temps
    console.log("Animation du temps lancée !");
  }
};

// Vérification combinée : Si les deux conditions sont remplies
watch([gameWinConditionMet, timeFinished], () => {
  if (gameWinConditionMet.value && timeFinished.value) {
    console.log("Temps écoulé, GAGNÉ");
  }
});
</script>

<template>
  <div>
    <canvas ref="riveCanvasGame" />
    <canvas ref="riveCanvasTime" />
    <button @click="startAnimations">Démarrer les animations</button>
    {{ data }}
  </div>
</template>

<style>
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
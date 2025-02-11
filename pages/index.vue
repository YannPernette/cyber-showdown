<script setup lang='ts'>
const squares = ref<number>(0);
const squareSize = 30; // Taille des carrés en pixels

const calculateGrid = () => {
    const cols = Math.floor(window.innerWidth / squareSize);
    const rows = Math.floor(window.innerHeight / squareSize);
    squares.value = cols * rows;
};

// Calcul initial
onMounted(() => {
    calculateGrid();
    window.addEventListener("resize", calculateGrid);
});

// Nettoyage de l'écouteur d'événements
onBeforeUnmount(() => {
    window.removeEventListener("resize", calculateGrid);
});
</script>


<template>
    <div>
        <div class="grid-background">
            <span v-for="n in squares" :key="n" class="square" />
        </div>

        <div class="home">
            <div>
                <h1>Cyber Showdown</h1>
            </div>

            <div class="home__layout">
                <AuthenticateForm />

                <div class="home__test">test</div>
            </div>

        </div>

        <!-- <CreateSession /> -->
    </div>
</template>


<style lang='scss'>
$size: 30px; // Taille du carré
$gap: 2px; // Espace entre les carrés
$border-color: rgba(255, 255, 255, 0.2); // Couleur de la bordure des carrés

.grid-background {
    position: absolute;
    width: 101vw;
    height: 100vh;
    display: flex;
    flex-wrap: wrap;
    gap: $gap;
    overflow: hidden;

    // Fond animé
    &::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(rgba(255, 255, 255, 0.062), rgba(255, 255, 255, 0.54), rgba(255, 255, 255, 0.062));
        animation: animate 5s linear infinite;
        z-index: -1;
    }
}

@keyframes animate {
    0% {
        transform: translateY(-100%);
    }

    100% {
        transform: translateY(100%);
    }
}

.grid-background span.square {
    width: $size;
    height: $size;
    background: $dark;
    border: 1px solid $border-color;
    box-sizing: border-box; // Assurer que la bordure ne modifie pas la taille
    transition: all 0.3s ease-in-out;

    &:hover {
        background: rgb(255, 255, 255);
        transition: all 0s;
    }
}

.home {
    position: absolute;
    width: 100vw;
    height: 100vh;
    // pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &__layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 3rem;
        width: 90%;
    }

    &__test {
        background-color: red;
    }
}
</style>
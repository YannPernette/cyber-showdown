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
    </div>
</template>


<style lang='scss'>
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
<script setup lang='ts'>
const { id } = useRoute().params;
const config = useRuntimeConfig().public;

const { data, refresh } = await useAsyncData('get-session', async () =>
    await useAPI(`/session/${id}`, {
        method: 'GET'
    })
)
</script>


<template>
    <div class="game">
        <div>
            <RiveComponent />
             <p>le jeu</p>
        </div>

        <div class="game__scoreboard">
            <UserCard v-bind="data.user1" />
            <span class="lobby__vs">VS</span>
            <UserCard v-bind="data.user2" />
        </div>
    </div>
</template>


<style lang='scss'>
.game {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 4fr 1fr;

    &__scoreboard {
        background-color: $tertiary;
    }
}
</style>
<script setup lang='ts'>
import { io } from 'socket.io-client'

const socket = ref()
const config = useRuntimeConfig().public;

const router = useRouter()
const { id } = useRoute().params;

const { data, refresh } = await useAsyncData('get-session-game', async () =>
    await useAPI(`/session/${id}`, {
        method: 'GET'
    })
)

if (data.value.user1_lives === 0 || data.value.user2_lives === 0) {
    router.push(`/session/${id}/recap`)
}

onMounted(() => {
    socket.value = io(config.apiTrackingBaseUrl)

    // 🔄 Écouter l'événement et rafraîchir les données
    socket.value.on("life-removed", () => {
        refresh();
        console.log('xqshjq')
    })
})

definePageMeta({
    layout: 'small'
});
</script>


<template>
    <div class="game">
        <div style="height: 100vh;">
            <div class="game__start">
                <Countdown :id="id.toString()" />
            </div>
            <RiveComponent :id="id.toString()" />
        </div>

        <div class="game__scoreboard">

            <div class="game__groupUser">
                <div class="game__lives">
                    <div>
                        <HeartFull v-if="data.user1_lives > 0" class="game__heart" />
                        <Heart v-else class="game__heart" />
                    </div>
                    <div>
                        <HeartFull v-if="data.user1_lives > 1" class="game__heart" />
                        <Heart v-else class="game__heart" />
                    </div>
                    <div>
                        <HeartFull v-if="data.user1_lives > 2" class="game__heart" />
                        <Heart v-else class="game__heart" />
                    </div>
                </div>

                <UserCard v-bind="data.user1" in-game />
            </div>

            <span class="game__vs">VS</span>

            <div class="game__groupUser">
                <div class="game__lives">
                    <div>
                        <HeartFull v-if="data.user2_lives > 0" class="game__heart" />
                        <Heart v-else class="game__heart" />
                    </div>
                    <div>
                        <HeartFull v-if="data.user2_lives > 1" class="game__heart" />
                        <Heart v-else class="game__heart" />
                    </div>
                    <div>
                        <HeartFull v-if="data.user2_lives > 2" class="game__heart" />
                        <Heart v-else class="game__heart" />
                    </div>
                </div>
                
                <UserCard v-bind="data.user2" in-game />
            </div>
        </div>

        <!-- {{ data }} -->
    </div>
</template>


<style lang='scss'>
.game {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 4fr 1fr;

    &__start {
        width: -webkit-fill-available;
        height: calc(100% - 5px);
        position: absolute;
        pointer-events: none;
        display: grid;
        grid-template-columns: 4fr 1fr;
    }

    &__scoreboard {
        background: rgba(6, 0, 0, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        border-left: 3px solid $secondary;
    }

    &__groupUser {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    &__lives {
        display: flex;
        gap: 1rem;
    }

    &__heart {
        width: 3rem;
        height: 3rem;
    }

    &__vs {
        font-family: $pressStart;
        font-size: 2.5rem;
        letter-spacing: 3px;
    }
}
</style>
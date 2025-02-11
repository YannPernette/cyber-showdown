<script setup lang='ts'>
import { io } from 'socket.io-client'

const { id } = useRoute().params;
const config = useRuntimeConfig().public;

const { data, refresh } = await useAsyncData('get-session', async () =>
    await useAPI(`/session/${id}`, {
        method: 'GET'
    })
)

const route = useRoute()
const router = useRouter()

const socket = ref()
socket.value = io(config.apiTrackingBaseUrl)
const sessionId = ref<string | null>(null)

sessionId.value = route.params.id as string

const goToGame = () => {
    socket.value.emit('all-there', sessionId.value)
}

// Connexion Socket.IO au chargement du composant
onMounted(() => {
    if (route.params.id) {
        socket.value.emit('join-session', sessionId.value) // Indique que l'utilisateur rejoint cette session

        // 🔄 Écouter l'événement et rafraîchir la session
        socket.value.on("session-updated", () => {
            console.log("Un joueur a rejoint, rafraîchissement des données...")
            refresh()
        })

        // Envoyer des "pings" toutes les 30 secondes pour indiquer une activité
        setInterval(() => {
            socket.value.emit('activity', sessionId.value)
        }, 30000)

        socket.value.on("go-game", () => {
            router.push(`/session/${sessionId.value}/game`)
        })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
})

// Déconnexion propre en quittant la page
onBeforeUnmount(() => {
    if (sessionId.value) {
        socket.value.emit('leave-session', sessionId.value)
    }

    window.removeEventListener('beforeunload', handleBeforeUnload)
})

// Alerte lorsqu'on essaie de quitter la page au rechargement
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault()
    event.returnValue = 'Si vous rechargez la page, votre partie se terminera. Êtes-vous sûr de vouloir quitter ?'
}

// Alerte lorsqu'on essaie de quitter avec la flèche arrière
onBeforeRouteLeave((to, from, next) => {
    // Si l'utilisateur va vers "/game", on ne déclenche pas l'événement leave-session
    if (to.path === `/session/${sessionId.value}/game`) {
        next()
        return
    }

    const confirmation = window.confirm('Êtes-vous sûr de vouloir quitter votre partie ? Elle sera définitivement fermée.')
    if (confirmation) {
        if (sessionId.value) {
            socket.value.emit('leave-session', sessionId.value)
        }
        next()
    } else {
        next(false)
    }
})

definePageMeta({
    layout: 'small'
});
</script>


<template>
    <div class="lobby">
        <h1>Lobby ({{ data.id }})</h1>

        <h2 v-if="data.status === 'closed'">Session fermée</h2>

        <div v-if="data.user2_id" class="lobby__users">
            <UserCard v-bind="data.user1" />
            <span class="lobby__vs">VS</span>
            <UserCard v-bind="data.user2" />
        </div>

        <div v-else>
            <UserCard v-bind="data.user1" />
            <p>En attente d'un autre joueur...</p>
        </div>

        <Button v-if="data.user2_id" @click="goToGame()">Lancer la partie !</Button>
        <!-- <NuxtLink :to="'game'">game</NuxtLink> -->
    </div>
</template>


<style lang='scss'>
.lobby {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 80vh;
    margin-block: 10vh;

    &__users {
        display: flex;
        align-items: center;
        gap: 5rem;
    }

    &__vs {
        font-family: $pressStart;
        font-size: 2.5rem;
        letter-spacing: 3px;
    }
}
</style>
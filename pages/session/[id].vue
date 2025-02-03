<script setup lang='ts'>
import { io } from 'socket.io-client'

const { id } = useRoute().params;
const config = useRuntimeConfig().public;

const { data } = await useAsyncData('session', async () =>
    await useAPI(`/session/${id}`, {
        method: 'GET'
    })
)

const route = useRoute()
const socket = ref()
const sessionId = ref<string | null>(null)

// Connexion Socket.IO au chargement du composant
onMounted(() => {
    socket.value = io(config.apiTrackingBaseUrl)

    if (route.params.id) {
        sessionId.value = route.params.id as string
        socket.value.emit('join-session', sessionId.value) // Indique que l'utilisateur rejoint cette session

        // Envoyer des "pings" toutes les 30 secondes pour indiquer une activité
        setInterval(() => {
            socket.value.emit('activity', sessionId.value)
        }, 30000)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
})

// Déconnexion propre en quittant la page
onBeforeUnmount(() => {
    if (sessionId.value) {
        socket.value.emit('leave-session', sessionId.value)
    }
    socket.value.disconnect() // Déconnexion propre du socket

    window.removeEventListener('beforeunload', handleBeforeUnload)
})

// Alerte lorsqu'on essaie de quitter la page au rechargement
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault()
    event.returnValue = 'Si vous rechargez la page, votre partie se terminera. Êtes-vous sûr de vouloir quitter ?'
}

// Alerte lorsqu'on essaie de quitter avec la flèche arrière
onBeforeRouteLeave((to, from, next) => {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir quitter votre partie ? Elle sera définitivement fermée.')
    if (confirmation) {
        next()
    } else {
        next(false)
    }
})
</script>


<template>
    <div>
        <h1>Ca joue ou quoi la team</h1>

        <h2 v-if="data.status === 'closed'">Session fermée</h2>

        <div>
            <p>Utilisateur 1 : {{ data.user1_id }}</p>
            <p>Utilisateur 2 : {{ data.user2_id }}</p>
        </div>

        <pre v-if="data">
        {{ data }}
    </pre>
    </div>
</template>


<style lang='scss'></style>
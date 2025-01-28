<script setup lang='ts'>
const router = useRouter()

async function createSession(event: Event) {
    event.preventDefault()

    const response = await useAPI('/session/create', {
        method: 'POST',
        body: {}
    })

    if (response && response.sessionId) {
      // Redirection vers la page de session avec l'ID unique
      await router.push(`/session/${response.sessionId}`);
    } else {
      console.error('Erreur: ID de session manquant dans la réponse');
    }
}

async function joinSession(event: Event) {
    event.preventDefault()

    const response = await useAPI('/session/join', {
        method: 'POST',
        body: {}
    })

    if (response && response.sessionId) {
      // Redirection vers la page de session avec l'ID unique
      await router.push(`/session/${response.sessionId}`);
    } else {
      console.error('Erreur: ID de session manquant dans la réponse');
    }
}
</script>


<template>
    <div>
        <button @click="createSession">Créer une partie !</button>
        <button @click="joinSession">Rejoindre une partie !</button>
    </div>
</template>


<style lang='scss'></style>
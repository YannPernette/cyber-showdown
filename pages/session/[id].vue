<script setup lang='ts'>
const { id } = useRoute().params;

const { data } = await useAsyncData('session', async () =>
    await useAPI(`/session/${id}`, {
        method: 'GET'
    })
)
</script>


<template>
<div>
    <h1>Ca joue ou quoi la team</h1>

    <div>
        <p>Utilisateur 1 : {{ data.user1_id }}</p>
        <p>Utilisateur 2 : {{ data.user2_id }}</p>
    </div>

    <pre v-if="data">
        {{ data }}
    </pre>
</div>
</template>


<style lang='scss'>

</style>
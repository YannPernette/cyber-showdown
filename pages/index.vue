<script setup lang='ts'>
const select = ref(0)
</script>


<template>
<div class="mx-page">
    <h1>Cyber Showdown</h1>

    <div style="margin-bottom: 30px;">
        <button @click="select = 0">Créer un compte</button>
        <button @click="select = 1">Se connecter</button>
    </div>

    <div v-if="select === 0">
        <RegisterForm />
    </div>

    <CreateSession />
</div>
</template>


<style lang='scss'>

</style>
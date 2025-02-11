<script setup lang='ts'>

</script>


<template>
    <div class="header">
        <NuxtLink to="/">
            <Logo class="header__logo" />
        </NuxtLink>
    </div>
</template>


<style lang='scss'>
.header {
    position: absolute;
    top: 0;
    z-index: 1;

    &__logo {
        width: 5rem;
        height: 5rem;
    }
}
</style>
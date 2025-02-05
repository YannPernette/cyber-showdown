<script setup lang='ts'>
defineProps<{
    isNuxtLink?: boolean;
    to?: string;
}>();
</script>


<template>
    <component :is="isNuxtLink ? 'RouterLink' : 'button'" v-bind="isNuxtLink ? { to } : { type: 'button' }" class="button">
        <slot />
    </component>
</template>


<style lang='scss'>
.button {
    background-color: $secondary;
    color: $light;
    border: 1px solid $secondary;
    cursor: pointer;
    text-transform: uppercase;
    padding: 2rem 2rem;
    border-radius: 0.5rem;
    font-size: $largeTxt;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.7rem;
    font-family: $audioWide;
    transition: all .3s ease;

    &:hover {
        background-color: $primary;
        color: $black;
    }
}
</style>
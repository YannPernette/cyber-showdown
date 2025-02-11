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
    background-color: $primary;
    color: $black;
    border: 1px solid $primary;
    cursor: pointer;
    text-transform: uppercase;
    padding: 0.8rem 1rem;
    border-radius: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.7rem;
    font-family: $genos;
    transition: all .3s ease;

    &:hover {
        background-color: $secondary;
        border-color: $secondary;
        color: $light;
    }
}
</style>
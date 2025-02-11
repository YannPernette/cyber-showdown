<script setup lang='ts'>
import PadlockIcon from "@/components/icon/PadlockIcon.vue";
import SpeedIcon from "@/components/icon/SpeedIcon.vue";
defineProps<{
    type: string,
}>();
</script>


<template>
    <div class="chooseCard" :class="{ '-left': type === 'Créer', '-right': type === 'Rejoindre' }">
        <component :is="type === 'Créer' ? PadlockIcon : SpeedIcon" class="chooseCard__icon" />
        <h2 class="chooseCard__text"><span>{{ type }}</span><span>une partie</span></h2>
    </div>
</template>


<style lang='scss'>
.chooseCard {
    background: rgba(6, 0, 0, 0.25);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 2px solid $primary;
    color: $primary;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 5rem;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    transition: all .3s ease;
    pointer-events: all;
    cursor: pointer;

    &:hover {
        box-shadow: 0px 0px 42px 18px $secondary;

        .chooseCard__icon {
            fill: $primary;
        }
    }

    &.-left {
        align-items: flex-start;
    }

    &.-right {
        align-items: flex-end;
    }

    &__icon {
        fill: none;
        stroke: $primary;
        stroke-width: 5px;
        height: 12rem;
        width: 12rem;
        overflow: visible;
        transition: all .3s ease;
    }

    &__text {
        display: flex;
        flex-direction: column;
        font-size: 2.5rem;
    }
}
</style>
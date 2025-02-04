<script setup lang='ts'>
defineProps<{
    profile_picture: string,
    username: string
}>();
</script>


<template>
    <div class="userCard">
        <div class="userCard__container">
            <img v-if="profile_picture" class="userCard__picture" :src="profile_picture" alt="">
            <DefaultUser v-else class="userCard__picture" />
        </div>
        <p class="userCard__name">{{ username }}</p>
    </div>
</template>


<style lang='scss'>
.userCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    &__container {
        position: relative;
        display: flex;
        margin: 0;

        &::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            border-radius: 20rem;
            border: 3px solid $primary;
            animation: rotate-border 4s linear infinite;
            clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%);
        }
    }

    &__picture {
        border-radius: 20rem;
        width: 10rem;
        height: 10rem;
        object-fit: cover;
    }

    &__name {
        font-family: $genos;
        font-size: 2rem;
    }
}

@keyframes rotate-border {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
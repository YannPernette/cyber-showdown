<script setup lang='ts'>
defineProps<{
    small?: boolean,
}>();

const { data, refresh } = await useAsyncData('get-user-header', async () =>
    await useAPI('/user', {
        method: 'GET'
    })
)
</script>


<template>
    <div class="header">
        <div class="header__content">
            <NuxtLink to="/choice">
                <Logo class="header__logo" :class="{ '-small': small }" />
            </NuxtLink>

            <div v-if="data && !small" class="header__user">
                <img v-if="data.profile_picture" class="header__userPicture" :src="data.profile_picture" alt="">
                <DefaultUser v-else class="header__userPicture" />
                <div>
                    <p class="header__userName">{{ data.username }}</p>
                    <p class="header__userEmail">{{ data.email }}</p>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang='scss'>
.header {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100vw;

    &__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
    }

    &__logo {
        fill: $light;
        width: 5rem;
        height: 5rem;
        filter: drop-shadow(4px 4px 6px #679cc0e0);
        transition: all .3s ease;

        &:hover {
            fill: $primary;
        }

        &.-small {
            width: 3rem;
            height: 3rem;
        }
    }

    &__user {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 1rem 2.5rem;
        background: rgba(6, 0, 0, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 10px;
    }

    &__userPicture {
        width: 5rem;
        height: 5rem;
        border: 2px solid $primary;
        border-radius: 20rem;
    }

    &__userName {
        margin-bottom: 0.5rem;
        font-family: $genos;
        font-size: 1.7rem;
    }

    &__userEmail {
        margin: 0;
        font-size: 0.8rem;
        font-weight: 300;
    }
}
</style>
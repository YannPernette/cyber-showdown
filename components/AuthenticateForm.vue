<script setup lang='ts'>
const select = ref(0)
</script>


<template>
    <div class="authenticate">
        <div class="authenticate__choice">
            <span class="authenticate__choiceItem" :class="{ '-active': select === 0 }"
                @click="select = 0">Inscription</span>
            <span class="authenticate__choiceItem" :class="{ '-active': select === 1 }"
                @click="select = 1">Connexion</span>
        </div>
        <div class="authenticate__form">
            <RegisterForm v-if="select === 0" />
        </div>
    </div>
</template>


<style lang='scss'>
.authenticate {
    &__choice {
        display: flex;
    }

    &__choiceItem {
        font-family: $audioWide;
        font-size: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem 0.5rem 0 0;
        cursor: pointer;
        transition: all .3s ease;

        &:hover {
            color: $primary;
        }

        &.-active {
            background: rgba(6, 0, 0, 0.25);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: $light !important;
            cursor: default !important;
        }
    }

    &__form {
        background: rgba(6, 0, 0, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 10px;
        width: 100%;
    }
}
</style>
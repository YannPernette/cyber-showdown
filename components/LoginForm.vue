<script setup lang='ts'>
const email = ref('')
const password = ref('')

const router = useRouter()

async function onSubmit(event: Event) {
    event.preventDefault()

    try {
        const data = await useAPI('/auth/login', {
            method: 'POST',
            body: { email: email.value, password: password.value },
            auth: false
        })

        const cookieJwt = useCookie('api_tracking_jwt')
        cookieJwt.value = data.token

        await router.push('/choice')

    } catch (error: unknown) {
        if (error instanceof Error && 'response' in error) {
            const apiError = error as { response: { statusText: string } };
            throw new Error(`Erreur : ${apiError.response.statusText}`);
        } else {
            throw new Error('Erreur : Une erreur inattendue est survenue');
        }
    }
}
</script>


<template>
    <div>
        <form class="login__form" @submit="onSubmit">
            <InputGroup id="email" v-model="email" placeholder="test@mail.com" type="email" required>
                Email de l'utilisateur
            </InputGroup>

            <InputGroup id="password" v-model="password" placeholder="mdp123" type="password" required>
                Mot de passe
            </InputGroup>

            <Button type="submit">Me connecter</Button>
        </form>
    </div>
</template>


<style lang='scss'></style>
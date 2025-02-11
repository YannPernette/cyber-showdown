<script setup lang='ts'>
const email = ref('')
const username = ref('')
const password = ref('')
const selectedFile = ref();
const preview = ref('');
const router = useRouter()

const { data, refresh } = await useAsyncData('user', async () =>
    await useAPI('/user', {
        method: 'GET'
    })
)

async function createAccount(event: Event) {
    event.preventDefault()

    const formData = new FormData();
    formData.append('file', selectedFile.value);

    try {
        const data = await useAPI('/auth/register', {
            method: 'POST',
            body: {
                email: email.value,
                username: username.value,
                password: password.value,
                profile_picture: preview.value
            },
            auth: false
        })

        const cookieJwt = useCookie('api_tracking_jwt')
        cookieJwt.value = data.token

        await router.push('/')

        refresh()

    } catch (error: unknown) {
        if (error instanceof Error && 'response' in error) {
            const apiError = error as { response: { statusText: string } };
            throw new Error(`Erreur : ${apiError.response.statusText}`);
        } else {
            throw new Error('Erreur : Une erreur inattendue est survenue');
        }
    }
}

const handleFileUpload = (event: Event): void => {
    const target = event.target as HTMLInputElement;

    // Vérifier que les fichiers sont disponibles
    if (target.files && target.files[0]) {
        const file: File = target.files[0];
        selectedFile.value = file;

        // Générer un aperçu de l'image
        const reader: FileReader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target) {
                preview.value = e.target.result as string;
            }
        };
        reader.readAsDataURL(file);
    }
};
</script>


<template>
    <div>
        <form class="register" @submit="createAccount">
            <InputGroup id="email" v-model="email" placeholder="test@mail.com" type="email" required>
                Email
            </InputGroup>

            <InputGroup id="username" v-model="username" placeholder="Joueur 1" type="username" required>
                Nom d'utilisateur
            </InputGroup>

            <InputGroup id="password" v-model="password" placeholder="***" type="password" required>
                Mot de passe
            </InputGroup>

            <div>
                <label for="profile_picture">Photo de profil</label>
                <input id="profile_picture" accept="image/png, image/jpeg" type="file" @change="handleFileUpload">
                <div v-if="preview">
                    <p>Aperçu de l'image :</p>
                    <img :src="preview" alt="Aperçu" style="max-width: 200px;">
                </div>
            </div>

            <div>
                <button type="submit">Créér mon compte</button>
            </div>
        </form>

        <div v-if="data" style="margin-top: 50px;">
            <h3>Infos utilisateur</h3>
            <p>{{ data.email }}</p>
            <p>{{ data.username }}</p>
        </div>
    </div>
</template>


<style lang='scss'>
.register {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
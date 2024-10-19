<script>
    import pb, { login, createJellyfinUser } from '$lib/pocketbase';
    import { onMount } from 'svelte';

    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let errorMessage = '';
    let successMessage = '';

    onMount(() => {
        login();
    });

    async function createUser() {
        if (!validateForm()) {
            return;
        }

        try {
            // Check for existing users in the Pocketbase collection
            const existingUsers = await pb.collection('Jellyfin').getFullList({
                filter: `username="${username}" || email="${email}"`
            });

            if (existingUsers.length > 0) {
                errorMessage = 'Le nom d\'utilisateur ou l\'email est déjà utilisé. Veuillez en choisir un autre.';
                setTimeout(() => errorMessage = '', 5000);
                return;
            }

            const userData = {
                username: username,
                email: email,
                password: password
            };

            const authData = await pb.collection('Jellyfin').create(userData);
            createJellyfinUser(userData.username, userData.password);
            successMessage = 'Création de compte réussie';
            let countdown = 4;
            let intervalId = setInterval(() => {
                successMessage = `Création de compte réussie. Redirection dans ${countdown}...`;
                countdown--;
                if (countdown === 0) {
                    clearInterval(intervalId);
                    successMessage = 'Redirection...';
                    setTimeout(() => {
                        window.location.href = 'https://movies.ce-dev.eu';
                    }, 1000);
                }
            }, 1000);
        } catch (error) {
            console.error('Erreur de création de compte:', error);
            errorMessage = 'Erreur de création de compte. Veuillez réessayer.';
        }
    }

    function validateForm() {
        if (password !== confirmPassword) {
            errorMessage = 'Les mots de passe ne correspondent pas';
            return false;
        }
        if (!username || !email || !password || !confirmPassword) {
            errorMessage = 'Tous les champs sont obligatoires';
            return false;
        }
        return true;
    }

    function resetForm() {
        username = '';
        email = '';
        password = '';
        confirmPassword = '';
        errorMessage = '';
        successMessage = '';
    }
</script>

<div class="flex flex-col items-center justify-center max-h-screen">
    <h1 class="text-4xl font-bold text-slate-200 mb-8">Créer un compte <span class="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">jellyfin</span></h1>
    
    <form class="w-full max-w-lg bg-white/5 p-8 rounded-lg shadow-lg" on:submit|preventDefault={createUser}>
        <div class="mb-4">
            <label class="block text-slate-200 text-sm font-bold mb-2" for="username">Nom d'utilisateur</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline"
                   id="username" type="text" placeholder="Nom d'utilisateur" bind:value={username}>
        </div>
        <div class="mb-4">
            <label class="block text-slate-200 text-sm font-bold mb-2" for="email">Email</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline"
                   id="email" type="email" placeholder="Email" bind:value={email}>
        </div>
        <div class="mb-4">
            <label class="block text-slate-200 text-sm font-bold mb-2" for="password">Mot de passe</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline"
                   id="password" type="password" placeholder="Mot de passe" bind:value={password}>
        </div>
        <div class="mb-6">
            <label class="block text-slate-200 text-sm font-bold mb-2" for="confirmPassword">Confirmer le mot de passe</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline"
                   id="confirmPassword" type="password" placeholder="Confirmer le mot de passe" bind:value={confirmPassword}>
        </div>

        <!-- Error Messages -->
        {#if errorMessage}
            <div class="mb-4 text-red-500 text-sm">{errorMessage}</div>
        {/if}
        {#if successMessage}
            <div class="mb-4 text-green-500 text-sm">{successMessage}</div>
        {/if}

        <div class="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
            <button class="bg-gradient-to-b from-purple-500 to-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gradient-to-t text-sm sm:text-base"
                    type="submit">
              Créer un compte
            </button>
            <a href="/" class="bg-gradient-to-b from-purple-500 to-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gradient-to-t text-sm sm:text-base">
              Page d'accueil
            </a>
        </div>
    </form>
</div>

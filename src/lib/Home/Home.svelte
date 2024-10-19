<script lang="ts">
    import { onMount } from 'svelte';

    interface Movie {
        Id: number;
        Name: string;
        Overview: string;
        ProductionYear: number;
        RunTimeTicks: number;
    }

    let movies: Movie[] = [];
    let error: string | null = null; 
    let selectedMovie: Movie | null = null; 

    const apiUrl = import.meta.env.VITE_JELLYFIN_API_URL;
    const apiKey = import.meta.env.VITE_JELLYFIN_API_KEY;

    onMount(async () => {
        try {
            const response = await fetch(`${apiUrl}/Items?api_key=${apiKey}&IncludeItemTypes=Movie&Recursive=true`);
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des données: ${response.statusText}`);
            }
            const data = await response.json();
            movies = data.Items; 
        } catch (err) {
            error = (err as Error).message;
        }
    });

    function selectRandomMovie() {
        if (movies.length > 0) {
            const randomIndex = Math.floor(Math.random() * movies.length);
            selectedMovie = movies[randomIndex]; 
        }
    }
</script>

{#if error}
    <p class="text-red-500">Erreur: {error}</p>
{:else}
    <div class="flex flex-col items-center gap-4 p-5">
        <button class="hover:brightness-110 hover:animate-pulse font-bold py-3 px-6 rounded-full bg-gradient-to-r from-purple-800 to-blue-300 text-white" on:click={selectRandomMovie}>
            Choisir un film aléatoire
        </button>
        
        {#if selectedMovie}
            <div class="text-center text-white">
                <h2 class="text-xl font-bold">{selectedMovie.Name}</h2>

					<p class="mt-2"> {selectedMovie.ProductionYear} - {Math.floor(selectedMovie.RunTimeTicks / 600000000 / 60)} h {Math.floor((selectedMovie.RunTimeTicks / 600000000) % 60)} min</p>

                <div class="flex justify-center items-center w-full overflow-hidden">
                    <img 
                        src={`${apiUrl}/Items/${selectedMovie.Id}/Images/Primary?api_key=${apiKey}`} 
                        alt={selectedMovie.Name} 
                        class="w-[400px] h-[600px] mt-2 rounded-lg transition" 
                    />
                </div>
                
            </div>
        {/if}
    </div>
{/if}

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
    const LibraryId = import.meta.env.VITE_JELLYFIN_LIBRARY_ID;


//---------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                 SELECT MOVIES                                                                    |
//---------------------------------------------------------------------------------------------------------------------------------------------------
    onMount(async () => {
        if (LibraryId === "none") {
            const response = await fetch(`${apiUrl}/Items?api_key=${apiKey}&IncludeItemTypes=Movie&Recursive=true`);
            if (!response.ok) {
                throw new Error(`Error : ${response.statusText}`);
            }
            const data = await response.json();
            movies = data.Items; 
        } else {
            const response = await fetch(`${apiUrl}/Items?api_key=${apiKey}&ParentId=${LibraryId}&IncludeItemTypes=Movie&Recursive=true`);
            if (!response.ok) {
                throw new Error(`Error : ${response.statusText}`);
            }
            const data = await response.json();
            movies = data.Items; 
        }
    });


//---------------------------------------------------------------------------------------------------------------------------------------------------
//                                                       RANDOM MOVIE SELECTION                                                                     |
//---------------------------------------------------------------------------------------------------------------------------------------------------
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
        <button  class="cursor-pointer bg-gradient-to-r from-blue-500 to-violet-500 rounded-full text-white font-semibold transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-500 hover:to-violet-500 hover:ring-0 hover:ring-violet-800 hover:shadow-xl hover:shadow-violet-500 focus:ring-violet-300 focus:shadow-violet-400 px-5 py-2" on:click={selectRandomMovie}>
            find a random movie
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



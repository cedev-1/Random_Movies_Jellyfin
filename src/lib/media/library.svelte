<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    let movies = [];
    let error = null;
    let search = '';
    let displayType = '3'; 
    let timeout;
    const dispatch = createEventDispatcher();

    // .env
    const apiUrl = import.meta.env.VITE_JELLYFIN_API_URL;
    const apiKey = import.meta.env.VITE_JELLYFIN_API_KEY;
    const LibraryId = import.meta.env.VITE_JELLYFIN_LIBRARY_ID;
    const LibraryName = import.meta.env.VITE_JELLYFIN_LIBRARY_NAME;

    
//---------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                 SELECT MOVIES                                                                    |
//---------------------------------------------------------------------------------------------------------------------------------------------------
onMount(async () => {
        if (LibraryName == "none" && LibraryId !== "none") {
            const response = await fetch(`${apiUrl}/Items?api_key=${apiKey}&ParentId=${LibraryId}&IncludeItemTypes=Movie&Recursive=true`);
            if (!response.ok) {
                throw new Error(`Error : ${response.statusText}`);
            }
            const data = await response.json();
            movies = data.Items; 

        } else if (LibraryName !== "none" && LibraryId === "none") {
            const response = await fetch(`${apiUrl}/Items?api_key=${apiKey}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
    
            const library = data.Items.find(item => item.Name === LibraryName);
    
            if (library) {
                const LibraryId = library.Id;
                const movieResponse = await fetch(`${apiUrl}/Items?api_key=${apiKey}&ParentId=${LibraryId}&IncludeItemTypes=Movie&Recursive=true`);
                if (!movieResponse.ok) {
                    throw new Error(`Error: ${movieResponse.statusText}`);
                }
                const movieData = await movieResponse.json();
                movies = movieData.Items;
            } else {
                throw new Error(`Library with name ${LibraryName} not found`);
            }

        } else if (LibraryId === "none" && LibraryName === "none") {
            const response = await fetch(`${apiUrl}/Items?api_key=${apiKey}&IncludeItemTypes=Movie&Recursive=true`);
            if (!response.ok) {
                throw new Error(`Error : ${response.statusText}`);
            }
            const data = await response.json();
            movies = data.Items; 
        }
    });


//---------------------------------------------------------------------------------------------------------------------------------------------------
//                                                           SEARCH MOVIES                                                                          |
//---------------------------------------------------------------------------------------------------------------------------------------------------
    function searchMovies() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            dispatch('search', search);
        }, 300); 
    }


//---------------------------------------------------------------------------------------------------------------------------------------------------
//                                                       DISPLAY TYPE SELECTION                                                                     |
//---------------------------------------------------------------------------------------------------------------------------------------------------
    function changeDisplayType(newDisplayType) {
        displayType = newDisplayType;
    }
</script>


{#if error}
    <p>Erreur: {error}</p>
{:else}
    <div class="movies-grid">
        
        <div class="search-bar">
            <input type="text" bind:value={search} on:input={searchMovies} placeholder="Find Movie" style="color: #333; font-size: calc(1rem + 0.5vw);">
        </div>
        
        <div class="display-type-selector">
            <button on:click={() => changeDisplayType('2')} style="margin-right: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M15 6H1v1h14zm0 3H1v1h14z" clip-rule="evenodd"/></svg>
            </button>
            <button on:click={() => changeDisplayType('3')} style="margin-right: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 16 16"><path fill="currentColor" d="M16 5H0V4h16zm0 8H0v-1h16zm0-4.008H0V8h16z"/></svg>
            </button>
        </div>
        
        <div class="movies-list" style="display: grid; grid-template-columns: repeat({displayType}, 1fr); gap: 1rem;">
            {#each movies as movie (movie.Id)}
                {#if movie.Name.toLowerCase().includes(search.toLowerCase())}
                    <div class="movie-item bg-transparent text-white rounded-lg shadow-md overflow-hidden p-4" style="flex: 1 1 calc({100 / displayType}% - 1rem); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 0.5rem; overflow: hidden; background-color: transparent; color: white; padding: 1rem; transition: transform 0.2s; border: 1px solid #898989; width: 100%; height: auto; {displayType === '1' ? 'max-width: 50%;' : ''}">
                        <img src={`${apiUrl}/Items/${movie.Id}/Images/Primary?api_key=${apiKey}`} alt="{movie.Name}" class="w-full h-auto object-cover aspect-video" style="width: 200px; height: 300px;"/>
                        {#if window.innerWidth > 640}
                            <h2 class="text-xl font-semibold mt-2 text-center" style="font-size: calc(1rem + 0.2vw);">{movie.Name}</h2>
                            <div class="flex justify-between items-center">
                                <div class="flex flex-col">
                                    <hr class="my-2 border-t border-white w-full" />
                                    <p class="text-gray-300" style="font-size: calc(1rem + 0.2vw); text-align: center;">{movie.ProductionYear}</p>
                                </div>
                                <div class="flex flex-col">
                                    <hr class="my-2 border-t border-white w-full" />
                                    <p class="text-gray-300" style="font-size: calc(1rem + 0.2vw); text-align: center;">{Math.floor(movie.RunTimeTicks / 600000000 / 60)} h {Math.floor((movie.RunTimeTicks / 600000000) % 60)} </p>
                                </div>
                            </div>
                            {#if movie.Overview}
                                <p class="text-gray-300 mt-2" style="font-size: calc(1rem + 0.2vw);">{movie.Overview}</p>
                            {/if}
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
{/if}

<style>
    .movies-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .search-bar {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }
    .display-type-selector {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }
    .movies-list {
        display: grid;
        gap: 1rem;
    }
    .movie-item {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 0.5rem;
        overflow: hidden;
        background-color: transparent; 
        color: white; 
        padding: 1rem;
        transition: transform 0.2s;
        border: 1px solid #898989; 
    }
    .movie-item:hover {
        transform: scale(1.05);
    }
    img {
        border-radius: 0.5rem;
        width: 200px;
        height: 300px;
    }

    @media (max-width: 1024px) {
        .movies-list {
            grid-template-columns: repeat(2, 1fr);
        }
        .movie-item h2 {
            font-size: calc(0.9rem + 0.2vw); 
        }
        .movie-item p {
            font-size: calc(0.7rem + 0.2vw);
        }
    }

    @media (max-width: 640px) {
        .movies-list {
            grid-template-columns: 1fr;
        }
        .movie-item h2 {
            display: none;
        }
        .movie-item .flex, .movie-item .flex-col, .movie-item p {
            display: none;
        }
        .movie-item img {
            width: 200px;
            height: 300px;
            object-cover: cover;
        }
        .movie-item {
            padding: 0;
        }
    }
</style>

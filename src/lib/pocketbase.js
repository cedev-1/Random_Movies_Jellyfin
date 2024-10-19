import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.ce-dev.eu');

// ---------------------------------------------------------------------------------------------------------------------
//                                         LOGIN                                                                       |
// ---------------------------------------------------------------------------------------------------------------------
async function login() {
    try {
        // Authenticate with PocketBase as admin and store the authentication data
        const authData = await pb.admins.authWithPassword('cedevserver@gmail.com', 'Kk6qbLyRc4Dy9dgck');

        // Log authentication details for debugging
        console.log('Admin login successful:', authData);

    } catch (error) {
        console.error('Failed to login:', error);
        throw error;
    }
}

// ---------------------------------------------------------------------------------------------------------------------
//                                         DATABASE                                                                    |
// ---------------------------------------------------------------------------------------------------------------------
async function db_users() {
    await login(); // Ensure the admin is logged in before proceeding

    try {
        // Use the stored auth token for subsequent requests
        const response = await fetch('https://pocketbase.ce-dev.eu/api/collections/Jellyfin/records?expand=items', {
            headers: {
                'Authorization': `Bearer ${pb.authStore.token}` // Correctly using the stored token
            }
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const data = await response.json();
        const transformedData = data.items.map(item => ({
            username: item.username,
            password: item.password
        }));

        console.log('Fetched users:', transformedData);

        for (const { username, password } of transformedData) {
            try {
                await createJellyfinUser(username, `${username}@example.com`, password);
                console.log(`Jellyfin user created for ${username}`);
            } catch (error) {
                console.error(`Failed to create Jellyfin user for ${username}: ${error}`);
            }
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// ---------------------------------------------------------------------------------------------------------------------
//                                         JELLYFIN                                                                    |
// ---------------------------------------------------------------------------------------------------------------------
async function createJellyfinUser(username, password) {
    try {
        const response = await fetch('https://movies.ce-dev.eu/Users/New', {
            method: 'POST',
            headers: {
                'X-Emby-Token': 'b10a9fd92bfa4f5bbc0fb6b6219a03bd',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'Name': username,
                'Password': password,
                'EnableLocalPassword': true,
                'IsAdministrator': false
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create Jellyfin user: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Jellyfin user created: ${data}`);
        return data;

    } catch (error) {
        console.error('Error creating Jellyfin user:', error);
        throw error;
    }
}

// ---------------------------------------------------------------------------------------------------------------------
//                                         EXPORTS                                                                     |
// ---------------------------------------------------------------------------------------------------------------------
export default pb;
export { login, db_users, createJellyfinUser };

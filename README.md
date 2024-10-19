# Random Movie Finder

This is a simple web application to find and display a random movie from your Jellyfin server. The app is Dockerized for easy deployment and allows users to quickly discover random movies from their Jellyfin collection.

![Example Screenshot](/EXEMPLE/RANDOM.PNG)

Setup and Installation
1. Prerequisites

Ensure you have the following installed:

    Docker
    Docker Compose
    Jellyfin server with API access

2. Clone the Repository

```bash
git clone https://github.com/cedev-1/Random_Movies_Jellyfin.git
cd Random_Movies_Jellyfin
```

3. Modify the .env File

```makefile
VITE_JELLYFIN_API_URL=http://your-jellyfin-url
VITE_JELLYFIN_API_KEY=your-api-key
```

    VITE_JELLYFIN_API_URL: The base URL of your Jellyfin server (e.g., http://localhost:8096).
    VITE_JELLYFIN_API_KEY: Your Jellyfin API key for authentication.

4. Build and Run the App Using Docker

Run the following command to build the Docker image and start the application:

```bash
docker-compose up --build
docker-compose up
```

The app will be accessible at http://localhost:4173.

5. Stop the Docker Containers

To stop the app, run:

```bash
docker-compose down
```

/media
![Example find](/EXEMPLE/ALL.PNG)
![Example find](/EXEMPLE/2ALL.PNG)
![En attendant](/EXEMPLE/EN_ATTENDANT.PNG)


Running the App Locally (without Docker)


If you'd prefer to run the app locally:
1. Install Dependencies

```bash
npm install
```

```bash
npm run dev
```
OR to build the project for production, run:

```bash
npm run build
npm run preview
```


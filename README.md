Random Movie Finder - Svelte + Jellyfin (with Docker)

This is a simple web application built with Svelte to find and display a random movie from your Jellyfin server. The app is Dockerized for easy deployment and allows users to quickly discover random movies from their Jellyfin collection.
Features

    Fetch a random movie from Jellyfin API
    Display basic movie information (title, year, runtime, overview)
    Minimalist UI for quick movie discovery
    Responsive design for both mobile and desktop

Technologies Used

    Svelte for the frontend framework
    Jellyfin for movie data and API
    Docker and Docker Compose for containerization

Setup and Installation
1. Prerequisites

Ensure you have the following installed:

    Docker
    Docker Compose
    Jellyfin server with API access

2. Clone the Repository

```bash
git clone https://github.com/yourusername/random-movie-finder.git
cd random-movie-finder
```

3. Create an Environment File

Create a .env file in the root directory with the following content:

```makefile
VITE_JELLYFIN_API_URL=http://your-jellyfin-url
VITE_JELLYFIN_API_KEY=your-api-key
```

    VITE_JELLYFIN_API_URL: The base URL of your Jellyfin server (e.g., http://localhost:8096).
    VITE_JELLYFIN_API_KEY: Your Jellyfin API key for authentication.

4. Docker Configuration
Dockerfile

The Dockerfile sets up a Node.js environment, installs dependencies, and builds the Svelte app:

```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]
```

Docker Compose

The docker-compose.yml defines the service and binds the necessary environment variables from the .env file:

```yaml
version: '3'
services:
  svelte-app:
    build: .
    ports:
      - "4173:4173"
    env_file:
      - .env
```

5. Build and Run the App Using Docker

Run the following command to build the Docker image and start the application:

```bash
docker-compose up --build
```

The app will be accessible at http://localhost:4173.
6. Stop the Docker Containers

To stop the app, run:

```bash
docker-compose down
```

Running the App Locally (without Docker)

If you'd prefer to run the app locally:
1. Install Dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

2. Run the Development Server

Start the development server using the following command:

```bash
npm run dev
```

The app should now be running at http://localhost:5173.
3. Build for Production

To build the project for production, run:

```bash
npm run build
```

This will generate a dist folder containing the production-ready files.
Usage

Once the app is running, simply click the Find Random Movie button to get a random movie from your Jellyfin library. The app will display the movie title, release year, runtime, and a brief description.
Project Structure

```bash
├── public            # Public assets
├── src
│   ├── App.svelte    # Main Svelte component
│   ├── components    # Reusable components
│   └── styles        # Global and component styles
├── Dockerfile        # Dockerfile for containerization
├── docker-compose.yml# Docker Compose configuration
├── .env              # Environment variables (API URL and key)
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation
```

Customization

    API URL and Key: Update the Jellyfin API URL and key in the .env file to point to your own Jellyfin server.
    UI Adjustments: Modify the styles in the <style> tags of each component or create new styles in the src/styles directory.

Future Improvements

    Add filters for genre, year, or rating
    Add the ability to play trailers or link directly to the movie on the Jellyfin server
    Add user authentication

License

This project is licensed under the MIT License. See the LICENSE file for details.

This README provides clear instructions for setting up and running the project using Docker and includes information on customizing and improving the app.

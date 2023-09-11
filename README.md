# Quora Clone

Quora Clone is a question/answer platform that mimics the features and functionalities of the popular Quora platform. It allows users to ask questions, answer questions, like/dislike answers, and follow topics. This project is built using React for the frontend and Node.js with Sequelize and PostgreSQL for the backend.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your development machine.
- PostgreSQL installed and running.
- Clone this repository to your local machine.

### Installation

1. **Server Setup**

   - Navigate to the `Server` directory:

     ```bash
     cd Server
     ```

   - Install server dependencies:

     ```bash
     npm install
     ```

   - Set up your environment variables by creating a `.env` file based on `.env.example`.

   - Run the server:

     ```bash
     npm start
     ```

   The server will start on port 8000 by default.

2. **Client Setup**

   - Navigate to the `Client` directory:

     ```bash
     cd Client
     ```

   - Install client dependencies:

     ```bash
     npm install
     ```

   - Set up your environment variables by creating a `.env` file based on `.env.example`.

   - Run the client:

     ```bash
     npm start
     ```

   The client will start on port 3000 by default.

## Project Structure

The project is structured as follows:

- `Client/`: Contains the React frontend.
- `Server/`: Contains the Node.js backend.
- `.env.example`: Example environment variables file for both client and server.

## Usage

- Open your web browser and visit `http://localhost:3000` to access the Quora Clone frontend.
- The backend API is accessible at `http://localhost:8000`.

## Features

- **Authentication**: Users can sign up, log in, and edit their profile information.
- **Home Page**: Users can view questions related to topics they are following, search for topics, answer questions, and like/dislike questions and answers.
- **Add Topics**: Users can add topics, add questions to topics, and follow topics.
- **Topic Page**: Users can view questions related to a specific topic, sorted by likes/dislikes, and navigate between pages.
- **About Page**: Users can view their profile information, followed topics, asked questions, and answers.
- **Profile Page**: Users can view other users' profiles and their activity.

## License

This project is licensed under the [MIT License](LICENSE).

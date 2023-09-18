# Quora Clone - Backend

This is the backend of the Quora Clone project. It is built using Node.js with Sequelize and PostgreSQL.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Features](#features)
- [Development Environment](#development-environment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your development machine.
- PostgreSQL installed and running.

### Installation

1. **Setup**

   - Install dependencies:

     ```bash
     npm install
     ```

   - Set up environment variables by creating a `.env` file based on `.env.example`.

   - Start the server:

     ```bash
     npm start
     ```

   The server will start on port 8000 by default.

## Project Structure

The project structure for the backend:

- `Server/`: Contains the Node.js backend.
- `.env.example`: Example environment variables file for the server.

## Usage

- The backend API is accessible at `http://localhost:8000`.

## Features

- **Authentication**: Users can sign up, log in, and edit their profile information.
- **Home Page**: Users can view questions related to topics they are following, search for topics, answer questions, and like/dislike questions and answers.
- **Add Topics**: Users can add topics, add questions to topics, and follow topics.
- **Topic Page**: Users can view questions related to a specific topic, sorted by likes/dislikes, and navigate between pages.
- **About Page**: Users can view their profile information, followed topics, asked questions, and answers.
- **Profile Page**: Users can view other users' profiles and their activity.

## Development Environment

| Tool       | Version |
| ---------- | ------- |
| Node.js    | 14.17.1 |
| npm        | 6.14.13 |
| PostgreSQL | 15.5    |
| ...        | ...     |

## License

This project is licensed under the [MIT License](LICENSE).

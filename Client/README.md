# Quora Clone - Frontend

This is the frontend of the Quora Clone project. It is built using React for the user interface.

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

### Installation

1. **Setup**

   - Install dependencies:

     ```bash
     npm install
     ```

   - Set up environment variables by creating a `.env` file based on `.env.example`.

   - Start the client:

     ```bash
     npm start
     ```

   The client will start on port 3000 by default.

## Project Structure

The project structure for the frontend:

- `Client/`: Contains the React frontend.
- `.env.example`: Example environment variables file for the client.

## Usage

- Open your web browser and visit `http://localhost:3000` to access the Quora Clone frontend.

## Features

- **Authentication**: Users can sign up, log in, and edit their profile information.
- **Home Page**: Users can view questions related to topics they are following, search for topics, answer questions, and like/dislike questions and answers.
- **Add Topics**: Users can add topics, add questions to topics, and follow topics.
- **Topic Page**: Users can view questions related to a specific topic, sorted by likes/dislikes, and navigate between pages.
- **About Page**: Users can view their profile information, followed topics, asked questions, and answers.
- **Profile Page**: Users can view other users' profiles and their activity.

## Development Environment

| Tool    | Version |
| ------- | ------- |
| Node.js | 14.17.1 |
| npm     | 6.14.13 |

## License

This project is licensed under the [MIT License](LICENSE).

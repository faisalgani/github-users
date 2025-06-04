# GitHub User Search App

A simple React + Vite application to search GitHub users and display their public repositories. Built using Material UI (MUI), Zustand for state management, GitHub API and Vitest

## 🔧 Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Material UI (MUI)](https://mui.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios](https://axios-http.com/)
- [GitHub REST API v3](https://docs.github.com/en/rest)
- [Unit Test](https://vitest.dev/)

## ✨ Features

- Search GitHub users by username
- Display a list of users with their login
- Expand each user to show their public repositories
- Show repository name, description, and star count
- Error handling for invalid input or no results

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/github-user-search.git

# Navigate to the project directory
cd github-user-search

# Install dependencies
node version 21.6.2
npm install

# Run
npm run dev

# Unit tests
npx vitest run
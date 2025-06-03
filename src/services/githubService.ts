import axios from 'axios';
const BASE_URL = import.meta.env.VITE_GITHUB_API_URL

export const searchUsers = async (username: string, perPage : number, since : number) => {
  const response = await axios.get(`${BASE_URL}/search/users`, {
    params: {
      q: username,
      since,
      per_page: perPage,
    },
  });
  return response;
};

export const getUserRepos = async (username: string) => {
  const response = await axios.get(`${BASE_URL}/users/${username}/repos`);
  return response;
};
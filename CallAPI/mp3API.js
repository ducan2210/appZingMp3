import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const loadDataHome = async (page) => {
  try {
    const response = await axios.get(`${API_URL}/home`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const loadDataPlayList = async (idPlayList) => {
  try {
    const response = await axios.get(`${API_URL}/playlist/${idPlayList}`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const loadTop100 = async () => {
  try {
    const response = await axios.get(`${API_URL}/top100`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const loadZingChart = async () => {
  try {
    const response = await axios.get(`${API_URL}/chartHome`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const loadWeekChartByCountry = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/weekChart/${id}`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const loadDataMusic = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/songInfo/${id}`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const loadMusicRecommend = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/recommend/song/${id}`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const loadSoundNor = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/song/${id}`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
export const loadSoundPremium = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/songPremium/${id}`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
export const loadLyric = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/lyric/${id}`);
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

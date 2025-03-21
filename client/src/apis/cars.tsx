import axios from 'axios';

const API_URL = 'http://localhost:3000/car';

export const getCars = async (params : any) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const getCarById = async (id : any) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createCar = async (carData : any) => {
  const response = await axios.post(API_URL, carData);
  return response.data;
};

export const updateCar = async (id : any, carData : any) => {
  const response = await axios.put(`${API_URL}/${id}`, carData);
  return response.data;
};

export const deleteCar = async (id : any) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
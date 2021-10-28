/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import {API_BASE_URL} from '@env';

const basepath = API_BASE_URL;

export const axiosPost = (url, data) => {
  console.log('axiosCalls', `${basepath}${url}`, data);
  return axios
    .post(`${basepath}${url}`, data)
    .then(res => res)
    .catch(err => err);
};

export const axiosGet = url =>
  axios
    .get(`${basepath}${url}`)
    .then(res => res)
    .catch(err => err);

import {axiosGet, axiosPost} from './axiosCalls';

export const postUserSignup = data =>
  axiosPost('user/signup', data).then(res => res.data);
export const postUserSignin = data =>
  axiosPost('user/signin', data).then(res => res.data);

export const getHotels = () => axiosGet('hotels').then(res => res.data);

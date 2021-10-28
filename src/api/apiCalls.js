import {axiosGet, axiosPost} from './axiosCalls';

export const getQuarterlyTaxReport = data => {
  const url = `tax_engine/website/calculate_tax/`;
  return axiosPost(url, data);
};

export const postUserSignup = data =>
  axiosPost('user/signup', data).then(res => res.data);
export const postUserSignin = data =>
  axiosPost('user/signin', data).then(res => res.data);

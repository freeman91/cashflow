import http from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const web = http.create({
  baseURL: `${API_URL}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default web;

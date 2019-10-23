import axios from 'axios'

/* Default API */
export const axiosObj =  axios.create({
  baseURL: 'http://api.curator.codifyr.ca',
  headers: {
    'Authorization': 'token here'
  },
  timeout: 4000
})

export const post = (url, data) => {
    return axiosObj.post(url, data);
}

export const get = url => {
    return axiosObj.get(url);
}

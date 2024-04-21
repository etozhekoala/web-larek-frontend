import './scss/styles.scss';
import { API_URL } from './utils/constants';





fetch(`${API_URL}/product`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  });



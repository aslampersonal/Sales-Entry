import { createStore } from 'redux';
import salesReducer from './reducers';

const initialState = {
  salesData: {
    header: {
      vr_no: 0,
      vr_date: '',
      ac_name: '',
      ac_amt: 0,
      status: '',
    },
    detail: [],
  },
};

const store = createStore(salesReducer, initialState);

export default store;
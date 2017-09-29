import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState: ServiceStore = {
  didInvalidate: false,
  data: [
    {
      id: 1,
      name: 'Какая нибудь услуга 1',
      price: 150
    },
    {
      id: 2,
      name: 'Какая нибудь услуга 2',
      price: 100
    },
    {
      id: 16,
      name: 'Какая нибудь услуга 16',
      price: 1400
    }
  ],
};

export default handleActions<ServiceStore, ServiceData[]>({
  [Actions.REQUEST_SERVICES]: (state, action) => {
    return {...state, didInvalidate: true};
  },

  [Actions.RECEIVE_SERVICES]: (state, action) => {
    return {...state, didInvalidate: false, data: action.payload};
  },

  [Actions.FAILURE_FETCH_SERVICES]: (state, action) => {
    return {...state, didInvalidate: true};
  },

  [Actions.INVALIDATE_SERVICES]: (state, action) => {
    return {...state, didInvalidate: true};
  }
}, initialState);

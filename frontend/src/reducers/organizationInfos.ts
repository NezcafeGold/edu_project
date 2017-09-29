import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState: OrganizationInfoStore = {
  didInvalidate: false,
  data: [
    {
      id: 1,
      name: 'Общество с ограниченной ответственностью "Надежда"',
      address: '113403, г. Москва, Востряковский проезд, 15-3-12',
      INN: '7733830164',
      ORGN: '1137746070615'
    }
  ],
};

export default handleActions<OrganizationInfoStore, OrganizationInfoData[]>({
  [Actions.REQUEST_ORGANIZATION_INFOS]: (state, action) => {
    return {...state, didInvalidate: true};
  },

  [Actions.RECEIVE_ORGANIZATION_INFOS]: (state, action) => {
    return {...state, didInvalidate: false, data: action.payload};
  },

  [Actions.FAILURE_FETCH_ORGANIZATION_INFOS]: (state, action) => {
    return {...state, didInvalidate: true};
  },

  [Actions.INVALIDATE_ORGANIZATION_INFOS]: (state, action) => {
    return {...state, didInvalidate: true};
  }
}, initialState);

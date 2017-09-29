import { createAction } from 'redux-actions';
import * as Actions from '../constants/actions';
import axios from 'axios';
import { urlRoot } from '../constants';

export const invalidateServices = createAction(Actions.INVALIDATE_SERVICES);
export const requestServices = createAction(Actions.REQUEST_SERVICES);
export const receiveServices = createAction<ServiceData[]>(Actions.RECEIVE_SERVICES);
export const failureFetchServices = createAction(Actions.FAILURE_FETCH_SERVICES);

export const getServices = (dispatch) => dispatch(
  dispatch => {
    dispatch(requestServices());
    let services = axios.get(urlRoot+'/services/list');

    services.then(response => response.data)
            .then(json => dispatch(receiveServices(json)));
    services.catch(err => dispatch(failureFetchServices()));
  }
)
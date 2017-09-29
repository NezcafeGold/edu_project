import { createAction } from 'redux-actions';
import * as Actions from '../constants/actions';
import axios from 'axios';
import { urlRoot } from '../constants';

export const invalidateOrganizationInfos = createAction(Actions.INVALIDATE_ORGANIZATION_INFOS);
export const requestOrganizationInfos = createAction(Actions.REQUEST_ORGANIZATION_INFOS);
export const receiveOrganizationInfos = createAction<OrganizationInfoData[]>(Actions.RECEIVE_ORGANIZATION_INFOS);
export const failureFetchOrganizationInfos = createAction(Actions.FAILURE_FETCH_ORGANIZATION_INFOS);

export const getOrganizationInfos = (dispatch) => dispatch(
  dispatch => {
    dispatch(requestOrganizationInfos());
    let organizationInfos = axios.get(urlRoot+'/org/list');

    organizationInfos.then(response => response.data)
                .then(json => dispatch(receiveOrganizationInfos(json)));
    organizationInfos.catch(err => dispatch(failureFetchOrganizationInfos()));
  }
)
import { createAction } from 'redux-actions';
import * as Actions from '../constants/actions';
import axios from 'axios';
import { urlRoot } from '../constants';

export const invalidatePaymentReceipts = createAction(Actions.INVALIDATE_PAYMENT_RECEIPTS);
export const requestPaymentReceipts = createAction(Actions.REQUEST_PAYMENT_RECEIPTS);
export const receivePaymentReceipts = createAction<PaymentReceiptFormData[]>(Actions.RECEIVE_PAYMENT_RECEIPTS);
export const failureFetchPaymentReceipt = createAction(Actions.FAILURE_FETCH_PAYMENT_RECEIPTS);
export const postPaymentReceipt = createAction<PaymentReceiptFormData>(Actions.POST_PAYMENT_RECEIPT);

export const getPaymentReceipts = (dispatch) => dispatch(
  dispatch => {
    dispatch(requestPaymentReceipts());
    let paymentReceipts = axios.get(urlRoot + '/receipt/list');

    paymentReceipts.then(response => response.data)
                   .then(json => dispatch(receivePaymentReceipts(json)));
    paymentReceipts.catch(err => dispatch(failureFetchPaymentReceipt()));
  }
)
export const submitPaymentReceipt = (dispatch, formData) => dispatch(
  dispatch => {
    axios.post(urlRoot + '/receipt/add', formData)
         .then(responce => {
           dispatch(postPaymentReceipt);
           getPaymentReceipts(dispatch);
         })
         .catch(error=>console.log('Failed sending the data from payment receipt form', error));
  }
)

export const addPaymentReceipt = createAction<PaymentReceiptFormData>(Actions.ADD_PAYMENT_RECEIPT);
export const editPaymentReceipt = createAction<PaymentReceiptFormData>(Actions.EDIT_PAYMENT_RECEIPT);
export const deletePaymentReceipt = createAction<PaymentReceiptItemId>(Actions.DELETE_PAYMENT_RECEIPT);

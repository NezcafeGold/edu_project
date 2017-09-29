import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState: PaymentReceiptFormStore = {
  didInvalidate: true,
  data: [
    {
      id: 1,
      organization: { id: 1 },
      receiptNumber: 1,
      series: 'АА',
      fname: 'Иван',
      lname: 'Иванов',
      patronymic: 'Иванович',
      phone: '89458234956',
      priceList: [
        {
          service: {
            id: 1,
            name: 'Какая нибудь услуга 1'
          },
          price: 150
        }
      ],
      date: ''
    }
  ]
};

export default handleActions<PaymentReceiptFormStore, any | PaymentReceiptFormData | PaymentReceiptFormData[]>({
  [Actions.REQUEST_PAYMENT_RECEIPTS]: (state, action) => {
    return {...state, didInvalidate: true};
  },

  [Actions.RECEIVE_PAYMENT_RECEIPTS]: (state, action) => {
    return {...state, didInvalidate: false, data: action.payload };
  },

  [Actions.FAILURE_FETCH_PAYMENT_RECEIPTS]: (state, action) => {
    return {...state, didInvalidate: true};
  },

  [Actions.INVALIDATE_PAYMENT_RECEIPTS]: (state, action) => {
    return {...state, didInvalidate: true};
  },

  [Actions.POST_PAYMENT_RECEIPT]: (state, action) => {
    return {...state, didInvalidate: true};
  },
  
  [Actions.ADD_PAYMENT_RECEIPT]: (state, action) => {
    let newData = [{
      ...action.payload,
      id: state.data.reduce((maxId, receipt) => Math.max(receipt.id, maxId), -1) + 1
    }, ...state.data];

    return {...state, data: newData};
  },

  [Actions.DELETE_PAYMENT_RECEIPT]: (state, action) => {
    let newData = state.data.filter(receipt => receipt.id !== action.payload);
    
    return {...state, data: newData};
  },

  [Actions.EDIT_PAYMENT_RECEIPT]: (state, action) => {
    let newData = state.data.map(receipt => {
      return receipt.id === action.payload.id
        ? { ...receipt, ...action.payload }
        : receipt;
    });
    
    return {...state, data: newData};
  }
}, initialState);

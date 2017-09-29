import { combineReducers, Reducer } from 'redux';
import paymentReceiptFormStore from './paymentReceiptForm';
import organizationInfoStore from './organizationInfos';
import serviceStore from './services';
import { routerReducer } from 'react-router-redux';


export interface RootState {
  paymentReceiptFormStore: PaymentReceiptFormStore;
  organizationInfoStore: OrganizationInfoStore;
  serviceStore: ServiceStore;
  routerReducer;
}

export default combineReducers<RootState>({
  paymentReceiptFormStore,
  organizationInfoStore,
  serviceStore,
  routing: routerReducer,
});

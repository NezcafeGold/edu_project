import { createStore, applyMiddleware, Store } from 'redux';
import { logger } from '../middleware';
import thunk from 'redux-thunk';
import rootReducer, { RootState } from '../reducers';
import * as PaymentReceiptActions from '../actions/paymentReceipts';
import * as OrganizationInfoActions from '../actions/organizationInfos';
import * as ServiceActions from '../actions/services';
import * as Actions from '../constants/actions'
import axios from 'axios'

export function configureStore(initialState?: RootState): Store<RootState> {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  const createStoreWithMiddleware = applyMiddleware(logger, thunk)(create);

  const store = createStoreWithMiddleware(rootReducer, initialState) as Store<RootState>;

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

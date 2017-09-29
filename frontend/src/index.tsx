import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch, Link, IndexRoute, browserHistory } from 'react-router-dom';
import { Button, ButtonGroup, Label } from 'react-bootstrap'
import { configureStore } from './store';
import { PaymentReceiptForm, PaymentReceiptView } from './components';
import { ReceiptListFromServer } from './containers/ReceiptListFromServer';
import { EFormMode } from './constants';
import * as PaymentReceiptActions from './actions/paymentReceipts';
import * as OrganizationInfoActions from './actions/organizationInfos';
import * as ServiceActions from './actions/services';

const store = configureStore();
store.dispatch(OrganizationInfoActions.getOrganizationInfos);
store.dispatch(ServiceActions.getServices);
store.dispatch(PaymentReceiptActions.getPaymentReceipts);

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
);

const Header = () => (
  <div className='container'>
     <h1><Label>Меню</Label></h1>
      <ButtonGroup vertical block>
        <Link to='/create'> <Button >Создание квитанции </Button></Link>
        <Link to='/list'><Button>Просмотр списка</Button></Link>
      </ButtonGroup>
      <br/><br/>
  </div>
);

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={ReceiptListFromServer} />
        <Route path="/list" component={ReceiptListFromServer} />
        <Route path="/create" component={PaymentReceiptCreatePage} />
        <Route path="/details/:id" component={PaymentReceiptView} />
    </Switch>
  </main>
);

const PaymentReceiptCreatePage = () => <PaymentReceiptForm mode={EFormMode.CREATE} />;

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter history={history}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
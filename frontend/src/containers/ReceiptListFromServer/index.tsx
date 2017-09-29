import * as React from 'react';
import * as style from './style.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, Link } from 'react-router-dom';
import { RootState } from '../../reducers';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FadeLoader } from 'react-spinners';
import { EFormMode } from '../../constants';
import { BrowserRouter, Route} from 'react-router-dom';
import { PaymentReceiptForm, PaymentReceiptView } from '../../components';

export namespace ReceiptListFromServer {
  export interface Props extends RouteComponentProps<void> {
    receipts: PaymentReceiptFormData[];
    didPaymentReceiptsInvalidate?
    organizationInfos: OrganizationInfoData[]
  }

  export interface State {
    showModal: 'edit' | 'details' | 'hidden';
    receiptId: number;
  }
}

@connect(mapStateToProps)
export class ReceiptListFromServer extends React.Component<ReceiptListFromServer.Props, ReceiptListFromServer.State> {

  constructor() {
    super();
    this.state = {
      showModal: 'hidden',
      receiptId: 0
    }
  }

sort(){
  console.log('SORT!')
  const receiptSort= this.props.receipts.sort(function(a,b){ return b.id - a.id});
  return receiptSort;
}

  renderRows = () => {
    const rows = this.sort().map((receipt, index) =>{
      //Получение обьекта с описанием компании для вывода в форме, поиск по id
      let ourOrganizationInfo = this.props.organizationInfos.find((organization) => organization.id == receipt.organization.id );
 
      return (
        <tr key={index}>
          <td>{receipt.id}</td>
          <td>{ourOrganizationInfo.name}</td>
          <td>{receipt.receiptNumber}</td>
          <td>{receipt.series}</td>
          <td>{receipt.fname}</td>
          <td>{receipt.lname}</td>
          <td>{receipt.patronymic}</td>
          <td>{receipt.phone}</td>
          <td>
            {receipt.priceList.map((priceListEntry, index) =>
              <div key={index}>
                {priceListEntry.service.name}
              </div>
            )}
          </td>
          <td>
          <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip"><strong>Редактирование данных</strong></Tooltip>}>
          <Button onClick={() => this.setState({ showModal: 'edit', receiptId: receipt.id})} > 
            <img width="20" alt='Редактировать' src='../../images/edit.png' />
          </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip"><strong>Просмотр квитанции</strong></Tooltip>}>
          <Button onClick={() => this.setState({ showModal: 'details', receiptId: receipt.id})}>
            <img alt='Просмотреть квитанцию' width="20" src='../../images/detail.png' />
          </Button>
          </OverlayTrigger>
          </td>
        </tr>)
      });
    return (rows);
  }

  render() {
    
    const { receipts } = this.props
    if (this.props.didPaymentReceiptsInvalidate) 
      return <FadeLoader margin={40} color={'#123abc'} />

    let receiptInModal = receipts.find(receipt => receipt.id==this.state.receiptId)

    let renderEditModal = (
      receiptInModal ? 
      <Modal bsSize="large" show={this.state.showModal!='hidden'} onHide={() => this.setState({ showModal: 'hidden' })}>
          <Modal.Header closeButton>
            <Modal.Title>
              { 
                this.state.showModal=='edit' 
                ?
                `Редактировать квитанцию ${receiptInModal.receiptNumber}`
                :
                `Детальный просмотр квитанции ${receiptInModal.receiptNumber}`
              }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { 
              this.state.showModal=='edit' 
              ?
              <PaymentReceiptForm mode={EFormMode.EDIT} paymentReceipt={receiptInModal} />
              :
              <PaymentReceiptView paymentReceipt={receiptInModal} />
            }
          </Modal.Body>
      </Modal>
      : ''
    );

    return (
      
      <div className={style.normal}>
        <Button onClick={this.sort} > 
    <img width="20" alt='' src='../../images/sort.png' />
  </Button>
        {renderEditModal}
        <table className="table table-bordered table-striped">
          <thead className="thead-inverse">
            <tr>
              <th>#</th>
              <th style={{width: 50}}>Компания</th>
              <th>№ квитанции</th>
              <th>Серия</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Отчество</th>
              <th>Телефон</th>
              <th>Услуги</th>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    receipts: state.paymentReceiptFormStore.data,
    didPaymentReceiptsInvalidate: state.paymentReceiptFormStore.didInvalidate,
    organizationInfos: state.organizationInfoStore.data,
  };
}

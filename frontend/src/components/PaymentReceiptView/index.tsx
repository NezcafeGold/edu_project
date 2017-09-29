import * as React from 'react';
import './style.css';
import { PriceListTable, PaymentReceiptForm } from '../../components';
import { RootState } from '../../reducers';
import { connect } from 'react-redux';


export namespace PaymentReceiptView {
  export interface Props {
    serviceInfos?: ServiceData[];
    organizationInfos?: OrganizationInfoData[];
    paymentReceipt: PaymentReceiptFormData;
  }

  export interface State {
    //empty
  }
}

@connect(mapStateToProps)
export class PaymentReceiptView extends React.Component<PaymentReceiptView.Props, PaymentReceiptView.State> {

  render() {    
    const {serviceInfos, organizationInfos, paymentReceipt} = this.props;  

    //Получение обьекта с описанием компании для вывода в форме, поиск по id
    let organizationInfo = organizationInfos.find((organization) => organization.id == paymentReceipt.organization.id );

    return (
      <div className='PaymentReceiptView container' style={{width: '600px'}}>
      
      {//Вывод информации о компании в форме
        organizationInfo && (
          <p>{organizationInfo.name}<br/>
          Юр. адрес {organizationInfo.address} <br/>
          ИНН: {organizationInfo.INN}; ОРГН: {organizationInfo.ORGN}
          </p>
        )
      } 
      
      <h1 className='h2'>Квитанция на оплату услуг №: {paymentReceipt.receiptNumber}</h1>
      <p style={{marginLeft: '30px'}}>Серия: {paymentReceipt.series}</p>
      <br/>
      <p>Фамилия: {paymentReceipt.lname}<br/>
         Имя: {paymentReceipt.fname}<br />
         Отчество: {paymentReceipt.patronymic}<br />
         Телефон: {paymentReceipt.phone}</p><br />
      
      <div>Услуги:
        <PriceListTable
          priceList={paymentReceipt.priceList}
          describeList={serviceInfos} 
            />
      </div>
      <br/>
      <p>Дата оплаты: {paymentReceipt.date} </p>
            
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {    
  return {
    serviceInfos: state.serviceStore.data,
    organizationInfos: state.organizationInfoStore.data
  };
}

import * as React from 'react';
import './style.css';
import * as PaymentReceiptActions from '../../actions/paymentReceipts';
import { PriceListTable } from '../../components';
import { SelectAdder } from '../../components';
import { RootState } from '../../reducers';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { EFormMode } from '../../constants';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Form, Col, Button } from 'react-bootstrap';

export namespace PaymentReceiptForm {
  export interface Props {
    serviceInfos?: ServiceData[];
    organizationInfos?: OrganizationInfoData[];
    paymentReceipt?: PaymentReceiptFormData;
    mode: EFormMode;
    submitPaymentReceipt?;
  }

  export interface State {
    isSubmitted: boolean;
    form;
  }
}

//Начальное состояние формы
const initialForm: PaymentReceiptFormData = {
  id: 0,
  organization: { id: -1 },
  receiptNumber: -1,
  series: '',
  fname: '',
  lname: '',
  patronymic: '',
  phone: '',
  priceList: [
    // {
    //   service: {
    //     id: -1,
    //     name: ''
    //   },
    //   price: -1
    // }
  ],
  date: ''
}

const getInitialState = (): Readonly<PaymentReceiptForm.State> => {
  return {
    isSubmitted: false,
    form: { ...initialForm }
  }
};

@connect(mapStateToProps, mapDispatchToProps)
export class PaymentReceiptForm extends React.Component<PaymentReceiptForm.Props, PaymentReceiptForm.State> {
  constructor(props) {
    super(props);
    const { mode, paymentReceipt } = this.props; // mode - режим создание или сохранение.

    this.state = getInitialState();
    if (paymentReceipt !== null)
      this.state = {
        isSubmitted: false,
        form: mode === EFormMode.CREATE ? getInitialState().form : paymentReceipt
      };
  }

  //Изменяет поле "Компания" в форме
  handleSelectOrganization = (e) => {
    e.preventDefault();
    const organizationInfos = this.props.organizationInfos;
    const selectedOrganizationId = e.target.value;

    this.setState({
      form: {
        ...this.state.form,
        organization: organizationInfos.find(
          organization => organization.id == Number.parseInt(selectedOrganizationId)
        )
      }
    })
  }

  handleAddService = (e) => {
    e.preventDefault();
    const form = this.state.form
    const selectedServiceId = Number.parseInt(e.target.value);
    const selectedService = this.props.serviceInfos.find(
      service => service.id == selectedServiceId
    )

    let doesItRepeat = form.priceList.find(
      priceListEntry => priceListEntry.service.id == selectedServiceId
    )
    if (doesItRepeat) return;

    this.setState({
      form: {
        ...form,
        priceList: [
          ...form.priceList,
          {
            service: {
              id: selectedServiceId,
              name: selectedService.name
            },
            price: 0
          }
        ]
      }
    });
  }

  handleChangePrice = (priceValue, priceListEntryIndex) => {
    const form = this.state.form;
    this.setState({
      form: {
        ...form,
        priceList: form.priceList.map(
          (priceListEntry, index) => {
            if (index == priceListEntryIndex)
              priceListEntry.price = priceValue;
            return priceListEntry;
          }
        )
      }
    });
  }

  handleDeleteService = (e) => {
    e.preventDefault();

    this.setState({
      form: {
        ...this.state.form,
        priceList: this.state.form.priceList.filter(
          priceListEntry => priceListEntry.service.id != e.target.value
        )
      }
    });
  }

  //Отправляет форму на сервер
  handleSubmitPaymentReceipt = (e) => {
    e.preventDefault();
    const form = this.state.form;

    form.receiptNumber != initialForm.receiptNumber &&
      form.organization != initialForm.organization &&
      form.fname != initialForm.fname &&
      form.priceList != initialForm.priceList &&
      form.date != initialForm.date &&

      this.props.submitPaymentReceipt(form);
    this.setState({
      isSubmitted: true
    })
  }

  //Обновляет форму
  updateForm = (diff) => {
    this.setState({
      form: {
        ...this.state.form,
        ...diff
      }
    })
  }
  getValidationFname(value) {
    const { form } = this.state;
    const fname = form.fname
    const lname = form.lname
    const patronymic = form.patronymic
    const phone = form.phone
    const receiptNumber = form.receiptNumber;
    const series = form.series;
    switch (value) {
      case "fname":
        return /[а-яА-Я]/.test(fname) ? 'success' : 'error';
      case "lname":
        return /[а-яА-Я]/.test(lname) ? 'success' : 'error';
      case "patronymic":
        return /[а-яА-Я]/.test(patronymic) ? 'success' : 'error';
      case "phone":
        return /\d{11}/.test(phone) ? 'success' : 'error';
      case "receiptNumber":
        //return /\d{6}/.test(receiptNumber)? 'success' : 'error';
        return receiptNumber.toString().match(/\d{6}/) ? 'success' : 'error';
      case "series":
        return /[A-ZА-Я]{2}/.test(series) ? 'success' : 'error';

    }
  }

  render() {
    const { serviceInfos, organizationInfos, paymentReceipt } = this.props;
    const form = this.state.form;

    if (this.state.isSubmitted) return <Redirect to='/list' />

    //Получение обьекта с описанием компании для вывода в форме, поиск по id
    let organizationInfo = organizationInfos.find((organization) => organization.id == form.organization.id);

    return (
      <div className='PaymentReceiptForm container' style={{ width: '580px', background: '#edebd5', padding: '20px', borderRadius: 10, border: "1px solid #797651" }}>
        <Form horizontal>
          <FormGroup controlId="organizationInfo">
            <Col componentClass={ControlLabel} sm={2}>
              Компания:
                </Col>
            <Col sm={50}>
              <SelectAdder
                describeList={organizationInfos}
                handleSelect={this.handleSelectOrganization}
              />
            </Col>
          </FormGroup>
          {//Вывод информации о компании в форме
            organizationInfo && (
              <p>{organizationInfo.name}<br />
                Юр. адрес {organizationInfo.address} <br />
                ИНН: {organizationInfo.INN}; ОРГН: {organizationInfo.ORGN}
              </p>
            )
          }

          <FormGroup controlId="receiptNumber" validationState={this.getValidationFname("receiptNumber")}>
            <Col componentClass={ControlLabel} sm={5}>
              Квитанция на оплату №:
                </Col>
            <Col sm={15}>
              <FormControl type="text" placeholder="001"
                name='receiptNumber'
                defaultValue={`${form.receiptNumber == -1 ? '' : form.receiptNumber}`}
                onChange={(e) => this.updateForm({ receiptNumber: e.target.value })}
                style={{ width: '80px' }} />
            </Col>
          </FormGroup>


          <FormGroup controlId="series" validationState={this.getValidationFname("series")}>
            <Col componentClass={ControlLabel} sm={5}>
              Серия:
                </Col>
            <Col sm={15}>
              <FormControl type='text' placeholder="AA"
                name='series'
                defaultValue={form.series}
                onChange={(e) => this.updateForm({ series: e.target.value })}
                style={{ width: '50px' }} />
            </Col>
          </FormGroup>
        </Form>

        <Form horizontal>
          <FormGroup controlId="lname" validationState={this.getValidationFname("lname")}>
            <Col componentClass={ControlLabel} sm={3}>
              Фамилия:
                </Col>
            <Col sm={15}>
              <FormControl required type='text' placeholder="Иванов"
                name='lname'
                defaultValue={form.lname}
                onChange={
                  (e) => this.updateForm({
                    lname: e.target.value
                  })
                }
                style={{ width: '200px' }} />
            </Col>
          </FormGroup>

          <FormGroup controlId="fname" validationState={this.getValidationFname("fname")}>
            <Col componentClass={ControlLabel} sm={3}>
              Имя:
                </Col>
            <Col sm={15}>
              <FormControl required type='text' placeholder="Иван"
                name='fname'
                defaultValue={form.fname}
                onChange={
                  (e) => this.updateForm({
                    fname: e.target.value
                  })
                }
                style={{ width: '200px' }} />
            </Col>
          </FormGroup>

          <FormGroup controlId="patronymic" validationState={this.getValidationFname("patronymic")}>
            <Col componentClass={ControlLabel} sm={3}>
              Отчество:
                </Col>
            <Col sm={15}>
              <FormControl required type='text' placeholder="Иванович"
                name='patronymic'
                defaultValue={form.patronymic}
                onChange={
                  (e) => this.updateForm({
                    patronymic: e.target.value
                  })
                }
                style={{ width: '200px' }} />
            </Col>
          </FormGroup>

          <FormGroup controlId="phone" validationState={this.getValidationFname("phone")}>
            <Col componentClass={ControlLabel} sm={3}>
              Телефон:
                </Col>
            <Col sm={15}>
              <FormControl type='text' placeholder="88005553535"
                name='phone'
                defaultValue={form.phone}
                onChange={
                  (e) => this.updateForm({
                    phone: e.target.value
                  })}
                style={{ width: '200px' }} />
            </Col>
          </FormGroup>

        </Form>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}>
            Услуги:
                </Col>

          <SelectAdder
            describeList={serviceInfos}
            handleSelect={this.handleAddService}
          />

          <br />
          <PriceListTable
            priceList={form.priceList}
            describeList={serviceInfos}
            handleChangePrice={this.handleChangePrice}
            handleDelete={this.handleDeleteService}
          />
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}>
            Дата оплаты:
                  </Col>

          <FormControl type='date'
            defaultValue={form.date}
            onChange={e => this.updateForm({ date: e.target.value })}
            style={{ width: '150px' }} />
        </FormGroup>

        <Col componentClass={ControlLabel} sm={1}>
          <Button style={{ width: "510px", border: "1px solid #797651" }} onClick={this.handleSubmitPaymentReceipt}>{this.props.mode == EFormMode.CREATE ? 'Добавить' : 'Изменить'}</Button>
        </Col>
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

function mapDispatchToProps(dispatch) {
  return {
    submitPaymentReceipt: PaymentReceiptActions.submitPaymentReceipt.bind(this, dispatch)
  };
}

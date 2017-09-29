import * as React from 'react';
import { Table, FormControl, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

export namespace PriceListTable {
  export interface Props {
    priceList: PriceListEntry[];
    describeList: any[]
    handleChangePrice?;
    handleDelete?;//Если событие удаления не назначено, кнопки удаления не будет
  }

  export interface State {
    //empty
  }
}

export class PriceListTable extends React.Component<PriceListTable.Props, PriceListTable.State> {

  render() {
    const { priceList, describeList, handleChangePrice, handleDelete } = this.props;

    let servicesPriceSum: number = 0;
    let renderPriceList = priceList.map(
      (priceListEntry: PriceListEntry, index) => {
        let service: ServiceData = describeList.find((service: ServiceData) => service.id == priceListEntry.service.id);
        servicesPriceSum += priceListEntry.price;
        return <tr key={index}>
          <td>{service.name}</td>
          <td>
            {!this.props.handleChangePrice
              ? priceListEntry.price
              : <FormControl placeholder="100"
                type='text'
                name='price'
                defaultValue={String(priceListEntry.price)}
                onChange={e => handleChangePrice(Number.parseInt(e.target.value), index)}
              />
            }
          </td>
          {this.props.handleDelete != null ? //Если событие удаления не назначено, кнопки не будет
            <td><OverlayTrigger placement="right" overlay={<Tooltip id="tooltip"><strong>Удаление услуги</strong></Tooltip>}>
              <Button value={service.id} onClick={handleDelete}><img width="20" src='../../images/delete.png' /></Button>
              </OverlayTrigger></td>
            :
            <td></td>}
        </tr>;
      }
    );

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Наименование услуги</th>
            <th>Сумма (в рублях)</th>
          </tr>
        </thead>
        <tbody>
            {renderPriceList}
            <tr><td><b><i>Всего по квитанции</i></b></td><td><b><i>{servicesPriceSum}</i></b></td></tr>
          </tbody>
      </Table>
    );
  }
}

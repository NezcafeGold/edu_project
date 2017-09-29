import * as React from 'react';
import { FormControl } from 'react-bootstrap'

export namespace SelectAdder {
  export interface Props {
    describeList: any[];
    handleSelect: Function;
  }

  export interface State {
    //empty
  }
}

export class SelectAdder extends React.Component<SelectAdder.Props, SelectAdder.State> {

   render() {
    const {describeList} = this.props;

    let renderOptions = describeList.map(
      (item, index) => {
      return <option key={index} 
                    value={item.id}
                    >
                      {item.name} 
              </option>
      }
    )

    return (
      <FormControl componentClass="select" placeholder="select" name='selectAdder' 
              value={-1}
              style={{width: '450px'}}
              onChange={(e)=>this.props.handleSelect(e)}
              >
        <option key={-1} value={-1} disabled>Выбрать</option>
        {renderOptions}
      </FormControl>
    );
  }
}

import React, { PureComponent } from 'react';
import { Select } from 'antd';

import styles from './index.less';

const { Option } = Select;

class DatasetListSelector extends PureComponent {
  render() {
    const { list, handleChange, size } = this.props;

    const optionContents = list.map(item => {
      return (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      );
    });

    return (
      <div className={styles.datasetListSelector}>
        <Select
          size={size}
          showSearch
          style={{ width: '100%' }}
          placeholder="Select a dataset"
          optionFilterProp="children"
          onChange={handleChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {optionContents}
        </Select>
      </div>
    );
  }
}

export default DatasetListSelector;

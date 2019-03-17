import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import DashboardPanel from './DashboardPanel';

import styles from './index.less';

@connect(({ dashboard }) => ({
  dashboard,
}))
class Dashboards extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/fetchAll',
    });
  }

  render() {
    const { dashboard, dispatch } = this.props;
    const { dashboards } = dashboard;
    const colNumber = 4;
    const colSpan = 24 / colNumber;
    const rowHeight = 300;

    let dashboardsContents = [];

    const buildDashboard = d => {
      const { grammar, dataSource, title, description } = d;
      return (
        <Col span={colSpan} key={title}>
          <DashboardPanel
            grammar={grammar}
            dataSource={dataSource}
            title={title}
            description={description}
            height={rowHeight}
          />
        </Col>
      );
    };

    for (const key in dashboards) {
      dashboardsContents.push(buildDashboard(dashboards[key]));
    }

    return (
      <PageHeaderWrapper>
        <div className={styles.dashboard}>
          <Row gutter={16}>{dashboardsContents}</Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Dashboards;

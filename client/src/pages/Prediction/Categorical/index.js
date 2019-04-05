import React, { PureComponent } from 'react';
import { Row, Col, Button, Modal, Empty } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import MLJobTable from '@/components/Prediction/MLJobTable';
import MLJobControlPanel from '@/components/Prediction/MLJobControlPanel';

import MLJobViewPanel from '@/components/Prediction/MLJobViewPanel';

import styles from './index.less';

@connect(({ classification, loading }) => ({
  classification,
  loading: loading.effects['classification/switchDetailView'],
}))
class Categorical extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'classification/fetchJobs',
    });
    dispatch({
      type: 'classification/fetchDatasets',
    });
    dispatch({
      type: 'classification/fetchConfig',
    });
  }

  render() {
    const { classification, dispatch, loading } = this.props;
    const { jobs, view, selectedJob, datasetList, selectedDataset, config } = classification;
    const jobType = 'AutoClassificationJob';

    const jobConfig = { ...config };
    if (jobConfig && jobConfig.auto_ml_algorithms) {
      delete jobConfig.auto_ml_algorithms['regressors'];
    }

    console.log(`ml is loading ${loading}`);

    const onCreate = () => {
      dispatch({
        type: 'classification/createView',
      });
    };
    const onList = () => {
      dispatch({
        type: 'classification/fetchJobs',
      });
      dispatch({
        type: 'classification/listView',
      });
    };
    const onDelete = r => {
      Modal.confirm({
        title: 'Do you Want to delete this job?',
        content: `job ${r.name} will be deleted! `,
        onOk() {
          dispatch({
            type: 'classification/deleteJob',
            payload: r.id,
          });
        },
      });
    };
    const onView = r => {
      dispatch({
        type: 'classification/switchDetailView',
        payload: r.id,
      });
    };

    const handleDatasetSelection = event => {
      dispatch({
        type: 'classification/fetchDataset',
        payload: event,
      });
    };

    const handelJobCreation = event => {
      event.type = jobType;
      Modal.confirm({
        title: 'Do you Want to create this job?',
        content: `job ${event.name} will be created! `,
        onOk() {
          dispatch({
            type: 'classification/createMLJob',
            payload: event,
          });
        },
      });
    };

    const handleDetailRefresh = id => {
      dispatch({
        type: 'classification/switchDetailView',
        payload: id,
      });
    };

    const contentView = () => {
      if (view == 'list') {
        return <MLJobTable jobs={jobs} onView={onView} onDelete={onDelete} />;
      } else if (view == 'create') {
        return (
          <MLJobViewPanel
            isCreation={true}
            datasetList={datasetList}
            selectedDataset={selectedDataset}
            onDatasetSelect={handleDatasetSelection}
            onJobCreate={handelJobCreation}
            jobType={jobType}
            config={jobConfig}
          />
        );
      } else if (view == 'detail') {
        return (
          <MLJobViewPanel
            isCreation={false}
            jobType={jobType}
            selectedJob={selectedJob}
            onRefreshDetails={handleDetailRefresh}
            config={jobConfig}
          />
        );
      } else {
        return <Empty />;
      }
    };

    return (
      <PageHeaderWrapper>
        <div className={styles.numerical}>
          <Row>
            <MLJobControlPanel
              canList={true}
              canCreate={true}
              onList={onList}
              onCreate={onCreate}
            />
          </Row>
          <Row>{contentView()}</Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Categorical;

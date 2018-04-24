import React, { Component } from 'react';
import axios from 'axios';
import { Layout, Button, Table, Input, Tag, Modal } from 'antd';
const { Header, Content } = Layout;
const { TextArea } = Input;

class Teacher extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'Name',
      },
      {
        title: 'Point 1',
        dataIndex: 'Point1',
      },
      {
        title: 'Point 2',
        dataIndex: 'Point2',
      },
      {
        title: 'Point 3',
        dataIndex: 'Point3',
      },
      {
        title: 'Student',
        dataIndex: 'student_verify',
        render: (text, record) => this.renderStatus(text, record),
      },
      {
        title: 'Monitor',
        dataIndex: 'monitor_verify',
        render: (text, record) => this.renderStatus(text, record),
      },
      {
        title: 'Teacher',
        dataIndex: 'teacher_verify',
        render: (text, record) => this.renderStatus(text, record),
      },
      {
        title: 'Accept',
        dataIndex: 'accept',
        render: (text, record) => this.renderAccept(text, record),
      },
      {
        title: 'Reject',
        dataIndex: 'reject',
        render: (text, record) => this.renderReject(text, record),
      },
    ];
    this.state = {
      data: [],
      loading: false,
      visible: false,
      message: '',
      idReject: 0,
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:8080/get-form')
      .then((response) => {
        this.setState({
          data: response.data.status,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderStatus = (text, record) => {
    return text ? (
      <Tag color="#87d068">Verified</Tag>
    ) : (
      <Tag color="#f50">Not Verified</Tag>
    );
  };

  renderAccept = (text, record) => {
    if (record.monitor_verify) {
      return record.teacher_verify ? (
        <Button type="primary" disabled>
          Accept
        </Button>
      ) : (
        <Button type="primary" onClick={() => this._onSubmit(record)}>
          Accept
        </Button>
      );
    } else {
      return (
        <Button type="primary" disabled>
          Accept
        </Button>
      );
    }
  };

  renderReject = (text, record) => {
    if (record.monitor_verify) {
      return record.teacher_verify ? (
        <Button type="danger" disabled>
          Reject
        </Button>
      ) : (
        <Button type="danger" onClick={() => this.showModal(record)}>
          Reject
        </Button>
      );
    }
    return (
      <Button type="danger" disabled>
        Reject
      </Button>
    );
  };

  _onSubmit = (record) => {
    const { User_ID } = record;
    axios
      .post('http://localhost:8080/accept-form', {
        id: User_ID,
        role: this.props.role,
      })
      .then((response) => {
        console.log(response.data.status);
        this.setState({
          data: response.data.status,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  showModal = (record) => {
    this.setState({
      visible: true,
      idReject: record.User_ID,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    axios
      .post('http://localhost:8080/reject', {
        id: this.state.idReject,
        idReject: 5,
        role: this.props.role,
        content: this.state.message,
      })
      .then((response) => {
        console.log(response.data.status);
        this.setState({
          data: response.data.status,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      this.setState({ loading: false, visible: false, idReject: 0 });
    }, 2000);
  };
  
  handleCancel = () => {
    this.setState({ visible: false, message: '', idReject: 0 });
  };

  render() {
    const { visible, loading } = this.state;
    return (
      <div>
        <Layout>
          <Header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ color: 'white' }}>Welcome {this.props.role}</h2>
            <div>
              <Button type="primary" onClick={() => console.log('Log out')}>
                Log Out
              </Button>
            </div>
          </Header>
          <Content
            style={{
              backgroundColor: 'white',
              paddingTop: '2em',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '2em',
            }}
          >
            <Table
              bordered
              dataSource={this.state.data}
              columns={this.columns}
              style={{ display: 'flex', width: '100%' }}
            />
            <Modal
              visible={visible}
              title="Confirm rejection"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" onClick={this.handleCancel}>
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="danger"
                  loading={loading}
                  onClick={this.handleOk}
                  disabled={this.state.message.trim() === '' && true}
                >
                  Reject
                </Button>,
              ]}
            >
              <TextArea
                placeholder="Enter your reasons..."
                autosize={{ minRows: 2, maxRows: 6 }}
                onChange={(e) => this.setState({ message: e.target.value })}
                value={this.state.message}
              />
            </Modal>
          </Content>
        </Layout>
      </div>
    );
  }
}
export default Teacher;

import React, { Component } from 'react';
import axios from 'axios';
import {
  Layout,
  Button,
  Table,
  Input,
  Tag,
  Icon,
  Badge,
  Modal,
  List,
} from 'antd';
import moment from 'moment';
const { Header, Content } = Layout;
const { TextArea } = Input;

class Monitor extends Component {
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
  }

  state = {
    data: [],
    messages: [],
    messagesVisible: false,
    loading: false,
    visible: false,
    message: '',
    idReject: 0,
  };

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

    axios
      .post('http://localhost:8080/get-msg', {
        id: this.props.id,
      })
      .then((response) => {
        console.log(response.data.data);
        this.setState({
          messages: response.data.data,
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
    if (record.student_verify) {
      return record.monitor_verify ? (
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
    if (record.student_verify) {
      return record.monitor_verify ? (
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
        idReject: 4,
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

  handleCancelMessage = () => {
    this.setState({
      messagesVisible: false,
    });
  };

  showMessagesModal = () => {
    this.setState({
      messagesVisible: true,
    });
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
              <Badge count={this.state.messages.length}>
                <a onClick={this.showMessagesModal} className="head-example">
                  <Icon
                    type="message"
                    style={{ fontSize: 20, color: 'white' }}
                  />
                </a>
              </Badge>
              <Button
                type="primary"
                onClick={() => console.log('Log out')}
                style={{ marginLeft: '2em' }}
              >
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
            <Modal
              title="Messages"
              visible={this.state.messagesVisible}
              onOk={this.handleCancelMessage}
              onCancel={this.handleCancelMessage}
            >
              <List
                itemLayout="horizontal"
                dataSource={this.state.messages}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={moment(item.createdTime).fromNow()}
                      description={item.Content}
                    />
                  </List.Item>
                )}
              />
            </Modal>
          </Content>
        </Layout>
      </div>
    );
  }
}
export default Monitor;

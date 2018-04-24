import React, { Component } from 'react';
import axios from 'axios';
import {
  Layout,
  Button,
  Table,
  Input,
  Popconfirm,
  Tag,
  Modal,
  List,
  Badge,
  Icon,
} from 'antd';
import moment from 'moment';
const { Header, Content } = Layout;

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable ? (
      <Input
        style={{ maxWidth: 40 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      value
    )}
  </div>
);

class Student extends Component {
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
        render: (text, record) => this.renderColumns(text, record, 'Point1'),
      },
      {
        title: 'Point 2',
        dataIndex: 'Point2',
        render: (text, record) => this.renderColumns(text, record, 'Point2'),
      },
      {
        title: 'Point 3',
        dataIndex: 'Point3',
        render: (text, record) => this.renderColumns(text, record, 'Point3'),
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
        title: 'Operation',
        dataIndex: 'student_verify',
        render: (text, record) => this.renderEdit(text, record),
      },
      {
        title: 'Action',
        dataIndex: 'student_verify',
        render: (text, record) => this.renderButton(text, record),
      },
    ];
    this.state = {
      data: [],
      messages: [],
      messagesVisible: false,
    };
  }

  componentDidMount() {
    axios
      .post('http://localhost:8080/get-form-by-id', {
        id: this.props.id,
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
    this.cacheData = this.state.data.map((item) => ({ ...item }));
    axios
      .post('http://localhost:8080/get-msg', {
        id: this.props.id,
      })
      .then((response) => {
        const time = moment(response.data.data[0].createdTime).fromNow()
        console.log(time);
        this.setState({
          messages: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={(value) => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter((item) => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter((item) => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter((item) => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map((item) => ({ ...item }));
    }
  }
  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter((item) => key === item.key)[0];
    if (target) {
      Object.assign(
        target,
        this.cacheData.filter((item) => key === item.key)[0],
      );
      delete target.editable;
      this.setState({ data: newData });
    }
  }

  renderStatus = (text, record) => {
    return text ? (
      <Tag color="#87d068">Verified</Tag>
    ) : (
      <Tag color="#f50">Not Verified</Tag>
    );
  };

  renderEdit = (text, record) => {
    const { editable } = record;
    return text ? (
      <Button type="primary" disabled>
        Edit
      </Button>
    ) : (
      <div className="editable-row-operations">
        {editable ? (
          <span>
            <Button
              type="primary"
              onClick={() => this.save(record.key)}
              style={{ marginRight: '1em' }}
            >
              Save
            </Button>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() => this.cancel(record.key)}
            >
              <Button type="danger">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button type="primary" onClick={() => this.edit(record.key)}>
            Edit
          </Button>
        )}
      </div>
    );
  };

  renderButton = (text, record) => {
    return text ? (
      <Button type="primary" disabled>
        Sent
      </Button>
    ) : (
      <Button type="primary" onClick={() => this._onSubmit(record)}>
        Send
      </Button>
    );
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

  _onSubmit = (record) => {
    console.log(record);
    const { Point1, Point2, Point3, User_ID } = record;
    axios
      .post('http://localhost:8080/student-submit-form', {
        id: User_ID,
        point1: Point1,
        point2: Point2,
        point3: Point3,
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

  render() {
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
            <h2 style={{ color: 'white' }}>Welcome {this.props.name}</h2>
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
export default Student;

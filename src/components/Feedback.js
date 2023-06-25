import { ConfigProvider, Empty, Table } from 'antd';
import { useEffect, useState } from 'react';

const lockerOrder = 'wunderbar_order';
const apiUrl = 'https://i293244fv0.execute-api.ap-southeast-1.amazonaws.com';

const columns = [
  {
    title: 'Table No.',
    dataIndex: 'key',
    sorter: (a, b) => a.key - b.key,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
  },
  {
    title: 'Feedback',
    dataIndex: 'feedback',
    width: '50%',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    width: '25%',
    sorter: (a, b) => Number(a.rate[0]) - Number(b.rate[0]),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Timestamp',
    dataIndex: 'timeStamp',
    sorter: (a, b) => {
      let timeA = a.timeStamp.split(':');
      let timeB = b.timeStamp.split(':');
      return (
        ((Number(timeA[0]) - Number(timeB[0])) * 3600 +
          (Number(timeA[1]) - Number(timeB[1]))) *
          60 +
        (Number(timeA[2]) - Number(timeB[2]))
      );
    },
    sortDirections: ['descend', 'ascend'],
    width: '10%',
  },
];
let data = [
  {
    key: 4,
    customer: 'anh Dong',
    feedback: 'Good drink and delicious food',
    rate: '3★',
    timeStamp: '15:30',
  },
  {
    key: 1,
    customer: 'anh Duc',
    feedback: 'Good drink and delicious food 2',
    rate: '5★',
    timeStamp: '15:35',
  },
  {
    key: 3,
    customer: 'anh Hoang',
    feedback: 'Terrible food, cruel server.',
    rate: '1★',
    timeStamp: '15:15',
  },
];
const Feedback = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // eslint-disable-next-line
  const [tableData, setTableData] = useState(data);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  async function getOrderStatus() {
    const res = await fetch(apiUrl + '/all/' + lockerOrder);
    // .then(response => console.log(response.json()))
    // .then();
    const data1 = await res.json();
    // console.log(Object.prototype)
    // console.log(apiUrl + '/all/' + lockerOrder)
    data = [];
    if (
      data1 !== null && // 👈 null and undefined check
      Object.keys(data1).length > 0
    ) {
      // && Object.getPrototypeOf(data1) === Object.prototype) {
      for (var i = 0; i < data1.length; i++) {
        if (typeof data1[i]['review'] !== 'undefined')
          data.push({
            key: data1[i]['table'],
            customer: data1[i]['customer'],
            rate: data1[i]['review']['star'] + '★',
            feedback: data1[i]['review']['feedback'],
            timeStamp: data1[i]['timestamp'],
          });
      }
      setTableData(data);
    } else {
      setTableData(null);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getOrderStatus();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <ConfigProvider
        renderEmpty={() => <Empty description="No recent rate" />}
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </ConfigProvider>
    </div>
  );
};
export default Feedback;

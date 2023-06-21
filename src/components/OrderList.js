import {Button, ConfigProvider, Empty, message, notification, Space, Table} from 'antd';
import {useEffect, useState} from 'react';

const lockerOrder = 'wunderbar_order';
const apiUrl =
    'https://i293244fv0.execute-api.ap-southeast-1.amazonaws.com';
    // 'https://vq4h0iro9k.execute-api.ap-southeast-1.amazonaws.com/locker';

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
        title: 'Details',
        dataIndex: 'description',
        width: '50%',
    },
    {
        title: 'Total Price ($)',
        dataIndex: 'price',
        width: '15%',
    },
    {
        title: 'Timestamp',
        dataIndex: 'timeStamp',
        sorter: (a, b) => {
            let timeA = a.timeStamp.split(':')
            let timeB = b.timeStamp.split(':')
            return ((Number(timeA[0]) - Number(timeB[0])) * 3600 + (Number(timeA[1]) - Number(timeB[1]))) * 60 + (Number(timeA[2]) - Number(timeB[2]))
        },
        sortDirections: ['descend', 'ascend'],
        width: '10%',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        filters: [
            {
                text: 'Received',
                value: 'Received',
            },
            {
                text: 'Processing',
                value: 'Processing',
            },
            {
                text: 'Cancelled',
                value: 'Cancelled',
            },
            {
                text: 'Done',
                value: 'Done',
            },
        ],
        onFilter: (value, record) => record.status.startsWith(value),
        filterSearch: true,
        width: '10%',
    },

];
let data = [
    {
        key: 4,
        customer: "anh Dong",
        description: "Milk tea coffee: Hot drink Size S with 4 pumps of chocolate sauce: 3.25$\nSandwiches: with turkey and egg: 5$",
        price: "10$",
        timeStamp: "15:30",
        status: "New"
    },
    {
        key: 1,
        customer: "anh Duc",
        description: "Traditional coffee: Blended drink Size XL: 4$\nBagels: with butter: 3.5$",
        price: "8$",
        timeStamp: "15:35",
        status: "In Progress"
    },
    {
        key: 3,
        customer: "anh Hoang",
        description: "Traditional coffee: Cold drink Size L: 3.5$\nBagels: with cream cheese: 3.5$",
        price: "7$",
        timeStamp: "15:15",
        status: "Done"
    }];
const OrderList = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [tableData, setTableData] = useState(data);
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const receiveBill = () => {
        let result = null;
        for (let i = 0; i < selectedRowKeys.length; i++) {
            result = data.find(obj => {
                return obj.key === selectedRowKeys[i]
            })
            if (result.status === "Received") {
                result.status = "Processing"
                notification.info({
                    message: 'Bill for table ' + result.key + '  received!',
                    description: 'The order is being prepared!',
                    placement: 'topRight',
                });
            }

        }
        if (result === null) {
            message.error('No bill selected!');
            return
        }
        let dataToPush = {
            timeStamp: result.timeStamp,
            price: result.price,
            description: result.description,
            id: result.id,
            table: result.key,
            customer: result.customer,
            status: result.status
        }
        fetch(apiUrl + '/upsert/' + lockerOrder, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(dataToPush),
        });
        setTableData(data)
        setSelectedRowKeys([])
    }

    const billDone = () => {
        let result = null;
        for (let i = 0; i < selectedRowKeys.length; i++) {
            result = data.find(obj => {
                return obj.key === selectedRowKeys[i]
            })
            if (result.status === "Processing") result.status = "Done"
            message.success('The bill for table ' + result.key + ' done!');
        }
        if (result === null) {
            message.error('No bill selected!');
            return
        }
        let dataToPush = {
            timeStamp: result.timeStamp,
            price: result.price,
            description: result.description,
            id: result.id,
            table: result.key,
            customer: result.customer,
            status: result.status
        }
        fetch(apiUrl + '/upsert/' + lockerOrder, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(dataToPush),
        });
        setTableData(data)
        setSelectedRowKeys([])
    }

    async function getOrderStatus() {
        // const res = await fetch(apiUrl + '/all/' + lockerOrder);
        const res = await fetch(apiUrl + '/all/' + lockerOrder)
            // .then(response => console.log(response.json()))
            // .then();
        const data1 = await res.json();
        console.log(Object.prototype)
        // console.log(apiUrl + '/all/' + lockerOrder)
        data = []
        if (data1 !== null // 👈 null and undefined check
            && Object.keys(data1).length > 0) {
            // && Object.getPrototypeOf(data1) === Object.prototype) {
            for (var i = 0; i < data1.length; i++) {
                console.log("have data")
                data.push(
                    {
                        key: data1[i]["table"],
                        customer: data1[i]["customer"],
                        description: data1[i]["description"],
                        price: data1[i]["price"],
                        timeStamp: data1[i]["timestamp"],
                        status: data1[i]["status"],
                        id: data1[i]["id"]
                    }
                )
            }
            setTableData(data)
        } else {
            setTableData(null)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getOrderStatus()
        }, 5000);

        return () => clearInterval(interval);
    }, [])


    return (
        <div>
            <ConfigProvider renderEmpty={() => <Empty description="No recent bill"/>}>
                <Table rowSelection={rowSelection} columns={columns} dataSource={tableData} style={{whiteSpace: "pre-wrap"}}/>
            </ConfigProvider>
            <Space wrap style={{float: "right"}}>
                <Button type="primary" style={{backgroundColor: "goldenrod"}} onClick={receiveBill}>Process selected bills</Button>
                <Button type="primary" style={{backgroundColor: "green"}} onClick={billDone}>Selected bills done</Button>
            </Space>
        </div>
    )
};
export default OrderList;
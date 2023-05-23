import { LaptopOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import React from 'react';
import OrderList from "./OrderList";
import Clock from "./Clock";
const { Header, Content, Footer, Sider } = Layout;

const items2 = [UserOutlined, LaptopOutlined].map((icon, index) => {
    const key = ["Order", "Feedback"];
    return {
        icon: React.createElement(icon),
        label: `${key[index]}`,
    };
});
const Home = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo">
                    <p style={{color:"cyan"}}>Duc Dong Cafeteria</p>
                </div>
                {/*<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />*/}
            </Header>
            <Content
                style={{
                    padding: '0 50px',
                }}
            >
                <Breadcrumb style={{ margin: '4px 0' }}>
                    <Clock/>
                </Breadcrumb>
                <Layout
                    style={{
                        padding: '24px 0',
                        background: colorBgContainer,
                    }}
                >

                    <Sider
                        style={{
                            background: colorBgContainer,
                        }}
                        width={200}
                    >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{
                                height: '100%',
                                textAlign: "left"
                            }}
                            items={items2}
                        />
                    </Sider>
                    <Content
                        style={{
                            padding: '0 24px',
                            minHeight: 280,
                        }}
                    >
                        <OrderList/>
                    </Content>
                </Layout>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Duc Dong Cafeteria ©2023
            </Footer>
        </Layout>
    );
};
export default Home;
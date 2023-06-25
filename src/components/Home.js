import { LaptopOutlined, UserOutlined } from '@ant-design/icons';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import React from 'react';
import OrderList from './OrderList';
import Clock from './Clock';
import Feedback from './Feedback';

const { Header, Content, Footer, Sider } = Layout;

const item = [
  { label: 'Order', key: '/order', icon: <UserOutlined /> },
  { label: 'Feedback', key: '/feedback', icon: <LaptopOutlined /> },
];

const Home = () => {
  const navigate = useNavigate();
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
          <p style={{ color: 'cyan' }}>Duc Dong Cafeteria</p>
        </div>
        {/*<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={items2} />*/}
      </Header>
      <Content
        style={{
          padding: '0 50px',
        }}
      >
        <Breadcrumb style={{ margin: '4px 0' }}>
          <Clock />
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
              onClick={({ key }) => {
                navigate(key);
              }}
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{
                height: '100%',
                textAlign: 'left',
              }}
              items={item}
            />
          </Sider>
          <Content
            style={{
              padding: '0 24px',
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path="/order" element={<OrderList />} />
              <Route path="/feedback" element={<Feedback />} />
            </Routes>
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

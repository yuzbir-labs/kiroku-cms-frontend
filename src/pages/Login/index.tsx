import React, { useEffect } from 'react';
import { Card, Form, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, type LoginRequest } from '../../api/login';
import { Button, Input } from '../../components';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const loginMutation = useLoginMutation(messageApi);

  // Handle navigation after successful login
  useEffect(() => {
    if (loginMutation.isSuccess) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }
  }, [loginMutation.isSuccess, navigate]);

  const handleSubmit = (values: LoginRequest) => {
    loginMutation.mutate(values);
  };

  return (
    <div className={styles.loginContainer}>
      {contextHolder}
      <Card title="Xoş gəlmisiniz" className={styles.loginCard}>
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item
            label="E-poçt"
            name="email"
            rules={[
              { required: true, message: 'E-poçt ünvanınızı daxil edin!' },
              { type: 'email', message: 'Düzgün e-poçt ünvanı daxil edin!' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="email@example.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            label="Şifrə"
            name="password"
            rules={[{ required: true, message: 'Şifrənizi daxil edin!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Şifrə"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending}
              block
              className={styles.submitButton}
            >
              {loginMutation.isPending ? 'Giriş edilir...' : 'Giriş'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

import { useEffect } from 'react';
import { Card, Form, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation, useCurrentUserQuery, type LoginRequest } from 'api/auth';
import { Button, Input } from 'components';
import { UserRoles } from 'utils/permissions';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const loginMutation = useLoginMutation(messageApi);
  const { data: user } = useCurrentUserQuery();

  // Redirect already authenticated users
  useEffect(() => {
    if (user && !loginMutation.isPending) {
      if (user.user_type === UserRoles.STUDENT) {
        navigate('/my-groups');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate, loginMutation.isPending]);

  // Redirect after successful login
  useEffect(() => {
    if (loginMutation.isSuccess && user) {
      setTimeout(() => {
        // Redirect students to my-groups, others to dashboard
        if (user.user_type === UserRoles.STUDENT) {
          navigate('/my-groups');
        } else {
          navigate('/dashboard');
        }
      }, 500);
    }
  }, [loginMutation.isSuccess, user, navigate]);

  const handleSubmit = (values: LoginRequest) => {
    loginMutation.mutate(values);
  };

  return (
    <div className={styles.loginContainer}>
      {contextHolder}
      <Card className={styles.loginCard} bordered={false}>
        <div className={styles.logoSection}>
          <img src="/kiroku-icon.svg" alt="Kiroku" className={styles.logoImage} />
          <h1 className={styles.projectName}>Kiroku</h1>
        </div>
        <h2 className={styles.cardTitle}>Xoş gəlmisiniz</h2>
        <p className={styles.cardSubtitle}>Davam etmək üçün hesabınıza daxil olun</p>
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
            <Input prefix={<MailOutlined />} placeholder="email@example.com" autoComplete="email" />
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
            <div className={styles.forgotPassword}>
              <Link to="/reset-password" className={styles.forgotPasswordLink}>
                Şifrəni unutmusunuz?
              </Link>
            </div>
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

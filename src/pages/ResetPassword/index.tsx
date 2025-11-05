import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, message, Result, Spin } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  useRequestPasswordResetMutation,
  useVerifyPasswordResetTokenMutation,
  useConfirmPasswordResetMutation,
} from '../../api';
import { Button, Input } from '../../components';
import styles from './ResetPassword.module.css';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // Check if we have token and email from URL
  const urlToken = searchParams.get('token');
  const urlEmail = searchParams.get('email');

  const [mode, setMode] = useState<'request' | 'reset' | 'success'>(
    urlToken && urlEmail ? 'reset' : 'request'
  );
  const [isVerifying, setIsVerifying] = useState(!!urlToken && !!urlEmail);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [token, setToken] = useState(urlToken || '');
  const [email, setEmail] = useState(urlEmail || '');

  const [emailForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const requestResetMutation = useRequestPasswordResetMutation(messageApi);
  const verifyTokenMutation = useVerifyPasswordResetTokenMutation(messageApi);
  const confirmResetMutation = useConfirmPasswordResetMutation(messageApi);

  const verifyResetToken = useCallback(
    async (tokenToVerify: string, emailToVerify: string) => {
      setIsVerifying(true);
      try {
        await verifyTokenMutation.mutateAsync({
          token: tokenToVerify,
          email: emailToVerify,
        });
        setIsTokenValid(true);
        setToken(tokenToVerify);
        setEmail(emailToVerify);
      } catch (error) {
        setIsTokenValid(false);
        console.error('Token verification failed:', error);
      } finally {
        setIsVerifying(false);
      }
    },
    [verifyTokenMutation]
  );

  // Verify token when component mounts with token in URL
  useEffect(() => {
    if (urlToken && urlEmail) {
      verifyResetToken(urlToken, urlEmail);
      // Clear URL parameters for security
      window.history.replaceState({}, '', '/reset-password');
    }
  }, [urlToken, urlEmail, verifyResetToken]);

  const handleRequestReset = async (values: { email: string }) => {
    try {
      await requestResetMutation.mutateAsync({ email: values.email });
      setEmail(values.email);
      setMode('success');
    } catch (error) {
      console.error('Request reset failed:', error);
    }
  };

  const handleResetPassword = async (values: {
    new_password: string;
    confirm_password: string;
  }) => {
    try {
      await confirmResetMutation.mutateAsync({
        token,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      });
      setMode('success');
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };

  const renderContent = () => {
    // Verifying token from email link
    if (isVerifying) {
      return (
        <div className={styles.verifyingContainer}>
          <Spin size="large" />
          <p className={styles.verifyingText}>
            Şifrə sıfırlama linki yoxlanılır...
          </p>
        </div>
      );
    }

    // Invalid or expired token
    if (mode === 'reset' && !isTokenValid) {
      return (
        <Result
          status="error"
          title="Etibarsız və ya Vaxtı Keçmiş Link"
          subTitle="Şifrə sıfırlama linki etibarsız və ya vaxtı keçmişdir. Yeni link tələb edin."
          extra={[
            <Button
              type="primary"
              key="request-new"
              onClick={() => {
                setMode('request');
                setToken('');
                setEmail('');
              }}
              size="large"
            >
              Yeni Link Tələb Et
            </Button>,
            <Button key="back" onClick={() => navigate('/login')} size="large">
              Girişə Qayıt
            </Button>,
          ]}
        />
      );
    }

    // Request reset email
    if (mode === 'request') {
      return (
        <div>
          <h1 className={styles.title}>Şifrəni Sıfırla</h1>
          <p className={styles.description}>
            E-poçt ünvanınızı daxil edin və sizə şifrə sıfırlama linki
            göndərəcəyik.
          </p>
          <Form
            form={emailForm}
            name="request-reset"
            onFinish={handleRequestReset}
            autoComplete="off"
            size="large"
            layout="vertical"
          >
            <Form.Item
              label="E-poçt"
              name="email"
              rules={[
                { required: true, message: 'E-poçt ünvanınızı daxil edin!' },
                {
                  type: 'email',
                  message: 'Düzgün e-poçt ünvanı daxil edin!',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="email@example.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={requestResetMutation.isPending}
                block
                className={styles.submitButton}
              >
                {requestResetMutation.isPending
                  ? 'Göndərilir...'
                  : 'Sıfırlama Linki Göndər'}
              </Button>
            </Form.Item>

            <div className={styles.backToLogin}>
              <Link to="/login" className={styles.backLink}>
                Girişə qayıt
              </Link>
            </div>
          </Form>
        </div>
      );
    }

    // Reset password form (after valid token)
    if (mode === 'reset' && isTokenValid) {
      return (
        <div>
          <h1 className={styles.title}>Yeni Şifrə Təyin Edin</h1>
          <p className={styles.description}>
            <strong>{email}</strong> hesabı üçün yeni şifrənizi daxil edin.
          </p>
          <Form
            form={passwordForm}
            name="reset-password"
            onFinish={handleResetPassword}
            autoComplete="off"
            size="large"
            layout="vertical"
          >
            <Form.Item
              label="Yeni Şifrə"
              name="new_password"
              rules={[
                { required: true, message: 'Yeni şifrənizi daxil edin' },
                { min: 8, message: 'Şifrə ən azı 8 simvol olmalıdır' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Yeni şifrə"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              label="Yeni Şifrəni Təsdiqlə"
              name="confirm_password"
              dependencies={['new_password']}
              rules={[
                { required: true, message: 'Yeni şifrənizi təsdiq edin' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('new_password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Şifrələr uyğun gəlmir'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Yeni şifrəni təsdiqlə"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={confirmResetMutation.isPending}
                block
                className={styles.submitButton}
              >
                {confirmResetMutation.isPending
                  ? 'Şifrə dəyişdirilir...'
                  : 'Şifrəni Dəyişdir'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      );
    }

    // Success state
    if (mode === 'success') {
      return (
        <Result
          status="success"
          title={token ? 'Şifrə Uğurla Dəyişdirildi!' : 'E-poçtunuzu Yoxlayın!'}
          subTitle={
            token
              ? 'Şifrəniz uğurla dəyişdirildi. İndi yeni şifrənizlə giriş edə bilərsiniz.'
              : 'Əgər bu e-poçt ünvanı ilə hesab varsa, şifrə sıfırlama linki göndərilmişdir.'
          }
          extra={[
            <Button
              type="primary"
              key="login"
              onClick={() => navigate('/login')}
              size="large"
            >
              Girişə Get
            </Button>,
          ]}
        />
      );
    }

    return null;
  };

  return (
    <div className={styles.resetPasswordContainer}>
      {contextHolder}
      <Card className={styles.resetPasswordCard} bordered={false}>
        <div className={styles.logoSection}>
          <img
            src="/kiroku-icon.svg"
            alt="Kiroku"
            className={styles.logoImage}
          />
          <h1 className={styles.projectName}>Kiroku</h1>
        </div>
        {renderContent()}
      </Card>
    </div>
  );
};

export default ResetPassword;

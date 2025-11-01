import React, { useEffect } from 'react';
import { Card, Statistic, Row, Col, Spin, Alert, message } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCurrentUserQuery, useLogoutMutation, useCSRFTokenQuery, useUsersListQuery } from '../../api/login';
import { Button } from '../../components';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUserQuery();  
  const logoutMutation = useLogoutMutation(messageApi);
  const { data: csrfToken } = useCSRFTokenQuery();
  const { data: usersList } = useUsersListQuery();
  // Handle navigation after successful logout
  useEffect(() => {
    if (logoutMutation.isSuccess) {
      setTimeout(() => {
        navigate('/login');
      }, 500);
    }
  }, [logoutMutation.isSuccess, navigate]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getUserTypeLabel = (userType: string) => {
    const typeMap: Record<string, string> = {
      ORGANIZATION_ADMIN: 'Təşkilat Admini',
      BRANCH_ADMIN: 'Filial Admini',
      BRANCH_MANAGER: 'Filial Meneceri',
      TEACHER: 'Müəllim',
      STUDENT: 'Tələbə',
      PARENT: 'Valideyn',
    };
    return typeMap[userType] || 'Təyin edilməyib';
  };

  if (userLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Yüklənir..." />
      </div>
    );
  }

  if (userError) {
    return (
      <div className={styles.errorContainer}>
        <Alert
          message="Xəta"
          description="İstifadəçi məlumatlarını yükləmək mümkün olmadı. Xahiş edirik yenidən giriş edin."
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => navigate('/login')}>
              Girişə qayıt
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.header}>
        <h1 className={styles.title}>İdarə Paneli</h1>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          loading={logoutMutation.isPending}
        >
          Çıxış
        </Button>
      </div>

      {user && (
        <Card
          title={`Xoş gəlmisiniz, ${user.full_name}`}
          className={styles.welcomeCard}
          extra={<span className={styles.emailExtra}>{user.email}</span>}
        >
          <Row gutter={16}>
            <Col span={8}>
              <div className={styles.userInfoItem}>
                <span className={styles.userInfoLabel}>İstifadəçi tipi:</span>
                <span className={styles.userInfoValue}>
                  {getUserTypeLabel(user.user_type)}
                </span>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.userInfoItem}>
                <span className={styles.userInfoLabel}>Status:</span>
                <span
                  className={
                    user.is_active ? styles.statusActive : styles.statusInactive
                  }
                >
                  {user.is_active ? 'Aktiv' : 'Deaktiv'}
                </span>
              </div>
            </Col>
            {user.phone_number && (
              <Col span={8}>
                <div className={styles.userInfoItem}>
                  <span className={styles.userInfoLabel}>Telefon:</span>
                  <span className={styles.userInfoValue}>
                    {user.phone_number}
                  </span>
                </div>
              </Col>
            )}
          </Row>
        </Card>
      )}

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="İstifadəçilər"
              value={user?.branches.length || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

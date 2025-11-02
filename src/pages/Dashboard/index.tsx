import React from 'react';
import { Card, Row, Col, Spin, Alert, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  ShopOutlined,
  TeamOutlined,
  BookOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useCurrentUserQuery } from '../../api/auth';
import {
  useOrganizationQuery,
  useOrganizationStatisticsQuery,
} from '../../api';
import { Button } from '../../components';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUserQuery();

  const {
    data: organization,
    isLoading: orgLoading,
    error: orgError,
  } = useOrganizationQuery();

  const {
    data: statistics,
    isLoading: statsLoading,
    error: statsError,
  } = useOrganizationStatisticsQuery();

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
      <div className={styles.header}>
        <h1 className={styles.title}>İdarə Paneli</h1>
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

      {organization && (
        <Card
          title="Təşkilat Məlumatları"
          className={styles.organizationCard}
          loading={orgLoading}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <div className={styles.orgInfoItem}>
                <span className={styles.orgInfoLabel}>Təşkilat adı:</span>
                <span className={styles.orgInfoValue}>{organization.name}</span>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className={styles.orgInfoItem}>
                <span className={styles.orgInfoLabel}>Kod:</span>
                <span className={styles.orgInfoValue}>{organization.code}</span>
              </div>
            </Col>
            {organization.description && organization.description.trim() && (
              <Col xs={24}>
                <div className={styles.orgInfoItem}>
                  <span className={styles.orgInfoLabel}>Təsvir:</span>
                  <span className={styles.orgInfoValue}>
                    {organization.description}
                  </span>
                </div>
              </Col>
            )}
            {organization.email && organization.email.trim() && (
              <Col xs={24} sm={12}>
                <div className={styles.orgInfoItem}>
                  <span className={styles.orgInfoLabel}>Email:</span>
                  <span className={styles.orgInfoValue}>
                    {organization.email}
                  </span>
                </div>
              </Col>
            )}
            {organization.phone_number && organization.phone_number.trim() && (
              <Col xs={24} sm={12}>
                <div className={styles.orgInfoItem}>
                  <span className={styles.orgInfoLabel}>Telefon:</span>
                  <span className={styles.orgInfoValue}>
                    {organization.phone_number}
                  </span>
                </div>
              </Col>
            )}
            {organization.website && organization.website.trim() && (
              <Col xs={24} sm={12}>
                <div className={styles.orgInfoItem}>
                  <span className={styles.orgInfoLabel}>Vebsayt:</span>
                  <span className={styles.orgInfoValue}>
                    <a
                      href={organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {organization.website}
                    </a>
                  </span>
                </div>
              </Col>
            )}
            {organization.address && organization.address.trim() && (
              <Col xs={24}>
                <div className={styles.orgInfoItem}>
                  <span className={styles.orgInfoLabel}>Ünvan:</span>
                  <span className={styles.orgInfoValue}>
                    {organization.address}
                  </span>
                </div>
              </Col>
            )}
            {(organization.city ||
              organization.state ||
              organization.country ||
              organization.postal_code) && (
              <Col xs={24}>
                <div className={styles.orgInfoItem}>
                  <span className={styles.orgInfoLabel}>Yer:</span>
                  <span className={styles.orgInfoValue}>
                    {[
                      organization.city,
                      organization.state,
                      organization.country,
                      organization.postal_code,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              </Col>
            )}
            <Col xs={24} sm={12}>
              <div className={styles.orgInfoItem}>
                <span className={styles.orgInfoLabel}>Filial sayı:</span>
                <span className={styles.orgInfoValue}>
                  {organization.branch_count}
                </span>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className={styles.orgInfoItem}>
                <span className={styles.orgInfoLabel}>Ümumi tələbələr:</span>
                <span className={styles.orgInfoValue}>
                  {organization.total_students}
                </span>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className={styles.orgInfoItem}>
                <span className={styles.orgInfoLabel}>Status:</span>
                <span
                  className={
                    organization.is_active
                      ? styles.statusActive
                      : styles.statusInactive
                  }
                >
                  {organization.is_active ? 'Aktiv' : 'Deaktiv'}
                </span>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className={styles.orgInfoItem}>
                <span className={styles.orgInfoLabel}>Yaradılma tarixi:</span>
                <span className={styles.orgInfoValue}>
                  {new Date(organization.created_at).toLocaleDateString(
                    'az-AZ',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </span>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {statistics && (
        <Card title="Statistika" loading={statsLoading}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Filiallar"
                  value={statistics.total_branches || 0}
                  prefix={<ShopOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tələbələr"
                  value={statistics.total_students || 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#667eea' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Müəllimlər"
                  value={statistics.total_teachers || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Kurslar"
                  value={statistics.total_courses || 0}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      )}

      {(orgError || statsError) && !organization && !statistics && (
        <Alert
          message="Məlumat yoxdur"
          description="Təşkilat və ya statistika məlumatları tapılmadı."
          type="info"
          showIcon
        />
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import {
  Card,
  Spin,
  Alert,
  Tag,
  Row,
  Col,
  Avatar,
  Button,
  Form,
  Input,
  DatePicker,
  message,
} from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  useCurrentUserQuery,
  useUpdateProfileMutation,
  useBranchesQuery,
  useOrganizationQuery,
} from '../../api';
import type { UserType, ProfileUpdateRequest } from '../../api';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: user, isLoading, error } = useCurrentUserQuery();
  const updateProfileMutation = useUpdateProfileMutation(messageApi);

  const { data: branches } = useBranchesQuery({
    ...(user?.branches && user.branches.length > 0
      ? { search: user.branches.join(',') }
      : {}),
  });

  const { data: organization } = useOrganizationQuery();

  const userTypeLabels: Record<UserType, string> = {
    NOT_SET: 'Təyin edilməyib',
    STUDENT: 'Tələbə',
    PARENT: 'Valideyn',
    TEACHER: 'Müəllim',
    BRANCH_MANAGER: 'Filial Meneceri',
    BRANCH_ADMIN: 'Filial Admini',
    ORGANIZATION_ADMIN: 'Təşkilat Admini',
  };

  const userTypeColors: Record<UserType, string> = {
    NOT_SET: 'default',
    STUDENT: 'blue',
    PARENT: 'cyan',
    TEACHER: 'green',
    BRANCH_MANAGER: 'orange',
    BRANCH_ADMIN: 'purple',
    ORGANIZATION_ADMIN: 'red',
  };

  const handleEdit = () => {
    form.setFieldsValue({
      first_name: user?.first_name,
      last_name: user?.last_name,
      phone_number: user?.phone_number,
      address: user?.address,
      date_of_birth: user?.date_of_birth ? dayjs(user.date_of_birth) : null,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updateData: ProfileUpdateRequest = {
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number || null,
        address: values.address || null,
        date_of_birth: values.date_of_birth
          ? dayjs(values.date_of_birth).format('YYYY-MM-DD')
          : null,
      };

      await updateProfileMutation.mutateAsync(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Yüklənir..." />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.container}>
        <Alert
          message="Xəta"
          description="İstifadəçi məlumatlarını yükləmək mümkün olmadı"
          type="error"
          showIcon
        />
      </div>
    );
  }

  const isOrganizationAdmin = user.user_type === 'ORGANIZATION_ADMIN';
  const userBranches =
    branches?.filter((b) => user.branches.includes(b.id)) || [];

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.headerContainer}>
        <h1 className={styles.pageTitle}>Mənim Profilim</h1>
        {!isEditing ? (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
            size="large"
          >
            Redaktə et
          </Button>
        ) : (
          <div className={styles.editButtons}>
            <Button onClick={handleCancel} size="large">
              Ləğv et
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={updateProfileMutation.isPending}
              size="large"
            >
              Yadda saxla
            </Button>
          </div>
        )}
      </div>

      <Card className={styles.profileCard}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={6} className={styles.avatarCol}>
            <div className={styles.avatarContainer}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={user.profile_picture}
                className={styles.avatar}
              />
              <h2 className={styles.userName}>{user.full_name}</h2>
              <Tag
                color={userTypeColors[user.user_type]}
                className={styles.userTypeTag}
              >
                {userTypeLabels[user.user_type]}
              </Tag>
              <Tag
                color={user.is_active ? 'success' : 'error'}
                className={styles.statusTag}
              >
                {user.is_active ? 'Aktiv' : 'Deaktiv'}
              </Tag>
            </div>
          </Col>

          <Col xs={24} md={18}>
            {isEditing ? (
              <Form form={form} layout="vertical" className={styles.editForm}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Ad"
                      name="first_name"
                      rules={[{ required: true, message: 'Ad daxil edin' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Soyad"
                      name="last_name"
                      rules={[{ required: true, message: 'Soyad daxil edin' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Telefon" name="phone_number">
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Doğum tarixi" name="date_of_birth">
                      <DatePicker
                        size="large"
                        style={{ width: '100%' }}
                        format="DD.MM.YYYY"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Ünvan" name="address">
                      <Input.TextArea rows={3} size="large" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            ) : (
              <div className={styles.profileInfo}>
                <Row gutter={[16, 24]}>
                  <Col xs={24} sm={12}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Email:</span>
                      <span className={styles.infoValue}>{user.email}</span>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Telefon:</span>
                      <span className={styles.infoValue}>
                        {user.phone_number || '-'}
                      </span>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Doğum tarixi:</span>
                      <span className={styles.infoValue}>
                        {user.date_of_birth
                          ? dayjs(user.date_of_birth).format('DD.MM.YYYY')
                          : '-'}
                      </span>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Təşkilat:</span>
                      <span className={styles.infoValue}>
                        {organization?.name || '-'}
                      </span>
                    </div>
                  </Col>
                  {organization?.code && (
                    <Col xs={24} sm={12}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Təşkilat kodu:</span>
                        <span className={styles.infoValue}>
                          {organization.code}
                        </span>
                      </div>
                    </Col>
                  )}
                  {!isOrganizationAdmin && userBranches.length > 0 && (
                    <Col xs={24}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Filiallar:</span>
                        <div className={styles.branchTags}>
                          {userBranches.map((branch) => (
                            <Tag key={branch.id} color="blue">
                              {branch.name}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </Col>
                  )}
                  <Col xs={24}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Ünvan:</span>
                      <span className={styles.infoValue}>
                        {user.address || '-'}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Card title="Hesab Məlumatları" className={styles.metaCard}>
            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Yaradılma tarixi:</span>
                <span className={styles.metaValue}>
                  {dayjs(user.created_at).format('DD.MM.YYYY HH:mm')}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Yenilənmə tarixi:</span>
                <span className={styles.metaValue}>
                  {dayjs(user.updated_at).format('DD.MM.YYYY HH:mm')}
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;

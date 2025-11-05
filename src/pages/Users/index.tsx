import React, { useState } from 'react';
import {
  Modal,
  Form,
  message,
  Spin,
  Alert,
  Popconfirm,
  Tag,
  Space,
  DatePicker,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import { PageHeader, FilterPanel } from '../../components/custom';

// Configure dayjs plugins for Ant Design DatePicker
dayjs.extend(weekday);
dayjs.extend(localeData);
import {
  Table,
  Input,
  Select,
  Button,
  Checkbox,
} from '../../components/restyled';
import {
  useUsersQuery,
  useCreateUserMutation,
  usePartialUpdateUserMutation,
  useDeleteUserMutation,
  useBranchesQuery,
  type User,
  type UserCreate,
  type UserType,
} from '../../api';
import styles from './Users.module.css';

const Users: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>();
  const [isActiveFilterStr, setIsActiveFilterStr] = useState<
    string | undefined
  >();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // Queries and mutations
  const {
    data: users,
    isLoading,
    error,
  } = useUsersQuery({
    search: searchTerm || undefined,
    is_active: isActiveFilter,
  });

  const { data: branches } = useBranchesQuery({ is_active: true });

  const createMutation = useCreateUserMutation(messageApi);
  const updateMutation = usePartialUpdateUserMutation(messageApi);
  const deleteMutation = useDeleteUserMutation(messageApi);

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue({
      ...record,
      date_of_birth: record.date_of_birth ? dayjs(record.date_of_birth) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        date_of_birth: values.date_of_birth
          ? values.date_of_birth.format('YYYY-MM-DD')
          : null,
      };

      if (editingUser) {
        updateMutation.mutate(
          { id: editingUser.id, data: formData },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
            },
          }
        );
      } else {
        createMutation.mutate(formData as UserCreate, {
          onSuccess: () => {
            setModalVisible(false);
            form.resetFields();
          },
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingUser(null);
  };

  const userTypeLabels: Record<UserType, string> = {
    NOT_SET: 'Təyin edilməyib',
    STUDENT: 'Tələbə',
    TEACHER: 'Müəllim',
    BRANCH_MANAGER: 'Filial Meneceri',
    BRANCH_ADMIN: 'Filial Admini',
    ORGANIZATION_ADMIN: 'Təşkilat Admini',
  };

  const userTypeColors: Record<UserType, string> = {
    NOT_SET: 'default',
    STUDENT: 'blue',
    TEACHER: 'green',
    BRANCH_MANAGER: 'orange',
    BRANCH_ADMIN: 'purple',
    ORGANIZATION_ADMIN: 'red',
  };

  const columns = [
    {
      title: 'Ad Soyad',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a: User, b: User) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Telefon',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (text: string) => text || '-',
    },
    {
      title: 'İstifadəçi tipi',
      dataIndex: 'user_type',
      key: 'user_type',
      render: (type: UserType) => (
        <Tag color={userTypeColors[type]}>{userTypeLabels[type]}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => (
        <Tag color={is_active ? 'success' : 'error'}>
          {is_active ? 'Aktiv' : 'Deaktiv'}
        </Tag>
      ),
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="İstifadəçini silmək istədiyinizdən əminsiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Bəli"
            cancelText="Xeyr"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div className={styles.container}>
        <Alert
          message="Xəta"
          description="İstifadəçiləri yükləmək mümkün olmadı"
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <PageHeader
        title="İstifadəçilər"
        actions={[
          {
            label: 'Yeni İstifadəçi',
            icon: <PlusOutlined />,
            onClick: handleCreate,
            type: 'primary',
          },
        ]}
      />

      <FilterPanel
        filters={{
          search: {
            type: 'input',
            placeholder: 'Axtar...',
            value: searchTerm,
            onChange: (value) => setSearchTerm((value as string) || ''),
          },
          is_active: {
            type: 'select',
            placeholder: 'Status',
            value: isActiveFilterStr,
            onChange: (value) => {
              const strValue = value as string | undefined;
              setIsActiveFilterStr(strValue);
              if (strValue === 'true') setIsActiveFilter(true);
              else if (strValue === 'false') setIsActiveFilter(false);
              else setIsActiveFilter(undefined);
            },
            options: [
              { label: 'Aktiv', value: 'true' },
              { label: 'Deaktiv', value: 'false' },
            ],
          },
        }}
      />

      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" tip="Yüklənir..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Cəmi: ${total}`,
            }}
            scroll={{ x: 1200 }}
          />
        )}
      </div>

      <Modal
        title={editingUser ? 'İstifadəçini Redaktə Et' : 'Yeni İstifadəçi'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yadda saxla"
        cancelText="Ləğv et"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={800}
      >
        <Form form={form} layout="vertical" className={styles.form}>
          <Form.Item
            name="first_name"
            label="Ad"
            rules={[{ required: true, message: 'Ad daxil edin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Soyad"
            rules={[{ required: true, message: 'Soyad daxil edin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email daxil edin' },
              { type: 'email', message: 'Düzgün email daxil edin' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="user_type"
            label="İstifadəçi tipi"
            rules={[{ required: true, message: 'İstifadəçi tipi seçin' }]}
          >
            <Select
              options={[
                { label: 'Təyin edilməyib', value: 'NOT_SET' },
                { label: 'Tələbə', value: 'STUDENT' },
                { label: 'Müəllim', value: 'TEACHER' },
                { label: 'Filial Meneceri', value: 'BRANCH_MANAGER' },
                { label: 'Filial Admini', value: 'BRANCH_ADMIN' },
                { label: 'Təşkilat Admini', value: 'ORGANIZATION_ADMIN' },
              ]}
            />
          </Form.Item>
          <Form.Item name="phone_number" label="Telefon">
            <Input />
          </Form.Item>
          <Form.Item name="date_of_birth" label="Doğum tarixi">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="address" label="Ünvan">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="branches" label="Filiallar">
            <Select
              mode="multiple"
              options={branches?.map((branch) => ({
                label: branch.name,
                value: branch.id,
              }))}
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            name="is_active"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Aktiv</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;

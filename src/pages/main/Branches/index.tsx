import React, { useState } from 'react';
import { Modal, Form, message, Spin, Alert, Popconfirm, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageHeader, FilterPanel } from 'components/custom';
import { Table, Input, Button } from 'components/restyled';
import {
  useBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useCurrentUserQuery,
  type Branch,
  type BranchCreate,
} from 'api';
import { canCreateBranches, canUpdateBranches, canDeleteBranches } from 'utils/permissions';
import styles from './Branches.module.css';

const Branches: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>();
  const [isActiveFilterStr, setIsActiveFilterStr] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [form] = Form.useForm();

  const { data: user } = useCurrentUserQuery();
  const {
    data: branchesResponse,
    isLoading,
    error,
  } = useBranchesQuery({
    search: searchTerm || undefined,
    is_active: isActiveFilter,
    page: currentPage,
    page_size: pageSize,
  });

  const createMutation = useCreateBranchMutation(messageApi);
  const updateMutation = useUpdateBranchMutation(messageApi);
  const deleteMutation = useDeleteBranchMutation(messageApi);

  const handleCreate = () => {
    setEditingBranch(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Branch) => {
    setEditingBranch(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingBranch) {
        updateMutation.mutate(
          { id: editingBranch.id, data: values },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
            },
          }
        );
      } else {
        createMutation.mutate(values as BranchCreate, {
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
    setEditingBranch(null);
  };

  const columns = [
    {
      title: 'Ad',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Branch, b: Branch) => a.name.localeCompare(b.name),
    },
    {
      title: 'Kod',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Şəhər',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Ölkə',
      dataIndex: 'country',
      key: 'country',
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
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => (
        <Tag color={is_active ? 'success' : 'error'}>{is_active ? 'Aktiv' : 'Deaktiv'}</Tag>
      ),
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: unknown, record: Branch) => (
        <Space>
          {canUpdateBranches(user) && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          )}
          {canDeleteBranches(user) && (
            <Popconfirm
              title="Filialı silmək istədiyinizdən əminsiniz?"
              onConfirm={() => handleDelete(record.id)}
              okText="Bəli"
              cancelText="Xeyr"
            >
              <Button type="link" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div className={styles.container}>
        <Alert
          message="Xəta"
          description="Filialları yükləmək mümkün olmadı"
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
        title="Filiallar"
        actions={
          canCreateBranches(user)
            ? [
                {
                  label: 'Yeni Filial',
                  icon: <PlusOutlined />,
                  onClick: handleCreate,
                  type: 'primary',
                },
              ]
            : []
        }
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
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={branchesResponse?.results || []}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: branchesResponse?.count || 0,
              showSizeChanger: true,
              showTotal: (total) => `Cəmi: ${total}`,
              pageSizeOptions: ['10', '20', '50', '100'],
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
            scroll={{ x: 1200 }}
          />
        )}
      </div>

      <Modal
        title={editingBranch ? 'Filialı Redaktə Et' : 'Yeni Filial'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yadda saxla"
        cancelText="Ləğv et"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={800}
      >
        <Form form={form} layout="vertical" className={styles.form}>
          <Form.Item name="name" label="Ad" rules={[{ required: true, message: 'Ad daxil edin' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Kod"
            rules={[{ required: true, message: 'Kod daxil edin' }]}
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
            name="phone_number"
            label="Telefon"
            rules={[{ required: true, message: 'Telefon daxil edin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Ünvan"
            rules={[{ required: true, message: 'Ünvan daxil edin' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="city"
            label="Şəhər"
            rules={[{ required: true, message: 'Şəhər daxil edin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="state" label="Rayon">
            <Input />
          </Form.Item>
          <Form.Item
            name="country"
            label="Ölkə"
            rules={[{ required: true, message: 'Ölkə daxil edin' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="postal_code" label="Poçt kodu">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Branches;

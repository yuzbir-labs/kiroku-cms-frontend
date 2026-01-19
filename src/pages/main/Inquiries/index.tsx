import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Alert, DatePicker, Form, Modal, message, Popconfirm, Space, Spin, Tag } from 'antd';
import { FilterPanel, PageHeader } from 'components/custom';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import type React from 'react';
import { useState } from 'react';

// Configure dayjs plugins for Ant Design DatePicker
dayjs.extend(weekday);
dayjs.extend(localeData);

import {
  type Inquiry,
  type InquiryCreate,
  type InquirySource,
  type InquiryStatus,
  useAssignInquiryMutation,
  useBranchesQuery,
  useConvertInquiryMutation,
  useCreateInquiryMutation,
  useDeleteInquiryMutation,
  useInquiriesQuery,
  usePartialUpdateInquiryMutation,
} from 'api';
import { Button, Input, Select, Table } from 'components/restyled';
import styles from './Inquiries.module.css';

const Inquiries: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | undefined>();
  const [sourceFilter, setSourceFilter] = useState<InquirySource | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [modalVisible, setModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<Inquiry | null>(null);
  const [assigningInquiry, setAssigningInquiry] = useState<Inquiry | null>(null);
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  // Queries and mutations
  const {
    data: inquiriesResponse,
    isLoading,
    error,
  } = useInquiriesQuery({
    search: searchTerm || undefined,
    status: statusFilter,
    source: sourceFilter,
    page: currentPage,
    page_size: pageSize,
  });

  const { data: branches, isLoading: branchesLoading } = useBranchesQuery({
    is_active: true,
    page_size: 100,
  });

  const createMutation = useCreateInquiryMutation(messageApi);
  const updateMutation = usePartialUpdateInquiryMutation(messageApi);
  const deleteMutation = useDeleteInquiryMutation(messageApi);
  const convertMutation = useConvertInquiryMutation(messageApi);
  const assignMutation = useAssignInquiryMutation(messageApi);

  const handleCreate = () => {
    setEditingInquiry(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Inquiry) => {
    setEditingInquiry(record);
    form.setFieldsValue({
      ...record,
      follow_up_date: record.follow_up_date ? dayjs(record.follow_up_date) : null,
      preferred_start_date: record.preferred_start_date ? dayjs(record.preferred_start_date) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleConvert = async (id: number) => {
    convertMutation.mutate({ id });
  };

  const handleAssignClick = (record: Inquiry) => {
    setAssigningInquiry(record);
    assignForm.resetFields();
    setAssignModalVisible(true);
  };

  const handleAssignOk = async () => {
    try {
      const values = await assignForm.validateFields();
      if (assigningInquiry) {
        assignMutation.mutate(
          { id: assigningInquiry.id, data: values },
          {
            onSuccess: () => {
              setAssignModalVisible(false);
              assignForm.resetFields();
              setAssigningInquiry(null);
            },
          }
        );
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        follow_up_date: values.follow_up_date ? values.follow_up_date.format('YYYY-MM-DD') : null,
        preferred_start_date: values.preferred_start_date
          ? values.preferred_start_date.format('YYYY-MM-DD')
          : null,
      };

      if (editingInquiry) {
        updateMutation.mutate(
          { id: editingInquiry.id, data: formData },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
            },
          }
        );
      } else {
        createMutation.mutate(formData as InquiryCreate, {
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
    setEditingInquiry(null);
  };

  const statusLabels: Record<InquiryStatus, string> = {
    NEW: 'Yeni',
    CONTACTED: 'Əlaqə saxlanılıb',
    FOLLOW_UP: 'Təqib ediləcək',
    CONVERTED: 'Tələbəyə çevrilib',
    NOT_INTERESTED: 'Maraqlanmır',
    CLOSED: 'Bağlanıb',
  };

  const statusColors: Record<InquiryStatus, string> = {
    NEW: 'blue',
    CONTACTED: 'cyan',
    FOLLOW_UP: 'orange',
    CONVERTED: 'success',
    NOT_INTERESTED: 'default',
    CLOSED: 'error',
  };

  const sourceLabels: Record<InquirySource, string> = {
    WEBSITE: 'Veb sayt',
    PHONE: 'Telefon',
    EMAIL: 'Email',
    REFERRAL: 'Tövsiyə',
    SOCIAL_MEDIA: 'Sosial media',
    WALK_IN: 'Gəlmə',
    OTHER: 'Digər',
  };

  const columns = [
    {
      title: 'Ad Soyad',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a: Inquiry, b: Inquiry) => a.full_name.localeCompare(b.full_name),
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: InquiryStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Mənbə',
      dataIndex: 'source',
      key: 'source',
      render: (source: InquirySource) => sourceLabels[source],
    },
    {
      title: 'Filial',
      dataIndex: 'branch_name',
      key: 'branch_name',
      render: (text: string) => text || '-',
    },
    {
      title: 'Təyin edilib',
      dataIndex: 'assigned_to_name',
      key: 'assigned_to_name',
      render: (text: string) => text || '-',
    },
    {
      title: 'Günlər',
      dataIndex: 'days_since_inquiry',
      key: 'days_since_inquiry',
      render: (days: string) => `${days} gün`,
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      fixed: 'right' as const,
      width: 200,
      render: (_: unknown, record: Inquiry) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Button
            type="link"
            icon={<UserSwitchOutlined />}
            onClick={() => handleAssignClick(record)}
            size="small"
            title="Təyin et"
          />
          {record.status !== 'CONVERTED' && (
            <Popconfirm
              title="Sorğunu tələbəyə çevirmək istədiyinizdən əminsiniz?"
              onConfirm={() => handleConvert(record.id)}
              okText="Bəli"
              cancelText="Xeyr"
            >
              <Button type="link" icon={<UserAddOutlined />} size="small" title="Tələbəyə çevir" />
            </Popconfirm>
          )}
          <Popconfirm
            title="Sorğunu silmək istədiyinizdən əminsiniz?"
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
          description="Sorğuları yükləmək mümkün olmadı"
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
        title="Sorğular"
        actions={[
          {
            label: 'Yeni Sorğu',
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
            onChange: (value) => {
              setSearchTerm((value as string) || '');
              setCurrentPage(1); // Reset to first page when search changes
            },
          },
          status: {
            type: 'select',
            placeholder: 'Status',
            value: statusFilter,
            onChange: (value) => {
              setStatusFilter(value as InquiryStatus | undefined);
              setCurrentPage(1); // Reset to first page when filter changes
            },
            options: [
              { label: 'Yeni', value: 'NEW' },
              { label: 'Əlaqə saxlanılıb', value: 'CONTACTED' },
              { label: 'Təqib ediləcək', value: 'FOLLOW_UP' },
              { label: 'Tələbəyə çevrilib', value: 'CONVERTED' },
              { label: 'Maraqlanmır', value: 'NOT_INTERESTED' },
              { label: 'Bağlanıb', value: 'CLOSED' },
            ],
          },
          source: {
            type: 'select',
            placeholder: 'Mənbə',
            value: sourceFilter,
            onChange: (value) => {
              setSourceFilter(value as InquirySource | undefined);
              setCurrentPage(1); // Reset to first page when filter changes
            },
            options: [
              { label: 'Veb sayt', value: 'WEBSITE' },
              { label: 'Telefon', value: 'PHONE' },
              { label: 'Email', value: 'EMAIL' },
              { label: 'Tövsiyə', value: 'REFERRAL' },
              { label: 'Sosial media', value: 'SOCIAL_MEDIA' },
              { label: 'Gəlmə', value: 'WALK_IN' },
              { label: 'Digər', value: 'OTHER' },
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
            dataSource={inquiriesResponse?.results || []}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: inquiriesResponse?.count || 0,
              showSizeChanger: true,
              showTotal: (total) => `Cəmi: ${total}`,
              pageSizeOptions: ['10', '20', '50', '100'],
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
            scroll={{ x: 1600 }}
          />
        )}
      </div>

      <Modal
        title={editingInquiry ? 'Sorğunu Redaktə Et' : 'Yeni Sorğu'}
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
          <Form.Item name="phone_number" label="Telefon">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Ünvan">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="branch"
            label="Filial"
            rules={[{ required: true, message: 'Filial seçin' }]}
          >
            <Select
              placeholder="Filial seçin"
              loading={branchesLoading}
              options={branches?.results?.map((branch) => ({
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
          <Form.Item name="source" label="Mənbə" initialValue="WEBSITE">
            <Select
              options={[
                { label: 'Veb sayt', value: 'WEBSITE' },
                { label: 'Telefon', value: 'PHONE' },
                { label: 'Email', value: 'EMAIL' },
                { label: 'Tövsiyə', value: 'REFERRAL' },
                { label: 'Sosial media', value: 'SOCIAL_MEDIA' },
                { label: 'Gəlmə', value: 'WALK_IN' },
                { label: 'Digər', value: 'OTHER' },
              ]}
            />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="NEW">
            <Select
              options={[
                { label: 'Yeni', value: 'NEW' },
                { label: 'Əlaqə saxlanılıb', value: 'CONTACTED' },
                { label: 'Təqib ediləcək', value: 'FOLLOW_UP' },
                { label: 'Maraqlanmır', value: 'NOT_INTERESTED' },
                { label: 'Bağlanıb', value: 'CLOSED' },
              ]}
            />
          </Form.Item>
          <Form.Item name="follow_up_date" label="Təqib tarixi">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="preferred_start_date" label="Tərcih edilən başlama tarixi">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="budget" label="Büdcə (aylıq)">
            <Input type="number" step="0.01" min={0} />
          </Form.Item>
          <Form.Item name="notes" label="Qeydlər">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Sorğunu Təyin Et"
        open={assignModalVisible}
        onOk={handleAssignOk}
        onCancel={() => {
          setAssignModalVisible(false);
          assignForm.resetFields();
          setAssigningInquiry(null);
        }}
        okText="Təyin et"
        cancelText="Ləğv et"
        confirmLoading={assignMutation.isPending}
      >
        <Form form={assignForm} layout="vertical" className={styles.form}>
          <Form.Item
            name="assigned_to"
            label="İşçi"
            rules={[{ required: true, message: 'İşçi seçin' }]}
          >
            <Input type="number" placeholder="İşçi ID daxil edin" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Inquiries;

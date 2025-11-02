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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { PageHeader, FilterPanel } from '../../components/custom';
import { Table, Input, Select, Button } from '../../components/restyled';
import {
  useEnrollmentsQuery,
  useCreateEnrollmentMutation,
  usePartialUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useCompleteEnrollmentMutation,
  useDropEnrollmentMutation,
  type Enrollment,
  type EnrollmentCreate,
  type EnrollmentStatus,
} from '../../api';
import styles from './Enrollments.module.css';

const Enrollments: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    EnrollmentStatus | undefined
  >();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(
    null
  );
  const [form] = Form.useForm();

  // Queries and mutations
  const {
    data: enrollments,
    isLoading,
    error,
  } = useEnrollmentsQuery({
    search: searchTerm || undefined,
    status: statusFilter,
  });

  const createMutation = useCreateEnrollmentMutation(messageApi);
  const updateMutation = usePartialUpdateEnrollmentMutation(messageApi);
  const deleteMutation = useDeleteEnrollmentMutation(messageApi);
  const completeMutation = useCompleteEnrollmentMutation(messageApi);
  const dropMutation = useDropEnrollmentMutation(messageApi);

  const handleCreate = () => {
    setEditingEnrollment(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Enrollment) => {
    setEditingEnrollment(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleComplete = async (id: number) => {
    completeMutation.mutate(id);
  };

  const handleDrop = async (id: number) => {
    dropMutation.mutate(id);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingEnrollment) {
        updateMutation.mutate(
          { id: editingEnrollment.id, data: values },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
            },
          }
        );
      } else {
        createMutation.mutate(values as EnrollmentCreate, {
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
    setEditingEnrollment(null);
  };

  const statusLabels: Record<EnrollmentStatus, string> = {
    PENDING: 'Gözləyir',
    ACTIVE: 'Aktiv',
    COMPLETED: 'Tamamlanıb',
    DROPPED: 'Ləğv edilib',
    SUSPENDED: 'Dayandırılıb',
  };

  const statusColors: Record<EnrollmentStatus, string> = {
    PENDING: 'default',
    ACTIVE: 'success',
    COMPLETED: 'blue',
    DROPPED: 'error',
    SUSPENDED: 'warning',
  };

  const columns = [
    {
      title: 'Tələbə',
      dataIndex: 'student_name',
      key: 'student_name',
      sorter: (a: Enrollment, b: Enrollment) =>
        a.student_name.localeCompare(b.student_name),
    },
    {
      title: 'Kurs',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Qrup',
      dataIndex: 'course_group_name',
      key: 'course_group_name',
    },
    {
      title: 'Müəllim',
      dataIndex: 'teacher_name',
      key: 'teacher_name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: EnrollmentStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Aylıq qiymət',
      dataIndex: 'monthly_price',
      key: 'monthly_price',
      render: (price: string) => `${price} AZN`,
    },
    {
      title: 'Davamiyyət %',
      dataIndex: 'attendance_percentage',
      key: 'attendance_percentage',
      render: (percentage: string) => (percentage ? `${percentage}%` : '-'),
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      fixed: 'right' as const,
      width: 200,
      render: (_: unknown, record: Enrollment) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          {record.status === 'ACTIVE' && (
            <>
              <Popconfirm
                title="Qeydiyyatı tamamlamaq istədiyinizdən əminsiniz?"
                onConfirm={() => handleComplete(record.id)}
                okText="Bəli"
                cancelText="Xeyr"
              >
                <Button
                  type="link"
                  icon={<CheckCircleOutlined />}
                  size="small"
                  title="Tamamla"
                />
              </Popconfirm>
              <Popconfirm
                title="Qeydiyyatı ləğv etmək istədiyinizdən əminsiniz?"
                onConfirm={() => handleDrop(record.id)}
                okText="Bəli"
                cancelText="Xeyr"
              >
                <Button
                  type="link"
                  danger
                  icon={<CloseCircleOutlined />}
                  size="small"
                  title="Ləğv et"
                />
              </Popconfirm>
            </>
          )}
          <Popconfirm
            title="Qeydiyyatı silmək istədiyinizdən əminsiniz?"
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
          description="Qeydiyyatları yükləmək mümkün olmadı"
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
        title="Qeydiyyatlar"
        actions={[
          {
            label: 'Yeni Qeydiyyat',
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
            placeholder: 'Tələbə axtar...',
            value: searchTerm,
            onChange: setSearchTerm,
          },
          status: {
            type: 'select',
            placeholder: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'Gözləyir', value: 'PENDING' },
              { label: 'Aktiv', value: 'ACTIVE' },
              { label: 'Tamamlanıb', value: 'COMPLETED' },
              { label: 'Ləğv edilib', value: 'DROPPED' },
              { label: 'Dayandırılıb', value: 'SUSPENDED' },
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
            dataSource={enrollments}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Cəmi: ${total}`,
            }}
            scroll={{ x: 1400 }}
          />
        )}
      </div>

      <Modal
        title={editingEnrollment ? 'Qeydiyyatı Redaktə Et' : 'Yeni Qeydiyyat'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yadda saxla"
        cancelText="Ləğv et"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form form={form} layout="vertical" className={styles.form}>
          {!editingEnrollment && (
            <>
              <Form.Item
                name="student"
                label="Tələbə ID"
                rules={[{ required: true, message: 'Tələbə ID daxil edin' }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="course_group"
                label="Qrup ID"
                rules={[{ required: true, message: 'Qrup ID daxil edin' }]}
                tooltip="Qrup seçmək üçün qrup ID-ni daxil edin. Qrup məlumatlarını Kurslar səhifəsindən əldə edə bilərsiniz."
              >
                <Input type="number" placeholder="Qrup ID daxil edin" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="monthly_price"
            label="Aylıq qiymət"
            rules={[{ required: true, message: 'Aylıq qiymət daxil edin' }]}
          >
            <Input type="number" step="0.01" min={0} />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="PENDING">
            <Select
              options={[
                { label: 'Gözləyir', value: 'PENDING' },
                { label: 'Aktiv', value: 'ACTIVE' },
                { label: 'Tamamlanıb', value: 'COMPLETED' },
                { label: 'Ləğv edilib', value: 'DROPPED' },
                { label: 'Dayandırılıb', value: 'SUSPENDED' },
              ]}
            />
          </Form.Item>
          <Form.Item name="grade" label="Qiymət">
            <Input />
          </Form.Item>
          <Form.Item name="notes" label="Qeydlər">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Enrollments;

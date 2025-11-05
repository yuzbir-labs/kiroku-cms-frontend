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
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import { PageHeader, FilterPanel } from '../../components/custom';

// Configure dayjs plugins for Ant Design DatePicker
dayjs.extend(weekday);
dayjs.extend(localeData);
import { Table, Input, Select, Button } from '../../components/restyled';
import {
  useEnrollmentsQuery,
  useCreateEnrollmentMutation,
  usePartialUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useCompleteEnrollmentMutation,
  useDropEnrollmentMutation,
  useUsersQuery,
  useActiveUpcomingCourseGroupsQuery,
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
  const [studentFilter, setStudentFilter] = useState<number | undefined>();
  const [courseGroupFilter, setCourseGroupFilter] = useState<
    number | undefined
  >();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] =
    useState<EnrollmentStatus>('PENDING');
  const [form] = Form.useForm();

  // Queries and mutations
  const {
    data: enrollments,
    isLoading,
    error,
  } = useEnrollmentsQuery({
    search: searchTerm || undefined,
    status: statusFilter,
    student: studentFilter,
    course_group: courseGroupFilter,
  });

  const { data: students } = useUsersQuery({ user_type: 'STUDENT' });
  const { data: courseGroups } = useActiveUpcomingCourseGroupsQuery();

  const createMutation = useCreateEnrollmentMutation(messageApi);
  const updateMutation = usePartialUpdateEnrollmentMutation(messageApi);
  const deleteMutation = useDeleteEnrollmentMutation(messageApi);
  const completeMutation = useCompleteEnrollmentMutation(messageApi);
  const dropMutation = useDropEnrollmentMutation(messageApi);

  const handleCreate = () => {
    setEditingEnrollment(null);
    setSelectedStatus('PENDING');
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Enrollment) => {
    setEditingEnrollment(record);
    setSelectedStatus(record.status);
    form.setFieldsValue({
      ...record,
      enrollment_date: record.enrollment_date
        ? dayjs(record.enrollment_date)
        : undefined,
      completion_date: record.completion_date
        ? dayjs(record.completion_date)
        : undefined,
    });
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

      // Get the selected group to populate monthly_price if creating
      if (!editingEnrollment && values.course_group) {
        const selectedGroup = courseGroups?.find(
          (g) => g.id === values.course_group
        );
        if (selectedGroup && !values.monthly_price) {
          values.monthly_price = selectedGroup.monthly_price;
        }
      }

      // Format dates if they exist
      const payload = {
        ...values,
        enrollment_date: values.enrollment_date
          ? dayjs(values.enrollment_date).format('YYYY-MM-DD')
          : undefined,
        completion_date: values.completion_date
          ? dayjs(values.completion_date).format('YYYY-MM-DD')
          : undefined,
      };

      if (editingEnrollment) {
        updateMutation.mutate(
          { id: editingEnrollment.id, data: payload },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
              setSelectedStatus('PENDING');
            },
          }
        );
      } else {
        createMutation.mutate(payload as EnrollmentCreate, {
          onSuccess: () => {
            setModalVisible(false);
            form.resetFields();
            setSelectedStatus('PENDING');
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
    setSelectedStatus('PENDING');
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
      title: 'Qeydiyyat tarixi',
      dataIndex: 'enrollment_date',
      key: 'enrollment_date',
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString('az-AZ') : '-',
    },
    {
      title: 'Tamamlanma tarixi',
      dataIndex: 'completion_date',
      key: 'completion_date',
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString('az-AZ') : '-',
    },
    {
      title: 'Qeydlər',
      dataIndex: 'notes',
      key: 'notes',
      width: 150,
      render: (notes: string) => (
        <div
          style={{
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {notes || '-'}
        </div>
      ),
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
            placeholder: 'Tələbə, kurs və ya qrup axtar...',
            value: searchTerm,
            onChange: (value) => setSearchTerm((value as string) || ''),
          },
          student: {
            type: 'select',
            placeholder: 'Tələbə',
            value: studentFilter,
            onChange: (value) => setStudentFilter(value as number | undefined),
            options: students?.map((s) => ({
              label: s.full_name,
              value: s.id,
            })),
            allowClear: true,
            showSearch: true,
          },
          courseGroup: {
            type: 'select',
            placeholder: 'Qrup',
            value: courseGroupFilter,
            onChange: (value) =>
              setCourseGroupFilter(value as number | undefined),
            options: courseGroups?.map((g) => ({
              label: `${g.course_name} - ${g.name}`,
              value: g.id,
            })),
            allowClear: true,
            showSearch: true,
          },
          status: {
            type: 'select',
            placeholder: 'Status',
            value: statusFilter,
            onChange: (value) =>
              setStatusFilter(value as EnrollmentStatus | undefined),
            options: [
              { label: 'Gözləyir', value: 'PENDING' },
              { label: 'Aktiv', value: 'ACTIVE' },
              { label: 'Tamamlanıb', value: 'COMPLETED' },
              { label: 'Ləğv edilib', value: 'DROPPED' },
              { label: 'Dayandırılıb', value: 'SUSPENDED' },
            ],
            allowClear: true,
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
            scroll={{ x: 1750 }}
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
                label="Tələbə"
                rules={[{ required: true, message: 'Tələbə seçin' }]}
              >
                <Select
                  showSearch
                  placeholder="Tələbə seçin"
                  optionFilterProp="label"
                  options={students?.map((s) => ({
                    label: `${s.full_name} (${s.email})`,
                    value: s.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="course_group"
                label="Kurs Qrupu"
                rules={[{ required: true, message: 'Qrup seçin' }]}
                tooltip="Yalnız ACTIVE və ya UPCOMING statuslu qruplar göstərilir"
              >
                <Select
                  showSearch
                  placeholder="Qrup seçin"
                  optionFilterProp="label"
                  options={courseGroups?.map((g) => ({
                    label: `${g.course_name} - ${g.name} (${g.branch_name})`,
                    value: g.id,
                  }))}
                  onChange={(value) => {
                    const selectedGroup = courseGroups?.find(
                      (g) => g.id === value
                    );
                    if (selectedGroup) {
                      form.setFieldValue(
                        'monthly_price',
                        selectedGroup.monthly_price
                      );
                    }
                  }}
                />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="monthly_price"
            label="Aylıq qiymət (AZN)"
            rules={[{ required: true, message: 'Aylıq qiymət daxil edin' }]}
          >
            <Input type="number" step="0.01" min={0} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="PENDING"
            rules={[{ required: true, message: 'Status seçin' }]}
          >
            <Select
              onChange={(value) => setSelectedStatus(value as EnrollmentStatus)}
              options={[
                { label: 'Gözləyir', value: 'PENDING' },
                { label: 'Aktiv', value: 'ACTIVE' },
                { label: 'Tamamlanıb', value: 'COMPLETED' },
                { label: 'Ləğv edilib', value: 'DROPPED' },
                { label: 'Dayandırılıb', value: 'SUSPENDED' },
              ]}
            />
          </Form.Item>

          {selectedStatus === 'ACTIVE' && (
            <Form.Item
              name="enrollment_date"
              label="Qeydiyyat tarixi"
              rules={[{ required: true, message: 'Qeydiyyat tarixi seçin' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD.MM.YYYY"
                placeholder="Tarix seçin"
              />
            </Form.Item>
          )}

          {(selectedStatus === 'COMPLETED' ||
            selectedStatus === 'DROPPED' ||
            selectedStatus === 'SUSPENDED') && (
            <>
              <Form.Item
                name="enrollment_date"
                label="Qeydiyyat tarixi"
                rules={[{ required: true, message: 'Qeydiyyat tarixi seçin' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD.MM.YYYY"
                  placeholder="Tarix seçin"
                />
              </Form.Item>
              <Form.Item
                name="completion_date"
                label="Tamamlanma tarixi"
                rules={[{ required: true, message: 'Tamamlanma tarixi seçin' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD.MM.YYYY"
                  placeholder="Tarix seçin"
                />
              </Form.Item>
            </>
          )}

          <Form.Item name="notes" label="Qeydlər">
            <Input.TextArea rows={3} placeholder="İstəyə bağlı qeydlər..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Enrollments;

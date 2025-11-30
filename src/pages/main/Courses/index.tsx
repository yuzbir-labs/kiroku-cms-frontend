import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, message, Spin, Alert, Popconfirm, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageHeader, FilterPanel } from 'components/custom';
import { Table, Input, Select, Button } from 'components/restyled';
import {
  useCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useCurrentUserQuery,
  type Course,
  type CourseCreate,
  type CourseLevel,
  type CourseStatus,
} from 'api';
import {
  canCreateCourses,
  canUpdateCourses,
  canDeleteCourses,
  canViewCourseGroups,
} from 'utils/permissions';
import styles from './Courses.module.css';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseStatus | undefined>();
  const [levelFilter, setLevelFilter] = useState<CourseLevel | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();

  const { data: user } = useCurrentUserQuery();

  // Queries and mutations
  const {
    data: courses,
    isLoading,
    error,
  } = useCoursesQuery({
    search: searchTerm || undefined,
    status: statusFilter,
    level: levelFilter,
  });

  const createMutation = useCreateCourseMutation(messageApi);
  const updateMutation = useUpdateCourseMutation(messageApi);
  const deleteMutation = useDeleteCourseMutation(messageApi);

  const handleCreate = () => {
    setEditingCourse(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Course) => {
    setEditingCourse(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCourse) {
        updateMutation.mutate(
          { id: editingCourse.id, data: values },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
            },
          }
        );
      } else {
        createMutation.mutate(values as CourseCreate, {
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
    setEditingCourse(null);
  };

  const handleRowClick = (record: Course) => {
    // Organization Admin, Branch Admin, and Branch Manager can view course groups
    if (canViewCourseGroups(user)) {
      navigate(`/courses/${record.id}/groups`);
    }
  };

  const levelLabels: Record<CourseLevel, string> = {
    BEGINNER: 'Başlanğıc',
    INTERMEDIATE: 'Orta',
    ADVANCED: 'İrəliləmiş',
    EXPERT: 'Expert',
  };

  const statusLabels: Record<CourseStatus, string> = {
    DRAFT: 'Qaralama',
    PUBLISHED: 'Dərc edilib',
    ARCHIVED: 'Arxivləşdirilib',
  };

  const statusColors: Record<CourseStatus, string> = {
    DRAFT: 'default',
    PUBLISHED: 'success',
    ARCHIVED: 'warning',
  };

  const baseColumns = [
    {
      title: 'Ad',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Course, b: Course) => a.name.localeCompare(b.name),
    },
    {
      title: 'Kod',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Səviyyə',
      dataIndex: 'level',
      key: 'level',
      render: (level: CourseLevel) => levelLabels[level],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: CourseStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Müddət (saat)',
      dataIndex: 'duration_hours',
      key: 'duration_hours',
      sorter: (a: Course, b: Course) => a.duration_hours - b.duration_hours,
    },
  ];

  // Conditionally add Groups and Actions columns for admins/managers
  const columns = canCreateCourses(user)
    ? [
        ...baseColumns,
        {
          title: 'Qruplar',
          dataIndex: 'groups_count',
          key: 'groups_count',
        },
        {
          title: 'Əməliyyatlar',
          key: 'actions',
          fixed: 'right' as const,
          width: 150,
          render: (_: unknown, record: Course) => (
            <Space>
              {canUpdateCourses(user) && (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                  size="small"
                />
              )}
              {canDeleteCourses(user) && (
                <Popconfirm
                  title="Kursu silmək istədiyinizdən əminsiniz?"
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
      ]
    : baseColumns;

  if (error) {
    return (
      <div className={styles.container}>
        <Alert message="Xəta" description="Kursları yükləmək mümkün olmadı" type="error" showIcon />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <PageHeader
        title="Kurslar"
        actions={
          canCreateCourses(user)
            ? [
                {
                  label: 'Yeni Kurs',
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
          level: {
            type: 'select',
            placeholder: 'Səviyyə',
            value: levelFilter,
            onChange: (value) => setLevelFilter(value as CourseLevel | undefined),
            options: [
              { label: 'Başlanğıc', value: 'BEGINNER' },
              { label: 'Orta', value: 'INTERMEDIATE' },
              { label: 'İrəliləmiş', value: 'ADVANCED' },
              { label: 'Expert', value: 'EXPERT' },
            ],
          },
          ...(canCreateCourses(user)
            ? {
                status: {
                  type: 'select' as const,
                  placeholder: 'Status',
                  value: statusFilter,
                  onChange: (value: string | number | boolean | undefined) =>
                    setStatusFilter(value as CourseStatus | undefined),
                  options: [
                    { label: 'Qaralama', value: 'DRAFT' },
                    { label: 'Dərc edilib', value: 'PUBLISHED' },
                    { label: 'Arxivləşdirilib', value: 'ARCHIVED' },
                  ],
                },
              }
            : {}),
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
            dataSource={courses || []}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Cəmi: ${total}`,
            }}
            scroll={{ x: 1000 }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: canViewCourseGroups(user) ? { cursor: 'pointer' } : {},
            })}
          />
        )}
      </div>

      <Modal
        title={editingCourse ? 'Kursu Redaktə Et' : 'Yeni Kurs'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yadda saxla"
        cancelText="Ləğv et"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
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
            name="description"
            label="Təsvir"
            rules={[{ required: true, message: 'Təsvir daxil edin' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="level"
            label="Səviyyə"
            rules={[{ required: true, message: 'Səviyyə seçin' }]}
          >
            <Select
              options={[
                { label: 'Başlanğıc', value: 'BEGINNER' },
                { label: 'Orta', value: 'INTERMEDIATE' },
                { label: 'İrəliləmiş', value: 'ADVANCED' },
                { label: 'Expert', value: 'EXPERT' },
              ]}
            />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="DRAFT">
            <Select
              options={[
                { label: 'Qaralama', value: 'DRAFT' },
                { label: 'Dərc edilib', value: 'PUBLISHED' },
                { label: 'Arxivləşdirilib', value: 'ARCHIVED' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="duration_hours"
            label="Müddət (saat)"
            rules={[{ required: true, message: 'Müddət daxil edin' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Courses;

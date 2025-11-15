import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  TimePicker,
  Button as AntButton,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  MinusCircleOutlined,
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
  useCourseGroupsByCourseQuery,
  useCourseQuery,
  useCreateCourseGroupMutation,
  useUpdateCourseGroupMutation,
  useDeleteCourseGroupMutation,
  useUsersQuery,
  useCurrentUserQuery,
  useBranchesQuery,
  type CourseGroup,
  type CourseGroupCreate,
  type CourseGroupStatus,
  type DayOfWeek,
  type CourseGroupSchedule,
} from '../../api';
import { canManageCourseGroups } from '../../utils/permissions';
import styles from './CourseGroups.module.css';

const CourseGroups: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseGroupStatus | undefined>();
  const [branchFilter, setBranchFilter] = useState<number | undefined>();
  const [teacherFilter, setTeacherFilter] = useState<number[] | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CourseGroup | null>(null);
  const [form] = Form.useForm();

  const { data: user } = useCurrentUserQuery();
  const { data: course, isLoading: courseLoading } = useCourseQuery(Number(courseId));

  // Build query params
  const queryParams = {
    search: searchTerm || undefined,
    status: statusFilter,
    branch: branchFilter,
    teacher_ids: teacherFilter?.join(','),
  };

  // Queries and mutations
  const {
    data: groups,
    isLoading,
    error,
  } = useCourseGroupsByCourseQuery(Number(courseId), queryParams);

  const { data: teachers } = useUsersQuery({ user_type: 'TEACHER' });
  const { data: branches } = useBranchesQuery();

  const createMutation = useCreateCourseGroupMutation(messageApi);
  const updateMutation = useUpdateCourseGroupMutation(messageApi);
  const deleteMutation = useDeleteCourseGroupMutation(messageApi);

  const handleCreate = () => {
    setEditingGroup(null);
    form.resetFields();
    form.setFieldValue('schedule', [{}]);
    setModalVisible(true);
  };

  const handleEdit = (record: CourseGroup) => {
    setEditingGroup(record);
    const formValues = {
      ...record,
      teacher: record.teacher.map((t) => t.id), // Extract teacher IDs
      start_date: dayjs(record.start_date),
      end_date: dayjs(record.end_date),
      schedule: record.schedule.map((s) => ({
        day: s.day,
        start_time: dayjs(`2000-01-01 ${s.start_time}`),
        end_time: dayjs(`2000-01-01 ${s.end_time}`),
      })),
    };
    form.setFieldsValue(formValues);
    setModalVisible(true);
  };

  const handleDelete = async (groupId: number) => {
    deleteMutation.mutate({ courseId: Number(courseId), groupId });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const scheduleData: CourseGroupSchedule[] = values.schedule.map(
        (s: { day: DayOfWeek; start_time: dayjs.Dayjs; end_time: dayjs.Dayjs }) => ({
          day: s.day,
          start_time: s.start_time.format('HH:mm'),
          end_time: s.end_time.format('HH:mm'),
        })
      );

      const payload = {
        ...values,
        teacher_ids: values.teacher, // Rename teacher to teacher_ids
        teacher: undefined, // Remove teacher field
        start_date: values.start_date.format('YYYY-MM-DD'),
        end_date: values.end_date.format('YYYY-MM-DD'),
        schedule: scheduleData,
      };

      if (editingGroup) {
        updateMutation.mutate(
          {
            courseId: Number(courseId),
            groupId: editingGroup.id,
            data: payload,
          },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
            },
          }
        );
      } else {
        createMutation.mutate(
          { courseId: Number(courseId), data: payload as CourseGroupCreate },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
            },
          }
        );
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingGroup(null);
  };

  const statusLabels: Record<CourseGroupStatus, string> = {
    UPCOMING: 'Gələcək',
    ACTIVE: 'Aktiv',
    COMPLETED: 'Tamamlanıb',
    CANCELLED: 'Ləğv edilib',
  };

  const statusColors: Record<CourseGroupStatus, string> = {
    UPCOMING: 'default',
    ACTIVE: 'success',
    COMPLETED: 'blue',
    CANCELLED: 'error',
  };

  const dayLabels: Record<DayOfWeek, string> = {
    MONDAY: 'Bazar ertəsi',
    TUESDAY: 'Çərşənbə axşamı',
    WEDNESDAY: 'Çərşənbə',
    THURSDAY: 'Cümə axşamı',
    FRIDAY: 'Cümə',
    SATURDAY: 'Şənbə',
    SUNDAY: 'Bazar',
  };

  const columns = [
    {
      title: 'Ad',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kod',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Filial',
      dataIndex: 'branch_name',
      key: 'branch_name',
    },
    {
      title: 'Müəllim',
      key: 'teacher',
      render: (_: unknown, record: CourseGroup) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {record.teacher.map((t) => (
            <Tag key={t.id} color="blue">
              {t.full_name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: CourseGroupStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Cədvəl',
      key: 'schedule',
      render: (_: unknown, record: CourseGroup) => (
        <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
          {record.schedule.map((s, idx) => (
            <div key={idx}>
              <strong>{dayLabels[s.day]}:</strong> {s.start_time}-{s.end_time}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Tələbələr',
      key: 'students',
      render: (_: unknown, record: CourseGroup) => (
        <span>
          {record.enrolled_count} / {record.max_students}
          {record.is_full && <Tag color="red">Dolu</Tag>}
        </span>
      ),
    },
    {
      title: 'Aylıq qiymət',
      dataIndex: 'monthly_price',
      key: 'monthly_price',
      render: (price: string) => `${price} AZN`,
    },
    ...(canManageCourseGroups(user)
      ? [
          {
            title: 'Əməliyyatlar',
            key: 'actions',
            fixed: 'right' as const,
            width: 150,
            render: (_: unknown, record: CourseGroup) => (
              <Space>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                  size="small"
                />
                <Popconfirm
                  title="Qrupu silmək istədiyinizdən əminsiniz?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Bəli"
                  cancelText="Xeyr"
                >
                  <Button type="link" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : []),
  ];

  if (error) {
    return (
      <div className={styles.container}>
        <Alert message="Xəta" description="Qrupları yükləmək mümkün olmadı" type="error" showIcon />
      </div>
    );
  }

  if (courseLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Yüklənir..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <PageHeader
        title={`${course?.name || 'Kurs'} - Qruplar`}
        actions={[
          {
            label: 'Geri',
            icon: <ArrowLeftOutlined />,
            onClick: () => navigate('/courses'),
            type: 'default',
          },
          ...(canManageCourseGroups(user)
            ? [
                {
                  label: 'Yeni Qrup',
                  icon: <PlusOutlined />,
                  onClick: handleCreate,
                  type: 'primary' as const,
                },
              ]
            : []),
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
          status: {
            type: 'select',
            placeholder: 'Status',
            value: statusFilter,
            onChange: (value) => setStatusFilter(value as CourseGroupStatus | undefined),
            options: [
              { label: 'Gələcək', value: 'UPCOMING' },
              { label: 'Aktiv', value: 'ACTIVE' },
              { label: 'Tamamlanıb', value: 'COMPLETED' },
              { label: 'Ləğv edilib', value: 'CANCELLED' },
            ],
            allowClear: true,
          },
          branch: {
            type: 'select',
            placeholder: 'Filial',
            value: branchFilter,
            onChange: (value) => setBranchFilter(value as number | undefined),
            options: branches?.map((b) => ({
              label: b.name,
              value: b.id,
            })),
            allowClear: true,
          },
          teacher: {
            type: 'select',
            placeholder: 'Müəllim',
            value: teacherFilter,
            onChange: (value) => setTeacherFilter(value as number[] | undefined),
            options: teachers?.map((t) => ({
              label: t.full_name,
              value: t.id,
            })),
            mode: 'multiple',
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
            dataSource={groups}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Cəmi: ${total}`,
            }}
            scroll={{ x: 1400 }}
            onRow={(record) => ({
              onClick: (event) => {
                // Don't navigate if clicking on action buttons
                const target = event.target as HTMLElement;
                if (!target.closest('button') && !target.closest('.ant-popover')) {
                  navigate(`/groups/${record.id}`);
                }
              },
              style: { cursor: 'pointer' },
            })}
          />
        )}
      </div>

      <Modal
        title={editingGroup ? 'Qrupu Redaktə Et' : 'Yeni Qrup'}
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
            name="branch"
            label="Filial"
            rules={[{ required: true, message: 'Filial seçin' }]}
          >
            <Select
              options={branches?.map((b) => ({
                label: b.name,
                value: b.id,
              }))}
              placeholder="Filial seçin"
            />
          </Form.Item>
          <Form.Item
            name="teacher"
            label="Müəllim"
            rules={[{ required: true, message: 'Ən azı bir müəllim seçin' }]}
          >
            <Select
              mode="multiple"
              options={teachers?.map((t) => ({
                label: t.full_name,
                value: t.id,
              }))}
              placeholder="Müəllim seçin"
            />
          </Form.Item>
          <Form.Item
            name="max_students"
            label="Maksimum tələbə sayı"
            rules={[{ required: true, message: 'Maksimum tələbə sayı daxil edin' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="monthly_price"
            label="Aylıq qiymət (AZN)"
            rules={[{ required: true, message: 'Aylıq qiymət daxil edin' }]}
          >
            <Input type="number" step="0.01" min={0} />
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Başlama tarixi"
            rules={[{ required: true, message: 'Başlama tarixi seçin' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="Bitmə tarixi"
            rules={[{ required: true, message: 'Bitmə tarixi seçin' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="UPCOMING">
            <Select
              options={[
                { label: 'Gələcək', value: 'UPCOMING' },
                { label: 'Aktiv', value: 'ACTIVE' },
                { label: 'Tamamlanıb', value: 'COMPLETED' },
                { label: 'Ləğv edilib', value: 'CANCELLED' },
              ]}
            />
          </Form.Item>

          <Form.List name="schedule">
            {(fields, { add, remove }) => (
              <>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>Cədvəl</div>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'day']}
                      rules={[{ required: true, message: 'Gün seçin' }]}
                    >
                      <Select
                        placeholder="Gün"
                        style={{ width: 150 }}
                        options={Object.entries(dayLabels).map(([value, label]) => ({
                          label,
                          value,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'start_time']}
                      rules={[{ required: true, message: 'Başlama vaxtı' }]}
                    >
                      <TimePicker format="HH:mm" placeholder="Başlama" style={{ width: 120 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'end_time']}
                      rules={[{ required: true, message: 'Bitmə vaxtı' }]}
                    >
                      <TimePicker format="HH:mm" placeholder="Bitmə" style={{ width: 120 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <AntButton type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Cədvəl əlavə et
                  </AntButton>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item name="notes" label="Qeydlər">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseGroups;

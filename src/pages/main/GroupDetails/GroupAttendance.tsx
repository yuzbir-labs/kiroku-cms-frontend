import { useState } from 'react';
import {
  Modal,
  Form,
  message,
  Spin,
  Alert,
  Tag,
  Space,
  DatePicker,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Table, Input, Button } from 'components/restyled';
import {
  useAttendanceSessionsByCourseGroupQuery,
  useCreateAttendanceSessionMutation,
  usePartialUpdateAttendanceSessionMutation,
  useDeleteAttendanceSessionMutation,
  useStudentAttendanceStatsQuery,
  useCurrentUserQuery,
  type AttendanceSession,
  type AttendanceSessionCreate,
} from 'api';
import { UserRoles } from 'utils/permissions';
import BulkUpdateModal from './BulkUpdateModal';
import styles from './GroupDetails.module.css';

interface GroupAttendanceProps {
  groupId: number;
}

const GroupAttendance = ({ groupId }: GroupAttendanceProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalVisible, setModalVisible] = useState(false);
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<AttendanceSession | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // Queries and mutations
  const { data: currentUser } = useCurrentUserQuery();
  const isStudent = currentUser?.user_type === UserRoles.STUDENT;

  // Teacher/Admin queries
  const { data: sessions, isLoading, error } = useAttendanceSessionsByCourseGroupQuery(groupId);

  // Student-specific query for their attendance stats
  const {
    data: studentStatsArray,
    isLoading: isLoadingStats,
    error: statsError,
  } = useStudentAttendanceStatsQuery({ course_group: groupId });

  // Extract the stats for this specific group from the array
  const studentStats = studentStatsArray?.find((stat) => stat.course_group_id === groupId);

  const createMutation = useCreateAttendanceSessionMutation(messageApi);
  const updateMutation = usePartialUpdateAttendanceSessionMutation(messageApi);
  const deleteMutation = useDeleteAttendanceSessionMutation(messageApi);

  const handleCreate = () => {
    setEditingSession(null);
    form.resetFields();
    form.setFieldValue('course_group', groupId);
    setModalVisible(true);
  };

  const handleEdit = (record: AttendanceSession) => {
    setEditingSession(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date) : null,
    });
    setModalVisible(true);
  };

  const handleView = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setBulkModalVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
      };

      if (editingSession) {
        const updateData: { notes?: string | null; date?: string } = {};
        if (formData.notes !== undefined) updateData.notes = formData.notes;
        if (formData.date !== undefined) updateData.date = formData.date;

        updateMutation.mutate(
          {
            id: editingSession.id,
            data: updateData,
          },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
            },
          }
        );
      } else {
        createMutation.mutate(formData as AttendanceSessionCreate, {
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
    setEditingSession(null);
  };

  const columns = [
    {
      title: 'Tarix',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: AttendanceSession, b: AttendanceSession) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => dayjs(date).format('DD.MM.YYYY'),
    },
    {
      title: 'Ümumi',
      dataIndex: 'total_students',
      key: 'total_students',
      render: (count: number) => <Tag>{count}</Tag>,
    },
    {
      title: 'İştirak',
      dataIndex: 'present_count',
      key: 'present_count',
      render: (count: number) => <Tag color="success">{count}</Tag>,
    },
    {
      title: 'Qalıb',
      dataIndex: 'absent_count',
      key: 'absent_count',
      render: (count: number) => <Tag color="error">{count}</Tag>,
    },
    {
      title: 'Gecikmə',
      dataIndex: 'late_count',
      key: 'late_count',
      render: (count: number) => <Tag color="warning">{count}</Tag>,
    },
    {
      title: 'Bağışlanıb',
      dataIndex: 'excused_count',
      key: 'excused_count',
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: 'Yaradıb',
      dataIndex: 'created_by_name',
      key: 'created_by_name',
    },
    {
      title: 'Qeydlər',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: (notes: string | null) => notes || '-',
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: unknown, record: AttendanceSession) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
            size="small"
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Sessiyonu silmək istədiyinizdən əminsiniz?"
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

  if (error || statsError) {
    return (
      <Alert
        message="Xəta"
        description="Davamiyyəti yükləmək mümkün olmadı"
        type="error"
        showIcon
      />
    );
  }

  // Student view: show their attendance stats
  if (isStudent) {
    if (isLoadingStats) {
      return (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      );
    }

    return (
      <div>
        {contextHolder}
        <Card title="Mənim Davamiyyətim">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Ümumi Sessiyalar"
                  value={studentStats?.total_sessions || 0}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="İştirak"
                  value={studentStats?.present_count || 0}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  suffix={
                    <span style={{ fontSize: '14px', color: '#999' }}>
                      ({studentStats?.attendance_percentage?.toFixed(1) || 0}%)
                    </span>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Qalıb"
                  value={studentStats?.absent_count || 0}
                  prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Gecikmə"
                  value={studentStats?.late_count || 0}
                  prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Bağışlanıb"
                  value={studentStats?.excused_count || 0}
                  prefix={<ExclamationCircleOutlined style={{ color: '#1890ff' }} />}
                />
              </Card>
            </Col>
          </Row>
          {studentStats?.first_session_date && (
            <div style={{ marginTop: '24px' }}>
              <p>
                <strong>İlk dərs:</strong>{' '}
                {dayjs(studentStats.first_session_date).format('DD.MM.YYYY')}
              </p>
              {studentStats.last_session_date && (
                <p>
                  <strong>Son dərs:</strong>{' '}
                  {dayjs(studentStats.last_session_date).format('DD.MM.YYYY')}
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Teacher/Admin view: show session management
  return (
    <div>
      {contextHolder}
      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Yeni Sessiya
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={sessions || []}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Cəmi: ${total}`,
          }}
          scroll={{ x: 1200 }}
        />
      )}

      <Modal
        title={editingSession ? 'Sessiyani Redaktə Et' : 'Yeni Sessiya'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yadda saxla"
        cancelText="Ləğv et"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="course_group" hidden>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="date" label="Tarix" rules={[{ required: true, message: 'Tarix seçin' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="notes" label="Qeydlər">
            <Input.TextArea rows={3} placeholder="Sessiya üçün qeydlər" />
          </Form.Item>
        </Form>
      </Modal>

      <BulkUpdateModal
        sessionId={selectedSessionId}
        visible={bulkModalVisible}
        onCancel={() => {
          setBulkModalVisible(false);
          setSelectedSessionId(null);
        }}
        onSuccess={() => {
          // Query invalidation handles refresh
        }}
      />
    </div>
  );
};

export default GroupAttendance;

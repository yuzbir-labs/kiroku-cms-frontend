import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Tag, Space, Button as AntButton, Card, Descriptions, message } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { PageHeader } from '../../components/custom';
import { Table, Select } from '../../components/restyled';
import {
  useAttendanceSessionQuery,
  useSessionStudentsQuery,
  useMarkStudentAttendanceMutation,
  useFinalizeAttendanceSessionMutation,
  useUnfinalizeAttendanceSessionMutation,
  type AttendanceStatus,
  type StudentAttendanceStatus,
} from '../../api';
import styles from './AttendanceSession.module.css';

const AttendanceSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useAttendanceSessionQuery(Number(sessionId));

  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useSessionStudentsQuery(Number(sessionId));

  const markAttendanceMutation = useMarkStudentAttendanceMutation(messageApi);
  const finalizeMutation = useFinalizeAttendanceSessionMutation(messageApi);
  const unfinalizeMutation = useUnfinalizeAttendanceSessionMutation(messageApi);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    markAttendanceMutation.mutate({
      sessionId: Number(sessionId),
      data: {
        student_id: studentId,
        status,
      },
    });
  };

  const handleFinalize = () => {
    finalizeMutation.mutate(Number(sessionId));
  };

  const handleUnfinalize = () => {
    unfinalizeMutation.mutate(Number(sessionId));
  };

  const statusOptions = [
    { label: 'İştirak edib', value: 'PRESENT' },
    { label: 'Qalıb', value: 'ABSENT' },
    { label: 'Gecikmə', value: 'LATE' },
    { label: 'Bağışlanıb', value: 'EXCUSED' },
  ];

  const statusLabels: Record<AttendanceStatus, string> = {
    PRESENT: 'İştirak edib',
    ABSENT: 'Qalıb',
    LATE: 'Gecikmə',
    EXCUSED: 'Bağışlanıb',
  };

  const statusColors: Record<AttendanceStatus, string> = {
    PRESENT: 'success',
    ABSENT: 'error',
    LATE: 'warning',
    EXCUSED: 'blue',
  };

  const statusIcons: Record<AttendanceStatus, React.ReactNode> = {
    PRESENT: <CheckCircleOutlined />,
    ABSENT: <CloseCircleOutlined />,
    LATE: <ClockCircleOutlined />,
    EXCUSED: <ExclamationCircleOutlined />,
  };

  const columns = [
    {
      title: 'Tələbə',
      dataIndex: 'student_name',
      key: 'student_name',
      sorter: (a: StudentAttendanceStatus, b: StudentAttendanceStatus) =>
        a.student_name.localeCompare(b.student_name),
    },
    {
      title: 'Email',
      dataIndex: 'student_email',
      key: 'student_email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AttendanceStatus, record: StudentAttendanceStatus) => (
        <Space>
          <Tag color={statusColors[status]} icon={statusIcons[status]}>
            {statusLabels[status]}
          </Tag>
          {!record.marked && <Tag color="orange">Qeyd edilməyib</Tag>}
        </Space>
      ),
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      width: 200,
      render: (_: unknown, record: StudentAttendanceStatus) => (
        <Select
          value={record.status}
          onChange={(value) => handleStatusChange(record.student_id, value as AttendanceStatus)}
          options={statusOptions}
          disabled={session?.is_finalized}
          style={{ width: 150 }}
        />
      ),
    },
  ];

  if (sessionLoading || studentsLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Yüklənir..." />
        </div>
      </div>
    );
  }

  if (sessionError || studentsError || !session || !studentsData) {
    return (
      <div className={styles.container}>
        <Alert
          message="Xəta"
          description="Sessiya məlumatlarını yükləmək mümkün olmadı"
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
        title={`Davamiyyət Sessiyası - ${dayjs(session.date).format('DD.MM.YYYY')}`}
        subtitle={`${session.course_name} - ${session.course_group_name}`}
        actions={[
          {
            label: 'Geri',
            icon: <ArrowLeftOutlined />,
            onClick: () => navigate(-1),
            type: 'default',
          },
        ]}
      />

      <Card className={styles.sessionInfo}>
        <Descriptions title="Sessiya Məlumatları" column={2}>
          <Descriptions.Item label="Tarix">
            {dayjs(session.date).format('DD MMMM YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag
              color={session.is_finalized ? 'green' : 'orange'}
              icon={session.is_finalized ? <LockOutlined /> : <UnlockOutlined />}
            >
              {session.is_finalized ? 'Tamamlanıb' : 'Davam edir'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Yaradıb">{session.created_by_name}</Descriptions.Item>
          <Descriptions.Item label="Ümumi Tələbələr">{session.total_students}</Descriptions.Item>
          <Descriptions.Item label="İştirak edib">
            <Tag color="success">{session.present_count}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Qalıb">
            <Tag color="error">{session.absent_count}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Gecikmə">
            <Tag color="warning">{session.late_count}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Bağışlanıb">
            <Tag color="blue">{session.excused_count}</Tag>
          </Descriptions.Item>
          {session.notes && (
            <Descriptions.Item label="Qeydlər" span={2}>
              {session.notes}
            </Descriptions.Item>
          )}
        </Descriptions>

        <div className={styles.actions}>
          {session.is_finalized ? (
            <AntButton
              type="default"
              icon={<UnlockOutlined />}
              onClick={handleUnfinalize}
              loading={unfinalizeMutation.isPending}
            >
              Redaktə üçün aç
            </AntButton>
          ) : (
            <AntButton
              type="primary"
              icon={<LockOutlined />}
              onClick={handleFinalize}
              loading={finalizeMutation.isPending}
            >
              Tamamla
            </AntButton>
          )}
        </div>
      </Card>

      <Card className={styles.studentsCard}>
        <div className={styles.studentsHeader}>
          <h3>Tələbələr</h3>
          <Space>
            <Tag>Ümumi: {studentsData.total_students}</Tag>
            <Tag color="green">Qeyd edilib: {studentsData.marked_count}</Tag>
            <Tag color="orange">Qeyd edilməyib: {studentsData.unmarked_count}</Tag>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={studentsData.students}
          rowKey="student_id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Cəmi: ${total}`,
          }}
        />
      </Card>
    </div>
  );
};

export default AttendanceSessionPage;

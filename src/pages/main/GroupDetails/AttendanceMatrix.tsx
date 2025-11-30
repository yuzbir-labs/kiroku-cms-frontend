import { useMemo } from 'react';
import { Tag, Tooltip } from 'antd';
import { Table } from 'components/restyled';
import {
  useCourseGroupStudentsQuery,
  useAttendanceSessionsByCourseGroupQuery,
  useCurrentUserQuery,
  type GroupEnrollment,
  type AttendanceSession,
  type AttendanceStatus,
} from 'api';
import dayjs from 'dayjs';
import styles from './GroupDetails.module.css';

interface AttendanceMatrixProps {
  groupId: number;
}

interface MatrixRow {
  key: number;
  studentId: number;
  studentName: string;
  status: string;
  [key: string]: string | number | AttendanceStatus | undefined; // Dynamic session columns
}

const getStatusColor = (status?: AttendanceStatus): string => {
  switch (status) {
    case 'PRESENT':
      return 'success';
    case 'ABSENT':
      return 'error';
    case 'LATE':
      return 'warning';
    case 'EXCUSED':
      return 'blue';
    default:
      return 'default';
  }
};

const getStatusText = (status?: AttendanceStatus): string => {
  switch (status) {
    case 'PRESENT':
      return '✓';
    case 'ABSENT':
      return '✗';
    case 'LATE':
      return 'G';
    case 'EXCUSED':
      return 'B';
    default:
      return '-';
  }
};

const getStatusTooltip = (status?: AttendanceStatus): string => {
  switch (status) {
    case 'PRESENT':
      return 'İştirak edib';
    case 'ABSENT':
      return 'Qalıb';
    case 'LATE':
      return 'Gecikmə';
    case 'EXCUSED':
      return 'Bağışlanıb';
    default:
      return 'Qeyd yoxdur';
  }
};

const AttendanceMatrix = ({ groupId }: AttendanceMatrixProps) => {
  const { data: currentUser } = useCurrentUserQuery();
  const isTeacher =
    currentUser?.user_type === 'TEACHER' ||
    currentUser?.user_type === 'BRANCH_ADMIN' ||
    currentUser?.user_type === 'ORGANIZATION_ADMIN';

  const {
    data: students,
    isLoading: studentsLoading,
    error: studentsError,
  } = useCourseGroupStudentsQuery(groupId, isTeacher);

  const {
    data: sessions,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useAttendanceSessionsByCourseGroupQuery(groupId);

  const { columns, dataSource } = useMemo(() => {
    if (!students || !sessions) {
      return { columns: [], dataSource: [] };
    }

    // Sort sessions by date (oldest first)
    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Create base columns
    const cols = [
      {
        title: 'Tələbə',
        dataIndex: 'studentName',
        key: 'studentName',
        fixed: 'left' as const,
        width: 200,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        fixed: 'left' as const,
        width: 100,
        render: (status: string) => {
          let color = 'default';
          if (status === 'ACTIVE') color = 'success';
          else if (status === 'COMPLETED') color = 'blue';
          else if (status === 'DROPPED') color = 'error';
          return <Tag color={color}>{status}</Tag>;
        },
      },
    ];

    // Add session date columns
    const sessionCols = sortedSessions.map((session) => ({
      title: dayjs(session.date).format('DD.MM'),
      dataIndex: `session_${session.id}`,
      key: `session_${session.id}`,
      width: 80,
      align: 'center' as const,
      render: (status: AttendanceStatus | undefined) => (
        <Tooltip title={getStatusTooltip(status)}>
          <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
        </Tooltip>
      ),
    }));

    const allColumns = [...cols, ...sessionCols];

    // Build data rows
    const rows: MatrixRow[] = students.map((student: GroupEnrollment) => {
      const row: MatrixRow = {
        key: student.id,
        studentId: student.student,
        studentName: student.student_name,
        status: student.status,
      };

      // For each session, find the attendance record for this student
      sortedSessions.forEach((session: AttendanceSession) => {
        const attendanceRecord = session.attendance_records.find(
          (record) => record.student === student.student
        );
        row[`session_${session.id}`] = attendanceRecord?.status;
      });

      return row;
    });

    return { columns: allColumns, dataSource: rows };
  }, [students, sessions]);

  if (studentsError || sessionsError) {
    return (
      <div className={styles.errorContainer}>Davamiyyət məlumatlarını yükləmək mümkün olmadı</div>
    );
  }

  if (studentsLoading || sessionsLoading) {
    return <div className={styles.loadingContainer}>Yüklənir...</div>;
  }

  return (
    <div className={styles.matrixContainer}>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: 'max-content' }}
        bordered
        size="small"
      />
    </div>
  );
};

export default AttendanceMatrix;

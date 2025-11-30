import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Alert, Tag, Card, Row, Col } from 'antd';
import { BookOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { PageHeader, FilterPanel } from 'components/custom';
import { Table } from 'components/restyled';
import {
  useMyCourseGroupsQuery,
  useCurrentUserQuery,
  type CourseGroup,
  type CourseGroupStatus,
  type DayOfWeek,
} from 'api';
import { UserRoles } from 'utils/permissions';
import styles from './MyGroups.module.css';

const MyGroups: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseGroupStatus | undefined>();

  const { data: user } = useCurrentUserQuery();
  const { data: myGroupsData, isLoading, error } = useMyCourseGroupsQuery();

  const groups = myGroupsData?.groups;

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

  const filteredGroups = groups?.filter((group) => {
    const matchesSearch =
      !searchTerm ||
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || group.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Columns for teachers
  const teacherColumns = [
    {
      title: 'Kurs',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Qrup',
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
      title: 'Başlama',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date: string) => new Date(date).toLocaleDateString('az-AZ'),
    },
    {
      title: 'Bitmə',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date: string) => new Date(date).toLocaleDateString('az-AZ'),
    },
  ];

  // Columns for students (hide pricing info)
  const studentColumns = [
    {
      title: 'Kurs',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Qrup',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Başlama',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date: string) => new Date(date).toLocaleDateString('az-AZ'),
    },
    {
      title: 'Bitmə',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date: string) => new Date(date).toLocaleDateString('az-AZ'),
    },
  ];

  const columns = user?.user_type === UserRoles.TEACHER ? teacherColumns : studentColumns;

  if (error) {
    return (
      <div className={styles.container}>
        <Alert message="Xəta" description="Qrupları yükləmək mümkün olmadı" type="error" showIcon />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageHeader
        title={
          user?.user_type === UserRoles.TEACHER ? 'Mənim Dərs Verdiyim Qruplar' : 'Mənim Qruplarım'
        }
      />

      {/* Summary Cards */}
      <Row gutter={16} className={styles.summaryCards}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className={styles.statCard}>
              <BookOutlined className={styles.statIcon} />
              <div className={styles.statContent}>
                <div className={styles.statValue}>{groups?.length || 0}</div>
                <div className={styles.statLabel}>Ümumi Qruplar</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className={styles.statCard}>
              <CalendarOutlined className={styles.statIcon} style={{ color: '#52c41a' }} />
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {groups?.filter((g) => g.status === 'ACTIVE').length || 0}
                </div>
                <div className={styles.statLabel}>Aktiv Qruplar</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className={styles.statCard}>
              <UserOutlined className={styles.statIcon} style={{ color: '#1890ff' }} />
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {groups?.reduce((sum, g) => sum + g.enrolled_count, 0) || 0}
                </div>
                <div className={styles.statLabel}>
                  {user?.user_type === UserRoles.TEACHER ? 'Ümumi Tələbələr' : 'Həmsiniflərim'}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className={styles.statCard}>
              <BookOutlined className={styles.statIcon} style={{ color: '#faad14' }} />
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {groups?.filter((g) => g.status === 'UPCOMING').length || 0}
                </div>
                <div className={styles.statLabel}>Gələcək Qruplar</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

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
            dataSource={filteredGroups || []}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Cəmi: ${total}`,
            }}
            scroll={{ x: 1200 }}
            onRow={(record) => ({
              onClick: () => navigate(`/groups/${record.id}`),
              style: { cursor: 'pointer' },
            })}
          />
        )}
      </div>
    </div>
  );
};

export default MyGroups;

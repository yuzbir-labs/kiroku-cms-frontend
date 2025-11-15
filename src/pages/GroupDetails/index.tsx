import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Spin, Alert } from 'antd';
import {
  ArrowLeftOutlined,
  CheckSquareOutlined,
  BookOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/custom';
import { useCourseGroupQuery } from '../../api';
import GroupAttendance from './GroupAttendance.tsx';
import GroupSyllabus from './GroupSyllabus.tsx';
import GroupGrades from './GroupGrades.tsx';
import styles from './GroupDetails.module.css';

const GroupDetails: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const { data: group, isLoading, error } = useCourseGroupQuery(Number(groupId));

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Yüklənir..." />
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className={styles.container}>
        <Alert
          message="Xəta"
          description="Qrup məlumatlarını yükləmək mümkün olmadı"
          type="error"
          showIcon
        />
      </div>
    );
  }

  const tabItems = [
    {
      key: 'attendance',
      label: (
        <span>
          <CheckSquareOutlined />
          Davamiyyət
        </span>
      ),
      children: <GroupAttendance groupId={Number(groupId)} />,
    },
    {
      key: 'syllabus',
      label: (
        <span>
          <BookOutlined />
          Sillabus
        </span>
      ),
      children: <GroupSyllabus groupId={Number(groupId)} />,
    },
    {
      key: 'grades',
      label: (
        <span>
          <TrophyOutlined />
          Qiymətlər
        </span>
      ),
      children: <GroupGrades groupId={Number(groupId)} />,
    },
  ];

  return (
    <div className={styles.container}>
      <PageHeader
        title={`${group.name} - ${group.course_name}`}
        subtitle={`Filial: ${group.branch_name} | Kod: ${group.code}`}
        actions={[
          {
            label: 'Geri',
            icon: <ArrowLeftOutlined />,
            onClick: () => navigate(-1),
            type: 'default',
          },
        ]}
      />

      <div className={styles.content}>
        <Tabs items={tabItems} defaultActiveKey="attendance" />
      </div>
    </div>
  );
};

export default GroupDetails;

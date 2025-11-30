import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Spin, Alert, Card } from 'antd';
import {
  ArrowLeftOutlined,
  CheckSquareOutlined,
  BookOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { PageHeader } from 'components/custom/index.ts';
import { useMyCourseGroupsQuery } from 'api/index.ts';
import GroupAttendance from './GroupAttendance.tsx';
import GroupSyllabus from './GroupSyllabus.tsx';
import GroupGrades from './GroupGrades.tsx';
import styles from './GroupDetails.module.css';

const GroupDetails: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  // Get group info from my-groups list (works for both students and teachers)
  // This avoids calling the /my-groups/{id} endpoint which gives 404 for students
  const { data: myGroupsData, isLoading, error } = useMyCourseGroupsQuery();

  // Find the specific group from the list
  const group = myGroupsData?.groups?.find((g) => g.id === Number(groupId));

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
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
        <span className={styles.tabHeader}>
          <CheckSquareOutlined />
          Davamiyyət
        </span>
      ),
      children: <GroupAttendance groupId={Number(groupId)} />,
    },
    {
      key: 'syllabus',
      label: (
        <span className={styles.tabHeader}>
          <BookOutlined />
          Sillabus
        </span>
      ),
      children: <GroupSyllabus groupId={Number(groupId)} />,
    },
    {
      key: 'grades',
      label: (
        <span className={styles.tabHeader}>
          <TrophyOutlined />
          Qiymətlər
        </span>
      ),
      children: <GroupGrades groupId={Number(groupId)} />,
    },
  ];

  return (
    <div className={styles.container}>
      {}
      <PageHeader
        title={group.name}
        subtitle={group.code}
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
        <Card>
          <Tabs items={tabItems} defaultActiveKey="attendance" />
        </Card>
      </div>
    </div>
  );
};

export default GroupDetails;

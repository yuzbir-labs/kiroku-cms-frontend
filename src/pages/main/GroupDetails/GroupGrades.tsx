import { useState } from 'react';
import {
  Card,
  Spin,
  Alert,
  Empty,
  Tag,
  Space,
  message,
  Popconfirm,
  Descriptions,
  Progress,
} from 'antd';
import { TrophyOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Table } from 'components/restyled/index.ts';
import {
  useGradingSyllabusByCourseGroupQuery,
  useDeleteGradingSyllabusMutation,
  useCurrentUserQuery,
  useStudentGradeReportQuery,
  type GradingSyllabusDetail,
} from 'api/index.ts';
import { UserRoles } from 'utils/permissions.ts';
import GradeSectionsManager from './GradeSectionsManager.tsx';
import styles from './GroupDetails.module.css';

interface GroupGradesProps {
  groupId: number;
}

const GroupGrades = ({ groupId }: GroupGradesProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<number | null>(null);

  // Queries
  const { data: currentUser } = useCurrentUserQuery();
  const isStudent = currentUser?.user_type === UserRoles.STUDENT;

  const { data: syllabusData, isLoading, error } = useGradingSyllabusByCourseGroupQuery(groupId);

  // Student grade report query
  const {
    data: gradeReport,
    isLoading: isLoadingReport,
    error: reportError,
  } = useStudentGradeReportQuery({ course_group: groupId });

  // Mutations
  const deleteMutation = useDeleteGradingSyllabusMutation(messageApi);

  const isTeacher =
    currentUser?.user_type === 'TEACHER' ||
    currentUser?.user_type === 'BRANCH_ADMIN' ||
    currentUser?.user_type === 'ORGANIZATION_ADMIN';

  const handleEdit = () => {
    // Redirect to syllabus tab for editing
    messageApi.info('Sillabus bölməsinə keçərək meyarları dəyişdirə bilərsiniz');
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: 'Ad',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Bölmələr',
      dataIndex: 'sections',
      key: 'sections',
      render: (sections: unknown[]) => <Tag>{sections?.length || 0}</Tag>,
    },
    {
      title: 'Ümumi Çəki',
      dataIndex: 'total_weight',
      key: 'total_weight',
      render: (weight: number) => <Tag color="blue">{weight}%</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'}>{active ? 'Aktiv' : 'Deaktiv'}</Tag>
      ),
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      render: (_: unknown, record: GradingSyllabusDetail) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setSelectedSyllabusId(record.id)}
          >
            Bax
          </Button>
          {isTeacher && (
            <>
              <Button type="link" icon={<EditOutlined />} onClick={handleEdit}>
                Dəyişdir
              </Button>
              <Popconfirm
                title="Silmək istədiyinizdən əminsiniz?"
                onConfirm={() => handleDelete(record.id)}
                okText="Bəli"
                cancelText="Xeyr"
              >
                <Button type="link" danger icon={<DeleteOutlined />}>
                  Sil
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Student view: show their grade report
  if (isStudent) {
    if (isLoadingReport) {
      return (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      );
    }

    if (reportError) {
      return (
        <Alert
          message="Xəta"
          description="Qiymət hesabatını yükləmək alınmadı"
          type="error"
          showIcon
        />
      );
    }

    if (!gradeReport) {
      return (
        <Card>
          <Empty
            image={<TrophyOutlined style={{ fontSize: 64, color: '#999' }} />}
            description={
              <div>
                <h3>Qiymət məlumatı yoxdur</h3>
                <p>Bu qrup üçün hələ qiymətləndirmə aparılmayıb.</p>
              </div>
            }
          />
        </Card>
      );
    }

    return (
      <>
        {contextHolder}
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <h2 style={{ margin: 0 }}>
                <TrophyOutlined /> Mənim Qiymətlərim
              </h2>
              <Descriptions bordered column={1} style={{ marginTop: '16px' }} size="small">
                <Descriptions.Item label="Kurs">{gradeReport.course_name}</Descriptions.Item>
                <Descriptions.Item label="Qrup">{gradeReport.course_group_name}</Descriptions.Item>
                <Descriptions.Item label="Qiymətləndirmə sistemi">
                  {gradeReport.syllabus_name}
                </Descriptions.Item>
                <Descriptions.Item label="Yekun bal">
                  <strong style={{ fontSize: '18px', color: '#1890ff' }}>
                    {Number(gradeReport.final_score || 0).toFixed(2)}
                  </strong>{' '}
                  / 100
                </Descriptions.Item>
                <Descriptions.Item label="Qiymətləndirilmiş çəki">
                  <Progress
                    percent={gradeReport.total_weight_graded}
                    status={gradeReport.total_weight_graded === 100 ? 'success' : 'active'}
                  />
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Table
              columns={[
                {
                  title: 'Meyar',
                  dataIndex: 'section_name',
                  key: 'section_name',
                },
                {
                  title: 'Bal',
                  key: 'score',
                  render: (_: unknown, record: unknown) => {
                    const grade = record as {
                      score: number;
                      max_score: number;
                    };
                    return `${grade.score} / ${grade.max_score}`;
                  },
                },
                {
                  title: 'Faiz',
                  dataIndex: 'percentage',
                  key: 'percentage',
                  render: (percentage: number) => (
                    <Tag color={percentage >= 50 ? 'success' : 'error'}>
                      {Number(percentage || 0).toFixed(1)}%
                    </Tag>
                  ),
                },
                {
                  title: 'Çəkili bal',
                  dataIndex: 'weighted_score',
                  key: 'weighted_score',
                  render: (score: number) => Number(score || 0).toFixed(2),
                },
                {
                  title: 'Rəy',
                  dataIndex: 'feedback',
                  key: 'feedback',
                  ellipsis: true,
                  render: (feedback: string | null) => feedback || '-',
                },
                {
                  title: 'Qiymətləyən',
                  dataIndex: 'graded_by_name',
                  key: 'graded_by_name',
                },
              ]}
              dataSource={gradeReport.grades}
              rowKey="id"
              pagination={false}
            />
          </Space>
        </Card>
      </>
    );
  }

  // Teacher/Admin view
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Xəta"
        description="Qiymətləndirmə məlumatlarını yükləmək alınmadı"
        type="error"
        showIcon
      />
    );
  }

  const syllabi = syllabusData?.results || [];

  if (selectedSyllabusId) {
    return (
      <GradeSectionsManager
        syllabusId={selectedSyllabusId}
        groupId={groupId}
        onBack={() => setSelectedSyllabusId(null)}
      />
    );
  }

  return (
    <>
      {contextHolder}
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <h2 style={{ margin: 0 }}>
              <TrophyOutlined /> Qiymətləndirmə Sistemi
            </h2>
            <p style={{ color: '#666', margin: '8px 0 0 0' }}>
              Qrupun qiymətləndirmə meyarlarını və tələbə nəticələrini idarə edin. Yeni meyar
              yaratmaq üçün Sillabus bölməsinə keçin.
            </p>
          </div>

          {syllabi.length === 0 ? (
            <Empty
              image={<TrophyOutlined style={{ fontSize: 64, color: '#999' }} />}
              description={
                <div>
                  <h3>Hələ qiymətləndirmə meyarı yoxdur</h3>
                  <p>Bu qrup üçün qiymətləndirmə sistemi yaratmaq üçün Sillabus bölməsinə keçin.</p>
                </div>
              }
            />
          ) : (
            <Table
              columns={columns}
              dataSource={syllabi as unknown as GradingSyllabusDetail[]}
              rowKey="id"
              pagination={false}
            />
          )}
        </Space>
      </Card>
    </>
  );
};

export default GroupGrades;

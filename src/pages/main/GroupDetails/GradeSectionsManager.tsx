import { useState } from 'react';
import {
  Card,
  Tabs,
  Spin,
  Alert,
  Tag,
  Space,
  Modal,
  InputNumber,
  message,
  Row,
  Col,
  Statistic,
  Progress,
  Empty,
} from 'antd';
import {
  ArrowLeftOutlined,
  TrophyOutlined,
  EditOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Button, Table, Input } from 'components/restyled';
import {
  useGradingSyllabusQuery,
  useStudentGradesQuery,
  useBulkGradeStudentsMutation,
  useCourseGroupStudentsQuery,
  useStudentGradeReportQuery,
  useCurrentUserQuery,
  type StudentGrade,
  type StudentGradeInput,
  type GradingSection,
} from 'api';
import styles from './GroupDetails.module.css';

interface GradeSectionsManagerProps {
  syllabusId: number;
  groupId: number;
  onBack: () => void;
}

const GradeSectionsManager = ({ syllabusId, groupId, onBack }: GradeSectionsManagerProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [activeSection, setActiveSection] = useState<string>('');
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState<GradingSection | null>(null);
  const [grades, setGrades] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Queries
  const { data: currentUser } = useCurrentUserQuery();
  const isTeacher =
    currentUser?.user_type === 'TEACHER' ||
    currentUser?.user_type === 'BRANCH_ADMIN' ||
    currentUser?.user_type === 'ORGANIZATION_ADMIN';

  const {
    data: syllabus,
    isLoading: syllabusLoading,
    error: syllabusError,
  } = useGradingSyllabusQuery(syllabusId);

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useCourseGroupStudentsQuery(
    groupId,
    isTeacher
  );

  const sectionId = Number(activeSection) || syllabus?.sections?.[0]?.id;
  const { data: gradesData, isLoading: gradesLoading } = useStudentGradesQuery(sectionId || 0, {});

  const { data: studentReport, isLoading: reportLoading } = useStudentGradeReportQuery({
    course_group: groupId,
    student: selectedStudentId || undefined,
  });

  // Mutations
  const bulkGradeMutation = useBulkGradeStudentsMutation(messageApi);

  const handleGradeSection = (section: GradingSection) => {
    setSelectedSection(section);
    setActiveSection(section.id.toString());

    // Initialize grades from existing data
    const existingGrades: Record<number, number> = {};
    const existingFeedback: Record<number, string> = {};

    gradesData?.results?.forEach((grade) => {
      existingGrades[grade.student] = Number(grade.score);
      if (grade.feedback) {
        existingFeedback[grade.student] = grade.feedback;
      }
    });

    setGrades(existingGrades);
    setFeedback(existingFeedback);
    setGradeModalVisible(true);
  };

  const handleSaveGrades = async () => {
    if (!selectedSection) return;

    const gradeInputs: StudentGradeInput[] = Object.entries(grades)
      .filter(([_, score]) => score !== undefined && score !== null)
      .map(([studentId, score]) => ({
        student: Number(studentId),
        score,
        feedback: feedback[Number(studentId)] || undefined,
      }));

    if (gradeInputs.length === 0) {
      messageApi.warning('Heç bir qiymət daxil edilməyib');
      return;
    }

    // Validate scores
    const maxScore = Number(selectedSection.max_score);
    const invalidScores = gradeInputs.filter((g) => g.score < 0 || g.score > maxScore);
    if (invalidScores.length > 0) {
      messageApi.error(`Qiymətlər 0 və ${maxScore} arasında olmalıdır`);
      return;
    }

    bulkGradeMutation.mutate(
      {
        sectionId: selectedSection.id,
        data: { grades: gradeInputs },
      },
      {
        onSuccess: () => {
          setGradeModalVisible(false);
          setGrades({});
          setFeedback({});
          setSelectedSection(null);
        },
      }
    );
  };

  const handleViewReport = (studentId: number) => {
    setSelectedStudentId(studentId);
    setReportModalVisible(true);
  };

  if (syllabusLoading || enrollmentsLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (syllabusError || !syllabus) {
    return (
      <Alert
        message="Xəta"
        description="Qiymətləndirmə meyarını yükləmək alınmadı"
        type="error"
        showIcon
      />
    );
  }

  const enrollments = enrollmentsData || [];

  const students = enrollments.map((e) => ({
    id: e.student,
    name: e.student_name,
  }));

  // Calculate section statistics
  const getSectionStats = (_sectionId: number) => {
    const sectionGrades = gradesData?.results || [];
    if (sectionGrades.length === 0) {
      return { graded: 0, total: students.length, average: 0 };
    }

    const total = students.length;
    const graded = sectionGrades.length;
    const average =
      graded > 0 ? sectionGrades.reduce((sum, g) => sum + Number(g.score), 0) / graded : 0;

    return { graded, total, average };
  };

  const gradeColumns = [
    {
      title: 'Tələbə',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: 'Bal',
      dataIndex: 'score',
      key: 'score',
      render: (score: number, record: StudentGrade) => (
        <Tag color="blue">
          {score} / {record.max_score}
        </Tag>
      ),
    },
    {
      title: 'Faiz',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => <Progress percent={Number(percentage)} size="small" />,
    },
    {
      title: 'Çəki ilə',
      dataIndex: 'weighted_score',
      key: 'weighted_score',
      render: (weighted: number) => <Tag color="purple">{weighted}%</Tag>,
    },
    {
      title: 'Qiymətləndirən',
      dataIndex: 'graded_by_name',
      key: 'graded_by_name',
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      render: (_: unknown, record: StudentGrade) => (
        <Button type="link" size="small" onClick={() => handleViewReport(record.student)}>
          Hesabat
        </Button>
      ),
    },
  ];

  const tabItems = syllabus.sections.map((section) => {
    const stats = getSectionStats(section.id);

    return {
      key: section.id.toString(),
      label: (
        <Space>
          <span>{section.name}</span>
          <Tag>{section.weight}%</Tag>
        </Space>
      ),
      children: (
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Qiymətləndirilən"
                  value={stats.graded}
                  suffix={`/ ${stats.total}`}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Orta Bal"
                  value={stats.average.toFixed(2)}
                  suffix={`/ ${section.max_score}`}
                />
              </Col>
              <Col span={6}>
                <Statistic title="Çəki" value={`${section.weight}%`} />
              </Col>
              <Col span={6}>
                <Statistic title="Maksimum" value={section.max_score} suffix="bal" />
              </Col>
            </Row>

            {section.description && <Alert message={section.description} type="info" showIcon />}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0 }}>Tələbə Qiymətləri</h3>
              {isTeacher && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleGradeSection(section)}
                >
                  Qiymətləndir
                </Button>
              )}
            </div>

            <Table
              columns={gradeColumns}
              dataSource={gradesData?.results || []}
              rowKey="id"
              loading={gradesLoading}
              pagination={{ pageSize: 10 }}
            />
          </Space>
        </Card>
      ),
    };
  });

  return (
    <>
      {contextHolder}
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Button icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginBottom: 8 }}>
                Geri
              </Button>
              <h2 style={{ margin: 0 }}>
                <TrophyOutlined /> {syllabus.name}
              </h2>
              <p style={{ color: '#666', margin: '8px 0 0 0' }}>{syllabus.description}</p>
            </div>
            <div>
              <Tag color="success">Aktiv</Tag>
              <Tag color="blue">Ümumi Çəki: {syllabus.total_weight}%</Tag>
            </div>
          </div>

          <Tabs activeKey={activeSection} onChange={setActiveSection} items={tabItems} />
        </Space>
      </Card>

      {/* Grade Input Modal */}
      <Modal
        title={`Qiymətləndirmə: ${selectedSection?.name}`}
        open={gradeModalVisible}
        onOk={handleSaveGrades}
        onCancel={() => {
          setGradeModalVisible(false);
          setGrades({});
          setFeedback({});
          setSelectedSection(null);
        }}
        width={900}
        okText="Yadda Saxla"
        cancelText="Ləğv et"
        confirmLoading={bulkGradeMutation.isPending}
      >
        {selectedSection && (
          <div>
            <Alert
              message={
                <span>
                  Maksimum Bal: <strong>{selectedSection.max_score}</strong> | Çəki:{' '}
                  <strong>{selectedSection.weight}%</strong>
                </span>
              }
              type="info"
              style={{ marginBottom: 16 }}
            />

            <Table
              dataSource={students}
              rowKey="id"
              pagination={false}
              scroll={{ y: 400 }}
              columns={[
                {
                  title: 'Tələbə',
                  dataIndex: 'name',
                  key: 'name',
                  fixed: 'left',
                  width: 200,
                },
                {
                  title: 'Bal',
                  key: 'score',
                  width: 150,
                  render: (_: unknown, record: { id: number; name: string }) => (
                    <InputNumber
                      min={0}
                      max={Number(selectedSection.max_score)}
                      value={grades[record.id]}
                      onChange={(value) => setGrades({ ...grades, [record.id]: value || 0 })}
                      style={{ width: '100%' }}
                    />
                  ),
                },
                {
                  title: 'Rəy',
                  key: 'feedback',
                  render: (_: unknown, record: { id: number; name: string }) => (
                    <Input.TextArea
                      rows={1}
                      value={feedback[record.id]}
                      onChange={(e) =>
                        setFeedback({
                          ...feedback,
                          [record.id]: e.target.value,
                        })
                      }
                      placeholder="Şərh əlavə edin"
                    />
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Student Report Modal */}
      <Modal
        title={
          <Space>
            <BarChartOutlined />
            <span>Tələbə Hesabatı</span>
          </Space>
        }
        open={reportModalVisible}
        onCancel={() => {
          setReportModalVisible(false);
          setSelectedStudentId(null);
        }}
        footer={null}
        width={800}
      >
        {reportLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : studentReport ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Tələbə"
                    value={studentReport.student_name}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Final Qiyməti"
                    value={Number(studentReport.final_score).toFixed(2)}
                    suffix="/ 100"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Qiymətləndirilən"
                    value={`${Number(studentReport.total_weight_graded).toFixed(0)}%`}
                  />
                </Col>
              </Row>
            </Card>

            <Table
              dataSource={studentReport.grades}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: 'Bölmə',
                  dataIndex: 'section_name',
                  key: 'section_name',
                },
                {
                  title: 'Bal',
                  key: 'score',
                  render: (_, record) => (
                    <span>
                      {record.score} / {record.max_score}
                    </span>
                  ),
                },
                {
                  title: 'Faiz',
                  dataIndex: 'percentage',
                  key: 'percentage',
                  render: (p: number) => <Progress percent={Number(p)} size="small" />,
                },
                {
                  title: 'Çəkili Bal',
                  dataIndex: 'weighted_score',
                  key: 'weighted_score',
                  render: (w: number) => <Tag color="purple">{w}%</Tag>,
                },
                {
                  title: 'Rəy',
                  dataIndex: 'feedback',
                  key: 'feedback',
                  render: (f: string) => f || '-',
                },
              ]}
            />

            <Alert
              message="Qeyd"
              description={`Final qiyməti bütün qiymətləndirilmiş bölmələrin çəkili ortalamasıdır. Hal-hazırda ${studentReport.total_weight_graded}% qiymətləndirilib.`}
              type="info"
              showIcon
            />
          </Space>
        ) : (
          <Empty description="Hesabat tapılmadı" />
        )}
      </Modal>
    </>
  );
};

export default GradeSectionsManager;

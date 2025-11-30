import { useState } from 'react';
import {
  Card,
  Empty,
  Tag,
  Space,
  Spin,
  Alert,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Row,
  Col,
  Table,
  Statistic,
} from 'antd';
import {
  BookOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Button } from 'components/restyled';
import {
  useGradingSyllabusByCourseGroupQuery,
  useGradingSectionsQuery,
  useCreateGradingSyllabusMutation,
  useUpdateGradingSyllabusMutation,
  useCurrentUserQuery,
  type GradingSectionInput,
  type GradingSection,
} from 'api';
import styles from './GroupDetails.module.css';

interface GroupSyllabusProps {
  groupId: number;
}

interface SectionWithId extends GradingSectionInput {
  _id: string;
}

const GroupSyllabus = ({ groupId }: GroupSyllabusProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalVisible, setModalVisible] = useState(false);
  const [formSections, setFormSections] = useState<SectionWithId[]>([]);
  const [form] = Form.useForm();

  // Queries
  const { data: currentUser } = useCurrentUserQuery();
  const { data: syllabusData, isLoading, error } = useGradingSyllabusByCourseGroupQuery(groupId);

  const syllabi = syllabusData?.results || [];
  const activeSyllabus = syllabi.find((s) => s.is_active);

  // Fetch sections for the active syllabus
  const { data: sectionsData, isLoading: sectionsLoading } = useGradingSectionsQuery({
    syllabus: activeSyllabus?.id || 0,
  });

  // Mutations
  const createMutation = useCreateGradingSyllabusMutation(messageApi);
  const updateMutation = useUpdateGradingSyllabusMutation(messageApi);

  const isTeacher =
    currentUser?.user_type === 'TEACHER' ||
    currentUser?.user_type === 'BRANCH_ADMIN' ||
    currentUser?.user_type === 'ORGANIZATION_ADMIN';

  if (isLoading || sectionsLoading) {
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
        description="Sillabus məlumatlarını yükləmək alınmadı"
        type="error"
        showIcon
      />
    );
  }

  const sections = sectionsData?.results || [];

  const handleCreateOrEdit = () => {
    if (activeSyllabus) {
      // Edit existing syllabus - use fetched sections
      setFormSections(
        sections.map((s: GradingSection) => ({
          _id: `section-${s.id}-${Date.now()}`,
          name: s.name,
          weight: Number(s.weight),
          max_score: Number(s.max_score),
          description: s.description,
        }))
      );
      form.setFieldsValue({
        name: activeSyllabus.name,
        description: activeSyllabus.description,
        is_active: activeSyllabus.is_active,
      });
    } else {
      // Create new syllabus
      setFormSections([
        {
          _id: `section-${Date.now()}-1`,
          name: 'Ara Imtahan',
          weight: 30,
          max_score: 100,
        },
        {
          _id: `section-${Date.now()}-2`,
          name: 'Final Imtahan',
          weight: 40,
          max_score: 100,
        },
        {
          _id: `section-${Date.now()}-3`,
          name: 'Tapşırıqlar',
          weight: 30,
          max_score: 100,
        },
      ]);
      form.resetFields();
      form.setFieldsValue({
        is_active: true,
      });
    }
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      // Validate sections
      const totalWeight = formSections.reduce((sum, s) => sum + s.weight, 0);
      if (totalWeight !== 100) {
        messageApi.error(`Ümumi çəki 100% olmalıdır (hazırda: ${totalWeight}%)`);
        return;
      }

      if (formSections.length === 0) {
        messageApi.error('Ən azı bir bölmə əlavə edin');
        return;
      }

      const formData = {
        ...values,
        course_group: groupId,
        sections: formSections.map((s, index) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id, ...sectionData } = s;
          return { ...sectionData, order: index };
        }),
      };

      if (activeSyllabus) {
        // PUT request - update existing syllabus
        updateMutation.mutate(
          {
            id: activeSyllabus.id,
            data: formData,
          },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
              setFormSections([]);
            },
          }
        );
      } else {
        // POST request - create new syllabus
        createMutation.mutate(formData, {
          onSuccess: () => {
            setModalVisible(false);
            form.resetFields();
            setFormSections([]);
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
    setFormSections([]);
  };

  const addSection = () => {
    setFormSections([
      ...formSections,
      { _id: `section-new-${Date.now()}`, name: '', weight: 0, max_score: 100 },
    ]);
  };

  const removeSection = (id: string) => {
    setFormSections(formSections.filter((s) => s._id !== id));
  };

  const updateSection = (id: string, field: string, value: string | number) => {
    const newSections = formSections.map((s) => (s._id === id ? { ...s, [field]: value } : s));
    setFormSections(newSections);
  };

  const totalWeight = formSections.reduce((sum, s) => sum + s.weight, 0);

  if (!activeSyllabus) {
    return (
      <>
        {contextHolder}
        <Card>
          <Empty
            image={<BookOutlined style={{ fontSize: 64, color: '#999' }} />}
            description={
              <div>
                <h3>Aktiv Sillabus Yoxdur</h3>
                <p>
                  Bu qrup üçün hələ aktiv tədris planı təyin edilməyib.
                  {isTeacher && ' Yeni meyar yaratmaq üçün aşağıdakı düyməni klikləyin.'}
                </p>
              </div>
            }
          >
            {isTeacher && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateOrEdit}
                style={{ marginTop: 16 }}
              >
                Yeni Meyar Yarat
              </Button>
            )}
          </Empty>
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={activeSyllabus ? 'Qiymətləndirmə Meyarını Dəyişdir' : 'Yeni Qiymətləndirmə Meyarı'}
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={800}
          okText="Yadda Saxla"
          cancelText="Ləğv et"
          confirmLoading={createMutation.isPending || updateMutation.isPending}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Meyar Adı"
              rules={[{ required: true, message: 'Meyar adı daxil edin' }]}
            >
              <Input placeholder="Məs: 2025 Payız Semestri" />
            </Form.Item>

            <Form.Item name="description" label="Təsvir">
              <Input.TextArea
                rows={3}
                placeholder="Qiymətləndirmə meyarları haqqında qısa məlumat"
              />
            </Form.Item>

            <Form.Item name="is_active" label="Aktiv" valuePropName="checked">
              <Switch />
            </Form.Item>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <h4 style={{ margin: 0 }}>Qiymətləndirmə Bölmələri</h4>
                <Button icon={<PlusOutlined />} onClick={addSection}>
                  Bölmə Əlavə Et
                </Button>
              </div>

              <Alert
                message={
                  <span>
                    Ümumi Çəki: <strong>{totalWeight}%</strong>
                    {totalWeight !== 100 && (
                      <span style={{ color: '#ff4d4f', marginLeft: 8 }}>(100% olmalıdır)</span>
                    )}
                  </span>
                }
                type={totalWeight === 100 ? 'success' : 'warning'}
                style={{ marginBottom: 12 }}
              />

              {formSections.map((section) => (
                <Card
                  key={section._id}
                  size="small"
                  style={{ marginBottom: 12 }}
                  extra={
                    <Button
                      type="link"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeSection(section._id)}
                    >
                      Sil
                    </Button>
                  }
                >
                  <Row gutter={12}>
                    <Col span={12}>
                      <div style={{ marginBottom: 4, fontWeight: 500 }}>Bölmə Adı *</div>
                      <Input
                        value={section.name}
                        onChange={(e) => updateSection(section._id, 'name', e.target.value)}
                        placeholder="Məs: Ara Imtahan"
                      />
                    </Col>
                    <Col span={6}>
                      <div style={{ marginBottom: 4, fontWeight: 500 }}>Çəki (%) *</div>
                      <InputNumber
                        min={0}
                        max={100}
                        value={section.weight}
                        onChange={(value) => updateSection(section._id, 'weight', value || 0)}
                        style={{ width: '100%' }}
                      />
                    </Col>
                    <Col span={6}>
                      <div style={{ marginBottom: 4, fontWeight: 500 }}>Maksimum Bal *</div>
                      <InputNumber
                        min={1}
                        value={section.max_score}
                        onChange={(value) => updateSection(section._id, 'max_score', value || 100)}
                        style={{ width: '100%' }}
                      />
                    </Col>
                    <Col span={24} style={{ marginTop: 8 }}>
                      <div style={{ marginBottom: 4, fontWeight: 500 }}>Təsvir</div>
                      <Input.TextArea
                        rows={2}
                        value={section.description}
                        onChange={(e) => updateSection(section._id, 'description', e.target.value)}
                        placeholder="Bu bölmə haqqında əlavə məlumat"
                      />
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </Form>
        </Modal>
      </>
    );
  }

  const sectionsColumns = [
    {
      title: 'Bölmə Adı',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <strong>{name}</strong>,
    },
    {
      title: 'Təsvir',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => desc || '-',
    },
    {
      title: 'Çəki',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
      render: (weight: number) => <Tag color="purple">{weight}%</Tag>,
    },
    {
      title: 'Maksimum Bal',
      dataIndex: 'max_score',
      key: 'max_score',
      width: 150,
      render: (max: number) => <Tag color="blue">{max} bal</Tag>,
    },
  ];

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
              <h2 style={{ margin: 0 }}>
                <BookOutlined /> {activeSyllabus.name}
              </h2>
              {activeSyllabus.description && (
                <p style={{ color: '#666', marginTop: 8 }}>{activeSyllabus.description}</p>
              )}
            </div>
            {isTeacher && (
              <Button type="primary" icon={<EditOutlined />} onClick={handleCreateOrEdit}>
                Dəyişdir
              </Button>
            )}
          </div>

          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Status"
                  value="Aktiv"
                  prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Ümumi Çəki"
                  value={activeSyllabus.total_weight}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Bölmələr" value={sections.length} />
              </Card>
            </Col>
          </Row>

          <div>
            <h3 style={{ marginBottom: 16 }}>
              <BookOutlined /> Qiymətləndirmə Bölmələri
            </h3>
            <Table
              columns={sectionsColumns}
              dataSource={sections}
              rowKey="id"
              pagination={false}
              bordered
              loading={sectionsLoading}
            />
          </div>

          <Alert
            message="Qeyd"
            description="Bu tədris planı qrupun qiymətləndirmə sistemini müəyyən edir. Hər bir bölmənin çəkisi final qiymətə necə təsir edəcəyini göstərir."
            type="info"
            showIcon
          />
        </Space>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={activeSyllabus ? 'Qiymətləndirmə Meyarını Dəyişdir' : 'Yeni Qiymətləndirmə Meyarı'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="Yadda Saxla"
        cancelText="Ləğv et"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Meyar Adı"
            rules={[{ required: true, message: 'Meyar adı daxil edin' }]}
          >
            <Input placeholder="Məs: 2025 Payız Semestri" />
          </Form.Item>

          <Form.Item name="description" label="Təsvir">
            <Input.TextArea rows={3} placeholder="Qiymətləndirmə meyarları haqqında qısa məlumat" />
          </Form.Item>

          <Form.Item name="is_active" label="Aktiv" valuePropName="checked">
            <Switch />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <h4 style={{ margin: 0 }}>Qiymətləndirmə Bölmələri</h4>
              <Button icon={<PlusOutlined />} onClick={addSection}>
                Bölmə Əlavə Et
              </Button>
            </div>

            <Alert
              message={
                <span>
                  Ümumi Çəki: <strong>{totalWeight}%</strong>
                  {totalWeight !== 100 && (
                    <span style={{ color: '#ff4d4f', marginLeft: 8 }}>(100% olmalıdır)</span>
                  )}
                </span>
              }
              type={totalWeight === 100 ? 'success' : 'warning'}
              style={{ marginBottom: 12 }}
            />

            {formSections.map((section) => (
              <Card
                key={section._id}
                size="small"
                style={{ marginBottom: 12 }}
                extra={
                  <Button
                    type="link"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeSection(section._id)}
                  >
                    Sil
                  </Button>
                }
              >
                <Row gutter={12}>
                  <Col span={12}>
                    <div style={{ marginBottom: 4, fontWeight: 500 }}>Bölmə Adı *</div>
                    <Input
                      value={section.name}
                      onChange={(e) => updateSection(section._id, 'name', e.target.value)}
                      placeholder="Məs: Ara Imtahan"
                    />
                  </Col>
                  <Col span={6}>
                    <div style={{ marginBottom: 4, fontWeight: 500 }}>Çəki (%) *</div>
                    <InputNumber
                      min={0}
                      max={100}
                      value={section.weight}
                      onChange={(value) => updateSection(section._id, 'weight', value || 0)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={6}>
                    <div style={{ marginBottom: 4, fontWeight: 500 }}>Maksimum Bal *</div>
                    <InputNumber
                      min={1}
                      value={section.max_score}
                      onChange={(value) => updateSection(section._id, 'max_score', value || 100)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={24} style={{ marginTop: 8 }}>
                    <div style={{ marginBottom: 4, fontWeight: 500 }}>Təsvir</div>
                    <Input.TextArea
                      rows={2}
                      value={section.description}
                      onChange={(e) => updateSection(section._id, 'description', e.target.value)}
                      placeholder="Bu bölmə haqqında əlavə məlumat"
                    />
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default GroupSyllabus;

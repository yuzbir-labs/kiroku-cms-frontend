import React, { useState } from 'react';
import {
  Modal,
  Form,
  message,
  Spin,
  Alert,
  Tag,
  Space,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { PageHeader, FilterPanel } from '../../components/custom';
import { Table, Input, Select, Button } from '../../components/restyled';
import {
  useAttendanceListQuery,
  useCreateAttendanceMutation,
  usePartialUpdateAttendanceMutation,
  type Attendance,
  type AttendanceCreate,
  type AttendanceStatus,
} from '../../api';
import styles from './Attendance.module.css';

const AttendancePage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    AttendanceStatus | undefined
  >();
  const [dateFilter, setDateFilter] = useState<string | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(
    null
  );
  const [form] = Form.useForm();

  // Queries and mutations
  const {
    data: attendances,
    isLoading,
    error,
  } = useAttendanceListQuery({
    search: searchTerm || undefined,
    status: statusFilter,
    date: dateFilter,
  });

  const createMutation = useCreateAttendanceMutation(messageApi);
  const updateMutation = usePartialUpdateAttendanceMutation(messageApi);

  const handleCreate = () => {
    setEditingAttendance(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Attendance) => {
    setEditingAttendance(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date) : null,
    });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
      };

      if (editingAttendance) {
        updateMutation.mutate(
          {
            id: editingAttendance.id,
            data: { status: formData.status, notes: formData.notes },
          },
          {
            onSuccess: () => {
              setModalVisible(false);
              form.resetFields();
            },
          }
        );
      } else {
        createMutation.mutate(formData as AttendanceCreate, {
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
    setEditingAttendance(null);
  };

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

  const columns = [
    {
      title: 'Tələbə',
      dataIndex: 'student_name',
      key: 'student_name',
      sorter: (a: Attendance, b: Attendance) =>
        a.student_name.localeCompare(b.student_name),
    },
    {
      title: 'Kurs',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Qrup',
      dataIndex: 'course_group_name',
      key: 'course_group_name',
    },
    {
      title: 'Tarix',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: Attendance, b: Attendance) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => dayjs(date).format('DD.MM.YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AttendanceStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Qeyd edən',
      dataIndex: 'marked_by_name',
      key: 'marked_by_name',
      render: (text: string) => text || '-',
    },
    {
      title: 'Qeydlər',
      dataIndex: 'notes',
      key: 'notes',
      render: (text: string) => text || '-',
      ellipsis: true,
    },
    {
      title: 'Əməliyyatlar',
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: unknown, record: Attendance) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div className={styles.container}>
        <Alert
          message="Xəta"
          description="Davamiyyəti yükləmək mümkün olmadı"
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
        title="Davamiyyət"
        actions={[
          {
            label: 'Davamiyyət Qeyd Et',
            icon: <PlusOutlined />,
            onClick: handleCreate,
            type: 'primary',
          },
        ]}
      />

      <FilterPanel
        filters={{
          search: {
            type: 'input',
            placeholder: 'Tələbə axtar...',
            value: searchTerm,
            onChange: setSearchTerm,
          },
          status: {
            type: 'select',
            placeholder: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'İştirak edib', value: 'PRESENT' },
              { label: 'Qalıb', value: 'ABSENT' },
              { label: 'Gecikmə', value: 'LATE' },
              { label: 'Bağışlanıb', value: 'EXCUSED' },
            ],
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
            dataSource={attendances}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Cəmi: ${total}`,
            }}
            scroll={{ x: 1200 }}
          />
        )}
      </div>

      <Modal
        title={editingAttendance ? 'Davamiyyəti Redaktə Et' : 'Yeni Davamiyyət'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yadda saxla"
        cancelText="Ləğv et"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form form={form} layout="vertical" className={styles.form}>
          {!editingAttendance && (
            <>
              <Form.Item
                name="course_group"
                label="Qrup ID"
                rules={[{ required: true, message: 'Qrup ID daxil edin' }]}
                tooltip="Qrup seçmək üçün qrup ID-ni daxil edin. Qrup məlumatlarını Kurslar səhifəsindən əldə edə bilərsiniz."
              >
                <Input type="number" placeholder="Qrup ID daxil edin" />
              </Form.Item>
              <Form.Item
                name="student"
                label="Tələbə ID"
                rules={[{ required: true, message: 'Tələbə ID daxil edin' }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="date"
                label="Tarix"
                rules={[{ required: true, message: 'Tarix seçin' }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Status seçin' }]}
          >
            <Select
              options={[
                { label: 'İştirak edib', value: 'PRESENT' },
                { label: 'Qalıb', value: 'ABSENT' },
                { label: 'Gecikmə', value: 'LATE' },
                { label: 'Bağışlanıb', value: 'EXCUSED' },
              ]}
            />
          </Form.Item>
          <Form.Item name="notes" label="Qeydlər">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AttendancePage;

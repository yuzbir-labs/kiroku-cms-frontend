import React, { useEffect, useState } from 'react';
import { Modal, Select, Table, Tag, Spin, Alert, message, Input } from 'antd';
import {
  useAttendanceSessionQuery,
  useBulkUpdateAttendanceMutation,
  type AttendanceStatus,
  type BulkAttendanceUpdate,
} from 'api';

interface BulkUpdateModalProps {
  sessionId: number | null;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const statusOptions: {
  label: string;
  value: AttendanceStatus;
  color: string;
}[] = [
  { label: 'İştirak', value: 'PRESENT', color: 'success' },
  { label: 'Qalıb', value: 'ABSENT', color: 'error' },
  { label: 'Gecikmə', value: 'LATE', color: 'warning' },
  { label: 'Bağışlanıb', value: 'EXCUSED', color: 'blue' },
];

const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({
  sessionId,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [updates, setUpdates] = useState<Record<number, AttendanceStatus>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});

  const { data: session, isLoading, error } = useAttendanceSessionQuery(sessionId || 0);

  const bulkUpdateMutation = useBulkUpdateAttendanceMutation(messageApi);

  useEffect(() => {
    if (session) {
      const initialUpdates: Record<number, AttendanceStatus> = {};
      const initialNotes: Record<number, string> = {};
      session.attendance_records.forEach((record) => {
        initialUpdates[record.id] = record.status;
        if (record.notes) {
          initialNotes[record.id] = record.notes;
        }
      });
      setUpdates(initialUpdates);
      setNotes(initialNotes);
    }
  }, [session]);

  const handleStatusChange = (recordId: number, status: AttendanceStatus) => {
    setUpdates((prev) => ({ ...prev, [recordId]: status }));
  };

  const handleNoteChange = (recordId: number, note: string) => {
    setNotes((prev) => ({ ...prev, [recordId]: note }));
  };

  const handleSave = () => {
    if (!sessionId) return;

    const updatePayload: BulkAttendanceUpdate[] = Object.entries(updates).map(
      ([recordId, status]) => ({
        attendance_id: Number(recordId),
        status,
        notes: notes[Number(recordId)],
      })
    );

    bulkUpdateMutation.mutate(
      {
        sessionId,
        data: { updates: updatePayload },
      },
      {
        onSuccess: () => {
          onSuccess();
          onCancel();
        },
      }
    );
  };

  const columns = [
    {
      title: 'Tələbə',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, record: any) => (
        <Select
          value={updates[record.id]}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
        >
          {statusOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              <Tag color={option.color}>{option.label}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Qeyd',
      key: 'notes',
      render: (_: unknown, record: any) => (
        <Input
          placeholder="Qeyd əlavə et"
          value={notes[record.id] || ''}
          onChange={(e) => handleNoteChange(record.id, e.target.value)}
        />
      ),
    },
  ];

  return (
    <Modal
      title={`Davamiyyət: ${session ? session.date : ''}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={800}
      confirmLoading={bulkUpdateMutation.isPending}
      // destroyOnClose
    >
      {contextHolder}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message="Xəta baş verdi" type="error" showIcon />
      ) : (
        <Table
          dataSource={session?.attendance_records || []}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      )}
    </Modal>
  );
};

export default BulkUpdateModal;

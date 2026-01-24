import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Tag,
  message,
} from 'antd';
import {
  useCreateInquiryNoteMutation,
  useDeleteInquiryNoteMutation,
  useInquiryNotesQuery,
  useUpdateInquiryNoteMutation,
} from 'api';
import type { InquiryNote } from 'api/inquiries/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type React from 'react';
import { useState } from 'react';
import styles from './InquiryNotes.module.css';

dayjs.extend(relativeTime);

interface InquiryNotesProps {
  inquiryId: number;
}

const InquiryNotes: React.FC<InquiryNotesProps> = ({ inquiryId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<InquiryNote | null>(null);
  const [form] = Form.useForm();

  // Queries
  const { data: notes, isLoading } = useInquiryNotesQuery(inquiryId);

  // Mutations
  const createNoteMutation = useCreateInquiryNoteMutation(messageApi);
  const updateNoteMutation = useUpdateInquiryNoteMutation(messageApi);
  const deleteNoteMutation = useDeleteInquiryNoteMutation(messageApi);

  const handleOpenModal = (note?: InquiryNote) => {
    if (note) {
      setEditingNote(note);
      form.setFieldsValue({ note: note.note });
    } else {
      setEditingNote(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    form.resetFields();
  };

  const handleSubmit = async (values: { note: string }) => {
    try {
      if (editingNote) {
        await updateNoteMutation.mutateAsync({
          noteId: editingNote.id,
          data: { note: values.note },
        });
      } else {
        await createNoteMutation.mutateAsync({
          inquiryId,
          data: { note: values.note },
        });
      }
      handleCloseModal();
    } catch (error) {
      // Error handling is done by mutation
    }
  };

  const handleDelete = async (noteId: number) => {
    try {
      await deleteNoteMutation.mutateAsync(noteId);
    } catch (error) {
      // Error handling is done by mutation
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <Card
        title={
          <Space>
            <span>Qeydlər</span>
            <Tag color="blue">{notes?.length || 0}</Tag>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            Qeyd əlavə et
          </Button>
        }
      >
        {!notes || notes.length === 0 ? (
          <Empty description="Hələ qeyd yoxdur" />
        ) : (
          <List
            dataSource={notes}
            renderItem={(note) => (
              <List.Item
                key={note.id}
                actions={[
                  <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleOpenModal(note)}
                  >
                    Redaktə et
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="Qeydi silmək istədiyinizdən əminsiniz?"
                    onConfirm={() => handleDelete(note.id)}
                    okText="Bəli"
                    cancelText="Xeyr"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      Sil
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <span>{note.created_by_name || 'Naməlum'}</span>
                      <span className={styles.date}>
                        {dayjs(note.created_at).format('DD.MM.YYYY HH:mm')}
                      </span>
                      <span className={styles.relative}>
                        ({dayjs(note.created_at).fromNow()})
                      </span>
                    </Space>
                  }
                  description={<div className={styles.noteContent}>{note.note}</div>}
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Modal
        title={editingNote ? 'Qeydi redaktə et' : 'Yeni qeyd'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="note"
            label="Qeyd"
            rules={[{ required: true, message: 'Qeydi daxil edin' }]}
          >
            <Input.TextArea rows={6} placeholder="Qeyd daxil edin..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createNoteMutation.isPending || updateNoteMutation.isPending}
              >
                {editingNote ? 'Yenilə' : 'Əlavə et'}
              </Button>
              <Button onClick={handleCloseModal}>Ləğv et</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default InquiryNotes;

import React from 'react';
import { Empty, Card } from 'antd';
import { BookOutlined } from '@ant-design/icons';

interface GroupSyllabusProps {
  groupId: number;
}

const GroupSyllabus: React.FC<GroupSyllabusProps> = ({ groupId }) => {
  return (
    <Card>
      <Empty
        image={<BookOutlined style={{ fontSize: 64, color: '#999' }} />}
        description={
          <div>
            <h3>Sillabus Funksiyası Tezliklə Gələcək</h3>
            <p>Qrup ID: {groupId}</p>
            <p>Bu bölmədə tədris planını, mövzuları və dərsləri idarə edə biləcəksiniz.</p>
          </div>
        }
      />
    </Card>
  );
};

export default GroupSyllabus;

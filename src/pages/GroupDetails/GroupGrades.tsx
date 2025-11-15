import React from 'react';
import { Empty, Card } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

interface GroupGradesProps {
  groupId: number;
}

const GroupGrades: React.FC<GroupGradesProps> = ({ groupId }) => {
  return (
    <Card>
      <Empty
        image={<TrophyOutlined style={{ fontSize: 64, color: '#999' }} />}
        description={
          <div>
            <h3>Qiymətləndirmə Funksiyası Tezliklə Gələcək</h3>
            <p>Qrup ID: {groupId}</p>
            <p>
              Bu bölmədə tələbələrin qiymətlərini, sınaqlarını və performanslarını izləyə
              biləcəksiniz.
            </p>
          </div>
        }
      />
    </Card>
  );
};

export default GroupGrades;

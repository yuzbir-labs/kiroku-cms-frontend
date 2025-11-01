import React from 'react';
import { Layout, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <AntHeader className={styles.header}>
      <Button type="text" icon={<MenuOutlined />} onClick={onMenuClick}>
        Menyu
      </Button>
      <div className={styles.logo} onClick={() => navigate('/dashboard')}>
        <img src="/kiroku-icon.svg" alt="Kiroku" className={styles.logoImg} />
      </div>
    </AntHeader>
  );
};

export default Header;

import React, { useState } from 'react';
import { Layout, Button, Dropdown, Avatar, Space, message } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUserQuery, useLogoutMutation } from '../../api';
import { Loading } from '../../components';
import styles from './Header.module.css';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: user } = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation(messageApi);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Call logout API
      await logoutMutation.mutateAsync();
      // Clear all queries from cache
      queryClient.clear();
      // Small delay to ensure cache is cleared
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Navigate to login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Mənim Profilim',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Çıxış',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  if (isLoggingOut) {
    return <Loading />;
  }

  return (
    <AntHeader className={styles.header}>
      {contextHolder}
      <div className={styles.leftSection}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMenuClick}
          className={styles.menuButton}
        />
        <div className={styles.logo} onClick={() => navigate('/dashboard')}>
          <img src="/kiroku-icon.svg" alt="Kiroku" className={styles.logoImg} />
        </div>
      </div>
      <div className={styles.rightSection}>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <div className={styles.userMenu}>
            <Space>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                src={user?.profile_picture}
              />
              <span className={styles.userName}>{user?.full_name}</span>
              <DownOutlined />
            </Space>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;

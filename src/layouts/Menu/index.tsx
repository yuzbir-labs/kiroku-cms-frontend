import React, { useEffect, useMemo } from 'react';
import { Drawer, Menu as AntMenu, message, Avatar, Space } from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  BookOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
  PhoneOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation, useCurrentUserQuery } from '../../api';
import {
  canViewDashboard,
  canViewBranches,
  canViewCourses,
  canViewEnrollments,
  canViewAttendance,
  canViewInquiries,
  canManageUsers,
  getUserRoleLabel,
} from '../../utils/permissions';
import styles from './Menu.module.css';

interface MenuProps {
  visible: boolean;
  onClose: () => void;
  onMenuClick: (key: string) => void;
}

const Menu: React.FC<MenuProps> = ({ visible, onClose, onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: user } = useCurrentUserQuery();
  const logoutMutation = useLogoutMutation(messageApi);

  // Handle navigation after successful logout
  useEffect(() => {
    if (logoutMutation.isSuccess) {
      setTimeout(() => {
        navigate('/login');
        onClose();
      }, 500);
    }
  }, [logoutMutation.isSuccess, navigate, onClose]);

  const getSelectedKey = () => {
    return location.pathname;
  };

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      logoutMutation.mutate();
    } else {
      onMenuClick(key);
    }
  };

  // Dynamically generate menu items based on user permissions
  const mainMenuItems = useMemo(() => {
    if (!user) return [];

    const items = [];

    // Dashboard - not available to students
    if (canViewDashboard(user)) {
      items.push({
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'İdarə Paneli',
      });
    }

    // Branches - not available to students
    if (canViewBranches(user)) {
      items.push({
        key: '/branches',
        icon: <BankOutlined />,
        label: 'Filiallar',
      });
    }

    // Courses - not available to students
    if (canViewCourses(user)) {
      items.push({
        key: '/courses',
        icon: <BookOutlined />,
        label: 'Kurslar',
      });
    }

    // Enrollments - not available to students
    if (canViewEnrollments(user)) {
      items.push({
        key: '/enrollments',
        icon: <UserAddOutlined />,
        label: 'Qeydiyyatlar',
      });
    }

    // Attendance - students and teachers can view
    if (canViewAttendance(user)) {
      items.push({
        key: '/attendance',
        icon: <CheckCircleOutlined />,
        label: 'Davamiyyət',
      });
    }

    // Inquiries - only for managers and admins
    if (canViewInquiries(user)) {
      items.push({
        key: '/inquiries',
        icon: <PhoneOutlined />,
        label: 'Sorğular',
      });
    }

    // Users - only for managers and admins
    if (canManageUsers(user)) {
      items.push({
        key: '/users',
        icon: <UserOutlined />,
        label: 'İstifadəçilər',
      });
    }

    return items;
  }, [user]);

  const bottomMenuItems = [
    {
      key: '/profile',
      icon: <SettingOutlined />,
      label: 'Mənim Profilim',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Çıxış',
      danger: true,
    },
  ];

  return (
    <Drawer
      title={null}
      placement="left"
      onClose={onClose}
      open={visible}
      width={280}
      className={styles.drawer}
      closeIcon={<CloseOutlined />}
      headerStyle={{ display: 'none' }}
    >
      {contextHolder}
      <div className={styles.drawerContent}>
        <div className={styles.userSection}>
          <button onClick={onClose} className={styles.closeButton}>
            <CloseOutlined />
          </button>
          <Space direction="vertical" size={8} className={styles.userInfo}>
            <Avatar
              size={48}
              icon={<UserOutlined />}
              src={user?.profile_picture}
              className={styles.userAvatar}
            />
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.full_name || 'User'}</div>
              <div className={styles.userRole}>
                {getUserRoleLabel(user?.user_type)}
              </div>
            </div>
          </Space>
        </div>
        <div className={styles.menuContainer}>
          <AntMenu
            mode="vertical"
            selectedKeys={[getSelectedKey()]}
            items={mainMenuItems}
            onClick={({ key }) => handleMenuClick(key)}
            className={styles.menu}
          />
        </div>
        <div className={styles.bottomMenu}>
          <AntMenu
            mode="vertical"
            selectedKeys={[getSelectedKey()]}
            items={bottomMenuItems}
            onClick={({ key }) => handleMenuClick(key)}
            className={styles.menu}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default Menu;

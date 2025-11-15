import React from 'react';
import { Button } from '../../restyled';
import type { ButtonProps } from 'antd';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    type?: ButtonProps['type'];
    loading?: boolean;
    danger?: boolean;
  }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {actions && actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action, index) => (
            <Button
              key={index}
              type={action.type || 'default'}
              icon={action.icon}
              onClick={action.onClick}
              loading={action.loading}
              danger={action.danger}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

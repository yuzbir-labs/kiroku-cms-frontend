import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';
import styles from './Button.module.css';

export interface ButtonProps extends AntButtonProps {
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ className, type, ...props }) => {
  const classes = [styles.button, type === 'primary' ? styles.primary : '', className]
    .filter(Boolean)
    .join(' ');

  return <AntButton type={type} className={classes} {...props} />;
};

export default Button;

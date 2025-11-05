import React from 'react';
import { PropagateLoader } from 'react-spinners';
import styles from './Loading.module.css';

interface LoadingProps {
  fullScreen?: boolean;
  size?: number;
  color?: string;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  fullScreen = true,
  size = 15,
  color = '#667eea',
  text = 'Yüklənir...',
}) => {
  const containerClass = fullScreen
    ? styles.fullScreenContainer
    : styles.container;

  return (
    <div className={containerClass}>
      <div className={styles.content}>
        <PropagateLoader color={color} size={size} speedMultiplier={0.8} />
        {text && <p className={styles.text}>{text}</p>}
      </div>
    </div>
  );
};

export default Loading;

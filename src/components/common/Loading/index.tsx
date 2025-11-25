import React from 'react';
import { ScaleLoader } from "react-spinners";
import styles from './Loading.module.css';

interface LoadingProps {
  fullScreen?: boolean;
  barCount?: number;
  color?: string;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
	fullScreen = true,
	barCount = 7,
	color = "#667eea",
}) => {
	const containerClass = fullScreen
		? styles.fullScreenContainer
		: styles.container;

	return (
		<div className={containerClass}>
			<div className={styles.content}>
				<ScaleLoader
					barCount={barCount}
					color={color}
					height={80}
					loading
					margin={70}
					radius={5}
					speedMultiplier={1}
					width={10}
				/>
			</div>
		</div>
	);
};

export default Loading;

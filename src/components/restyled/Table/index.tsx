import { Table as AntTable } from 'antd';
import type { TableProps as AntTableProps } from 'antd';
import styles from './Table.module.css';

export type TableProps<T = object> = AntTableProps<T>;

export const Table = <T extends object>({
  className,
  ...props
}: TableProps<T>) => {
  const classes = [styles.table, className].filter(Boolean).join(' ');
  return <AntTable<T> className={classes} {...props} />;
};

export default Table;

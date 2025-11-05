import React from 'react';
import { Input, Select } from '../../restyled';
import type { DefaultOptionType } from 'antd/es/select';
import styles from './FilterPanel.module.css';

interface FilterItem {
  type: 'input' | 'select';
  placeholder?: string;
  value: string | number | boolean | number[] | undefined;
  onChange: (value: string | number | boolean | number[] | undefined) => void;
  options?: DefaultOptionType[];
  allowClear?: boolean;
  mode?: 'multiple' | 'tags';
  showSearch?: boolean;
}

interface FilterPanelProps {
  filters: Record<string, FilterItem>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters }) => {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {Object.entries(filters).map(([key, filter]) => (
          <div key={key} className={styles.item}>
            {filter.type === 'input' ? (
              <Input
                placeholder={filter.placeholder}
                value={filter.value as string}
                onChange={(e) => filter.onChange(e.target.value)}
                allowClear={filter.allowClear !== false}
              />
            ) : (
              <Select
                placeholder={filter.placeholder}
                value={filter.value}
                onChange={filter.onChange}
                options={filter.options}
                allowClear={filter.allowClear !== false}
                mode={filter.mode}
                showSearch={filter.showSearch}
                optionFilterProp={filter.showSearch ? 'label' : undefined}
                style={{ width: '100%' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;

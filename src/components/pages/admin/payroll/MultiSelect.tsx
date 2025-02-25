import React from "react";
import Select from 'react-select';

interface MultiSelectProps {
  items: string[];
  setFieldValue: (fieldName: string, value: string[]) => void;
  itemType: string;
  initialSelected?: string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<any>>;
}

interface SelectOption {
  value: string;
  label: string;
}

const MultiSelect = ({ items, setFieldValue, itemType, initialSelected, selected, setSelected }: MultiSelectProps) => {
  const options = items.map(item => ({
    value: item,
    label: item
  }));

  const value = selected.map(item => ({
    value: item,
    label: item
  }));

  const handleChange = (newValue: any) => {
    const values = (newValue as SelectOption[]).map(item => item.value);
    setFieldValue(itemType, values);
    setSelected((prev: any) => ({ ...prev, [itemType]: values }));
  };

  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={handleChange}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder={`Select ${itemType}/s`}
    />
  );
};

export default MultiSelect;

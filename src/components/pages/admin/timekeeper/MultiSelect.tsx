import { useEffect } from 'react';
import Select from 'react-select';

interface SelectedState {
  location: string[];
  department: string[];
  rate_status: string[];
}

interface MultiSelectProps {
  initialSelected: string[];
  setSelected: React.Dispatch<React.SetStateAction<any>>;
  selected: string[];
  items: string[];
  itemType: string;
  setFieldValue: (name: string, value: string[]) => void;
}

export default function MultiSelect({ 
  initialSelected,
  setSelected,
  selected,
  items = [],
  itemType,
  setFieldValue
}: MultiSelectProps) {

  useEffect(() => {
    if (initialSelected) {
      setSelected((prev: SelectedState) => ({ ...prev, [itemType]: initialSelected }));
    }
  }, [initialSelected, itemType, setSelected]);

  // Convert string array to options format required by react-select
  const options = items.map(item => ({
    value: item,
    label: item
  }));

  // Convert selected strings to options format
  const selectedOptions = selected.map(item => ({
    value: item,
    label: item
  }));

  const handleChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setSelected((prev: SelectedState) => ({ ...prev, [itemType]: selectedValues }));
    setFieldValue(itemType, selectedValues);
  };

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      className="w-full"
      classNamePrefix="select"
      placeholder={`Select ${itemType}`}
      isClearable={false}
      isSearchable={true}
    />
  );
}
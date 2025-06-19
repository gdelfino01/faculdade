import React from 'react';
import { TextField, MenuItem, Checkbox, ListItemText, Select, InputLabel, FormControl } from '@mui/material';

type Option = { value: string | number; label: string };

interface MultiSelectProps {
  label: string;
  name: string;
  options: Option[];
  defaultValue?: (string | number)[];
}

export function MultiSelect({ label, name, options, defaultValue = [] }: MultiSelectProps) {
  const [selected, setSelected] = React.useState<(string | number)[]>(defaultValue);

  return (
    <FormControl margin="dense" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        name={name}
        value={selected}
        onChange={(e) => setSelected(e.target.value as (string | number)[])}
        renderValue={(selected) =>
          (selected as (string | number)[])
            .map((val) => options.find((opt) => opt.value === val)?.label)
            .join(', ')
        }
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={selected.indexOf(option.value) > -1} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
      {/* Campos ocultos para enviar os valores no form */}
      {selected.map((val) => (
        <input key={val} type="hidden" name={name} value={val} />
      ))}
    </FormControl>
  );
}

import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Box,
  IconButton,
  Typography,
  OutlinedInput
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

type Option = { value: string; label: string };

interface MultiSelectWithQuantityProps {
  label: string;
  name: string;
  options: Option[];
  defaultValue?: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
}

export function MultiSelectWithQuantity({
  label,
  name,
  options,
  defaultValue = {},
  onChange,
}: MultiSelectWithQuantityProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const defaultKeys = Object.keys(defaultValue);
    setSelected(defaultKeys);
    setQuantities(defaultValue);
  }, [defaultValue]);

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    const updatedQuantities = { ...quantities };
    const newSelected = [...value];

    newSelected.forEach((item) => {
      if (!updatedQuantities[item]) {
        updatedQuantities[item] = 1;
      }
    });

    Object.keys(updatedQuantities).forEach(item => {
      if (!newSelected.includes(item)) {
        delete updatedQuantities[item];
      }
    });

    setSelected(newSelected);
    setQuantities(updatedQuantities);
    onChange(updatedQuantities);
  };

  const handleQuantityChange = (item: string, value: number) => {
    const updated = { ...quantities, [item]: value >= 0 ? value : 0 };
    setQuantities(updated);
    onChange(updated);
  };

  const handleRemoveItem = (item: string) => {
    const updatedSelected = selected.filter((i) => i !== item);
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[item];
    setSelected(updatedSelected);
    setQuantities(updatedQuantities);
    onChange(updatedQuantities);
  };

  return (
    <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        input={<OutlinedInput label={label} />}
        value={selected}
        onChange={handleSelectChange}
        renderValue={(selectedValues) =>
          selectedValues.map((val) => options.find((opt) => opt.value === val)?.label).join(', ')
        }
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={selected.includes(option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>

      {selected.map((item) => (
        <Box
          key={item}
          display="flex"
          alignItems="center"
          mt={1.5}
          gap={1}
          justifyContent="space-between"
          p={1}
          border={1}
          borderColor="grey.300"
          borderRadius={1}
        >
          <Box display="flex" alignItems="center" gap={1.5} flexGrow={1}>
            <TextField
              type="number"
              size="small"
              label="Qtd"
              value={quantities[item] || ''}
              onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
              inputProps={{ min: 1 }}
              style={{ width: '90px' }}
            />
            <Typography variant="body2">{options.find((opt) => opt.value === item)?.label || item}</Typography>
          </Box>
          <IconButton onClick={() => handleRemoveItem(item)} size="small" aria-label={`Remover ${item}`}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <input type="hidden" name={name} value={JSON.stringify(quantities)} />
    </FormControl>
  );
}

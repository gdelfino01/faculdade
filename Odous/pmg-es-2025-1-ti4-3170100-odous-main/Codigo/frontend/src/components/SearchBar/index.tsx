import React from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ placeholder = 'Pesquisar...', value, onChange }: SearchBarProps) {
  return (
    <Box marginY={1}>
      <TextField
        fullWidth
        variant="outlined"
        margin="dense"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          backgroundColor: "var(--search-bg)",
          input: {
            color: "var(--search-text)",
            "::placeholder": {
              color: "var(--search-placeholder)",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--search-border)",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {value && (
                <IconButton onClick={() => onChange("")} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

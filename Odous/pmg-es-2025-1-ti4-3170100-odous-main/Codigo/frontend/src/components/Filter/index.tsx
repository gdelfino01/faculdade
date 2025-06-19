import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

type FilterProps = {
    onFilterChange: (filter: string) => void;
    filters: string[];
};

const Filter = (props: FilterProps) => {
    const { onFilterChange, filters } = props;

    const [selectedFilter, setSelectedFilter] = useState('Todos');

    const handleFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
        if (newFilter !== null) {
            setSelectedFilter(newFilter);
            onFilterChange(newFilter);
        }
    };

    return (
      <ToggleButtonGroup
        value={selectedFilter}
        exclusive
        onChange={handleFilterChange}
        sx={{
          borderBottom: "1px solid var(--filter-border)",
          "& .MuiToggleButton-root": {
            color: "var(--filter-text)",
            border: "none",
            textTransform: "none",
            fontWeight: 400,
            backgroundColor: "transparent",
          },
          "& .MuiToggleButton-root.Mui-selected": {
            color: "var(--filter-selected-text)", 
            fontWeight: "bold",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&.Mui-focusVisible": {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        {filters.map((filter) => (
          <ToggleButton key={filter} value={filter}>
            {filter}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
};

export default Filter;

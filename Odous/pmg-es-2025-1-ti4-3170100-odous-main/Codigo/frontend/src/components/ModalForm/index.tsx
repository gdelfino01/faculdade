import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    MenuItem,
} from '@mui/material';
import { MultiSelectWithQuantity } from '../MultiSelectWithQuantity'; // ajuste o caminho conforme seu projeto

type Field = {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    autoFocus?: boolean;
    options?: { value: string | number; label: string }[];
};

interface ModalFormProps {
    open: boolean;
    title: string;
    description?: string;
    fields: Field[];
    onClose: () => void;
    onSubmit: (formData: Record<string, string>) => void;
    submitLabel?: string;
    cancelLabel?: string;
    initialValues?: Record<string, string>;
}

export default function ModalForm({
    open,
    title,
    description,
    fields,
    onClose,
    onSubmit,
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    initialValues = {},
}: ModalFormProps) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const data: Record<string, string> = {};
              for (const [key, value] of formData.entries()) {
                data[key] = value.toString();
              }
              onSubmit(data);
              onClose();
            },
            sx: {
              backgroundColor: "var(--modal-bg)",
              color: "var(--modal-text)",
            },
          },
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {description && (
            <DialogContentText
              sx={{
                color: "var(--text-color)",
                fontSize: "14px",
              }}
            >
              {description}
            </DialogContentText>
          )}
          {fields.map((field) => {
            if (field.type === "select") {
              return (
                <TextField
                  key={field.name}
                  select
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  label={field.label}
                  name={field.name}
                  required={field.required}
                  defaultValue={initialValues[field.name] || ""}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--input-background)",
                      color: "var(--modal-text)",
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--modal-text)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--modal-border)",
                    },
                  }}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              );
            } else if (field.type === "multiSelectWithQuantity") {
              return (
                <MultiSelectWithQuantity
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  options={(field.options || []).map((opt) => ({
                    ...opt,
                    value: String(opt.value),
                  }))}
                  defaultValue={
                    initialValues[field.name]
                      ? JSON.parse(initialValues[field.name])
                      : {}
                  }
                  onChange={(val) => {
                    const hiddenInput = document.querySelector(
                      `input[name="${field.name}"]`
                    ) as HTMLInputElement;
                    if (hiddenInput) hiddenInput.value = JSON.stringify(val);
                  }}
                />
              );
            } else {
              return (
                <TextField
                  key={field.name}
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  autoFocus={field.autoFocus}
                  defaultValue={initialValues[field.name] || ""}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--input-background)",
                      color: "var(--modal-text)",
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--modal-text)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--modal-border)",
                    },
                  }}
                />
              );
            }
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{cancelLabel}</Button>
          <Button type="submit">{submitLabel}</Button>
        </DialogActions>
      </Dialog>
    );
}

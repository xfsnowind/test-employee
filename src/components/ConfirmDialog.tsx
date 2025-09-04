import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

type ConfirmDialogProps = {
  title: string;
  message: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  loading?: boolean;
};

export default function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      data-testid="confirm-dialog"
    >
      {title && <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>}
      <DialogContent>
        {message && (
          <DialogContentText data-testid="confirm-dialog-message">
            {message}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          disabled={loading}
          data-testid="confirm-dialog-cancel-button"
        >
          {cancelLabel}
        </Button>
        <Button
          data-testid="confirm-dialog-confirm-button"
          onClick={onConfirm}
          disabled={loading}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

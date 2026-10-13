import Modal from './Modal';
import { Typography, Box } from '@mui/material';
import Button from './Button';

const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Confirm', message, loading = false }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button color="error" loading={loading} onClick={onConfirm}>
            Confirm
          </Button>
        </Box>
      }
    >
      <Typography>{message}</Typography>
    </Modal>
  );
};

export default ConfirmDialog;
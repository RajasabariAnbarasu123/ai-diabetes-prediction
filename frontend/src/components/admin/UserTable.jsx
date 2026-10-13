import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, TextField, Box, TablePagination,
  LinearProgress, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Tooltip, InputAdornment, Skeleton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { fetchUsers, disableUser, enableUser, deleteUser } from '../../store/slices/adminSlice';
import usePagination from '../../hooks/usePagination';
import useDebounce from '../../hooks/useDebounce';
import { showToast } from '../common/Toast';

const UserTable = () => {
  const dispatch = useDispatch();
  const { users, loading, pagination } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const { page, size, goToPage } = usePagination();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  useEffect(() => {
    dispatch(fetchUsers({ page, size, search: debouncedSearch }));
  }, [dispatch, page, size, debouncedSearch]);

  const handleDisable = (userId) => {
    dispatch(disableUser(userId))
      .unwrap()
      .then(() => {
        showToast.success('User disabled successfully!');
      })
      .catch((err) => {
        showToast.error(err || 'Failed to disable user.');
      });
  };

  const handleEnable = (userId) => {
    dispatch(enableUser(userId))
      .unwrap()
      .then(() => {
        showToast.success('User enabled successfully!');
      })
      .catch((err) => {
        showToast.error(err || 'Failed to enable user.');
      });
  };

  const confirmDelete = () => {
    if (!deleteDialog.user) return;
    const userId = deleteDialog.user.id;
    dispatch(deleteUser(userId))
      .unwrap()
      .then(() => {
        showToast.success(`User ${deleteDialog.user.name || deleteDialog.user.email} deleted successfully!`);
        setDeleteDialog({ open: false, user: null });
        dispatch(fetchUsers({ page, size, search: debouncedSearch }));
      })
      .catch((err) => {
        showToast.error(err || 'Failed to delete user.');
        setDeleteDialog({ open: false, user: null });
      });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header & Search */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Registered System Users ({pagination.totalElements || users.length})
        </Typography>
        <TextField
          size="small"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 320 }, bgcolor: 'background.paper', borderRadius: 2 }}
        />
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        {loading && <LinearProgress color="primary" />}

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && users.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton width={140} /></TableCell>
                    <TableCell><Skeleton width={180} /></TableCell>
                    <TableCell><Skeleton width={80} /></TableCell>
                    <TableCell><Skeleton width={80} /></TableCell>
                    <TableCell align="right"><Skeleton width={100} /></TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <PersonOutlineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                    <Typography variant="body1" color="text.secondary" fontWeight={600}>
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => {
                  const isEnabled = u.enabled ?? u.active ?? true;
                  return (
                    <TableRow key={u.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{u.name || 'User #' + u.id}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={isEnabled ? 'Active' : 'Disabled'}
                          color={isEnabled ? 'success' : 'error'}
                          size="small"
                          sx={{ fontWeight: 700, borderRadius: 1.5 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={u.role || 'PATIENT'}
                          variant="outlined"
                          size="small"
                          color={u.role === 'ADMIN' ? 'primary' : 'default'}
                          sx={{ fontWeight: 600, borderRadius: 1.5 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {isEnabled ? (
                          <Tooltip title="Disable user access">
                            <IconButton size="small" onClick={() => handleDisable(u.id)} color="warning">
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Enable user access">
                            <IconButton size="small" onClick={() => handleEnable(u.id)} color="success">
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete user profile permanently">
                          <IconButton size="small" onClick={() => setDeleteDialog({ open: true, user: u })} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={pagination.totalElements || users.length}
          page={page}
          onPageChange={(e, newPage) => goToPage(newPage)}
          rowsPerPage={size}
          rowsPerPageOptions={[size]}
        />
      </Paper>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm User Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to permanently delete user{' '}
            <strong>{deleteDialog.user?.name || deleteDialog.user?.email}</strong>?
          </Typography>
          <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 600 }}>
            ⚠️ This will remove all associated predictions, health records, and profile data permanently.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" sx={{ borderRadius: 2 }}>
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTable;
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Chip, LinearProgress, Skeleton
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { fetchActivityLogs } from '../../store/slices/adminSlice';
import usePagination from '../../hooks/usePagination';

const ActivityLogTable = () => {
  const dispatch = useDispatch();
  const { activityLogs, loading } = useSelector((state) => state.admin);
  const { page, size } = usePagination();

  useEffect(() => {
    dispatch(fetchActivityLogs({ page, size }));
  }, [dispatch, page, size]);

  const logsToDisplay = activityLogs || [];

  const getActionColor = (action) => {
    if (!action) return 'default';
    if (action.includes('PREDICTION')) return 'primary';
    if (action.includes('LOGIN')) return 'success';
    if (action.includes('REPORT') || action.includes('UPLOAD')) return 'info';
    if (action.includes('ADMIN') || action.includes('DELETE')) return 'warning';
    return 'default';
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      {loading && <LinearProgress color="primary" />}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'action.hover' }}>
        <Typography variant="h6" fontWeight={700}>Real-time Activity Logs</Typography>
        <Chip label={`${logsToDisplay.length} Recorded Events`} size="small" color="primary" sx={{ fontWeight: 700 }} />
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>User / Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action Performed</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>IP Address</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && logsToDisplay.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton width={140} /></TableCell>
                  <TableCell><Skeleton width={160} /></TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell align="right"><Skeleton width={60} /></TableCell>
                </TableRow>
              ))
            ) : logsToDisplay.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <ReceiptLongIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    No activity logs recorded yet in database.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              logsToDisplay.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ fontSize: '0.85rem' }}>
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : '--'}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {log.userName || 'System User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {log.userEmail || ''}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.action || 'USER_ACTIVITY'}
                      color={getActionColor(log.action)}
                      size="small"
                      sx={{ fontWeight: 700, borderRadius: 1.5 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {log.ipAddress || 'Internal'}
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={log.status || 'COMPLETED'} color="success" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ActivityLogTable;
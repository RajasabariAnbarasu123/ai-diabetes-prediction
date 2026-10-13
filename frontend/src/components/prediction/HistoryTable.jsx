import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  Box,
  TablePagination,
  Chip,
  Tooltip,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  fetchPredictions,
  comparePredictions,
  clearComparison,
} from '../../store/slices/predictionSlice';
import RiskBadge from '../common/RiskBadge';
import Button from '../common/Button';
import ComparisonModal from './ComparisonModal';
import usePagination from '../../hooks/usePagination';
import useDebounce from '../../hooks/useDebounce';
import predictionService from '../../services/predictionService';
import { showToast } from '../common/Toast';

const HistoryTable = () => {
  const dispatch = useDispatch();
  const { predictions, loading, pagination, comparison } = useSelector((state) => state.prediction);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const debouncedSearch = useDebounce(search);
  const { page, size, setPage, goToPage, setPaginationInfo } = usePagination();

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, setPage]);

  useEffect(() => {
    dispatch(fetchPredictions({ page, size, search: debouncedSearch }));
  }, [dispatch, page, size, debouncedSearch]);

  useEffect(() => {
    if (pagination && pagination.totalPages !== undefined) {
      setPaginationInfo({
        page: pagination.page,
        totalPages: pagination.totalPages,
        totalElements: pagination.totalElements,
      });
    }
  }, [pagination, setPaginationInfo]);

  const handleSelect = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length < 2) return [...prev, id];
      return [prev[1], id]; // rolling window of 2
    });
  };

  const handleCompare = async () => {
    if (selected.length !== 2) return;
    setCompareLoading(true);
    setCompareOpen(true);
    dispatch(clearComparison());
    await dispatch(comparePredictions(selected));
    setCompareLoading(false);
  };

  const handleCloseCompare = () => {
    setCompareOpen(false);
    dispatch(clearComparison());
  };

  const handleDelete = async (id) => {
    try {
      await predictionService.deletePrediction(id);
      dispatch(fetchPredictions({ page, size, search: debouncedSearch }));
      setSelected((prev) => prev.filter((x) => x !== id));
      showToast.success('Prediction deleted');
    } catch {
      showToast.error('Failed to delete prediction');
    }
  };

  const selectionHint =
    selected.length === 0
      ? 'Select 2 predictions to compare them'
      : selected.length === 1
      ? 'Select 1 more prediction to compare'
      : 'Ready to compare — click Compare';

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search history..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 180 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
          {selectionHint}
        </Typography>
        <Button
          variant="contained"
          disabled={selected.length !== 2}
          startIcon={<CompareArrowsIcon />}
          onClick={handleCompare}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Compare ({selected.length}/2)
        </Button>
      </Box>

      {/* Selection hint on mobile */}
      {selected.length < 2 && (
        <Alert severity="info" icon={<CompareArrowsIcon />} sx={{ mb: 2, borderRadius: 2, py: 0.5 }}>
          {selectionHint}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'action.hover' } }}>
              <TableCell sx={{ width: 50 }}>Select</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Risk</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>HbA1c</TableCell>
              <TableCell>Fasting BS</TableCell>
              <TableCell>BMI</TableCell>
              <TableCell sx={{ width: 60 }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predictions.map((pred, idx) => {
              const isSelected = selected.includes(pred.id);
              const selectionOrder = selected.indexOf(pred.id);
              return (
                <TableRow
                  key={pred.id}
                  hover
                  onClick={() => handleSelect(pred.id)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: isSelected ? 'primary.main' + '08' : 'transparent',
                    outline: isSelected ? '2px solid' : 'none',
                    outlineColor: 'primary.main',
                    transition: 'all 0.15s ease',
                    '&:hover': { bgcolor: isSelected ? 'primary.main' + '12' : 'action.hover' },
                  }}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Tooltip title={isSelected ? `Deselect (${selectionOrder === 0 ? 'A' : 'B'})` : 'Select for comparison'}>
                      <IconButton size="small" onClick={() => handleSelect(pred.id)} color={isSelected ? 'primary' : 'default'}>
                        {isSelected ? (
                          <CheckCircleIcon fontSize="small" />
                        ) : (
                          <RadioButtonUncheckedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    {isSelected && (
                      <Chip
                        label={selectionOrder === 0 ? 'A' : 'B'}
                        size="small"
                        color={selectionOrder === 0 ? 'primary' : 'secondary'}
                        sx={{ ml: 0.5, height: 18, fontSize: 10, fontWeight: 700 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {new Date(pred.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {new Date(pred.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </TableCell>
                  <TableCell><RiskBadge level={pred.diabetesRisk} size="small" /></TableCell>
                  <TableCell>
                    <Typography variant="caption" fontWeight={500} color="text.secondary">
                      {pred.diabetesStage?.replace(/_/g, ' ') || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>{pred.hba1c ? `${pred.hba1c}%` : '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{pred.fastingBloodSugar ? `${pred.fastingBloodSugar} mg/dL` : '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{pred.bmi ? parseFloat(pred.bmi.toFixed(1)) : '—'}</Typography>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Delete prediction">
                      <IconButton size="small" color="error" onClick={() => handleDelete(pred.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {predictions.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No predictions found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pagination.totalElements}
          page={page}
          onPageChange={(e, newPage) => goToPage(newPage)}
          rowsPerPage={size}
          rowsPerPageOptions={[size]}
        />
      </TableContainer>

      {/* Comparison Modal */}
      <ComparisonModal
        open={compareOpen}
        onClose={handleCloseCompare}
        comparison={comparison}
        loading={compareLoading}
      />
    </Box>
  );
};

export default HistoryTable;
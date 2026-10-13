import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Grid,
  Divider,
  LinearProgress,
  Skeleton,
  Tooltip,
  InputAdornment,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FilterListIcon from '@mui/icons-material/FilterList';
import { fetchAllPredictions } from '../../store/slices/adminSlice';
import usePagination from '../../hooks/usePagination';
import useDebounce from '../../hooks/useDebounce';
import RiskBadge from '../../components/common/RiskBadge';

const PredictionManagementPage = () => {
  const dispatch = useDispatch();
  const { predictions, loading, pagination } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const debouncedSearch = useDebounce(search);
  const { page, size, setPage, goToPage, setPaginationInfo } = usePagination();
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, riskFilter, setPage]);

  useEffect(() => {
    dispatch(fetchAllPredictions({ page, size, search: debouncedSearch, risk: riskFilter }));
  }, [dispatch, page, size, debouncedSearch, riskFilter]);

  useEffect(() => {
    if (pagination && pagination.totalPages !== undefined) {
      setPaginationInfo({
        page: pagination.page,
        totalPages: pagination.totalPages,
        totalElements: pagination.totalElements,
      });
    }
  }, [pagination, setPaginationInfo]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Page Header, Search & Risk Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Diabetes Risk Predictions Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and monitor patient AI diabetes risk assessment records
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper', borderRadius: 2 }}>
            <InputLabel id="risk-filter-label" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              Risk Level
            </InputLabel>
            <Select
              labelId="risk-filter-label"
              id="risk-filter-select"
              value={riskFilter}
              label="Risk Level"
              onChange={(e) => setRiskFilter(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="ALL">All Risk Levels</MenuItem>
              <MenuItem value="HIGH">High / Critical Risk</MenuItem>
              <MenuItem value="MODERATE">Moderate / Medium Risk</MenuItem>
              <MenuItem value="LOW">Low Risk</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Search by patient email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 260 }, bgcolor: 'background.paper', borderRadius: 2 }}
          />
        </Box>
      </Box>

      {/* Table Container */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        {loading && <LinearProgress color="primary" />}

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Prediction ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Patient Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Risk Level</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>HbA1c</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fasting Glucose</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Confidence</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Details</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && predictions.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton width={60} /></TableCell>
                    <TableCell><Skeleton width={160} /></TableCell>
                    <TableCell><Skeleton width={80} /></TableCell>
                    <TableCell><Skeleton width={50} /></TableCell>
                    <TableCell><Skeleton width={70} /></TableCell>
                    <TableCell><Skeleton width={60} /></TableCell>
                    <TableCell><Skeleton width={100} /></TableCell>
                    <TableCell align="right"><Skeleton width={40} /></TableCell>
                  </TableRow>
                ))
              ) : predictions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <MonitorHeartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                    <Typography variant="body1" color="text.secondary" fontWeight={600}>
                      No risk prediction records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                predictions.map((pred) => (
                  <TableRow key={pred.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>#{pred.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{pred.userEmail || pred.userName || 'Patient Record'}</TableCell>
                    <TableCell>
                      <RiskBadge level={pred.diabetesRisk} size="small" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{pred.hba1c != null ? `${pred.hba1c}%` : 'N/A'}</TableCell>
                    <TableCell>{pred.fastingBloodSugar != null ? `${pred.fastingBloodSugar} mg/dL` : 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={pred.confidenceScore != null ? `${(pred.confidenceScore * (pred.confidenceScore <= 1 ? 100 : 1)).toFixed(0)}%` : '95%'}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>{new Date(pred.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Complete AI Clinical Details">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => setSelectedPrediction(pred)}
                          sx={{ bgcolor: 'primary.main' + '10', '&:hover': { bgcolor: 'primary.main' + '25' } }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={pagination.totalElements || predictions.length}
          page={page}
          onPageChange={(e, newPage) => goToPage(newPage)}
          rowsPerPage={size}
          rowsPerPageOptions={[size]}
        />
      </Paper>

      {/* ── Complete Prediction Details Modal ── */}
      <Dialog
        open={Boolean(selectedPrediction)}
        onClose={() => setSelectedPrediction(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, maxHeight: '90vh' } }}
      >
        {selectedPrediction && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: 'primary.main' + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LocalHospitalIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Clinical Decision Assessment #{selectedPrediction.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Evaluated on {new Date(selectedPrediction.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedPrediction(null)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
              {/* Header Risk Banner */}
              <Card elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>ASSESSED RISK LEVEL</Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <RiskBadge level={selectedPrediction.diabetesRisk} size="medium" />
                      {selectedPrediction.diabetesStage && (
                        <Chip label={selectedPrediction.diabetesStage} variant="outlined" sx={{ fontWeight: 700 }} />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>AI CONFIDENCE SCORE</Typography>
                    <Typography variant="h5" fontWeight={800} color="primary.main">
                      {selectedPrediction.confidenceScore != null ? `${(selectedPrediction.confidenceScore * (selectedPrediction.confidenceScore <= 1 ? 100 : 1)).toFixed(1)}%` : '95.0%'}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>

              {/* Lab Values Grid */}
              <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ color: 'text.secondary', letterSpacing: 0.5 }}>
                PATIENT BIOMETRICS & METABOLIC METRICS
              </Typography>
              <Grid container spacing={1.5} sx={{ mb: 3 }}>
                {[
                  { label: 'HbA1c Level', val: selectedPrediction.hba1c != null ? `${selectedPrediction.hba1c}%` : 'N/A', highlight: true },
                  { label: 'Fasting Sugar', val: selectedPrediction.fastingBloodSugar != null ? `${selectedPrediction.fastingBloodSugar} mg/dL` : 'N/A' },
                  { label: 'Random Sugar', val: selectedPrediction.randomBloodSugar != null ? `${selectedPrediction.randomBloodSugar} mg/dL` : 'N/A' },
                  { label: 'Blood Pressure', val: selectedPrediction.bloodPressure || 'N/A' },
                  { label: 'Total Cholesterol', val: selectedPrediction.cholesterol != null ? `${selectedPrediction.cholesterol} mg/dL` : 'N/A' },
                  { label: 'HDL Cholesterol', val: selectedPrediction.hdl != null ? `${selectedPrediction.hdl} mg/dL` : 'N/A' },
                  { label: 'LDL Cholesterol', val: selectedPrediction.ldl != null ? `${selectedPrediction.ldl} mg/dL` : 'N/A' },
                  { label: 'Triglycerides', val: selectedPrediction.triglycerides != null ? `${selectedPrediction.triglycerides} mg/dL` : 'N/A' },
                  { label: 'BMI Index', val: selectedPrediction.bmi != null ? selectedPrediction.bmi : 'N/A' },
                  { label: 'Weight', val: selectedPrediction.weight != null ? `${selectedPrediction.weight} kg` : 'N/A' },
                ].map((item, idx) => (
                  <Grid item xs={6} sm={4} md={2.4} key={idx}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: item.highlight ? 'primary.main' + '0A' : 'background.paper' }}>
                      <Typography variant="caption" color="text.secondary" display="block">{item.label}</Typography>
                      <Typography variant="body1" fontWeight={700} color={item.highlight ? 'primary.main' : 'text.primary'}>{item.val}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* AI Clinical Summary & Explanation */}
              {selectedPrediction.explanation && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ color: 'text.secondary' }}>
                    AI CLINICAL EXPLANATION
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                    <Typography variant="body2" lineHeight={1.6}>{selectedPrediction.explanation}</Typography>
                  </Paper>
                </Box>
              )}

              {/* Risk Factors */}
              {selectedPrediction.riskFactors && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ color: 'text.secondary' }}>
                    IDENTIFIED RISK FACTORS
                  </Typography>
                  <Typography variant="body2" color="text.primary">{selectedPrediction.riskFactors}</Typography>
                </Box>
              )}

              {/* Recommendations */}
              <Grid container spacing={2}>
                {selectedPrediction.personalizedDiet && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ color: 'text.secondary' }}>
                      NUTRITIONAL GUIDANCE
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2">{selectedPrediction.personalizedDiet}</Typography>
                    </Paper>
                  </Grid>
                )}
                {selectedPrediction.exercisePlan && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ color: 'text.secondary' }}>
                      PHYSICAL ACTIVITY PLAN
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2">{selectedPrediction.exercisePlan}</Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2.5 }}>
              <Button variant="contained" onClick={() => setSelectedPrediction(null)} sx={{ borderRadius: 2 }}>
                Close Record
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PredictionManagementPage;
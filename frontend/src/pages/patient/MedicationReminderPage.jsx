import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
  useTheme,
} from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmailIcon from '@mui/icons-material/Email';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Modal from '../../components/common/Modal';
import MedicationForm from '../../components/forms/MedicationForm';
import medicationService from '../../services/medicationService';
import { showToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';

const TIME_SLOTS = [
  {
    key: 'morning',
    timeKey: 'morningTime',
    label: 'Morning',
    icon: <WbSunnyIcon />,
    defaultTime: '08:00',
    color: '#f59e0b',
    grad: 'linear-gradient(135deg, #f59e0b20, #fbbf2410)',
    border: '#f59e0b30',
  },
  {
    key: 'afternoon',
    timeKey: 'afternoonTime',
    label: 'Afternoon',
    icon: <LunchDiningIcon />,
    defaultTime: '13:00',
    color: '#06b6d4',
    grad: 'linear-gradient(135deg, #06b6d420, #22d3ee10)',
    border: '#06b6d430',
  },
  {
    key: 'night',
    timeKey: 'nightTime',
    label: 'Night',
    icon: <NightsStayIcon />,
    defaultTime: '20:00',
    color: '#8b5cf6',
    grad: 'linear-gradient(135deg, #8b5cf620, #a78bfa10)',
    border: '#8b5cf630',
  },
];

const HEALTH_TIPS = [
  'Take medications with a full glass of water unless instructed otherwise.',
  'Set phone alarms to never miss a dose — consistency is key.',
  'Never skip or double-dose; contact your doctor if you miss a dose.',
  'Store medications at room temperature away from humidity.',
];

// Helper to convert "HH:mm" 24h to "h:mm AM/PM"
const formatTime12h = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return timeStr;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${m < 10 ? '0' + m : m} ${period}`;
};

const MedicationReminderPage = () => {
  const theme = useTheme();
  const [medications, setMedications] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editMed, setEditMed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchMedications = async () => {
    try {
      const data = await medicationService.getMedications();
      setMedications(Array.isArray(data) ? data : []);
    } catch {
      showToast.error('Failed to load medications');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  // Client-side real-time reminder trigger check every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentHHmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      medications.forEach((med) => {
        if (med.morning && med.morningTime === currentHHmm) {
          showToast.info(`⏰ Morning Medication Time! Take ${med.medicineName} (${med.dose})`);
        }
        if (med.afternoon && med.afternoonTime === currentHHmm) {
          showToast.info(`⏰ Afternoon Medication Time! Take ${med.medicineName} (${med.dose})`);
        }
        if (med.night && med.nightTime === currentHHmm) {
          showToast.info(`⏰ Night Medication Time! Take ${med.medicineName} (${med.dose})`);
        }
      });
    }, 30000);

    return () => clearInterval(timer);
  }, [medications]);

  const handleDelete = async (id) => {
    try {
      await medicationService.deleteMedication(id);
      showToast.success('Medication deleted');
      fetchMedications();
    } catch {
      showToast.error('Failed to delete');
    }
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (editMed) {
        await medicationService.updateMedication(editMed.id, data);
      } else {
        await medicationService.createMedication(data);
      }
      showToast.success('Medication saved & reminder scheduled!');
      setOpenForm(false);
      setEditMed(null);
      fetchMedications();
    } catch {
      showToast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const getMedsForSlot = (slot) => medications.filter((m) => m[slot]);
  const totalActiveMeds = medications.length;

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Avatar sx={{ bgcolor: '#6366f118', width: 40, height: 40 }}>
              <MedicationIcon sx={{ color: '#6366f1', fontSize: 22 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={800}>
              Medication Reminders
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {totalActiveMeds > 0
              ? `${totalActiveMeds} medication${totalActiveMeds !== 1 ? 's' : ''} active with automated App & Email alerts`
              : 'Configure your daily medications and automated alerts'}
          </Typography>
        </Box>
        <Button
          startIcon={<AddIcon />}
          onClick={() => { setEditMed(null); setOpenForm(true); }}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #6366f1)' },
            boxShadow: '0 4px 14px #6366f140',
          }}
        >
          Add Medication
        </Button>
      </Box>

      {/* Summary Stats */}
      {medications.length > 0 && (
        <Grid container spacing={2} mb={3}>
          {[
            { label: 'Total Medications', value: medications.length, color: '#6366f1', icon: <LocalPharmacyIcon /> },
            { label: 'Morning Doses', value: getMedsForSlot('morning').length, color: '#f59e0b', icon: <WbSunnyIcon /> },
            { label: 'Afternoon Doses', value: getMedsForSlot('afternoon').length, color: '#06b6d4', icon: <LunchDiningIcon /> },
            { label: 'Night Doses', value: getMedsForSlot('night').length, color: '#8b5cf6', icon: <NightsStayIcon /> },
          ].map(({ label, value, color, icon }) => (
            <Grid item xs={6} sm={3} key={label}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: color + '18', color, width: 36, height: 36 }}>{icon}</Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ color, lineHeight: 1 }}>{value}</Typography>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {medications.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 4,
            border: '2px dashed',
            borderColor: 'divider',
            textAlign: 'center',
            mb: 3,
          }}
        >
          <Avatar sx={{ bgcolor: '#6366f118', width: 64, height: 64, mx: 'auto', mb: 2 }}>
            <LocalPharmacyIcon sx={{ color: '#6366f1', fontSize: 32 }} />
          </Avatar>
          <Typography variant="h6" fontWeight={700} mb={1}>No medications added</Typography>
          <Typography variant="body2" color="text.secondary" mb={2.5}>
            Add your medications to enable automatic App & Email alerts at your set times.
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => { setEditMed(null); setOpenForm(true); }}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
          >
            Add First Medication
          </Button>
        </Paper>
      ) : (
        <>
          {/* Time Slot Cards */}
          <Typography variant="h6" fontWeight={700} mb={2}>
            <NotificationsActiveIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 22 }} />
            Daily Schedule & Alert Times
          </Typography>
          <Grid container spacing={2.5} mb={3}>
            {TIME_SLOTS.map((slot) => {
              const slotMeds = getMedsForSlot(slot.key);
              return (
                <Grid item xs={12} md={4} key={slot.key}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: slot.border,
                      background: slot.grad,
                      height: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar sx={{ bgcolor: slot.color + '18', color: slot.color, width: 40, height: 40 }}>
                        {slot.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>{slot.label}</Typography>
                        <Typography variant="caption" color="text.secondary">Dose Slot</Typography>
                      </Box>
                      <Chip
                        label={`${slotMeds.length} med${slotMeds.length !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{ ml: 'auto', bgcolor: slot.color + '18', color: slot.color, fontWeight: 700, height: 22, fontSize: 11 }}
                      />
                    </Box>
                    {slotMeds.length === 0 ? (
                      <Typography variant="body2" color="text.disabled" fontStyle="italic" textAlign="center" py={1.5}>
                        No medications for {slot.label.toLowerCase()}
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {slotMeds.map((med) => {
                          const specificTime = med[slot.timeKey] || slot.defaultTime;
                          return (
                            <Box
                              key={med.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1.25,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <MedicationIcon sx={{ fontSize: 18, color: slot.color }} />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" fontWeight={700} noWrap>{med.medicineName}</Typography>
                                <Typography variant="caption" color="text.secondary">{med.dose}</Typography>
                              </Box>
                              <Chip
                                label={formatTime12h(specificTime)}
                                size="small"
                                sx={{ bgcolor: slot.color + '18', color: slot.color, fontWeight: 700, fontSize: 10, height: 20 }}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          {/* All Medications List */}
          <Typography variant="h6" fontWeight={700} mb={2}>
            <LocalPharmacyIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 22 }} />
            All Medication Details & Settings
          </Typography>
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', mb: 3 }}>
            {medications.map((med, idx) => (
              <Box key={med.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 2.5,
                    py: 2,
                    '&:hover': { bgcolor: 'action.hover' },
                    transition: 'background 0.15s',
                  }}
                >
                  <Avatar sx={{ bgcolor: '#6366f118', color: '#6366f1', width: 42, height: 42 }}>
                    <MedicationIcon />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700}>{med.medicineName}</Typography>
                      <Typography variant="caption" color="text.secondary">({med.dose})</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.75, mt: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
                      {med.morning && (
                        <Chip
                          icon={<WbSunnyIcon sx={{ fontSize: '13px !important' }} />}
                          label={`Morning (${formatTime12h(med.morningTime || '08:00')})`}
                          size="small"
                          sx={{ bgcolor: '#f59e0b18', color: '#f59e0b', height: 22, fontSize: 10, fontWeight: 700 }}
                        />
                      )}
                      {med.afternoon && (
                        <Chip
                          icon={<LunchDiningIcon sx={{ fontSize: '13px !important' }} />}
                          label={`Afternoon (${formatTime12h(med.afternoonTime || '13:00')})`}
                          size="small"
                          sx={{ bgcolor: '#06b6d418', color: '#06b6d4', height: 22, fontSize: 10, fontWeight: 700 }}
                        />
                      )}
                      {med.night && (
                        <Chip
                          icon={<NightsStayIcon sx={{ fontSize: '13px !important' }} />}
                          label={`Night (${formatTime12h(med.nightTime || '20:00')})`}
                          size="small"
                          sx={{ bgcolor: '#8b5cf618', color: '#8b5cf6', height: 22, fontSize: 10, fontWeight: 700 }}
                        />
                      )}
                      {med.appNotification !== false && (
                        <Chip
                          icon={<NotificationsActiveIcon sx={{ fontSize: '13px !important' }} />}
                          label="App Alert"
                          size="small"
                          sx={{ bgcolor: '#6366f118', color: '#6366f1', height: 20, fontSize: 10, fontWeight: 600 }}
                        />
                      )}
                      {med.emailNotification !== false && (
                        <Chip
                          icon={<EmailIcon sx={{ fontSize: '13px !important' }} />}
                          label="Email Alert"
                          size="small"
                          sx={{ bgcolor: '#22c55e18', color: '#22c55e', height: 20, fontSize: 10, fontWeight: 600 }}
                        />
                      )}
                      {med.notes && (
                        <Tooltip title={med.notes}>
                          <Chip
                            icon={<InfoOutlinedIcon sx={{ fontSize: '13px !important' }} />}
                            label={med.notes}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: 10 }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => { setEditMed(med); setOpenForm(true); }}
                        sx={{ color: '#6366f1', '&:hover': { bgcolor: '#6366f118' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(med.id)}
                        sx={{ color: '#ef4444', '&:hover': { bgcolor: '#ef444418' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                {idx < medications.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </>
      )}

      {/* Medication Safety & Reminder Info */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 4,
          border: '1px solid',
          borderColor: '#6366f130',
          background: 'linear-gradient(135deg, #6366f108, #818cf804)',
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="#6366f1">
          💊 Automated Alert & Safety System
        </Typography>
        <Grid container spacing={1}>
          {HEALTH_TIPS.map((tip, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                <InfoOutlinedIcon sx={{ fontSize: 15, color: '#6366f1', mt: 0.2, flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary" lineHeight={1.5}>{tip}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Modal */}
      <Modal
        open={openForm}
        onClose={() => { setOpenForm(false); setEditMed(null); }}
        title={editMed ? 'Edit Medication' : 'Add Medication'}
      >
        <MedicationForm
          initialData={editMed}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </Modal>
    </Box>
  );
};

export default MedicationReminderPage;
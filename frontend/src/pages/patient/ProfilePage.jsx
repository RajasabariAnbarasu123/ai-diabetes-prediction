import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../../store/slices/authSlice';
import {
  Box,
  Typography,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  VpnKey as VpnKeyIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Height as HeightIcon,
  FitnessCenter as ScaleIcon,
  ContactPhone as ContactPhoneIcon,
  CalendarMonth as CalendarMonthIcon,
  Wc as WcIcon,
} from '@mui/icons-material';
import ProfileForm from '../../components/forms/ProfileForm';
import ChangePasswordForm from '../../components/forms/ChangePasswordForm';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'edit', 'password'
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Always load fresh profile data from DB when this page mounts
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Render My Details read-only panel
  const renderDetails = () => {
    // Calculate age from dob if available
    let calculatedAge = '--';
    if (user?.dob) {
      const birth = new Date(user.dob);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      calculatedAge = age;
    } else if (user?.age) {
      calculatedAge = user.age;
    }

    const formatDob = (dob) => {
      if (!dob) return '--';
      return new Date(dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const DetailCard = ({ icon, label, value }) => (
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%', transition: 'box-shadow 0.2s ease', '&:hover': { boxShadow: '0 4px 16px rgba(99,102,241,0.1)' } }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{
            width: 44, height: 44,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(129,140,248,0.1))',
            color: 'primary.main',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
            {icon}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>{label}</Typography>
            <Typography variant="body1" fontWeight={600} noWrap>{value || <span style={{ color: 'var(--mui-palette-text-disabled, #94a3b8)' }}>Not set</span>}</Typography>
          </Box>
        </CardContent>
      </Card>
    );

    return (
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          My Profile Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <DetailCard icon={<PersonIcon />} label="Full Name" value={user?.name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailCard icon={<MailIcon />} label="Email Address" value={user?.email} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailCard
              icon={<CalendarMonthIcon />}
              label="Date of Birth"
              value={user?.dob ? `${formatDob(user.dob)} (Age: ${calculatedAge})` : `Age: ${calculatedAge}`}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailCard icon={<WcIcon />} label="Gender" value={user?.gender} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailCard icon={<PhoneIcon />} label="Phone Number" value={user?.phone} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailCard icon={<ContactPhoneIcon />} label="Emergency Contact" value={user?.emergencyContact} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailCard icon={<HeightIcon />} label="Height" value={user?.height ? `${user.height} cm` : null} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailCard icon={<ScaleIcon />} label="Weight" value={user?.weight ? `${user.weight} kg` : null} />
          </Grid>
          <Grid item xs={12}>
            <DetailCard icon={<HomeIcon />} label="Address" value={user?.address} />
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom
          sx={{ background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information and account settings
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Sidebar */}
        <Grid item xs={12} md={3.5}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <Box sx={
              {
              p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(15,23,42,0.5))'
                : 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(248,250,252,0.5))',
            }}>
              <Avatar sx={{
                width: 80, height: 80,
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                fontSize: 32, fontWeight: 800,
                boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                mb: 1.5,
              }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="subtitle1" fontWeight={700}>{user?.name || 'Patient'}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: '100%' }}>{user?.email}</Typography>
            </Box>
            <Divider />

            {/* Sidebar list items */}
            <List sx={{ p: 1 }}>
              <ListItemButton
                selected={activeTab === 'details'}
                onClick={() => setActiveTab('details')}
                sx={{ borderRadius: 2.5, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: activeTab === 'details' ? 'primary.main' : 'text.secondary' }}>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="My Details"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: activeTab === 'details' ? 700 : 500 }}
                />
              </ListItemButton>

              <ListItemButton
                selected={activeTab === 'edit'}
                onClick={() => setActiveTab('edit')}
                sx={{ borderRadius: 2.5, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: activeTab === 'edit' ? 'primary.main' : 'text.secondary' }}>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Edit Profile"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: activeTab === 'edit' ? 700 : 500 }}
                />
              </ListItemButton>

              <ListItemButton
                selected={activeTab === 'password'}
                onClick={() => setActiveTab('password')}
                sx={{ borderRadius: 2.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: activeTab === 'password' ? 'primary.main' : 'text.secondary' }}>
                  <VpnKeyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Change Password"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: activeTab === 'password' ? 700 : 500 }}
                />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>

        {/* Content Panel */}
        <Grid item xs={12} md={8.5}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 4,
              minHeight: 400,
            }}
          >
            {activeTab === 'details' && renderDetails()}
            {activeTab === 'edit' && (
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                  Edit Profile
                </Typography>
                <ProfileForm />
              </Box>
            )}
            {activeTab === 'password' && (
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                  Change Password
                </Typography>
                <ChangePasswordForm />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
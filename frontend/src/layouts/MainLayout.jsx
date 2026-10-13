import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Button,
  Divider,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DarkMode,
  LightMode,
  Notifications as NotificationsIcon,
  KeyboardArrowDown,
  SpaOutlined,
  FitnessCenterOutlined,
  MedicationOutlined,
  DashboardOutlined,
  MonitorHeartOutlined,
  HistoryOutlined,
  PersonOutlined,
  LogoutOutlined,
  MarkEmailRead as MarkEmailReadIcon,
} from '@mui/icons-material';
import { useThemeToggle } from '../theme/ThemeContext.jsx';
import { logoutUser } from '../store/slices/authSlice';
import { fetchNotifications, markAsRead } from '../store/slices/notificationSlice';
import AiChatFab from '../components/ai/AiChatFab';

// ─── Nav structure ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlined fontSize="small" /> },
  { label: 'Predict Diabetes', path: '/prediction', icon: <MonitorHeartOutlined fontSize="small" /> },
  { label: 'History', path: '/history', icon: <HistoryOutlined fontSize="small" /> },
  { label: 'Diet & Exercise', path: '/diet-exercise', icon: <SpaOutlined fontSize="small" /> },
  { label: 'Medications', path: '/medications', icon: <MedicationOutlined fontSize="small" /> },
];

// ─── Desktop Nav Button ───────────────────────────────────────────────────────
const NavButton = ({ item }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isActive = item.path
    ? location.pathname === item.path
    : item.children?.some((c) => location.pathname === c.path);

  const buttonSx = {
    color: isActive ? 'primary.main' : 'text.secondary',
    fontWeight: isActive ? 700 : 500,
    borderRadius: 2.5,
    px: 1.75,
    py: 0.85,
    textTransform: 'none',
    fontSize: '0.875rem',
    position: 'relative',
    transition: 'all 0.2s ease',
    bgcolor: isActive ? 'primary.main' + '12' : 'transparent',
    border: '1px solid', borderColor: isActive ? 'primary.main' + '30' : 'transparent',
    '&:hover': { bgcolor: 'action.hover', color: 'text.primary', transform: 'translateY(-1px)' },
    '&:active': { transform: 'translateY(0)' },
  };

  if (item.children) {
    return (
      <>
        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          endIcon={<KeyboardArrowDown sx={{ transition: '0.3s', transform: open ? 'rotate(180deg)' : 'none', fontSize: '18px !important' }} />}
          startIcon={item.icon}
          sx={buttonSx}
        >
          {item.label}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { borderRadius: 3, minWidth: 200, mt: 1, boxShadow: '0 12px 40px rgba(0,0,0,0.15)', border: '1px solid', borderColor: 'divider' } }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
          {item.children.map((child) => (
            <MenuItem
              key={child.path}
              onClick={() => { navigate(child.path); setAnchorEl(null); }}
              selected={location.pathname === child.path}
              sx={{ borderRadius: 2, mx: 0.5, my: 0.25, gap: 1.5, fontWeight: 500 }}
            >
              {child.icon}
              {child.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  return (
    <Button
      onClick={() => navigate(item.path)}
      startIcon={item.icon}
      sx={buttonSx}
    >
      {item.label}
    </Button>
  );
};

// ─── Mobile Drawer Content ────────────────────────────────────────────────────
const MobileDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => { navigate(path); onClose(); };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}
      PaperProps={{ sx: { width: 280, borderRadius: '0 16px 16px 0' } }}
    >
      <Box sx={{ p: 2.5, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
        <Typography variant="h6" fontWeight={800} color="#fff">Diabetes CDSS</Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
          Clinical Decision Support System
        </Typography>
      </Box>
      <List sx={{ pt: 1 }}>
        <ListItemButton onClick={() => handleNav('/dashboard')} selected={location.pathname === '/dashboard'} sx={{ borderRadius: 2, mx: 1 }}>
          <ListItemIcon><DashboardOutlined /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNav('/prediction')} selected={location.pathname === '/prediction'} sx={{ borderRadius: 2, mx: 1 }}>
          <ListItemIcon><MonitorHeartOutlined /></ListItemIcon>
          <ListItemText primary="Predict Diabetes" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNav('/history')} selected={location.pathname === '/history'} sx={{ borderRadius: 2, mx: 1 }}>
          <ListItemIcon><HistoryOutlined /></ListItemIcon>
          <ListItemText primary="History" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ px: 3, fontWeight: 700, letterSpacing: 1 }}>
          LIFESTYLE
        </Typography>

        <ListItemButton onClick={() => handleNav('/diet-exercise')} selected={location.pathname === '/diet-exercise' || location.pathname === '/diet' || location.pathname === '/exercise'} sx={{ borderRadius: 2, mx: 1 }}>
          <ListItemIcon><SpaOutlined /></ListItemIcon>
          <ListItemText primary="Diet & Exercise" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNav('/medications')} selected={location.pathname === '/medications'} sx={{ borderRadius: 2, mx: 1 }}>
          <ListItemIcon><MedicationOutlined /></ListItemIcon>
          <ListItemText primary="Medications" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

// ─── Main Layout ──────────────────────────────────────────────────────────────
const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notification);
  const { mode, toggle } = useThemeToggle();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
    setProfileAnchor(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ── Top AppBar ── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(15, 23, 42, 0.85)'
            : 'rgba(248, 250, 252, 0.85)',
          color: 'text.primary',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {/* Brand */}
          {isMobile ? (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          ) : null}

          <Box
            onClick={() => navigate('/dashboard')}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 3 }}
          >
            <Box
              sx={{
                width: 32, height: 32, borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <MonitorHeartOutlined sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={800} noWrap
              sx={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Diabetes CDSS
            </Typography>
          </Box>

          {/* Desktop nav links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto', mr: 4 }}>
              {NAV_ITEMS.map((item) => (
                <NavButton key={item.label} item={item} />
              ))}
            </Box>
          )}

          {/* Actions */}
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggle} size="small">
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)} size="small" sx={{ ml: 0.5 }}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={notifAnchor}
            open={Boolean(notifAnchor)}
            onClose={() => setNotifAnchor(null)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                width: 320,
                maxHeight: 400,
                mt: 0.5,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700}>Notifications</Typography>
              {unreadCount > 0 && (
                <Chip label={`${unreadCount} New`} size="small" color="primary" sx={{ height: 20, fontSize: '0.75rem', fontWeight: 600 }} />
              )}
            </Box>
            <Divider />
            <Box sx={{ overflow: 'auto', maxHeight: 300 }}>
              {notifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No notifications</Typography>
                </Box>
              ) : (
                notifications.map((n) => (
                  <MenuItem
                    key={n.id}
                    sx={{
                      py: 1.5,
                      px: 2,
                      whiteSpace: 'normal',
                      backgroundColor: n.read ? 'transparent' : 'action.hover',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={n.read ? 400 : 600} color="text.primary">
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                    {!n.read && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(markAsRead(n.id));
                        }}
                        sx={{ mt: -0.5 }}
                      >
                        <MarkEmailReadIcon fontSize="small" />
                      </IconButton>
                    )}
                  </MenuItem>
                ))
              )}
            </Box>
          </Menu>

          {/* Avatar / Profile menu */}
          <Tooltip title="Account">
            <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ ml: 0.5, p: 0.5 }}>
              <Avatar sx={{
                width: 36, height: 36, fontSize: 15, fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
              }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
            PaperProps={{ sx: { borderRadius: 3, minWidth: 240, mt: 1, boxShadow: '0 12px 40px rgba(0,0,0,0.15)', border: '1px solid', borderColor: 'divider' } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 40, height: 40, background: 'linear-gradient(135deg, #6366f1, #818cf8)', fontSize: 16, fontWeight: 800 }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>{user?.name || 'Patient'}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 160, display: 'block' }}>{user?.email}</Typography>
              </Box>
            </Box>
            <Divider />
            <MenuItem onClick={() => { navigate('/profile'); setProfileAnchor(null); }} sx={{ gap: 1.5, borderRadius: 2, mx: 0.5, my: 0.25, py: 1.25 }}>
              <PersonOutlined fontSize="small" color="action" /> My Profile
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout} sx={{ gap: 1.5, borderRadius: 2, mx: 0.5, my: 0.25, py: 1.25, color: 'error.main' }}>
              <LogoutOutlined fontSize="small" /> Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* ── Page Content ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '64px',
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>

      {/* ── Floating AI Health Coach ── */}
      <AiChatFab />
    </Box>
  );
};

export default MainLayout;
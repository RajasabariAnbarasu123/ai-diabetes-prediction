import { useState } from 'react';
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
  Button,
  Chip,
  Tooltip,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DarkMode,
  LightMode,
  DashboardOutlined,
  PeopleOutlined,
  MonitorHeartOutlined,
  ReceiptLongOutlined,
  AdminPanelSettingsOutlined,
  LogoutOutlined,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useThemeToggle } from '../theme/ThemeContext.jsx';
import { logoutUser } from '../store/slices/authSlice';

const adminNavItems = [
  { label: 'Dashboard', path: '/admin', icon: <DashboardOutlined fontSize="small" /> },
  { label: 'User Management', path: '/admin/users', icon: <PeopleOutlined fontSize="small" /> },
  { label: 'Risk Predictions', path: '/admin/predictions', icon: <MonitorHeartOutlined fontSize="small" /> },
  { label: 'Activity Logs', path: '/admin/activity', icon: <ReceiptLongOutlined fontSize="small" /> },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mode, toggle } = useThemeToggle();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* ── Top Navbar ── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(15, 23, 42, 0.9)'
            : 'rgba(248, 250, 252, 0.9)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <Toolbar sx={{ gap: 2, px: { xs: 2, md: 4 } }}>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Admin Brand Logo */}
          <Box
            onClick={() => navigate('/admin')}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', mr: 2 }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <AdminPanelSettings sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={800}
                noWrap
                sx={{
                  background: 'linear-gradient(135deg, #0284c7, #6366f1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}
              >
                Diabetes CDSS
              </Typography>
              <Chip
                label="ADMIN PORTAL"
                size="small"
                sx={{
                  height: 16,
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  bgcolor: '#0284c718',
                  color: '#0284c7',
                  border: '1px solid #0284c740',
                }}
              />
            </Box>
          </Box>

          {/* Desktop Horizontal Navbar Items */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto', mr: 4 }}>
              {adminNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontWeight: isActive ? 700 : 500,
                      borderRadius: 2.5,
                      px: 2,
                      py: 0.85,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      bgcolor: isActive ? 'primary.main' + '14' : 'transparent',
                      border: isActive ? '1px solid' : '1px solid transparent',
                      borderColor: isActive ? 'primary.main' + '40' : 'transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Controls */}
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggle} size="small" sx={{ p: 1 }}>
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Admin Account">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ p: 0.5 }}>
              <Avatar sx={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                fontSize: 14, fontWeight: 800,
                boxShadow: '0 2px 8px rgba(2,132,199,0.4)',
              }}>
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                borderRadius: 3, minWidth: 240, mt: 1,
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                border: '1px solid', borderColor: 'divider',
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 40, height: 40, background: 'linear-gradient(135deg, #0284c7, #6366f1)', fontSize: 16, fontWeight: 800 }}>
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>{user?.name || 'Administrator'}</Typography>
                <Chip label="ADMIN" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#0284c718', color: '#0284c7', border: '1px solid #0284c730' }} />
              </Box>
            </Box>
            <MenuItem onClick={() => { navigate('/admin'); setAnchorEl(null); }} sx={{ borderRadius: 2, mx: 0.5, my: 0.25, gap: 1.5, py: 1.25 }}>
              <DashboardOutlined fontSize="small" color="action" /> Admin Dashboard
            </MenuItem>
            <MenuItem onClick={() => { navigate('/admin/profile'); setAnchorEl(null); }} sx={{ borderRadius: 2, mx: 0.5, my: 0.25, gap: 1.5, py: 1.25 }}>
              <AdminPanelSettingsOutlined fontSize="small" color="action" /> Profile & Password
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ borderRadius: 2, mx: 0.5, my: 0.25, gap: 1.5, py: 1.25, color: 'error.main' }}>
              <LogoutOutlined fontSize="small" /> Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280, borderRadius: '0 20px 20px 0', borderRight: 'none' } }}
      >
        <Box sx={{ p: 2.5, background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AdminPanelSettings sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} color="#fff" sx={{ lineHeight: 1.2 }}>Admin Portal</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Diabetes CDSS</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 1.5 }}>
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.label}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                selected={isActive}
                sx={{ borderRadius: 2.5, mb: 0.5, px: 2, py: 1.25,
                  '&.Mui-selected': { bgcolor: 'primary.main' + '14', color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }} />
              </ListItemButton>
            );
          })}
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, sm: 3, md: 4 }, maxWidth: 1600, mx: 'auto', width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
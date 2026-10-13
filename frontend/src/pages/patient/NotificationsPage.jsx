import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { fetchNotifications, markAsRead } from '../../store/slices/notificationSlice';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.map((n) => (
          <ListItem
            key={n.id}
            sx={{ backgroundColor: n.read ? 'transparent' : 'action.hover', borderRadius: 2, mb: 1 }}
            secondaryAction={
              !n.read && (
                <IconButton onClick={() => dispatch(markAsRead(n.id))}>
                  <MarkEmailReadIcon />
                </IconButton>
              )
            }
          >
            <ListItemText primary={n.message} secondary={new Date(n.createdAt).toLocaleString()} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NotificationsPage;
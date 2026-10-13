import { Box, Typography, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';

const DietPlan = ({ dietPlan }) => {
  if (!dietPlan) return null;

  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight={700}>Your Personalized Diet Plan</Typography>
      <Typography variant="body1" mb={2}>{dietPlan.generalAdvice}</Typography>
      <Grid container spacing={2}>
        {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => (
          <Grid item xs={12} sm={6} md={3} key={meal}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} textTransform="capitalize">{meal}</Typography>
              <List dense>
                {dietPlan[meal]?.map((item, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {dietPlan.weekly && (
        <Box mt={3}>
          <Typography variant="h6">Weekly Plan</Typography>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{dietPlan.weekly}</pre>
        </Box>
      )}
    </Paper>
  );
};

export default DietPlan;
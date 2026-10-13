import { Skeleton, Box } from '@mui/material';

const LoadingSkeleton = ({ count = 3, height = 100 }) => {
  return (
    <Box>
      {Array.from(new Array(count)).map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          height={height}
          animation="wave"
          sx={{ mb: 2, borderRadius: 2 }}
        />
      ))}
    </Box>
  );
};

export default LoadingSkeleton;
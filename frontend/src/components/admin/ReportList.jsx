import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Typography, Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchAllReports } from '../../store/slices/adminSlice';
import usePagination from '../../hooks/usePagination';

const ReportList = () => {
  const dispatch = useDispatch();
  const { reports, loading } = useSelector((state) => state.admin);
  const { page, size } = usePagination();

  useEffect(() => {
    dispatch(fetchAllReports({ page, size }));
  }, [dispatch, page, size]);

  const handleDelete = (id) => {
    // implement delete
  };

  const handleDownload = (id) => {
    // implement download
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Medical Reports</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Filename</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.fileName}</TableCell>
                <TableCell>{new Date(report.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell>{report.user?.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDownload(report.id)}><DownloadIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(report.id)}><DeleteIcon color="error" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportList;
import axiosInstance from './axiosInstance';

const exportService = {
  exportPredictionsPDF: async (params = {}) => {
    const response = await axiosInstance.get('/export/predictions/pdf', {
      params,
      responseType: 'blob',
    });
    downloadBlob(response.data, 'predictions.pdf');
  },
  exportPredictionsExcel: async (params = {}) => {
    const response = await axiosInstance.get('/export/predictions/excel', {
      params,
      responseType: 'blob',
    });
    downloadBlob(response.data, 'predictions.xlsx');
  },
};

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export default exportService;
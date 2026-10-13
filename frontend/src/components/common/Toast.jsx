// We already use react-toastify globally, but we can wrap for easy import.
import { toast } from 'react-toastify';

export const showToast = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg) => toast.info(msg),
  warning: (msg) => toast.warning(msg),
};

export default toast;
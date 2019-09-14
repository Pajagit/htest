import { toast } from "react-toastify";

const failToast = msg =>
  toast(`✖ ${msg}`, {
    className: "FAIL_TOAST",
    bodyClassName: "FONT_TOAST",
    progressClassName: "progress_toast"
  });
export default failToast;

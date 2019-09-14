import { toast } from "react-toastify";

const successToast = msg =>
  toast(`✔ ${msg}`, {
    className: "SUCCESS_TOAST",
    bodyClassName: "FONT_TOAST",
    progressClassName: "progress_toast"
  });
export default successToast;

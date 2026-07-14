import DismissButton from "components/Notification/components/DismissButton";
import ExtrasContainer from "components/Notification/components/ExtrasContainer";
import MessageIcon from "components/Notification/components/MessageIcon";
import React from "react";
import { toast } from "react-toastify";

export function reportError(
  errorLabel: React.ReactNode,
  shouldTimeout?: boolean,
  errorObject: any = ""
) {
  // react-toastify injects `closeToast` when the toast content is a render
  // function, which lets our custom DismissButton dismiss the toast. The
  // library's built-in icon/close button are disabled on the <ToastContainer>
  // so only our faux overlay (faint MessageIcon + DismissButton) renders.
  toast.error(
    ({ closeToast }) => (
      <React.Fragment>
        <h4 className="notification-title">Error</h4>
        <div className="notification-message">{errorLabel}</div>
        <ExtrasContainer>
          <MessageIcon />
          <DismissButton onClick={closeToast} />
        </ExtrasContainer>
      </React.Fragment>
    ),
    {
      position: "top-center",
      autoClose: shouldTimeout ? 5000 : false
    }
  );
  console.log(errorLabel, errorObject);
}

export default reportError;

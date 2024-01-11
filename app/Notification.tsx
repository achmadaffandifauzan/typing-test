import React, { useEffect, useRef } from "react";
import { Id, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface NotificationParams {
  message: string;
  type: string;
  openNotification: boolean;
}
const Notification = ({
  message,
  type,
  openNotification,
}: NotificationParams) => {
  const customId = "custom-id-yes";
  useEffect(() => {
    if (openNotification) {
      toast(message, {
        type: "warning",
        toastId: customId,
      });
    }
  }, [openNotification]);
  return (
    <div className="sm:text-sm text-xs text-start text-black p-1 fixed">
      <ToastContainer
        position="top-right"
        autoClose={15000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="light"
      />
    </div>
  );
};

export default Notification;

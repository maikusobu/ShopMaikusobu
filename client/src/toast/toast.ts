import { notifications } from "@mantine/notifications";
export const toast = (
  message: string,
  error = false,
  id: string,
  title: string
) => {
  notifications.show({
    id: id,
    withCloseButton: true,
    sx: { backgroundColor: error ? "#ff0000" : "#00ff00" },
    title: title,
    message: message,
    color: error ? "red" : "green",
    autoClose: 3000,
  });
};

import { notifications } from "@mantine/notifications";
import { redirect } from "react-router";

const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // eslint-disable-next-line no-debugger

  try {
    const datajson = await fetch(
      `${import.meta.env.VITE_SERVER}/authen/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "omit",
        },
        body: JSON.stringify(data),
      }
    );
    const json = await datajson.json();
    if (json.status === 400) {
      throw json;
    } else {
      console.log(json);
      localStorage.setItem("id", json.id);
      localStorage.setItem("expires", json.expires);
      localStorage.setItem("refreshToken", json.refreshToken);
      notifications.show({
        id: "register",
        withCloseButton: false,
        onClose: () => console.log("unmounted"),
        onOpen: () => console.log("mounted"),
        autoClose: 1000,
        message: "You have successfully logined",
        color: "white",
        style: { backgroundColor: "green" },
        sx: { backgroundColor: "green" },
        loading: false,
      });
      await new Promise((r) => setTimeout(r, 1000));
      return redirect("/");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.status === 400) {
      return { err, status: 400 };
    }
    return {
      err: {
        message: "Something went wrong",
      },
      status: 400,
    };
  }
};
export default action;

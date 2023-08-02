const urlRequest = "authen/changepassword";
const urlRedirect = "authen/login";
import { notifications } from "@mantine/notifications";
import { redirect } from "react-router-dom";
const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const datajson = await fetch(
      `${import.meta.env.VITE_SERVER}/${urlRequest}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );
    const json = await datajson.json();
    if (json.status === 400) {
      console.log(json);
      throw json;
    } else {
      notifications.show({
        id: "resetPasswordsuccessfully",
        title: json.message,
        message: "Bạn sẽ được dẫn về màn hình đăng nhập sau 5 giây",
        color: "green",
        autoClose: 5000,
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return redirect(`/${urlRedirect}`);
    }
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

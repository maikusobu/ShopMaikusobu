/* eslint-disable @typescript-eslint/no-explicit-any */
const urlRequest = "authen/forgotpassword";
import { notifications } from "@mantine/notifications";
const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const datajson = await fetch(
      `${import.meta.env.VITE_SERVER}/${urlRequest}`,
      {
        method: "POST",
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
        id: "requestchangepassword",
        message: json.message,
        color: "green",
        autoClose: 5000,
      });
      await new Promise((r) => setTimeout(r, 2000));
      return json;
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

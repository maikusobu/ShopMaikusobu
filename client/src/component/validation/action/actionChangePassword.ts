const urlRequest = "authen/changepassword";
const urlRedirect = "authen/login";
import { toast } from "../../../toast/toast";
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
      toast(
        "Bạn sẽ được dẫn về màn hình đăng nhập sau 5 giây",
        false,
        "ResetPassword",
        json.message
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return redirect(`/${urlRedirect}`);
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

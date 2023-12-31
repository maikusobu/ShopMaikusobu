import { redirect } from "react-router";
import { toast } from "../../../toast/toast";
const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
   
  try {
    const datajson = await fetch(
      `${import.meta.env.VITE_SERVER}/authen/login`,
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
      throw json;
    } else {
      localStorage.setItem("id", json.id);
      localStorage.setItem("expires", json.expires);
      localStorage.setItem("refreshToken", json.refreshToken);
      toast("Bạn đã đăng nhập thành công", false, "Login", "Đăng nhập");
      await new Promise((r) => setTimeout(r, 1000));
      return redirect("/");
      // return json;
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

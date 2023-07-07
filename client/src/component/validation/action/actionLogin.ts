import { redirect } from "react-router-dom";

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
      localStorage.setItem("id", json.id);
      localStorage.setItem("username", json.username);
      localStorage.setItem("expires", json.expires);
      return redirect("/");
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

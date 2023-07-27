/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "react-router-dom";
export function actionGenerator(
  urlRequest: string,
  urlRedirect: string,
  method: string
) {
  return async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    if (formData.has("username")) {
      localStorage.setItem("username", formData.get("username") as string);
    } else {
      formData.append("username", localStorage.getItem("username") as string);
      localStorage.removeItem("username");
    }

    const data = Object.fromEntries(formData);

    try {
      const datajson = await fetch(
        `${import.meta.env.VITE_SERVER}/${urlRequest}`,
        {
          method: `${method}`,
          headers: {
            "Content-Type": "application/json",
            credentials: "omit",
          },
          body: JSON.stringify(data),
        }
      );
      const json = await datajson.json();
      if (json.status === 400) {
        console.log(json);
        throw json;
      } else {
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
}

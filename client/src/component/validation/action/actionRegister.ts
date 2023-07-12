import { redirect } from "react-router-dom";
import { generatedAvatar } from "../../../Helper/generatedAvatar";
import { blobToDataURL } from "../../../Helper/BlobToDataUrl";
const action = async ({ request }: { request: Request }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const formData = await request.formData();
  const blob = await generatedAvatar(formData.get("username") as string);
  const avatarDataURL = await blobToDataURL(blob);
  const data = {
    ...Object.fromEntries(formData),
    avatar: avatarDataURL,
  };
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER}/authen/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "omit",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.status === 400 || json.status === 500 || json.status === 404) {
      throw json;
    } else {
      // eslint-disable-next-line no-debugger
      return redirect("/authen/login");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    return { data, error: err.response };
  }
};
export default action;

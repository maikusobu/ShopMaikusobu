import { toast } from "../../../toast/toast";
import { generatedAvatar } from "../../../Helper/generatedAvatar";
import { blobToDataURL } from "../../../Helper/BlobToDataUrl";

const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  let avatarUser = "";
  const blob = await generatedAvatar(formData.get("username") as string);
  avatarUser = await blobToDataURL(blob);
  const data = {
    ...Object.fromEntries(formData),
    isSocialConnect: formData.get("isSocialLogin") === "true" ? true : false,
    avatar: avatarUser,
  };
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER}/authen/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (json.status === 400 || json.status === 500 || json.status === 404) {
      throw json;
    } else {
      toast(json.message, false, "Register", "Đăng ký");
      await new Promise((r) => setTimeout(r, 3000));
      return {
        data,
        json,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    return { data, err: err };
  }
};
export default action;

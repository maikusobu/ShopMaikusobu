import { redirect } from "react-router-dom";
import { generatedAvatar } from "../../../Helper/generatedAvatar";
import { blobToDataURL } from "../../../Helper/BlobToDataUrl";
import { notifications } from "@mantine/notifications";
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

    if (
      json.response.status === 400 ||
      json.response.status === 500 ||
      json.response.status === 404
    ) {
      throw json;
    } else {
      notifications.show({
        id: "register",
        withCloseButton: false,
        onClose: () => console.log("unmounted"),
        onOpen: () => console.log("mounted"),
        autoClose: 2000,
        message: "You have successfully registered",
        color: "white",
        style: { backgroundColor: "green" },
        sx: { backgroundColor: "green" },
        loading: false,
      });
      await new Promise((r) => setTimeout(r, 2000));
      return redirect("/authen/login");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    return { data, error: err.response };
  }
};
export default action;

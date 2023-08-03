import { useState, useEffect } from "react";
import type { UserJson } from "../api/UserApi/UserApi";
import { dataURLToBlob } from "../Helper/UrlToObject";
function useAvatar(data: UserJson | null) {
  const [imageUrl, setImageUrl] = useState<string>("");
  useEffect(() => {
    if (data) {
      let url = "";
      if (data.picture.length === 0) {
        const blob = dataURLToBlob(data.avatar);
        url = URL.createObjectURL(blob);
        setImageUrl(url);
      } else setImageUrl(data.picture);
    }
  }, [data]);
  return imageUrl;
}

export default useAvatar;

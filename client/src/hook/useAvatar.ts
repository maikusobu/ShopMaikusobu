import { useState, useEffect } from "react";
import type { UserJson } from "../api/UserApi/UserApi";
import { dataURLToBlob } from "../Helper/UrlToObject";
function useAvatar(data: UserJson | null) {
  const [imageUrl, setImageUrl] = useState<string>("");
  useEffect(() => {
    if (data) {
      const blob = dataURLToBlob(data.avatar);
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    }
  }, [data]);
  return imageUrl;
}

export default useAvatar;

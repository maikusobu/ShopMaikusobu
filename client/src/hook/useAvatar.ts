import { useState, useEffect } from "react";
import type { UserJson } from "../api/UserApi/UserApi";
import { dataURLToBlob } from "../Helper/UrlToObject";
import { isValidDataUrl } from "../Helper/isValidDataUrl";
function useAvatar(data: UserJson | null) {
  const [imageUrl, setImageUrl] = useState<string>("");
  useEffect(() => {
    if (data) {
      let url = "";
      console.log(data.avatar);
      if (isValidDataUrl(data.avatar)) {
        const blob = dataURLToBlob(data.avatar);
        url = URL.createObjectURL(blob);
      } else url = data.avatar;
      setImageUrl(url);
    }
  }, [data]);
  return imageUrl;
}

export default useAvatar;

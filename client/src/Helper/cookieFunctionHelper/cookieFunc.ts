export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  ) as RegExpMatchArray | null;
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

interface CookieOptions {
  path?: string;
  expires?: Date | string;
  secure?: boolean;
  [key: string]: any;
}
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  options = {
    path: "/",
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString() as string;
  }

  let updatedCookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (const optionKey in options) {
    updatedCookie += "; " + optionKey;
    const optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}
export function deleteCookie(name: string) {
  setCookie(name, "", {
    "max-age": -1,
  });
}

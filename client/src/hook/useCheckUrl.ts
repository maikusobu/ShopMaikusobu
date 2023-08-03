export const useUrlSearchParams = () => {
  const params = new URLSearchParams(window.location.search);
  const hasToken = params.has("token");
  const hasId = params.has("id");
  const token = params.get("token");
  const id = params.get("id");
  const isTokenValid = token && token.length >= 32;
  const isIdValid = id && id.length >= 8;
  const isValidUrl = hasToken && hasId && isTokenValid && isIdValid;
  return { isValidUrl, id, token };
};

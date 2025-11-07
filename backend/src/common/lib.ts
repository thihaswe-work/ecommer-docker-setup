export const getToken = (rawCookie: string) => {
  return rawCookie
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];
};

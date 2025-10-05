export const getImageLink = (link: string): string => {
  const domain = process.env.NEXT_PUBLIC_BACKEND;
  const serverLink = domain ? domain + link : `https://stocks-api.tyriantrade.com${link}`;
  return serverLink;
};

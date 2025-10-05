export const getMediaUrl = (url: string): string | undefined => {
  if (url) {
    const serverUrl = 'https://authservice.tyriantrade.com';
    return serverUrl + url;
  }
};

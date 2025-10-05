import Cookies from 'js-cookie';

const defaultOptions = {
  domain: '.tyriantrade.com',
  path: '/',
  sameSite: 'None' as const,
  secure: true,
};

export function setCookie(
  name: string,
  value: string,
  options: Partial<typeof defaultOptions> = {},
): void {
  Cookies.set(name, value, { ...defaultOptions, ...options });
}

export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

export function removeCookie(name: string, options: Partial<typeof defaultOptions> = {}): void {
  Cookies.remove(name, { ...defaultOptions, ...options });
}

export const clearAllCookies = () => {
  const cookies = document.cookie.split(';');

  cookies.forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${defaultOptions.path};domain=${defaultOptions.domain}`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${defaultOptions.path}`;
  });
};

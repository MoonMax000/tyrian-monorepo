export const getSiteName = () => {
    return process.env.NEXT_PUBLIC_APP_PATH ??  "https://stocks.tyriantrade.com";
}
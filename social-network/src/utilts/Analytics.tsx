import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google"
export const Analytics = () => {
  return (
    <>    
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? ''} />
    <GoogleTagManager gtmId="" />
    </>
  )
}

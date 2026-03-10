// app/components/GoogleCaptchaWrapper.jsx
"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React from "react";

export default function GoogleCaptchaWrapper({ children }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaKey) {
    console.warn("reCAPTCHA site key is not configured");
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
        nonce: undefined
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
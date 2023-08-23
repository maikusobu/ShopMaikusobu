declare interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly PORT?: string;
  readonly PUBLIC_PATH: string;
  readonly VITE_SERVER: string;
  readonly VITE_CARD_GENERATOR_API_KEY: string;
  readonly VITE_EMAILJS_SERVICE_ID: string;
  readonly VITE_EMAILJS_TEMPLATE_ID: string;
  readonly VITE_EMAILJS_PUBLIC_KEY: string;
  readonly VITE_RECAPTCHA_SITE_KEY: string;
  readonly VITE_ABSTRACTAPI_API_KEY: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_MODE: string;
  readonly VITE_FACEBOOK_APP_ID: string;
  readonly VITE_FACEBOOK_APP_ID_PROD: string;
}

declare interface ImportMeta {
  env: ImportMetaEnv;
}

import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure locale is defined, fallback to 'vi'
  if (!locale) {
    locale = 'vi';
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

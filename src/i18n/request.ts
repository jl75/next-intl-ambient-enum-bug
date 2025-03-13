import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import {hasLocale, IntlErrorCode} from 'next-intl';

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    // @@BUG: This will not compile - else omitted for brevity
    onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        // Missing translations are expected and should only log an error
        console.error(error);
      }
    },
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

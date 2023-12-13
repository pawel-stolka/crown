export const API_URL = 'http://localhost:3001';
// export const API_URL = 'http://nest-demo-beanstalk-env.eba-apndeyg2.eu-west-1.elasticbeanstalk.com';
export const AUTH_DATA = 'auth_data';
export const AUTH_TOKEN = 'auth_token';
export const AUTH_TOKEN_EMAIL = 'AUTH_TOKEN_EMAIL';

export const ZERO_DATA = '-';
export const NUMBER_PRECISION = 0;

// validators
export const MIN_TEXT_LENGTH = 3;
export const MAX_TEXT_LENGTH = 25;
export const MIN_PRICE = 0.01;
export const MAX_PRICE = 1_000_000;

// TODO: check
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

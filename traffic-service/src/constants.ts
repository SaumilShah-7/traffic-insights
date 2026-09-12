// ISO 3166 alpha-2 country codes as per: https://www.iban.com/country-codes
enum CountryCode {
  AE = 'AE',
  AU = 'AU',
  BR = 'BR',
  CA = 'CA',
  CH = 'CH',
  CN = 'CN',
  DE = 'DE',
  ES = 'ES',
  FR = 'FR',
  GB = 'GB',
  IN = 'IN',
  IT = 'IT',
  JP = 'JP',
  KR = 'KR',
  MX = 'MX',
  NL = 'NL',
  RU = 'RU',
  SG = 'SG',
  US = 'US',
  ZA = 'ZA',
}

const COUNTRY_CODE_TO_NAME: Record<CountryCode, string> = {
  [CountryCode.AE]: 'United Arab Emirates',
  [CountryCode.AU]: 'Australia',
  [CountryCode.BR]: 'Brazil',
  [CountryCode.CA]: 'Canada',
  [CountryCode.CH]: 'Switzerland',
  [CountryCode.CN]: 'China',
  [CountryCode.DE]: 'Germany',
  [CountryCode.ES]: 'Spain',
  [CountryCode.FR]: 'France',
  [CountryCode.GB]: 'United Kingdom',
  [CountryCode.IN]: 'India',
  [CountryCode.IT]: 'Italy',
  [CountryCode.JP]: 'Japan',
  [CountryCode.KR]: 'South Korea',
  [CountryCode.MX]: 'Mexico',
  [CountryCode.NL]: 'Netherlands',
  [CountryCode.RU]: 'Russia',
  [CountryCode.SG]: 'Singapore',
  [CountryCode.US]: 'United States',
  [CountryCode.ZA]: 'South Africa',
};

enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  BUS = 'bus',
  TRUCK = 'truck',
  VAN = 'van',
  BICYCLE = 'bicycle',
}

export { COUNTRY_CODE_TO_NAME, CountryCode, VehicleType };

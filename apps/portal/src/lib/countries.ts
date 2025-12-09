import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import en from "react-phone-number-input/locale/en.json";

export const COUNTRY_LIST = getCountries();

export const COUNTRY_DATA = COUNTRY_LIST.map((c) => ({
	code: c,
	name: en[c],
	callingCode: getCountryCallingCode(c),
	Flag: flags[c],
}));

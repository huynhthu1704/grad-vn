import {useMemo} from 'react';
import {LANGUAGE} from '../constants/language';
import {useAppSelector} from '../stores/store/storeHooks';

export const useLanguage = () => {
	const language = useAppSelector(state => state?.userInfoReducer.language);
	return useMemo(() => LANGUAGE[language], [language]);
};

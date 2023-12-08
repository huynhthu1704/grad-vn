import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { UserProps} from '../../constants/types';
import {LANGUAGE} from '../../constants/enum';


interface userInfoState {
	userInfo?: UserProps;
	language: LANGUAGE;
}

const initialState: userInfoState = {
	userInfo: undefined,
	language: LANGUAGE.VI,
};

const userInfo = createSlice({
	name: 'userInfo',
	initialState,
	reducers: {
		clearUserData: () => initialState,
		cacheUserInfo: (state, action: PayloadAction<any>) => {
			state.userInfo = action.payload;
		},
		updateUserInfo: (state, action: PayloadAction<any>) => {
			state.userInfo = {...state.userInfo, ...action.payload};
		},
		changeLanguage: (state, action: PayloadAction<LANGUAGE>) => {
			state.language = action.payload;
		},
	},
});

export const {cacheUserInfo, clearUserData, updateUserInfo, changeLanguage} = userInfo.actions;
const userInfoReducer = userInfo.reducer;
export default userInfoReducer;

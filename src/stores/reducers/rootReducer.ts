import {combineReducers} from 'redux';
import userInfoReducer from './userReducer';

const rootReducer = combineReducers({
	userInfoReducer,
});

export default rootReducer;

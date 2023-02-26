import { createStore, combineReducers } from 'redux';
import mapReducer from './mapReducer';

const rootReducer = combineReducers({
    map: mapReducer,
});

const store = createStore(rootReducer);

export default store;

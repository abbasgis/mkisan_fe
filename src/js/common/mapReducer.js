import Map from 'ol/Map';

const initialState = {
    map: null,
};

function mapReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_MAP':
            return {
                ...state,
                map: action.payload,
            };
        default:
            return state;
    }
}

export default mapReducer;

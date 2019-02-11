export default {
    namespace: "bi0501Info",
    state:{},
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}
export default {
    namespace: "namespace",
    state:{},
    effects:{},
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}
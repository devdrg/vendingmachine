const state = {
    currency: "RON"
};

const getters = {
    GET_CURRENCY: (state) => state.currency
};

const actions = {
};

const mutations = {
    SET_CURRENCY (state, newCurrency) {
        state.currency = newCurrency;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

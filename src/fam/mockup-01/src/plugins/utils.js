function sleep( milliseconds ) {
    return new Promise( resolve => setTimeout( resolve, milliseconds ) );
};

export default {
    install( Vue, options ) {
        Vue.prototype.$sleep = sleep;
    },
};

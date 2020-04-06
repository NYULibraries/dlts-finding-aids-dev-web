import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = function () {
    return {
        helpModal : {
            content : '',
            title   : '',
        },
        users            : [
            'admin@nyu.edu',
            'abu-dhabi-archivist@nyu.edu',
            'acm-archivist@nyu.edu',
            'bhs-archivist@brooklynhistory.org',
            'nyhs-archivist@nyhistory.org',
            'poly-archivist@nyhistory.org',
        ],
    };
};

export default {
    strict : process.env.NODE_ENV !== 'production',

    state,

    actions,
    getters,
    mutations,
};

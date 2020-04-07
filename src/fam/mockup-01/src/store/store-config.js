import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = function () {
    return {
        helpModal : {
            content : '',
            title   : '',
        },
        // https://jira.nyu.edu/jira/browse/FADESIGN-63
        users : [
            'brad@nyu.edu',
            'francesca@nyu.edu',
            'larry@nyhistory.org',
            'lyndsay@nyu.edu',
            'maggie@brooklynhistory.org',
            'megan@nyu.edu',
            'weatherly@nyu.edu',
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

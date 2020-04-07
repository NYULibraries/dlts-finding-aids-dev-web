import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = function () {
    return {
        currentRepositories : [],
        currentUser : '',
        helpModal : {
            content : '',
            title   : '',
        },
        repositories : {
            'akkasah' : [
                'weatherly@nyu.edu',
                'brad@nyu.edu',
            ],
            'archives' : [
                'weatherly@nyu.edu',
                'megan@nyu.edu',
            ],
            'bhs' : [
                'weatherly@nyu.edu',
                'maggie@brooklynhistory.org',
            ],
            'fales' : [
                'weatherly@nyu.edu',
                'megan@nyu.edu',
            ],
            'lapietra' : [
                'weatherly@nyu.edu',
                'francesca@nyu.edu',
            ],
            'nyhs' : [
                'weatherly@nyu.edu',
                'larry@nyhistory.org',
            ],
            'nyuad' : [
                'weatherly@nyu.edu',
                'brad@nyu.edu',
            ],
            'poly' : [
                'weatherly@nyu.edu',
                'lyndsay@nyu.edu',
            ],
            'rism' : [
                'weatherly@nyu.edu',
                'megan@nyu.edu',
            ],
            'tamwag' : [
                'weatherly@nyu.edu',
                'megan@nyu.edu',
            ],
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

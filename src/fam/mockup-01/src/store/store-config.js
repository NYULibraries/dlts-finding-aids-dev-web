import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import publishedFindingAids from './published-finding-aids';

const state = function () {
    return {
        currentRepositories : [],
        currentUser         : 'weatherly@nyu.edu',
        helpModal           : {
            content : '',
            title   : '',
        },
        repositories : {
            akkasah  : {
                archivists : [
                    'weatherly@nyu.edu',
                    'brad@nyu.edu',
                ],
                organization : 'NYU',
            },
            archives : {
                archivists : [
                    'weatherly@nyu.edu',
                    'megan@nyu.edu',
                ],
                organization : 'NYU',
            },
            bhs      : {
                archivists : [
                    'weatherly@nyu.edu',
                    'maggie@brooklynhistory.org',
                ],
                organization : 'BHS',
            },
            fales    : {
                archivists : [
                    'weatherly@nyu.edu',
                    'megan@nyu.edu',
                ],
                organization : 'NYU',
            },
            lapietra : {
                archivists : [
                    'weatherly@nyu.edu',
                    'francesca@nyu.edu',
                ],
                organization : 'NYU',
            },
            nyhs     : {
                archivists : [
                    'weatherly@nyu.edu',
                    'larry@nyhistory.org',
                ],
                organization : 'NYHS',
            },
            nyuad    : {
                archivists : [
                    'weatherly@nyu.edu',
                    'brad@nyu.edu',
                ],
                organization : 'NYU',
            },
            poly     : {
                archivists : [
                    'weatherly@nyu.edu',
                    'lyndsay@nyu.edu',
                ],
                organization : 'NYU',
            },
            rism     : {
                archivists : [
                    'weatherly@nyu.edu',
                    'megan@nyu.edu',
                ],
                organization : 'NYU',
            },
            tamwag   : {
                archivists : [
                    'weatherly@nyu.edu',
                    'megan@nyu.edu',
                ],
                organization : 'NYU',
            },
        },
        publishedFindingAids : publishedFindingAids,
        // https://jira.nyu.edu/jira/browse/FADESIGN-63
        users                : [
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

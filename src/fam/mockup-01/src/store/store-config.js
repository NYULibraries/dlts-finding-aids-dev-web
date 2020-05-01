import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import inProcessFindingAids from './in-process-finding-aids';
import publishedFindingAids from './published-finding-aids';

const state = function () {
    return {
        currentRepositories : [],
        currentUser         : '',
        helpModal           : {
            content : '',
            title   : '',
        },
        inProcessFindingAids : inProcessFindingAids,
        // https://jira.nyu.edu/jira/browse/FADESIGN-65
        repositories         : {
            akkasah  : {
                archivists : [
                    'weatherly@nyu.edu',
                    'brad@nyu.edu',
                ],
                name         : 'Akkasah Center for Photography at NYU Abu Dhabi',
                organization : 'NYU',
            },
            archives : {
                archivists : [
                    'weatherly@nyu.edu',
                    'megan@nyu.edu',
                ],
                name         : 'New York University Archives',
                organization : 'NYU',
            },
            bhs      : {
                archivists : [
                    'weatherly@nyu.edu',
                    'maggie@brooklynhistory.org',
                ],
                name         : 'Brooklyn Historical Society',
                organization : 'BHS',
            },
            fales    : {
                archivists : [
                    'weatherly@nyu.edu',
                    'megan@nyu.edu',
                ],
                name         : 'Fales Library & Special Collections',
                organization : 'NYU',
            },
            lapietra : {
                archivists : [
                    'weatherly@nyu.edu',
                    'francesca@nyu.edu',
                ],
                name         : 'La Pietra',
                organization : 'NYU',
            },
            nyhs     : {
                archivists : [
                    'weatherly@nyu.edu',
                    'larry@nyhistory.org',
                ],
                name         : 'New-York Historical Society',
                organization : 'NYHS',
            },
            nyuad    : {
                archivists : [
                    'weatherly@nyu.edu',
                    'brad@nyu.edu',
                ],
                name         : 'NYU Abu Dhabi Archives and Special Collections',
                organization : 'NYU',
            },
            poly     : {
                archivists : [
                    'weatherly@nyu.edu',
                    'lyndsay@nyu.edu',
                ],
                name         : 'Poly Archives at Bern Dibner Library of Science and Technology',
                organization : 'NYU',
            },
            rism     : {
                archivists : [
                    'weatherly@nyu.edu',
                    'megan@nyu.edu',
                ],
                name         : 'Research Institute for the Study of Man',
                organization : 'NYU',
            },
            tamwag   : {
                archivists : [
                    'weatherly@nyu.edu',
                    'megan@nyu.edu',
                ],
                name         : 'Tamiment Library & Robert F. Wagner Labor Archives',
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

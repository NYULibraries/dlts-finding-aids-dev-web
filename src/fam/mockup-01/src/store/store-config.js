import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import inProcessFindingAids from './in-process-finding-aids';
import publishedFindingAids from './published-finding-aids';

const TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES = 1500;

const state = function () {
    return {
        currentRepositoryCodes                   : [],
        currentRepositoryNames                   : [],
        currentUser                              : '',
        fetchInitialPublishedFindingAidsMetadata : true,
        helpModal                                : {
            content : '',
            title   : '',
        },
        inProcessFindingAids                     : inProcessFindingAids,
        // https://jira.nyu.edu/jira/browse/FADESIGN-65
        repositories                             : {
            akkasah  : {
                archivists   : [
                    'weatherly@nyu.edu',
                    'carol.kassel@nyu.edu',
                    'deb.verhoff@nyu.edu',
                    'brad@nyu.edu',
                ],
                name         : 'Akkasah Center for Photography at NYU Abu Dhabi',
                organization : 'NYU',
                loadTime     : 0.068 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            archives : {
                archivists   : [
                    'weatherly@nyu.edu',
                    'carol.kassel@nyu.edu',
                    'deb.verhoff@nyu.edu',
                    'megan@nyu.edu',
                ],
                name         : 'New York University Archives',
                organization : 'NYU',
                loadTime     : 0.101 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            bhs      : {
                archivists   : [
                    'weatherly@nyu.edu',
                    'carol.kassel@nyu.edu',
                    'deb.verhoff@nyu.edu',
                    'maggie@brooklynhistory.org',
                ],
                name         : 'Brooklyn Historical Society',
                organization : 'BHS',
                loadTime     : 0.062 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            fales    : {
                archivists   : [
                    'weatherly@nyu.edu',
                    'carol.kassel@nyu.edu',
                    'deb.verhoff@nyu.edu',
                    'megan@nyu.edu',
                ],
                name         : 'Fales Library & Special Collections',
                organization : 'NYU',
                loadTime     : 0.238 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            lapietra : {
                archivists   : [
                    'weatherly@nyu.edu',
                    'carol.kassel@nyu.edu',
                    'deb.verhoff@nyu.edu',
                    'francesca@nyu.edu',
                ],
                name         : 'Villa La Pietra',
                organization : 'NYU',
                loadTime     : 0.013 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            nyhs     : {
                archivists   : [
                    'weatherly@nyu.edu',
                    'carol.kassel@nyu.edu',
                    'deb.verhoff@nyu.edu',
                    'larry@nyhistory.org',
                ],
                name         : 'New-York Historical Society',
                organization : 'NYHS',
                loadTime     : 0.147 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            nyuad    : {
                archivists   : [
                    'weatherly@nyu.edu',
                    'carol.kassel@nyu.edu',
                    'deb.verhoff@nyu.edu',
                    'brad@nyu.edu',
                ],
                name         : 'NYU Abu Dhabi Archives and Special Collections',
                organization : 'NYU',
                loadTime     : 0.003 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            poly     : {
                archivists   : [
                    'weatherly@nyu.edu',
                    'carol.kassel@nyu.edu',
                    'deb.verhoff@nyu.edu',
                    'lyndsay@nyu.edu',
                ],
                name         : 'Poly Archives at Bern Dibner Library of Science and Technology',
                organization : 'NYU',
                loadTime     : 0.012 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            tamwag   : {
                archivists   : [
                    'weatherly@nyu.edu',
                    'carol.kassel@nyu.edu',
                    'deb.verhoff@nyu.edu',
                    'megan@nyu.edu',
                ],
                name         : 'Tamiment Library & Robert F. Wagner Labor Archives',
                organization : 'NYU',
                loadTime     : 0.357 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
        },
        publishedFindingAids                     : publishedFindingAids,
        // https://jira.nyu.edu/jira/browse/FADESIGN-63
        users                                    : [
            'brad@nyu.edu',
            'carol.kassel@nyu.edu',
            'deb.verhoff@nyu.edu',
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

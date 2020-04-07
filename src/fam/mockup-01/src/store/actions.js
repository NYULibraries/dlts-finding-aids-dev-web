export default {
    setCurrentRepositories( { commit }, respositories ) {
        commit( 'setCurrentRepositories', repositories );
    },
    setCurrentUser( { commit }, user ) {
        commit( 'setCurrentUser', user );
    },
    setHelpModal( { commit }, HelpModal ) {
        commit( 'setHelpModal', HelpModal );
    },
};

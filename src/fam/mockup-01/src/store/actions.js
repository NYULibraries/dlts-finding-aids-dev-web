export default {
    setCurrentRepositories( { commit }, repositories ) {
        commit( 'setCurrentRepositories', repositories );
    },
    setCurrentUser( { commit }, user ) {
        commit( 'setCurrentUser', user );
    },
    setHelpModal( { commit }, helpModal ) {
        commit( 'setHelpModal', helpModal );
    },
    unpublishFindingAid( { commit }, findingAid ) {
        commit( 'unpublishFindingAid', findingAid );
    },
};

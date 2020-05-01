export default {
    addInProcessFindingAid( { commit }, findingAid ) {
        commit( 'addInProcessFindingAid', findingAid );
    },
    deleteInProcessFindingAid( { commit }, findingAid ) {
        commit( 'deleteInProcessFindingAid', findingAid );
    },
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

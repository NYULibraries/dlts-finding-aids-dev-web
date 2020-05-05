export default {
    addInProcessFindingAid( { commit }, findingAid ) {
        commit( 'addInProcessFindingAid', findingAid );
    },
    deleteInProcessFindingAid( { commit }, findingAid ) {
        commit( 'deleteInProcessFindingAid', findingAid );
    },
    setCurrentRepositoryCodes( { commit }, repositoryCodes ) {
        commit( 'setCurrentRepositoryCodes', repositoryCodes );
    },
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

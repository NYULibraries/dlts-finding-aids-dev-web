export default {
    addInProcessFindingAid( state, findingAid ) {
        state.inProcessFindingAids[ findingAid.repository ][ findingAid.id ] = findingAid;
    },
    deleteInProcessFindingAid( state, findingAid ) {
        delete state.inProcessFindingAids[ findingAid.repository ][ findingAid.id ];
    },
    setCurrentRepositories( state, repositories ) {
        state.currentRepositories = repositories;
    },
    setCurrentUser( state, user ) {
        state.currentUser = user;
    },
    setHelpModal( state, helpModal ) {
        state.helpModal = helpModal;
    },
    unpublishFindingAid( state, findingAid ) {
        delete state.publishedFindingAids[ findingAid.repository ][ findingAid.id ];
    },
};

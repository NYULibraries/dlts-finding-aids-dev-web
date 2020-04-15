export default {
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

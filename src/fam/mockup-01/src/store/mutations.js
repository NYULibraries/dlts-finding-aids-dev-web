export default {
    addInProcessFindingAid( state, findingAid ) {
        state.inProcessFindingAids[ findingAid.repository ][ findingAid.id ] = {
            datetime : findingAid.datetime,
            title    : findingAid.title,
        };
    },
    deleteInProcessFindingAid( state, findingAid ) {
        delete state.inProcessFindingAids[ findingAid.repository ][ findingAid.id ];
    },
    setCurrentRepositoryCodes( state, repositoryCodes ) {
        state.currentRepositoryCodes = repositoryCodes;
    },
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

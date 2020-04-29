<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <navbar />

            <h1 id="header">
                Manage in-process finding aids
            </h1>
        </b-container>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

import Navbar from './Navbar';

export default {
    name       : 'ManageInProcessFindingAids',
    components : {
        Navbar,
    },
    props : {
        msg : {
            type     : String,
            default  : null,
        },
    },
    mounted() {
        this.setHelpModal(
            {
                content : 'TODO',
                title   : 'Manage In-Process Finding Aids screen',
            },
        );
    },
    methods : {
        ...mapActions(
            [
                'setHelpModal',
            ],
        ),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #header {
        margin-top : 3%;
    }
</style>

<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <navbar />

            <h1 id="header">
                Manage published finding aids
            </h1>
        </b-container>
    </div>
</template>

<script>
import Navbar from './Navbar';

export default {
    name       : 'ManagePublishedFindingAids',
    components : {
        Navbar,
    },
    props : {
        msg : {
            type     : String,
            default  : null,
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #header {
        margin-top : 3%;
    }
</style>

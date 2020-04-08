<template>
    <b-container
        id="main-container"
        class="main-container h-100"
    >
        <Navbar :show-navigation-menu="false" />
        <b-row
            id="welcome-row"
            align-v="center"
        >
            <b-col>
                <h1>
                    Welcome to the FAM
                </h1>
            </b-col>
        </b-row>
        <b-row
            id="options-row"
        >
            <b-col
                class="option-column"
                cols="4"
            >
                <router-link
                    class="option-link"
                    :to="{ name : 'create' }"
                >
                    Create a finding aid
                </router-link>
            </b-col>
            <b-col
                class="option-column"
                cols="4"
            >
                <router-link
                    class="option-link"
                    :to="{ name : 'in-process' }"
                >
                    Manage in-process finding aids
                </router-link>
            </b-col>
            <b-col
                class="option-column"
                cols="4"
            >
                <router-link
                    class="option-link"
                    :to="{ name : 'published' }"
                >
                    Manage published finding aids
                </router-link>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapGetters } from 'vuex';

import Navbar from './Navbar.vue';

export default {
    name       : 'Home',
    components : {
        Navbar,
    },
    props    : {},
    computed : {
        ...mapGetters(
            [
                'currentUser',
            ],
        ),
    },
    mounted() {
        if ( ! this.currentUser ) {
            this.$router.push( { name : 'login' } );
        }
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.option-column {
    border : solid black 1px;
    /* Height of row = 900px * 18% */
    line-height : 162px;
}

.option-link {
    font-size : 24px;
}

#options-row {
    height : 18%;
}

#welcome-row {
    border : solid black 1px;
    height     : 18%;
    margin-top : 20%;
}
</style>

<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <navbar />

            <h1 id="header">
                Upload EAD XML file
            </h1>

            <b-row
                id="upload-row"
                class="row"
                align-h="center"
            >
                <b-col
                    id="upload-col"
                >
                    Upload
                </b-col>
            </b-row>

            <b-row
                id="results-row"
                class="row"
                align-h="center"
            >
                <b-col
                    id="results-col"
                >
                    <b-form-textarea
                        id="textarea"
                        v-model="results"
                        placeholder="Waiting for upload of EAD file..."
                        rows="20"
                        readonly
                    />
                </b-col>
            </b-row>

            <b-row
                id="buttons-row"
                class="row"
                align-h="center"
            >
                <b-col
                    id="buttons-col"
                    cols="10"
                >
                    <b-button
                        id="cancel-button"
                        class="button"
                        variant="dark"
                    >
                        Cancel
                    </b-button>
                    <b-button
                        id="submit-button"
                        class="button"
                        variant="success"
                    >
                        Submit
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Navbar from './Navbar';

export default {
    name       : 'CreateNewFindingAid',
    components : {
        Navbar,
    },
    props : {
        msg : {
            type     : String,
            default  : null,
        },
    },
    data() {
        return {
            results : '',
        };
    },
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
#header {
    margin-top : 3%;
}

#results-col {
    height : 500px;
}

.button {
    margin : 5px;
}

.row {
    padding : 5px;
}

div {
    border : solid black 1px;
}
</style>

<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <h1>Welcome to the Finding Aids Manager (FAM)</h1>

            <b-form @submit.prevent="clickSignIn">
                <b-row
                    id="main-row"
                    align-h="center"
                >
                    <b-col cols="2">
                        <label for="username">Username</label>
                    </b-col>
                    <b-col cols="4">
                        <b-form-input
                            id="username"
                            v-model="username"
                            type="email"
                        />
                    </b-col>
                </b-row>

                <b-row
                    align-h="center"
                    class="my-1"
                >
                    <b-col cols="2">
                        <label for="password">Password</label>
                    </b-col>
                    <b-col cols="4">
                        <b-form-input
                            id="password"
                            v-model="password"
                            type="password"
                        />
                    </b-col>
                </b-row>

                <b-row
                    align-h="center"
                    class="my-1"
                >
                    <b-col cols="6">
                        <button
                            id="sign-in-button"
                        >
                            Sign In
                        </button>
                    </b-col>
                </b-row>
            </b-form>
        </b-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name     : 'Login',
    data() {
        return {
            username : '',
            password : '',
        };
    },
    computed : {
        ...mapGetters(
            [
                'users',
            ],
        ),
    },
    methods : {
        clickSignIn() {
            if ( this.users.includes( this.username ) && this.password === 'password' ) {
                alert( 'User ' + this.username + ' has signed in.' );
            } else {
                alert( 'Invalid user and password combination' );
            }
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#login-header {
    margin-top: 5%;
}

#main-container {
    padding-top: 5%;
}

#main-row {
    margin-top: 5%;
}

#sign-in-button {
    margin-top: 5%;
}
</style>

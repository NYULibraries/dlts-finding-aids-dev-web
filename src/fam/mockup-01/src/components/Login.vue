<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <h1>Welcome to the Finding Aids Manager (FAM)</h1>

            <h2 id="login-header">
                Login
            </h2>

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
                        type="password"
                    />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name     : 'Login',
    computed : {
        ...mapGetters(
            [
                'users',
            ],
        ),
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
</style>

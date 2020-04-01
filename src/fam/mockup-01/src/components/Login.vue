<template>
    <div>
        <b-container>
            <h1>Welcome to the Finding Aids Manager (FAM)</h1>

            <h2>Login</h2>

            <b-row
                align-h="center"
                class="my-1"
            >
                <b-col cols="2">
                    <label>Username</label>
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
                    <label>Password</label>
                </b-col>
                <b-col cols="4">
                    <b-form-input
                        id="psasword"
                        type="password"
                    />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
    name  : 'Login',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
    border: solid black 1px;
}
</style>

<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">
                Home
            </router-link>
        </div>
        <router-view />

        <h1>App component</h1>

        this.$route:

        <code>
            {{ helpText }}
        </code>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name       : 'App',
    components : {
    },
    data() {
        return {
            helpText : this.$route,
        };
    },
    computed : {
        ...mapGetters(
            [
            ],
        ),
    },
    watch : {
    },
    mounted() {
        this._keyListener = function ( e ) {
            if ( e.key === 'h' && ( e.ctrlKey ) ) {
                e.preventDefault(); // present "Save Page" from getting triggered.

                alert( this.helpText );
            }
        };

        document.addEventListener( 'keydown', this._keyListener.bind( this ) );
    },
    beforeDestroy() {
        document.removeEventListener( 'keydown', this._keyListener );
    },
    methods : {
        ...mapActions(
            [
            ],
        ),
    },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<template>
    <div>
        <navbar :show-navigation-menu="true" />
        <h2>CreateNewFindingAid component</h2>
    </div>
</template>

<script>
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

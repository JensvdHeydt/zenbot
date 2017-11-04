<template>
    <div class="hello">
        <h1>{{ msg }} Main ROUTE</h1>

        <ul>
            <li v-for="selector in getSelectors">{{ selector }}</li>
        </ul>
        <select v-model="getSessions" v-on:change="sessionSelected">
            <!-- inline object literal -->
            <option v-bind:value="{ number: 123 }">123</option>
        </select>

        <!-- <select @change="onChange($event.target.value)">
            <option value="">Choose</option>
            <option v-for="(user, index) in users" :value="user.id" :selected="user.id == account.id">{{ user.name }}</option>
        </select>-->

        <select v-on:change="sessionSelected" v-model="selectedSession">
            <option value="">Choose</option>
            <option v-for="session in getSessions" :value="session._id" >{{ session.started | moment("dddd, MMMM Do YYYY, h:mm:ss a") }} {{ session.options.strategy }}</option>
        </select>


    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'HelloWorld',
    computed: {
      ...mapGetters([
        'getSelectors',
        'getSessions'
      ])
    },
    data () {
      return {
        selectedSession: null,
        msg: 'Welcome to Your Vue.js App'
      }
    },
    methods: {
      sessionSelected () {
        this.$router.push({name: 'chart', params: {sessionId: this.selectedSession}})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
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

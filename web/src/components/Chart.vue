<template>
    <div class="hello">
        <h1>{{ msg }} Chart </h1>

        <select v-on:change="sessionSelected" v-model="sessionId">
            <option value="">Choose</option>
            <option v-for="session in getSessions" :value="session._id" >{{ session.started | moment("LLLL") }} {{ session.options.strategy }}</option>
        </select>
<!--
        <div v-if="dataReady">
            <ohlc-chart :chart-data="mapData()" :margin="margin" :dimension="dimension" :title="title"></ohlc-chart>
            <div>Open High Low Close (ohlc)</div>
        </div>
        <div v-if="!dataReady">
            Loading...
        </div>
-->
        <div v-if="dataReady">
            <crosshair-chart :trade-data="mapTradeData()" :chart-data="mapData()" :margin="margin" :dimension="dimension" :title="title"></crosshair-chart>
            <div>Open High Low Close (ohlc)</div>
        </div>
        <div v-if="!dataReady">
            Loading...
        </div>

    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import axios from 'axios'
  import OhlcChart from './charts/ohlcChart'
  import CrosshairChart from './charts/crosshairChart'

  // var d3 = window.d3

  export default {
    beforeMount () {
      this.loadDataForSession(this.sessionId)
    },
    computed: {
      ...mapGetters([
        'getSelectors',
        'getSessions'
      ])
    },
    props: {
      sessionId: null
    },
    name: 'Chart',

    data () {
      return {
        dataReady: false,
        msg: 'Welcome to Your Vue.js App',
        // sessionId: null,
        periods: [],
        myTrades: [],
        margin: {
          top: 20,
          right: 50,
          bottom: 30,
          left: 50
        },
        dimension: {
          width: 1650,
          height: 600
        },
        title: 'CandleStick'
      }
    },
    components: {
      OhlcChart,
      CrosshairChart
    },
    methods: {
      loadDataForSession (id) {
        axios.get('http://192.168.64.100:3002/getperiodsforsession/' + id).then((response) => {
          this.periods = response.data

          axios.get('http://192.168.64.100:3002/getmytrades/' + id).then((response) => {
            this.myTrades = response.data
            this.dataReady = true
          })
        })
      },
      sessionSelected () {
        this.$router.push({name: 'chart', params: {sessionId: this.sessionId}})
        this.$router.go()
        // this.loadDataForSession(this.sessionId)
      },
      mapTradeData () {
        return this.myTrades.map(function (t) {
          console.log(t.type)
          console.log(new Date(+t.time + +t.execution_time))
          return {

            date: new Date(+t.time + +t.execution_time),
            type: t.type,
            price: +t.price,
            low: +t.price,
            high: +t.price // ToDo Slippage?
          }
        })
      },
      mapData () {
        // let parseDate = d3.timeParse('%Q')
        return this.periods.slice(0, this.periods.length).map(function (d) {
          return {
            date: new Date(+d.time),
            open: +d.open,
            high: +d.high,
            low: +d.low,
            close: +d.close,
            volume: d.volume
          }
        })
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

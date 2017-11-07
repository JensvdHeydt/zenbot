<template>
  <div>
    <h1>hallo</h1>
    <div id="chart2" style="width: 100%; height: 450px"></div>
  </div>
</template>
<script>
  var d3 = window.d3
  var fc = window.fc

  export default ({
    name: 'crosshair-chart2',
    data () {
      return {}
    },
    props: ['chartData', 'tradeData'],
    mounted () {
      this.draw()
    },
    methods: {
      draw () {
        console.log('draw2 called')
        // var data = fc.randomFinancial()(10)
        var data = this.chartData

        var yExtent = fc.extentLinear()
          .accessors([
            function (d) {
              return d.high
            },
            function (d) {
              return d.low
            }
          ])

        var xExtent = fc.extentDate()
          .accessors([function (d) {
            return d.date
          }])

        var gridlines = fc.annotationSvgGridline()
        var candlestick = fc.seriesSvgCandlestick()
        var multi = fc.seriesSvgMulti()
          .series([gridlines, candlestick])

        var chart = fc.chartSvgCartesian(
          fc.scaleDiscontinuous(d3.scaleTime()),
          d3.scaleLinear()
        )
          .yDomain(yExtent(data))
          .xDomain(xExtent(data))
          .plotArea(multi)

        d3.select('#chart2')
          .datum(data)
          .call(chart)
      }
    }
  })
</script>

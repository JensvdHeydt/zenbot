<template>
  <div>
    <h1>hallo</h1>
    <div id='main-chart' style='width: 100%;height: 500px'></div>
    <div id='navigator-chart' style='width: 100%;height: 250px'></div>
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

        const yExtent = fc.extentLinear()
          .accessors([
            function (d) {
              return d.high
            },
            function (d) {
              return d.low
            }
          ])
          .pad([0.1, 0.1])

        const xExtent = fc.extentDate()
          .accessors([d => d.date])

        // create the scales
        const x = d3.scaleTime()
          .domain(xExtent(this.chartData))
        const y = d3.scaleLinear()
          .domain(yExtent(this.chartData))

        // create the data that is bound to the charts. It is a combination of the
        // chart data and the brushed / navigator range
        var chartData = {
          series: this.chartData,
          // set an initial brushed range
          brushedRange: [0.85, 1]
        }

        const brush = fc.brushX()
          .on('brush', (evt) => {
            // if the brush has zero height there is no selection
            if (evt.selection) {
              // update the bound data based on the new selcetion
              chartData.brushedRange = evt.selection
              // update the domain of the main chart to reflect the brush
              mainChart.xDomain(evt.xDomain)
              render()
            }
          })
        const area = fc.seriesSvgArea()
          .crossValue(d => d.date)
          .mainValue(d => d.close)
          .baseValue(y.domain()[0])
        const line = fc.seriesSvgLine()
          .crossValue(d => d.date)
          .mainValue(d => d.close)
        var candlestick = fc.seriesSvgCandlestick()
        // create a multi series, combining the brush and area
        const multi = fc.seriesSvgMulti()
          .series([area, brush])
          .mapping((data, index, series) => {
            switch (series[index]) {
              case area:
                return data.series
              case candlestick:
                return data.series
              case brush:
                return data.brushedRange
            }
          })

        // create the two charts
        const mainChart = fc.chartSvgCartesian(x, y)
          .plotArea(line)

        const navigatorChart = fc.chartSvgCartesian(x.copy(), y.copy())
          .plotArea(multi)

        // set the initial domain for the main chart based on the
        // brushed range
        var scale = d3.scaleLinear().domain(x.domain())
        mainChart.xDomain(chartData.brushedRange.map(scale.invert))

        // each time the bruch changes, re-render both charts
        const render = () => {
          d3.select('#main-chart')
            .datum(chartData.series)
            .call(mainChart)

          d3.select('#navigator-chart')
            .datum(chartData)
            .call(navigatorChart)
        }

        render()
      }
    }
  })
</script>
<style>
  .plot-area {
    overflow: hidden;
  }

  /* for the navigator chart, hide the y axis, and 'collapse' the chart title
		 and x-axis label so that they do not occupy any space */
  #navigator-chart .y-axis {
    visibility: hidden;
  }

  #navigator-chart .chart-label, #navigator-chart .x-axis-label {
    display: none;
  }
</style>

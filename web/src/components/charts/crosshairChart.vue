<script>
  import BaseChart from './baseChart'

  var d3 = window.d3
  var techan = window.techan
  export default BaseChart.extend({
    name: 'crosshair-chart',
    data () {
      return {
        x: null,
        y: null,
        xAxis: null,
        yAxis: null,
        xTopAxis: null,
        yRightAxis: null,
        candlestick: null,
        ohlcRightAnnotation: null,
        timeAnnotation: null,
        ohlcAnnotation: null,
        timeTopAnnotation: null,
        svg: null,
        accessor: null,
        zoom: null,
        zoomableInit: null,
        crosshair: null,
        trend_ema: null,
        trend_ema_accessor: null
      }
    },
    props: {
      dimension: {
        width: 960,
        height: 300
      }
    },
    methods: {
      draw () {
        console.log('draw called')
        this.svg.select('g.candlestick').call(this.candlestick)
        // using refresh method is more efficient as it does not perform any data joins
        // Use this if underlying data is not changing
//        svg.select("g.candlestick").call(candlestick.refresh);
        this.svg.select('g.x.axis').call(this.xAxis)
        this.svg.select('g.y.axis').call(this.yAxis)
        this.svg.select('g.x.axis2').call(this.xTopAxis)
        this.svg.select('g.y.axis2').call(this.yRightAxis)
        this.svg.select('g.crosshair').call(this.crosshair)

        this.svg.select('g.tradearrow').datum(this.tradeData).call(this.tradearrow)
      },
      zoomed () {
        var rescaledY = d3.event.transform.rescaleY(this.y)
        this.yAxis.scale(rescaledY)
        this.yRightAxis.scale(rescaledY)
        this.candlestick.yScale(rescaledY)
        this.crosshair.yScale(rescaledY)

        this.tradearrow.y(function (d) {
          // Display the buy and sell arrows a bit above and below the price, so the price is still visible
          if (d.type === 'buy') return rescaledY(d.low) + 1
          if (d.type === 'sell') return rescaledY(d.high) - 1
          else return rescaledY(d.price)
        })

        // Emulates D3 behaviour, required for financetime due to secondary zoomable scale
        this.x.zoomable().domain(d3.event.transform.rescaleX(this.zoomableInit).domain())

        this.draw()
      },
      renderChart () {
        let _that = this

        let width = this.dimension.width - this.margin.left - this.margin.right
        let height = this.dimension.height - this.margin.top - this.margin.bottom
        this.x = techan.scale.financetime()
          .range([0, width])
        this.y = d3.scaleLinear()
          .range([height, 0])

        this.zoom = d3.zoom()
          .on('zoom', this.zoomed)

        this.candlestick = techan.plot.candlestick()
          .xScale(this.x)
          .yScale(this.y)

        this.tradearrow = techan.plot.tradearrow()
          .xScale(this.x)
          .yScale(this.y)
          .y(function (d) {
            // Display the buy and sell arrows a bit above and below the price, so the price is still visible
            if (d.type === 'buy') return _that.y(d.low) + 1
            if (d.type === 'sell') return _that.y(d.high) - 1
            else return _that.y(d.price)
          })

        this.trend_ema = techan.plot.close()
          .xScale(this.x)
          .yScale(this.y)
        this.trend_ema_accessor = this.trend_ema.accessor()

        this.xAxis = d3.axisBottom(this.x)
        this.xTopAxis = d3.axisTop(this.x)
        this.yAxis = d3.axisLeft(this.y)
        this.yRightAxis = d3.axisRight(this.y)
        this.ohlcAnnotation = techan.plot.axisannotation()
          .axis(this.yAxis)
          .orient('left')
          // .format(d3.format(',.2f'))
        this.ohlcRightAnnotation = techan.plot.axisannotation()
          .axis(this.yRightAxis)
          .orient('right')
          .translate([width, 0])
        this.timeAnnotation = techan.plot.axisannotation()
          .axis(this.xAxis)
          .orient('bottom')
          .format(d3.timeFormat('%Y-%m-%d'))
          .width(85)
          .height(20)
          .translate([0, height])
        this.timeTopAnnotation = techan.plot.axisannotation()
          .axis(this.xTopAxis)
          .width(85)
          .orient('top')
        this.crosshair = techan.plot.crosshair()
          .xScale(this.x)
          .yScale(this.y)
          .xAnnotation([this.timeAnnotation, this.timeTopAnnotation])
          .yAnnotation([this.ohlcAnnotation, this.ohlcRightAnnotation])

        this.svg = d3.select(this.$el)
          .attr('width', width + this.margin.left + this.margin.right)
          .attr('height', height + this.margin.top + this.margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')

        this.svg.append('clipPath')
          .attr('id', 'clip')
          .append('rect')
          .attr('x', 0)
          .attr('y', this.y(1))
          .attr('width', width)
          .attr('height', this.y(0) - this.y(1))

        this.svg.append('g')
          .datum(this.chartData)
          .attr('class', 'candlestick')
          .attr('clip-path', 'url(#clip)')
        // .call(this.candlestick)

        this.svg.append('g')
          .attr('class', 'trend_ema')
          .datum(this.chartData).call(this.trend_ema)

        this.svg.append('rect')
          .attr('class', 'pane')
          .attr('width', width)
          .attr('height', height)
          .call(this.zoom)

        this.accessor = this.candlestick.accessor()
        this.chartData = this.chartData.sort(function (a, b) {
          return d3.ascending(_that.accessor.d(a), _that.accessor.d(b))
        })
        this.x.domain(this.chartData.map(this.accessor.d))
        this.y.domain(techan.scale.plot.ohlc(this.chartData, this.accessor).domain())

        this.svg.append('g')
          .attr('class', 'x axis2')
          .call(this.xTopAxis)
        this.svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(this.xAxis)
        this.svg.append('g')
          .attr('class', 'y axis')
          .call(this.yAxis)
        this.svg.append('g')
          .attr('class', 'y axis2')
          .attr('transform', 'translate(' + width + ',0)')
          .call(this.yRightAxis)
        this.svg.append('g')
          .attr('class', 'y annotation left')
          .datum([{
            value: 74
          }, {
            value: 67.5
          }, {
            value: 58
          }, {
            value: 40
          }]) // 74 should not be rendered
          .call(this.ohlcAnnotation)
        this.svg.append('g')
          .attr('class', 'x annotation bottom')
          .datum([{
            value: this.x.domain()[30]
          }])
          .call(this.timeAnnotation)
          .call(this.zoom)
        this.svg.append('g')
          .attr('class', 'y annotation right')
          .datum([{
            value: 61
          }, {
            value: 52
          }])
          .call(this.ohlcRightAnnotation)
        this.svg.append('g')
          .attr('class', 'x annotation top')
          .datum([{
            value: this.x.domain()[80]
          }])
          .call(this.timeTopAnnotation)
        this.svg.append('g')
          .attr('class', 'crosshair')
          .datum({
            x: this.x.domain()[80],
            y: 67.5
          })
          .call(this.crosshair)
          .each(function (d) {
            console.log('move(d)')
          }).call(this.zoom) // Display the current data

        this.svg.append('text')
          .attr('x', 5)
          .attr('y', 15)
          .text(this.title)
        this.svg.append('g')
          .attr('class', 'tradearrow')
          .attr('clip-path', 'url(#clip)')
        // .attr('clip-path', 'url(#ohlcClip)')

        this.draw()
        // Associate the zoom with the scale after a domain has been applied
        // Stash initial settings to store as baseline for zooming
        this.zoomableInit = this.x.zoomable().clamp(false).copy()
      }
    }
  })
</script>
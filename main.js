// Just a modified copy of this: http://bl.ocks.org/enjalot/1429426

var w = 400
var h = 400

function bars(data) {
  max = d3.max(data)

  // nice breakdown of d3 scales
  // http://www.jeromecukier.net/blog/2011/08/11/d3-scales-and-color/
  x = d3.scale.linear()
    .domain([0, max])
    .range([0, w])

  y = d3.scale.ordinal()
    .domain(d3.range(data.length))
    .rangeBands([0, h], .2)

  var vis = d3.select("#barchart")

  // a good written tutorial of d3 selections coming from protovis
  // http://www.jeromecukier.net/blog/2011/08/09/d3-adding-stuff-and-oh-understanding-selections/
  var bars = vis.selectAll("rect.bar").data(data)

  // update
  bars
    .attr("fill", "#0a0")
    .attr("stroke", "#050")

  // enter
  bars.enter()
    .append("svg:rect")
    .attr("class", "bar")
    .attr("fill", "#800")
    .attr("stroke", "#800")

  // exit
  bars.exit()
    .transition()
    .duration(300)
    .ease("exp")
    .attr("width", 0)
    .remove()

  bars
    .attr("stroke-width", 4)
    .transition()
    .duration(300)
    .ease("quad")
    .attr("width", x)
    .attr("height", y.rangeBand())
    .attr("transform", function(d,i) {
      return "translate(" + [0, y(i)] + ")"
    })
}


function init() {
  var svg = d3.select("#svg")
    .attr("width", w+100)
    .attr("height", h+100)

  svg.append("svg:rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("stroke", "#000")
    .attr("fill", "none")

  svg.append("svg:g")
    .attr("id", "barchart")
    .attr("transform", "translate(50,50)")

  function update() {
    bars(random(10))
  }
  update()
  setInterval(update, 3000)
}

function random(n) {
  val = []
  for(i = 0; i < n; i++) {
    val.push(Math.random() * 100)
  }
  return val
}

function drawPCP() {
    var data = [];
    for (var i=0; i<window.clusterdata.length; i++) {
        data.push({
            'class': window.clusterdata[i]['class'],
            'value': window.clusterdata[i]['points'].length,
            'color': colorlist[window.clusterdata[i]['class']]
        });
    }
    //  '/static/clusterdata/thew.csv'
    d3.select("#parallel").select('svg').remove();
    var element = d3.select('#parallel').node();
    var margin = {top: 20, right: 10, bottom: 10, left: 10};
    var width = element.getBoundingClientRect().width - margin.left - margin.right;
    var height = element.getBoundingClientRect().height  - margin.top - margin.bottom;
    var linemax = d3.max(data, function(d){
        return d.value;
    })
    data = data.sort(function (a, b) {
        return d3.ascending(a.class, b.class);
    });

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {},
        dragging = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select('#parallel').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(window.clusterdataPath+'thew.csv', function(error, wdata) {
        //
        x.domain(dimensions = d3.keys(wdata[0]).filter(function(d) {
            if(d == "class"){
                y[d] = d3.scale.linear()
                    .domain(d3.extent(wdata, function(p) { return +p[d]; }))
                    .range([height, 0]);
            }
            else{
                y[d] = d3.scale.linear()
                    .domain([0,1])
                    .range([height, 0]);
            }
            return y[d];
        }));

        var lines = [];
        data.forEach(function (d,i) {
            lines.push(wdata[d.class]);
        });

        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
            .attr('id', function (d,i) {
                return "class"+ data[i].class;
            })
            .selectAll("path")
            .data(lines)
            .enter().append("path")
            .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
            .attr("class", "foreground")
            .attr('id', function (d,i) {
                return "class"+ data[i].class;
            })
            .selectAll("path")
            .data(lines)
            .enter().append("path")
            .attr("d", path)
            .style('stroke', function(d,i){
                return data[i].color;
            })
            .style('stroke-width', function(d,i){
                return (data[i].value/linemax)*5+2;
            })
            .on('click',function (d,i) {
                console.log(data[i]);
            });

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            .call(d3.behavior.drag()
                .origin(function(d) { return {x: x(d)}; })
                .on("dragstart", function(d) {
                    dragging[d] = x(d);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function(d) {
                    dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    dimensions.sort(function(a, b) { return position(a) - position(b); });
                    x.domain(dimensions);
                    g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                })
                .on("dragend", function(d) {
                    delete dragging[d];
                    transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                    transition(foreground).attr("d", path);
                    background
                        .attr("d", path)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                }));

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; });
        // Add and store a brush for each axis.
        g.append("g")
            .attr("class", "brush")
            .each(function(d) {
                d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    })

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

// Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

// Handles a brush event, toggling the display of foreground lines.
    function brush() {
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? null : "none";
        });
    }

}


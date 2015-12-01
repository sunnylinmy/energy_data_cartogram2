
// hide the form if the browser doesn't do SVG,
// (then just let everything else fail)
if (!document.createElementNS) {
    document.getElementsByTagName("form")[0].style.display = "none";
}


var percent = (function() {
            var fmt = d3.format(".2f");
            return function(n) { return fmt(n) + "%"; };
        })();

var years = [1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2020,2025,2030,2035,2040],
    fields = [
//            {name: "(no scale)", id: "none"},
           {name: "Primary Energy Consumption (Quadrillion BTU)", id: "PECons", key: "PECons%d", years: years}
//            {name: "Population", id: "num_articles2001", key: "num_articles2001", format: "+,"},
//            {name: "% FB users", id: "p_fb_users", key: "p_fb_users", format: percent},
            // {name: "% of Articles", id: "p_int_users", key: "p_int_users", format: percent},
//            {name: "% Internet users", id: "p_int_users", key: "p_int_users", format: percent},
//            {name: "% FB users of Internet Users", id: "p_fb_users_of_int_users", key: "p_fb_users_of_int_users", format: percent}
        ],

      field = fields[0],
      year = years[0],
      mycolor = ['#deebf7','#9ecae1','#3182bd'],
      colors = mycolor.map(function(rgb) { return d3.hsl(rgb); });



d3.select("input[type=range]").on("change", function() { year = this.value; update(); });
d3.select("input[type=range]").on("click", function() { clearInterval(intervalId); });

var formatter = d3.format("2f");
var tickFormatter = function(d) {
    return formatter(d);
}


//var slider = d3.slider().min(1971).max(2040).ticks(10).showRange(true).tickFormat(tickFormatter).tickValues(["1980","1990","2000","2010","2020","2030","2040"]);

//d3.select("#slider").call(slider);

//d3.select('#slider').on("change", function() { year = this.value; update(); });
//d3.select('#slider').on("click", function() { clearInterval(intervalId); });

//d3.select("#slider").call(d3.slider().axis(true).min(1971).max(2040).step(1).on("slide",function(year = this.value;update();clearInterval(intervalId);)));
//d3.select('#slider').call(d3.slider().axis(true).min(1973).max(2040).ticks(10).showRange(true).value(1973).tickValues(["1980","1990","2000","2010","2020","2030","2040"])
//    .on("change", function() { year = this.value; update(); }));

//d3.select('#slider').on("click", function() { clearInterval(intervalId); });

var intervalId = setInterval(function(){
    if (year < 2012){
        year = year+1;
        update();
    }else if (year == 2012){
        year = year+8;
        update();
    }else if ((year >= 2020) && (year < 2040)){
        year = year+5;
        update();
    }else{
        setInterval(intervalId);
    }
})

var map = d3.select("#map"),
        zoom = d3.behavior.zoom()
                .translate([-228, 32])
                .scale(1.5)
                .scaleExtent([0.5, 10.0])
                .on("zoom", updateZoom),
        layer = map.append("g")
                .attr("id", "layer"),
        countries = layer.append("g")
                .attr("id", "countries")
                .selectAll("path");

// map.call(zoom);
updateZoom();

function updateZoom() {
    var scale = zoom.scale();
    layer.attr("transform",
            "translate(" + zoom.translate() + ") " +
                    "scale(" + [scale, scale] + ")");
}

var proj = d3.geo.eckert3(),
        topology,
        geometries,
        rawData,
        dataById = {},
        carto = d3.cartogram()
                .projection(proj)
                .properties(function(d) {
                    if (d.id in dataById) {
                        return dataById[d.id];
                    } else {
                        var tmp = d3.keys(dataById[d3.keys(dataById)[0]]);
                        var ret = {"numcode": d.id};
                        tmp.forEach(function(i){ret[i] = 0});
                        return ret;
                    }
                })
                .value(function(d) {
                    return +d.properties[field];
                });


var segmentized = location.search === "?segmentized",
        url = ["data",
            segmentized ? "world-segmentized.topojson" : "world-110m_withoutAntarctica.json"
        ].join("/");
d3.json(url, function(topo) {
    topology = topo;
    geometries = topology.objects.countries.geometries;
    d3.csv("data/Energy_Consumption_Countries_20151201.csv", function(data) {
        rawData = data;
        dataById = d3.nest()
                .key(function(d) { return d.numcode; })
                .rollup(function(d) { return d[0]; })
                .map(data);
        init();
    });
});



function init() {
    var features = carto.features(topology, geometries),
            path = d3.geo.path()
                    .projection(proj);

    countries = countries.data(features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("id", function(d) {
                return d.id;
            })
            .attr("name", function(d) {
                return d.properties.country;
            })
            .attr("fill", "#fafafa")
            .attr("d", path);

    countries.append("title");


}



function update() {
   // var start = Date.now();


    var key = field.key.replace("%d", year),
            fmt = (typeof field.format === "function")
                    ? field.format
                    : d3.format(field.format || ","),
            value = function(d) {
                return +d.properties[key];
            },
            values = countries.data()
                    .map(value)
                    .filter(function(n) {
                        return !isNaN(n);
                    })
                    .sort(d3.ascending),
            lo = values[0],
            hi = values[values.length - 1];

    var color = d3.scale.linear()
            .range(colors)
            .domain(lo < 0
                    ? [lo, 0, hi]
                   : [lo, d3.mean(values), hi]);

    // normalize the scale to positive numbers
    var scale = d3.scale.linear()
            .domain([lo, hi])
            .range([1, 1000]);

    // tell the cartogram to use the scaled values
    carto.value(function(d) {
        return scale(value(d));
    });

    // generate the new features, pre-projected
    var features = carto(topology, geometries).features;

    // update the data
    countries.data(features)
            .select("title")
            .text(function(d) {
                return [d.properties.country, fmt(value(d))].join(": ");
            });

    countries.transition()
            .duration(500)
            .ease("linear")
            .attr("fill", function(d) {
                return color(value(d));
            })
            .attr("d", carto.path);


    d3.select("input[type=range]")[0][0].value=year;
    d3.select("#theyear > span")[0][0].innerHTML=year;

    //d3.select("#slider")[0][0].value = year;
};

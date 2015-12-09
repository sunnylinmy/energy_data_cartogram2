
function carbonData(){

     d3.selectAll("svg > *").data([]).exit().remove();
     d3.selectAll("#axis-container > *").remove();

    var years = [1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,
    1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,
    1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,
    2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,
    2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040],
        fields2 = [
              {name: "CO2 Emission", id: "Carbon", key: "Carbon%d", years: years}
      ],

      field2 = fields2[0],
      year = years[0],
      mycolor3 = ['#e5f5f9','#99d8c9','#2ca25f'],
      colors3 = mycolor3.map(function(rgb) { return d3.hsl(rgb); });

    d3.select("input[type=range]").on("change", function() { year = this.value; update(); });
    d3.select("input[type=range]").on("click", function() { clearInterval(intervalId); });

        var intervalId = setInterval(function(){
        if (year < 2040){
        year = year+1;
        update();
        }else{
            setInterval(intervalId);
        }
        })

    var map = d3.select("#map"),
        zoom = d3.behavior.zoom()
                .translate([-170, -50])
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
        var scale2 = zoom.scale();
        layer.attr("transform",
            "translate(" + zoom.translate() + ") " +
                    "scale(" + [scale2, scale2] + ")");
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
                    return +d.properties[field2];
                });


    var segmentized = location.search === "?segmentized",
        url = ["data",
            segmentized ? "world-segmentized.topojson" : "world-110m_withoutAntarctica.json"
        ].join("/");

    d3.json(url, function(topo) {

    //countries.exit().remove();
        topology = topo;
        geometries = topology.objects.countries.geometries;
        d3.csv("data/CO2_Emission_All.csv", function(data) {
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


    };



    function update() {
   // var start = Date.now();


        var key = field2.key.replace("%d", year),
            fmt = (typeof field2.format === "function")
                    ? field2.format
                    : d3.format(field2.format || ","),
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
            .range(colors3)
            .domain(lo < 0
                    ? [lo, 0, hi]
                   : [lo, d3.mean(values), hi]);

    // normalize the scale to positive numbers
        var scale22 = d3.scale.linear()
            .domain([lo, hi])
            .range([1, 1000]);

    // tell the cartogram to use the scaled values
        carto.value(function(d) {
            return scale22(value(d));
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

        countries.data(features).exit().remove();  ///////////////////////////////////////////////

    };
       var x_a = d3.scale.linear().domain([1971, 2040]).range([0,1200]);

        var xAxis_a = d3.svg.axis().scale(x_a).ticks(20,"s").orient("bottom").tickFormat(d3.format("04d"));
      
        var svg_a = d3.select("#axis-container").append("svg").attr("width",1200).attr("height",30);

        svg_a.append("g").attr("class","x axis").attr("width",1200).attr("height",30).call(xAxis_a).selectAll(".tick text").style("text-anchor","end");



};


function energyData(){
     d3.selectAll("svg > *").data([]).exit().remove();
     d3.selectAll("#axis-container > *").remove();

    var years = [1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,
    1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,
    1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,
    2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,
    2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040],
       fields = [
           {name: "Primary Energy Consumption (Quadrillion BTU)", id: "PECons", key: "PECons%d", years: years}
     ],

      field = fields[0],
      year = years[0],
      mycolor = ['#deebf7','#9ecae1','#3182bd'],
      colors = mycolor.map(function(rgb) { return d3.hsl(rgb); });


    d3.select("input[type=range]").on("change", function() { year = this.value; update(); });
    d3.select("input[type=range]").on("click", function() { clearInterval(intervalId); });
    
    var intervalId = setInterval(function(){
        if (year < 2040){
           year = year+1;
            update();
        }else{
            setInterval(intervalId);
        }
    });

     function updateZoom() {
        var scale1 = zoom.scale();
        layer.attr("transform",
            "translate(" + zoom.translate() + ") " +
                    "scale(" + [scale1, scale1] + ")");
    }


    var map = d3.select("#map"),
        zoom = d3.behavior.zoom()
                .translate([-170, -50])
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
        d3.csv("data/Energy_Consumption_Countries_20151202.csv", function(data) {
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
        var scale11 = d3.scale.linear()
                    .domain([lo, hi])
                    .range([1, 1000]);

    // tell the cartogram to use the scaled values
        carto.value(function(d) {
            return scale11(value(d));
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

        countries.data(features).exit().remove();  //////////////////////////////////////////////////////////////

    };

    var formatter = d3.time.format("%y");
    var tickFormatter = function(d) {
        return formatter(d);
    }
       var x_b = d3.scale.linear().domain([1971, 2040]).range([0,1200]);

        var xAxis_b = d3.svg.axis().scale(x_b).ticks(20,"s").orient("bottom").tickFormat(d3.format("04d"));
      
        var svg_b = d3.select("#axis-container").append("svg").attr("width",1200).attr("height",30);

        svg_b.append("g").attr("class","x axis").attr("width",1200).attr("height",30).call(xAxis_b).selectAll(".tick text").style("text-anchor","end");



};

function gdpData(){

     d3.selectAll("svg > *").data([]).exit().remove();
     d3.selectAll("#axis-container > *").remove();

    var years = [1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,
    1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,
    1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,
    2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,
    2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040],
        fields1 = [
              {name: "GDP PPP (trillion 2005 $)", id: "GDP", key: "GDP%d", years: years}
      ],

      field1 = fields1[0],
      year = years[0],
      mycolor2 = ['#fee6ce','#fdae6b','#e6550d'],
      colors2 = mycolor2.map(function(rgb) { return d3.hsl(rgb); });

    d3.select("input[type=range]").on("change", function() { year = this.value;update();});
    d3.select("input[type=range]").on("click", function() { clearInterval(intervalId);});

        var intervalId = setInterval(function(){
        if (year < 2040){
        year = year+1;
        update();
        }else{
            setInterval(intervalId);
         }
        })

    var map = d3.select("#map"),
        zoom = d3.behavior.zoom()
                .translate([-170, -50])
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
        var scale3 = zoom.scale();
        layer.attr("transform",
            "translate(" + zoom.translate() + ") " +
                    "scale(" + [scale3, scale3] + ")");
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
                    return +d.properties[field1];
                });


    var segmentized = location.search === "?segmentized",
        url = ["data",
            segmentized ? "world-segmentized.topojson" : "world-110m_withoutAntarctica.json"
        ].join("/");

    d3.json(url, function(topo) {

    //countries.exit().remove();
        topology = topo;
        geometries = topology.objects.countries.geometries;
        d3.csv("data/GDP_PPP_All.csv", function(data) {
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


    };



    function update() {
   // var start = Date.now();


        var key = field1.key.replace("%d", year),
            fmt = (typeof field1.format === "function")
                    ? field1.format
                    : d3.format(field1.format || ","),
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
            .range(colors2)
            .domain(lo < 0
                    ? [lo, 0, hi]
                   : [lo, d3.mean(values), hi]);

    // normalize the scale to positive numbers
        var scale33 = d3.scale.linear()
            .domain([lo, hi])
            .range([1, 1000]);

    // tell the cartogram to use the scaled values
        carto.value(function(d) {
            return scale33(value(d));
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
        
        countries.data(features).exit().remove();              ////////////////////////////////////////
        //countries.data(features).exit();        //////////////////////////////////////////////////

    };
       var x_c = d3.scale.linear().domain([1971, 2040]).range([0,1200]);

        var xAxis_c = d3.svg.axis().scale(x_c).ticks(20,"s").orient("bottom").tickFormat(d3.format("04d"));
      
        var svg_c = d3.select("#axis-container").append("svg").attr("width",1200).attr("height",30);

        svg_c.append("g").attr("class","x axis").attr("width",1200).attr("height",30).call(xAxis_c).selectAll(".tick text").style("text-anchor","end");

 
};

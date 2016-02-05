
//     d3.selectAll("svg > *").data([]).exit().remove();

        d3.selectAll("#axis-container > *").remove();

        var axis_containter_width = document.getElementById("axis-container").clientWidth;
        //var axis_containter_width = $('#axis-container').width();
        var map_containter_height = document.getElementById("map-container").clientHeight;
        var map_containter_width = document.getElementById("map-container").clientWidth;


        var x_b = d3.scale.linear().domain([1971, 2040]).range([0, axis_containter_width]);

        //var xAxis_b = d3.svg.axis().scale(x_b).tickValues([1971,1975,1980,1985,1990,1995,2000,2005,2010,2015,2020,2025,2030,2035,2040]).orient("bottom").tickFormat(d3.format("04d"));
        var xAxis_b = d3.svg.axis().scale(x_b).ticks(15,"s").orient("bottom").tickFormat(d3.format("04d")).tickValues([1971,1975,1980,1985,1990,1995,2000,2005,2010,2015,2020,2025,2030,2035,2040]);

        var svg_b = d3.select("#axis-container").append("svg").attr("width",'100%').attr("height",30);

        svg_b.append("g").attr("class","x axis").attr("width",'100%').attr("height",30).call(xAxis_b).selectAll(".tick text").style("text-anchor","end");


    var years = [1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,
    1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,
    1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,
    2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,
    2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040];
     var mycolor_blue = ['#deebf7','#9ecae1','#3182bd'];
     var mycolor_green = ['#e5f5f9','#99d8c9','#2ca25f'];
     var mycolor_orange = ['#fee6ce','#fdae6b','#e6550d'];
     var mycolor_red = ['#ffabab','#f86161','#9b0707'];
     var mycolor = ['#deebf7','#9ecae1','#3182bd','#e5f5f9','#99d8c9','#2ca25f','#fee6ce','#fdae6b','#e6550d','#ffabab','#f86161','#9b0707'];

        d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Primary Energy Consumption (Quadrillion BTU)");

    var fields = [
           {name: "Primary Energy Consumption", id: "PECons", key: "PECons%d", years: years, mycolor: ['#deebf7','#9ecae1','#3182bd']},
           {name: "CO2 Emission", id: "Carbon", key: "Carbon%d", years: years, mycolor: ['#e5f5f9','#99d8c9','#2ca25f']},
           {name: "GDP PPP", id: "GDP", key: "GDP%d", years: years, mycolor: ['#fee6ce','#fdae6b','#e6550d']},
           {name: "Population", id: "Population", key: "Population%d", years: years, mycolor: ['#ffabab','#f86161','#9b0707']},
           {name: "Primary Energy Consumption Per Capita", id:"pepercapita", key: "pepercapita%d", years: years,mycolor: ['#deebf7','#9ecae1','#3182bd']},
           {name: "CO2 Emission Per Capita", id: "copercapita", key: "copercapita%d", years: years, mycolor: ['#e5f5f9','#99d8c9','#2ca25f']},
           {name: "GDP PPP Per Capita", id: "gdppercapita", key: "gdppercapita%d", years: years, mycolor: ['#fee6ce','#fdae6b','#e6550d']}
     ];
    //var mycolor = ['#deebf7','#9ecae1','#3182bd'];
    var field = fields[0];
    var year = years[0];
    var colors = mycolor_blue.map(function(rgb) { return d3.hsl(rgb); });

    var fieldsById = d3.nest().key(function(d) {return d.id;})
                              .rollup(function(d) {return d[0];})
                              .map(fields);

            var radio_button = ["value","per capita"],
            j = 0;

            var form = d3.select(".primary-button-container").append("form").attr("id","radio_button_container").attr("width","10%");
            var labelEnter = form.selectAll("span").data(radio_button).enter().append("span");
            labelEnter.append("input").attr({
                type: "radio",
                class: "data_type",
                name: "mode",
                value: function(d,i){return i;}
            }).attr("id","radio_button").property("checked",function(d,i){
                return (i==j);
            });
            labelEnter.append("label").text(function(d){ return d;});

            var radios0 = document.getElementsByName('mode')[0];
            var radios1 = document.getElementsByName('mode')[1];

            radios0.onclick = function(){
                if (field.id == "pepercapita" && radios0.checked){
                    field = fields[0];
                    location.hash = "#" + [field.id, year].join("/");
                    colors = mycolor_blue.map(function(rgb) { return d3.hsl(rgb); });
                    d3.select("#map-container > svg > text").remove();
                    d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: Primary Energy Consumption (Quadrillion BTU)");
                }else if (field.id == "copercapita" && radios0.checked){
                    field = fields[1];
                    location.hash = "#" + [field.id, year].join("/");
                    colors = mycolor_green.map(function(rgb) { return d3.hsl(rgb); });
                    d3.select("#map-container > svg > text").remove();
                    d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: CO2 Emission (Billion Metric Tonnes)");
                }else if (field.id == "gdppercapita" && radios0.checked){
                    field = fields[2];
                    location.hash = "#" + [field.id, year].join("/");
                    colors = mycolor_orange.map(function(rgb) { return d3.hsl(rgb); });
                    d3.select("#map-container > svg > text").remove();
                    d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: GDP PPP (Trillion 2005 US Dollar)");
            };
        };

            radios1.onclick = function(){
                if (field.id == "PECons" && radios1.checked){
                    field = fields[4];
                    location.hash = "#" + [field.id, year].join("/");
                    colors = mycolor_blue.map(function(rgb) { return d3.hsl(rgb); });
                    d3.select("#map-container > svg > text").remove();
                    d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: Primary Energy Consumption Per Capita (Million BTU)");
                }else if (field.id == "Carbon" && radios1.checked){
                    field = fields[5];
                    location.hash = "#" + [field.id, year].join("/");
                    colors = mycolor_green.map(function(rgb) { return d3.hsl(rgb); });
                    d3.select("#map-container > svg > text").remove();
                    d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: CO2 Emission Per Capita (Metric Tonnes)");
                }else if(field.id == "GDP" && radios1.checked){
                    field = fields[6];
                    location.hash = "#" + [field.id, year].join("/");
                    colors = mycolor_orange.map(function(rgb) { return d3.hsl(rgb); });
                    d3.select("#map-container > svg > text").remove();
                    d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: GDP PPP Per Capita (2005 US Dollar)");

                };
            };


    var energySelect = d3.select('.button.-blue').on("click",function(e){
               ///////////////////////////////////////////////////////////////////////////////////
        document.getElementById("radio_button_container").style.visibility="visible";
        if (radios0.checked){
            field = fields[0];
            location.hash = "#" + [field.id, year].join("/");
            colors = mycolor_blue.map(function(rgb) { return d3.hsl(rgb); });
            d3.select("#map-container > svg > text").remove();
            d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: Primary Energy Consumption (Quadrillion BTU)");      
            addColorBar();
        }else{
            field = fields[4];
            location.hash = "#" + [field.id, year].join("/");
            colors = mycolor_blue.map(function(rgb) { return d3.hsl(rgb); });
            d3.select("#map-container > svg > text").remove();
            d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: Primary Energy Consumption Per Capita (Million BTU)");
            addColorBar();
        };
    });
            

    var carbonSelect = d3.select('.button.-green').on("click",function(e){
        document.getElementById("radio_button_container").style.visibility="visible";
        if (radios0.checked){
            field = fields[1];
            location.hash = "#" + [field.id, year].join("/");
            colors = mycolor_green.map(function(rgb) { return d3.hsl(rgb); });
            d3.select("#map-container > svg > text").remove();
            d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: CO2 Emission (Billion Metric Tonnes)");
            addColorBar();
        }else{
            field = fields[5];
            location.hash = "#" + [field.id, year].join("/");
            colors = mycolor_green.map(function(rgb) { return d3.hsl(rgb); });
            d3.select("#map-container > svg > text").remove();
            d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: CO2 Emission Per Capita (Metric Tonnes)");
            addColorBar();
        };
    });

    var gdpSelect = d3.select('.button.-orange').on("click",function(e){
        document.getElementById("radio_button_container").style.visibility="visible";
        if (radios0.checked){
            field = fields[2];
            location.hash = "#" + [field.id, year].join("/");
            colors = mycolor_orange.map(function(rgb) { return d3.hsl(rgb); });
            d3.select("#map-container > svg > text").remove();
            d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: GDP PPP (Trillion 2005 US Dollar)");
            addColorBar();
        }else{
            field = fields[6];
            location.hash = "#" + [field.id, year].join("/");
            colors = mycolor_orange.map(function(rgb) { return d3.hsl(rgb); });
            d3.select("#map-container > svg > text").remove();
            d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: GDP PPP Per Capita (2005 US Dollar)");
            addColorBar();
        };
    });

    var populationSelect = d3.select('.button.-red').on("click",function(e){
        field = fields[3];
        location.hash = "#" + [field.id, year].join("/");
        colors = mycolor_red.map(function(rgb) { return d3.hsl(rgb); });
        d3.select("#map-container > svg > text").remove();
        d3.select("#map-container > svg").append("text").attr("x",0).attr("y","93.3%").attr("dy",".35em").text("Units: Population (Millions)");
        //d3.select("#radio_button_container").remove();
        document.getElementById("radio_button_container").style.visibility="hidden";
        addColorBar();
    });

    var yearSelect = d3.select("input[type=range]").on("change",function(){
        year = this.value;
        location.hash = "#" + [field.id, year].join("/");
        addColorBar();
    })

    d3.select("input[type=range]").on("change", function() { year = this.value; update(); });
    //d3.select("input[type=range]").on("click", function() { clearInterval(intervalId); });
    
  
    var startbutton = document.getElementById("button_start");
    startbutton.onclick = function(){

        year = 1971;

        d3.select("input[type=range]").on("change", function() { year = this.value; update(); });
        d3.select("input[type=range]").on("click", function() { clearInterval(intervalId); });
 
        var intervalId = setInterval(function(){

            if (year<1975){
                year += 4;
            }else if (year < 2040 && year>=1975){
                year = year + 5;
                update();
            }else{
                //setInterval(intervalId);
                clearInterval(intervalId);
            }
        },200);



        var stopbutton = document.getElementById("button_stop");
        stopbutton.onclick = function(){clearInterval(intervalId);};
        
        var resetbutton = document.getElementById("button_reset");
        resetbutton.onclick = function(){

            
            year=1971; 
            var features = carto.features(topology, geometries),
            path = d3.geo.path()
                .projection(proj);
            countries.data(features)
                .transition()
                .duration(750)
                .ease("linear")
                .attr("fill", "#fafafa")
                .attr("d", path);

            countries.select("title")
                .text(function(d) {
                return d.properties.country;
                });
            clearInterval(intervalId);
            d3.select("#theyear > span")[0][0].innerHTML=1971;
            d3.select("input[type=range]")[0][0].value=1971;

        };

    };
    
        var resetbutton = document.getElementById("button_reset");
        resetbutton.onclick = function(){
        
        var features = carto.features(topology, geometries),
            path = d3.geo.path()
              .projection(proj);
        countries.data(features)
          .transition()
            .duration(750)
            .ease("linear")
            .attr("fill", "#fafafa")
            .attr("d", path);

        countries.select("title")
          .text(function(d) {
            return d.properties.country;
          });

    };

    var canvas_width = -170/1200*map_containter_width;
    var canvas_height = -50/600*map_containter_height;


    var map = d3.select("#map"),
        zoom = d3.behavior.zoom()
                .translate([canvas_width, canvas_height])
                .scale(1.5/1200*map_containter_width)
                .scaleExtent([0.5, 10.0])
                .on("zoom", updateZoom),
        layer = map.append("g")
                .attr("id", "layer").attr("align-item","center"),
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

      window.onhashchange = function() {
        parseHash();
      };

      var segmentized = location.search === "?segmentized",
        url = ["data",
            segmentized ? "world-segmentized.topojson" : "world-110m_withoutAntarctica.json"
        ].join("/");
    d3.json(url, function(topo) {
        topology = topo;
        geometries = topology.objects.countries.geometries;
        d3.csv("data/All_final_standard.csv", function(data) {
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

        parseHash();
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
                    return [d.properties.country, fmt(value(d))==0 ? "NA" : fmt(value(d))].join(": ");
                });

         countries.transition()
                .duration(200)
                .ease("linear")
                .attr("fill", function(d) {
                    return color(value(d));
                })
                .attr("d", carto.path);


        d3.select("input[type=range]")[0][0].value=year;
        d3.select("#theyear > span")[0][0].innerHTML=year;


        //countries.data(features).exit().remove();  //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////
        addColorBar();
    };

    var deferredUpdate = (function() {
    var timeout;
        return function() {
          var args = arguments;
          clearTimeout(timeout);
          //stat.text("calculating...");
          return timeout = setTimeout(function() {
            update.apply(null, arguments);
          }, 10);
        };
      })();
     
 var hashish = d3.selectAll("a.hashish")
        .datum(function() {
          return this.href;
        });

function parseHash() {
        var parts = location.hash.substr(1).split("/"),
            desiredFieldId = parts[0],
            desiredYear = +parts[1];

        field = fieldsById[desiredFieldId] || fields[0];
        year = (years.indexOf(desiredYear) > -1) ? desiredYear : years[0];

       // fieldSelect.property("selectedIndex", fields.indexOf(field));

        if (field.id === "none") {

          yearSelect.attr("disabled", "disabled");
          reset();

        } else {

            if (field.years) {
                if (field.years.indexOf(year) === -1) {
                    year = field.years[0];
                }
                yearSelect.selectAll("option").attr("disabled", function(y) {
                    return (field.years.indexOf(y) === -1) ? "disabled" : null;
                });
            } else {
                yearSelect.selectAll("option")
              .attr("disabled", null);
            }

            yearSelect.property("selectedIndex", years.indexOf(year)).attr("disabled", null);

            deferredUpdate();
            location.replace("#" + [field.id, year].join("/"));

            hashish.attr("href", function(href) {
                return href + location.hash;
            });
        };

        // for color bar
        

     //   var countries.on("mouseover",function(d) {pointer.pointTo(d[whichValue])});

};

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByClassName('map-container');


function updateWindow(){
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

  d3.selectAll('#map-container').attr('width',x).attr('height',y);
}

window.onresize = updateWindow;

function addColorBar(){
    d3.selectAll("#colorbar").remove();
        var parts1 = location.hash.substr(1).split("/"),
            desiredFieldId1 = parts1[0],
            desiredYear1 = +parts1[1];

        field1 = fieldsById[desiredFieldId1] || fields[0];
        key1 = field1.key.replace("%d", year);
        fmt1 = (typeof field1.format === "function")
                    ? field1.format
                    : d3.format(field1.format || ","),
            value1 = function(d) {
                return +d.properties[key1];
            };
               
        var values1 = countries.data()
                    .map(value1)
                    .filter(function(n) {
                        return !isNaN(n);
                    })
                    .sort(d3.ascending),
            lo = values1[0],
            hi = values1[values1.length - 1];

        var range1 = values1;
        var fillings = d3.scale.linear().domain(d3.extent(range1)).range([colors[0],colors[2]]);
        var whichValue = "value";
        var orientation = "horizontal";
        var colorbar = Colorbar()
                    .origin([900,20])
                    .thickness(100)
                    .scale(fillings).barlength(300).thickness(10)
                    .orient(orientation);

        var bar =  d3.selectAll("#map-container > svg").append("g").attr("id","colorbar");

        var pointer = d3.selectAll("#colorbar").transition().duration(200).call(colorbar);

     //   var window_key = window[key1];

        //countries.on("mouseover",function() {pointer.pointTo(dataById[function(d){return d.id;}].window_key)});
 //       var features = carto(topology, geometries).features;

 //       countries.data(features).on("mouseover",function() {pointer.pointTo(dataById[function(d){return d.id;}].window_key)});
}


        ////////////////////////////////////////////////////////////////////////////////////////
        //var parts1 = location.hash.substr(1).split("/"),
        //    desiredFieldId1 = parts1[0],
        //    desiredYear1 = +parts1[1];

        // field = fieldsById[desiredFieldId1] || fields[0];
        // key = field.key.replace("%d", year);
        //fmt = (typeof field.format === "function")
        //            ? field.format
        //            : d3.format(field.format || ","),
        //    value = function(d) {
        //        return +d.properties[key];
        //    };
        //var values1 = countries.data()
        //            .map(value)
        //            .filter(function(n) {
        //                return !isNaN(n);
        //            })
        //            .sort(d3.ascending),
        //    lo = values1[0],
        //    hi = values1[values1.length - 1];

        //var range1 = values1;

        //values = countries.data().map(value);

        //var range1 = values.map();

        //var fillings = d3.scale.linear().domain(d3.extent(range1)).range([colors[0],colors[2]]);

        //var whichValue = "value";

        //var orientation = "vertical";
        //var colorbar = Colorbar()
        //            .origin([50,20])
        //            .thickness(100)
        //            .scale(fillings).barlength(300).thickness(20)
        //            .orient(orientation)
        //            .title("Hover to update the pointer");

        //bar =  d3.selectAll("#map-container > svg").append("g").attr("id","colorbar");

        //pointer = d3.selectAll("#colorbar").call(colorbar);

        //countries.on("mouseover",function(d) {pointer.pointTo(d[whichValue])});



 
//FINAL PROJEC

var margin = {t:50,r:50,b:50,l:50};
var width = document.getElementById('plot').clientWidth-margin.l-margin.r,
	height = document.getElementById('plot').clientHeight-margin.t-margin.b;


var plot = d3.select('.canvas')
	.append('svg')
	.attr('width',width+margin.l+margin.r)
	.attr('height',height+margin.t+margin.b)
	.append('g')
	.attr('class','plot')
	.attr('transform', 'translate (20,'+margin.r+')');

//creating force variable and formatting currency

var formatCurrency = d3.format("$,.0f");

var force = d3.layout.force()
    .size([width,height])
    .charge(0)
    .gravity(0);



//scales and axis

var scaleColor = d3.scale.ordinal().domain([1,2,3]).range(['rgb(230,126,31)','rgb(0,126,146)', 'black']);
var scaleColorAlt = d3.scale.ordinal().domain([1,2,3]).range(['rgb(55,123,127)','rgb(241,129,49)', 'black']);
var scaleColor2 = d3.scale.linear().domain([3,5]).range(['red','white']);
var scaleX = d3.scale.linear().domain([17,700]).range([100,width]);

var axisX = d3.svg.axis()
    .scale(scaleX)
    .tickFormat(formatCurrency);

var axis = plot.append('g').attr('class','axis axis-x')
    .call(axisX)
    .style('opacity','0');

//------------manually appending legend -------------------------------------------------


legend
var legend = d3.select('.legend')
    .append('svg')
    .attr('width',350)
    .attr('height',33)
    .append('g')
    .attr('transform', 'translate (10,16)');

//Private room

legend.append('circle')
    .attr('r',5)
    .attr('fill','rgb(241,129,49)')

legend.append('text')
    .text('private room')
    .attr('fill','black')
    .attr('transform', 'translate (12,4)');

//Entire home/apt    

legend.append('circle')
    .attr('r',5)
    .attr('fill','rgb(55,123,127)')
    .attr('transform', 'translate (112,0)');

legend.append('text')
    .text('entire home/apt')
    .attr('fill','black')
    .attr('transform', 'translate (124,4)');

//Shared room  

legend.append('circle')
    .attr('r',5)
    .attr('fill','rgb(50,50,50)')
    .attr('transform', 'translate (244,0)');

legend.append('text')
    .text('shared room')
    .attr('fill','black')
    .attr('transform', 'translate (256,4)');

//MAP PROJECTION AND GENERATOR  -------------------------------
	
	//Projection

var albersProjection = d3.geo.albers()
	.scale(240000)
	.rotate( [71.068,0] )
	.center( [0, 42.355] )
	.translate( [width/2,height/8] );
 
	//Path generator

var geoPath = d3.geo.path()
	.projection (albersProjection);




//----------- DATA LOAD AND MAIN FUNCTION --------------------------------------------------------------


queue()
    .defer(d3.csv,'data/airbnb.csv',parse)
    .defer(d3.csv,'data/labels.csv',parseLabels)
    .await(dataLoaded);


//MAIN FUNCTION

function dataLoaded(err,data,labels){

//appending labels for neighborhood view

var group = plot.selectAll('label')
    .data(labels)
    .enter()
    .append('g')
    .attr('transform', function(d){
            return 'translate (0,' + d.loc +')'
        })
    .attr('class','label')
    .style('opacity',0)
    group.append('text')
    .text(function(d){return d.text})
    group.append('line')
    .attr('x1',function(d){return scaleX(d.price)})
    .attr('x2',function(d){return scaleX(d.price)})
    .attr('y1',-30)
    .attr('y2',30)
    .style('stroke','black')
    group.append('text')
    .text(function(d){return '$' + d.price})
    .attr('x',function(d){return scaleX(d.price)+5})
    .attr('y',-25)


//"average" label

plot.append('g')
    .attr('transform','translate(0,100)')
    .attr('class','label')
    .style('opacity',0)
    .append('text')
    .text('average')
    .attr('x',scaleX(283))
    .attr('y',-25);



//ALL THE FORCE FUNCTION STUFF------------------------------------

            
function onForceTick(e){
    var q = d3.geom.quadtree(data),
        i = 0,
        n = data.length;

    while( ++i<n ){
        q.visit(collide(data[i]));
    }

    nodes
        .each(gravity(e.alpha*.12))
        .attr('cx',function(d){return scaleX(d.x)})
        .attr('cy',function(d){return d.y})

    function gravity(k){
        return function(d){
            d.y += (height/8 - d.y)*k;
            d.x += (d.x0 - d.x)*k;
        }
    }

}//END onForceTick Function

function placeNodes(){
    nodes
        .transition()
        .attr('cx',function(d){return scaleX(d.x)})
        .attr('cy',function(d){return d.y})
}
function onMultiFociTick(e){
    var q = d3.geom.quadtree(data),
        i = 0,
        n = data.length;

    while( ++i<n ){
        q.visit(collide(data[i]));
    }

    nodes
        .each(function(d){

        var focus = {};

           if (d.hood=="Back Bay"){focus.y = 100}
                else if(d.hood=="Charlestown"){focus.y = 200}
                else if(d.hood=="Fenway/Kenmore"){focus.y = 300}
                else if(d.hood=="South Boston"){focus.y = 400}
                else if(d.hood=="South End"){focus.y = 500}
                else if(d.hood=="North End"){focus.y = 600}
                else if(d.hood=="Beacon Hill"){focus.y = 700}
                else if(d.hood=="Harvard Square"){focus.y = 800}
                else if(d.hood=="Cambridge"){focus.y = 900}
                else if(d.hood=="Jamaica Plain"){focus.y = 1000}
                else if(d.hood=="Brookline"){focus.y = 1100}
                else if(d.hood=="Newton"){focus.y = 1200}
                else if(d.hood=="Roxbury"){focus.y = 1300}
                else if(d.hood=="Mission Hill"){focus.y = 1400}
                else if(d.hood=="Coolidge Corner"){focus.y = 1500}
                else if(d.hood=="Somerville"){focus.y = 1600}
                else if(d.hood=="Watertown"){focus.y = 1700}
                else if(d.hood=="Allston-Brighton"){focus.y = 1800}
                else if(d.hood=="East Boston"){focus.y = 1900}
                else if(d.hood=="Dorchester"){focus.y = 2000}
                else if(d.hood=="Revere"){focus.y = 2100}
                else if(d.hood=="Medford"){focus.y = 2200}
                else{focus.y = 2700}//NEED TO FIGURE OUT HOW TO GET RID OF THESE EXTRA ONES

           focus.x = d.x0;

            d.x += (focus.x-d.x)*(e.alpha*.9);
            d.y += (focus.y-d.y)*(e.alpha*.9);
        })
        .attr('cx',function(d){return scaleX(d.x)})
        .attr('cy',function(d){return d.y})

}//END onMultiFociTick Function

//END FORCE FUNCTIONS ----------------------------------------------------------


//-----------------------------DRAWING MAP AND CIRCLES-----------------------------------

		var map = plot.selectAll('path')
		.data(neighborhoods_json.features);

		map.enter()
		.append('path')
		.style('fill','rgb(234,234,229)')
		.style('stroke', 'rgb(180,180,180)')
		.style('fill-opacity','1')
		.style('stroke-opacity', '1')
		.attr('d',geoPath);


		map.exit()
			.remove()

        var nodes = plot.selectAll('.room')
            .data(data, function(d){return d.key})
        nodes
            .enter()
            .append('circle')
            //.filter(function(d){return d.price <=125})
            .attr('class','room')
            .attr('r', 3)
            .style('fill',function(d){return scaleColorAlt(d.type)})
            .attr('cx',function(d){ return albersProjection([d.lon, d.lat])[0];})
            .attr('cy',function(d){ return albersProjection([d.lon, d.lat])[1];})
            .style('opacity','.15')
            .call(tooltip);

        nodes.exit()
            .remove()



//-----------------------------CONDITIONAL STUFF BASED ON BUTTON CLICKS-----------------------------

    d3.selectAll('.btn').on('click',function(){
        var selection = d3.select(this).attr('id');

if(selection == 'map'){
            map.transition().duration(1000)
            .style('fill-opacity','1')
            .style('stroke-opacity', '1')
            axis.transition().duration(1000).style('opacity','0')
            //d3.select('.price-breakout').style('opacity',0);
            $('.price-breakout').css('display','none')
            $('.slider').css('display','block')
            $('.x').css('display','block');
        }else if (selection =='graph'){
            map.transition().duration(1000)
            .style('fill-opacity','0')
            .style('stroke-opacity', '0')
            axis.transition().duration(1000).style('opacity','1')
            //d3.select('.price-breakout').style('opacity',1);
            $('.slider').css('display','none')
            $('.x').css('display','none')
            $('.price-breakout').css('display','block');

        }

		//draw map dots
		if(selection == 'map'){
			nodes
			.transition().duration(1000)
			.attr('cx',function(d){ return albersProjection([d.lon, d.lat])[0];})
			.attr('cy',function(d){ return albersProjection([d.lon, d.lat])[1];})
			.style('opacity',.15)
			.attr('r',3)
			force.stop()
            d3.selectAll('.label').style('opacity',0);

		//draw graph
		}else if(selection =='graph'){
			nodes
			.transition().duration(1000)
			.attr('cx', function(d){return scaleX(d.x)})
			.attr('cy', function(d){return d.y})			
			.attr('r',function(d){return d.r})
            .style('fill',function(d){return scaleColorAlt(d.type)})
            .style('opacity','.65')
            d3.selectAll('.label').style('opacity',0)
            d3.selectAll('.room').classed('remove', false);//removing scale filter when graph is selected


            force.nodes(data)
                .on('tick',onForceTick)
                .start();

                d3.select('#all').on('click',function(){
                force.stop()
                    .on('tick',onForceTick)
                    .start()
                    d3.selectAll('.label').style('opacity',0);

                });
                d3.select('#breakout').on('click',function(){

                    force.stop()
                        .on('tick',onMultiFociTick)
                        .start()
                     d3.selectAll('.label').style('opacity',1);
                });

        }//end 'GRAPH' 'if select' statement

})//END CONDITIONAL BUTTON SELECTION----------------------------------------------------------


//--------------------------------------------experimenting with slider-----------------------------------------------------------------------------------------------------------


        var x = d3.scale.linear()//brush scale
        .domain([0,700])
        .range([0,170])
        .clamp(true);

        var startingValue = 700;

        var brush = d3.svg.brush()
            .x(x)
            .extent([startingValue,startingValue])
            .on('brush',brushed);

        plot.append("g")
            .attr('class','x axis')
            .attr('transfrom','translate(0,0)')
            .call(d3.svg.axis()
                .scale(x)
                .tickFormat(d3.format("$,.0f"))
                .orient('top')
                .tickSize(0)
                .tickPadding(12)
                .tickValues([0,700])
                )
            .select(".domain")
              .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "halo")
                .attr('transform','translate(0,5)');
                var slider = plot.append("g")
                    .attr("class", "slider")
                    .call(brush);

                var handle = slider.append("g")
                    .attr("class", "handle")

                handle.append('rect')//This will act as background color over the actual black slider
                    .attr('x','0')
                    .attr('y',2)
                    .attr('height',6)
                    .attr('width',172)
                    .style('fill','rgb(234,234,229)')

                handle.append("circle")
                    .attr("transform", "translate(0,5)")
                    //.attr("d", "M 0 -20 V 10")
                    .attr('r',6)

                handle.append('text')
                  .text("$"+ startingValue)
                  .attr('class','labelPoint')
                  .attr("transform", "translate(-15,30)");

                slider
                    .call(brush.extent([0, 0]))
                    .call(brush.event)
                    .transition() 
                    .delay(900)
                    .duration(2000)
                    .call(brush.extent([700, 700]))
                    .call(brush.event);

                function brushed() {
                  var value = brush.extent()[0];
                  if (d3.event.sourceEvent) { 
                    handle.select('text');
                    value = x.invert(d3.mouse(this)[0]);
                    brush.extent([value, value]);

                    //console.log(value);
                  }

                  handle.attr("transform", "translate(" + x(value) + ",0)");
                  handle.select('text').text('$' + Math.floor(value))
                  handle.select('rect').attr('width',172-x(value))
                    d3.selectAll('.room').classed('remove', function(d){if (d.price>value){return true}
                        else if(d.price<=value){return false}
                    })
                }
 

                


//-------------------------------------------------------------------------------------------------------------------------------------------------------






}//END DATALOADED FUNCTION






//PARSE DATA

function parse(d){
    //var pop = table.set(d.Key,
	return{
		key: d.Key,
		lon: +d.X,
		lat: +d.Y,
		x: +d.price,
        x0: +d.price,
		y: +d.yaxis,
		r: +d.radius,
        type: +d.type_num,
        review: +d.overall_sa,
        price:+d.price,
        hood:d.neighborhood

	}
}

function parseLabels(d){
    return{
        text: d.text,
        price: +d.averagePrice,
        loc: +d.location,
    }
}

function tooltip(tip){
    tip.on('mouseenter',function(d){

    var tooltip = d3.select('.custom-tooltip');

        tooltip.transition()
               .style('opacity',1);

        tooltip.select('#price').html(d.price);
        tooltip.select('#town').html(d.hood);
    d3.select(this).classed('hover', true)
    //.attr('r','10')
    //.style('opacity',1)

        

    })
    .on('mouseleave', function(d){
            d3.select('.custom-tooltip')
                .style('opacity',0);
    d3.select(this).classed('hover', false)
   //.attr('r','3')


        })
    .on('mousemove', function(d){
            var xy = d3.mouse(document.getElementById('plot'));
            //this finds the xy of the mouse in relation to this element
            //console.log(xy);
            d3.select('.custom-tooltip').style('opacity',1);

            var left = xy[0], top = xy[1];

            d3.select('.custom-tooltip')
                .style('left', left + -0 + 'px')
                .style('top', top + 30 + 'px');

         })
}


//Colision detection

function collide(dataPoint){
    var nr = dataPoint.r + 0,
        nx1 = dataPoint.x - nr,
        ny1 = dataPoint.y - nr,
        nx2 = dataPoint.x + nr,
        ny2 = dataPoint.y + nr;

    return function(quadPoint,x1,y1,x2,y2){
        if(quadPoint.point && (quadPoint.point !== dataPoint)){
            var x = dataPoint.x - quadPoint.point.x,
                y = dataPoint.y - quadPoint.point.y,
                l = Math.sqrt(x*x+y*y),
                r = nr + quadPoint.point.r;
            if(l<r){
                l = (l-r)/l*.5;
                dataPoint.x -= x*= (l*.05);
                dataPoint.y -= y*= l;
                quadPoint.point.x += (x*.05);
                quadPoint.point.y += y;
            }
        }
        return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
    }
}
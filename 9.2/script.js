console.log('9.2');

var m = {t:50,r:50,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b)
    .append('g').attr('class','plot')
    .attr('transform','translate('+ m.l+','+ m.t+')');

var scaleColor = d3.scaleOrdinal().range(d3.schemeCategory20);

d3.csv('../data/co2 emission-2.csv',parse,dataloaded);

function dataloaded(err, countries){

    //Create d3.arc() generator
    var arc = d3.arc()
        .startAngle(function(d){return d.startAngle})
        .endAngle(function(d){return d.endAngle})
        .innerRadius(20)
        .outerRadius(200);

    //Data transformation

    //Create a d3.pie() layout function to transform the data
    var pie = d3.pie();

    //Draw ENTER set
    var slices;

    //Tooltip
    /*slices.on('mouseenter',function(d){
        var tooltip = d3.select('.custom-tooltip');

        tooltip.select('.title').html(d.data.key);
        tooltip.select('.value').html(d.data.value);

        tooltip
            .style('visibility','visible')
            .transition()
            .style('opacity',1);

            d3.select(this).transition().style('opacity',1);
        }).on('mousemove',function(d){
            var xy = d3.mouse(d3.select('.container').node());

            var tooltip = d3.select('.custom-tooltip')
                .style('left',xy[0]+20+'px')
                .style('top',xy[1]+20+'px');

        }).on('mouseleave',function(d){
            var tooltip = d3.select('.custom-tooltip');

            tooltip
                .style('visibility','hidden')
                .style('opacity',0);

            d3.select(this).transition().style('opacity',.7);
        });*/
}

function parse(d){
    return {
        country:d['Country Name'],
        code:d['Country Code'],
        emission2011:d['2011 [YR2011]']=='..'?undefined:+d['2011 [YR2011]'],
        incomeGroup:d['Income Group'],
        region:d['Region']
    }
}
console.log('10.1');

var m = {t:50,r:50,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b)
    .append('g').attr('class','plot')
    .attr('transform','translate('+ m.l+','+ m.t+')');

//Mapping specific functions
//Projection

//Geopath

d3.json('../data/gz_2010_us_040_00_5m.json',dataloaded);

function dataloaded(err, data){

    //See what the data looks like first
    console.log(data);

    //Update projection to fit all the data within the drawing extent


    //Represent a feature collection of polygons


    //Represent a collection of points
    var points = [
        {city:'Boston',location:[-71.0589,42.3601]},
        {city:'San Francisco',location:[-122.4194,37.7749]}
    ];


    //Represent a line
    var lineData = {
        type:"Feature",
        geometry:{
            type:'LineString',
            coordinates:[[-71.0589,42.3601],[-122.4194,37.7749]]
        },
        properties:{}
    };
}
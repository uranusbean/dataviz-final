console.log('9.1');

var m = {t:50,r:50,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b)
    .append('g').attr('class','plot')
    .attr('transform','translate('+ m.l+','+ m.t+')');

//var scaleColor = d3.scaleOrdinal().range(d3.schemeCategory20);

d3.csv('../data/co2 emission.csv',parse,dataloaded);

function dataloaded(err, countries){

}

function parse(d){
    return {
        country:d['Country Name'],
        code:d['Country Code'],
        emission2011:d['2011 [YR2011]']=='..'?undefined:+d['2011 [YR2011]']
    }
}
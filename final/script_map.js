console.log('map of boston');

var m = {t:50,r:50,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b)
    .append('g').attr('class','plot')
    .attr('transform','translate('+ m.l+','+ m.t+')');

// var g = plot.append('g');
//Color scale
// var scaleColor = d3.scaleLinear().domain([0,.15]).range(['white','red']);

//Mapping - define projection, define path 
var projection = d3.geoAlbers()
    .scale(190000)
    .rotate([71.068,0])
    .center([0,42.355])
    .translate([w/2,h/2])
    
var path = d3.geoPath().projection(projection);
d3.queue()
    .defer(d3.tsv, '../data/aribnb.csv', parse)
    .await(function(err, geo, data){
        var map = plot.selectAll('path')
        .data(neighborhoods_json.features);
    
        map.enter()
            .append('path')
            .attr('fill','#ddd')
            .attr('d',path);

        map.exit()
            .remove();
    
    });

function parse(d){
    var entry = {
        id:d.id,
        hostId: +d.host_id,
        hostName: d.host_name,
        neighbourhood: d.neighbourhood,
        lat: +d.latitude,
        lon: +d.longtitude,
        roomType: d.room_type,
        accommodates: d.accommodates,
        bathrooms: +d.bathrooms,
        bedrooms: +d.bedrooms,
        price: +d.price,
        secDeposit: +d.security_deposit,
        cleaningFee:  d.cleaning_fee == ''? 0 : (+d.cleaning_fee),
        minNights: d.minimum_nights == ''? 0 : (+d.minimum_nights),
        numReviews:  d.number_of_reviews == ''? 0 :(+d.number_of_reviews),
        lastReview: new Date(d.last_review),
        reviewsPerMonth:  d.reviews_per_month == ''? 0 : (+d.reviews_per_month),
        calculatedHostListing: d.calculated_host_listings_count== ''? 0 : (+d.calculated_host_listings_count),
        availability: +d.availability_365,
        responseTime: d.host_response_time,
        acceptRate: d.host_acceptance_rate,
        cancelPolicy: d.cancellation_policy,
        // amenities: d.amenities,
        monthlyIncome: Math.round(d.price * d.reviews_per_month *d.minimum_nights)
    };
    
    if(d.amenities.includes('TV')) {
        if (d.amenities.includes('Wireless')){
            entry.amenities = 'TV + Wifi';
        } else {
            entry.amenities = 'TV';
        }
    } else {
        if (d.amenities.includes('Wireless')){
            entry.amenities = ' Wifi';
        } else {
            entry.amenities = 'No TV No Wifi';
        } 
    } 
    
    if(d.amenities.includes('Family/Kid Friendly')) {
        if (d.amenities.includes('Pets Allowed')){
            entry.familyPets = 'Family/Kid Friendly + Pets Allowed';
        } else {
            entry.familyPets = 'Family/Kid Friendly';
        }
    } else {
        if (d.amenities.includes('Pets Allowed')){
            entry.familyPets = 'Pets Allowed';
        } else {
            entry.familyPets = 'None';
        } 
    } 
    
    if(!filterStatus.amenitiesTypes.btns.has(entry.amenities) ){
        filterStatus.amenitiesTypes.btns.add(entry.amenities);
    } 
    if(!filterStatus.familyPets.btns.has(entry.familyPets) ){
        filterStatus.familyPets.btns.add(entry.familyPets);
    } 
    
    return entry;
}

    
//d3.map for data 
// var rate = d3.map();

// d3.queue()
//     .defer(d3.json, '../data/gz_2010_us_050_00_5m.json') // json files don't need to be parsed
//     .defer(d3.tsv, '../data/unemployment.tsv', parseData)
//     .await(function(err, geo, data){ //geo - json file; data-unemployment 
//         // console.log(geo);
//         // console.log(data);
//         projection.fitExtent([[0,0],[w,h]],geo);
        
//         var counties = plot.selectAll('.county')
//             .data(geo.features)
//             .enter()
//             .append('path').attr('class','county')
//             .attr('d',path)
//             .style('fill', function(d){
//                 var id = +(d.properties.STATE)+d.properties.COUNTY;
//                 //get unemployment id to set color
//                 var r = rate.get(id); //match id - look for the id in tsv file
//                 if (!r) {
//                     // console.log(id);
//                     // return missginColor(r);
//                 }
//                 //return the color
//                 return scaleColor(r);
//             });
//         counties.on('mouseenter',function(d){
//             var tooltip = d3.select('.custom-tooltip')
//                 .style('visibility','visible')
//                 .transition()
//                 .style('opacity',1);
//             console.log(d.properties.NAME);
//             // console.log(d.properties);
//             // console.log(d.properties.STATE+d.properties.COUNTY);
//         })
//             .on('mousemove',function(d){
//                 var xy = d3.mouse(d3.select('.container').node());
//                 var tooltip = d3.select('.custom-tooltip')
//                     .style('left',xy[0]+10+'px')
//                     .style('top',xy[1]+10+'px');
    
//                 tooltip.select('.region').html(d.properties.NAME);

//         })
//             .on('mouseleave',function(){
//             var tooltip = d3.select('.custom-tooltip')
//                 .style('visibility','hidden');
//         });
//     });


// function parseData(d){
//     rate.set(d.id, +d.rate);
//     return {
//         id: d.id,
//         rate: +d.rate
//     };
// }

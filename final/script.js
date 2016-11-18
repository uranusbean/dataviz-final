console.log('final project');
var m = {t:50,r:50,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b)
    .append('g')
    .attr('transform','translate('+ m.l+','+ m.t+')');

var dataSet;

// var filterStatus = {

//     roomTypes: {
//         btns: d3.set()
//     },
//     neighbourLocations: {
//         btns: d3.set()
//     },
//     cancelTypes: {
//         btns: d3.set()
//     },
//     amenitiesTypes: {
//         btns: d3.set()
//     },
//     familyPets: {
//         btns: d3.set()
//     }
// }

var roomTypes = d3.set(),
    neighbourLocations = d3.set(),
    cancelTypes = d3.set(),
    amenitiesTypes = d3.set();

var scaleX = d3.scaleLinear()
    // .exponent(.2)   
    .domain([0, 30])
    .range([0,w]);
var scaleColor = d3.scaleOrdinal()
    .range(['#fd6b5a','#03afeb','orange']);        
var scaleY = d3.scaleLinear()
    .domain([0,300])
    .range([h,0]);

var axisX = d3.axisBottom()  
    .scale(scaleX)
    .tickSize(-h);
var axisY = d3.axisLeft()
    .scale(scaleY)
    .tickSize(-w);
 
d3.queue()
    .defer(d3.csv,'../data/airbnb.csv',parse)
    .await(dataloaded);

function dataloaded(err, data){
    //Draw axis
    plot.append('g').attr('class','axis axis-x')
        .attr('transform','translate(0,'+h+')')
        .call(axisX);
    plot.append('g').attr('class','axis axis-y')
        .call(axisY);
    dataSet = data;
    addButtonGroups();
    draw(data);
} 

function addButtonGroups(){
    addButtonGroup('.btn-group-roomType', roomTypes, roomTypeBtnClickHandler);
    addButtonGroup('.btn-group-neighbourhood', neighbourLocations, neighbourhoodBtnClickHandler);
    addButtonGroup('.btn-group-cancelPolicy', cancelTypes, cancelPolicyBtnClickHandler);
    // addButtonGroup('.btn-group-roomType', roomTypes, cancelPolicyBtnClickHandler);
}

function addButtonGroup(btnGroupContainer,btnNameSet,onclick) {
    d3.select(btnGroupContainer)
        .selectAll('.btn')
        .data(btnNameSet.values())
        .enter()
        .append('a')
        .html(function(d){return d})
        .attr('href','#')
        .attr('class','btn btn-default btn-primary')
        .style('color','white')
        // .style('background',function(d){return scaleColor(d)})
        .style('border-color','white')
        .on('click',onclick);
}

function roomTypeBtnClickHandler(roomType){
    var filteredRoomType = dataSet.filter(function(entry) {
        return(entry.roomType == roomType);
    });
    draw(filteredRoomType);      
        
    // d3.select(this).style('background','#8c8c8c');
}

function neighbourhoodBtnClickHandler(neighbourhood){
    var filteredNeighbour = dataSet.filter(function(entry) {
        return(entry.neighbourhood == neighbourhood);
    });
    draw(filteredNeighbour);      
}

function cancelPolicyBtnClickHandler(cancelPolicy){
    var filteredcCncelType = dataSet.filter(function(entry) {
        return(entry.cancelPolicy == cancelPolicy);
    });
    draw(filteredcCncelType);      
}

function draw(rows){
    var minX = d3.min(rows, function(d){return d.monthlyIncome;}),
        maxX = d3.max(rows, function(d){return d.monthlyIncome;}); 
    var scaleIncome = d3.scaleLinear()
        .domain([minX, maxX])
        .range([1,20]);
        
    var node = plot.selectAll('.node')
        .data(rows,function(d){return d.id});
    //ENTER
    var nodeEnter = node.enter()
        .append('circle')
        .filter(function(d){
            if(d.numReviews < 2) return false;
            if(d.minNights == 0 || d.minNights >31) return false;
            if(d.calculatedHostListing == 0) return false;
            if (d.minNights * d.reviewsPerMonth > 30) return false;
            return true;
        })
        .attr('class','node')
        .attr('r', function(d){
            return scaleIncome(d.monthlyIncome);
        })
        .on('click',function(d,i){
            // console.log(d);
            // console.log(i);
            // console.log(this);
            // console.log(d); 
        })
        .on('mouseenter',function(d){
                
            var tooltip = d3.select('.custom-tooltip');
            tooltip.selectAll('.title')
                .html('Host:'+ d.id);
            tooltip.select('.value1')
                .html(d.reviewsPerMonth +' reviews/ month');
            tooltip.select('.value2')
                .html('$'+ d.price + '/ night');
            tooltip.select('.value3')
                .html('Cancel Policy:'+d.cancelPolicy);
            tooltip.select('.value4')
                .html('Minimum Nights: '+d.minNights);
            tooltip.select('.value5')
                .html('Monthly Income: '+d.monthlyIncome);
            tooltip.transition()
                .style('opacity',1)
                .style('visibility','visible');
            d3.select(this).style('stroke-width','3px');
        })
        .on('mousemove',function(d){
             var tooltip = d3.select('.custom-tooltip');
             var xy = d3.mouse(d3.select('.container').node());
             tooltip
                .style('left',xy[0]+10+'px')
                .style('top',xy[1]+10+'px');
        })
        .on('mouseleave',function(d){
             var tooltip = d3.select('.custom-tooltip');
             tooltip.transition().style('opacity',0);
             d3.select(this).style('stroke-width','0px');
        })
    //UPDATE+ ENTER
    nodeEnter
        .merge(node)
        .attr('cx',function(d){
            return scaleX(d.minNights);
        })
        .attr('cy',function(d){
            return scaleY(d.cleaningFee);
        })
        // .attr('r',3)
        .attr('r', function(d){
            return scaleIncome(d.monthlyIncome);
        })
        .style ('fill', 'black')
        // .style('fill',function(d){
        //     return scaleColor(d.roomType);
        // })
        .style('opacity',1);

    //EXIT
    node.exit().remove();
} 

function parse(d){
    if( !roomTypes.has(d.room_type) ){
        roomTypes.add(d.room_type);
    } 
    if( !neighbourLocations.has(d.neighbourhood) ){
        neighbourLocations.add(d.neighbourhood);
    } 
    if( !cancelTypes.has(d.cancellation_policy) ){
        cancelTypes.add(d.cancellation_policy);
    } 
    if( !amenitiesTypes.has(d.amenities) ){
        amenitiesTypes.add(d.amenities);
    } 
    //  if( !filterStatus.roomTypes.btns.has(d.room_type) ){
    //     filterStatus.roomTypes.btns.add(d.room_type);
    // } 
    // if( !filterStatus.neighbourLocations.btns.has(d.neighbourhood) ){
    //     filterStatus.neighbourLocations.btns.add(d.neighbourhood);
    // } 
    // if( !filterStatus.cancelTypes.btns.has(d.cancellation_policy) ){
    //     filterStatus.cancelTypes.btns.add(d.cancellation_policy);
    // } 
    // if( !filterStatus.amenitiesTypes.btns.has(d.amenities) ){
    //     filterStatus.amenitiesTypes.btns.add(d.amenities);
    // } 
    // if( !filterStatus.amenitiesTypes.btns.has(d.amenities) ){
    //     filterStatus.amenitiesTypes.btns.add(d.amenities);
    // } 
    
    return {
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
        amenities: d.amenities,
        monthlyIncome: Math.round(d.price * d.reviews_per_month *d.minimum_nights)
    }
}

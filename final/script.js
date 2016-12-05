console.log('final project');
var m = {t:50,r:50,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t -m.b,
    hLable = h+100,
    wLable = w-70;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b +100)
    .append('g')
    .attr('transform','translate('+ m.l+','+ m.t+')');
 
var axisLayer = plot.append('g');
var mapLayer = plot.append('g');
var dataLayer = plot.append('g');

var dataSet;

var filterStatus = {
    roomTypes: {
        btns: d3.set(),
        selected: d3.set()
    },
    neighbourLocations: {
        btns: d3.set(),
        selected: d3.set()
    },
    cancelTypes: {
        btns: d3.set(),
        selected: d3.set()
    },
    amenitiesTypes: {
        btns: d3.set(),
        selected: d3.set()
    },
    familyPets: {
        btns: d3.set(),
        selected: d3.set()
    }
}

var scaleColorRoom = d3.scaleOrdinal()
    .range(['#fd6b5a','#06ce98','#2175bc']),
    scaleColorPolicy = d3.scaleOrdinal()
    .range(['#03afeb','orange','#06ce98','#fd6b5a']);
// var scaleX = d3.scaleLinear()
//     .domain([0, 20])
//     .range([0,w]);   
// var scaleY = d3.scaleLinear()
//     .domain([0,300])
//     .range([h,0]);
var scaleXminNights = d3.scaleLinear()
    .domain([0, 30])
    .range([0,w]);  
var scaleYminNights = d3.scaleLinear()
    .domain([0, 30])
    .range([h,0]);  

var scaleXcleaningFee = d3.scaleLinear()
    .domain([0,300])
    .range([0,w]);    
var scaleYcleaningFee = d3.scaleLinear()
    .domain([0,300])
    .range([h,0]);
    
var scaleXreviewsPerMonth = d3.scaleLinear()
    .domain([0, 20])
    .range([0,w]);
var scaleYreviewsPerMonth = d3.scaleLinear()
    .domain([0, 20])
    .range([h,0]);
    
var scaleXprice = d3.scaleLinear()
    .domain([0, 850])
    .range([0,w]);    
var scaleYprice = d3.scaleLinear()
    .domain([0,850])
    .range([h,0]);
    
var scaleXcalculatedHostListing = d3.scaleLinear()
    .domain([0, 62])
    .range([0,w]);   
var scaleYcalculatedHostListing = d3.scaleLinear()
    .domain([0, 62])
    .range([h,0]);

// var axisX = d3.axisBottom()  
//     .scale(scaleX)
//     .tickSize(-h);
// var axisY = d3.axisLeft()
//     .scale(scaleY)
//     .tickSize(-w);
var axisXscaleXminNights = d3.axisBottom()  
    .scale(scaleXminNights)
    .tickSize(-h);
var axisYscaleYminNights = d3.axisLeft()
    .scale(scaleYminNights)
    .tickSize(-w);
    
var axisXscaleXcleaningFee = d3.axisBottom()  
    .scale(scaleXcleaningFee)
    .tickSize(-h);
var axisYscaleYcleaningFee = d3.axisLeft()
    .scale(scaleYcleaningFee)
    .tickSize(-w);

var axisXscaleXreviewsPerMonth = d3.axisBottom()  
    .scale(scaleXreviewsPerMonth)
    .tickSize(-h);
var axisYscaleYreviewsPerMonth = d3.axisLeft()
    .scale(scaleYreviewsPerMonth)
    .tickSize(-w);

var axisXscaleXprice = d3.axisBottom()  
    .scale(scaleXprice)
    .tickSize(-h);
var axisYscaleYprice = d3.axisLeft()
    .scale(scaleYprice)
    .tickSize(-w);

var axisXscaleXcalculatedHostListing = d3.axisBottom()  
    .scale(scaleXcalculatedHostListing)
    .tickSize(-h);
var axisYscaleYcalculatedHostListing = d3.axisLeft()
    .scale(scaleYcalculatedHostListing)
    .tickSize(-w);
 
//Mapping - define projection, define path 
var projection = d3.geoMercator()
    .scale(200000)
    .rotate([71.068,0])
    .center([0,42.355])
    .translate([w/2,h/4])
    
var path = d3.geoPath().projection(projection);
var map = mapLayer.selectAll('path')
        .data(neighborhoods_json.features);
        
var controlBtnId = 1;
var colorPaletteOptions = {
    roomType: 1, 
    cancelPolicy: 2, 
    amenities: 3, 
    familyPets: 4,
    neighbourhood: 5
}
var colorPalette = colorPaletteOptions.roomType;

d3.queue()
    .defer(d3.csv,'../data/airbnb.csv',parse)
    .await(dataloaded);

//legend 
plot.append('text')
    .text('Estimated Monthly Income')
    .attr('dx', 0)
    .attr('dy',h+70)
    
plot.append('circle')
    .attr('r',15)
    .attr('cx',200)
    .attr('cy', h+70)
    .style('stroke', '#484848')
    .style('fill','white');

plot.append('circle')
    .attr('r',10)
    .attr('cx',240)
    .attr('cy', h+70)
    .style('stroke', '#484848')
    .style('fill','white');

plot.append('circle')
    .attr('r',6)
    .attr('cx',270)
    .attr('cy', h+70)
    .style('stroke', '#484848')
    .style('fill','white');

// Filter data that are not satisfying the standard
function preprocessData(data){
    dataSet = data;
    dataSet = dataSet.filter(function(entry){
        if(entry.numReviews < 2) return false;
        if(entry.minNights == 0 || entry.minNights >31) return false;
        if(entry.calculatedHostListing == 0) return false;
        if(entry.minNights * entry.reviewsPerMonth > 30) return false;
        if(entry.cancelPolicy == 'super_strict_30') return false;
        return true;
    });
    dataSet.forEach(function(d){
        if( !filterStatus.roomTypes.btns.has(d.roomType) ){
            filterStatus.roomTypes.btns.add(d.roomType);
        } 
        if( !filterStatus.neighbourLocations.btns.has(d.neighbourhood) ){
            filterStatus.neighbourLocations.btns.add(d.neighbourhood);
        } 
        if( !filterStatus.cancelTypes.btns.has(d.cancelPolicy) ){
            filterStatus.cancelTypes.btns.add(d.cancelPolicy);
        } 
    })
    addButtonGroups();
    $('#xDropdown').html('Minimum Nights<span class="caret"></span>');
    $('#yDropdown').html('Price<span class="caret"></span>');
}

function dataloaded(err, data){
    preprocessData(data);
    draw();
    drawAxis();
} 

function addButtonGroups(){
    addButtonGroup('.btn-group-roomType',  filterStatus.roomTypes.btns, roomTypeBtnClickHandler);
    filterStatus.roomTypes.selected = filterStatus.roomTypes.btns; // show circles at the beginning
    
    addButtonGroup('.btn-group-neighbourhood', filterStatus.neighbourLocations.btns, neighbourhoodBtnClickHandler);
    filterStatus.neighbourLocations.selected = filterStatus.neighbourLocations.btns;
    
    addButtonGroup('.btn-group-cancelPolicy', filterStatus.cancelTypes.btns, cancelPolicyBtnClickHandler);
    filterStatus.cancelTypes.selected = filterStatus.cancelTypes.btns;
    
    addButtonGroup('.btn-group-amenities', filterStatus.amenitiesTypes.btns, amenitiesBtnClickHandler);
    filterStatus.amenitiesTypes.selected = filterStatus.amenitiesTypes.btns;
    
    addButtonGroup('.btn-group-familyPets', filterStatus.familyPets.btns, familyPetsBtnClickHandler);
    filterStatus.familyPets.selected = filterStatus.familyPets.btns;

    colorBasedOnFilter();
    
}

function addButtonGroup(btnGroupContainer,btnNameSet,onclick) {
    d3.select(btnGroupContainer)
        .selectAll('.btn')
        .data(btnNameSet.values())
        .enter()
        .append('a')
        .html(function(d){return d})
        .attr('class','btn btn-default btnFilter')
        .style('color','white')
        .on('click',onclick);
}

function colorBasedOnFilter() {
    d3.selectAll('.btnFilter')
        .style('background',function(btnContent){
            if(isBtnSelected(btnContent)) {
                if(isBtnGroupColorPelette(btnContent)){
                    return scaleColorPolicy(btnContent)
                } else {
                    return '#b5b5b5';
                } 
            } else {
                return 'white';
            }
        })
}

function isBtnSelected(btn){
    if(filterStatus.roomTypes.selected.has(btn)) return true;
    if(filterStatus.neighbourLocations.selected.has(btn)) return true;
    if(filterStatus.cancelTypes.selected.has(btn)) return true;
    if(filterStatus.amenitiesTypes.selected.has(btn)) return true;
    if(filterStatus.familyPets.selected.has(btn)) return true;
    return false;
}

function isBtnGroupColorPelette(btn){
    var groupName;
    
    if(filterStatus.roomTypes.btns.has(btn)) groupName = 'roomType';
    if(filterStatus.neighbourLocations.btns.has(btn)) groupName = 'neighbourhood';
    if(filterStatus.cancelTypes.btns.has(btn)) groupName = 'cancelPolicy';
    if(filterStatus.amenitiesTypes.btns.has(btn)) groupName = 'amenities';
    if(filterStatus.familyPets.btns.has(btn)) groupName = 'familyPets';
    
    if($('input[name=optradio]:checked').val() == groupName) return true;
    return false;
}


function roomTypeBtnClickHandler(roomType){
    if (filterStatus.roomTypes.selected.has(roomType)){
        filterStatus.roomTypes.selected.remove(roomType);
    } else {
        filterStatus.roomTypes.selected.add(roomType);
    }
  
    if (filterStatus.roomTypes.selected.has(roomType)) {
        d3.select(this)
            .style('background',function(d){return scaleColorPolicy(d)})
            .style('color','white');
    } else {
        d3.select(this)
            .style('background','white')
            .style('color','#ddd')
            .style('border-style','dotted');
    }
    colorBasedOnFilter();
    draw();
}

function neighbourhoodBtnClickHandler(neighbourhood){
    if (filterStatus.neighbourLocations.selected.has(neighbourhood)){
        filterStatus.neighbourLocations.selected.remove(neighbourhood);
    } else {
        filterStatus.neighbourLocations.selected.add(neighbourhood);
    }
  
    if (filterStatus.neighbourLocations.selected.has(neighbourhood)) {
        d3.select(this).style('background','#337ab7')
        .style('color','white');
    } else {
        d3.select(this)
            .style('background','white')
            .style('color','#ddd')
            .style('border-style','dotted');
    }
    colorBasedOnFilter(); 
    draw();
}

function cancelPolicyBtnClickHandler(cancelPolicy){
    if (filterStatus.cancelTypes.selected.has(cancelPolicy)){
        filterStatus.cancelTypes.selected.remove(cancelPolicy);
    } else {
        filterStatus.cancelTypes.selected.add(cancelPolicy);
    }
  
    if (filterStatus.cancelTypes.selected.has(cancelPolicy)) {
        d3.select(this)
        .style('background',function(d){return scaleColorPolicy(d)})
        .style('color','white');
    } else {
        d3.select(this)
            .style('background','white')
            .style('color','#ddd')
            .style('border-style','dotted');
    }
    colorBasedOnFilter();    
    draw();
}

function amenitiesBtnClickHandler(amenities) {
    if (filterStatus.amenitiesTypes.selected.has(amenities)){
        filterStatus.amenitiesTypes.selected.remove(amenities);
    } else {
        filterStatus.amenitiesTypes.selected.add(amenities);
    }
  
    if (filterStatus.amenitiesTypes.selected.has(amenities)) {
        d3.select(this).style('background','#337ab7')
        .style('color','white');
    } else {
        d3.select(this)
            .style('background','white')
            .style('color','#ddd')
            .style('border-style','dotted');
    }
    colorBasedOnFilter();    
    draw();
}

function familyPetsBtnClickHandler(familyPets) {
    if (filterStatus.familyPets.selected.has(familyPets)){
        filterStatus.familyPets.selected.remove(familyPets);
    } else {
        filterStatus.familyPets.selected.add(familyPets);
    }
  
    if (filterStatus.familyPets.selected.has(familyPets)) {
        d3.select(this).style('background','#337ab7')
        .style('color','white');
    } else {
        d3.select(this)
            .style('background','white')
            .style('color','#ddd')
            .style('border-style','dotted');
    }
    colorBasedOnFilter();
    draw();
}

function drawAxis(){
    $('.axis-x').hide();
    $('.axis-y').hide();
    if ($('#xDropdown').text() == 'Minimum Nights') {
        axisLayer.append('g').attr('class','axis axis-x')
            .attr('transform','translate(0,'+h+')')
            .call(axisXscaleXminNights);
    }else if ($('#xDropdown').text() == 'Reviews Per Month'){
        axisLayer.append('g').attr('class','axis axis-x')
            .attr('transform','translate(0,'+h+')')
            .call(axisXscaleXreviewsPerMonth);
    }else if ($('#xDropdown').text() == 'Cleaning Fee'){
        axisLayer.append('g').attr('class','axis axis-x')
            .attr('transform','translate(0,'+h+')')
            .call(axisXscaleXcleaningFee);
    }else if ($('#xDropdown').text() == 'Price'){
        axisLayer.append('g').attr('class','axis axis-x')
            .attr('transform','translate(0,'+h+')')
            .call(axisXscaleXprice);
    }else if ($('#xDropdown').text() == 'Calculated Host Listings'){
        axisLayer.append('g').attr('class','axis axis-x')
            .attr('transform','translate(0,'+h+')')
            .call(axisXscaleXcalculatedHostListing);
    };
    
    if ($('#yDropdown').text() == 'Minimum Nights') {
        axisLayer.append('g').attr('class','axis axis-y')
            .call(axisYscaleYminNights);
    }else if ($('#yDropdown').text() == 'Reviews Per Month'){
        axisLayer.append('g').attr('class','axis axis-y')
            .call(axisYscaleYreviewsPerMonth);
    }else if ($('#yDropdown').text() == 'Cleaning Fee'){
        axisLayer.append('g').attr('class','axis axis-y')
            .call(axisYscaleYcleaningFee);
    }else if ($('#yDropdown').text() == 'Price'){
        axisLayer.append('g').attr('class','axis axis-y')
            .call(axisYscaleYprice);
    }else if ($('#yDropdown').text() == 'Calculated Host Listings'){
        axisLayer.append('g').attr('class','axis axis-y')
            .call(axisYscaleYcalculatedHostListing);
    };
        
    $('.xAxisOptions').css('left', wLable).css('top', hLable);
    // $('.yAxisOptions').css('left', 150).css('top', 140).css('position','fixed');
    $('.yAxisOptions').css('left', -100).css('top', 30);
    
    
}

$('.xAxisOptions li a').click(function(){
    // $('#xDropdown').html($(this).text());
    $('#xDropdown').html($(this).text()+'<span class="caret"></span>');
    // $('#xDropdown').val($(this).text());
    drawAxis();
    draw();
});

$('.yAxisOptions li a').click(function(){
    // $('#yDropdown').html($(this).text());
    $('#yDropdown').html($(this).text()+'<span class="caret"></span>');
    // $('#yDropdown').val($(this).text());
    drawAxis();
    draw();
});

 
// Close the dropdown if the user clicks outside of it
// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn')) {

//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// }

function drawMap(){
    map.enter()
        .append('path')
        .attr('fill','#ddd')
        .style('opacity',0.5)
        .attr('d',path);
    map.exit()
        .remove();
}

function canvasControl(){
    d3.select('#chartBtn').on('click',function(){
        $('#chartBtn').css('background','#d8d8d8');
        $('#mapBtn').css('background','white');
        if(controlBtnId == 1) return; 
        controlBtnId = 1; 
        drawAxis();
        $('.xAxisOptions').show();
        $('.yAxisOptions').show();
        $('path').css('display','none');
        draw();
    });
    
    d3.select('#mapBtn').on('click',function(){
        $('#chartBtn').css('background','white');
        $('#mapBtn').css('background','#d8d8d8');
        if(controlBtnId == 2) return; 
        controlBtnId = 2;
        drawMap();
        $('.axis-x').hide();
        $('.axis-y').hide();
        $('.xAxisOptions').hide();
        $('.yAxisOptions').hide();
        draw();
    });
    $('#chartBtn').css('background','#d8d8d8');
    $('#mapBtn').css('background','white');
}

canvasControl();

function draw(){
    var minX = d3.min(dataSet, function(d){return d.monthlyIncome;}),
        maxX = d3.max(dataSet, function(d){return d.monthlyIncome;}); 
    var scaleIncome = d3.scaleLinear()
        .domain([minX, maxX])
        .range([1,15]);
    
    var filteredDataSet = dataSet.filter(function(entry){
        if(!filterStatus.roomTypes.selected.has(entry.roomType)) return false;
        if(!filterStatus.neighbourLocations.selected.has(entry.neighbourhood)) return false;
        if(!filterStatus.cancelTypes.selected.has(entry.cancelPolicy)) return false;
        if(!filterStatus.amenitiesTypes.selected.has(entry.amenities)) return false;
        if(!filterStatus.familyPets.selected.has(entry.familyPets)) return false;
        return true;
    });
    
    var node = dataLayer.selectAll('.node')
        .data(filteredDataSet,function(d){return d.id});
        
    //ENTER
    var nodeEnter = node.enter()
        .append('g')
        .attr('class','node')
        .on('click',function(d,i){
            // console.log(d);
            // console.log(i);
            // console.log(this);
            // console.log(d); 
        })
        .on('mouseenter',function(d){
            var tooltip = d3.select('.custom-tooltip');
            tooltip.selectAll('.title')
                .html('Host: '+ d.hostName);
            tooltip.select('.value1')
                .html('<b>$'+ d.price + '/ night</b>');
            tooltip.select('.value2')    
                .html('<b>'+d.reviewsPerMonth +' reviews/month</b>');
            tooltip.select('.value3')
                .html("<b>Minimum Nights:</b><span style='color:#929292' class='tooltipValue'>"+d.minNights+ "</span>");
            tooltip.select('.value4')
                .html("<b>Monthly Income:</b><span style='color:#929292' class='tooltipValue'>"+'$'+d.monthlyIncome+ "</span>");
                // .html('Monthly Income: $'+d.monthlyIncome);
            tooltip.select('.value5')
                .html("<b>Neighbourhood:</b><span style='color:#929292' class='tooltipValue'>"+d.neighbourhood+ "</span>");
                // .html('Neighbourhood: '+d.neighbourhood);
            tooltip.select('.value6')
                .html("<b>Cancel Policy: </b><span style='color:#929292' class='tooltipValue'>"+d.cancelPolicy+ "</span>");
                // .html('Cancel Policy: '+d.cancelPolicy);
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
        });
    
    nodeEnter.append('circle')
        .attr('r', function(d){
            return scaleIncome(d.monthlyIncome);
        })
        .style('fill','#8c8c8c');
    
    //UPDATE+ ENTER
    // var nodeTransition = nodeEnter
    //     .merge(node);  --nodes appear everytime clicking on the btn

    nodeEnter.select('circle')
        // .attr('cx',0)
        // .attr('cy',h/2)
         .attr('cx',function(d){
            if(controlBtnId == 1){
                // return 0;
                if($('#xDropdown').text() == 'Minimum Nights'){
                    return scaleXminNights(d.minNights);
                }else if($('#xDropdown').text() == 'Reviews Per Month'){
                    return scaleXreviewsPerMonth(d.reviewsPerMonth);
                }else if($('#xDropdown').text() == 'Cleaning Fee'){
                    return scaleXcleaningFee(d.cleaningFee);
                }else if($('#xDropdown').text() == 'Price'){
                    return scaleXprice(d.price);
                }else if($('#xDropdown').text() == 'Calculated Host Listings'){
                    return scaleXcalculatedHostListing(d.calculatedHostListing);
                }; 
            }else if(controlBtnId == 2){
                return w/2;
            }
        })
        .attr('cy',function(d){
            if(controlBtnId == 1){
                return h;
            }else if(controlBtnId == 2){
                return h/2;
            }
        });
        // .attr('cx',function(d){
        //     if (controlBtnId == 1){
        //         if($('#xDropdown').text() == 'Minimum Nights'){
        //             return scaleXminNights(d.minNights);
        //         }else if($('#xDropdown').text() == 'Reviews Per Month'){
        //             return scaleXreviewsPerMonth(d.reviewsPerMonth);
        //         }else if($('#xDropdown').text() == 'Cleaning Fee'){
        //             return scaleXcleaningFee(d.cleaningFee);
        //         }else if($('#xDropdown').text() == 'Price'){
        //             return scaleXprice(d.price);
        //         }else if($('#xDropdown').text() == 'Calculated Host Listings'){
        //             return scaleXcalculatedHostListing(d.calculatedHostListing);
        //         }; 
                
        //     }else if(controlBtnId ==2) {
        //         return projection([d.lon,d.lat])[0];
        //     }
        // });
        // .attr('cy',function(d){
        //     if (controlBtnId == 1){
        //         if($('#yDropdown').text() == 'Minimum Nights'){
        //             return scaleYminNights(d.minNights);
        //         }else if($('#yDropdown').text() == 'Reviews Per Month'){
        //             return scaleYreviewsPerMonth(d.reviewsPerMonth);
        //         }else if($('#yDropdown').text() == 'Cleaning Fee'){
        //             return scaleYcleaningFee(d.cleaningFee);
        //         }else if($('#yDropdown').text() == 'Price'){
        //             return scaleYprice(d.price);
        //         }else if($('#yDropdown').text() == 'Calculated Host Listings'){
        //             return scaleYcalculatedHostListing(d.calculatedHostListing);
        //         };
                
        //     }else if(controlBtnId ==2) {
        //         return projection([d.lon,d.lat])[1];
        //     }
        // });
    
    nodeEnter.merge(node)
        .select('circle')
        .transition()
        .duration(500)
        .attr('cx',function(d){
            if (controlBtnId == 1){
                if($('#xDropdown').text() == 'Minimum Nights'){
                    // console.log($('#xDropdown').val());
                    return scaleXminNights(d.minNights);
                }else if($('#xDropdown').text() == 'Reviews Per Month'){
                    return scaleXreviewsPerMonth(d.reviewsPerMonth);
                }else if($('#xDropdown').text() == 'Cleaning Fee'){
                    return scaleXcleaningFee(d.cleaningFee);
                }else if($('#xDropdown').text() == 'Price'){
                    return scaleXprice(d.price);
                }else if($('#xDropdown').text() == 'Calculated Host Listings'){
                    return scaleXcalculatedHostListing(d.calculatedHostListing);
                };
                // return scaleX(d.secDeposit);
            }else if(controlBtnId ==2) {
                return projection([d.lon,d.lat])[0];
            }
        })
        .attr('cy',function(d){
            if (controlBtnId == 1){
                    if($('#yDropdown').text() == 'Minimum Nights'){
                        return scaleYminNights(d.minNights);
                    }else if($('#yDropdown').text() == 'Reviews Per Month'){
                        return scaleYreviewsPerMonth(d.reviewsPerMonth);
                    }else if($('#yDropdown').text() == 'Cleaning Fee'){
                        return scaleYcleaningFee(d.cleaningFee);
                    }else if($('#yDropdown').text() == 'Price'){
                        return scaleYprice(d.price);
                    }else if($('#yDropdown').text() == 'Calculated Host Listings'){
                        return scaleYcalculatedHostListing(d.calculatedHostListing);
                    };
                // return scaleY(d.price);
            }else if(controlBtnId ==2) {
                return projection([d.lon,d.lat])[1];    
            };
        })
        .style("fill", function(d) { 
            switch (colorPalette) {
                case colorPaletteOptions.roomType:
                    return scaleColorPolicy(d.roomType); 
                case colorPaletteOptions.cancelPolicy:
                    return scaleColorPolicy(d.cancelPolicy); 
                case colorPaletteOptions.amenities:
                    return scaleColorPolicy(d.amenities); 
                case colorPaletteOptions.familyPets:
                    return scaleColorPolicy(d.familyPets); 
                case colorPaletteOptions.neighbourhood:
                    return scaleColorPolicy(d.neighbourhood); 
            }
        })
        .style('opacity',0.7);
    //EXIT
    node.exit()
        .transition()
        .duration(500)
        .attr('cy',0)
        .style('opacity',0)
        .remove();
} 

$('.roomTypeRadioBtn').click(function(){
    colorPalette = colorPaletteOptions.roomType;
    colorBasedOnFilter();
    draw();
});

$('.cancelPolicyRadioBtn').click(function(){
    colorPalette = colorPaletteOptions.cancelPolicy;
    colorBasedOnFilter();
    draw();
});

$('.amenitiesRadioBtn').click(function(){
    colorPalette = colorPaletteOptions.amenities;
    colorBasedOnFilter();
    draw();
});

$('.familyPetsRadioBtn').click(function(){
    colorPalette = colorPaletteOptions.familyPets;
    colorBasedOnFilter();
    draw();
});

$('.neighbourhoodRadioBtn').click(function(){
    colorPalette = colorPaletteOptions.neighbourhood;
    colorBasedOnFilter();
    draw();
});


function parse(d){
    // if( !filterStatus.roomTypes.btns.has(d.room_type) ){
    //     filterStatus.roomTypes.btns.add(d.room_type);
    // } 
    // if( !filterStatus.neighbourLocations.btns.has(d.neighbourhood) ){
    //     filterStatus.neighbourLocations.btns.add(d.neighbourhood);
    // } 
    // if( !filterStatus.cancelTypes.btns.has(d.cancellation_policy) ){
    //     filterStatus.cancelTypes.btns.add(d.cancellation_policy);
    // } 
    var entry = {
        id:d.id,
        hostId: +d.host_id,
        hostName: d.host_name,
        neighbourhood: d.neighbourhood,
        lat: +d.latitude,
        lon: +d.longitude,
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
            entry.amenities = 'Neither';
        } 
    } 
    
    if(d.amenities.includes('Family/Kid Friendly')) {
        if (d.amenities.includes('Pets Allowed')){
            entry.familyPets = 'Kids + Pets';
        } else {
            entry.familyPets = 'Kids';
        }
    } else {
        if (d.amenities.includes('Pets Allowed')){
            entry.familyPets = 'Pets';
        } else {
            entry.familyPets = 'Neither';
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

var socket = io();
function initialize() {


  var styles = [
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#545454' }
      ]
    },{
      featureType: 'landscape.natural',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#000000' }
      ]
    },{
      featureType: 'administrative.country',
      elementType: 'all',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        { visibility: 'off' }
      ]
    }
  ];
  // Create the Google Map…
  var latlng = new google.maps.LatLng(0, 0); //this numbers sets the lat and long of the center of the map. UK 54, -4
  var myOptions = {
    mapTypeControlOptions: {
      mapTypeIds: ['Styled']
    },
    zoom: 2  // this number changes the zoom that the map starts at UK 6
    , center: latlng
    , disableDefaultUI: true
    , mapTypeId: 'Styled' //ROADMAP can also be SATELLITE, HYBRID, or TERRAIN
  };
  var map = new google.maps.Map(document.getElementById("map"), myOptions);
  var styledMapType = new google.maps.StyledMapType(styles, { name: 'Styled' });
  map.mapTypes.set('Styled', styledMapType);
  // Load the station data. When the data comes back, create an overlay.
  socket.on('tweets', function(data) {

    // if (data.retweet_count) {
    //console.log(data.retweet_count);
    // }
    var overlay = new google.maps.OverlayView();
    // Add the container when the overlay is added to the map.
    overlay.onAdd = function() {
      var scale = d3.scale.linear()
      .domain([0, 500000])
      .range([20, 100]);
      var layer = d3.select(this.getPanes().overlayLayer).append("div")
      .attr("class", "stations");
      // Draw each marker as a separate SVG element.
      // We could use a single SVG, but what size would it have?
      overlay.draw = function() {
        var projection = this.getProjection(),
        padding = 10;
        var marker = layer.selectAll("svg")
        .data(d3.entries(data))
        .each(transform) // update existing markers
        .enter().append("svg:svg")
        .each(transform)
        .attr("class", "marker");
        // Add a circle.
        marker.append("svg:circle")
        .attr("r", 0)
        .attr("cx", padding)
        .attr("cy", padding)
        .style("fill", function(d){
          if(data.followersCount > 1000) return "rgb(255, 50, 153)";
         else return "rgb(50, 255, 150)"
       })
        // function(d){
        //   if(data.followers_count > 1) return "red";
        //   else return "blue";
        // })

        .style("fill-opacity", 0.4)
        .transition().remove()
        .attr("r", 14)

          // if(data.followers_count > 200) return 14;
          // else return 4;

        .style("fill",  function(d){
          if(data.followersCount > 1000) return "rgb(255, 50, 50)";
          else return "rgb(100, 255, 255)"})
          .style("fill-opacity", 0.4).duration(3000)
        .style("opacity", 0).duration(3000);


        // Add a label.
        // marker.append("svg:text")
        //     .attr("x", padding + 7)
        //     .attr("y", padding)
        //     .attr("dy", ".31em")
        //     .text(function(d) { return d.key; });
        function transform(d) {
          d = new google.maps.LatLng(data.coordinates[1],data.coordinates[0]);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
          .style("left", (d.x - padding) + "px")
          .style("top", (d.y - padding) + "px");
        }
      };
    };


    // Bind our overlay to the map…
    overlay.setMap(map);
  });
}

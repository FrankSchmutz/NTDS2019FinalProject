/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
	*/
function whenDocumentLoaded(action) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", action);
  } else {
    action();
  }
}

// function updateData(map, path_to_data) {
//   let data = []
//   d3.csv(path_to_data, function(csv) {
//     })
//     .then(() => {
//       map.display_data(data)
//     });
// }

function updateData(map, path_to_data) {
  d3.csv(path_to_data).then(function(data) {
    map.display_data(data)
  });
}

class Map {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.projection = d3.geoWinkel3()
      .translate([4 * this.width / 9, this.height / 1.8])
      .scale((this.width) / 5);
    this.path = d3.geoPath()
      .projection(this.projection);
    this.svg = d3.select('#map').select('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.land = this.svg.select('#container').append('g');
    this.circles = this.svg.select('#container').append('g');
    this.boundaries = this.svg.select('#container').append('g');
    this.transform = d3.zoomIdentity

    this.main_data = []
  }

  // used to display airports as circles (needs modification, e.g. different colors for different types or airports)
  // may also need another function to display routes between airports
  display_data(data) {

    this.main_data = data

    const context = this;
    
    let dataPoints = this.circles.selectAll('circle').data(data, d => d);



    dataPoints
      .enter().append('circle')
      .attr('cx', d => context.projection([d.lon, d.lat])[0])
      .attr('cy', d => context.projection([d.lon, d.lat])[1])
      .attr('r', d => 2)
      .attr('transform', context.transform)
      .attr('opacity', 0)
      .on("click", function(d){
        console.log("clickclickclickclickclickclick")
      })
      .on("mouseover", function(d){
        console.log(d.IATA, d.country)
      })
      .on("mouseout", function(d){
        console.log("leave")
      })
      .attr('fill',function(d){
        switch(d.continent) {
          case "Europe":
            return "orange"
          case "North America":
            return "skyblue"
          case "South America":
            return "lightyellow"
          case "Asia":
            return "white"
          case "Antactica":
            return "white"
          case "Oceania":
            return "red"
          case "Africa":
            return "lime"
          default:
            "grey"
        }
        return "yellow"
      })
      .transition()
      .duration(1000)
      .attr('opacity', 1)

      

    dataPoints
      .transition()
      .duration(1000)
      .attr('cx', d => context.projection([d.lon, d.lat])[0])
      .attr('cy', d => context.projection([d.lon, d.lat])[1])
      .attr('r', d => 0.1)
      .attr('transform', context.transform);

    dataPoints
      .exit()
      .transition()
      .duration(1000)
      .attr('opacity', 0)
      .remove();
  }

  clear_data() {
    this.main_data = []
    this.circles.selectAll('circle')
      .transition()
      .duration(1000)
      .attr('opacity', 0)
      .remove();
  }
}

function load_country_polygons(countries, countries_to_continent) {
  filenames = ['AFG.geo.json', 'AGO.geo.json', 'ALB.geo.json', 'ARE.geo.json', 'ARG.geo.json', 'ARM.geo.json', 'ATF.geo.json', 'AUS.geo.json', 'AUT.geo.json', 'AZE.geo.json', 'BDI.geo.json', 'BEL.geo.json', 'BEN.geo.json', 'BFA.geo.json', 'BGD.geo.json', 'BGR.geo.json', 'BHS.geo.json', 'BIH.geo.json', 'BLR.geo.json', 'BLZ.geo.json', 'BMU.geo.json', 'BOL.geo.json', 'BRA.geo.json', 'BRN.geo.json', 'BTN.geo.json', 'BWA.geo.json', 'CAF.geo.json', 'CAN.geo.json', 'CHE.geo.json', 'CHL.geo.json', 'CHN.geo.json', 'CIV.geo.json', 'CMR.geo.json', 'COD.geo.json', 'COG.geo.json', 'COL.geo.json', 'CRI.geo.json', 'CS-KM.geo.json', 'CUB.geo.json', 'CYP.geo.json', 'CZE.geo.json', 'DEU.geo.json', 'DJI.geo.json', 'DNK.geo.json', 'DOM.geo.json', 'DZA.geo.json', 'ECU.geo.json', 'EGY.geo.json', 'ERI.geo.json', 'ESH.geo.json', 'ESP.geo.json', 'EST.geo.json', 'ETH.geo.json', 'FIN.geo.json', 'FJI.geo.json', 'FLK.geo.json', 'FRA.geo.json', 'GAB.geo.json', 'GBR.geo.json', 'GEO.geo.json', 'GHA.geo.json', 'GIN.geo.json', 'GMB.geo.json', 'GNB.geo.json', 'GNQ.geo.json', 'GRC.geo.json', 'GRL.geo.json', 'GTM.geo.json', 'GUF.geo.json', 'GUY.geo.json', 'HND.geo.json', 'HRV.geo.json', 'HTI.geo.json', 'HUN.geo.json', 'IDN.geo.json', 'IND.geo.json', 'IRL.geo.json', 'IRN.geo.json', 'IRQ.geo.json', 'ISL.geo.json', 'ISR.geo.json', 'ITA.geo.json', 'JAM.geo.json', 'JOR.geo.json', 'JPN.geo.json', 'KAZ.geo.json', 'KEN.geo.json', 'KGZ.geo.json', 'KHM.geo.json', 'KOR.geo.json', 'KWT.geo.json', 'LAO.geo.json', 'LBN.geo.json', 'LBR.geo.json', 'LBY.geo.json', 'LKA.geo.json', 'LSO.geo.json', 'LTU.geo.json', 'LUX.geo.json', 'LVA.geo.json', 'MAR.geo.json', 'MDA.geo.json', 'MDG.geo.json', 'MEX.geo.json', 'MKD.geo.json', 'MLI.geo.json', 'MLT.geo.json', 'MMR.geo.json', 'MNE.geo.json', 'MNG.geo.json', 'MOZ.geo.json', 'MRT.geo.json', 'MWI.geo.json', 'MYS.geo.json', 'NAM.geo.json', 'NCL.geo.json', 'NER.geo.json', 'NGA.geo.json', 'NIC.geo.json', 'NLD.geo.json', 'NOR.geo.json', 'NPL.geo.json', 'NZL.geo.json', 'OMN.geo.json', 'PAK.geo.json', 'PAN.geo.json', 'PER.geo.json', 'PHL.geo.json', 'PNG.geo.json', 'POL.geo.json', 'PRI.geo.json', 'PRK.geo.json', 'PRT.geo.json', 'PRY.geo.json', 'PSE.geo.json', 'QAT.geo.json', 'ROU.geo.json', 'RUS.geo.json', 'RWA.geo.json', 'SAU.geo.json', 'SDN.geo.json', 'SEN.geo.json', 'SLB.geo.json', 'SLE.geo.json', 'SLV.geo.json', 'SOM.geo.json', 'SRB.geo.json', 'SSD.geo.json', 'SUR.geo.json', 'SVK.geo.json', 'SVN.geo.json', 'SWE.geo.json', 'SWZ.geo.json', 'SYR.geo.json', 'TCD.geo.json', 'TGO.geo.json', 'THA.geo.json', 'TJK.geo.json', 'TKM.geo.json', 'TLS.geo.json', 'TTO.geo.json', 'TUN.geo.json', 'TUR.geo.json', 'TWN.geo.json', 'TZA.geo.json', 'UGA.geo.json', 'UKR.geo.json', 'URY.geo.json', 'USA.geo.json', 'UZB.geo.json', 'VEN.geo.json', 'VNM.geo.json', 'VUT.geo.json', 'YEM.geo.json', 'ZAF.geo.json', 'ZMB.geo.json', 'ZWE.geo.json']

  for (let i = 0; i < filenames.length; i++) {
    d3.json('countries/' + filenames[i])
      .then(data => {
        let country = data['features'][0]['properties']['name']
        if (country == 'South Africa') {
          countries[country] = [data['features'][0]['geometry']['coordinates'][0]]
        }
        else {
          countries[country] = data['features'][0]['geometry']['coordinates']
        }
        countries_to_continent[country] = data['features'][0]['properties']['continent']
      })
  }
}

function inside(point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  let x = point[0],
    y = point[1];

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    let xi = vs[i][0],
      yi = vs[i][1];
    let xj = vs[j][0],
      yj = vs[j][1];

    let intersect = ((yi > y) != (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
};

whenDocumentLoaded(() => {
  let countries = {}
  let countries_to_continent = {}
  load_country_polygons(countries, countries_to_continent)

  const map = new Map();
  const background = d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json');

  let data = [];
  
  updateData(map, "./data/airports.csv")


  // insert data path here (maybe need to load multiple csv files so modify accordingly)
  d3.csv("", function(data) {

  })
    .then(() => {
      background.then(world => {
        map.land.append('path')
          .datum(topojson.merge(world, world.objects.countries.geometries))
          .attr('class', 'land')
          .attr('d', map.path);

        map.boundaries.append('path')
          .datum(topojson.mesh(world, world.objects.countries))
          .attr('class', 'boundary')
          .attr('d', map.path);
      });

      map.display_data(data)

      d3.select("#header")
        .on("mousemove", function(d, i) {
          let box = d3.select('#mouse_region')
          box.style('opacity', 0)
        })

      map.svg.on("mousemove", function(d, i) {
        coord = d3.mouse(this)
        coord[0] = (coord[0] - map.transform.x) / map.transform.k
        coord[1] = (coord[1] - map.transform.y) / map.transform.k
        coord = map.projection.invert(coord)

        let keys = Object.keys(countries)
        
        let box = d3.select('#mouse_region')
        let on_valid_region = false

        for (let i = 0; i < keys.length; i++) {
          let key = keys[i]

          let country_polygons = countries[key]
          for (let j = 0; j < country_polygons.length; j++) {
            let polygon = []
            if (country_polygons.length > 1) {
              polygon = country_polygons[j][0]
            } else {
              polygon = country_polygons[j]
            }
            if (inside(coord, polygon)) {
              on_valid_region = true
                box
                  .style('opacity', 1)
                  .text(key)
              break
            }
          }
        }

        if (!on_valid_region) {
            box
              .style('opacity', 0)
        }

        let dims = box.node().getBoundingClientRect()

        box
          .style('left', (d3.min([d3.mouse(this)[0] + 20, window.innerWidth - dims.width - 5])) + 'px')
          .style('top', (d3.max([d3.mouse(this)[1] - 40, 5])) + 'px')
      })
    });

  function zoomed() {
    map.land
      .selectAll('path') // To prevent stroke width from scaling
      .attr('transform', d3.event.transform);

    map.boundaries
      .selectAll('path') // To prevent stroke width from scaling
      .attr('transform', d3.event.transform);

    map.circles
      .selectAll('polygon') // To prevent stroke width from scaling
      .attr('transform', d3.event.transform);

    map.transform = d3.event.transform
  }

  const zoom = d3.zoom()
    .scaleExtent([1, 50])
    .on('zoom', zoomed);

  map.svg.call(zoom);

});

fetch('capitals.json')
  .then(response => response.json())
  .then(data => {
    const map = L.map('map').setView([51.505, -0.09], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    data.forEach(capital => {
      // Determine marker color based on realEstatePrice
      const markerColor = getColor(capital.realEstatePrice);

      // Determine marker radius based on population
      const markerRadius = getRadius(capital.population);

      const marker = L.marker([capital.lat, capital.lng], {
        icon: coloredIcon(markerColor, markerRadius),
      })
        .addTo(map)
        .bindPopup(`
          <b>${capital.city}</b><br>
          Country: ${capital.country}<br>
          Population: ${capital.population}<br>
          Average Real Estate Price: €${capital.realEstatePrice}
        `);
    });

    // Function to get marker color based on realEstatePrice
    function getColor(realEstatePrice) {
      const minPrice = Math.min(...data.map(capital => capital.realEstatePrice));
      const maxPrice = Math.max(...data.map(capital => capital.realEstatePrice));
      const normalizedPrice = (realEstatePrice - minPrice) / (maxPrice - minPrice);

      // Interpolate color from cooler to hotter based on realEstatePrice
      const hue = 240 + normalizedPrice * 120; // Adjusted to start with blue and end with red
      return `hsl(${hue}, 100%, 50%)`;
    }

    // Function to get marker radius based on population
    function getRadius(population) {
      const minPopulation = Math.min(...data.map(capital => capital.population));
      const maxPopulation = Math.max(...data.map(capital => capital.population));
      const normalizedPopulation = (population - minPopulation) / (maxPopulation - minPopulation);

      // Interpolate radius from 10px to 50px based on population
      return 10 + normalizedPopulation * 40;
    }

    // Function to create a colored marker icon with custom radius
    function coloredIcon(color, radius) {
      return L.divIcon({
        className: 'custom-marker',
        iconSize: [radius, radius],
        iconAnchor: [radius / 2, radius / 2],
        popupAnchor: [0, -radius / 2],
        html: `<div style="background-color: ${color};" class="marker-color"></div>`
      });
    }
  });

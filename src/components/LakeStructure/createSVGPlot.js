import { select } from 'd3';

const createSVGPlot = (svgElement, numberOfRays, rayData, distance, onRayClick) => {
  const svg = select(svgElement);
  const parentElement = svgElement.parentNode;
  const width = parentElement.offsetWidth;
  const height = parseInt(svg.attr("height"));
  const centerX = width / 2;
  const centerY = height;
  const radius = Math.min(width, height) / 2;

  // Set the width attribute of the SVG element
  svg.attr("width", width);

  // Clear the SVG
  svg.selectAll("*").remove();

  // Calculate the maximum distance across all rays
  const maxDistanceInData = Math.max(...rayData.map(ray => Math.max(...ray.map(point => point.distance))), 10);
  const maxTotalDistance = maxDistanceInData + distance;
  const scaleFactor = maxTotalDistance > 0 ? maxTotalDistance / (radius * distance) : 1;

  // Draw rays
  const rays = svg.selectAll(".ray").data([...Array(numberOfRays).keys()]);
  const newRays = rays
    .enter()
    .append("line")
    .classed("ray", true)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .on("mouseover", function () {
      select(this).attr("stroke-width", 2).attr("stroke", "blue");
    })
    .on("mouseout", function () {
      select(this).attr("stroke-width", 1).attr("stroke", "black");
    })
    .on("click", (_, index) => {
      onRayClick(index);
    });

  rays.exit().remove();

  const updatedRays = newRays.merge(rays);

  // Update the rays
  updatedRays.each(function (_, index) {
    const angle = (Math.PI * index) / (numberOfRays - 1);
    const x1 = centerX + radius * scaleFactor * Math.cos(angle);
    const y1 = centerY - radius * scaleFactor * Math.sin(angle);

    select(this)
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("x2", x1)
      .attr("y2", y1);
  });

  // Calculate the number of circles needed based on the maximum distance
  const circleSpacing = 20;
  const numberOfCircles = Math.ceil(maxTotalDistance / circleSpacing);

  // Draw circles
  for (let i = 1; i <= numberOfCircles; i++) {
    svg
      .append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", (radius * i * circleSpacing) / (radius * distance))
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .attr("fill", "none");
  }

  // Draw scale bar
  const scaleBarLength = 100; // length in pixels
  const scaleBarValue = distance * (radius / scaleBarLength); // length in distance units

  svg
    .append("line")
    .attr("x1", 10)
    .attr("y1", height - 20)
    .attr("x2", 10 + scaleBarLength)
    .attr("y2", height - 20)
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  svg
    .append("text")
    .attr("x", 10 + scaleBarLength / 2)
    .attr("y", height - 35)
    .attr("text-anchor", "middle")
    .text(`${scaleBarValue.toFixed(1)} meters`);

  // Draw data points for each ray
  rayData.forEach((dataPoints, i) => {
    const angle = (Math.PI * i) / (numberOfRays - 1);
    dataPoints.forEach((point) => {
      if (Number.isFinite(point.depth) && Number.isFinite(point.distance)) {
        const distanceFraction = point.distance / (radius * distance);
        const depthFraction = point.depth / height;
        const x = centerX + radius * distanceFraction * Math.cos(angle);
        const y = centerY - height * depthFraction;

        console.log('Data point:', point, 'x:', x, 'y:', y);
  
        svg
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 3)
          .attr("fill", "red");
      }
    });
  });
};

export default createSVGPlot;

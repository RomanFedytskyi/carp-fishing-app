import { select } from "d3";

const createSVGPlot = (
  svgElement,
  numberOfRays,
  rayData,
  distance,
  onRayClick
) => {
  const svg = select(svgElement);
  const parentElement = svgElement.parentNode;
  const width = parentElement.offsetWidth;
  const height = parseInt(svg.attr("height"));
  const centerX = width / 2;
  const centerY = height;
  const radius = width / 2;
  const radiusInMeters = 100;
  const circleSpacing = 20;
  const numberOfCircles = radiusInMeters / circleSpacing;

  // Set the width attribute of the SVG element
  svg.attr("width", width);

  // Clear the SVG
  svg.selectAll("*").remove();

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
    const x1 = centerX + radius * Math.cos(angle);
    const y1 = centerY - radius * Math.sin(angle);

    select(this)
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("x2", x1)
      .attr("y2", y1);
  });

  // Draw circles
  for (let i = 1; i <= numberOfCircles; i++) {
    svg
      .append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", (radius * i * circleSpacing) / radiusInMeters)
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .attr("fill", "none");
  }

// Draw data points for each ray
rayData.forEach((dataPoints, i) => {
  const angle = (Math.PI * i) / (numberOfRays - 1);

  for (let j = 0; j < dataPoints.length; j++) {
    const point = dataPoints[j];
    if (Number.isFinite(point.depth) && Number.isFinite(point.distance)) {
      const distanceFraction = ((j+1) * point.distance) / radiusInMeters;

      const x = centerX + radius * distanceFraction * Math.cos(angle);
      const y = centerY - radius * distanceFraction * Math.sin(angle);

      // Draw a white dot
      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 6)
        .attr("fill", "white")
        .attr("stroke", "black");

      // Overlay the depth value on the white dot
      svg
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text(point.depth);
    }
  }
});

};

export default createSVGPlot;

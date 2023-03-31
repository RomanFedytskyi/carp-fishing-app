import { select, zoom } from "d3";
import { getBGColor, getTextColor } from "../../helper";

const createSVGPlot = (
  svgElement,
  numberOfRays,
  rayData,
  distance,
  onRayClick,
  radiusInMeters,
  zoomEnabled
) => {
  const svg = select(svgElement);
  const parentElement = svgElement.parentNode;
  const width = parentElement.offsetWidth;
  const height = parseInt(svg.attr("height"));
  const centerX = width / 2;
  const centerY = height;
  const radius = width / 2;
  const circleSpacing = 20;
  const numberOfCircles = radiusInMeters / circleSpacing;

  // Set the width attribute of the SVG element
  svg.attr("width", width);

  // Clear the SVG
  svg.selectAll("*").remove();

  // Create a group element to contain all the plot elements
  const plotGroup = svg.append("g");

  // Apply the zoom functionality to the plotGroup element
  if (zoomEnabled) {
    svg.call(
      zoom().on("zoom", (event) => {
        plotGroup.attr("transform", event.transform);
      })
    );
  }

  // Draw rays
  const rays = plotGroup.selectAll(".ray").data([...Array(numberOfRays).keys()]);

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
    plotGroup
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
        plotGroup
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", "8px")
          .attr("fill", getBGColor(point.depth))
          .attr("stroke", "black");

        // Overlay the depth value on the white dot
        plotGroup
          .append("text")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "central")
          .attr("font-size", "8px")
          .attr("fill", getTextColor(point.depth))
          .text(point.depth);
      }
    }
  });
};

export default createSVGPlot;

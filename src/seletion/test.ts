import * as d3 from "d3";
import svgUrl from "./test.svg";

const barData = [45, 67, 96, 84, 41];
const rectWidth = 50;

export default async function testD3Selection() {
  const svg = await d3.svg(svgUrl);
  d3.select(svg as any)
    .selectAll("rect")
    .data(barData)
    // calculate x-position based on its index
    .attr("x", (d, i) => i * rectWidth)
    // set height based on the bound datum
    .attr("height", (d) => d)
    // rest of attributes are constant values
    .attr("width", rectWidth)
    .attr("stroke-width", 3)
    .attr("stroke-dasharray", "5 5")
    .attr("stroke", "plum")
    .attr("fill", "pink");
  return svg;
}

export function testAppenRect() {
  d3.select("body")
    .append("svg")
    .attr("width", barData.length * rectWidth)
    .selectAll('rect')
    .data(barData)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * rectWidth)
    // set height based on the bound datum
    .data(barData)
    .attr("height", (d) => d)
    // rest of attributes are constant values
    .attr("width", rectWidth)
    .attr("stroke-width", 3)
    .attr("stroke-dasharray", "5 5")
    .attr("stroke", "plum")
    .attr("fill", "pink");
  console.log("testAppenRect");
}

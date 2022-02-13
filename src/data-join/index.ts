import * as d3 from "d3";
import baseSVG from "../../static/asset/base.svg";
import appendSVG from "../utils/appendSVG";

const data1 = [
  { name: "Shao-Kui", value: 12 },
  { name: "Wen-Yang", value: 13 },
  { name: "Cai Yun", value: 16 },
  { name: "Liang Yuan", value: 10 },
  { name: "Yuan-Chen", value: 6 },
  { name: "Rui-Long", value: 10 },
  { name: "Dong Xin", value: 12 },
  { name: "He Yu", value: 20 },
  { name: "Xiang-Li", value: 12 },
  { name: "Godness", value: 20 },
  { name: "Wei-Yu", value: 15 },
  { name: "Chen Zheng", value: 14 },
  { name: "Yu Peng", value: 15 },
  { name: "Li Jian", value: 18 },
];

const data2 = [
  { name: "Wen-Yang", value: 15 },
  { name: "Shao-Kui", value: 20 },
  { name: "Cai Yun", value: 16 },
  { name: "Yuan-Chen", value: 10 },
  { name: "Liang Yuan", value: 6 },
  { name: "Rui-Long", value: 10 },
  { name: "Dong Xin", value: 12 },
  { name: "He Yu", value: 20 },
  { name: "Xiang-Li", value: 12 },
  { name: "Godness", value: 20 },
  { name: "Wei-Yu", value: 15 },
  { name: "Chen Zheng", value: 14 },
  { name: "Yu Peng", value: 15 },
  { name: "Li Jian", value: 18 },
];
export default async function render() {
  await appendSVG(baseSVG);
  const svg = d3.select("#mainsvg");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 60, right: 30, bottom: 60, left: 200 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const g = svg
    .append("g")
    .attr("id", "maingroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data1, (datum) => datum.value as any)])
    .range([0, innerWidth]);
  const yScale = d3
    .scaleBand()
    .domain(data1.map((datum) => datum.name))
    .range([0, innerHeight])
    .padding(0.1);

  g.selectAll(".dataRect")
    .data(data1)
    .enter()
    .append("rect")
    .attr("class", "dataRect")
    .attr("width", (d) => xScale(d.value))
    .attr("height", yScale.bandwidth())
    .attr("y", (d) => yScale(d.name)!)
    .attr("fill", "green")
    .attr("opacity", 0.8);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  g.append("g").call(yAxis);
  g.append("g").call(xAxis).attr("transform", `translate(0, ${innerHeight})`);
  g.selectAll(".dataRect")
    .data(data2, (d: any) => d.name)
    .transition()
    .duration(1500)
    .attr('width', d => xScale(d.value));
}

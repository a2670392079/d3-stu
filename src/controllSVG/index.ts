import appendSVG from "../utils/appendSVG";
import baseSVG from "./asset/base.svg";
import { select, scaleBand, scaleLinear, max } from "d3";
import * as d3 from "d3";

const data: Array<{ name: string; value: number }> = [
  { name: "Shao-Kui", value: 6 },
  { name: "Wen-Yang", value: 6 },
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

export default async function render() {
  await appendSVG(baseSVG);

  const svg = select("#mainsvg");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 60, right: 30, bottom: 60, left: 150 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xScale = scaleLinear()
    .domain([0, max(data, (d) => d.value as any)])
    .range([0, innerWidth]);
  const yScale = scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, innerHeight])
    .padding(0.1);

  const g = svg
    .append("g")
    .attr("id", "mainGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const yAxis = d3.axisLeft(yScale);
  g.append("g").call(yAxis);
  const xAxis = d3.axisBottom(xScale);
  g.append("g").call(xAxis).attr("transform", `translate(0, ${innerHeight})`);
  data.forEach((d) => {
    g.append("rect")
      .attr("width", xScale(d.value))
      .attr("height", yScale.bandwidth())
      .attr("fill", "green")
      .attr("y", yScale(d.name)!);
  });
  d3.selectAll(".tick text").attr("font-size", "2em");
  g.append("text")
    .text("五香sb")
    .attr("font-size", "3em")
    .attr("transform", `translate(${innerWidth / 2}, 0)`)
    .attr("text-anchor", "middle");
    
}

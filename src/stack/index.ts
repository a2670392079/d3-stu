import { svg_init } from "../path/index";
import * as d3 from "d3";
import dayjs from "dayjs";

const nativeData: Array<any> = [
  {
    month: new Date(2015, 0, 1),
    apples: 3840,
    bananas: 1920,
    cherries: 960,
    dates: 400,
  },
  {
    month: new Date(2015, 1, 1),
    apples: 1600,
    bananas: 1440,
    cherries: 960,
    dates: 400,
  },
  {
    month: new Date(2015, 2, 1),
    apples: 640,
    bananas: 960,
    cherries: 640,
    dates: 400,
  },
  {
    month: new Date(2015, 3, 1),
    apples: 320,
    bananas: 480,
    cherries: 640,
    dates: 400,
  },
];

const nativeKeys = ["apples", "bananas", "cherries", "dates"];

const fruitStack = d3.stack().keys(nativeKeys).order(d3.stackOrderAscending)(
  nativeData
);

console.log(fruitStack);

export default async function render() {
  const context = await svg_init();
  const xValue = (d: { month: Date }) =>
    dayjs(d.month.toISOString()).format("YYYY-M-D");

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(fruitStack, (d) => d3.max(d, (subd) => subd[1])) as any])
    .range([context.innerHeight, 0])
    .nice();

  const g = context.svg
    .append("g")
    .attr(
      "transform",
      `translate(${context.margin.left}, ${context.margin.top})`
    )
    .attr("id", "maingroup");

  const xScale = d3
    .scaleBand()
    .domain(nativeData.map((d) => xValue(d)))
    .range([0, context.innerWidth])
    .padding(0.5)
    ;

  const xAxis = d3.axisBottom(xScale).tickSize(-context.innerHeight);

  const xAxisGroup = g
    .append("g")
    .attr("id", "xaxis")
    .call(xAxis)
    .attr("transform", `translate(0, ${context.innerHeight})`);
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat(d3.format(".1s"))
    .tickSize(-context.innerWidth);
  const yAxisGroup = g.append("g").attr("id", "yaxis").call(yAxis);

  const color = d3.scaleOrdinal().domain(nativeKeys).range(d3.schemeSet2);

  g.selectAll(".fruit")
    .data(fruitStack)
    .enter()
    .append("g")
    .attr("class", "fruit")
    .attr("fill", (d) => color(d.key) as any)
    .selectAll(".datarect")
    .data((d) => d)
    .join("rect")
    .attr("class", "datarect")
    .attr("x", (d) => {
      console.log(d);
      return xScale(xValue(d.data as any)) as any;
    })
    .attr("y", (d) => yScale(d[1]))
    .attr("width", (d) => xScale.bandwidth())
    .attr("height", (d) => yScale(d[0]) - yScale(d[1]));
}

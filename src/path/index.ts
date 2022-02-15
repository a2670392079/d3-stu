import province from "../../static/provine.csv";
import * as d3 from "d3";
import appendSVG from "../utils/appendSVG";
import baseSVG from "../../static/asset/base.svg";
import { Selection } from "d3";

interface ProviceData {
  日期: Date;
  [key: string]: string | number | Date;
}

const xValue = (datum: ProviceData) => datum["日期"];
const yValue = (datum: ProviceData) => datum["现有确诊"] as number;

export const svg_init = async () => {
  await appendSVG(baseSVG);
  const svg = d3.select("#mainsvg");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 100, right: 120, bottom: 100, left: 120 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  return {
    svg,
    width,
    height,
    margin,
    innerWidth,
    innerHeight,
  };
};

type Context = {
  svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  innerWidth: number;
  innerHeight: number;
  alldates: Array<Date>;
};

const render_init = (
  data: Array<ProviceData>,
  { innerHeight, innerWidth, alldates, svg, margin }: Context
) => {
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xValue) as any)
    .range([0, innerWidth])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain([d3.max(data, yValue), d3.min(data, yValue)] as any)
    .range([0, innerHeight])
    .nice();
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("id", "maingroup");
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(Math.floor(alldates.length) / 4)
    //.tickFormat(d3.timeFormat('%b-%d'))
    .tickSize(-innerHeight);
  const xAxisGroup = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${innerHeight})`);

  const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
  const yAxisGroup = g.append("g").call(yAxis);

  g.selectAll(".tick text").attr("font-size", "2em");
  g.append("path").attr("id", "alterPath");
  return {
    g,
    xAxis,
    xAxisGroup,
    yAxis,
    yAxisGroup,
    xScale,
    yScale,
  };
};

async function render() {
  const context = await svg_init();
  let res = await d3.csv(province);
  let data = res.filter((datum) => {
    return datum["省份"] !== "总计";
  });
  data = data.filter((datum) => {
    return datum["省份"] !== "湖北";
  });
  let alldates = Array.from(new Set(data.map((d:any) => xValue(d))));
  data.forEach((datum:any) => {
    datum["现有确诊"] = +datum["现有确诊"];
    datum["日期"] = new Date(datum["日期"]);
  });
  let provinces:any = {};
  let allkeys = Array.from(new Set(data.map((d) => d["省份"]!)));
  allkeys.forEach((key) => {
    provinces[key] = [];
  });
  data.forEach((d:any) => {
    provinces[d["省份"]].push(d);
  });
  allkeys.forEach((key) =>
    provinces[key].sort(function (a:any, b:any) {
      return +new Date(b["日期"]) - +new Date(a["日期"]);
    })
  );
  const renderContext = render_init(data as any, {...context, alldates});
  
}

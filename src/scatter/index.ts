import * as d3 from "d3";
import hubeinxt from "../../static/data/hubeinxt.csv";
import appendSVG from "../utils/appendSVG";
import baseSVG from "../../static/asset/base.svg";

export default async function () {
  await appendSVG(baseSVG);

  let xValue = (d: any) => Math.log(d["确诊人数"] + 1) as any;
  let yValue = (d: any) => Math.log(d["新增确诊"] + 1) as any;

  const color = {
    武汉: "#ff1c12",
    黄石: "#de5991",
    十堰: "#759AA0",
    荆州: "#E69D87",
    宜昌: "#be3259",
    襄阳: "#EA7E53",
    鄂州: "#EEDD78",
    荆门: "#9359b1",
    孝感: "#47c0d4",
    黄冈: "#F49F42",
    咸宁: "#AA312C",
    恩施州: "#B35E45",
    随州: "#4B8E6F",
    仙桃: "#ff8603",
    天门: "#ffde1d",
    潜江: "#1e9d95",
    神农架: "#7289AB",
  };
  let xScale: any, yScale: any;
  const svg = d3.select("#mainsvg");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 100, right: 120, bottom: 100, left: 120 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xAxisLabel = "累计确诊人数（对数）";
  const yAxisLabel = "新增人数（对数）";
  const renderinit = function (data: Array<any>) {
    // Linear Scale: Data Space -> Screen Space;
    xScale = d3
      .scaleLinear()
      .domain([d3.min(data, xValue), d3.max(data, xValue)]) // "extent" is equivalent to ;
      .range([0, innerWidth])
      .nice();

    // Introducing y-Scale;
    yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, yValue).reverse()) // remember to use reverse() to make y-axis start from the bottom;
      .range([0, innerHeight])
      .nice();

    // The reason of using group is that nothing is rendered outside svg, so margin of svg is always blank while margin of group is rendered inside svg;
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("id", "maingroup");

    // Adding axes;
    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(-innerWidth)
      //.tickFormat(d3.format('.2s'))
      .tickPadding(10); // .tickPadding is used to prevend intersection of ticks;
    const xAxis = d3
      .axisBottom(xScale)
      //.tickFormat(d3.format('.2s'))
      .tickSize(-innerHeight)
      .tickPadding(10);

    let yAxisGroup = g.append("g").call(yAxis).attr("id", "yaxis");
    yAxisGroup
      .append("text")
      .attr("font-size", "2em")
      .attr("transform", `rotate(-90)`)
      .attr("x", -innerHeight / 2)
      .attr("y", -60)
      .attr("fill", "#333333")
      .text(yAxisLabel)
      .attr("text-anchor", "middle"); // Make label at the middle of axis.
    yAxisGroup.selectAll(".domain").remove(); // we can select multiple tags using comma to seperate them and we can use space to signify nesting;

    let xAxisGroup = g
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(${0}, ${innerHeight})`)
      .attr("id", "xaxis");
    xAxisGroup
      .append("text")
      .attr("font-size", "2em")
      .attr("y", 60)
      .attr("x", innerWidth / 2)
      .attr("fill", "#333333")
      .text(xAxisLabel);
    xAxisGroup.selectAll(".domain").remove();
  };

  const data = (await d3.csv(hubeinxt)).filter((d) => d["地区"] !== "总计");
  let allDates: Array<string> = [];
  let sequantial: any[][] = [];
  data.forEach((d: any) => {
    d["确诊人数"] = +d["确诊人数"];
    d["新增确诊"] = +d["新增确诊"];
    if (d["新增确诊"] < 0) {
      d["新增确诊"] = 0;
    }
  });
  allDates = Array.from(new Set(data.map((d) => d["日期"]!))).sort((a, b) => {
    return +new Date(a) - +new Date(b);
  });

  allDates.forEach((d) => {
    sequantial.push([]);
  });
  data.forEach((d) => {
    sequantial[allDates.indexOf(d["日期"]!)].push(d);
  });
  renderinit(data);
  const update = (seq: Array<any>) => {
    const g = d3.select("#maingroup");
    if (!seq) {
      return;
    }

    //     const circleupdates = g
    //     .selectAll("circle")
    //     .data(seq, (d: any) => d["地区"]!);
    //   const circleenter = circleupdates
    //     .enter()
    //     .append("circle")
    //     .attr("cx", (d) => xScale(xValue(d)))
    //     .attr("cy", (d) => yScale(yValue(d)))
    //     .attr("r", 10)
    //     .attr("fill", (d) => (color as any)[d["地区"]])
    //     .attr("opacity", 0.8);
    //   circleupdates
    //     .merge(circleenter as any)
    //     .transition()
    //     .ease(d3.easeLinear)
    //     .duration(2000)
    //     .attr("cx", (d) => xScale(xValue(d)))
    //     .attr("cy", (d) => yScale(yValue(d)));

    const circleupdates = g
      .selectAll("circle")
      .data(seq, (d: any) => d["地区"]!);
    const circleenter = circleupdates
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(xValue(d)))
      .attr("cy", (d) => yScale(yValue(d)))
      .attr("r", 10)
      .attr("fill", (d) => (color as any)[d["地区"]])
      .attr("opacity", 0.8);
    circleupdates
      .merge(circleenter as any)
      .transition()
      .ease(d3.easeLinear)
      .duration(2000)
      .attr("cx", (d) => xScale(xValue(d)))
      .attr("cy", (d) => yScale(yValue(d)));
  };
  let c = 0;
  let intervalId = setInterval(() => {
    if (c >= allDates.length) {
      clearInterval(intervalId);
    } else {
      update(sequantial[c]);
      c += 1;
    }
  }, 2000);
}

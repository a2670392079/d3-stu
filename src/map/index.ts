import data from "../../static/data/countries-110m.json";
import * as d3 from "d3";
import { svg_init } from "../path/index";
import * as topojson from "topojson-client";
import tip from "d3-tip";

export default async function render() {
  const context = await svg_init();
  const wordData: any = topojson.feature(
    <any>data,
    <any>data.objects.countries
  );
  const projection = d3.geoNaturalEarth1();
  projection.fitSize([context.innerWidth, context.innerHeight], wordData);
  const geo: any = d3.geoPath().projection(projection);
  const g = context.svg.append("g").attr("id", "mainGroup");
  console.log(tip);
  const mapTip = (tip as any)().html(function (d: any) {
    return d.properties.name;
  });
  context.svg.call(mapTip);
  let lastid: any = undefined;
  g.selectAll("path")
    .data(wordData.features, (d: any) => d.properties.name)
    .join("path")
    .attr("d", geo)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .on("mouseover", function (d) {
      console.log(d);
      d3.select(this)
        .attr("opacity", 0.5)
        .attr("stroke", "white")
        .attr("strok-width", 5);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .attr("opacity", 1)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    })
    .on("contextmenu", function (d) {
      d.preventDefault();
      console.log(d);
      if (lastid !== d.properties.name) {
        mapTip.show(d);
        lastid = d.properties.name;
      } else {
        mapTip.hide(d);
      }
    });
}

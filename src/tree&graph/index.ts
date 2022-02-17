import * as d3 from "d3";
import { svg_init } from "../path/index";
import games from "../../static/data/games.json";

export default async function () {
  const context = await svg_init();
  const root = d3.hierarchy(games);
  d3.tree().size([context.innerHeight, context.innerWidth])(root);
  console.log(root);
  d3.linkHorizontal();

  const g = context.svg
    .append("g")
    .attr(
      "transform",
      `translate(${context.margin.left}, ${context.margin.top})`
    );
  g.selectAll("path")
    // 点的连接关系
    .data(root.links())
    .enter()
    .append("path")
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("stroke-width", 1)
    .attr(
      "d",
      d3
        // 水平连接线
        .linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x) as any
    );

  const color = d3
    .scaleOrdinal()
    .domain(
      root
        .descendants()
        .filter((d) => d.depth <= 1)
        .map((d) => d.data.name)
    )
    .range(d3.schemeCategory10);

  const fill = (d: any) => {
    if (d.depth === 0) return color(d.data.name);
    while (d.depth > 1) d = d.parent;
    return color(d.data.name);
  };
  g.selectAll("circle")
    // 压平数据
    .data(root.descendants())
    .join("circle")
    // .attr("stroke-width", 6)
    .attr("cx", (d: any) => d.y)
    .attr("cy", (d: any) => d.x)
    .attr("r", 2)
    .attr("fill", fill as any);

  g.selectAll(".tip")
    .data(root.descendants())
    .join("text")
    .attr("class", "tip")
    .attr("text-anchor", (d) => (d.children ? "end" : "start"))
    .attr("x", (d: any) => d.y)
    .attr("y", (d: any) => d.x)
    .text((d) => d.data.name);
}

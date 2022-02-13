import { svg } from "d3";

export default async function (url: string) {
  const ele = await svg(url);
  document.body.appendChild(ele.documentElement);
  return ele;
}

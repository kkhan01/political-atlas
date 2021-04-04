import React, { useEffect, useRef } from "react";

import * as d3 from "d3";

import "./BarChart.css";

import { sortedEmotions } from "src/utils/emotions";

const BarChart = ({ data }) => {
  const ref = useRef();
  // HACK: makes hover work on chart, isn't really proper in react nor html
  const chartDivRef = useRef();

  useEffect(() => {
    // TODO: move this outside and hook it into the screen size
    const margin = { top: 20, right: 20, bottom: 70, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // HACK: makes hover work on chart, isn't really proper in react nor html
    const div = d3.select(chartDivRef.current);
    div.attr("class", "tooltip").style("opacity", 0);

    const svgElement = d3.select(ref.current);

    // make svg element with the width and height and make it sensible
    svgElement
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // make axes proper length with labels
    const x = d3
      .scaleBand()
      .domain(sortedEmotions)
      .range([0, width])
      .round(0.05)
      .padding(0.05);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, ({ value }) => value) + 10])
      .range([height, 0]);

    // make axes into scales that can be plotted
    const xAxis = d3.axisBottom().scale(x);
    const yAxis = d3.axisLeft().scale(y);

    // add axes to the graph
    svgElement
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(${margin.left}, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "center");

    svgElement
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .attr("transform", `translate(${margin.left}, 0)`)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

    // make bar chart based on values
    svgElement
      .selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", "steelblue")
      .attr("x", ({ emotion }) => x(emotion))
      .attr("width", x.bandwidth())
      .attr("y", ({ value }) => y(value))
      .attr("height", ({ value }) => height - y(value))
      .attr("transform", `translate(${margin.left}, 0)`)
      // HACK: this is all a bad hack, we need to refactor this later
      .on("mouseover", (event, { emotion, value }) => {
        div.transition().duration(200).style("opacity", 0.9);
        div
          .html(
            "<b>" +
              "Emotion: " +
              "</b>" +
              emotion +
              "<br>" +
              "<b>" +
              "Occurences: " +
              "</b>" +
              value
          )
          .style("left", event.pageX + 30 + "px")
          .style("top", event.pageY - 30 + "px");
      })
      .on("mousemove", (event) => {
        div
          .style("left", event.pageX + 30 + "px")
          .style("top", event.pageY - 30 + "px");
      })
      .on("mouseout", (d) => {
        div.transition().duration(500).style("opacity", 0);
      });
  }, [data]);
  return (
    <>
      <div ref={chartDivRef} />
      <svg ref={ref} />
    </>
  );
};

export default BarChart;

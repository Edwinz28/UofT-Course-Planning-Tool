import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import * as d3 from "d3"
import { data, course_graph_data } from "./graph_data.js"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
//
// Disclaimer: Function ForceGraph() is copied and modified under ISC license
// ISC License
//
// Copyright (c) [year] [fullname]
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.
function ForceGraph({
  nodes, // an iterable of node objects (typically [{id}, …])
  links // an iterable of link objects (typically [{source, target}, …])
}, {
  nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
  nodeGroup, // given d in nodes, returns an (ordinal) value for color
  nodeGroups, // an array of ordinal values representing the node groups
  nodeTitle, // given d in nodes, a title string
  nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
  nodeStroke = "#fff", // node stroke color
  nodeStrokeWidth = 1.5, // node stroke width, in pixels
  nodeStrokeOpacity = 1, // node stroke opacity
  nodeRadius = 5, // node radius, in pixels
  nodeStrength,
  linkSource = ({ source }) => source, // given d in links, returns a node identifier string
  linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
  linkStroke = "#999", // link stroke color
  linkStrokeOpacity = 0.6, // link stroke opacity
  linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
  linkStrokeLinecap = "round", // link stroke linecap
  linkStrength,
  colors = d3.schemeTableau10, // an array of color strings, for the node groups
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  invalidation // when this promise resolves, stop the simulation
} = {}) {
  // Compute values.
  const N = d3.map(nodes, nodeId).map(intern);
  const LS = d3.map(links, linkSource).map(intern);
  const LT = d3.map(links, linkTarget).map(intern);
  if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
  const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
  const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
  const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
  links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

  // Compute default domains.
  if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

  // Construct the forces.
  const forceNode = d3.forceManyBody(); // + = attraction - = repulsion
  const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]); // .id() function let you use different field in node dict for linking
  if (nodeStrength !== undefined) forceNode.strength(nodeStrength); // Define the repelling force
  if (linkStrength !== undefined) forceLink.strength(linkStrength); // Define the centre force

  const simulation = d3.forceSimulation(nodes)
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("center", d3.forceCenter().strength(1))
    .force("collide", d3.forceCollide(nodeRadius))
    .on("tick", ticked);

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const link = svg.append("g")
    .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
    .attr("stroke-opacity", linkStrokeOpacity)
    .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
    .attr("stroke-linecap", linkStrokeLinecap)
    .selectAll("line")
    .data(links)
    .join("line");

  const node = svg.append("g")
    .attr("fill", nodeFill)
    .attr("stroke", nodeStroke)
    .attr("stroke-opacity", nodeStrokeOpacity)
    .attr("stroke-width", nodeStrokeWidth)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", nodeRadius)
    .call(drag(simulation))
    .on("mouseenter", (evt, d) => { // callback function to highlight links and nodes on mouse over
      node
        .filter(n => n.id === d.id)
        .attr("fill", "#f02b2b")
        .attr("r", nodeRadius * 2);

      link
        .filter(l => l.source.id === d.id || l.target.id === d.id)
        .attr("stroke", "#f02b2b")
        .attr("stroke-opacity", 1.0)
        .attr("stroke-width", 3);
    })
    .on("mouseleave", evt => { // callback function to reset links and nodes on mouse remove
      node
        .attr("r", nodeRadius);

      if (G) node.attr("fill", ({ index: i }) => color(G[i]));

      link.attr("display", "block")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null);
    });

  if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
  if (L) link.attr("stroke", ({ index: i }) => L[i]);
  if (G) node.attr("fill", ({ index: i }) => color(G[i]));
  if (T) node.append("title").text(({ index: i }) => T[i]);
  if (invalidation != null) invalidation.then(() => simulation.stop());

  function intern(value) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
  }

  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(1).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  return Object.assign(svg.node(), { scales: { color } });
}

function CourseGraph() {

  // chart is a SVGSVGElement
  var chart = ForceGraph(course_graph_data, {
    nodeId: d => d.id,
    nodeGroup: d => d.group,
    nodeTitle: d => `${d.id}\n${d.group}`,
    linkStrokeWidth: l => Math.sqrt(l.value),
    nodeTitle: d => `Course: ${d.id} - ${d.course_name}\nDepartment: ${d.department}`,
    nodeStrength: -4,
    linkStrength: 0.1,
    width: 1400,
    height: 1200,
  })

  const svg = useRef(null)
  useEffect(() => {
    if (svg.current) {
      svg.current.appendChild(chart)
    }
  }, [])

  return (
    <div className="page-content">
      <Container className="course-template" fluid="sm">
        <Row className='pt-3'>
          <h1>Course Graph</h1>
          <p>Relationships between courses in Faculty of Applied Science & Engineering.</p>
          <p>This is an interactive graph! Try  dragging, clicking and scrolling!</p>
        </Row>
        <Row>
          <Col>
            <TransformWrapper>
              <TransformComponent>
                <div ref={svg}></div>
              </TransformComponent>
            </TransformWrapper>
          </Col>
        </Row>
      </Container>
    </div>
  )

}

export default CourseGraph;

// Based on http://bl.ocks.org/mbostock/4062045

var margin = {top: -5, right: -5, bottom: -5, left: -5};
var width = 960;
var height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-200)
    .linkDistance(80)
    .size([width + margin.left + margin.right, height + margin.top + margin.bottom]);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

d3.select("#maindiv${divnum}").selectAll("svg").remove();

var svg = d3.select("#maindiv${divnum}")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .call(zoom);


var graph = $data ;
// transform the data to a D3 compliant format
 var edges = [];

  graph.edges.forEach(function(e) { 
    // Get the source and target nodes
  var sourceNode = graph.nodes.filter(function(n) { return n.id === e.sub; })[0],
        targetNode = graph.nodes.filter(function(n) { return n.id === e.obj; })[0],
        pred = e.pred;


    // Add the edge to the array
    edges.push({source: sourceNode, target: targetNode, pred: pred});
  }); 

//avoid overlap
  var linkNodes = edges;

  force
      .nodes(graph.nodes.concat(linkNodes))
      .links(edges)
      .start();

  // force
  //     .nodes(graph.nodes)
  //     .links(edges)
  //     .start();

  var link = svg.append("g")
      .attr("class", "links")
      .selectAll(".link")
      .data(edges)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", "2")
      .style("stroke", function(d) { 
        if(d.pred == "is_a")
          return "red"; 
              
      });

  var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(graph.nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .call(drag);

  node.append("circle")
      .attr("r", function(d) { return 2 + 12; })
      .style("fill", function(d) { 
          if(d.id.indexOf("TO:")==0)
            return "#00c2e0";   
          if(d.id.indexOf("PATO:")==0)
            return "#70b500";
          if(d.id.indexOf("PO:")==0)
            return "#ff9f1a";
          if(d.id.indexOf("EO:")==0)
            return "#eb5a46";
          if(d.id.indexOf("GO:")==0)
            return "#f2d600";  
          if(d.id.indexOf("CO_")==0)
            return "#c377e0";  
       });

  // var node = svg.append("g")
  //     .attr("class", "nodes")
  //     .selectAll(".node")
  //     .data(graph.nodes)
  //     .enter().append("g")
  //     .attr("class", "node")
  //     .attr("x", function(d) { return d.x; })
  //     .attr("y", function(d) { return d.y; })
  //     .call(drag);

  // node.append("rect")
  //     //.attr("r", function(d) { return 2 + 12; })
  //     .attr("width", 80)
  //     .attr("height", 40)
  //     .style("stroke", function(d) { 
  //         if(d.id.indexOf("TO:")==0)
  //           return "#00c2e0";   
  //         if(d.id.indexOf("PATO:")==0)
  //           return "#70b500";
  //         if(d.id.indexOf("PO:")==0)
  //           return "#ff9f1a";
  //         if(d.id.indexOf("EO:")==0)
  //           return "#eb5a46";
  //         if(d.id.indexOf("GO:")==0)
  //           return "#f2d600";  
  //         if(d.id.indexOf("CO_")==0)
  //           return "#c377e0";  
  //      });

  node.append("title")
      .text(function(d) { return d.lbl; });


  var label = svg.selectAll(".mytext")
                    .data(graph.nodes)
                    .enter()
                    .append("text")
                    .text(function (d) { return d.lbl; })
                    .style("text-anchor", "middle")
                    .style("fill", "#555")
                    .style("font-family", "Arial")
                    .style("font-size", 12);

   var linkNode = svg.selectAll(".link-node")
      .data(linkNodes)
    .enter().append("circle")
      .attr("class", "link-node")
      .attr("r", 2)
      .style("fill", "#ccc");

  force.on("tick", tick);


  function tick() {

      link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      label.attr("x", function(d){ return d.x; })
             .attr("y", function (d) {return d.y - 10; });

       linkNode.attr("cx", function(d) { return d.x = (d.source.x + d.target.x) * 0.5; })
        .attr("cy", function(d) { return d.y = (d.source.y + d.target.y) * 0.5; });
    }

  function zoomed() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    
    d3.select(this).classed("dragging", true);
    force.start();
  }

  function dragged(d) {
    
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    
  }

  function dragended(d) {
    
    d3.select(this).classed("dragging", false);
  }
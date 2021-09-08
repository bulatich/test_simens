

import { makeStyles } from '@material-ui/core/styles';
import GraphDataContainer from './components/GraphDataContainer';
import React from 'react';
import MyContext from './components/MyContext';
import * as d3 from 'd3'

// CSS IN JS OR CSS MODULES BETTER, but делал наколенке
const mainContainer = { display: 'flex', justifyContent: 'flex-end' }
const graphContainer = { height: '90vh', width: '100%' }


function App() {

  const [data, setData] = React.useState([])

  const isInitialMount = React.useRef(true);

  const [isVisibleGraph, setIsVisibleGraph] = React.useState(true)
  const [isVisibleDataMenu, setIsVisibleDataMenu] = React.useState(true)

  const toggleSetIsVisibleGraph = () => setIsVisibleGraph(!isVisibleGraph)

  const toggleSetIsVisibleDataMenu = () => setIsVisibleDataMenu(!isVisibleDataMenu)

  React.useEffect(() => {
    const dataList = localStorage.getItem('dataList')
    if (dataList && Array.isArray(dataList) && dataList.length) {
      setData(JSON.parse(dataList))
    }
  }, [])

  React.useEffect(() => {

    if (isVisibleGraph) {
      d3.selectAll("#main-graph-container svg path").remove();
      const points = data.map((it, idx) => {
        return { x: idx, y: Number(it.value) }
      })


      // set the dimensions and margins of the graph
      const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = document.querySelectorAll("#main-graph-container")[0].offsetWidth - margin.left - margin.right,
        height = document.querySelectorAll("#main-graph-container")[0].offsetHeight - margin.top - margin.bottom;

      // append the svg object to the body of the page
      const svg = d3.select("#main-graph-container svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      const g = svg.append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      const x = d3.scaleLinear().rangeRound([0, width]);

      const y = d3.scaleLinear().rangeRound([height, 0]);

      const line = d3.line().x(function (d) { return x(d.x) }).y(function (d) { return y(d.y) })
      x.domain([0, 10])
      y.domain([0, 10])

      g.append("g").attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove()

      g.append('g').call(d3.axisLeft(y)).append('text').attr('fill', '#000').attr('transform', 'rotate(-90)').attr('y', 6)
        .attr('dy', "0.71em").attr('text-anchor', 'end').text('Y')

      g.append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.5)
        .attr('d', line)
    }

  }, [data, isVisibleGraph])

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
    else {
      if (!isVisibleDataMenu) {
        // d3.select("#main-graph-container svg g g:nth-child(1)").remove()
      }
      else {

      }
    }
  }, [isVisibleDataMenu])


  const setGraphData = newData => {
    setData(newData)
  }

  return (
    <MyContext.Provider value={{
      setGraphData
    }}>
      <div>
        <button onClick={toggleSetIsVisibleGraph}>toggle graph</button>
        <button onClick={toggleSetIsVisibleDataMenu}>toggle data menu</button>
        <div id="mainContainer" style={mainContainer}>
          {isVisibleGraph && (<div style={graphContainer} id="main-graph-container">
            <svg></svg>
          </div>)}
          {isVisibleDataMenu && <GraphDataContainer />}
        </div>
      </div>
    </MyContext.Provider >
  );
}

export default App;

import React, { Component } from 'react';
import ScatterPlot from '../Components/Graphs/ScatterPlot/ScatterPlot';
import LineGraph from '../Components/Graphs/LineGraph/LineGraph';
import axios from 'axios'
import {MenuItem, TextField, Button} from '@material-ui/core'
import './visualizations.css' 
class Visualizations extends Component {

  constructor(props){
    super(props);
    // console.log(props.graphs);
    // this.graphs = props.graphs;
    this.file = props.file
    this.setGraphs = props.setGraphs;
    this.data = props.data
    this.key = 0;
    this.state = {
      xColumn: '',
      yColumn: '',
      graphType: '',
      columns: [],
      data: [],
      xData: [],
      yData: [],
      graphs: [],
    }
  }
  
  

  componentDidMount(){
    axios.post('http://localhost:5000/getColumns', {file: this.file}).then((res) => {
      this.setState({
        columns: res.data
      })
    }).catch((error) => {
      console.log(error.response)
    })
  }

  xAxisHandler = (e) => {
    this.setState({
      xColumn: e.target.value
    })
  }

  yAxisHandler = (e) => {
    this.setState({
      yColumn: e.target.value
    })
  }  

  graphTypeHandler = (e) =>{ 
    this.setState({
      graphType: e.target.value
    })
  }

  scatterPlotHandler = async(columnX, columnY) => {
    var data = [];
    await axios.post('http://localhost:5000/getScatterGraphData', {file: this.file,columnX: columnX, columnY: columnY })
      .then((res) => {
        const graph = {data: res.data, xAxis: columnX, yAxis: columnY, type: 'scatter', key: this.key}
        this.key += 1
        this.setGraphs(currGraphs => [...currGraphs, graph]);
      }).catch((error) => {
        console.log(error.response);
    })
    return data;
  }

  lineGraphHandler = async(columnX, columnY) => {
    var data = [];
    await axios.post('http://localhost:5000/getLineGraphData', {file: this.file,columnX: columnX, columnY: columnY })
      .then((res) => {
        const graph = {data: res.data, xAxis: columnX, yAxis: columnY, type: 'line', key: this.key}
        this.key += 1
        console.log(graph)
        this.setGraphs(currGraphs => [...currGraphs, graph]);
      }).catch((error) => {
        console.log(error.response);
    })
    return data;
  }

  addGraph = () => {
    if(this.state.graphType == 'scatter'){
      this.scatterPlotHandler(this.state.xColumn, this.state.yColumn)
    }else{
      this.lineGraphHandler(this.state.xColumn, this.state.yColumn)
    }
    // const graph = {data: data, xAxis: this.state.xColumn, yAxis:this.state.yColumn, type: this.state.graphType, key: this.key}
    // this.key += 1
    // this.setGraphs(currGraphs => [...currGraphs, graph]);
    // this.scatterPlotHandler.then((res) => {
    //   // console.log(this.state.xData)
    //   this.state.xData.forEach((x, index) => {
    //     graphData.push({'x':x, 'y': this.state.yData[index]})
    //   });
    //   // let graphs = [...this.graphs];
    //   let graph = {
    //     data: graphData,
    //     xAxis: this.state.xColumn,
    //     yAxis: this.state.yColumn,
    //     type: this.state.graphType,
    //     key: this.key
    //   }
    //   // graphs.push(graph);
    //   this.key += 1
    //   this.setGraphs(currGraphs => [...currGraphs, graph]);
    //   // console.log(this.graphs);
    // })
  }
  
  render() {
    return (
      <React.Fragment>
    
        <div class= 'graph-create'>
          <TextField className = 'select-column' label = 'X Column' id="select" select onChange = {this.xAxisHandler}>
            {this.state.columns.map((column,index) => {
                return <MenuItem key = {index} value = {column}>{column}</MenuItem>
              })}
          </TextField>

          <TextField className = 'select-column' label = 'Y-Axis' id="select" select onChange = {this.yAxisHandler}>
            {this.state.columns.map((column,index) => {
                return <MenuItem key = {index} value = {column}>{column}</MenuItem>
              })}
          </TextField>

          <TextField className = 'select-column' label = 'Type' id="select" select onChange = {this.graphTypeHandler}>
              <MenuItem value = 'scatter'>Scatter Plot</MenuItem>
              <MenuItem value = 'line'>Line Graph</MenuItem>

          </TextField>
          
          <Button className = 'add-graph' onClick = {this.addGraph}>Add Graph</Button>
        </div>
        {/* <div className = 'draggable-boundary'>
          {this.graphs.map((graph) => {
            return (graph.type === 'scatter') ? 
              <ScatterPlot key = {graph.key} data = {graph.data} yAxis = {graph.yAxis} xAxis = {graph.xAxis} delete = {() => this.deleteHandler(graph.key)}></ScatterPlot> 
              : <LineGraph key = {graph.key} data = {graph.data} yAxis = {graph.yAxis} xAxis = {graph.xAxis} delete = {() => this.deleteHandler(graph.key)}> </LineGraph>
          })}
        </div> */}
      </React.Fragment>
    );
  }
}

export default Visualizations;
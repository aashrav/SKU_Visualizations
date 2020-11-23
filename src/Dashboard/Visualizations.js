import React, { Component } from 'react';
import ScatterPlot from '../Components/Graphs/ScatterPlot/ScatterPlot';
import LineGraph from '../Components/Graphs/LineGraph/LineGraph';
import axios from 'axios'
import {MenuItem, TextField, Button} from '@material-ui/core'
import './visualizations.css' 
class Visualizations extends Component {

  constructor(props){
    super(props);
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
    axios.post('http://localhost:5000/getColumns', {file: '5f76381bf9a15eb5d808783f'}).then((res) => {
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

  graphHandler = async() => {
    await this.getColumnData('5facc0a010060477fe89e713', this.state.xColumn).then((res) => {
      this.setState({
        xData: res
      });
    });
    await this.getColumnData('5facc0a010060477fe89e713', this.state.yColumn).then((res) => {
      this.setState({
        yData: res
      });
    });
  }

  addGraph = () => {
    const graphData = []

    this.graphHandler().then(() => {
      // console.log(this.state.xData)
      this.state.xData.forEach((x, index) => {
        graphData.push({'x':x, 'y': this.state.yData[index]})
      });
      let graphs = [...this.state.graphs];
      let graph = {
        data: graphData,
        xAxis: this.state.xColumn,
        yAxis: this.state.yColumn,
        type: this.state.graphType,
        key: this.key
      }
      graphs.push(graph);
      this.key += 1
      this.setState({
        graphs: graphs
      });
    })
  }

  getColumnData = async(file,columnName) => {
    var data = [];
    await axios.post('http://localhost:5000/getDataFromColumn', {file: file,columnName: columnName }).then((res) => {
      data = res.data;
    }).catch((error) => {
      console.log(error.response);
    })
    return data;
  }

  deleteHandler = (index) =>{ 
    console.log("DELETE")
    var graphs = this.state.graphs.filter((g) => g.key !== index);
    console.log(graphs);
    this.setState({
      graphs
    })
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
        <div className = 'draggable-boundary'>
          {this.state.graphs.map((graph) => {
            return (graph.type === 'scatter') ? 
              <ScatterPlot key = {graph.key} data = {graph.data} yAxis = {graph.yAxis} xAxis = {graph.xAxis} delete = {() => this.deleteHandler(graph.key)}></ScatterPlot> 
              : <LineGraph key = {graph.key} data = {graph.data} yAxis = {graph.yAxis} xAxis = {graph.xAxis} delete = {() => this.deleteHandler(graph.key)}> </LineGraph>
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default Visualizations;
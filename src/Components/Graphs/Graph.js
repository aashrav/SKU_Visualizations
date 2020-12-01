import React, { Component } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ScatterChart, Legend
} from 'recharts';
import Draggable from 'react-draggable';
import FeatherIcon from 'feather-icons-react';
import DraggableContainer from '../DraggableContainer/DraggableContainer';
import './graph.css'

class Graph extends Component {

  constructor(props){
    super(props);
    this.data = props.data;
    this.yAxis = props.yAxis;
    this.xAxis = props.xAxis
  }

  render() {

    return (
      <div className = 'container'>
        <Draggable bounds = 'parent' handle =  '.graph-move'>
          <div className = 'graph-container'>
            {/* <Label>{this.xAxis} vs {this.yAxis}</Label> */}
            <div className = 'graph-body'>
              <p className = 'graph-title'>{this.xAxis} vs {this.yAxis}</p>
              <ResponsiveContainer  width="100%" height="80%">
                {/* <LineChart
                  className = 'graph'
                  data={this.data}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 10,
                  }}  
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  

                  <XAxis
                    dataKey = 'x'
                    interval="preserveStartEnd"
                    // label={{ value: this.xAxis, position: "insideBottom", dy: 15, className: 'hi'}}
                    
                  > 
                  
                  </XAxis>
                  <YAxis allowDecimals 
                    // label={{ value: this.yAxis, position: "left", angle: -90,   dy: -10}}
                    >
                  </YAxis>
                  <Tooltip />
                  <Line type="monotone" dataKey="y" stroke="#82ca9d" activeDot={{ r:11 }} />
                </LineChart>   */}
                <ScatterChart
                  className = 'graph'
                  // data={this.data}
                  // margin={{
                  //   top: 5, right: 30, left: 20, bottom: 10,
                  // }}  
                >
                  <XAxis
                    dataKey = 'x'
                    type = 'number'
                  />
                  <YAxis dataKey = 'y' type = 'number'>
                  <Legend></Legend>
                  </YAxis>
                  <Tooltip />
                  <Tooltip cursor={{ strokeDasharray: '1 1' }} />
                  <Scatter  data={this.data} fill="#8884d8" />

                  {/* <Scatter type="monotone" dataKey="y" stroke="#82ca9d" activeDot={{ r:11 }} /> */}
                </ScatterChart>

              </ResponsiveContainer>
                {/* <FeatherIcon className = 'graph-move' icon = 'move'></FeatherIcon> */}
            </div>


            <div className = 'graph-menu'>
              <button className = 'graph-move'>
                <FeatherIcon  icon = 'move'></FeatherIcon>
              </button>
              <button className = 'graph-trash'  onClick = {this.props.delete}>
                <FeatherIcon  icon = 'trash'></FeatherIcon>
              </button>
            </div>

          </div>
        </Draggable>
      </div>
    );
  }
}

export default Graph;
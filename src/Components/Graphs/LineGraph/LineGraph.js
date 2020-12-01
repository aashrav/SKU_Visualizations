import { Tooltip } from '@material-ui/core';
import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend } from 'recharts';
import FeatherIcon from 'feather-icons-react';
import Draggable from 'react-draggable';
import '../graph.css';
const LineGraph = (props) => {
  return(
    <Draggable bounds = 'parent' handle =  '.graph-move'>
      <div className = 'graph-container'>
        <div className = 'graph-y-container'>
            <p className = 'y-axis'>{props.yAxis}</p>
        </div>
        <div className = 'graph-body'>
          <p className = 'graph-title'>Time Series of {props.yAxis}</p>
          <ResponsiveContainer  width="100%" height="80%">
            <LineChart
              className = 'graph'
              data={props.data}
              margin={{
                top: 5, right: 30, left: 20, bottom: 10,
              }}  
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              

              <XAxis
                dataKey = 'time'
                // label={{ value: props.xAxis, position: "insideBottom", dy: 20}}   
                type = 'number'
                domain = {['dataMin','dataMax']}
              /> 
              

              
              
              <YAxis 
                dataKey = 'y'
                type = 'number'
                // label={{ value: props.yAxis, position: "left", angle: -90,   dy: -10}}
              >
              </YAxis>
              {/* <p>{props.yAxis}</p> */}
              <Tooltip />

              {/* <Tooltip cursor={{ strokeDasharray: '1 1' }} /> */}
              <Line  dataKey="y" stroke="#82ca9d" />
              <Line  dataKey="prediction" stroke="red" />

            </LineChart>  
          
          </ResponsiveContainer>
          <p className = 'x-axis'>{props.xAxis}</p>
        </div>
        <div className = 'graph-menu'>
          <button className = 'graph-move'>
            <FeatherIcon  icon = 'move'></FeatherIcon>
          </button>
          <button className = 'graph-trash'  onClick = {props.delete}>
            <FeatherIcon  icon = 'trash'></FeatherIcon>
          </button>
          <p className = 'graph-actual'>Actual</p>
          <p className = 'graph-prediction'>Prediction</p>
        </div>
      </div>
    </Draggable>
  )
}

export default LineGraph;

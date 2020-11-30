import { Tooltip } from '@material-ui/core';
import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend } from 'recharts';
import FeatherIcon from 'feather-icons-react';
import Draggable from 'react-draggable';
import moment from 'moment';
import '../graph.css';
const LineGraph = (props) => {
  return(
    <Draggable bounds = 'parent' handle =  '.graph-move'>
      <div className = 'graph-container'>
        <div className = 'graph-body'>
          <p className = 'graph-title'></p>
          <ResponsiveContainer  width="100%" height="80%">
            <LineChart
              className = 'graph'
              data={props.data}
              margin={{
                top: 5, right: 30, left: 20, bottom: 10,
              }}  
            >
              <CartesianGrid strokeDasharray="3 3" />
              

              <XAxis
                dataKey = 'time'
                label={{ value: props.xAxis, position: "insideBottom", dy: 10}}   
                type = 'number'
                domain = {['dataMin','dataMax']}
              /> 
              
              
              <YAxis 
                dataKey = 'y'
                type = 'number'
                label={{ value: props.yAxis, position: "left", angle: -90,   dy: -10}}
              >
              </YAxis>
              {/* <Tooltip cursor={{ strokeDasharray: '1 1' }} /> */}

              <Tooltip cursor={{ strokeDasharray: '1 1' }} />
              <Line  dataKey="y" stroke="#82ca9d" />
              <Line  dataKey="prediction" stroke="red" />

            </LineChart>  
          
          </ResponsiveContainer>
        </div>
        <div className = 'graph-menu'>
          <button className = 'graph-move'>
            <FeatherIcon  icon = 'move'></FeatherIcon>
          </button>
          <button className = 'graph-trash'  onClick = {props.delete}>
            <FeatherIcon  icon = 'trash'></FeatherIcon>
          </button>
        </div>
      </div>
    </Draggable>
  )
}

export default LineGraph;

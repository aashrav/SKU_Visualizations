import { Tooltip } from '@material-ui/core';
import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import FeatherIcon from 'feather-icons-react';
import Draggable from 'react-draggable';

import '../graph.css';
const LineGraph = (props) => {
  return(
    <Draggable bounds = 'parent' handle =  '.graph-move'>
      <div className = 'graph-container'>
        <div className = 'graph-body'>
          <p className = 'graph-title'>{props.xAxis} vs {props.yAxis}</p>
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
                dataKey = 'x'
                interval="preserveStartEnd"              
              > 
              
              </XAxis>
              <YAxis>
              </YAxis>
              <Tooltip />
              <Line type="monotone" dataKey="y" stroke="#82ca9d" activeDot={{ r:11 }} />
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

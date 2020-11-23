import React from 'react';
import {
   XAxis, YAxis, Tooltip, ResponsiveContainer, Scatter, ScatterChart, Legend
} from 'recharts';
import FeatherIcon from 'feather-icons-react';
import Draggable from 'react-draggable';

import '../graph.css'

const ScatterPlot = (props) => {
  return (
    <Draggable bounds = 'parent' handle =  '.graph-move' >
      <div className = 'graph-container'>
        <div className = 'graph-body'>
          <p className = 'graph-title'>{props.xAxis} vs {props.yAxis}</p>
          <ResponsiveContainer  width="100%" height="80%">
            <ScatterChart
              className = 'graph'
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
              <Scatter  data={props.data} fill="#8884d8" />

            </ScatterChart>
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
  );
  
}

export default ScatterPlot;
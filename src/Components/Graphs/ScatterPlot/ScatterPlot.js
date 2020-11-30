import React from 'react';
import {
   XAxis, YAxis, Tooltip, ResponsiveContainer, Scatter, ComposedChart, Legend,Line, Text
} from 'recharts';
import FeatherIcon from 'feather-icons-react';
import Draggable from 'react-draggable';

import '../graph.css'

const ScatterPlot = (props) => {
  console.log(props);
  return (
    <Draggable bounds = 'parent' handle =  '.graph-move' >
      <div className = 'graph-container'>
        <div className = 'graph-body'>
          <p className = 'graph-title'>Correlation of {props.yAxis} and {props.xAxis}</p>
          <ResponsiveContainer  width="100%" height="80%">
            <ComposedChart
              className = 'graph'
              data = {props.data}
            >
              <XAxis
                name = {props.xAxis}
                dataKey = 'index'
                interval="preserveStartEnd" 
                type = 'number'
                // label={{ value: props.xAxis, position: "insideBottom", dy: 10}}
              />
              <YAxis 
                // label={<CustomizedLabelB/>}
              >
              </YAxis>
              {/* <Tooltip /> */}
              <Tooltip cursor={{ strokeDasharray: '1 1' }} />
              <Scatter name = 'Actual' dataKey="y" fill="#8884d8" dot={false}/>
              <Line name = 'Prediction' dataKey="predictionY" dot={false} stroke="red" />

            </ComposedChart>
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
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Visualizations from './Visualizations';
import './dashboard.css';
import './visualizations.css' ;
import ScatterPlot from '../Components/Graphs/ScatterPlot/ScatterPlot';
import LineGraph from '../Components/Graphs/LineGraph/LineGraph';
import Table from '../Components/Table/Table';


export default function Dashboard(props) {
  const [value, setValue] = React.useState(0);
  const [graphs, setGraphs] = React.useState([]);
  // const [data, setData] = React.useState([[]]);
  // const [columns, setColumns] = React.useState([]);

  // React.useEffect(() => {
    
  //   axios.post('http://localhost:5000/getDataFromFile', {file: '5f76381bf9a15eb5d808783f'})
  //     .then((res) => {
  //       setData(res.data);
  //     }).catch((error) => {
  //       console.log(error.response);
  //     })
  // },[])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  
  const deleteHandler = (index) =>{ 
    // console.log("DELETE")
    setGraphs((currGraphs) => {
      return currGraphs.filter((g) => g.key !== index);
    });
  }


  return (
    <div className = 'dashboard'>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Table" {...a11yProps(0)} />
          <Tab label="Graphs" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Table file = {props.file}></Table>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Visualizations file = {props.file} setGraphs = {setGraphs}></Visualizations>
        <div className = 'draggable-boundary'>

          {graphs.map((graph) => {
            {return (graph.type === 'scatter') ? 
              <ScatterPlot key = {graph.key} data = {graph.data} yAxis = {graph.yAxis} xAxis = {graph.xAxis} delete = {() => deleteHandler(graph.key)}></ScatterPlot> 
              : <LineGraph key = {graph.key} data = {graph.data} yAxis = {graph.yAxis} xAxis = {graph.xAxis} delete = {() => deleteHandler(graph.key)}> </LineGraph>}
          })}
        </div> 

      </TabPanel>
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, file,...other } = props;

  return (
    <React.Fragment
      // rol="tabpanel"
      // hidden={value !== index}
      // id={`simple-tabpanel-${index}`}
      // aria-labelledby={`simple-tab-${index}`}
      // {...other}
    >
      {value === index && (
          children
      )}
    </React.Fragment>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


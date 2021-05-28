import React, { useState,useEffect,Component } from 'react';
import './App.css';
import socket from './Utilities/SocketConnection';
import Widget from './Components/Widget';

class App extends Component {
  constructor(){
    super();
    this.state = {
      performanceData: {}
    }
  }

  componentDidMount(){
    socket.on('data',(data)=>{
      // inside this callback, we just got some new data!
      // let's update state so we can 
      // re-render App --> Widget --> CPU/Mem/Info
      // we need to make a copy of current state
      // so we can mutate it!
      console.log(this.state.performanceData);
      const currentState = ({...this.state.performanceData});
      // const currentState = Object.assign(this.state.performanceData,{})
      // currentState is an object! Not an array!
      // the reason for this is so we can use the machine's
      // MacA as it's property
      currentState[data.macA] = data;     
      this.setState({
        performanceData: currentState
      })
    })
  }

  render() {
    console.log(this.state.performanceData);
    let widgets = [];
    const data = this.state.performanceData;
    // grab each machine, by property, from data
    Object.entries(data).forEach(([key,value])=>{
      widgets.push(<Widget key={key} data={value} />)
    })
    return (
      <div className="App">
        {widgets}
      </div>
    );
  }
}

export default App;

/*

const App = () => {

  const [ performanceData, setPerformanceData ] = useState({});
  

  socket.on('data',(data)=>{
    console.log(data);
    setPerformanceData((prePerformanceData)=>{
      const curPerformanceData=({...prePerformanceData});
      curPerformanceData[data.macA]=data;
      return curPerformanceData;
    }
    );
  });

    let widgets = [];
    const data = performanceData;
    //console.log(data);
    // grab each machine, by property, from data
    Object.entries(data).forEach(([key,value])=>{
      widgets.push(<Widget key={key} data={value} />)
    })
    return (
      <div className="App">
        {widgets}
      </div>
    );

}


export default App;

*/




import './App.css'
import Noy from './noy';
import "tailwindcss";
import Axios from 'axios';
import { useEffect, useState } from 'react';


function App() {
  const[time,settime]=useState("")
  const[name,setname]=useState("")
  const[Humidity,setHumidity]=useState("")
  useEffect(() => {
    Axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
      lon:3.04,
      lat:36.75,
      appid:"776e244108058bf5ec9fdc01f00b418b"
      },
    },[])
.then((response) => {
  const dta=Math.round(response.data.main.temp - 272.15) + "°C"
  const nam=response.data.name
  const Humidity=response.data.main.humidity
  settime(dta)
  setname(nam)
  setHumidity(Humidity)
  console.log(response.data.name);
  ;
}).catch((error)=>{
  console.log(error);
})
  })

  return (
    <div className="App">
 
    <Noy time ={time} name={name} humidity={Humidity}/>

      
    </div>
  )
}

export default App;


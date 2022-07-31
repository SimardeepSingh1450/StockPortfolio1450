import {motion} from "framer-motion";
import { useState } from 'react';
import moment from 'moment';

import './App.css';
import Axios from 'axios';
function App() {
  const [stockname,setStockName]=useState();
  const [stocksList,setStocksList]=useState([]);
  const [quantity,setQuantity]=useState([]);
  const [mystockslist,setMyStocksList]=useState([]);
  const [currentprice,setCurrentPrice]=useState(0);
  const [totalSum,setTotalSum]=useState(0);
  const [totalportfoliovar,setTotalPortfolioVar]=useState(0);

  const GetStocksfn=()=>{
    Axios.get('https://stockportfolio1450.herokuapp.com/getallstocks').then((response)=>{
      console.log(`Fetched stock is :`,response.data.data);
      setStocksList(response.data.data);
    })
  }

  const AddStocktoList=async()=>{
    //Stock Price addition:
  let date=new Date();
  date.setDate(date.getDate());

  // const todaydate=JSON.stringify(date.slice(1,11));

    //Skipping Non Buisness Days:
    if(moment(date).day()===0){
      date.setDate(date.getDate()-2);
    }
    else if(moment(date).day()===6){
      date.setDate(date.getDate()-1);
    }
    else{
      date.setDate(date.getDate());
    }

    const newdate=moment(date).format('YYYY-MM-DD');
  console.log(moment(date).day());

  console.log(date);
  const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockname}.BSE&outputsize=full&apikey=RXJG6G06DWB4MMP5`);
  const jsonData = await response.json();
  console.log(jsonData['Time Series (Daily)'][newdate]);
  console.log(jsonData['Time Series (Daily)'][newdate]['4. close']);
  setCurrentPrice(jsonData['Time Series (Daily)'][newdate]['4. close']);



   Axios.post('https://stockportfolio1450.herokuapp.com/addtolist',({stockname:stockname.toString(),quantity:quantity,price:currentprice})).then((response)=>{
    console.log(response.data);
    // mystockslist.push(response.data.stockdetails[0]);
    
   })
  }



const GetmyStocks=()=>{
  Axios.get('https://stockportfolio1450.herokuapp.com/getmystocks').then((response)=>{
    console.log(response.data.mystocks)
    setMyStocksList(response.data.mystocks)
    setTotalSum(response.data.totalsum)
    setTotalPortfolioVar(response.data.totalPortfolioVar)
  })
}

const removeFromMyList=(code)=>{
  Axios.delete(`https://stockportfolio1450.herokuapp.com/deletefrommylist/${code}`)
}



  return (
    <div className="App">
      <br/><br/>
      <motion.div transition={{delay:2}} className='inputer'>
        <motion.h2 transition={{type:'spring',delay:1}} initial ={{scale:0}} animate={{scale:1}} style={{color:'white'}}><img className="arrow" src='https://www.nicepng.com/png/detail/215-2154546_stock-market-arrow-png-stock-market-arrow-transparent.png'/>&nbsp;My Stock Portfolio</motion.h2>
        <br/>
    <motion.input transition={{type:'spring',delay:2}} initial ={{x:-400,scale:0}} animate={{x:0,scale:1}} className='input' onChange={(e)=>{setStockName(e.target.value)}} placeholder='StockName...'/>
    <br/><br/>
      <motion.input transition={{type:'spring',delay:2}} initial ={{x:400,scale:0}} animate={{x:0,scale:1}} className='input' onChange={(e)=>{setQuantity(e.target.value)}} placeholder='Quantity...'/>
      <br/><br/>
      <motion.button transition={{type:'spring',delay:2}} initial={{y:-250,scale:0}} animate={{y:0,scale:1}} className='btn' onClick={()=>{AddStocktoList()}}>Add Stock to My List</motion.button>
      <br/>
      </motion.div>
      <br/><br/>


    <div className='mylist'>
    <h2 style={{color:'white'}}>My Stocks List Section:</h2>
    <motion.button transition={{type:'spring',delay:5}} initial={{y:-250,scale:0}} animate={{y:0,scale:1}} className='btn' onClick={()=>{GetmyStocks()}}>Get My Stocks/Refresh My List </motion.button>
    <br/>
    <br/>
    <div className='listflex'>
    {
          mystockslist.map((item)=>{
            return (
              <div className='stockslist2'>
             
              <h6 >Stock Name :<span style={{color:'white'}}> {item.stockname}</span></h6>
              <h6>Stock VAR : <span style={{color:'white'}}>{item.totalvar}%</span></h6>
              <h6>StockCode : <span style={{color:'white'}}>{item.stockcode}</span></h6>
              <h6 style={{marginRight:10}}>Quantity: <span style={{color:'white'}}>{item.quantity}</span></h6>
              <h6 >Close Price : <span style={{color:'white'}}>₹{item.price}</span></h6>
              <h6>Total : <span style={{color:'white'}}>₹{item.quantity*item.price}</span></h6>
              <button onClick={()=>{removeFromMyList(item._id)}} className='btn'>Remove Stock From List</button>
              </div>
            )
          })
        }
     </div>
    <br/>
    <div className='displayer'>
          <motion.h2 transition={{type:'spring',delay:7}} initial ={{x:-400,scale:0}} animate={{x:0,scale:1}} style={{color:'white'}}>Stocks Total Price : <span className='mydata' style={{color:'red'}}>₹ {totalSum.toFixed(3)}</span></motion.h2>
        <motion.h2 transition={{type:'spring',delay:7}} initial ={{x:400,scale:0}} animate={{x:0,scale:1}} style={{color:'white'}}>Total Portfolio Var : <span className='mydata' style={{color:'red'}}>₹ {totalportfoliovar.toFixed(4)}</span></motion.h2>
    </div>
      
        <br/>
    </div>
      
      <br/><br/>
     <div className='allstocks'><h2 style={{color:'white'}}>Stocks List And Details:</h2>
     <button className='btn' onClick={()=>{GetStocksfn()}}>Get All Stocks</button></div>
      <br/><br/>
     <div className='listflex'>
    {
          stocksList.map((item)=>{
            return (
              <div className='stockslist'>
             
              <h6>Stock Name : {item.stockname}</h6><br/>
              <h6>Stock VAR : {item.totalvar}%</h6><br/>
              <h6>StockCode : <span style={{color:'red'}}>{item.stockcode}</span> </h6><br/>
              
              </div>
            )
          })
        }
     </div>
        


    </div>
  );
}

export default App;

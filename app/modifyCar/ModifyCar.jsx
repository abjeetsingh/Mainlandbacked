"use client"
import { useSearchParams } from 'next/navigation'; // Change the import
import React, {useCallback, useEffect, useState, useRef} from 'react'
import {useDropzone} from 'react-dropzone'
import {storage} from "../firebase"
import {ref, getDownloadURL, uploadBytes } from "firebase/storage"
import Loading from "../components/Loading"
import axios from 'axios';
// Define ModifyCar component
const ModifyCar = () => {
  const searchParams = useSearchParams()
  const [myData, setmyData] = useState(null);
  const key = searchParams.get('key')
  const [loading, setloading] = useState(false)

  useEffect(() => {
    setloading(true)
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/read/${key}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setmyData(result);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    setloading(false)
    fetchData();
  }, [key])
  
  //  /update/data/:id
function saveChanges(){
  console.log("I am running")
  setloading(true)
  const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update/${key}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(myData)
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setmyData(result);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    setloading(false)
    fetchData();
    axios.get("https://api.mainlandautogroup.ca/initdata")
}
  


  console.log(myData)
  const Up = (index) => {
    const newArr = [...myData?.images];
    if (!myData?.images[index] || !myData?.images[index - 1]) return;
    newArr[index] = myData?.images[index - 1];
    newArr[index - 1] = myData?.images[index];
    setmyData({...myData, images:newArr});
  };
  const Down = (index) => {
    const newArr = [...myData?.images];
    if (!myData?.images[index] || !myData?.images[index + 1]) return;
    newArr[index] = myData?.images[index + 1];
    newArr[index + 1] = myData?.images[index];
    setmyData({...myData, images:newArr});
  };

  const showImages = myData?.images?.map((link, index) => (
    <div>
      <span className='flex items-center'>
            <img width={"200px"} className='inline' src={link} />
            <button className=' p-2 px-5 mx-3 bg-primary-red rounded-3xl m-auto font-semibold text-white'
              onClick={() => {
                Up(index);
              }}
            >
              Up
            </button>
            <button className='p-2 px-5 mx-3 bg-primary-red rounded-3xl m-auto font-semibold text-white'
              onClick={() => {
                Down(index);
              }}
            >
              Down
            </button>
          </span>
    </div>
  ))
  
  return (
    myData &&  
    <div className='grid gap-20 mt-20'>
        {loading?  <Loading/>:""}
        <div className=' text-primary-red text-2xl font-bold mt-4'>Modify Car</div>

        <div className=' bg-zinc-100 px-4 py-8  rounded-3xl shadow-lg'>
          <h1 className=' text-grey text-2xl font-bold mt-4'>Model and Make</h1>
          
          

            <div className=' ml-8 mt-4 grid grid-rows-2 grid-cols-3 w-full gap-5'>
                <span>
                  <p className='text-primary-red text-lg font-bold ml-auto'>Make</p>
                  <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.make || ''} onChange={(e)=>{
                    const val = {...myData, make:e.target.value}
                    setmyData(val)
                  }}/>
                </span>

                <span>
                  <p className='text-primary-red text-lg font-bold ml-auto'>Model</p>
                  <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.model} onChange={(e)=>{
                    const val = {...myData, model:e.target.value}
                    setmyData(val)
                  }}/>
                </span>

                <span>
                  <p className='text-primary-red text-lg font-bold ml-auto'>Year</p>
                  <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.year} onChange={(e)=>{
                    const val = {...myData, year:e.target.value}
                    setmyData(val)
                  }}/>
                </span>

                <span>
                  <p className='text-primary-red text-lg font-bold'>Built</p>
                <select className="bg-zinc-100  py-[4px] focus:outline-none" id="" onChange={(e)=>{
                    const val = {...myData, built:e.target.value}
                    setmyData(val)
                  }}
                  value={myData.build || "select"}>
                      <option value="Sedan"> Sedan</option>
                      <option value="SUV"> SUV</option>
                      <option value="Sport"> Sport</option>
                      <option value="Coupe"> Coupe</option>
                      <option value="luxury"> luxury</option>
                      <option value="Hatchback"> Hatchback</option>
                      <option value="Minivan"> Minivan</option>
                      <option value="Truck"> Truck</option>
                      
                    </select>
                </span>

                <span>
                    <p className='text-primary-red text-lg font-bold '>Trim</p>
                    
                    <select className="bg-zinc-100  py-[4px] focus:outline-none focus:border-none" id="" onChange={(e)=>{
                    const val = {...myData, trim:e.target.value}
                    setmyData(val)
                  }}>
                      <option value="Select"> Select</option>
                      {
                        myData.years?myData.years[0].styles.map(element => (<option key={element.id} value={element.name}>{element.name}</option>)):""
                      }
                    </select>
                </span>
          
                <span>
                  <p className='text-primary-red text-lg font-bold'>Odometer</p>
                  <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.odometer} onChange={(e)=>{
                    const val = {...myData, odometer:e.target.value}
                    setmyData(val)
                  }}/>
                </span>
                
            </div>

        </div>

        <div className=' bg-zinc-100 px-4 py-8  rounded-3xl shadow-lg'>
          <h1 className=' text-grey text-2xl font-bold mt-4'>Specification</h1>
          <div className=' ml-8 mt-4 grid grid-rows-4 grid-cols-3 w-full gap-5'>
              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Engine</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.engine} onChange={(e)=>{
                    const val = {...myData, engine:e.target.value}
                    setmyData(val)
                  }}/>
              </span>

              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Cylinders</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.cylinder} onChange={(e)=>{
                    const val = {...myData, cylinder:e.target.value}
                    setmyData(val)
                  }}/>
              </span>

              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Engine Displacement(L)</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.engineSize} onChange={(e)=>{
                    const val = {...myData, engineSize:e.target.value}
                    setmyData(val)
                  }}/>
              </span>

              <span>
                <p className='text-primary-red text-lg font-bold'>No. of Passangers</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold'/>
              </span>

              <span>
                <p className='text-primary-red text-lg font-bold'>Fuel Type</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.fuelType} onChange={(e)=>{
                    const val = {...myData, fuelType:e.target.value}
                    setmyData(val)
                  }}/>
              </span>
                  
              <span>
                <p className='text-primary-red text-lg font-bold'>Drive</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.drive} onChange={(e)=>{
                    const val = {...myData, drive:e.target.value}
                    setmyData(val)
                  }}/>
              </span>

              <span>
                <p className='text-primary-red text-lg  font-bold'>Horsepower</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.horsepower} onChange={(e)=>{
                    const val = {...myData, horsepower:e.target.value}
                    setmyData(val)
                  }}/>
              </span>
              <span>
                <p className='text-primary-red text-lg font-bold'>Torque</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.torque} onChange={(e)=>{
                    const val = {...myData, torque:e.target.value}
                    setmyData(val)
                  }}/>
              </span>

              <span>
                <p className='text-primary-red text-lg font-bold'>Engine Configuration</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.config} onChange={(e)=>{
                    const val = {...myData, config:e.target.value}
                    setmyData(val)
                  }}/>
              </span> 
              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>no. of Speed Transmission</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.noOfSpeed} onChange={(e)=>{
                    const val = {...myData, noOfSpeed:e.target.value}
                    setmyData(val)
                  }}/>
              </span> 

              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Transmission</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.transmission} onChange={(e)=>{
                    const val = {...myData, transmission:e.target.value}
                    setmyData(val)
                  }}/>
              </span>  
          </div>

        </div>             
        
        <div className=' bg-zinc-100 px-4 py-8  rounded-3xl shadow-lg'>
            <h1 className=' text-grey text-2xl font-bold mt-4'>Interior & Exterior</h1>
            <div className=' ml-8 mt-4 grid grid-rows-1 grid-cols-3 w-full gap-5'>
              
                
                <span>
                  <p className='text-primary-red text-lg font-bold ml-auto'>Exterior Colours</p>
                  <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.extColor || ''} onChange={(e)=>{
                    const val = {...myData, extColor:e.target.value}
                    setmyData(val)
                  }}/>
                </span>

                <span>
                  <p className='text-primary-red text-lg font-bold ml-auto'>Interior Colours</p>
                  <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.intColor || ''} onChange={(e)=>{
                    const val = {...myData, intColor:e.target.value}
                    setmyData(val)
                  }}/>
                </span>

                <span>
                  <p className='text-primary-red text-lg font-bold ml-auto'>Doors</p>
                  <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.doors} onChange={(e)=>{
                    const val = {...myData, doors:e.target.value}
                    setmyData(val)
                  }}/>
                </span>
            </div>

        </div>

        

        <div className=' bg-zinc-100 px-4 py-8  rounded-3xl shadow-lg'>
          <h1 className=' text-grey text-2xl font-bold mt-4'>Pricing</h1>
          <div className=' ml-8 mt-4 grid grid-cols-4'>
            
                
              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Base Price ($ USD)</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' onChange={(e)=>{
                    const val = {...myData, base:e.target.value}
                    setmyData(val)
                  }}
                value={myData.base}/>
              </span>

              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Selling Price($ USD)</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' onChange={(e)=>{
                    const val = {...myData, selling:e.target.value}
                    setmyData(val)
                  }}
                  value={myData.selling}/>
              </span>

              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Stock</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' onChange={(e)=>{
                    const val = {...myData, stock:e.target.value}
                    setmyData(val)
                  }}
                value={myData.stock}/>
              </span>

              <span>
                  <p className='text-primary-red text-lg font-bold'>Location current = {myData.location}</p>
                <select className="bg-zinc-100  py-[4px] focus:outline-none" id="" onChange={(e)=>{
                    const val = {...myData, location:e.target.value}
                    setmyData(val)
                  }}>
                      <option value="Select"> Select</option>
                      <option value="Surrey"> Surrey</option>
                      <option value="Langley"> Langley</option>
                      <option value="Abbsfort"> Abbsfort</option>
                      <option value="Calgary"> Calgary</option>
                    </select>
                </span>
          </div>
        </div>
        
        <div className=' bg-zinc-100 px-4 py-8  rounded-3xl shadow-lg'>
          <h1 className=' text-grey text-2xl font-bold mt-4'>Description</h1>
          <div className=' ml-8 mt-4'>
            
                
              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Description</p>
                <textarea className=' border-gray-500 bg-slate-100 w-full border-2 rounded-lg px-3 font-semibold h-1/2 resize-none  ' name="" id="" cols="30" rows="10" value={myData.description} onChange={(e)=>{
                    const val = {...myData, description:e.target.value}
                    setmyData(val)
                  }}/>
              </span>
                
              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Mechanical</p>
                <textarea className=' border-gray-500 bg-slate-100 w-full border-2 rounded-lg px-3 font-semibold h-1/2 resize-none  ' name="" id="" cols="30" rows="10" value={myData.Mechanical} onChange={(e)=>{
                    const val = {...myData, Mechanical:e.target.value}
                    setmyData(val)
                  }}/>
              </span>
              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Exterior</p>
                <textarea className=' border-gray-500 bg-slate-100 w-full border-2 rounded-lg px-3 font-semibold h-1/2 resize-none  ' name="" id="" cols="30" rows="10" value={myData.Exterior} onChange={(e)=>{
                    const val = {...myData, Exterior:e.target.value}
                    setmyData(val)
                  }}/>
              </span>
              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Entertainment</p>
                <textarea className=' border-gray-500 bg-slate-100 w-full border-2 rounded-lg px-3 font-semibold h-1/2 resize-none  ' name="" id="" cols="30" rows="10" value={myData.Entertainment} onChange={(e)=>{
                    const val = {...myData, Entertainment:e.target.value}
                    setmyData(val)
                  }}/>
              </span>
              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Interior</p>
                <textarea className=' border-gray-500 bg-slate-100 w-full border-2 rounded-lg px-3 font-semibold h-1/2 resize-none  ' name="" id="" cols="30" rows="10" value={myData.Interior} onChange={(e)=>{
                    const val = {...myData, Interior:e.target.value}
                    setmyData(val)
                  }}/>
              </span>
              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Safety</p>
                <textarea className=' border-gray-500 bg-slate-100 w-full border-2 rounded-lg px-3 font-semibold h-1/2 resize-none  ' name="" id="" cols="30" rows="10" value={myData.Safety} onChange={(e)=>{
                    const val = {...myData, Safety:e.target.value}
                    setmyData(val)
                  }}/>
              </span>
              
          </div>
        </div>
        
        {/* <div className=' bg-zinc-100 px-4 py-8  rounded-3xl shadow-lg'>
          <h1 className=' text-grey text-2xl font-bold mt-4'>Upload Images</h1>
          <div className='flex items-center mt-6 flex-col overflow-visible'>
            <div {...getRootProps()} className='m-auto'>
              <input {...getInputProps()}/>
                {
                  isDragActive ?
                    <div className='w-[60vw] h-[30vh] bg-white/30 rounded-2xl shadow-2xl text-center cursor-pointer  '>
                        <p className='text-2xl text-blue-400  font-bold pt-8'>Drop the files here ...</p> 
                    </div>
                    :
                    <div className='w-[60vw] h-[30vh] bg-white rounded-2xl shadow-2xl text-center cursor-pointer'>
                      <p className='text-2xl text-blue-400  font-bold pt-8'>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                    
                }
            </div>
             
            
            <p>Uploaded Images</p>
            {showImages}
            <button onClick={()=>uploadImages()}>Upload Now</button>
          </div>
        </div> */}
        
        {showImages}
        <div className='text-center'>
          <button className=' p-2 px-5 mx-3 bg-primary-red rounded-3xl m-auto font-semibold text-white'
        onClick={() => saveChanges()}>Save Changes</button>

        </div>
      </div>
  );
};

// Export the ModifyCar component
export default ModifyCar;

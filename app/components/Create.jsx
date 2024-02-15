"use client"
import React, {useCallback, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import {storage} from "../firebase"
import {useState, useRef} from "react"
import {ref, getDownloadURL, uploadBytes } from "firebase/storage"
import Loading from "./Loading"
const Create = () => {
  const [Data, setData] = useState(null);
  const[selectedImages, setSelectedImages] = useState([])
  const [loading, setloading] = useState(false)
  const onDrop = useCallback(acceptedFiles => {
    setSelectedImages(
      acceptedFiles.map(file=>
      Object.assign(file, {
        preview:URL.createObjectURL(file)
      })
      )
    )
  }, [])

  

  useEffect(() => {

  console.log(selectedImages)
  }, [selectedImages]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const showImages = selectedImages?.map(file => (
    <div>
      <img src={file.preview} alt="Image" className='w-[200px]' />
    </div>
  ))

  const [myData, setmyData] = useState({})
  var myApiData = { }

  async function vinDecoder(value) {
    setloading(true)
    try {
      const res = await fetch(`https://auto.dev/api/vin/${value}?apikey=${process.env.NEXT_PUBLIC_VIN_API}`);
      const result = await res.json();
      setData(result);
      Data && setProperty(Data);
    } catch (error) {
      console.error("Error decoding VIN:", error);
    }
    setloading(false)
  }


  function setProperty(Data){
    myApiData = {
      id:0,
      liked:false,
      location:String,
      make: Data.make.name,
      model:Data.model.name,
      year:Data.years?Data.years[0].year:"",
      built:"select",
      trim:"select",
      odometer:0,
      engine:Data.engine?.name,
      cylinder:Data.engine?.cylinders,
      engineSize:Data.engine?.size,
      fuelType:Data.engine?.type,
      drive:Data.drivenWheels,
      horsepower:Data.engine?.horsepower,
      torque:Data.engine?.torque,
      congif:Data.engine?.configuration,
      transmission :( Data.transmission?.numberOfSpeeds + " " +Data.transmission?.transmissionType),
      extColor:"select",
      intColor:"select",
      doors:Data.numOfDoors,
      cityEco:Data.mpg?.city,
      highwayEco:Data.mpg?.highway,
      description:"",
      base:"",
      sellling:"",
      images: [String]
    }
    const val = {...myApiData}
    setmyData(val)
  }

  const vinInput = useRef();

  async function uploadImages() {
    setloading(true)
    const imageUrls = await Promise.all(selectedImages.map(async (file) => {
      const storageRef = ref(storage, `${myData.model}/${file.path}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(ref(storage, `${myData.model}/${file.path}`));
    }));
    console.log(imageUrls)
    setmyData({ ...myData, images: imageUrls });
    setloading(false)
  }



  async function submitHandle(){
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
    console.log("handeling")
    console.log(myData)
    setloading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create`, {
      method: 'POST',
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify(myData)
      }).catch((error) => {
            console.error("Error fetching payment intent:", error.message);
    });
    setmyData({})
    setData({})
    setloading(false)
  }


  return (
    <div >
      {loading?  <Loading/>:""}
      <div className='w-full text-center' >
        <h1 className=' text-primary-red text-lg font-bold mx-4'>VIN DECODER</h1>
        <input type="text"  ref={vinInput} placeholder='Enter Vin Here' className='border-black border-2 rounded-lg px-3' />
        <button onClick={()=>vinDecoder(vinInput.current.value)} className=' p-2 px-5 mx-3 bg-primary-red rounded-3xl m-auto font-semibold text-white'>Load</button>
      </div>

      {/* data after we get vin decode */}

      {
      (myData && Data)?
      
      <div className='grid gap-20 mt-20'>
        
        <button onClick={()=>vinDecoder(vinInput.current.value)} className=' p-2 px-5 mx-3 bg-primary-red rounded-3xl m-auto font-semibold text-white'>AutoFill Data</button>


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
                  }}>
                      <option value="Select"> Select</option>
                      <option value="Select"> Sedan</option>
                      <option value="Select"> SUV</option>
                      <option value="Select"> Sport</option>
                      <option value="Select"> Coupe</option>
                      <option value="Select"> luxury</option>
                      <option value="Select"> Hatchback</option>
                      <option value="Select"> Minivan</option>

                      
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
                        Data.years?Data.years[0].styles.map(element => (<option key={element.id} value={element.name}>{element.name}</option>)):""
                      }
                    </select>
                </span>
          
                <span>
                  <p className='text-primary-red text-lg font-bold'>Odometer</p>
                  <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' placeholder='Odometer Value' onChange={(e)=>{
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
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={Data.config} onChange={(e)=>{
                    const val = {...myData, config:e.target.value}
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
                    <p className='text-primary-red text-lg font-bold '>Exterior Colours</p>
                    <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold'  onChange={(e)=>{
                    const val = {...myData, extColor:e.target.value}
                    setmyData(val)
                  }}/>
                    
                    {/* <select className="bg-zinc-100  py-[4px] focus:outline-none focus:border-none" id="" onChange={(e)=>{
                    const val = {...myData, extColor:e.target.value}
                    setmyData(val)
                  }}>
                      <option value="Select"> Select</option>
                      {
                        Data.colors[1]?.options.map(element => (<option key={element.id} value={element.name}>{element.name}</option>))
                      }
                    </select> */}
                </span>

                <span>
                    <p className='text-primary-red text-lg font-bold '>Interior Colours</p>
                    <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold'  onChange={(e)=>{
                    const val = {...myData, intColor:e.target.value}
                    setmyData(val)
                  }}/>
                    
                    {/* <select className="bg-zinc-100  py-[4px] focus:outline-none focus:border-none" id="" onChange={(e)=>{
                    const val = {...myData, intColor:e.target.value}
                    setmyData(val)
                  }}>
                      <option value="Select"> Select</option>
                      {
                        Data.colors[0]?.options.map(element => (<option key={element.id} value={element.name}>{element.name}</option>))
                      }
                    </select> */}
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
            <h1 className=' text-grey text-2xl font-bold mt-4'>Fuel Economy</h1>
            <div className=' ml-8 mt-4 grid grid-rows-1 grid-cols-2'>
              
                  
                <span>
                  <p className='text-primary-red text-lg font-bold ml-auto'>City</p>
                  <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.cityEco} onChange={(e)=>{
                    const val = {...myData, cityEco:e.target.value}
                    setmyData(val)
                  }}/>
                </span>

                <span>
                  <p className='text-primary-red text-lg font-bold ml-auto'>Highway</p>
                  <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' value={myData.highwayEco} onChange={(e)=>{
                    const val = {...myData, highwayEco:e.target.value}
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
                  }}/>
              </span>

              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Selling Price($ USD)</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' onChange={(e)=>{
                    const val = {...myData, selling:e.target.value}
                    setmyData(val)
                  }}/>
              </span>

              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Stock</p>
                <input className=' inline border-gray-500 bg-slate-100 h-8 border-2 rounded-lg px-3 font-semibold' onChange={(e)=>{
                    const val = {...myData, stock:e.target.value}
                    setmyData(val)
                  }}/>
              </span>

              <span>
                  <p className='text-primary-red text-lg font-bold'>Location</p>
                <select className="bg-zinc-100  py-[4px] focus:outline-none" id="" onChange={(e)=>{
                    const val = {...myData, location:e.target.value}
                    setmyData(val)
                  }}>
                      <option value="Select"> Select</option>
                      <option value="Select"> Surrey</option>
                      <option value="Select"> Langley</option>
                      <option value="Select"> Abbsfort</option>
                      <option value="Select"> Calgary</option>
                    </select>
                </span>
          </div>
        </div>
        
        <div className=' bg-zinc-100 px-4 py-8  rounded-3xl shadow-lg'>
          <h1 className=' text-grey text-2xl font-bold mt-4'>Description</h1>
          <div className=' ml-8 mt-4'>
            
                
              <span>
                <p className='text-primary-red text-lg font-bold ml-auto'>Description</p>
                <textarea className=' border-gray-500 bg-slate-100 w-full border-2 rounded-lg px-3 font-semibold h-1/2 resize-none  ' name="" id="" cols="30" rows="10" onChange={(e)=>{
                    const val = {...myData, description:e.target.value}
                    setmyData(val)
                  }}/>
              </span>

              
          </div>
        </div>
        
        <div className=' bg-zinc-100 px-4 py-8  rounded-3xl shadow-lg'>
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
        </div>

        <div className='text-center'>
        <button className=' p-2 px-5 mx-3 bg-primary-red rounded-3xl m-auto font-semibold text-white'
        onClick={() => submitHandle()}>Submit</button>

        </div>
      </div>
      
      :
      
      <div className=' text-primary-red text-2xl font-bold mt-4'>NO DATA*</div>}

    </div>
  )
}

export default Create
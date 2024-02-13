"use client"
import React, {useState, useEffect} from 'react'
import CarCard from './CarCards'
import CustomButton from "./CustomButton";

const Modify = () => {


  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all?limit=${limit}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [limit]);

  const handleShowMore = () => {
    setLimit((prevLimit) => prevLimit + 10);
  };

  return (

    <div className='flex-col flex items-center'>


    <div className='grid lg:grid-cols-4 md:grid-cols-3 gap-6'>
      

      {data && data.length > 0 && data.map((item) => (
        <CarCard key={item.id} data={item} />
      ))
      }
    </div>
    <div className='block' onClick={handleShowMore}>
        <CustomButton
            title="Show More"
            containerStyles=" py-[16px] rounded-full bg-primary-red mr-4 "
            textStyles="text-white text-[14px] leading-[17px] font-bold"
          />
      </div>
    </div>
  )
}

export default Modify
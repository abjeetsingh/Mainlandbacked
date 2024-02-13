"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect,Fragment, useRef } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router';


import CustomButton from "./CustomButton";


const CarCard = ({data, Carkey }) => {


  console.log(data.id)
  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef(null)

  function deleteCar(){
    console.log("I am running")
    
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete/${data.id}`, {
          method: "DELETE"});
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    
        fetchData();
        setOpen(false)
        const router = useRouter();
        router.reload();
  }

  
    

  


  const handelLike = () => {
    data.liked = !data.liked
    const AddLiked = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ModifyLike`,{
          method:"post",
          headers:{
            "Content-Type": "application/json",
          },
          body:JSON.stringify({id:data.id})
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };


    const RemoveLiked = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/DeleteLike/${data.id}`, {
          method:"DELETE"
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    if(data.liked)
      AddLiked();
    else
      RemoveLiked()

  }
  



  const {
    cityEco,
    images,
    make,
    model,
    transmission,
    drive,
    selling,
  } = data
  
  return (
    <div className="car-card">
      <div className="car-card__content">
        <h2 className="car-card__content-title">
          {make} {model}
        </h2>

        <Image
          src={data.liked ? "/heart-filled.svg":"/heart-outline.svg"}
          width={24}
          height={24}
          alt="heart"
          className="object-contain cursor-pointer mt-0.5"
          onClick={() => handelLike()}
        />
      </div>

      <p className=" text-primary-red pt-2 font-jost font-bold text-lg ">
        $ {selling}
      </p>

      <div className="car-card__image">
        <Image
          src={images[0]}
          alt="car model"
          fill
          sizes="(max-width: 900px)"
          priority
          className="object-contain w-full h-full"
        />
      </div>

      <div className="relative flex flex-col w-full mt-2">
        <div className="car-card__icon-container">
          <div className="car-card__icon">
            <Image
              src="/steering-wheel.svg"
              width={20}
              height={20}
              alt="steering wheel"
            />
            <p className="car-card__icon-text">
              {transmission === "a" ? "Automatic" : "Manual"}
            </p>
          </div>
          <div className="car-card__icon">
            <Image src="/tire.svg" width={20} height={20} alt="seat" />
            <p className="car-card__icon-text">{drive}</p>
          </div>
          <div className="car-card__icon">
            <Image src="/gas.svg" width={20} height={20} alt="seat" />
            <p className="car-card__icon-text">{cityEco} MPG</p>
          </div>
        </div>

        <div className="car-card__btn-container">
          <CustomButton
            title="Delete"
            containerStyles="rounded-full bg-primary-red"
            textStyles="text-white text-[14px] leading-[17px] font-bold"
            handleClick={() => setOpen(true)}
          />
          <Link 
          href={{
              pathname: '/modifyCar',
              query: { key:data.id},
            }}
          >
            <CustomButton
              title="Modify"
              containerStyles="rounded-full bg-primary-red"
              textStyles="text-white text-[14px] leading-[17px] font-bold"
            />
          </Link>
        </div>
        
      </div>



      <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Deactivate account
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to deactivate your account? All of your data will be permanently
                          removed. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => deleteCar()}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

    </div>
  );
};

export default CarCard;

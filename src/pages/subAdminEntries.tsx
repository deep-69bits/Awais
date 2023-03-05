import React, { ReactNode, useEffect } from 'react'
import { useState } from 'react'
import Icon from '@mdi/react';
import {  ref, child, get,update } from "firebase/database";
import { saveAs } from 'file-saver';
import { writeFile } from 'xlsx';
import {storage} from '../../firebase'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { format,parse } from 'date-fns'



import * as XLSX from 'xlsx';

import {ref as sRef,getDownloadURL} from 'firebase/storage'
import { Modal, Button, Form } from 'react-bootstrap';
import {toast,Toaster} from 'react-hot-toast'
import {database} from '../../firebase'
import menuAside from '../menuAside'
import menuNavBar from '../menuNavBar'
import BaseIcon from '../components/BaseIcon'
import NavBar from '../components/NavBar'
import NavBarItemPlain from '../components/NavBarItemPlain'
import AsideMenu from '../components/AsideMenu'
import axios from 'axios';

import { setUser } from '../stores/mainSlice'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import Image from 'next/image';

import { useRouter } from 'next/router'
import { mdiForwardburger, mdiTextBoxSearchOutline,mdiBackburger, mdiMenu,mdiSquareEditOutline ,mdiTrashCanOutline } from '@mdi/js'


import Table from 'react-bootstrap/Table';


type Props = {
  children: ReactNode
}

export default function LayoutAuthenticated({ children }: Props) {
  const dispatch = useAppDispatch()
  

  const [entries,setEntries]:any=useState({})
  const [searchedEntries,setSearchedEntries]:any=useState({})
  const [checkedItems,setCheckedItems]:any=useState([])
  const [filters,setFilterData]:any=useState({
    startDate:"",
    endDate:"",
    user:"",
    chain:"",
    city:"",
    category:""

  })
const [allCategories,setAllCategories]:any=useState({})

const [allUsers,setAllUsers]:any=useState({})

  

  useEffect(() => {
    if(Object.entries(entries).length<=0){
      getEntries()
      getUsers()

    }
  })
  const getUsers=async()=>{
    let dbRef = ref(database);
    get(child(dbRef, `Users/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        setAllUsers(res)
        
        
       
      }


    })
     dbRef = ref(database);
    get(child(dbRef, `Categories/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        setAllCategories(res)
        
       
      }


    })
    
    
  }
  const darkMode = useAppSelector((state) => state.style.darkMode)

  const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false)
  const [isAsideLgActive, setIsAsideLgActive] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsAsideMobileExpanded(false)
      setIsAsideLgActive(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events, dispatch])

  const layoutAsidePadding = 'xl:pl-60'
const getEntries=async()=>{
  const dbRef = ref(database);
    get(child(dbRef, `Entries/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const res=snapshot.val()
        setEntries(res)
        setSearchedEntries(res)
        
       
      }


    })
}

async function downloadImage(url: any, filename: any) {
  const response = await axios.get(url, { responseType: 'blob' });

  // Specify the folder name
  

  
  saveAs(response.data, filename);
}

const handleImages=async()=>{
  Object.entries(searchedEntries).length>0 && Object.entries(searchedEntries).map(([key,value]:any)=>{
    if(checkedItems.includes(value.id)){
      value.urlListQ4.forEach((item:any)=>{
        downloadImage(item, `${value.date}_${value.store.westCode}.jpg`);
        
      })
      value.urlListQ5.forEach((item:any)=>{
        downloadImage(item, `${value.date}_${value.store.westCode}.jpg`);
        
      })
    }
   
  })
  

}
function exportToExcel(tableData:any, filename:any) {
  


  const worksheet = XLSX.utils.json_to_sheet(tableData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  writeFile(workbook, filename);
}
const handleXLSX=async()=>{
  const data:any=[]
Object.entries(entries).map(([key,value]:any)=>{
  const obj={
   date:value.date,
    user:value.username,
    westCode: value.store.westCode,
    customer_Id:value.store.customerId,
    street:  value.store.street,
   city: value.store.city,
    chain:value.store.chain,
    ηρείται_το_πλανόγραμμα: value.question1,
    χει_καλή_εικόνατο_σημείο: value.question2,
    Καταγραφή_OOS_Προϊόντων: value.productsList?.[0]?.brandName +","+value.productsList?.[1]?.brandName+","+value.productsList?.[2]?.brandName,
    Φωτογραφία_καταστήματος: value.urlListQ4?.[0]+ " , "+value.urlListQ4?.[1],
    Φωτογραφία_Ψυγείου: value.urlListQ5?.[0]+ " , "+value.urlListQ5?.[1],


 

  }
  data.push(obj)
})
  exportToExcel(data, 'table.xlsx');
}

const generatePDF = () => {
 
  let  data:any=[]
  Object.entries(entries).map(([key,value]:any)=>{
    data.push([
      value.date,
      value.username,
      value.store.westCode,
      value.store.customerId,
      value.store.street,
      value.store.city,

      value.store.chain,
      value.question1,
      value.question2,
      value.productsList?.[0]?.brandName +","+value.productsList?.[1]?.brandName+","+value.productsList?.[2]?.brandName,
      value.urlListQ4?.[0]+ " , "+value.urlListQ4?.[1],
      value.urlListQ5?.[0]+ " , "+value.urlListQ5?.[1],
      
  
  
    ])
  })
    
  const documentDefinition = {
    pageOrientation: 'landscape',
    content: [
      { text: 'My Table', style: 'header' },
      {
        style: 'table',
        table: {
          headerRows: 1,
          widths: ['8.33%','8.33%','8.33%','8.33%','8.33%','8.33%','8.33%','8.33%','8.33%','8.33%','8.33%','8.33%'],
          body: [
            [
              { text: 'Date', style: 'tableHeader' },
              { text: 'User', style: 'tableHeader' },
              { text: 'west Code', style: 'tableHeader' },
              { text: 'Customer Id', style: 'tableHeader' },
              { text: 'street', style: 'tableHeader' },
              { text: 'city ', style: 'tableHeader' },
              { text: 'chain ', style: 'tableHeader' },
              { text: 'ηρείται το πλανόγραμμα; ', style: 'tableHeader' },
              { text: 'χει καλή εικόνατο σημείο;', style: 'tableHeader' },
              { text: 'Καταγραφή OOS Προϊόντων', style: 'tableHeader' },
              { text: 'Φωτογραφία καταστήματος', style: 'tableHeader' },
              { text: 'Φωτογραφία Ψυγείου ', style: 'tableHeader' },



            ],
            ...data,
          ],
        },
        layout: {
          hLineWidth: function(i:any, node:any) {
            return (i === 0 || i === node.table.body.length) ? 0 : 1;
          },
          vLineWidth: function(i:any, node:any) {
            return 0;
          },
          hLineColor: function(i:any, node:any) {
            return (i === 0 || i === node.table.body.length) ? 'white' : 'gray';
          },
          paddingTop: function(i:any, node:any) { return 5; },
          paddingBottom: function(i:any, node:any) { return 5; },
          paddingLeft: function(i:any, node:any) { return 5; },
          paddingRight: function(i:any, node:any) { return 5; },
          columnGap: 10,
          fillColor: function(i:any, node:any) {
            return (i % 2 === 0) ? '#CCCCCC' : null;
          },
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      table: {
        margin: [0, 5, 0, 15],
        maxWidth: 800,
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black',
        fillColor: '#CCCCCC',
        noWrap: false,
      },
    },
  };

  pdfMake.createPdf(documentDefinition).download("table.pdf");
};
 
const handleAllCheckItems=async(e:any)=>{
  const arr:any=[]
  if(e.target.checked){
    Object.entries(searchedEntries).length>0 && Object.entries(searchedEntries).map(([key,value]:any)=>{
      arr.push(value.id)
    })
  
    setCheckedItems(arr)
  }else{
    setCheckedItems([])
  }

}

const handleCheckItem=async(e:any,id:any)=>{
  if(e.target.checked){
    Object.entries(searchedEntries).length>0 && Object.entries(searchedEntries).map(([key,value]:any)=>{
      if(id===value.id){
      setCheckedItems([...checkedItems,value.id])


      }
    })
  
  }else{
    const arr:any=[]
    checkedItems.filter((item:any)=>{
        if(item!==id){
          arr.push(item)
        }
    })
    setCheckedItems(arr)
  }

}
const filter=async()=>{
  const filteredData = Object.entries(entries).filter((row:any) => {
    let startDate:any;
    let endDate:any;
    if(filters.startDate && filters.endDate){
       startDate = format(parse(filters.startDate, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')
       endDate=format(parse(filters.endDate, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')
      
    }
    const date = format(parse(row[1].date, 'MM-dd-yyyy', new Date()), 'yyyy-MM-dd')
 
    
  const dateMatch = (startDate && endDate)
    ? (date >= startDate && date <= filters)
    : true;
  const userMatch = (filters.user)
    ? row[1]?.username?.toLowerCase().includes(filters.user.toLowerCase())
    : true;



  const cityMatch = (filters.city)
    ? row[1]?.store?.city.toLowerCase().includes(filters.city.toLowerCase())
    : true;
  const chainMatch = (filters.chain !== null)
    ? row[1]?.store?.chain.toLowerCase().includes(filters.chain.toLowerCase())
    : true;
  const categoryMatch = (filters.category)
    ? row[1].productsList?.[0]?.category.toLowerCase().includes(filters.category.toLowerCase()) || row[1].productsList?.[1]?.category.toLowerCase().includes(filters.category.toLowerCase()) ||
    row[1].productsList?.[2]?.category.toLowerCase().includes(filters.category.toLowerCase())
    : true;
  
  
  return dateMatch && userMatch && cityMatch && chainMatch && categoryMatch;
});
let arr:any={}
filteredData.map((item:any)=>{
const obj={[item[0]]:item[1]}

arr={...arr,...obj}


})

setSearchedEntries(arr)





  
}
const handleLogout=async()=>{
router.push('/')
}
  return (
    <div className={`${darkMode ? 'dark' : ''}  bg-white overflow-hidden lg:overflow-visible`}>
      <div
        className={`pt-14 min-h-screen w-screen transition-position lg:w-auto `}
      >
        {/* <NavBar
          menu={menuNavBar}
          className={`${layoutAsidePadding} ${isAsideMobileExpanded ?  'bg-white ' : ''}`}
          >
          <NavBarItemPlain
            display="flex lg:hidden"
            onClick={() => setIsAsideMobileExpanded(!isAsideMobileExpanded)}
          >
            <BaseIcon path={isAsideMobileExpanded ? mdiBackburger : mdiForwardburger} size="24" />
          </NavBarItemPlain>
          <NavBarItemPlain
            display="hidden lg:flex xl:hidden"
            onClick={() => setIsAsideLgActive(true)}
          >
            <BaseIcon path={mdiMenu} size="24" />
          </NavBarItemPlain>
         
        </NavBar>
        <AsideMenu
          isAsideMobileExpanded={isAsideMobileExpanded}
          isAsideLgActive={isAsideLgActive}
          menu={menuAside}
          onAsideLgClose={() => setIsAsideLgActive(false)}
        />
        {children} */}
     <div className='m-4'>
       
<Button className="btn btn-danger absolute right-4 top-4"  onClick={handleLogout}>Logout</Button>

<div className="flex flex-col flex-wrap mb-4 md:flex-row gap-1 items-end justify-center md:justify-between py-4 px-2 lg:px-8">
  <div className="w-full md:w-1/5 lg:w-1/6">
    <label className="block mb-2 font-md text-gray-700" style={{color:"#28419a",fontWeight:"600"}} >
      Start Date
    </label>
    <input onChange={(e)=>setFilterData({...filters,startDate:e.target.value})} className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" type="date"  id="start-date" name="start-date"/>
  </div>
  <div className="w-full md:w-1/5 lg:w-1/6">
    <label className="block mb-2 font-md text-gray-700" style={{color:"#28419a",fontWeight:"600"}}>
      End Date
    </label>
    <input  onChange={(e)=>setFilterData({...filters,endDate:e.target.value})}  className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" type="date" id="end-date" name="end-date"/>
  </div>
  <div className="w-full md:w-1/5 lg:w-1/6">
    <label className="block mb-2 font-md text-gray-700" style={{color:"#28419a",fontWeight:"600"}}>
      User 
    </label>
    <select onChange={(e)=>setFilterData({...filters,user:e.target.value})}  className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" id="user-selection" name="user-selection">
      <option value="">Select user</option>
      {
    Object.entries(allUsers).length>0  && Object.entries(allUsers).map(([key,val]:any)=>{
    
    return   <option value={val.username} key={val.id +"313"}>{val.username}</option>
    })
    
   
    
   }
    </select>
  </div>
  <div className="w-full md:w-1/5 lg:w-1/6">
    <label className="block mb-2  text-gray-700" style={{color:"#28419a",fontWeight:"600"}} >
      Chain
    </label>
    <input  onChange={(e)=>setFilterData({...filters,chain:e.target.value})}  className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" type="text" id="chain" name="chain"/>
  </div>
  <div className="w-full md:w-1/5 lg:w-1/6">
    <label className="block mb-2  text-gray-700" style={{color:"#28419a",fontWeight:"600"}} >
      City
    </label>
    <input onChange={(e)=>setFilterData({...filters,city:e.target.value})}  className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" type="text" id="city" name="city"/>
  </div>
  <div className="w-full md:w-1/5 lg:w-1/6">
    <label className="block mb-2 font-md text-gray-700" style={{color:"#28419a",fontWeight:"600"}}>
      Category 
    </label>
    <select onChange={(e)=>setFilterData({...filters,category:e.target.value})}  className="w-full bg-gray-100 border-2 border-gray-200 p-2 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500" id="user-selection" name="user-selection">
      <option value="">Select Category</option>
      {
    Object.entries(allCategories).length>0  && Object.entries(allCategories).map(([key,val]:any)=>{
    
    return   <option value={val.category} key={val.id +"654"}>{val.category}</option>
    })
    
   
    
   }
    </select>
  </div>
  <div className="w-full md:w-auto">
    <button onClick={filter} className="w-full md:w-auto  text-white font-md py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" style={{background:"#2ec5e3",fontWeight:"600"}}>
      Apply Filters
    </button>
  </div>
</div>

<div className="flex flex-col flex-wrap mb-4 mt-2 md:flex-row gap-1 items-end justify-end md:justify-end py-4 px-2 lg:px-8">
<div className="w-full md:w-auto">
    <button  onClick={handleXLSX} className="w-full md:w-auto  text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" style={{background:"#28419a",fontWeight:"600"}}>
      DOWNLOAD XLSX
    </button>
  </div>
  <div className="w-full md:w-auto">
    <button onClick={handleImages} className="w-full md:w-auto  text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" style={{background:"#28419a",fontWeight:"600"}}>
      DOWNLOAD IMAGES
    </button>
  </div>
  <div className="w-full md:w-auto">
    <button onClick={generatePDF} className="w-full md:w-auto  text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" style={{background:"#28419a",fontWeight:"600"}}>
      DOWNLOAD PDF
    </button>
  </div>
</div>
    <Table striped className='border shadow-sm' responsive hover >
      <thead >
        <tr className='border shadow' style={{fontSize:"9px",fontWeight:"bold"}} >
          <th className='border'>
            <input type='checkbox' onChange={handleAllCheckItems} className='rounded shadow'/>
            <label className='ml-6'>Date</label>
          </th>
          <th className='border shadow'>User</th>
          <th className='border shadow'>West Code</th>
          <th className='border shadow'>Customer ID</th>
          <th className='border shadow'>Street</th>
          <th className='border shadow'>City</th>
          <th className='border shadow'>Chain</th>
       
          <th className='border shadow'>Τηρείται το πλανόγραμμα</th>
          <th className='border shadow'>Έχει καλή εικόνα το ψυγείο</th>
          <th className='border shadow'>Καταγραφή OOS Προϊόντων</th>
          <th className='border shadow'>Φωτογραφία καταστήματος</th>
<th className='border shadow' >Φωτογραφία Ψυγείου</th>
<th className='border shadow'></th>

        </tr>
      </thead>
      <tbody>
      {
  Object.entries(searchedEntries).length>0 && Object.entries(searchedEntries).map(([key,value]:any)=>{
    return <tr className='shadow ' style={{fontSize:"10px"}} key={value.id}>
    <td className='border  '>
      <div className='flex items-center'>
      <input type='checkbox' checked={checkedItems?.includes(value.id)? true:false} onChange={(e)=>handleCheckItem(e,value.id)} className='rounded '/>
    <label className='ml-8'>{value.date}</label>
      </div>
   
    </td>
    <td className='border '>{value.username}</td>
  <td className='border '>{value.store.westCode}</td>
  <td className='border '>{value.store.customerId}</td>
  <td className='border '>{value.store.street}</td>
  <td className='border '>{value.store.city}</td>
  <td className='border '>{value.store.chain}</td>
  <td className='border '>{value.question1}</td>
  <td className='border '>{value.question2}</td>
  <td className='border '>{value.productsList?.[0]?.brandName } , {value.productsList?.[1]?.brandName } , {value.productsList?.[2]?.brandName }</td>
  <td className='border '>
    <div className='flex gap-2'>
   {value.urlListQ4?.[0] && <Image src={value.urlListQ4?.[0]} alt="img" width={20} height={10}  /> } 
   {value.urlListQ4?.[1] && <Image src={value.urlListQ4?.[1]} alt="img" width={20} height={10}  /> } 
    
    
    
    </div></td>
  <td className='border '><div>
  <div className='flex gap-2'>
  {value.urlListQ5?.[0] && <Image src={value.urlListQ5?.[0]} alt="img" width={20} height={10}  /> } 
   {value.urlListQ5?.[1] && <Image src={value.urlListQ5?.[1]} alt="img" width={20} height={10}  /> } 
    
    </div>
    </div></td>
  
<td>
<div className='flex gap-2' style={{color:"#28419a"}}>

    <Icon path={mdiSquareEditOutline} size={0.8}  />
    <Icon path={mdiTextBoxSearchOutline} size={0.8}  />
</div>
</td>

  </tr>
  })
}
        
       
      
        

       
      </tbody>
    </Table>




       

       </div>
      </div>
    </div>
  )
}

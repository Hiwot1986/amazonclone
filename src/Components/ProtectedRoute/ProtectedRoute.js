import React,{useContext,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { DataContext } from '../DataProvider/DataProvider'


const ProtectedRoute = ({children,msg,redirect}) => {
    const navigate = useNavigate()
    const [{user},dispatch]= useContext(DataContext)


    useEffect(()=>{
        if (user) {
            navigate("/auth",{state:{msg}})
        }

    },[])
  return (
    <div>ProtectedRoute</div>
  )
}
// payment--->/auth (/)
<ProtectedRoute></ProtectedRoute>





export default ProtectedRoute
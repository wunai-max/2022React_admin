
import React, { useEffect } from 'react'
import memeoryUtils from '../../utils/memoryUtils'
import { useNavigate } from 'react-router-dom'


function Admin() {

    const navigate = useNavigate()
    const user = memeoryUtils.user
    
    useEffect(() => {
        console.log('初始化只执行一次')
        
        if(!user._id) { 
            return navigate('/login')
         }
        return () => {
            // componentWillUnmount
            console.log('你离开了admin')
        }
    }, [])

    return (
        <div>
          <div>Hello {user.username}</div>
        </div>
    )
}

export default Admin; 

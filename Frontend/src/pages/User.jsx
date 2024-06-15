import React, { useEffect } from 'react'

function User() {

  const fetchUserData = async()=>{
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/user/finance-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json()
        console.log(data);
        return;
      } else {
        console.error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(()=>{
    fetchUserData();
  },[])

  return (
    <div>
      {/* Text-Data */}
      <div className='flex w-full justify-around'>
        <div className='bg-red-400'>Expense</div>
        <div className='bg-green-400'>Income</div>
        <div className='bg-blue-400'>Saving</div>
      </div>
    </div>
  )
}

export default User
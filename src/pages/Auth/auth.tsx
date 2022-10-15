import React, { useContext, useState } from 'react'
import APIROUTES from '../../apiRoutes';
import { Button, Input } from '../../components/UI-COMP'
import DataContext from '../../context/DataContext';
import { sleep } from '../../utils';
import Fetch from '../../utils/fetch';
import Notification from "../../utils/toast";
import { validateEmail } from "../../utils/validate";

const notif = new Notification();


function Authentication() {

  const {isAuthenticated} = useContext<any>(DataContext)

  if(isAuthenticated) window.location.href = "/dashboard"

  const [input, setInput] = useState<any>({
    username: "",
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState<any>(false)
  const [step, setStep] = useState(1)

  const toggleStep = (step: number)=> setStep(step)

  const handleInput = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput((prev: any) => ({ ...prev, [name]: value }));
  };

  async function handleAuthData(action: string){
    const {email, password, username} = input;
    const url = action === "login" ? APIROUTES.login : APIROUTES.register

    if (action === "login") {
      if (email === "") return notif.error("email is missing")
      if (!validateEmail(email)) return notif.error("email is invalid")
      if(password === "") return notif.error("password is missing") 

      try {
        // login user
        setLoading(true)
        const {res, data} = await Fetch(url, {
          method: "POST",
          body: JSON.stringify(input)
        });
        setLoading(false)

        if (!data.success) {
          // console.log(data);
          return notif.error(data.message)
        }
        
        notif.success(data.message)
        localStorage.setItem("authToken", JSON.stringify(data.data.accessToken || ""))
        localStorage.setItem("meetvast", JSON.stringify(data.data))
        await sleep(2)
        window.location.href = "/dashboard"
      } catch (e: any) {  
        // console.log(e);
        notif.error(e.message)
        setLoading(false)
      }

    }

    if (action === "register") {
      if (username === "") return notif.error("username is missing")
      if (email === "") return notif.error("email is missing")
      if (!validateEmail(email)) return notif.error("email is invalid")
      if(password === "") return notif.error("password is missing") 

      // register user
      try {
        // login user
        setLoading(true)
        
        const {res, data} = await Fetch(url, {
          method: "POST",
          body: JSON.stringify(input)
        });
        setLoading(false)

        if (!data.success) {
          // console.log(data);
          return notif.error(data.message)
        }
        
        notif.success(data.message)
        toggleStep(1)
      } catch (e: any) {  
        // console.log(e);
        notif.error(e.message)
        setLoading(false)
      }
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start">
      <div className="w-full h-[200px] py-10 text-center">
        <p className="text-blue-300 text-[50px] font-extrabold font-sans ">MeetVast</p>
        <p className="text-white-300 font-extrabold ">
          Ease the Process of Job Application for both <span className="text-blue-200 text-[15px] underline ">Hiring Manager</span> & <span className="text-blue-200 text-[15px] underline ">Candidates</span>
        </p>
      </div>
      {
        step === 1 ?
          <div className="w-[400px] bg-dark-300 p-5">
            <p className="text-white-100 text-[20px] font-extrabold ">Log In</p>
            <Input placeHolder="email" onChange={handleInput} name="email" />
            <Input placeHolder="password" type="password" onChange={handleInput} name="password" />
            <br />
            <br />
            <Button type='primary' text={loading ? "Loading..." : "Log In"} onClick={async ()=>await handleAuthData("login")} />
            <br />
            <br />
            <small className="text-white-200">Dont have an account ? <span className="text-blue-300 cursor-pointer" onClick={()=> toggleStep(2)}>Create one</span> </small>
          </div>
          :
        <div className="w-[400px] bg-dark-300 p-5">
          <p className="text-white-100 text-[20px] font-extrabold ">Register</p>
          <Input placeHolder="Full Name" onChange={handleInput} name="username" />
          <Input placeHolder="email" onChange={handleInput} name="email" />
          <Input placeHolder="password" type="password" onChange={handleInput} name="password" />
          <br />
          <br />
          <Button type='primary' text={loading ? "Loading..." : "Register Account"} onClick={async ()=>await handleAuthData("register")} />
          <br />
          <br />
          <small className="text-white-200">Have an account ? <span className="text-blue-300 cursor-pointer" onClick={()=> toggleStep(1)}>Log In</span> </small>
        </div>
      }
      
      
    </div>
  )
}

export default Authentication

function Login({handleInput, handleAuthData}: any){
    return (
      <div className="w-full p-5">
        <Input placeHolder="email" onChange={handleInput} name="email" />
        <Input placeHolder="password" onChange={handleInput} name="password" />
        <br />
        <br />
        <Button type='priamry' text="Log In" onClick={handleAuthData} />
      </div>
    )
}


function Register({handleInput}: any){
    return (
      <div className="w-full p-5">
        <Input placeHolder="Full Name" onChange={handleInput} name="username" />
        <Input placeHolder="email" onChange={handleInput} name="email" />
        <Input placeHolder="password" onChange={handleInput} name="password" />
        <br />
        <br />
        <Button type='priamry' text="Register Account" />
      </div>
    )
}

import React from "react";

function Login() {
    return (
        <div className="w-[100%] h-[100vh] bg-gray-400 flex justify-center items-center">
            <div className="w-[100%] md:w-[50%] lg:w-[30%] h-[80%] px-3 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Welcome Back</h1>
                <input type="text" placeholder="Email address" className="rounded-xl w-[85%] h-[3rem] border border-gray-400 mb-2" />
                <input type="password" placeholder="Password" className="rounded-xl w-[85%] h-[3rem] border border-gray-400 mb-4" /><br />
                <button className="rounded-2xl w-[80%] py-1.5 px-3 bg-black text-white">Login</button><br />
                <a href="https://www.google.com" className="text-black-500 no-underline hover:underline hover:decoration-blue-800 ">Forgot your password ?</a>
            </div>
        </div>
    )
}
    
export default Login
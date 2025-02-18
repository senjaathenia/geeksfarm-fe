

import { signIn } from "../../../auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Logo } from '../../../index';
import LoginForm from "./loginForm";

function SignIn() {
  return (
    <div className="relative flex h-screen items-center justify-center bg-gray-100 overflow-hidden">
      {/* Circle Backgrounds */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] border-[15px] border-green-500 rounded-full opacity-70 z-0"></div>
      <div className="absolute top-0 right-[-150px] w-[300px] h-[300px] bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-50 z-0"></div>
      <div className="absolute bottom-[-100px] left-[-80px] w-[300px] h-[300px] bg-gradient-to-br from-teal-400 to-teal-600 rounded-full opacity-60 z-0"></div>
      <div className="absolute bottom-0.5 right-[120px] w-[300px] h-[300px] border-[10px] border-purple-400 rounded-full opacity-70 z-0"></div>
      <div className="absolute top-[250px] left-[50px] w-[200px] h-[200px] bg-gradient-to-br from-red-400 to-red-500 rounded-full opacity-50 z-0"></div>
      <div className="absolute top-[20px] right-[450px] w-[250px] h-[250px] border-[12px] border-blue-500 rounded-full opacity-50 z-0"></div>
      <div className="absolute bottom-[20px] right-[900px] w-[220px] h-[220px] bg-gradient-to-br from-purple-600 to-purple-700 rounded-full opacity-50 z-0"></div>

      {/* Form Container */}
      <div className="relative bg-white shadow-xl rounded-3xl flex w-full max-w-4xl overflow-hidden z-10">
        {/* Left Section */}
        <div className="hidden md:flex items-center justify-center w-1/2 bg-white">
          <Image
            src={Logo}
            alt="Geeksfarm"
          />

        </div>

        {/* Right Section */}
        <LoginForm/>
      </div>
    </div>
  );
}

export default SignIn;
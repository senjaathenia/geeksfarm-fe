"use client"

import { signInForm } from "./actions"

const LoginForm = () => {

    return <form
    action={signInForm}
    className="flex flex-col gap-6 p-12 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 w-full md:w-1/2 text-white"
  >
    <h2 className="text-4xl font-bold mb-6 text-center">Sign In</h2>
    <div className="flex flex-col mb-4">
      <label className="text-sm font-semibold mb-2">Email</label>
      <input
        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
        name="email"
        type="email"
        placeholder="Enter your email"
      />
    </div>
    <div className="flex flex-col mb-6">
      <label className="text-sm font-semibold mb-2">Password</label>
      <input
        className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
        name="password"
        type="password"
        placeholder="Enter your password"
      />
    </div>
    <button className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 shadow-lg transition mb-4">
      Sign In
    </button>

  </form>
}

export default LoginForm
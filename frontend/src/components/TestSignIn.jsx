import React from 'react';

const TestSignIn = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Test SignIn Page</h1>
        <p>This is a test to see if routing works</p>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email:</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password:</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestSignIn;
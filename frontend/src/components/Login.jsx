import React from 'react';

const Login = () => {
 return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
     <div className="bg-white p-8 rounded-lg shadow-md w-96">
       <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Connexion</h2>
       <form>
         <div className="mb-4">
           <label className="block text-gray-700 text-sm font-bold mb-2">Nom d'utilisateur</label>
           <input type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Votre pseudo" />
         </div>
         <div className="mb-6">
           <label className="block text-gray-700 text-sm font-bold mb-2">Mot de passe</label>
           <input type="password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="********" />
         </div>
         <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition duration-300">
           Se connecter
         </button>
       </form>
       <p className="mt-4 text-center text-sm text-gray-600">
         Pas de compte ? <a href="/register" className="text-blue-500 hover:underline">S'inscrire</a>
       </p>
     </div>
   </div>
 );
};




export default Login;

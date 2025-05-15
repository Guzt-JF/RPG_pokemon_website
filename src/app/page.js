"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Notification from "@/components/Notification";

export default function Home() {
  
    const [messageFinish, setMessageFinish] = useState("");
    const [logado, setLogado] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined") {
        setLogado(!!localStorage?.getItem("authKey"));
      }
    }, []);
  
  return (
    <main className="flex items-center justify-center p-10">
      <div className="w-100">
        <button
          className="text-white capitalize bg-red-900 hover:bg-red-800 w-full p-2 cursor-pointer"
          onClick={() => (window.location.href = `/pkmn/new`)}
        >
          Novo Pokémon 
        </button>
        <button
          className="text-white capitalize bg-red-900 hover:bg-red-800 w-full mt-4 p-2 cursor-pointer"
          onClick={() => (window.location.href = `/pkmn/list`)}
        >
          Listar Pokémons Cadastrados 
        </button>

        <form className="mt-8 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuário"
            className="p-2 border border-gray-300 rounded"
            autoComplete="username"
          />
          
          <div className="relative">
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="p-2 border border-gray-300 rounded w-full"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-xs bg-transparent-200 px-2 py-1 rounded"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              if (typeof window === "undefined") return;
              if (e.target.disabled) return;
              e.target.disabled = true;
              setMessageFinish("");

              const form = e.target.form;
              const username = form[0].value;
              const password = form[1].value;
              console.log("Usuário:", username);
              console.log("Senha:", password);
                        
              const data = { 
                login: username,
                senha: password,
              };

              try {
                const response = await fetch(`/api/trainer/login`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });
                console.log(response);
                if (!response.ok) {
                  setMessageFinish('Login não encontrado!');
                  return
                }
                const result = await response.json();
                if (!result.length) {
                  setMessageFinish('Login não encontrado!');
                  return
                }
                console.log(result);
                // the security is so fucking weak, but who cares, this is just a small project for fun
                localStorage.setItem("authKey", result[0].trainer_id);
                localStorage.setItem("LoginData", JSON.stringify(result[0]));

                setMessageFinish('Login realizado com sucesso!');

              } catch (err) {
                console.error("Error fetching data:", err);
                setMessageFinish('Login Falhou!');
              } finally {
                e.target.disabled = false;
              }

              // handle submit logic here
            }}
            className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded mt-2"
          >
            Entrar
          </button>
          
          <span className="text-center">
            {logado && (typeof window !== "undefined") && (
              `Logado com sucesso! Bem-vindo ${localStorage.getItem('LoginData') ? JSON.parse(localStorage.getItem('LoginData'))?.name : ''}!`
            )}
          </span>
        </form>
      </div>
        <Notification
          color="red"
          message={messageFinish}
          setMessage={setMessageFinish}
        />
    </main>
  );
}

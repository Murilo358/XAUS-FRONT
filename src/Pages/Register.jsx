
const Register = () => {

const HandleRegister= (e) => {
    e.preventDefault();
}

  return (
    <div>
         <form onSubmit={(e)=> HandleRegister(e)}>
        <input type="name" name="name" placeholder='Insira seu name' />    
        <input type="cpf" name="cpf" placeholder='Insira seu cpf' />    
        <input type="email" name="email" placeholder='Insira seu email' />
        <input type="birthDate" name="birthDate" placeholder='Insira sua data de nascimento' />   
        <input type="password" name="password" placeholder='Insira sua senha'/>
        <button type="submit" className="p-4 bg-red-600 text-slate-50">
            Logar
        </button>
        </form>      

    </div>
  )
}

export default Register
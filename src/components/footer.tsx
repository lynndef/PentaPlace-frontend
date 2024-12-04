export function Footer(){
    return(
        <footer className="bg-[#373737] text-white h-[50px] flex items-center w-full">
        <div className="flex gap-5 pl-12">
          <a href="/termos">Sobre</a>
          <a href="/termos">Termos de uso</a>
          <a href="/termos">Privacidade</a>
          <a href="/termos">Ajuda</a>
          <a href="/termos">Contato</a>
        </div>
        <div className=" absolute left-1/2 transform -translate-x-1/2">
          <img src="/src/assets/pentaplace.svg" alt="Pentaplace Logo" />
        </div>
      </footer>
    )
}
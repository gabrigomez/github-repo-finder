import { useState } from 'react';
import { GithubLogo, MagnifyingGlass } from 'phosphor-react';

interface Repo {
  name: string;
  html_url: string;
  language: string;
}

interface User {
  public_repos: number;
  avatar_url: string;
  login: string;
  html_url: string;   
}

function App() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [search, setSearch] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<User>({public_repos: 0, avatar_url: '', login: '', html_url: ''})

  const totalRepos = user.public_repos;
  const pageNumbers: number[] = [];

  for (let i= 1; i <= Math.ceil(totalRepos / 10); i++) {
    pageNumbers.push(i);
  };
  
  const filteredRepos = search.length > 0
    ? repos.filter(repo => repo.name.includes(search))
    : [];
    
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    fetch(`https://api.github.com/users/${userName}`).then((response) => {
      if (response.ok) {
        return response.json()
          .then(data => setUser(data));
      }
      throw new Error('Something went wrong');
    })
    .catch((error) => {
      setRepos([]);
      setError(error);
    });

    fetch(`https://api.github.com/users/${userName}/repos?per_page=10`).then((response) => {
      if (response.ok) {
        return response.json()
          .then(data => setRepos(data));
      }
      throw new Error('Something went wrong');
    })
    .catch((error) => {
      setRepos([]);
      setError(error);
    });
    
  }

  const handlePaginate = (number:Number) => {
      fetch(`https://api.github.com/users/${userName}/repos?per_page=10&page=${number}`).then((response) => {
        if (response.ok) {
          return response.json()
          .then(data => setRepos(data));
        }
        throw new Error('Something went wrong');
      })
      .catch((error) => {
        setRepos([]);
        setError(error);
      });    
  }

  console.log(user)

  return (
    <div className="App mt-20">
      <div className='flex flex-col items-center'>
        <div className='flex flex-col mb-8 items-center'>
          <GithubLogo className='text-9xl text-gray-900' />
          <p className='text-3xl font-medium'>
            Github Repo Finder
          </p>
        </div>
        <div className='flex flex-col items-center mb-4 w-2/4'>
          <div className='mb-4'>
            <form className='flex items-center' onSubmit={handleSubmit}>
              <input 
                name='search-user'
                className='border-b border-black'
                type="text" 
                placeholder='Digite o nome do usuário'
                value={userName}
                onChange={e => setUserName(e.target.value)}
              />
              <button className='ml-4 p-1 bg-slate-200 rounded-md hover:bg-blue-300 duration-300'>
                <MagnifyingGlass className='text-2xl' />
              </button>
            </form>
          </div>
          {repos.length > 0 ? (
            <div className='flex flex-col w-3/5'>
              <div className='flex items-center justify-center my-7'>
                <img src={user.avatar_url} alt="" className='h-32 w-32 rounded-full mr-4 border border-blue-400' />
                <div className='flex flex-col'>
                  <p className='flex justify-center text-3xl font-semibold'>
                    {user.login}
                  </p>
                  <p className='flex justify-center text-md mb-2'>
                    Total of repositories: {user.public_repos}
                  </p>
                  <a className='flex justify-center' href={user.html_url}>
                    <GithubLogo 
                      className='text-slate-400 hover:text-blue-400 text-4xl p-1 border 
                      rounded-full border-slate-200 hover:bg-slate-100 duration-200' />
                  </a>                  
                </div>

              </div>
              <input
                name='search-repo'
                className='border-b border-black mb-4' 
                type="text"
                placeholder='Filtre o repositório'
                onChange={e => setSearch(e.target.value)}
                value={search}
                />          
              {search.length > 0 ? ( 
                <div>                  
                  {filteredRepos.map(repo => {
                    return (
                      <div className='flex' key={repo.name}>
                        <a className='text-lg font-medium hover:text-blue-800' href={repo.html_url}>
                          {repo.name}
                        </a>
                        <p className='flex ml-2 text-sm text-blue-400 items-center'>
                          {repo.language}
                        </p>                                      
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className='flex flex-col h-[330px] justify-between'>
                  <div>
                    {repos.map(repo => {
                      return (
                        <div className='flex' key={repo.name}>
                          <a className='text-lg font-medium hover:text-blue-600' href={repo.html_url}>
                            {repo.name}
                          </a>
                          <p className='flex ml-1 text-xs text-blue-500 items-center'>
                            {repo.language}
                          </p> 
                        </div>
                      )
                    })}
                  </div>
                <nav className='flex justify-center text-md' >
                  <ul className='flex'>
                    {pageNumbers.map(number => (
                      <li key={number} className='m-1'>
                        <button 
                          className='hover:bg-gray-100 hover:text-blue-700 leading-tight py-2 px-3 rounded-md' 
                          onClick={() => handlePaginate(number)}>
                          {number}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
                </div>
              )}
            </div>
          
          ) : (
            <div className='flex justify-center'>
              {error ? (
                <div>
                  <p className='text-red-500 font-bold'>
                    Usuário não encontrado
                  </p>
                </div>
              ) : (
                <>
                </>
              )}        
            </div>
          )}
        </div>
      </div>        
    </div>
  );
}

export default App;
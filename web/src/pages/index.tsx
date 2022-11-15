import Image from 'next/image'
import appPreviewImage from '../assets/app-nlw-preview.png'
import logoImage from '../assets/logo.svg'
import usersAvatarExampleImage from '../assets/users-avatar-example.png'
import iconCheckImage from '../assets/icon-check.png'
import { api } from '../lib/axios'
import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolName, setPoolName] = React.useState('')

  async function createPool (e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolName
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso, o código foi copiado para a área de transferência!')

      setPoolName('')
    } catch (error) {
      alert('Falha ao criar o bolão, tente novamente!')    
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid md:grid-cols-2 items-center gap-28 p-4' >
      <main>
        <Image 
          src={logoImage} 
          alt="NLW Copa" 
        />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight' >
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2' >
          <Image  src={usersAvatarExampleImage} alt="" />

          <strong className='text-gray-100 text-xl' >
            <span className='text-ignite-500' >+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form
          onSubmit={createPool} 
          className='mt-10 flex gap-2'
        >
          <input 
            type="text" 
            value={poolName}
            onChange={event => setPoolName(event.target.value)}
            required 
            placeholder='Qual nome do seu bolão?'
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
          />

          <button 
            type="submit"
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-600'
          >
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-gray-300 text-sm leading-relaxed' >
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100' >
          <div className='flex items-center gap-6' >
            <Image src={iconCheckImage} alt="" />
            
            <div className='flex flex-col' >
              <span className='font-bold text-2xl' >+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-10 bg-gray-600' />

          <div className='flex items-center gap-6' >
            <Image src={iconCheckImage} alt="" />
            
            <div className='flex flex-col' >
              <span className='font-bold text-2xl' >+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image 
        src={appPreviewImage} 
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa" 
        quality={100}
      />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [
    poolsResponse, 
    guessesResponse, 
    usersResponse
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ])

  return {
    props: {
      poolCount: poolsResponse.data.count,
      guessCount: guessesResponse.data.count,
      userCount: usersResponse.data.count,
    },
    revalidate: 60 * 60 // 1 hour
  }
}


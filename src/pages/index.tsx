import Image from 'next/image'
import appPreviewImage from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImage from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  pollCount: number,
  guessCount: number,
  userCount: number
}

export default function Home({ pollCount, guessCount, userCount }: HomeProps) {
  const [poll, setPoll] = useState<string>('')

  async function fnCreatePool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/polls', {
        title: poll
      })

      const { code } = response.data
      await navigator.clipboard.writeText(code)
      setPoll('')
      alert('Bolão criado com sucesso, o código foi copiado para sua área de transferência!')
    } catch (error) {
      alert('Falha ao criar o bolão')
    }
  }

  return (
    <div className='max-w-[1124px] mx-auto grid grid-cols-2 items-center h-screen gap-28'>
      <main>
        <Image src={logoImg} alt='NLW Copa' />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'> 
          <Image src={usersAvatarExampleImage} alt='' />
          <strong className='text-gray-100 text-xl' >
            <span className='text-ignite-500'>+{userCount}</span> pessoas já estão usando
          </strong>
        </div> 

        <form onSubmit={fnCreatePool} className='mt-10 flex gap-2'>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text"
            required
            value={poll}
            onChange={event => setPoll(event.target.value)}
            placeholder='Qual o nome do seu bolão'
          />
          <button
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
            type='submit'
          >
            Criar o meu bolão
          </button>
        </form>
        <p className='text-gray-300 mt-4 text-sm leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p> 
        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt='' />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{pollCount}</span>
              <span>Bolões criados </span>
            </div>
          </div>
          <div className='w-px h-14 bg-gray-600'  />
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt='' />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{guessCount}</span>
              <span>Palpites enviados </span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do Copa Bolao"
        quality={100}
      />
    </div>
  )
}

// TODO: Migrar para getStaticProps
// TODO: Configurar o Tailwind para SSR
export const getServerSideProps = async () => {
  const [pollCountResponse,  guessCountResponse, userCountResponse] = await Promise.all([
    api.get('/polls/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}

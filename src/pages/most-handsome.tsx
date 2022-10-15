import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { trpc } from '../utils/trpc'

// Capitalize first letter of string
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const MostHandsome: NextPage = () => {
  const { data: pokemon } = trpc.useQuery(['pokemon.get-most-handsome'])

  return (
    <div className='mx-auto flex max-w-5xl flex-col items-center py-12'>
      <h1 className='text-center text-2xl font-bold'>List of most handsome pokemon:</h1>
      <Link href='/'>
        <a className='pt-4 text-xs underline'>Back to voting</a>
      </Link>
      <ul className='mx-auto grid w-1/2 grid-cols-2 place-items-center py-6'>
        {pokemon?.map((p) => (
          <li key={p.id} className='flex w-full items-center gap-2'>
            <div className='relative h-12 w-12'>
              <Image src={p.imgUrl} layout='fill' alt='pokemon' objectFit='cover' />
            </div>
            <div className='flex flex-col'>
              <h4>{capitalize(p.name)}</h4>
              <p className='text-xs text-gray-500'>Votes: {p.votes}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MostHandsome

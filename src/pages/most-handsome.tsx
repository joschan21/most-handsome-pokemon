import Image from 'next/image'
import { FC } from 'react'
import { trpc } from '../utils/trpc'

interface MostHandsomeProps {}

const MostHandsome: FC<MostHandsomeProps> = ({}) => {
  const { data: pokemon } = trpc.useQuery(['pokemon.get-most-handsome'])

  return (
    <div>
      <h1>List of most handsome pokemon:</h1>
      <ul>
        {pokemon?.map((p) => (
          <li key={p.id} className='flex items-center gap-2'>
            <h4>{p.name}</h4>
            <div className='relative h-12 w-12'>
              <Image src={p.imgUrl} layout='fill' alt='pokemon' objectFit='cover' />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MostHandsome

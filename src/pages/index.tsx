import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PokemonType } from '../shared/typings'
import { LEADERBOARD_NAV } from '../utils/constants'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  const [pokemonList, setPokemonList] = useState<PokemonType[]>([])
  const [fetchedEnoughPokemon, setFetchedEnoughPokemon] = useState<boolean>(false)

  const { data: pokemon, refetch } = trpc.useQuery(['pokemon.get-random'], {
    onSuccess: (data) => {
      setPokemonList((prev) => [...prev, data])

      // checking state inside of tRPC does not work reliably due to state batching
      // this would not work, resulting in 3 fetched pokemon
      // if (pokemonList.length < 2) refetch()
    },
    enabled: !fetchedEnoughPokemon,
  })

  useEffect(() => {
    if (pokemonList.length < 2) refetch()
    else setFetchedEnoughPokemon(true)
  }, [pokemonList.length])

  // Handle reset pokemon
  const resetPokemon = () => {
    setPokemonList([])
  }

  // Handle pokemon voting
  const { mutate: vote } = trpc.useMutation(['pokemon.vote'], {
    onSuccess: () => {
      resetPokemon()
    },
  })

  // Voting function
  const handleVote = (id: number, imgUrl: string, name: string) => {
    vote({ id, imgUrl, name })
  }

  if (!pokemon) return <p>Loading...</p>

  // Capitalize first letter of string
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  return (
    <>
      <Head>
        <title>Pokemon Beauty Contest</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* Make an either or choice between the 2 pokemon in pokeList */}
      <div className='flex min-h-screen flex-col items-center justify-center py-2'>
        <main className='flex w-full flex-col items-center justify-center px-20 text-center'>
          <h1 className='mb-12 text-6xl font-bold'>Pokemon Beauty Contest</h1>

          <div className='flex min-h-[15rem] items-center'>
            {pokemonList[0] && pokemonList[1] && (
              <div className='relative grid grid-cols-2 gap-4'>
                <button
                  type='button'
                  onClick={() =>
                    handleVote(
                      pokemonList[0]!.id,
                      pokemonList[0]!.sprites.front_default,
                      pokemonList[0]!.name
                    )
                  }
                  className='rounded-md bg-blue-100 p-8 shadow'>
                  <h2 className='text-4xl font-bold'>{capitalize(pokemonList[0].name)}</h2>
                  <div className='relative h-32 w-32'>
                    <Image
                      src={pokemonList[0].sprites.front_default}
                      alt={pokemonList[0].name}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                </button>

                <button
                  type='button'
                  onClick={() =>
                    handleVote(
                      pokemonList[1]!.id,
                      pokemonList[1]!.sprites.front_default,
                      pokemonList[1]!.name
                    )
                  }
                  className='rounded-md bg-red-100 p-8 shadow'>
                  <h2 className='text-4xl font-bold'>{capitalize(pokemonList[1].name)}</h2>
                  <div className='relative h-32 w-32'>
                    <Image
                      src={pokemonList[1].sprites.front_default}
                      alt={pokemonList[1].name}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                </button>

                {/* 'OR' seperator */}
                <div className='pointer-events-none absolute inset-0 grid place-items-center'>
                  <div className='grid h-12 w-12 place-items-center rounded-full bg-black text-white outline outline-[8px] outline-white'>
                    or
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Link href={LEADERBOARD_NAV}>
          <a className='pt-12 text-xs underline'>See leaderboard</a>
        </Link>
      </div>
    </>
  )
}

export default Home

import { TRPCError } from '@trpc/server'
import { PokemonType } from '../../shared/typings'
import { createRouter } from './context'
import { z } from 'zod'

// random number between 0 and 100
const getRandomPokemonId = () => Math.floor(Math.random() * 100)

// limit number between 1 and 100
const limitPokemonId = (id: number) => Math.max(1, Math.min(100, id))

export const pokeRouter = createRouter()
  .query('get-random', {
    async resolve() {
      const id = limitPokemonId(getRandomPokemonId())

      try {
        // fetch random pokemon from api
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const pokemon = (await res.json()) as PokemonType
        return pokemon
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: (err as any).message,
        })
      }
    },
  })

  .mutation('vote', {
    input: z.object({
      id: z.number(),
      imgUrl: z.string(),
      name: z.string(),
    }),
    async resolve({ input, ctx }) {
      await ctx.prisma.pokemon.upsert({
        where: {
          id: input.id,
        },
        create: {
          id: input.id,
          votes: 1,
          imgUrl: input.imgUrl,
          name: input.name,
        },
        update: {
          votes: {
            increment: 1,
          },
        },
      })
    },
  })

  .query('get-most-handsome', {
    async resolve({ ctx }) {
      const pokemon = await ctx.prisma.pokemon.findMany({
        take: 20,
        orderBy: {
          votes: 'desc',
        },
      })

      return pokemon
    },
  })

import { FlatList, useToast } from 'native-base';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from './Game';
import { Loading } from '../components/Loading'
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Share } from 'react-native';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')

  const toast = useToast()

  async function fetchGames() {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${poolId}/games`)

      setGames(response.data.games)
      
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Não foi possível carregar os jogos!',
        bgColor: 'red.500',
        placement: 'top'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGuessConfirm (gameId: string) {
    try {
      setIsLoading (true)
      
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informar placar do palpite!',
          bgColor: 'red.500',
          placement: 'top'
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      })

      toast.show({
        title: 'Palpite enviado com sucesso!',
        bgColor: 'green.500',
        placement: 'top'
      })

      fetchGames()
    } catch (error) {
      console.log(error)

      if (error.response?.data?.message === 'You cannout send guesses after the game date.') {
        toast.show({
          title: 'O jogo já aconteceu!',
          placement: 'top',
          color: 'red.500'
        })

        return 
      }

      toast.show({
        title: 'Não foi possível enviar o palpite!',
        bgColor: 'red.500',
        placement: 'top'
      })
    } finally {
      setIsLoading (false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [poolId])

  async function handleCodeShare() {
    await Share.share({
      message: code,
    })
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoints as any}
          setSecondTeamPoints={setSecondTeamPoints as any}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      ListEmptyComponent={() => (
        <EmptyMyPoolList 
          code={code} 
          onShare={handleCodeShare} 
        />
      )}
    />
  );  
}

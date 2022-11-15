import { VStack, Heading, useToast } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')

  const toast = useToast()
  const { navigate } = useNavigation()

  async function handleJoinPools() {
    try {
      setIsLoading(true)

      if(!code.trim()) {
        return toast.show({
          title: 'Informe o código!',
          placement: 'top',
          color: 'red.500'
        })
      }

      await api.post('/pools/join', { code })

      toast.show({
        title: 'Você entrou no bolão com sucesso!',
        placement: 'top',
        color: 'green.500'
      })

      navigate('pools')
    } catch (error) {
      console.log(error)
      setIsLoading(false)

      if (error.response?.data?.message === 'Pool not found.') {
        toast.show({
          title: 'Bolão não encontrado!',
          placement: 'top',
          color: 'red.500'
        })

        return 
      }

      if (error.response?.data?.message === 'You already joined this pool.') {
        toast.show({
          title: 'Você já está nesse bolão!',
          placement: 'top',
          color: 'red.500'
        })

        return 
      }

      toast.show({
        title: 'Não foi possível acessar o bolão!',
        placement: 'top',
        color: 'red.500'
      })
    }
  }

  return (
    <VStack bg='gray.900' flex={1} >
      <Header title='Buscar por código' showBackButton />

      <VStack mt={8} mx={5} alignItems='center' >
        <Heading fontFamily='heading' color='white' fontSize='xl' mb={8} textAlign='center' >
          Encontre um bolão através de seu código único
        </Heading>
 
        <Input 
          mb={2}
          placeholder='Qual o código do bolão?'
          onChangeText={setCode}
          value={code}
          autoCapitalize='characters'
        />

        <Button 
          title='BUSCAR BOLÃO'
           isLoading={isLoading}
          onPress={handleJoinPools}
        />
      </VStack>
    </VStack>
  )
}
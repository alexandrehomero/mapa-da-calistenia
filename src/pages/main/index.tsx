import { block } from 'million'
import { FC } from 'react'
import { styled } from 'styled-components'
import MapComponent from '../../components/map'
import FormComponent from '../../components/form'

const Main = () => {
  return (
    <Container>
      <MapComponent />
    </Container>
  )
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
`

export default Main
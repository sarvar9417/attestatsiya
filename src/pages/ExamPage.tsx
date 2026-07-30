import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MockExamView from '../components/learning/MockExamView'

export default function ExamPage() {
  const navigate = useNavigate()
  const [examDone, setExamDone] = useState(false)

  if (examDone) {
    return null
  }

  return (
    <MockExamView
      onBack={() => navigate('/')}
      onComplete={() => {
        setExamDone(true)
        navigate('/')
      }}
    />
  )
}

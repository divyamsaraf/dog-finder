import { useEffect, useState } from 'react'
import { fetchDogById } from '../services/api'
import DogCard from '../components/DogCard'

interface MatchPageProps {
    user: { name: string; email: string };
    matchId: string;
    onBack: () => void;
}

const MatchPage: React.FC<MatchPageProps> = ({ matchId, onBack }) => {
  const [dog, setDog] = useState<any | null>(null)

  useEffect(() => {
    const getMatch = async () => {
      const dog = await fetchDogById(matchId)
      setDog(dog)
    }
    getMatch()
  }, [matchId])

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack} style={{ marginBottom: 20 }}>← Back to Search</button>
      <h2>Your Best Match</h2>
      {dog ? <DogCard {...dog} /> : <p>Loading match...</p>}
    </div>
  )
}

export default MatchPage

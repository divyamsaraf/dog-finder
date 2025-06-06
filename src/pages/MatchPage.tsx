import { useEffect, useState } from 'react'
import { fetchDogsByIds } from '../services/api'
import DogCard from '../components/domain/DogCard'
import { Dog } from '../types'

interface MatchPageProps {
    user: { name: string; email: string };
    matchId: string;
    onBack: () => void;
}

const MatchPage: React.FC<MatchPageProps> = ({ matchId, onBack }) => {
  const [dog, setDog] = useState<Dog | null>(null)

  useEffect(() => {
    const getMatch = async () => {
      try {
        // Use fetchDogsByIds instead of fetchDogById and pass an array with the single ID
        const dogs = await fetchDogsByIds([matchId])
        
        // Check if dogs is an array and has at least one element
        if (Array.isArray(dogs) && dogs.length > 0 && dogs[0]) {
          setDog(dogs[0])
        } else {
          setDog(null)
        }
      } catch (error) {
        console.error('Error fetching dog:', error)
        setDog(null)
      }
    }
    
    if (matchId) {
      getMatch()
    } else {
      setDog(null)
    }
  }, [matchId])

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack} style={{ marginBottom: 20 }}>← Back to Search</button>
      <h2>Your Best Match</h2>
      {dog ? (
        <DogCard 
          dog={dog} 
          isFavorite={false} 
          onToggleFavorite={() => {}} 
        />
      ) : (
        <p>Loading match...</p>
      )}
    </div>
  )
}

export default MatchPage

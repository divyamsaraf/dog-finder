import { useFavorites } from '../store/useFavorites'

interface FavoriteButtonProps {
  dogId: string
  isFavorite: boolean
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ dogId, isFavorite }) => {
  const { addFavorite, removeFavorite } = useFavorites()

  const toggle = () => {
    isFavorite ? removeFavorite(dogId) : addFavorite(dogId)
  }

  return (
    <button onClick={toggle}>
      {isFavorite ? '❤️ Unfavorite' : '🤍 Favorite'}
    </button>
  )
}

export default FavoriteButton

import React from "react";
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io'

const FavHeart = ({ fav_b, addFav }) => {
  // Conditionally render & return a heart JSX snippet if the parent course component is favourited
  return (fav_b ? (
    <IoIosHeart
      onClick={() => {addFav()}}
      style={{ color: 'red', cursor: 'pointer' }}
    />
  ): (
    <IoIosHeartEmpty
      onClick={() => {addFav()}}
      style={{ color: 'red', cursor: 'pointer' }}
    />
  ))
}

export default FavHeart;
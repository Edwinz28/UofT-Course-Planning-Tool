import React from "react";
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io'

const FavHeart = ({ fav_b }) => {
  // Conditionally render & return a heart JSX snippet if the parent course component is favourited
  return (fav_b ? (
    <IoIosHeart style={{ color: 'red' }}></IoIosHeart>
  ): (
    <IoIosHeartEmpty style={{ color: 'red' }}></IoIosHeartEmpty>
  ))
}

export default FavHeart;
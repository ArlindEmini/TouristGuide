import React, { useState, useContext } from "react";
import { FaStar } from "react-icons/fa";

// import { useHttpClient } from '../../shared/hooks/http-hook';
// import { AuthContext } from '../../shared/context/auth-context';
import "./StarRating.css";

const StarRating = (props) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  // const auth = useContext(AuthContext);
  // const { sendRequest } = useHttpClient();

  // let ratingValuee = 0; 

  // const onClickHandler = async () => {
  //    setRating(ratingValuee)
    
  //   try{
  //     const formData = new FormData();
  //     formData.append('rating', rating);
  //     await sendRequest('http://localhost:5000/api/places/rating', 'POST', formData, {
  //       Authorization: 'Bearer ' + auth.token
  //     });
  //   }catch(err){}
  // }

  return (
    <div className="StarRating">
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        // ratingValuee = ratingValue;
        return (
          <label key={ratingValue}>
            <input             
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
            />
            <FaStar
              className="star"
              size={40}
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
      {/* <p>The rating star is {rating}.</p> */}
    </div>
  );
};

export default StarRating;

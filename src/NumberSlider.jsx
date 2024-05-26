import React from 'react';
import "./form.css";

const NumberSlider = ({ title, Number, setNumber, getFunction }) => {
  return (
    <div className='form-container'>
      <label htmlFor="lifeSpanSlider">{title} :</label>
      <input className="range"
        type="range"
        id="lifeSpanSlider"
        name="lifeSpanSlider"
        min={7}
        max={16}
        value={Number}
        onChange={(e) => setNumber(parseInt(e.target.value))}
      />
      <span>{Number}</span>
      <button className="slider-button" onClick={getFunction}> Search </button>
    </div>
  );
};

export default NumberSlider;
import {useState} from 'react';
import styles from './BMI.module.css'

export function BMI() {

  // state
  const [weight, setWeight] = useState(0)
  const [height, setHeight] = useState(0)
  const [bmi, setBmi] = useState('')
  const [message, setMessage] = useState('')



  let calcBmi = (event) => {
    //prevent submitting
    event.preventDefault()

    if (weight === 0 || height === 0) {
      alert('Please enter a valid weight and height')
    } else {
      let bmi = (weight / (height * height) * 703)
      setBmi(bmi.toFixed(1))

      // Logic for message

      if (bmi < 25) {
        setMessage('You are underweight')
      } else if (bmi >= 25 && bmi < 30) {
        setMessage('You are a healthy weight')
      } else {
        setMessage('You are overweight')
      }
    }
  }

  //  show image based on bmi calculation
  let imgSrc;

  // if (bmi < 1) {
  //   imgSrc = null
  // } else {
  //   if(bmi < 25) {
  //     imgSrc = '/assets/underweight.png'
  //   } else if (bmi >= 25 && bmi < 30) {
  //     imgSrc = '/assets/healthy.png'
  //   } else {
  //     imgSrc = '/assets/overweight.png'
  //   }
  // }


  let reload = () => {
    window.location.reload()
  }

  const center = {
    textAlign:'center'
  }

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <h2 className={styles.center}>BMI Calculator</h2>
        <form onSubmit={calcBmi}>
          <div>
            <label>Weight (lbs)</label>
            <input value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div>
            <label>Height (in)</label>
            <input value={height} onChange={(event) => setHeight(event.target.value)} />
          </div>
          <div>
            <button className={styles.btn} type='submit'>Submit</button>
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={reload} type='submit'>Reload</button>
          </div>
        </form>

        <div className={styles.center}>
          <h2>Your BMI is: {bmi}</h2>
          <p>{message}</p>
        </div>

        <div style={center}>
          <img src={imgSrc} alt=''></img>
        </div>
      </div>
    </div>
  );
}
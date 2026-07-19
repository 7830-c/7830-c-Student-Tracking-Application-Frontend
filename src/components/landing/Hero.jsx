import styles from "./Hero.module.css";
import heroImage from "../../assets/images/hero.svg";

function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.left}>
        <h1>Track Student Progress Efficiently</h1>

        <p>
          A modern platform to manage attendance, academics,
          performance and student progress in one place.
        </p>

        <div className={styles.buttons}>
          <button className={styles.primaryBtn}>Get Started</button>
          <button className={styles.secondaryBtn}>Learn More</button>
        </div>
      </div>

      <div className={styles.right}>
        <img src={heroImage} alt="Student Tracking" />
      </div>
    </section>
  );
}

export default Hero;
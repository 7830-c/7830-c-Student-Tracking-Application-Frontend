import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Statistics from "../../components/landing/Statistics";
import Footer from "../../components/layout/Footer";

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Statistics />
      <Footer />
    </>
  );
}
export default Landing;
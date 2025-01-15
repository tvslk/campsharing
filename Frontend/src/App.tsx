import { Header } from "./components/header/header";
import { HeroSection } from "./components/hero-section/hero-section";
import { CardSection } from "./components/card-section/card-section";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Header />
      <HeroSection className="heroSection" />
      <CardSection />
    </div>
  );
}
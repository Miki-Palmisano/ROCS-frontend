import Header from "../components/header";
import Slider from "../components/slider";


export default function Home() {
  return (
    <>
    <Header />
    <h1 style={{color:'#fff'}}>I più popolari</h1>
    <Slider />
    <h1 style={{color:'#fff'}}>Solo perché sei tu</h1>
    <Slider />
    </>
  );
}
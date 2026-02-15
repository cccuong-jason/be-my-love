import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Letters from "@/components/Letters";
import Interactive from "@/components/Interactive";
import QuizGame from "@/components/Games/QuizGame";
import FloatingAssets from "@/components/FloatingAssets";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <FloatingAssets />
      <Hero />
      <Journey />
      <Letters />
      <QuizGame />
      <Interactive />
      <Footer />
    </main>
  );
}

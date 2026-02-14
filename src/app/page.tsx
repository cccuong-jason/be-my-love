import Hero from "@/components/Hero";
import FloatingHearts from "@/components/FloatingHearts";
import Journey from "@/components/Journey";
import Letters from "@/components/Letters";
import Interactive from "@/components/Interactive";
import QuizGame from "@/components/Games/QuizGame";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <FloatingHearts />
      <Hero />
      <Journey />
      <Letters />
      <QuizGame />
      <Interactive />
      <Footer />
    </main>
  );
}

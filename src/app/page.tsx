import Link from "next/link";
import styles from "./landing.module.css";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Sparkles, Lock, Heart } from "lucide-react";

export default function LandingPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Be My Love</h1>
        <p className={styles.subtitle}>
          Create a beautiful, personalized digital journey to celebrate your love story.
          Perfect for anniversaries, proposals, or just because.
        </p>

        <SignedOut>
          <div className={styles.ctaButtonWrapper}>
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
              <button className={styles.ctaButton}>
                Start Your Story
              </button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard" className={styles.ctaButton}>
            Go to Dashboard
          </Link>
        </SignedIn>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}><Sparkles size={48} /></span>
          <h3 className={styles.featureTitle}>Easy Editor</h3>
          <p>Customize every detail with our intuitive visual editor.</p>
        </div>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}><Lock size={48} /></span>
          <h3 className={styles.featureTitle}>Private & Secure</h3>
          <p>Your story effectively locked away until you choose to share it.</p>
        </div>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}><Heart size={48} /></span>
          <h3 className={styles.featureTitle}>Share the Love</h3>
          <p>Get a unique link to send to your special someone.</p>
        </div>
      </section>
    </main>
  );
}

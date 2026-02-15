"use client";
import { useState } from 'react';
import { useContentStore } from '@/store/contentStore';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Games.module.css';

export default function QuizGame() {
    const quiz = useContentStore((state) => state.quiz);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isWrong, setIsWrong] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const handleAnswer = (index: number) => {
        const currentQuestion = quiz.questions[currentQ];
        setSelectedOption(index);

        if (index === currentQuestion.answer) {
            // Correct
            const message = currentQuestion.celebration || "Correct! 🎉";
            setToastMessage(message);
            setShowToast(true);

            // Wait for toast to be read before moving on
            setTimeout(() => {
                setShowToast(false);
                if (currentQ < quiz.questions.length - 1) {
                    setCurrentQ(currentQ + 1);
                    setSelectedOption(null);
                } else {
                    setScore(score + 1);
                    setFinished(true);
                    triggerWin();
                }
            }, 2000); // 2 seconds to read the cute message
        } else {
            // Wrong
            setIsWrong(true);
            setTimeout(() => {
                setIsWrong(false);
                setSelectedOption(null);
            }, 800);
        }
    };

    const triggerWin = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                shapes: ['heart'] as any,
                colors: ['#FF69B4', '#FF1493', '#C71585']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                shapes: ['heart'] as any,
                colors: ['#FF69B4', '#FF1493', '#C71585']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    const restart = () => {
        setCurrentQ(0);
        setScore(0);
        setFinished(false);
        setSelectedOption(null);
    };

    if (finished) {
        return (
            <section className={styles.gameSection}>
                <h2>{quiz.title}</h2>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={styles.winCard}
                >
                    <h3>❤️ Perfect Score! ❤️</h3>
                    <p>{quiz.celebrationText || "You know us properly!"}</p>
                    <button onClick={restart} className={styles.resetBtn}>Play Again</button>
                </motion.div>
            </section>
        );
    }

    const question = quiz.questions[currentQ];

    return (
        <section className={styles.gameSection}>
            <h2>{quiz.title}</h2>
            <div className={styles.quizCard}>
                <div className={styles.progressBarContainer}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }}
                    ></div>
                </div>
                <div className={styles.progressText}>Question {currentQ + 1} of {quiz.questions.length}</div>

                {question.image && (
                    <div className={styles.questionImageContainer}>
                        <img
                            src={question.image}
                            alt="Question Illustration"
                            className={styles.questionImage}
                        />
                    </div>
                )}

                <h3 className={styles.questionText}>{question.question}</h3>

                <div className={styles.optionsGrid}>
                    {question.options.map((opt, i) => (
                        <button
                            key={i}
                            className={`${styles.optionBtn} ${selectedOption === i ? (isWrong ? styles.wrong : styles.correct) : ''}`}
                            onClick={() => handleAnswer(i)}
                            disabled={selectedOption !== null}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                <AnimatePresence>
                    {showToast && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={styles.toast}
                        >
                            {toastMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

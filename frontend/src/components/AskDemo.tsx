import React, { useState, useEffect } from 'react';
import './AskDemo.css';

const DEMO_DATA = [
  { 
    q: "What are the key points of Chapter 4 in my biology notes?",
    a: "Chapter 4 covers cell division. Mitosis has four stages, prophase, metaphase, anaphase and telophase, and it produces two identical cells.",
    bold: "Chapter 4 covers cell division.",
    sources: ["Biology notes.pdf", "Lecture 4 slides.pptx"] 
  },
  { 
    q: "Explain Newton's second law in simple words",
    a: "Force equals mass times acceleration. The heavier an object is, the more force it needs to speed up. Your teacher's example used a loaded shopping cart.",
    bold: "Force equals mass times acceleration.",
    sources: ["Physics class notes.docx", "Formula sheet.pdf"] 
  },
  { 
    q: "When is my chemistry exam and what should I revise?",
    a: "The exam is on 18 October. Revise the periodic table trends, chemical bonding and the practice questions from week 6.",
    bold: "The exam is on 18 October.",
    sources: ["Exam timetable.pdf", "Chemistry syllabus.docx"] 
  },
  { 
    q: "Make 5 quiz questions from my history notes",
    a: "Here is question 1 of 5: Which treaty ended the First World War? I have also made 4 more from your notes on the causes and outcomes.",
    bold: "Here is question 1 of 5:",
    sources: ["History notes.pdf", "Revision list.docx"] 
  }
];

const AskDemo = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  
  useEffect(() => {
    let timeoutId: number;
    let intervalId: number;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTypedText(DEMO_DATA[0].q);
      setShowAnswer(true);
      return;
    }

    const currentItem = DEMO_DATA[currentIndex];
    
    // Reset state for new item
    setTypedText('');
    setShowAnswer(false);

    let charIndex = 0;
    
    // 1. Type the question
    const startTyping = () => {
      intervalId = setInterval(() => {
        if (charIndex < currentItem.q.length) {
          setTypedText(currentItem.q.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(intervalId);
          // 2. Pause 350ms, then show answer
          timeoutId = setTimeout(() => {
            setShowAnswer(true);
            
            // 3. Keep answer visible for 4.5s
            timeoutId = setTimeout(() => {
              setShowAnswer(false);
              
              // 4. Fade out, pause 600ms, then next question
              timeoutId = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % DEMO_DATA.length);
              }, 600);
            }, 4500);
          }, 350);
        }
      }, 38);
    };

    // Initial small delay before starting to type
    timeoutId = setTimeout(startTyping, 100);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [currentIndex]);

  const currentItem = DEMO_DATA[currentIndex];

  const renderAnswer = (answer: string, boldText: string) => {
    if (!answer) return null;
    const parts = answer.split(boldText);
    if (parts.length === 2) {
      return (
        <>
          {parts[0]}
          <strong>{boldText}</strong>
          {parts[1]}
        </>
      );
    }
    // Fallback if bold text doesn't match exactly
    return <span>{answer}</span>;
  };

  return (
    <div className="ask-demo-card" aria-label="Product demo">
      <div className="ask-demo-search">
        <svg className="ask-demo-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <div className="ask-demo-input">
          {typedText}
          <span className="ask-demo-caret"></span>
        </div>
      </div>
      
      <div className={`ask-demo-answer-area ${showAnswer ? 'visible' : ''}`} aria-live="polite">
        <p className="ask-demo-answer-text">
          {renderAnswer(currentItem.a, currentItem.bold)}
        </p>
        <div className="ask-demo-sources">
          {currentItem.sources.map((source, idx) => (
            <span key={idx} className={`ask-demo-source-pill ask-demo-source-${idx + 1}`}>
              {source}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AskDemo;

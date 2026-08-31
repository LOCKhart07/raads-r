"use client"

import React, { useEffect, useState } from "react";
import Questions from "../../data/questions.json";
import Categories from "../../data/categories.json";
import { useRouter } from "next/navigation";

const TOTAL_QUESTIONS = Questions.length;
const TOTAL_PROGRESS_CIRCLES = 80;

type ResponseEntry = {
  questionNumber: number;
  question: string;
  rawValue: number;
  score: number;
  label: string;
};

export default function QuestionPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [totalAnswer, setTotalAnswer] = useState(0);
  const [socialRelatednessAnswer, setSocialRelatednessAnswer] = useState(0);
  const [circumscribedInterestsAnswer, setCircumscribedInterestsAnswer] = useState(0);
  const [languageAnswer, setLanguageAnswer] = useState(0);
  const [sensoryMotorAnswer, setSensoryMotorAnswer] = useState(0);

  const [responses, setResponses] = useState<ResponseEntry[]>([]);

  const questionNumber = currentIndex + 1;
  const currentProgressIndex = Math.min(currentIndex, TOTAL_PROGRESS_CIRCLES - 1);
  const filledProgressCount = Math.min(
    Math.max(currentIndex + (selectedAnswer !== null ? 1 : 0), 0),
    TOTAL_PROGRESS_CIRCLES,
  );

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  function nextQuestion() {
    if (selectedAnswer === null) {
      return;
    }

    const score = Categories["Normative"].includes(questionNumber)
      ? 3 - selectedAnswer
      : selectedAnswer;

    const nextTotal = totalAnswer + score;
    let nextSocial = socialRelatednessAnswer;
    let nextCircumscribed = circumscribedInterestsAnswer;
    let nextLanguage = languageAnswer;
    let nextSensory = sensoryMotorAnswer;

    if (Categories["Social Relatedness"].includes(questionNumber)) {
      nextSocial += score;
    }
    else if (Categories["Circumscribed Interests"].includes(questionNumber)) {
      nextCircumscribed += score;
    }
    else if (Categories["Language"].includes(questionNumber)) {
      nextLanguage += score;
    }
    else if (Categories["Sensory Motor"].includes(questionNumber)) {
      nextSensory += score;
    }
    else {
      router.push('/error');
      return;
    }

    const answerLabels: Record<number, string> = {
      3: "A) True now and when I was young",
      2: "B) True only now",
      1: "C) True only when I was younger than 16",
      0: "D) Never true",
    };

    const entry: ResponseEntry = {
      questionNumber,
      question: Questions[currentIndex],
      rawValue: selectedAnswer,
      score,
      label: answerLabels[selectedAnswer],
    };

    const nextResponses = [...responses, entry];

    if (questionNumber == TOTAL_QUESTIONS) {
      sessionStorage.setItem("raadsResults", JSON.stringify({
        totalAnswer: nextTotal,
        socialRelatednessAnswer: nextSocial,
        circumscribedInterestsAnswer: nextCircumscribed,
        languageAnswer: nextLanguage,
        sensoryMotorAnswer: nextSensory,
        responses: nextResponses,
      }));
      router.push('/result');
      return;
    }

    setTotalAnswer(nextTotal);
    setSocialRelatednessAnswer(nextSocial);
    setCircumscribedInterestsAnswer(nextCircumscribed);
    setLanguageAnswer(nextLanguage);
    setSensoryMotorAnswer(nextSensory);
    setResponses(nextResponses);
    setCurrentIndex(currentIndex + 1);
    setSelectedAnswer(null);
  }

  return (
    <main className="question-shell">
      <div className="question-card">
        <h1 className="question-title">
          {questionNumber}.) {Questions[currentIndex]}
        </h1>

        <div className="options-layout">
          <div className="options-list">
            {[
              { value: 3, label: "A) True now and when I was young" },
              { value: 2, label: "B) True only now" },
              { value: 1, label: "C) True only when I was younger than 16" },
              { value: 0, label: "D) Never true" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`option-button ${selectedAnswer === option.value ? "active" : ""}`}
                onClick={() => setSelectedAnswer(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="next-button"
            onClick={nextQuestion}
            disabled={selectedAnswer === null}
            aria-label="Next question"
            title="Choose an answer to continue"
          >
            →
          </button>
        </div>

        <div className="question-actions">
          <button
            type="button"
            className="reset-button"
            onClick={() => {
              sessionStorage.removeItem("raadsResults");
              // want to trigger beforeunload to warn user before resetting
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination
              window.location.href = "/";
            }}
          >
            Reset
          </button>
        </div>

        <div
          className="progress-rail"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TOTAL_PROGRESS_CIRCLES}
          aria-valuenow={filledProgressCount}
          aria-label={`Question progress: ${filledProgressCount} of ${TOTAL_PROGRESS_CIRCLES}`}
        >
          {Array.from({ length: TOTAL_PROGRESS_CIRCLES }, (_, index) => {
            const isFilled = index < filledProgressCount;
            const isCurrent = index === currentProgressIndex;

            return (
              <span
                key={index}
                className={`progress-dot ${isFilled ? "filled" : ""} ${isCurrent ? "current" : ""}`}
                aria-hidden="true"
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

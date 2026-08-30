"use client"

import React, { useEffect, useState } from "react";
import Questions from "../../data/questions.json";
import Categories from "../../data/categories.json";
import { useRouter } from "next/navigation";

const TOTAL_QUESTIONS = Questions.length;

export default function QuestionPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [totalAnswer, setTotalAnswer] = useState(0);
  const [socialRelatednessAnswer, setSocialRelatednessAnswer] = useState(0);
  const [circumscribedInterestsAnswer, setCircumscribedInterestsAnswer] = useState(0);
  const [languageAnswer, setLanguageAnswer] = useState(0);
  const [sensoryMotorAnswer, setSensoryMotorAnswer] = useState(0);

  const questionNumber = currentIndex + 1;

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

    const nextTotal = totalAnswer + selectedAnswer;
    let nextSocial = socialRelatednessAnswer;
    let nextCircumscribed = circumscribedInterestsAnswer;
    let nextLanguage = languageAnswer;
    let nextSensory = sensoryMotorAnswer;

    if (Categories["Social Relatedness"].includes(questionNumber)) {
      nextSocial += selectedAnswer;
    }
    else if (Categories["Circumscribed Interests"].includes(questionNumber)) {
      nextCircumscribed += selectedAnswer;
    }
    else if (Categories["Language"].includes(questionNumber)) {
      nextLanguage += selectedAnswer;
    }
    else if (Categories["Sensory Motor"].includes(questionNumber)) {
      nextSensory += selectedAnswer;
    }
    else {
      router.push('/error');
      return;
    }

    if (questionNumber == TOTAL_QUESTIONS) {
      sessionStorage.setItem("raadsResults", JSON.stringify({
        totalAnswer: nextTotal,
        socialRelatednessAnswer: nextSocial,
        circumscribedInterestsAnswer: nextCircumscribed,
        languageAnswer: nextLanguage,
        sensoryMotorAnswer: nextSensory,
      }));
      router.push('/result');
      return;
    }

    setTotalAnswer(nextTotal);
    setSocialRelatednessAnswer(nextSocial);
    setCircumscribedInterestsAnswer(nextCircumscribed);
    setLanguageAnswer(nextLanguage);
    setSensoryMotorAnswer(nextSensory);
    setCurrentIndex(currentIndex + 1);
    setSelectedAnswer(null);
  }

  return (
    <div>
      <h1>{questionNumber}.) {Questions[currentIndex]}</h1>

      <br />
      <p>
      {[
        { value: 3, label: "True now and when I was young" },
        { value: 2, label: "True only now" },
        { value: 1, label: "True only when I was younger than 16" },
        { value: 0, label: "Never true" },
      ].map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name="answers"
            value={option.value}
            checked={selectedAnswer === option.value}
            onChange={() => setSelectedAnswer(option.value)}
          />
          {option.label}
        </label>
      ))}
      </p>

      <button onClick={nextQuestion}>Next</button>
      <button onClick={() => {
        sessionStorage.removeItem("raadsResults");
        // want to trigger beforeunload to warn user before resetting
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/";
      }}>
        Reset
      </button>
    </div>
  );
}

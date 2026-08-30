"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function ResultPage() {
  const router = useRouter();

  const [results] = useState<{
    totalAnswer: number;
    socialRelatednessAnswer: number;
    circumscribedInterestsAnswer: number;
    languageAnswer: number;
    sensoryMotorAnswer: number;
  } | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const stored = sessionStorage.getItem("raadsResults");
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  });

  return (
    <>
    <div>
      <h1>Result</h1>
      {results ? (
        <>
          <p>Total Answer: {results.totalAnswer}</p>
          <p>Social Relatedness Answer: {results.socialRelatednessAnswer}</p>
          <p>Circumscribed Interests Answer: {results.circumscribedInterestsAnswer}</p>
          <p>Language Answer: {results.languageAnswer}</p>
          <p>Sensory Motor Answer: {results.sensoryMotorAnswer}</p>
        </>
      ) : (
        <p>No results found. Please complete the test.</p>
      )}
    </div>

    <button onClick={() => {
      sessionStorage.removeItem("raadsResults");
      router.push("/");
    }}>
      Reset
      </button>
    </>
  );
}

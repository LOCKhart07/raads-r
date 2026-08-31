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
    responses: {
      questionNumber: number;
      question: string;
      rawValue: number;
      score: number;
      label: string;
    }[];
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
    <main className="result-shell">
      <div className="result-card">
        <h1 className="result-title">Results</h1>

        {results ? (
          <>
          <div className="results-table-wrap">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total</td>
                  <td>{results.totalAnswer}</td>
                </tr>
                <tr>
                  <td>Social Relatedness</td>
                  <td>{results.socialRelatednessAnswer}</td>
                </tr>
                <tr>
                  <td>Circumscribed Interests</td>
                  <td>{results.circumscribedInterestsAnswer}</td>
                </tr>
                <tr>
                  <td>Language</td>
                  <td>{results.languageAnswer}</td>
                </tr>
                <tr>
                  <td>Sensory Motor</td>
                  <td>{results.sensoryMotorAnswer}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {results.responses && results.responses.length > 0 && (
            <div className="responses-section">
              <h2 className="responses-heading">Your Responses</h2>
              <div className="responses-scroll">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Question</th>
                      <th>Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.responses.map((r) => (
                      <tr key={r.questionNumber}>
                        <td>{r.questionNumber}</td>
                        <td>{r.question}</td>
                        <td>{r.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </>
        ) : (
          <p className="empty-state">No results found. Please complete the test.</p>
        )}

        <div className="question-actions">
          <button
            type="button"
            className="reset-button"
            onClick={() => {
              sessionStorage.removeItem("raadsResults");
              router.push("/");
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </main>
  );
}

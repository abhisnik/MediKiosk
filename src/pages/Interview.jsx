import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import KioskHeader from "../components/kiosk/KioskHeader";
import QuestionCard from "../components/kiosk/QuestionCard";
import AnswerInput from "../components/kiosk/AnswerInput";
import VoiceButton from "../components/kiosk/VoiceButton";
import ProgressBar from "../components/kiosk/ProgressBar";
import RedFlagAlert from "../components/kiosk/RedFlagAlert";

import { questions } from "../data/questions";
import { detectRedFlags } from "../data/redFlagRules";

import useSpeech from "../hooks/useSpeech";

import {
  saveSession,
  getSession
} from "../utils/sessionUtils";

import { t } from "../utils/i18n";

export default function Interview() {

  const navigate = useNavigate();

  const session = getSession();

  /*
    IMPORTANT:
    Get the language selected on the
    language-selection page.
  */
  const language =
    session.language || "en";

  const [index, setIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState(
      session.answers || {}
    );

  const [flags, setFlags] =
    useState([]);

  const speech = useSpeech(
    language
  );

  const question =
    questions[index];

  /*
    When speech recognition returns
    a transcript, automatically put it
    into the answer box.
  */
  useEffect(() => {

    if (!speech.transcript) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [question.id]:
        speech.transcript
    }));

    setFlags(
      detectRedFlags(
        speech.transcript
      )
    );

  }, [
    speech.transcript
  ]);


  function changeAnswer(value) {

    setAnswers((previous) => ({
      ...previous,
      [question.id]: value
    }));

    setFlags(
      detectRedFlags(value)
    );
  }


  function nextQuestion() {

    const currentAnswer =
      answers[question.id];

    if (
      !String(currentAnswer || "")
        .trim()
    ) {
      return;
    }

    /*
      Last question
    */
    if (
      index ===
      questions.length - 1
    ) {

      saveSession({
        answers,
        language
      });

      navigate("/documents");

      return;
    }

    setIndex(
      (previous) =>
        previous + 1
    );
  }


  function previousQuestion() {

    setIndex(
      (previous) =>
        Math.max(
          previous - 1,
          0
        )
    );
  }


  const nextText =
    index === questions.length - 1
      ? language === "hi"
        ? "दस्तावेज़ पर जाएँ →"
        : language === "bn"
        ? "নথিতে যান →"
        : "Continue to documents →"
      : t(language, "next");


  return (
    <div className="app-shell">

      <div className="container">

        <KioskHeader
          title={t(
            language,
            "appName"
          )}
        />

        <ProgressBar
          current={index + 1}
          total={questions.length}
          language={language}
        />

        <div
          style={{
            marginTop: 18
          }}
        >

          <QuestionCard
            question={question}
            language={language}
          />

          <div
            className="card"
            style={{
              marginTop: 18
            }}
          >

            <AnswerInput
              question={question}
              language={language}
              value={
                answers[
                  question.id
                ] || ""
              }
              onChange={
                changeAnswer
              }
            />

            <div
              className="row"
              style={{
                marginTop: 14
              }}
            >

              {index > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={
                    previousQuestion
                  }
                >
                  {language === "hi"
                    ? "← पिछला"
                    : language === "bn"
                    ? "← আগের"
                    : "← Back"}
                </button>
              )}

              <VoiceButton
                {...speech}
              />

              <button
                type="button"
                className="btn btn-primary"
                onClick={
                  nextQuestion
                }
              >
                {nextText}
              </button>

            </div>

            <div
              style={{
                marginTop: 16
              }}
            >
              <RedFlagAlert
                flags={flags}
              />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
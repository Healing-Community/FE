"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

import { useGetDass21QuizQuery } from "@/queries/useQuizz";
import { useSubmitDass21QuizMutation } from "@/queries/useQuizz";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { SubmitQuizScoreType } from "@/schemaValidations/quizz.schema";

export default function PsychologicalTestForm() {
  const router = useRouter();
  const { data: quizData, isLoading } = useGetDass21QuizQuery();

  const submitQuizMutation = useSubmitDass21QuizMutation({
    onSuccess: (data) => {
      // Hiển thị thông báo thành công
      toast({
        description: data.message || "Nộp bài kiểm tra thành công!",
        variant: "success",
      });

      // Lưu kết quả vào localStorage để trang kết quả có thể truy cập
      localStorage.setItem("quizResult", JSON.stringify(data));

      // Điều hướng đến trang kết quả
      router.push("/test-result");
    },
    onError: (error: any) => {
      handleErrorApi({
        error,
      });
    },
  });

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, number>
  >({});
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      questionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
          if (isInView) {
            setCurrentQuestionIndex(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!quizData || !quizData.data) {
    return (
      <div className="container mx-auto">
        <div className="sticky top-0 z-10 mb-4 p-4 shadow-md">
          <div className="animate-pulse">
            <Progress value={0} className="w-full bg-gray-200 h-4 opacity-65" />
            <p className="text-right mt-2 bg-gray-300 rounded w-1/4 h-4"></p>
          </div>
        </div>

        {[...Array(3)].map((_, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 bg-gray-300 rounded w-1/2 h-6"></h3>
            {[...Array(4)].map((_, questionIndex) => (
              <Card key={questionIndex} className="mb-4 animate-pulse">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold mb-4 bg-gray-300 rounded w-3/4 h-4"></h4>
                  <RadioGroup className="gap-4 md:space-x-4 flex flex-col sm:flex-row items-center justify-center">
                    {[...Array(4)].map((_, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center justify-between p-4 border border-gray-700 rounded-full cursor-pointer sm:w-auto w-full"
                      >
                        <div className="bg-gray-300 rounded w-3/4 h-4"></div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    );
  }

  const questions =
    quizData?.data.dass21Categories.flatMap((category) =>
      category.questions.map((question, index) => ({
        id: `${category.categoryName}-${index}`,
        text: question.questionText,
        options: question.options.map((option, optionIndex) => ({
          value: optionIndex,
          label: option,
        })),
      }))
    ) || [];

  const handleOptionChange = (questionId: string, selectedValue: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: selectedValue,
    }));

    // Khi chọn xong, tự động chuyển sang câu tiếp theo
    const nextIndex = questions.findIndex((q) => q.id === questionId) + 0;
    if (nextIndex < questions.length) {
      questionRefs.current[nextIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleSubmitQuiz = () => {
    const scores: SubmitQuizScoreType["score"] = {
      stress: [],
      anxiety: [],
      depression: [],
    };

    quizData?.data.dass21Categories.forEach((category) => {
      const categoryScores = category.questions.map((_, questionIndex) => {
        const selectedOptionValue =
          selectedOptions[`${category.categoryName}-${questionIndex}`];
        return selectedOptionValue !== undefined ? selectedOptionValue : 0;
      });

      switch (category.categoryName) {
        case "Stress":
          scores.stress = categoryScores;
          break;
        case "Anxiety":
          scores.anxiety = categoryScores;
          break;
        case "Depression":
          scores.depression = categoryScores;
          break;
      }
    });

    submitQuizMutation.mutate({ score: scores });
  };

  const progressValue =
    (Object.keys(selectedOptions).length /
      quizData?.data.dass21Categories.flatMap((c) => c.questions).length) *
    100;

  return (
    <div>
      <div className="sticky top-0 z-10 mb-4 p-4 shadow-md">
        <Progress
          value={progressValue}
          className="w-full bg-gradient-to-r from-[#d4fc79] to-[#96e6a1] h-4 opacity-65"
        />
        <p className="text-right mt-2">{`${
          Object.keys(selectedOptions).length
        }/${
          quizData?.data.dass21Categories.flatMap((c) => c.questions).length
        }`}</p>
      </div>

      {quizData?.data.dass21Categories.map((category) => (
        <div key={category.categoryName} className="mb-6">
          <h3 className="text-2xl font-bold text-textChat mb-4">
            Câu hỏi để kiểm tra độ{" "}
            {category.categoryName === "Depression" ? (
              <span className="text-red-500">Trầm cảm</span>
            ) : category.categoryName === "Anxiety" ? (
              <span className="text-blue-500">Lo âu</span>
            ) : category.categoryName === "Stress" ? (
              <span className="text-green-500">Căng thẳng</span>
            ) : (
              category.categoryName
            )}
          </h3>
          {category.questions.map((question, questionIndex) => {
            const questionId = `${category.categoryName}-${questionIndex}`;
            const flatIndex =
              quizData?.data.dass21Categories
                .flatMap((c) => c.questions)
                .findIndex((q) => q === question) || 0;

            return (
              <Card
                key={questionId}
                ref={(el) => {
                  questionRefs.current[flatIndex] = el;
                }}
                className={`transition-all text-textChat duration-300 mb-4 ${
                  currentQuestionIndex === flatIndex
                    ? "bg-green-100 shadow-lg scale-105 text-gray-800"
                    : "opacity-75"
                }`}
              >
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold mb-4">
                    {question.questionText}
                  </h4>
                  <RadioGroup
                    className="gap-4 md:space-x-4 flex flex-col sm:flex-row items-center justify-center"
                    onValueChange={(value) =>
                      handleOptionChange(questionId, Number(value))
                    }
                  >
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`flex items-center justify-between p-4 border border-gray-700 rounded-full cursor-pointer sm:w-auto w-full ${
                          selectedOptions[questionId] === optionIndex
                            ? "bg-green-700"
                            : ""
                        }`}
                      >
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`question-${questionId}-${optionIndex}`}
                          dotColor="white"
                          className={`mr-4 border w-5 h-5 ${
                            selectedOptions[questionId] === optionIndex
                              ? "border-white"
                              : "border-gray-700"
                          }`}
                        />
                        <Label
                          htmlFor={`question-${questionId}-${optionIndex}`}
                          className={`w-full leading-5 ${
                            selectedOptions[questionId] === optionIndex
                              ? "text-white"
                              : ""
                          }`}
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ))}

      {Object.keys(selectedOptions).length ===
        quizData?.data.dass21Categories.flatMap((c) => c.questions).length && (
        <Button
          onClick={handleSubmitQuiz}
          className="rounded-[20px] w-full float-right md:w-40 h-12 md:text-base bg-gradient-to-r from-[#d4fc79] to-[#96e6a1] text-black"
        >
          Xem kết quả
        </Button>
      )}
    </div>
  );
}

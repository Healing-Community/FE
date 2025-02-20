"use client";

import ImpactMBTI from "@/components/test-result-mbti/impact-mbti";
import ReasonMBTI from "@/components/test-result-mbti/reason-mbti";
import SolutionMBTI from "@/components/test-result-mbti/solution-mbti";
import SymptomMBTI from "@/components/test-result-mbti/symptom-mbti";
import DialogRecommendGroup from "@/components/test-result/dialog-recommend-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";

export default function ContentTestResultMBTITabs() {
  const [activeSection, setActiveSection] = useState("reason");

  const renderContent = () => {
    switch (activeSection) {
      case "reason":
        return <ReasonMBTI />;
      case "symptom":
        return <SymptomMBTI />;
      case "impact":
        return <ImpactMBTI />;
      case "solution":
        return <SolutionMBTI />;
      // case "advice":
      //   return <Advice />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full flex-col md:flex-row">
      <div className="w-full hidden p-4 sticky top-0 md:w-1/4 md:block">
        <div className="border border-muted-foreground p-2 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-4">
            Tìm hiểu về tình trạng của bạn
          </h2>
          <nav>
            <ul className="space-y-2">
              <li
                onClick={() => setActiveSection("reason")}
                className={`cursor-pointer ${
                  activeSection === "reason"
                    ? "text-green-600 font-medium"
                    : "hover:translate-x-4 hover:scale-110 transition ease-in-out delay-150 duration-300"
                }`}
              >
                Tổng quan
              </li>
              <li
                onClick={() => setActiveSection("symptom")}
                className={`cursor-pointer ${
                  activeSection === "symptom"
                    ? "text-green-600 font-medium"
                    : "hover:translate-x-4 hover:scale-110 transition ease-in-out delay-150 duration-300"
                }`}
              >
                Yếu tố
              </li>
              <li
                onClick={() => setActiveSection("impact")}
                className={`cursor-pointer ${
                  activeSection === "impact"
                    ? "text-green-600 font-medium"
                    : "hover:translate-x-4 hover:scale-110 transition ease-in-out delay-150 duration-300"
                }`}
              >
                Tác động ngắn hạn
              </li>
              <li
                onClick={() => setActiveSection("solution")}
                className={`cursor-pointer ${
                  activeSection === "solution"
                    ? "text-green-600 font-medium"
                    : "hover:translate-x-4 hover:scale-110 transition ease-in-out delay-150 duration-300"
                }`}
              >
                Tác động dài hạn
              </li>
              {/* <li
                onClick={() => setActiveSection("advice")}
                className={`cursor-pointer ${
                  activeSection === "advice"
                    ? "text-green-600 font-medium"
                    : "hover:translate-x-4 hover:scale-110 transition ease-in-out delay-150 duration-300"
                }`}
              >
                Lời khuyên
              </li> */}
            </ul>
          </nav>
        </div>
        <DialogRecommendGroup />
      </div>
      {/* Nội dung bên phải */}
      <div className="md:w-3/4 p-4">
        <ScrollArea className="h-[400px] px-4 md:block hidden">
          {renderContent()}
        </ScrollArea>
        <div className=" md:hidden">
          <div>
            <ReasonMBTI />
            <SymptomMBTI />
            <ImpactMBTI />
            <SolutionMBTI />
          </div>
        </div>
      </div>
    </div>
  );
}

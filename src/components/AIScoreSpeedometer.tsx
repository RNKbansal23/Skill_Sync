// components/AIScoreSpeedometer.tsx
'use client';

import ReactSpeedometer from "react-d3-speedometer";

type AIScores = {
  workEthic: number;
  creativity: number;
  skills: number;
};

export default function AIScoreSpeedometer({ scores }: { scores: AIScores }) {
  return (
    <div className="flex flex-col gap-8 items-center w-full">
      <h3 className="text-lg font-semibold mb-2 text-center text-gray-800">Gemini AI Resume Scores</h3>
      <div className="flex flex-col gap-8">
        <div>
          <div className="text-center mb-1 font-medium">Work Ethic</div>
          <ReactSpeedometer
            value={scores.workEthic}
            minValue={1}
            maxValue={5}
            segments={5}
            needleColor="steelblue"
            width={180}
            height={120}
          />
        </div>
        <div>
          <div className="text-center mb-1 font-medium">Creativity</div>
          <ReactSpeedometer
            value={scores.creativity}
            minValue={1}
            maxValue={5}
            segments={5}
            needleColor="orange"
            width={180}
            height={120}
          />
        </div>
        <div>
          <div className="text-center mb-1 font-medium">Skills</div>
          <ReactSpeedometer
            value={scores.skills}
            minValue={1}
            maxValue={5}
            segments={5}
            needleColor="green"
            width={180}
            height={120}
          />
        </div>
      </div>
    </div>
  );
}

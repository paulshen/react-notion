import * as React from "react";
import Code from "./code";
import Pane from "./Pane";

export function EditorPaneButton({
  codeId,
  initialCode,
  renderEditor
}: {
  codeId: string;
  initialCode: string;
  renderEditor: (modelId: string, initialCode: string) => React.ReactNode;
}) {
  const [showPane, setShowPane] = React.useState(false);
  return (
    <>
      <button
        onClick={e => {
          setShowPane(show => !show);
        }}
        className="bg-transparent rounded-md border border-gray-700 px-2 py-1 text-sm text-gray-700"
      >
        {!showPane ? "Open" : "Close"} exercise
      </button>
      {showPane ? (
        <Pane onClose={() => setShowPane(false)}>
          {renderEditor(codeId, initialCode)}
        </Pane>
      ) : null}
    </>
  );
}

export function Exercise({ exercise, renderChildText, renderEditor }: any) {
  const [showSolution, setShowSolution] = React.useState(false);
  return (
    <div
      className="-mx-4 my-4 p-4 rounded-md"
      style={{ backgroundColor: "#f8f3e6" }}
    >
      <div className="text-sm font-semibold">Exercise</div>
      <div className="mb-4">{renderChildText(exercise.prompt)}</div>
      <div className="flex">
        <EditorPaneButton
          codeId={exercise.id}
          initialCode={exercise.exercise}
          renderEditor={renderEditor}
        />
        <button
          onClick={e => {
            setShowSolution(show => !show);
          }}
          className="bg-transparent rounded-md border border-gray-700 ml-2 px-2 py-1 text-sm text-gray-700"
        >
          {!showSolution ? "Show" : "Hide"} solution
        </button>
      </div>
      {showSolution ? (
        <Code code={exercise.solution} language="typescript" className="mt-4" />
      ) : null}
    </div>
  );
}

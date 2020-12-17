import * as React from "react";
import { NotionRenderer } from "..";
import Pane from "./Pane";

export function PostPaneLink({
  pane,
  panes,
  children
}: {
  pane: any;
  panes: any[];
  children: React.ReactNode;
}) {
  const [showPane, setShowPane] = React.useState(false);
  return (
    <>
      <a
        href="#"
        onClick={e => {
          setShowPane(true);
          e.preventDefault();
        }}
        className="border-b border-dashed border-gray-400"
      >
        {children}
      </a>
      {showPane ? (
        <PostPane
          panes={panes}
          pane={pane}
          onClose={() => setShowPane(false)}
        />
      ) : null}
    </>
  );
}

export default function PostPane({
  pane,
  panes,
  onClose
}: {
  pane: any;
  panes: any[];
  onClose: () => void;
}) {
  return (
    <Pane onClose={onClose}>
      <div className="px-4 py-2 sm:px-8 sm:py-4 h-full overflow-auto">
        <NotionRenderer
          blockMap={pane.blocks}
          currentId={pane.id}
          panes={panes}
          exercises={[]}
          renderEditor={() => null}
        />
      </div>
    </Pane>
  );
}

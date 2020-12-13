import * as React from "react";
import { NotionRenderer } from "..";
import Pane from "./Pane";

export function PostPaneLink({
  panes,
  paneId,
  children
}: {
  panes: any[];
  paneId: string;
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
          paneId={paneId}
          onClose={() => setShowPane(false)}
        />
      ) : null}
    </>
  );
}

export default function PostPane({
  paneId,
  panes,
  onClose
}: {
  paneId: string;
  panes: any[];
  onClose: () => void;
}) {
  const pane = panes.find(p => p.id.replace(/-/g, "") === paneId);
  return (
    <Pane onClose={onClose}>
      <div className="px-4 py-2 sm:px-8 sm:py-4 h-full overflow-auto">
        <NotionRenderer
          blockMap={pane.blocks}
          currentId={pane.id}
          panes={[]}
          exercises={[]}
          renderEditor={() => null}
        />
      </div>
    </Pane>
  );
}

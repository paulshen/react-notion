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
        className="underline"
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
      <NotionRenderer blockMap={pane.blocks} currentId={pane.id} panes={[]} />
    </Pane>
  );
}

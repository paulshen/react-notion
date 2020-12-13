import * as React from "react";
import ReactDOM from "react-dom";

export default function Pane({
  children,
  onClose
}: {
  children: React.ReactNode;
  onClose: () => void;
}): any {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const rootOffset = React.useRef([0, 0]);
  const cleanupDrag = React.useRef<() => void>();
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  function onHeaderMouseDown(e: React.MouseEvent) {
    if (closeButtonRef.current!.contains(e.target as Element)) {
      return;
    }

    document.body.style.userSelect = "none";
    const startPageX = e.pageX;
    const startPageY = e.pageY;
    const [offsetX, offsetY] = rootOffset.current;
    const rootElement = rootRef.current!;
    function onMouseMove(e: MouseEvent) {
      const newOffsetX = offsetX + e.pageX - startPageX;
      const newOffsetY = offsetY + e.pageY - startPageY;
      rootElement.style.transform = `translate3d(${newOffsetX}px, ${newOffsetY}px, 0)`;
      rootOffset.current = [newOffsetX, newOffsetY];
    }
    function cleanup() {
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", cleanup);
      cleanupDrag.current = undefined;
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", cleanup);
    cleanupDrag.current = cleanup;
  }
  React.useEffect(() => {
    if (cleanupDrag.current !== undefined) {
      cleanupDrag.current();
    }
  }, []);

  return ReactDOM.createPortal(
    <div
      className="fixed z-50 bg-white rounded-md overflow-hidden bottom-4 right-4 sm:bottom-16 sm:right-16 flex flex-col shadow-xl"
      style={{
        width: "540px",
        height: "480px",
        maxWidth: "90vw",
        maxHeight: "90vh"
      }}
      ref={rootRef}
    >
      <div
        className="flex items-center justify-end bg-gray-800 h-8 flex-shrink-0"
        onMouseDown={onHeaderMouseDown}
      >
        <button
          onClick={onClose}
          ref={closeButtonRef}
          className="bg-transparent border-none text-gray-100 cursor-pointer text-xs mr-3 px-1 py-1 uppercase"
        >
          Close
        </button>
      </div>
      <div className="flex-grow overflow-hidden relative">{children}</div>
    </div>,
    document.body
  );
}

"use client";

import "@xyflow/react/dist/base.css";

import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
  useStore,
  type AriaLabelConfig,
  type XYPosition,
} from "@xyflow/react";
import { useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import { CardNode, type CardNodeType } from "@/components/notebook/card-node";
import { CardBodies, DeskActions } from "@/components/notebook/desk-context";
import { DeskPencil } from "@/components/notebook/desk-pencil";
import { Dock } from "@/components/notebook/dock";
import { NameMark } from "@/components/notebook/name-mark";
import { NameNode, type NameNodeType } from "@/components/notebook/name-node";
import { Sheet } from "@/components/notebook/sheet";
import { Toolbar } from "@/components/notebook/toolbar";
import { Tour } from "@/components/notebook/tour";
import { useIsDesktop } from "@/components/notebook/use-is-desktop";
import { Zoom, useZoomBy } from "@/components/notebook/zoom";
import { cn } from "@/lib/cn";
import {
  CARD_TITLES,
  EASE_OUT,
  HOME,
  NAME_BOX,
  ZOOM,
  cardSearch,
  isCardId,
  parseCard,
  type CardId,
} from "@/lib/notebook";
import { paperSound } from "@/lib/paper-sound";
import { usePencil } from "@/lib/pencil";

type DeskNode = NameNodeType | CardNodeType;

const nodeTypes = { name: NameNode, card: CardNode };

// The name is not focusable, so it drops React Flow's "node" role
// description and its keyboard instructions.
const NAME_NODE: NameNodeType = {
  id: "name",
  type: "name",
  position: { x: NAME_BOX.x, y: NAME_BOX.y },
  data: {},
  draggable: false,
  deletable: false,
  focusable: false,
  domAttributes: { "aria-roledescription": undefined, "aria-describedby": undefined },
};

// React Flow sets an inline `pointer-events: none` on nodes that are not
// draggable, selectable or clickable, which is every card while the pencil
// is out (nodesDraggable off). A node's own style is spread after it, so
// cards always take the pointer: ×, links and scrolling keep working, and
// only dragging goes off (spec 8). The name node keeps passing it through.
// Each card reads to a screen reader as a "page" named by its title.
function cardNode(id: CardId, position: XYPosition, zIndex: number): CardNodeType {
  return {
    id,
    type: "card",
    position,
    data: { id },
    dragHandle: ".card-handle",
    zIndex,
    deletable: false,
    style: { pointerEvents: "all" },
    ariaRole: "document",
    ariaLabel: CARD_TITLES[id],
    domAttributes: { "aria-roledescription": "page" },
  };
}

// React Flow's screen-reader text, rewritten for the desk: cards cannot be
// selected, moved by keyboard or deleted, and there are no edges.
const ESC_HINT = "Press Escape to put this page away.";
const ARIA_LABELS: Partial<AriaLabelConfig> = {
  "node.a11yDescription.default": ESC_HINT,
  "node.a11yDescription.keyboardDisabled": ESC_HINT,
  "node.a11yDescription.ariaLiveMessage": () => "",
  "edge.a11yDescription.default": "",
};

/** Keyboard panning, in screen pixels per press. */
const PAN_STEP = 80;
const PAN_KEYS: Record<string, [dx: number, dy: number]> = {
  ArrowLeft: [PAN_STEP, 0],
  ArrowRight: [-PAN_STEP, 0],
  ArrowUp: [0, PAN_STEP],
  ArrowDown: [0, -PAN_STEP],
};

// ?card= follows the open cards without adding history entries (spec 5).
function writeCards(open: readonly CardId[]) {
  const { pathname, search, hash } = window.location;
  window.history.replaceState(null, "", `${pathname}${cardSearch(search, open)}${hash}`);
}

function Desk({ desktop, ready, onReady }: { desktop: boolean; ready: boolean; onReady: () => void }) {
  const flow = useReactFlow<DeskNode>();
  const reduce = useReducedMotion();
  const zoomBy = useZoomBy();
  const pencilOut = usePencil();
  const [nodes, setNodes, onNodesChange] = useNodesState<DeskNode>([NAME_NODE]);
  // Desktop: the cards on the desk, in the order they were opened.
  const [open, setOpen] = useState<CardId[]>([]);
  // Phones: the card in the bottom sheet.
  const [sheet, setSheet] = useState<CardId | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  // Nodes to fit as soon as React Flow has measured them: a glide, or
  // instant for a first view (spec 2, 6), which must never slide in from
  // the corner where React Flow starts.
  const [focusOn, setFocusOn] = useState<{ ids: string[]; instant: boolean } | null>(null);
  // Where each card was last dropped this visit; the next z-index; which
  // screen size the current first view was laid out for.
  const dropped = useRef<Partial<Record<CardId, XYPosition>>>({});
  const top = useRef(1);
  const laidOutFor = useRef<boolean | null>(null);
  const duration = reduce ? 0 : 400;

  const measured = useStore(
    (s) => focusOn !== null && focusOn.ids.every((id) => Boolean(s.nodeLookup.get(id)?.measured?.width)),
  );

  // React Flow stays hidden until the first view's fit has landed (the
  // name stand-in in Notebook covers it). Backstop: show it anyway 500ms
  // after the first painted frame, should a node never be measured or the
  // fit never resolve. Counting from a frame, not from mount, keeps a tab
  // opened in the background (no frames, no measuring) from revealing an
  // unfitted desk.
  useEffect(() => {
    if (ready) return;
    let backstop = 0;
    const frame = window.requestAnimationFrame(() => {
      backstop = window.setTimeout(onReady, 500);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(backstop);
    };
  }, [ready, onReady]);

  useEffect(() => {
    if (!focusOn || !measured) return;
    const { ids, instant } = focusOn;
    setFocusOn(null);
    // fitView is queued until React Flow's next node update and resolves
    // once the viewport is set.
    void flow
      .fitView({
        nodes: ids.map((id) => ({ id })),
        padding: 0.2,
        maxZoom: 1,
        duration: instant ? 0 : duration,
        ease: EASE_OUT,
      })
      .then(onReady);
  }, [focusOn, measured, flow, duration, onReady]);

  // The first view (spec 2, 6), laid out again whenever the screen crosses
  // 768px. Only the very first one follows a ?card= link; later ones clear it.
  useEffect(() => {
    if (laidOutFor.current === desktop) return;
    const first = laidOutFor.current === null;
    laidOutFor.current = desktop;
    const linked = first ? parseCard(window.location.search) : null;
    if (!first) writeCards([]);
    dropped.current = {};
    if (desktop) {
      const card = linked ?? "about";
      top.current = 2;
      setNodes([NAME_NODE, cardNode(card, HOME[card].position, top.current)]);
      setOpen([card]);
      setSheet(null);
      setFocusOn({ ids: linked ? [linked] : ["name", card], instant: true });
    } else {
      setNodes([NAME_NODE]);
      setOpen([]);
      setSheet(linked);
      setFocusOn({ ids: ["name"], instant: true });
    }
  }, [desktop, setNodes]);

  function openCard(id: CardId) {
    if (soundOn) paperSound.slide();
    if (!desktop) {
      setSheet(id);
      writeCards([id]);
      return;
    }
    const z = ++top.current;
    const position = dropped.current[id] ?? HOME[id].position;
    setNodes((all) => [...all.filter((n) => n.id !== id), cardNode(id, position, z)]);
    const next = [...open.filter((c) => c !== id), id];
    setOpen(next);
    writeCards(next);
    setFocusOn({ ids: [id], instant: false });
  }

  function closeCard(id: CardId) {
    if (soundOn) paperSound.slide(true);
    if (!desktop) {
      setSheet(null);
      writeCards([]);
      return;
    }
    // Focus inside the card (its ×, a link) would fall to <body> as the
    // node unmounts: hand it to the card's dock button instead.
    if (document.activeElement?.closest(`[data-id="${id}"]`)) {
      document.querySelector<HTMLElement>(`[data-card="${id}"]`)?.focus();
    }
    const node = flow.getNode(id);
    if (node) dropped.current[id] = node.position;
    setNodes((all) => all.filter((n) => n.id !== id));
    const next = open.filter((c) => c !== id);
    setOpen(next);
    writeCards(next);
  }

  // The cards get a stable action that always runs the latest closeCard,
  // so a drag (which re-renders the desk) does not re-render every card.
  const closeRef = useRef(closeCard);
  useLayoutEffect(() => {
    closeRef.current = closeCard;
  });
  const actions = useMemo(() => ({ close: (id: CardId) => closeRef.current(id) }), []);

  const isOpen = (id: CardId) => (desktop ? open.includes(id) : sheet === id);
  const toggle = (id: CardId) => (isOpen(id) ? closeCard(id) : openCard(id));

  function fitAll() {
    void flow.fitView({ padding: 0.15, maxZoom: 1, duration, ease: EASE_OUT });
  }

  function tidy() {
    dropped.current = {};
    top.current = 2;
    setNodes([NAME_NODE, cardNode("about", HOME.about.position, top.current)]);
    setOpen(["about"]);
    writeCards([]);
    setFocusOn({ ids: ["name", "about"], instant: false });
  }

  // Esc puts away the card holding focus (spec 10); closeCard moves focus
  // to its dock button. With the desk itself focused, arrows pan and +/-
  // zoom in the zoom buttons' steps.
  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      const id = e.target instanceof Element ? e.target.closest(".react-flow__node")?.getAttribute("data-id") : null;
      if (desktop && isCardId(id) && open.includes(id)) {
        e.preventDefault();
        closeCard(id);
      }
      return;
    }
    if (e.target !== e.currentTarget) return;
    const pan = PAN_KEYS[e.key];
    if (pan) {
      e.preventDefault();
      const { x, y, zoom } = flow.getViewport();
      void flow.setViewport({ x: x + pan[0], y: y + pan[1], zoom }, { duration: reduce ? 0 : 150, ease: EASE_OUT });
    } else if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      zoomBy(ZOOM.step);
    } else if (e.key === "-") {
      e.preventDefault();
      zoomBy(-ZOOM.step);
    }
  }

  // DOM order is the tab order (spec 10): toolbar, the desk and its cards,
  // then the dock. `isolate` keeps React Flow's own z-indexes under the
  // fixed toolbar and dock.
  return (
    <DeskActions.Provider value={actions}>
      <div className="fixed inset-0 overflow-hidden bg-paper">
        <Toolbar
          desktop={desktop}
          soundOn={soundOn}
          onSound={() => setSoundOn((on) => !on)}
          onFit={fitAll}
          onTidy={tidy}
        />
        <div
          data-desk=""
          role="region"
          aria-label="Desk"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className={cn("desk absolute inset-0 isolate", pencilOut && "desk-pencil-out", !ready && "invisible")}
        >
          <ReactFlow<DeskNode>
            nodes={nodes}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            minZoom={ZOOM.min}
            maxZoom={ZOOM.max}
            panOnDrag={!pencilOut}
            nodesDraggable={!pencilOut}
            nodesConnectable={false}
            elementsSelectable={false}
            selectionOnDrag={false}
            zoomOnDoubleClick={false}
            deleteKeyCode={null}
            selectionKeyCode={null}
            multiSelectionKeyCode={null}
            ariaLabelConfig={ARIA_LABELS}
            onNodeDragStart={(_, node) => {
              const z = ++top.current;
              setNodes((all) => all.map((n) => (n.id === node.id ? { ...n, zIndex: z } : n)));
            }}
            onNodeDragStop={() => {
              if (soundOn) paperSound.press();
            }}
            onPaneClick={() => {
              if (!desktop && sheet) closeCard(sheet);
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={18}
              size={1.6}
              color="var(--dot)"
              bgColor="var(--paper)"
            />
            <DeskPencil soundOn={soundOn} />
          </ReactFlow>
        </div>
        <Dock isOpen={isOpen} onToggle={toggle} />
        {desktop ? <Zoom /> : null}
        <Sheet
          card={desktop ? null : sheet}
          onClose={() => {
            if (sheet) closeCard(sheet);
          }}
        />
        <Tour desktop={desktop} />
      </div>
    </DeskActions.Provider>
  );
}

// The notebook desk (/notebook, notebook spec). It needs the screen width to
// choose desk cards or phone sheets, so until hydration, and then until the
// desk's first view has been fitted, a stand-in shows the name centred on
// bare paper. It is mounted once, so its ring draws once. Without JS it is
// all there is, so a plain link leads back to the site.
export function Notebook({ bodies }: { bodies: Record<CardId, ReactNode> }) {
  const desktop = useIsDesktop();
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <CardBodies.Provider value={bodies}>
      <ReactFlowProvider>
        {desktop === null ? null : <Desk desktop={desktop} ready={ready} onReady={onReady} />}
        {ready ? null : (
          <div
            className={cn(
              "pointer-events-none fixed inset-0 grid place-items-center",
              desktop === null && "bg-paper",
            )}
          >
            <NameMark />
          </div>
        )}
        <noscript>
          <a
            href="/"
            className="fixed top-3 left-1/2 z-[var(--z-desk-ui)] inline-flex h-11 -translate-x-1/2 items-center rounded-control border-2 border-ink bg-sheet px-4 text-[0.9375rem] font-semibold text-ink no-underline"
          >
            Back to the site
          </a>
        </noscript>
      </ReactFlowProvider>
    </CardBodies.Provider>
  );
}

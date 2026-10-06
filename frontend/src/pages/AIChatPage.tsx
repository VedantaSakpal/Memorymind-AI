import { useState } from 'react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  formula?: string;
  details?: string[];
  showGraph?: boolean;
  time?: string;
}

const chatHistorySections = [
  {
    title: 'Today',
    chats: [
      { id: '1', title: 'Explain A* Algorithm', active: true },
      { id: '2', title: 'Difference between...', active: false },
      { id: '3', title: 'What is Neural Network?', active: false },
      { id: '4', title: 'Explain OS Process', active: false },
    ],
  },
  {
    title: 'Yesterday',
    chats: [
      { id: '5', title: 'Quick sort algorithm', active: false },
      { id: '6', title: 'AI in Healthcare', active: false },
    ],
  },
  {
    title: 'Older',
    chats: [{ id: '7', title: 'What is IoT?', active: false }],
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'user',
    text: 'Explain A* Algorithm with an example.',
    time: '11:42 AM',
  },
  {
    id: 'm2',
    sender: 'ai',
    text: "A* (A-star) algorithm is a pathfinding algorithm that finds the shortest path between two nodes in a graph. It combines the benefits of Dijkstra's algorithm and Greedy Best-First Search.",
    formula: 'f(n) = g(n) + h(n)',
    details: [
      'g(n) = Cost from start node to current node',
      'h(n) = Heuristic estimate from current node to goal',
    ],
    showGraph: true,
    time: '11:43 AM',
  },
];

const AIChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [activeChatId, setActiveChatId] = useState('1');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Synthesizing knowledge from your uploaded documents regarding "${userMsg.text}". MemoryMind AI has identified core cross-references in your notes.`,
        details: [
          'Direct match found in Machine Learning Basics.pdf (Page 42)',
          'Associated concept node: Neural Pathways & Heuristics',
        ],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 600);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[600px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      {/* LEFT CHAT HISTORY SIDEBAR */}
      <div className="hidden w-72 flex-col border-r border-slate-100 bg-[#FBFBFE] p-4 md:flex">
        {/* + New Chat Button */}
        <button
          type="button"
          onClick={() => {
            setMessages([]);
            setActiveChatId('new');
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-50 py-2.5 px-4 text-xs font-bold text-[#000000] border border-teal-200/60 shadow-sm transition hover:bg-[#000000] hover:text-white"
        >
          <span className="text-base font-bold">+</span>
          <span>New Chat</span>
        </button>

        {/* Chat History List */}
        <div className="mt-4 flex-1 space-y-5 overflow-y-auto pr-1">
          {chatHistorySections.map((section) => (
            <div key={section.title}>
              <h4 className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.chats.map((chat) => {
                  const isActive = activeChatId === chat.id;
                  return (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => setActiveChatId(chat.id)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition truncate ${
                        isActive
                          ? 'bg-[#000000]/10 text-[#000000] font-semibold border border-[#000000]/20'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <svg
                        className={`h-3.5 w-3.5 flex-shrink-0 ${
                          isActive ? 'text-[#000000]' : 'text-slate-400'
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="truncate">{chat.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT MAIN CHAT AREA */}
      <div className="flex flex-1 flex-col bg-white">
        {/* Chat Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-[#000000]">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">AI Chat</h2>
              <p className="text-[11px] text-slate-400">
                Indexed from 128 documents in your knowledge base
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Connected
            </span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {msg.sender === 'user' ? (
                /* User Bubble */
                <div className="max-w-xl rounded-2xl bg-[#000000] px-4 py-3 text-sm text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]">
                  <p>{msg.text}</p>
                </div>
              ) : (
                /* AI Message Card matching reference */
                <div className="max-w-2xl rounded-2xl border border-slate-200/80 bg-[#FBFBFE] p-5 shadow-sm text-slate-800 space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#000000] text-white text-xs font-bold shadow-sm">
                      ✨
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      MemoryMind AI Response
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto font-mono">
                      {msg.time}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                    {msg.text}
                  </p>

                  {/* Formula Callout if present */}
                  {msg.formula && (
                    <div className="rounded-xl border border-teal-200/60 bg-teal-50/70 p-3 text-xs">
                      <p className="font-semibold text-slate-700">
                        It uses the formula:
                      </p>
                      <p className="mt-1 font-mono text-sm font-bold text-[#000000]">
                        {msg.formula}
                      </p>
                    </div>
                  )}

                  {/* Formula explanation list */}
                  {msg.details && (
                    <div className="text-xs text-slate-600 space-y-1 pl-1">
                      <p className="font-semibold text-slate-700">Where:</p>
                      {msg.details.map((d, i) => (
                        <p key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#000000]" />
                          <span>{d}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Graph / Path illustration matching reference screenshot */}
                  {msg.showGraph && (
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Pathfinding Graph Topology:
                      </p>
                      <svg className="w-full h-28" viewBox="0 0 360 100" fill="none">
                        {/* Connecting lines */}
                        <line
                          x1="40"
                          y1="50"
                          x2="120"
                          y2="25"
                          stroke="#94A3B8"
                          strokeWidth="2"
                        />
                        <line
                          x1="40"
                          y1="50"
                          x2="120"
                          y2="75"
                          stroke="#94A3B8"
                          strokeWidth="2"
                        />
                        <line
                          x1="120"
                          y1="25"
                          x2="220"
                          y2="25"
                          stroke="#000000"
                          strokeWidth="2.5"
                          strokeDasharray="3"
                        />
                        <line
                          x1="120"
                          y1="75"
                          x2="220"
                          y2="75"
                          stroke="#94A3B8"
                          strokeWidth="2"
                        />
                        <line
                          x1="220"
                          y1="25"
                          x2="310"
                          y2="50"
                          stroke="#000000"
                          strokeWidth="2.5"
                        />
                        <line
                          x1="220"
                          y1="75"
                          x2="310"
                          y2="50"
                          stroke="#94A3B8"
                          strokeWidth="2"
                        />

                        {/* Edge weight labels */}
                        <text
                          x="75"
                          y="30"
                          fill="#64748B"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          g=3
                        </text>
                        <text
                          x="75"
                          y="75"
                          fill="#64748B"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          g=5
                        </text>
                        <text
                          x="170"
                          y="18"
                          fill="#000000"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          Optimal f=7
                        </text>
                        <text
                          x="270"
                          y="32"
                          fill="#000000"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          Goal
                        </text>

                        {/* Nodes */}
                        <circle cx="40" cy="50" r="16" fill="#000000" />
                        <text
                          x="40"
                          y="54"
                          fill="#fff"
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          S
                        </text>

                        <circle cx="120" cy="25" r="14" fill="#10B981" />
                        <text
                          x="120"
                          y="29"
                          fill="#fff"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          A
                        </text>

                        <circle
                          cx="120"
                          cy="75"
                          r="14"
                          fill="#F1F5F9"
                          stroke="#CBD5E1"
                          strokeWidth="1.5"
                        />
                        <text
                          x="120"
                          y="79"
                          fill="#475569"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          B
                        </text>

                        <circle cx="220" cy="25" r="14" fill="#10B981" />
                        <text
                          x="220"
                          y="29"
                          fill="#fff"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          C
                        </text>

                        <circle
                          cx="220"
                          cy="75"
                          r="14"
                          fill="#F1F5F9"
                          stroke="#CBD5E1"
                          strokeWidth="1.5"
                        />
                        <text
                          x="220"
                          y="79"
                          fill="#475569"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          D
                        </text>

                        <circle cx="310" cy="50" r="16" fill="#000000" />
                        <text
                          x="310"
                          y="54"
                          fill="#fff"
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          G
                        </text>
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Input Box */}
        <div className="border-t border-slate-100 p-4">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-[#F8F9FC] p-1.5 focus-within:border-[#000000] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#000000]/20 transition"
          >
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
              title="Attach Document"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about your documents..."
              className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#000000] text-white shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition hover:bg-[#000000] active:scale-95 flex-shrink-0"
              aria-label="Send message"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;

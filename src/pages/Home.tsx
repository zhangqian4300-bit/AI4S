import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslationStore } from '@/store/useTranslationStore';
import { translateText, uploadFile } from '@/lib/api';
import { Briefcase, ArrowRight, Copy, Eraser, Loader2, Brain, Wrench, FlaskConical, Send } from 'lucide-react';
import { chatWithRole } from '@/lib/api';

// Reusable Card Component
const ViewCard = ({ 
  title, 
  subtitle, 
  icon, 
  content, 
  onCopy, 
  isHighlighted = false,
  role
}: { 
  title: string; 
  subtitle: string; 
  icon: React.ReactNode; 
  content?: string; 
  onCopy: (text: string) => void;
  isHighlighted?: boolean;
  role?: 'industryExpert' | 'aiScientist' | 'engineer' | 'domainScientist';
}) => {
  const [chatInput, setChatInput] = React.useState('');
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [chatLoading, setChatLoading] = React.useState(false);
  const baseBorderColor = isHighlighted ? 'border-indigo-100' : 'border-slate-200';
  const ringClass = isHighlighted ? 'ring-1 ring-indigo-50' : '';
  const headerBg = isHighlighted ? 'bg-indigo-50/50' : 'bg-slate-50';
  const headerBorder = isHighlighted ? 'border-indigo-100' : 'border-slate-200';
  const titleColor = isHighlighted ? 'text-indigo-900' : 'text-slate-700';
  const badgeBg = isHighlighted ? 'bg-indigo-100' : 'bg-slate-200';
  const badgeText = isHighlighted ? 'text-indigo-700' : 'text-slate-600';
  // Use Tailwind Typography prose classes
  const proseClass = isHighlighted 
    ? 'prose-indigo prose-p:text-slate-700 prose-headings:text-indigo-900 prose-strong:text-indigo-800' 
    : 'prose-slate prose-p:text-slate-700 prose-headings:text-slate-800 prose-strong:text-slate-900';
  const contentBg = isHighlighted ? 'bg-white' : 'bg-slate-50/50';

  const handleSend = async () => {
    if (!chatInput.trim() || !content || !role) return;
    const userMsg = { role: 'user' as const, content: chatInput.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await chatWithRole(role, content, [...messages, userMsg]);
      const reply = res.reply as string;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `发生错误：${e.message || '服务不可用'}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${baseBorderColor} flex flex-col overflow-hidden ${ringClass} h-full`}>
      <div className={`${headerBg} border-b ${headerBorder} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className={`text-sm font-semibold ${titleColor}`}>{title}</h3>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 ${badgeBg} ${badgeText} rounded-full`}>{subtitle}</span>
      </div>
      <div className={`p-5 flex-1 overflow-y-auto ${contentBg} min-h-[300px]`}>
        {content ? (
          <div className={`prose prose-sm max-w-none leading-relaxed ${proseClass}`}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
            等待输入...
          </div>
        )}
      </div>
      <div className={`p-3 border-t ${headerBorder} bg-white flex justify-between items-center gap-3`}>
        <button 
          onClick={() => content && onCopy(content)}
          disabled={!content}
          className={`${isHighlighted ? 'text-indigo-600 hover:text-indigo-700' : 'text-slate-500 hover:text-indigo-600'} text-xs font-medium flex items-center space-x-1 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors`}
        >
          <Copy className="w-3.5 h-3.5" />
          <span>复制</span>
        </button>
        {role && (
          <div className="flex items-center gap-2 flex-1 justify-end">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="向该角色继续提问..."
              className="flex-1 text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              disabled={chatLoading || !content || !chatInput.trim()}
              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs font-medium px-3 py-1.5 rounded-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>发送</span>
            </button>
          </div>
        )}
      </div>
      {messages.length > 0 && (
        <div className="px-5 pb-5">
          <div className="space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={m.role === 'user' ? 'text-slate-800' : 'text-slate-700'}>
                <div className={`text-xs font-medium mb-1 ${m.role === 'user' ? 'text-indigo-600' : 'text-slate-500'}`}>
                  {m.role === 'user' ? '你' : '助手'}
                </div>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {chatLoading && <div className="text-xs text-slate-500">思考中...</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const {
    inputText,
    result,
    isLoading,
    error,
    setInputText,
    setResult,
    setLoading,
    setError,
    reset
  } = useTranslationStore();

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await translateText(inputText);
      setResult(data);
    } catch (err: any) {
      setError(err.message || '发生错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: Show toast
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">技术-产业语义翻译助手</h1>
              <p className="text-xs text-slate-500">将技术细节转化为商业价值</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Input Section */}
          <div className="xl:col-span-3 space-y-4 xl:sticky xl:top-24">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col min-h-[400px] xl:min-h-[calc(100vh-160px)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">输入原文</h2>
                <button 
                  onClick={() => setInputText('')}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  title="清空输入"
                >
                  <Eraser className="w-4 h-4" />
                </button>
              </div>
              <textarea
                className="flex-1 w-full resize-none border-0 focus:ring-0 p-0 text-slate-700 placeholder:text-slate-400 text-sm leading-relaxed"
                placeholder="在此粘贴原始技术描述...（例如：内部Wiki、实验日志、研发笔记）"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
              />
              <div className="mt-4 flex items-center justify-between">
                <label className="inline-flex items-center px-3 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.pptx,.xlsx,.csv"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      try {
                        setLoading(true)
                        const data = await uploadFile(file)
                        setInputText(data.text || '')
                      } catch (err: any) {
                        setError(err.message || '文件解析失败')
                      } finally {
                        setLoading(false)
                        e.target.value = ''
                      }
                    }}
                  />
                  <span className="text-sm">上传文件（PDF/Word/PPT/Excel/CSV）</span>
                </label>
                {isLoading && <span className="text-xs text-slate-500">处理中...</span>}
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-sm hover:shadow"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>正在翻译...</span>
                    </>
                  ) : (
                    <>
                      <span>开始生成</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 产业专家视角 */}
            <ViewCard 
              title="产业专家视角" 
              subtitle="价值 / ROI / 场景"
              icon={<Briefcase className="w-4 h-4 text-indigo-600" />}
              content={result?.industryExpert}
              onCopy={handleCopy}
              isHighlighted
              role="industryExpert"
            />

            {/* AI 科学家视角 */}
            <ViewCard 
              title="AI 科学家视角" 
              subtitle="方法 / 模型 / 假设"
              icon={<Brain className="w-4 h-4 text-slate-600" />}
              content={result?.aiScientist}
              onCopy={handleCopy}
              role="aiScientist"
            />

            {/* 工程师视角 */}
            <ViewCard 
              title="工程师视角" 
              subtitle="集成 / 性能 / 风险"
              icon={<Wrench className="w-4 h-4 text-slate-600" />}
              content={result?.engineer}
              onCopy={handleCopy}
              role="engineer"
            />

            {/* 领域科学家视角 */}
            <ViewCard 
              title="领域科学家视角" 
              subtitle="实证 / 边界 / 适用"
              icon={<FlaskConical className="w-4 h-4 text-slate-600" />}
              content={result?.domainScientist}
              onCopy={handleCopy}
              role="domainScientist"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.LITELLM_API_KEY;
const API_URL = process.env.LITELLM_API_URL || 'https://litellm.thesaisai.com/v1/chat/completions';

if (!API_KEY) {
  console.warn('Warning: LITELLM_API_KEY is not set in environment variables.');
}

interface TranslationResult {
  industryExpert: string;
  aiScientist: string;
  engineer: string;
  domainScientist: string;
}

export const translateText = async (text: string): Promise<TranslationResult> => {
  const systemPrompt = `
你是“技术–产业语义翻译官”。请基于一段原始技术描述，分别从四个角色视角生成客观、专业的分析报告。

输入：一段原始技术描述（可能包含实验数据、技术细节、内部术语）。

输出必须为 JSON，包含四个键，每个键对应一个 Markdown 格式的字符串：

1. "industryExpert" (产业专家视角)
   - 角色设定：你是深耕该行业的战略顾问，关注技术带来的商业价值与市场影响。
   - 表达重点：商业价值、ROI（投资回报率）、应用场景、市场竞争优势。
   - 语气：客观、商业化、宏观。
   - 格式：使用 Markdown 列表，加粗关键指标。

2. "aiScientist" (AI 科学家视角)
   - 角色设定：你是该领域的顶尖研究员，关注方法论的创新性与科学严谨性。
   - 表达重点：算法创新点、模型架构、数据有效性、评估指标的科学性、潜在的理论假设。
   - 语气：严谨、学术、客观。
   - 格式：使用 Markdown，包含方法论证和指标分析。

3. "engineer" (工程师视角)
   - 角色设定：你是资深系统架构师，关注技术落地的可行性与工程代价。
   - 表达重点：系统集成难度、资源消耗（算力/内存/功耗）、性能边界、潜在的工程风险与维护成本。
   - 语气：务实、技术化、批判性。
   - 格式：使用 Markdown，强调工程参数和风险点。

4. "domainScientist" (领域科学家视角)
   - 角色设定：你是特定应用领域（如医疗、制造、物理等）的专家，关注技术在领域内的实证有效性。
   - 表达重点：领域问题的解决程度、实证结果的可信度、适用范围、与现有领域方法的对比。
   - 语气：实证、专业、关注效度。
   - 格式：使用 Markdown，侧重领域实证分析。

统一约束：
- **客观性**：所有表述必须基于输入事实或合理的逻辑推断，严禁夸大或编造。
- **Markdown**：输出的字符串必须是标准的 Markdown 格式（支持 **加粗**、- 列表、> 引用等）。
- **语言**：简体中文。
- **结构化**：每个视角内部请清晰分点。
`;

  const userPrompt = `Here is the technical description:\n\n${text}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.1-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: "json_object" }, // Request JSON output if supported, otherwise rely on prompt
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LiteLLM API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from LiteLLM');
    }

    try {
      const parsed = JSON.parse(content);
      return {
        industryExpert: parsed.industryExpert || '无法生成产业专家视角内容。',
        aiScientist: parsed.aiScientist || '无法生成 AI 科学家视角内容。',
        engineer: parsed.engineer || '无法生成工程师视角内容。',
        domainScientist: parsed.domainScientist || '无法生成领域科学家视角内容。',
      };
    } catch (e) {
      console.error('JSON Parse Error:', e);
      // Fallback if JSON parsing fails but content exists
      return {
        industryExpert: content,
        aiScientist: '无法解析结构化输出。',
        engineer: '无法解析结构化输出。',
        domainScientist: '无法解析结构化输出。',
      };
    }

  } catch (error) {
    console.error('Translation Service Error:', error);
    throw error;
  }
};

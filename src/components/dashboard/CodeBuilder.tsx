// src/components/dashboard/CodeBuilder.tsx
import React, { useState } from 'react';
import { Code, Loader, CheckCircle, Copy, Download } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface Template {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  features: string[];
  type: 'frontend' | 'backend' | 'fullstack';
}

interface CodeOutput {
  code: string;
  dependencies: string[];
  setup: string[];
  documentation: string;
}

const templates: Template[] = [
  {
    id: 'next-saas',
    name: 'SaaS Platform',
    description: 'Full-stack SaaS application with authentication, payments, and dashboard',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    features: ['User authentication', 'Payment integration', 'Dashboard', 'Settings'],
    type: 'fullstack'
  },
  {
    id: 'api-backend',
    name: 'REST API',
    description: 'Backend API with authentication, database, and documentation',
    techStack: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Swagger'],
    features: ['JWT auth', 'CRUD operations', 'API docs', 'Rate limiting'],
    type: 'backend'
  },
  {
    id: 'react-dashboard',
    name: 'Admin Dashboard',
    description: 'React dashboard with charts, tables, and responsive design',
    techStack: ['React', 'TypeScript', 'Material UI', 'React Query'],
    features: ['Analytics', 'Data tables', 'Charts', 'Theme customization'],
    type: 'frontend'
  }
];

function CodeBuilder() {
  const { token } = useAuthStore();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [customFeatures, setCustomFeatures] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<CodeOutput | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'setup' | 'docs'>('code');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const generateCode = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          template: selectedTemplate.id,
          specifications: {
            type: selectedTemplate.type,
            techStack: selectedTemplate.techStack
          },
          features: [
            ...selectedTemplate.features,
            ...customFeatures.split('\n').filter(f => f.trim())
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const data = await response.json();
      setGeneratedCode(data);
    } catch (error) {
      console.error('Code generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadCode = () => {
    if (!generatedCode || !selectedTemplate) return;

    const blob = new Blob([generatedCode.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.id}-generated.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Code Builder</h2>
        {generatedCode && (
          <button
            onClick={downloadCode}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Code
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Selection & Configuration */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 rounded-lg text-left transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'bg-blue-600 ring-2 ring-blue-400'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-gray-300 mt-1">{template.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-gray-700/50 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {selectedTemplate && (
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Customize Features</h3>
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Included Features:</h4>
                <ul className="space-y-1">
                  {selectedTemplate.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Additional Features:</h4>
                <textarea
                  value={customFeatures}
                  onChange={(e) => setCustomFeatures(e.target.value)}
                  placeholder="Add custom features (one per line)"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 min-h-[100px]"
                />
              </div>
              <button
                onClick={generateCode}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Code className="h-5 w-5" />
                    <span>Generate Code</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Generated Code Display */}
        {generatedCode && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="border-b border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-4 py-2 ${
                    activeTab === 'code' ? 'bg-gray-700 text-white' : 'text-gray-400'
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setActiveTab('setup')}
                  className={`px-4 py-2 ${
                    activeTab === 'setup' ? 'bg-gray-700 text-white' : 'text-gray-400'
                  }`}
                >
                  Setup
                </button>
                <button
                  onClick={() => setActiveTab('docs')}
                  className={`px-4 py-2 ${
                    activeTab === 'docs' ? 'bg-gray-700 text-white' : 'text-gray-400'
                  }`}
                >
                  Documentation
                </button>
              </div>
            </div>

            <div className="p-4">
              {activeTab === 'code' && (
                <div className="relative">
                  <button
                    onClick={() => copyToClipboard(generatedCode.code, 'code')}
                    className="absolute top-2 right-2"
                  >
                    {copiedSection === 'code' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                  <pre className="text-sm overflow-x-auto p-4 bg-gray-900 rounded">
                    <code>{generatedCode.code}</code>
                  </pre>
                </div>
              )}

              {activeTab === 'setup' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Dependencies</h3>
                    <ul className="space-y-1">
                      {generatedCode.dependencies.map((dep, index) => (
                        <li key={index} className="text-sm">{dep}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Setup Instructions</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      {generatedCode.setup.map((step, index) => (
                        <li key={index} className="text-sm">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: generatedCode.documentation }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeBuilder;
import React, { useState } from 'react';
import { Code, Play, RefreshCw, Layers, Database, Globe, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface Template {
  id: string;
  name: string;
  description: string;
  tech: string[];
  type: 'frontend' | 'backend' | 'fullstack';
  icon: React.ReactNode;
}

const templates: Template[] = [
  {
    id: 'next-saas',
    name: 'SaaS Platform',
    description: 'Next.js + Tailwind CSS + Authentication + Database',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
    type: 'fullstack',
    icon: <Globe className="h-6 w-6 text-blue-500" />
  },
  {
    id: 'react-dashboard',
    name: 'Admin Dashboard',
    description: 'React + Material UI + Analytics + Charts',
    tech: ['React', 'TypeScript', 'Material UI', 'Recharts'],
    type: 'frontend',
    icon: <Layers className="h-6 w-6 text-purple-500" />
  },
  {
    id: 'express-api',
    name: 'REST API',
    description: 'Express.js + PostgreSQL + Authentication + Swagger',
    tech: ['Express.js', 'TypeScript', 'PostgreSQL', 'JWT'],
    type: 'backend',
    icon: <Database className="h-6 w-6 text-green-500" />
  }
];

function CodeBuilder() {
  const { subscription } = useAuthStore();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generating, setGenerating] = useState(false);

  if (!subscription || subscription.status !== 'active') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="h-16 w-16 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          The AI Code Builder is available on our Pro and Enterprise plans.
          Upgrade your subscription to access this feature.
        </p>
        <a href="/#pricing" className="button-primary">
          View Pricing
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Code Builder</h2>
        <div className="flex space-x-4">
          {selectedTemplate && (
            <button
              onClick={() => {}}
              disabled={generating}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {generating ? (
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Code className="h-5 w-5 mr-2" />
              )}
              Generate Code
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className="text-left p-6 bg-gray-800 rounded-lg hover:ring-2 hover:ring-blue-500 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              {template.icon}
              <span className="text-sm px-2 py-1 bg-gray-700 rounded-full">
                {template.type}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
            <p className="text-gray-400 mb-4">{template.description}</p>
            <div className="flex flex-wrap gap-2">
              {template.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-1 bg-gray-700 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-400">
              Connect your API endpoint in settings to start generating code.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeBuilder;
interface Template {
  id: string;
  name: string;
  channels: string[];
  category: string;
  active: boolean;
}

interface NotificationTemplateListProps {
  templates: Template[];
  onEdit: (template: Template) => void;
}

export function NotificationTemplateList({ templates, onEdit }: NotificationTemplateListProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">Configure notification templates for email, SMS, and push.</p>
        <button className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          + New Template
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map((tpl) => (
          <div key={tpl.id} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 bg-gray-50/50 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-800">{tpl.name}</p>
                  <span className={`w-1.5 h-1.5 rounded-full ${tpl.active ? "bg-green-500" : "bg-gray-400"}`} />
                </div>
                <p className="text-xs text-gray-500">{tpl.category}</p>
                <div className="flex gap-1.5 mt-2">
                  {tpl.channels.map((ch) => (
                    <span key={ch} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium uppercase">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => onEdit(tpl)}
                className="text-xs text-blue-600 hover:underline ml-2 shrink-0"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

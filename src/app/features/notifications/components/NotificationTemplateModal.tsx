interface Template {
  id: string;
  name: string;
}

interface NotificationTemplateModalProps {
  template: Template;
  onClose: () => void;
  onSave: () => void;
}

export function NotificationTemplateModal({ template, onClose, onSave }: NotificationTemplateModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-auto">
        <h3 className="font-semibold text-gray-800 mb-4">Edit Template: {template.name}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">SMS Template</label>
            <textarea 
              className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none h-20 resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
              defaultValue={`Dear {{name}}, your ${template.name.toLowerCase()} has been processed. Ref: {{ref_id}}`} 
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">Email Subject</label>
            <input 
              type="text" 
              className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
              defaultValue={`NexusBank: ${template.name}`} 
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">Push Notification</label>
            <textarea 
              className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none h-20 resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
              defaultValue={`${template.name} - Tap to view details`} 
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onSave} 
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition-colors"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

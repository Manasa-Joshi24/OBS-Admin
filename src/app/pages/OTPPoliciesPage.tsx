import { useState } from "react";
import { ConfigSidebar } from "../features/config/components/ConfigSidebar";
import { OTPPoliciesForm } from "../features/config/components/OTPPoliciesForm";
import { AlertBanner } from "../components/shared/AlertBanner";


const sections = [
  { key: "limits", label: "Transfer Limits" },
  { key: "otp", label: "OTP Policies" },
  { key: "features", label: "Feature Flags" },
  { key: "products", label: "Product Settings" },
  { key: "schedule", label: "Processing Schedule" },
];

export default function OTPPoliciesPage() {
  const [activeSection, setActiveSection] = useState("otp");

  return (
    <div className="space-y-5">
      <AlertBanner 
        message="OTP configuration changes affect system-wide authentication security. Please verify all parameters before saving." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ConfigSidebar 
          sections={sections} 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />

        <div className="lg:col-span-3">
          {activeSection === "otp" && (
            <OTPPoliciesForm 
              onSave={(payload) => console.log("Saving OTP policies:", payload)} 
            />
          )}

          {activeSection !== "otp" && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">!</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Section Under Construction</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                The {sections.find(s => s.key === activeSection)?.label} configuration module is currently being refactored.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

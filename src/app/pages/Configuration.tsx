import { useEffect, useState } from "react";
import { Settings, Save, ToggleLeft, ToggleRight, AlertTriangle, Hammer } from "lucide-react";
import { Badge } from "../components/Badge";
import api from "../utils/api";
import { Skeleton } from "../components/Skeleton";
import { OTPPoliciesForm } from "../features/config/components/OTPPoliciesForm";
import { TransferLimitsForm } from "../features/config/components/TransferLimitsForm";

type ConfigSection = "limits" | "otp" | "features" | "products" | "schedule";

export function Configuration() {
  const [activeSection, setActiveSection] = useState<ConfigSection>("limits");
  const [transferLimits, setTransferLimits] = useState<any[]>([]);
  const [featureFlags, setFeatureFlags] = useState<any[]>([]);
  const [otpSettings, setOtpSettings] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [featureState, setFeatureState] = useState<Record<string, boolean>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [limitsRes, flagsRes, otpRes, productsRes, holidaysRes] = await Promise.all([
          api.get("/config/limits"),
          api.get("/config/flags"),
          api.get("/config/otp"),
          api.get("/config/products"),
          api.get("/config/holidays")
        ]);
        const extractData = (res: any) => Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        
        setTransferLimits(extractData(limitsRes));
        setFeatureFlags(extractData(flagsRes));
        setOtpSettings(extractData(otpRes));
        setProducts(extractData(productsRes));
        setHolidays(extractData(holidaysRes));
        
        const flagsData = extractData(flagsRes);
        setFeatureState(Object.fromEntries(flagsData.map((f: any) => [f.key, f.enabled])));
      } catch (error) {
        console.error("Failed to fetch configuration:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = (key: string) => {
    setPendingToggle(key);
    setShowConfirm(true);
  };

  const confirmToggle = () => {
    if (pendingToggle) {
      setFeatureState(prev => ({ ...prev, [pendingToggle]: !prev[pendingToggle] }));
    }
    setShowConfirm(false);
    setPendingToggle(null);
  };

  const sections: { key: ConfigSection; label: string }[] = [
    { key: "limits", label: "Transfer Limits" },
    { key: "otp", label: "OTP Policies" },
    { key: "features", label: "Feature Flags" },
    { key: "products", label: "Product Settings" },
    { key: "schedule", label: "Processing Schedule" },
  ];

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">Configuration changes affect live systems. All changes are logged and may require dual approval for sensitive parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Nav */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-1 h-fit">
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${activeSection === s.key ? "bg-blue-600 text-white font-medium" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === "limits" && (
            <TransferLimitsForm 
              onSave={(payload) => console.log("Saving transfer limits:", payload)}
            />
          )}

          {activeSection === "otp" && (
            <OTPPoliciesForm 
              onSave={(payload) => console.log("Saving OTP policies:", payload)} 
            />
          )}

          {activeSection === "features" && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Feature Flags</h3>
                <p className="text-xs text-gray-500 mt-0.5">Toggle features for specific environments. Changes require dual approval for production.</p>
              </div>
              <div className="p-4 space-y-3">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                ) : (Array.isArray(featureFlags) && featureFlags.length > 0) ? (
                  featureFlags.map(flag => (
                    <div key={flag.key} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{flag.name}</p>
                        <Badge label={flag.env} variant={flag.env === "Production" ? "success" : flag.env === "Staging" ? "warning" : "info"} />
                      </div>
                      <button
                        onClick={() => handleToggle(flag.key)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${featureState[flag.key] ? "bg-blue-600" : "bg-gray-300"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${featureState[flag.key] ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">No feature flags defined</div>
                )}
              </div>
            </div>
          )}

          {activeSection === "products" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Product Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
                ) : (Array.isArray(products) && products.length > 0) ? (
                  products.map(product => (
                    <div key={product.name} className="p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-semibold text-gray-700 mb-2">{product.name}</p>
                      {Array.isArray(product.fields) && product.fields.map((f: any) => (
                        <div key={f.k} className="flex justify-between text-xs py-1 border-b border-gray-100 last:border-0">
                          <span className="text-gray-500">{f.k}</span>
                          <span className="font-medium text-gray-800">{f.v}</span>
                        </div>
                      ))}
                      <button className="mt-2 text-xs text-blue-600 hover:underline">Edit settings</button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-gray-400">No products configured</div>
                )}
              </div>
            </div>
          )}

          {activeSection === "schedule" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Processing Schedule</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Working Hours", value: "08:00 — 18:00 (GMT+1)" },
                  { label: "Processing Window", value: "00:00 — 23:59 (24/7)" },
                  { label: "Batch Settlement", value: "Daily at 23:00" },
                  { label: "Statement Generation", value: "Monthly (Last day)" },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              <h4 className="font-semibold text-gray-700 mb-3">Business Holidays</h4>
              <div className="space-y-2">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
                ) : (Array.isArray(holidays) && holidays.length > 0) ? (
                  holidays.map(h => (
                    <div key={h.date} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{h.name}</p>
                        <p className="text-xs text-gray-400">{h.country}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-600">{h.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">No holidays scheduled</div>
                )}
                <button className="text-sm text-blue-600 hover:underline">+ Add Holiday</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Toggle Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <AlertTriangle size={24} className="text-amber-500 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-1">Confirm Feature Toggle</h3>
            <p className="text-sm text-gray-500 mb-4">This change will take effect immediately on the target environment. Please provide a reason for this change.</p>
            <textarea placeholder="Reason for change (required)..." className="w-full p-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 outline-none h-16 resize-none mb-4" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmToggle} className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Confirm Change</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

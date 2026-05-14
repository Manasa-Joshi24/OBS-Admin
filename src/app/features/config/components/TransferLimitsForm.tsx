import { useState } from "react";
import { Save } from "lucide-react";
import { InputField } from "../../../components/shared/InputField";
import { SettingsRow } from "../../../components/shared/SettingsRow";
import { Button } from "../../../components/shared/Button";

interface TransferLimitsFormProps {
  onSave?: (payload: any) => void;
}

export function TransferLimitsForm({ onSave }: TransferLimitsFormProps) {
  const [formData, setFormData] = useState({
    retailSingleLimit: 10000,
    retailDailyLimit: 50000,
    businessSingleLimit: 500000,
    businessDailyLimit: 2000000,
    internationalLimit: 25000,
    atmWithdrawalLimit: 2000
  });

  const handleSave = () => {
    console.log("Saving transfer limits:", formData);
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Transfer Limits</h3>
        <Button icon={Save} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
      <div className="p-4 space-y-3">
        <SettingsRow label="Single Transfer Limit (Retail)" suffix="₹">
          <InputField 
            type="number"
            value={formData.retailSingleLimit.toString()}
            onChange={(e) => setFormData({ ...formData, retailSingleLimit: parseInt(e.target.value) || 0 })}
            width="w-40"
          />
        </SettingsRow>

        <SettingsRow label="Daily Transfer Limit (Retail)" suffix="₹/day">
          <InputField 
            type="number"
            value={formData.retailDailyLimit.toString()}
            onChange={(e) => setFormData({ ...formData, retailDailyLimit: parseInt(e.target.value) || 0 })}
            width="w-40"
          />
        </SettingsRow>

        <SettingsRow label="Single Transfer Limit (Business)" suffix="₹">
          <InputField 
            type="number"
            value={formData.businessSingleLimit.toString()}
            onChange={(e) => setFormData({ ...formData, businessSingleLimit: parseInt(e.target.value) || 0 })}
            width="w-40"
          />
        </SettingsRow>

        <SettingsRow label="Daily Transfer Limit (Business)" suffix="₹/day">
          <InputField 
            type="number"
            value={formData.businessDailyLimit.toString()}
            onChange={(e) => setFormData({ ...formData, businessDailyLimit: parseInt(e.target.value) || 0 })}
            width="w-40"
          />
        </SettingsRow>

        <SettingsRow label="International Transfer Limit" suffix="₹">
          <InputField 
            type="number"
            value={formData.internationalLimit.toString()}
            onChange={(e) => setFormData({ ...formData, internationalLimit: parseInt(e.target.value) || 0 })}
            width="w-40"
          />
        </SettingsRow>

        <SettingsRow label="Cash Withdrawal Limit (ATM)" suffix="₹">
          <InputField 
            type="number"
            value={formData.atmWithdrawalLimit.toString()}
            onChange={(e) => setFormData({ ...formData, atmWithdrawalLimit: parseInt(e.target.value) || 0 })}
            width="w-40"
          />
        </SettingsRow>
      </div>
    </div>
  );
}

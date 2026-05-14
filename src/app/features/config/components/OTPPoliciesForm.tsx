import { useState } from "react";
import { PageHeader } from "../../../components/shared/PageHeader";
import { SettingsRow } from "../../../components/shared/SettingsRow";
import { InputField } from "../../../components/shared/InputField";
import { SelectField } from "../../../components/shared/SelectField";

interface OTPPoliciesFormProps {
  onSave?: (payload: any) => void;
}

export function OTPPoliciesForm({ onSave }: OTPPoliciesFormProps) {
  const [formData, setFormData] = useState({
    otpLength: 6,
    otpExpiry: 5,
    maxRetry: 3,
    cooldown: 15,
    highValueOtp: "Enabled"
  });

  const handleSave = () => {
    const payload = {
      otpLength: formData.otpLength,
      otpExpiry: formData.otpExpiry,
      maxRetry: formData.maxRetry,
      cooldown: formData.cooldown,
      highValueOtp: formData.highValueOtp === "Enabled"
    };
    
    console.log("Saving OTP policies:", payload);
    if (onSave) {
      onSave(payload);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <PageHeader title="OTP Policies" onSave={handleSave} />
      <div className="p-4 space-y-3">
        <SettingsRow label="OTP Length" suffix="digits">
          <InputField 
            type="number"
            value={formData.otpLength.toString()}
            onChange={(e) => setFormData({ ...formData, otpLength: parseInt(e.target.value) || 0 })}
            width="w-28"
          />
        </SettingsRow>
        
        <SettingsRow label="OTP Expiry" suffix="minutes">
          <InputField 
            type="number"
            value={formData.otpExpiry.toString()}
            onChange={(e) => setFormData({ ...formData, otpExpiry: parseInt(e.target.value) || 0 })}
            width="w-28"
          />
        </SettingsRow>

        <SettingsRow label="Max OTP Retry Attempts" suffix="attempts">
          <InputField 
            type="number"
            value={formData.maxRetry.toString()}
            onChange={(e) => setFormData({ ...formData, maxRetry: parseInt(e.target.value) || 0 })}
            width="w-28"
          />
        </SettingsRow>

        <SettingsRow label="OTP Cooldown Period" suffix="minutes">
          <InputField 
            type="number"
            value={formData.cooldown.toString()}
            onChange={(e) => setFormData({ ...formData, cooldown: parseInt(e.target.value) || 0 })}
            width="w-28"
          />
        </SettingsRow>

        <SettingsRow label="High-Value Transaction OTP">
          <SelectField 
            options={["Enabled", "Disabled"]}
            defaultValue={formData.highValueOtp}
            onChange={(val) => setFormData({ ...formData, highValueOtp: val })}
          />
        </SettingsRow>
      </div>
    </div>
  );
}

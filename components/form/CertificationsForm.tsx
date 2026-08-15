import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { RepeatableEntryCard } from './RepeatableEntryCard';
import { Plus } from 'lucide-react';

export const CertificationsForm: React.FC = () => {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResumeStore();
  const { certifications } = resumeData;

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-3">
        {certifications.map((cert) => (
          <RepeatableEntryCard
            key={cert.id}
            id={cert.id}
            title={cert.name || 'New Certification'}
            subtitle={cert.issuer}
            onDelete={() => removeCertification(cert.id)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Certification Name</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                  placeholder="AWS Solutions Architect"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Issuing Organization</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                  placeholder="Amazon Web Services"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Date Issued</label>
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                  placeholder="2023-04"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Credential URL (Optional)</label>
                <input
                  type="text"
                  value={cert.credentialUrl || ''}
                  onChange={(e) => updateCertification(cert.id, { credentialUrl: e.target.value })}
                  placeholder="https://aws.amazon.com/verification"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>
            </div>
          </RepeatableEntryCard>
        ))}
      </div>

      <button
        onClick={addCertification}
        type="button"
        className="w-full py-2.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-50 text-teal-700 font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Certification
      </button>
    </div>
  );
};

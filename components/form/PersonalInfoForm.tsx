import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Upload, X } from 'lucide-react';

export const PersonalInfoForm: React.FC = () => {
  const { resumeData, updatePersonalInfo, setFocusedFieldId } = useResumeStore();
  const { personalInfo } = resumeData;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updatePersonalInfo('photoUrl', '');
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Photo Upload Row */}
      <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
          {personalInfo.photoUrl ? (
            <img src={personalInfo.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-slate-400" />
          )}
        </div>

        <div className="flex-1 space-y-1">
          <p className="font-semibold text-slate-700">Profile Photo (Optional)</p>
          <p className="text-[11px] text-slate-500">Supported by Modern & Creative templates</p>

          <div className="flex items-center gap-2 pt-1">
            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium transition-colors">
              <Upload className="w-3 h-3" />
              <span>Upload Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>

            {personalInfo.photoUrl && (
              <button
                onClick={removePhoto}
                type="button"
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" /> Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="field-personalInfo-fullName"
            type="text"
            value={personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            onFocus={() => setFocusedFieldId('personalInfo.fullName')}
            onBlur={() => setFocusedFieldId(null)}
            placeholder="e.g. Alex Morgan"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 transition-all"
          />
        </div>

        {/* Professional Title */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Target Job Title</label>
          <input
            id="field-personalInfo-title"
            type="text"
            value={personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            onFocus={() => setFocusedFieldId('personalInfo.title')}
            onBlur={() => setFocusedFieldId(null)}
            placeholder="e.g. Senior Software Engineer"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 transition-all"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
          </label>
          <input
            id="field-personalInfo-email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            onFocus={() => setFocusedFieldId('personalInfo.email')}
            onBlur={() => setFocusedFieldId(null)}
            placeholder="alex.morgan@example.com"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 transition-all"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
          </label>
          <input
            id="field-personalInfo-phone"
            type="text"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            onFocus={() => setFocusedFieldId('personalInfo.phone')}
            onBlur={() => setFocusedFieldId(null)}
            placeholder="+1 (555) 234-5678"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 transition-all"
          />
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location / City
          </label>
          <input
            id="field-personalInfo-location"
            type="text"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            onFocus={() => setFocusedFieldId('personalInfo.location')}
            onBlur={() => setFocusedFieldId(null)}
            placeholder="San Francisco, CA"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 transition-all"
          />
        </div>

        {/* Website */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" /> Portfolio Website
          </label>
          <input
            id="field-personalInfo-website"
            type="text"
            value={personalInfo.website || ''}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            onFocus={() => setFocusedFieldId('personalInfo.website')}
            onBlur={() => setFocusedFieldId(null)}
            placeholder="https://alexmorgan.dev"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 transition-all"
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 flex items-center gap-1">
            <Linkedin className="w-3.5 h-3.5 text-slate-400" /> LinkedIn Profile
          </label>
          <input
            id="field-personalInfo-linkedin"
            type="text"
            value={personalInfo.linkedin || ''}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            onFocus={() => setFocusedFieldId('personalInfo.linkedin')}
            onBlur={() => setFocusedFieldId(null)}
            placeholder="linkedin.com/in/alexmorgan"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 transition-all"
          />
        </div>

        {/* GitHub */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 flex items-center gap-1">
            <Github className="w-3.5 h-3.5 text-slate-400" /> GitHub Profile
          </label>
          <input
            id="field-personalInfo-github"
            type="text"
            value={personalInfo.github || ''}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            onFocus={() => setFocusedFieldId('personalInfo.github')}
            onBlur={() => setFocusedFieldId(null)}
            placeholder="github.com/alexmorgan"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-slate-800 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

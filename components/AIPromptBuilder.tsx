
import React from 'react';
import type { WebsiteConfig } from '../types';
import { WEBSITE_TYPES, TONES, FEATURES, EXAMPLE_CONFIGS, STYLES } from '../constants';
import { Icon } from './Icons';

// FIX: Lifted state up to parent component to fix `require` error in `App.tsx` and improve state management.
// The component now receives `config` and an `onConfigChange` handler via props.
interface AIPromptBuilderProps {
  config: WebsiteConfig;
  onConfigChange: (newConfig: WebsiteConfig) => void;
  onGenerate: (config: WebsiteConfig) => void;
  isLoading: boolean;
}

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-white/5 backdrop-blur-xl border border-card-border rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:-translate-y-3 ${className}`}>
        {children}
    </div>
);

const SectionHeader: React.FC<{ icon: 'WandSparkles' | 'Star', title: string }> = ({ icon, title }) => (
    <h2 className="text-3xl font-bold text-accent flex items-center gap-4 pb-4 mb-6 border-b-2 border-accent/20 relative">
        <Icon name={icon} className="w-8 h-8"/>
        {title}
        <div className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-accent to-transparent rounded-full"></div>
    </h2>
);

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full p-4 rounded-xl border border-white/20 bg-black/25 text-white text-base transition-all duration-300 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/30" />
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} rows={4} className="w-full p-4 rounded-xl border border-white/20 bg-black/25 text-white text-base transition-all duration-300 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/30" />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full p-4 rounded-xl border border-white/20 bg-black/25 text-white text-base transition-all duration-300 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/30 appearance-none bg-no-repeat bg-right-4" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234cc9f0' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em' }}/>
);

export const AIPromptBuilder: React.FC<AIPromptBuilderProps> = ({ config, onConfigChange, onGenerate, isLoading }) => {

  const handleFeatureToggle = (feature: string) => {
    onConfigChange({
      ...config,
      features: config.features.includes(feature)
        ? config.features.filter(f => f !== feature)
        : [...config.features, feature],
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onConfigChange({...config, [name]: value});
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(config);
  }

  const loadExample = (example: Omit<WebsiteConfig, 'businessName' | 'description' | 'customCss'>) => {
      onConfigChange({
          ...config,
          ...example,
          businessName: `Example ${example.websiteType}`,
          description: `A sample description for an example ${example.websiteType} with a ${example.tone} tone.`,
          customCss: ''
      });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit}>
        <Card>
          <SectionHeader icon="WandSparkles" title="AI Website Generator" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block mb-3 text-lg text-accent-light font-medium">Business Name</label>
              <FormInput type="text" name="businessName" placeholder="e.g., 'Creative Visions Studio'" value={config.businessName} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label className="block mb-3 text-lg text-accent-light font-medium">Website Type</label>
              <FormSelect name="websiteType" value={config.websiteType} onChange={handleInputChange}>
                {WEBSITE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </FormSelect>
            </div>
            <div className="form-group md:col-span-2">
              <label className="block mb-3 text-lg text-accent-light font-medium">Brief Description</label>
              <FormTextarea name="description" placeholder="Describe your business, its purpose, and target audience." value={config.description} onChange={handleInputChange} required/>
            </div>
            <div className="form-group md:col-span-2">
              <label className="block mb-3 text-lg text-accent-light font-medium">Tone & Style</label>
              <FormSelect name="tone" value={config.tone} onChange={handleInputChange}>
                  {TONES.map(tone => <option key={tone} value={tone}>{tone}</option>)}
              </FormSelect>
            </div>
            <div className="form-group md:col-span-2">
              <label className="block mb-3 text-lg text-accent-light font-medium">Visual Theme</label>
               <FormSelect name="style" value={config.style} onChange={handleInputChange}>
                  {STYLES.map(style => <option key={style} value={style}>{style}</option>)}
              </FormSelect>
            </div>

            {config.style === 'Custom' && (
                <div className="form-group md:col-span-2">
                    <label className="block mb-3 text-lg text-accent-light font-medium">Custom CSS</label>
                    <FormTextarea 
                        name="customCss" 
                        placeholder="Enter your custom CSS here. It will be added to a <style> tag in the <head>." 
                        value={config.customCss || ''} 
                        onChange={handleInputChange} 
                        rows={6}
                    />
                </div>
            )}
            <div className="form-group md:col-span-2">
              <label className="block mb-3 text-lg text-accent-light font-medium">Features</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {FEATURES.map(feature => (
                  <div key={feature} className="relative">
                    <input
                      type="checkbox"
                      id={feature}
                      className="hidden peer"
                      checked={config.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                    />
                    <label
                      htmlFor={feature}
                      className="block p-4 bg-black/25 border border-white/15 rounded-xl text-center cursor-pointer transition-all duration-300 peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-primary-dark peer-checked:border-accent peer-checked:shadow-lg peer-checked:shadow-primary/30 peer-checked:scale-105"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="mt-8 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-dark text-white py-4 px-8 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <Icon name="WandSparkles" className="w-6 h-6"/>
                Generate Website
              </>
            )}
          </button>
        </Card>
      </form>
      
      <div className="bg-white/5 backdrop-blur-xl border border-card-border rounded-3xl p-8">
        <h2 className="text-center text-3xl font-bold text-accent mb-8">Or Start With an Example</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXAMPLE_CONFIGS.map((example, index) => (
                <div key={index} className="bg-black/25 border border-white/15 rounded-2xl p-6 transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-2">
                    <h3 className="text-xl font-semibold text-accent-light mb-2">{example.websiteType}</h3>
                    <p className="text-sm text-gray-300 mb-4">{example.tone}</p>
                    <button onClick={() => loadExample(example)} className="w-full bg-primary/80 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary">Load Example</button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

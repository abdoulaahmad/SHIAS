import { ConsentPurpose } from '../../consent/types';

export const PurposeConfig: Record<ConsentPurpose, { label: string; description: string; icon: string }> = {
  TREATMENT: {
    label: 'Medical Treatment',
    description: 'For direct clinical care and medical treatment.',
    icon: 'Stethoscope'
  },
  EMERGENCY: {
    label: 'Emergency Access',
    description: 'Break-glass access for emergency medical situations.',
    icon: 'AlertCircle'
  },
  RESEARCH: {
    label: 'Clinical Research',
    description: 'Anonymized or authorized data for clinical trials and research.',
    icon: 'Microscope'
  },
  BILLING: {
    label: 'Billing & Insurance',
    description: 'For claims processing and billing operations.',
    icon: 'Receipt'
  },
  PUBLIC_HEALTH: {
    label: 'Public Health',
    description: 'Public health reporting and epidemiology.',
    icon: 'Activity'
  },
  PATIENT_REQUEST: {
    label: 'Patient Request',
    description: 'Explicit request initiated by the patient.',
    icon: 'UserCircle'
  }
};

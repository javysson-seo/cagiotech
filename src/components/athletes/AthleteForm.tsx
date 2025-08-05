
import React from 'react';
import { AthleteFormWithDocuments } from './AthleteFormWithDocuments';

interface AthleteFormProps {
  athlete?: any;
  onSave: () => void;
  onCancel: () => void;
}

export const AthleteForm: React.FC<AthleteFormProps> = (props) => {
  return <AthleteFormWithDocuments {...props} />;
};

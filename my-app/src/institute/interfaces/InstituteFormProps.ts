import { Institute } from './Institute';

export interface InstituteFormProps {
  initialData?: Institute;
  onSubmit: (data: Partial<Institute>) => void;
  isLoading?: boolean;
}

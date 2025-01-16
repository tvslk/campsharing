import React from 'react';
import styles from './button-component.module.scss';


interface ButtonComponentProps {
  cancelLabel: string;
  submitLabel: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
}

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
  cancelLabel,
  submitLabel,
  onCancel,
  onSubmit,
  disabled = false,
}) => {
  return (
    <div className={styles.buttons}>
      <button type="button" onClick={onCancel} className={styles.cancelButton}>
        {cancelLabel}
      </button>
      <button type="button" onClick={onSubmit} className={styles.submitButton} disabled={disabled}>
        {submitLabel}
      </button>
    </div>
  );
};
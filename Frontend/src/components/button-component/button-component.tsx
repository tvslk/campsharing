import React from 'react';
import styles from './button-component.module.scss';


interface ButtonComponentProps {
  cancelLabel: string;
  submitLabel: string;
  onCancel?: () => void;
  onSubmit?: () => void;
}

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
  cancelLabel,
  submitLabel,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className={styles.buttons}>
      <button type="button" onClick={onCancel} className={styles.cancelButton}>
        {cancelLabel}
      </button>
      <button type="button" onClick={onSubmit} className={styles.submitButton}>
        {submitLabel}
      </button>
    </div>
  );
};
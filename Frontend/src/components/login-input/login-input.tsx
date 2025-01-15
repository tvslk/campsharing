import styles from "./login-input.module.scss";

export interface LoginInputProps {
  type: string;
  id: string;
  name: string;
  placeholder: string;
  iconSrc: string;
  value: string; 
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
}

export const LoginInput = ({
  type,
  id,
  name,
  placeholder,
  iconSrc,
  value,
  onChange,
}: LoginInputProps) => {
  return (
    <div className={styles.inputGroup}>
      <img src={iconSrc} alt={`${name}-icon`} className={styles.icon} />

      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className={styles.input}
        value={value} 
        onChange={onChange} 
      />
    </div>
  );
};
import styles from './BaseChat.module.scss';

type Props = {
  type: 'submit' | 'button';
  disabled?: boolean;
};

export function SendButton({ type, disabled }: Props) {
  return (
    <button type={type} disabled={disabled} className={styles.sendButton}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 5l7 7-7 7M5 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}

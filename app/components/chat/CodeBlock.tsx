import { useMemo } from 'react';
import styles from './CodeBlock.module.scss';
import { classNames } from '~/app/utils/classNames';
import { useTheme } from '~/app/lib/stores/theme';
import { Highlight } from '~/app/components/editor/codemirror/Highlight';

type Props = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language }: Props) {
  const { theme } = useTheme();
  const highlightedCode = useMemo(() => {
    if (!language) return code;
      return <Highlight code={code} language={language} />
  }, [code, language]);


  return (
    <div className={classNames(styles.codeBlock, theme === 'dark' && 'dark')}>
        {language ? (
        <span className={styles.language}>{language}</span>
      ) : null}
      <pre className={styles.code}>
        {highlightedCode}
      </pre>
    </div>
  );
}

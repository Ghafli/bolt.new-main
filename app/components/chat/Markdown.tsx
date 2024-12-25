import { useMemo } from 'react';
import styles from './Markdown.module.scss';
import { classNames } from '~/app/utils/classNames';
import { marked } from 'marked';

type Props = {
  text: string;
    className?: string;
};


export function Markdown({ text, className }: Props) {
    const html = useMemo(() => {
        return marked.parse(text)
    }, [text])

    return (
        <div className={classNames(styles.markdown, className)} dangerouslySetInnerHTML={{__html: html}}>

        </div>
    );
}

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import 'xterm/css/xterm.css';
import { useTerminal } from '~/app/lib/stores/terminal';
import { useTheme } from '~/app/lib/stores/theme';
import { getTheme } from './theme';
import styles from './Terminal.module.scss';

type TerminalProps = {
  id: string;
  className?: string;
};

export function Terminal({ id, className }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isReady, setIsReady] = useState(false);

  const { write, onData, onResize, close, clear } = useTerminal(id);
  const { theme } = useTheme();

  const createTerminal = useCallback(() => {
    if (xtermRef.current) return;

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const unicode11Addon = new Unicode11Addon();

    const xterm = new XTerm({
      theme: getTheme(theme),
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      allowProposedApi: true,
      convertEol: true,
    });

    xterm.loadAddon(fitAddon);
    xterm.loadAddon(webLinksAddon);
    xterm.loadAddon(unicode11Addon);
    xterm.open(terminalRef.current as HTMLElement);

    fitAddonRef.current = fitAddon;
    xtermRef.current = xterm;
    setIsReady(true);
  }, [theme]);

  useEffect(() => {
    createTerminal();
    return () => {
      xtermRef.current?.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
      setIsReady(false);
    };
  }, [createTerminal]);

  // resize on theme change
  useEffect(() => {
    if (!xtermRef.current) return;
    xtermRef.current.setOption('theme', getTheme(theme));
  }, [theme]);

  useLayoutEffect(() => {
    if (!isReady) return;
    const resize = () => fitAddonRef.current?.fit();

    window.addEventListener('resize', resize);
    resize();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [isReady]);

  useEffect(() => {
    if (!isReady || !xtermRef.current) return;
    const term = xtermRef.current;

    const handleData = (data: string) => {
      onData?.(data);
    };

    const handleResize = (size: { rows: number; cols: number }) => {
      onResize?.(size);
    };

    term.onData(handleData);
    term.onResize(handleResize);
    return () => {
      term.offData(handleData);
      term.offResize(handleResize);
    };
  }, [onData, onResize, isReady]);

  useEffect(() => {
    if (!isReady || !xtermRef.current) return;
    const term = xtermRef.current;

    const handleWrite = (data: string) => {
      term.write(data);
    };
    const handleClear = () => {
      term.clear();
    };
    const handleClose = () => {
      term.dispose();
      xtermRef.current = null;
      setIsReady(false);
    };

    write?.(handleWrite);
    clear?.(handleClear);
    close?.(handleClose);
  }, [write, clear, close, isReady]);

  return <div ref={terminalRef} className={className ?? styles.terminal} />;
}

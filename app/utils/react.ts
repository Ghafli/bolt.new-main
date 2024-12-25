import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

export const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useSyncedState<T>(initialState: T) {
    const [state, setState] = useState<T>(initialState);
    const ref = useRef(state);

    useEffect(() => {
        ref.current = state;
    }, [state]);

    const setSyncedState = useCallback(
        (newState: T) => {
            setState(newState);
            ref.current = newState;
        },
        [setState]
    );

    return [state, setSyncedState, ref] as const;
}

import { atom } from "nanostores";
import { getPersistedItem, persistAtom } from "../persistence";

export type PreviewState = {
  ports: Record<number, string>;
};

const initial: PreviewState = {
  ports: {},
};

export const $previews = atom<PreviewState>(getPersistedItem("previews", initial));

export const addPort = (port: number, url: string) => {
  $previews.set({
    ...$previews.get(),
    ports: {
      ...$previews.get().ports,
      [port]: url,
    },
  });
};

export const removePort = (port: number) => {
    const { [port]: _, ...rest } = $previews.get().ports;
    $previews.set({
      ...$previews.get(),
      ports: rest
    });
}


persistAtom($previews, "previews");

export type PreviewStore = typeof $previews;

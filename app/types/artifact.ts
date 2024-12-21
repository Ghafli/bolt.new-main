// app/types/artifact.ts

export interface BoltArtifactData {
  id: string;
  title: string;
}

export type ActionRunnerCallback = (token: string) => void

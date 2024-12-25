import { FunctionComponent } from "react";

export interface Props {
  content: ArrayBuffer | null | undefined;
  mimeType?: string;
}

const BinaryContent: FunctionComponent<Props> = ({ content, mimeType }) => {
  if (!content) {
    return null;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <img
        src={url}
        alt="Binary Content"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        onLoad={() => URL.revokeObjectURL(url)}
      />
    </div>
  );
};

export default BinaryContent;
